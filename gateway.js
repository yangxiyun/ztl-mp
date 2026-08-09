#!/usr/bin/env node
/**
 * MP Telegram 网关 v1 —— 手机发单 → MP 无头会话执行 → 回报推送 → symphony: 应答续跑
 *
 * 引擎：直接 spawn `claude -p`（与 ztl-symphony orchestrator.js 同款方式：
 *       --output-format json 取 session_id、prompt 走 stdin、--resume 续跑、失败回落冷启动）。
 * 环境变量：MP_TG_TOKEN（BotFather 的 token，必填）
 *          MP_TG_CHAT_ID（你的 Telegram user id，必填，白名单）
 *          MP_HOME（默认 = 本文件上级目录，即 D:\ztl-mp）
 *          CLAUDE_BIN（默认 'claude'）
 * 运行：node gateway\gateway.js   （详见 gateway\README.md）
 */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.MP_TG_TOKEN;
const CHAT_ID = String(process.env.MP_TG_CHAT_ID || '');
if (!TOKEN || !CHAT_ID) { console.error('缺环境变量 MP_TG_TOKEN / MP_TG_CHAT_ID，见 gateway/README.md'); process.exit(1); }
const API = `https://api.telegram.org/bot${TOKEN}`;
const HOME = process.env.MP_HOME || path.resolve(__dirname, '..');
const CLAUDE = process.env.CLAUDE_BIN || 'claude';
const WORKSPACES = JSON.parse(fs.readFileSync(path.join(__dirname, 'workspaces.json'), 'utf8'));
const LOG = path.join(__dirname, 'tasks.log.jsonl');
const TASK_TIMEOUT_MS = 100 * 60 * 1000; // 100 分钟熔断

const tasks = new Map(); // id -> {id,title,sessionId,status,startedAt,child}
let seq = 0;
try { // 从日志恢复编号，避免重启后 id 重复
  for (const line of fs.readFileSync(LOG, 'utf8').split('\n')) {
    const m = line.match(/"id":"T(\d+)"/); if (m) seq = Math.max(seq, Number(m[1]));
  }
} catch (_) {}

function log(ev) { fs.appendFileSync(LOG, JSON.stringify({ ts: new Date().toISOString(), ...ev }) + '\n'); }

async function tg(method, body) {
  const r = await fetch(`${API}/${method}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  return r.json();
}
async function send(text) { // Telegram 单条上限 4096，按 3800 切块
  for (let i = 0; i < text.length; i += 3800) {
    await tg('sendMessage', { chat_id: CHAT_ID, text: text.slice(i, i + 3800) });
  }
}

function claudeArgs(resumeId) {
  const a = ['-p', '--output-format', 'json', '--dangerously-skip-permissions'];
  for (const dir of Object.values(WORKSPACES)) if (fs.existsSync(dir)) a.push('--add-dir', dir);
  if (resumeId) a.push('--resume', resumeId);
  return a;
}

function runClaude(prompt, resumeId) {
  return new Promise((resolve) => {
    const child = spawn(CLAUDE, claudeArgs(resumeId), { cwd: HOME, shell: true });
    let out = '', err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', (code) => {
      try {
        const j = JSON.parse(out);
        resolve({ ok: true, text: j.result ?? out, sessionId: j.session_id, child });
      } catch (_) {
        resolve({ ok: code === 0, text: out || err || `退出码 ${code}`, sessionId: null, child });
      }
    });
    child.stdin.write(prompt); child.stdin.end();
    setTimeout(() => { try { child.kill(); } catch (_) {} }, TASK_TIMEOUT_MS);
    return child;
  });
}

function statusOf(text) { // 从 AGENT-RETURN 尾块提取状态（无则按 DONE 语义显示）
  const m = text.match(/【状态】\s*(DONE|MISSING_INPUT|GATE_CONFIRM|HUMAN_ESCALATION|ERROR)/);
  return m ? m[1] : 'DONE?';
}

async function newTask(text) {
  const id = 'T' + (++seq);
  const t = { id, title: text.slice(0, 40), sessionId: null, status: '执行中', startedAt: Date.now() };
  tasks.set(id, t);
  log({ ev: 'new', id, text });
  await send(`🧭 ${id} 已接单，MP 执行中…\n「${t.title}」`);
  const r = await runClaude(text, null);
  t.sessionId = r.sessionId; t.status = statusOf(r.text);
  log({ ev: 'done', id, status: t.status, sessionId: t.sessionId });
  await send(`【${id} · ${t.status}】\n${r.text}\n\n——续跑请回：symphony: <裁定>（默认接最近任务，指定任务用 #${id} symphony: <裁定>）`);
}

async function resumeTask(t, reply) {
  t.status = '续跑中';
  log({ ev: 'resume', id: t.id, reply });
  await send(`↩️ ${t.id} 续跑中…`);
  let r = await runClaude(reply, t.sessionId);
  if (!r.ok || !r.sessionId) { // resume 失败回落冷启动（带原委托上下文由 MP 自行找回：任务包在会话记录/git）
    await send(`⚠️ ${t.id} resume 失败，冷启动重派（原话+裁定合并下发）`);
    r = await runClaude(`【续跑】原任务：「${t.title}…」；此前你的上报待决策已获裁定：${reply}。请按裁定继续执行到底。`, null);
  }
  t.sessionId = r.sessionId || t.sessionId; t.status = statusOf(r.text);
  log({ ev: 'done', id: t.id, status: t.status });
  await send(`【${t.id} · ${t.status}】\n${r.text}`);
}

function lastOpenTask() {
  let cand = null;
  for (const t of tasks.values()) if (t.status !== 'DONE' && t.status !== 'DONE?') cand = t;
  return cand || [...tasks.values()].pop();
}

async function handle(text) {
  text = text.trim();
  if (text === '/start' || text === '/help') {
    return send('直接发任务即可（例：整理 CRCT 2026-06 资料）。\n回「symphony: 1A 2B」续跑最近任务；「#T3 symphony: …」指定任务；/status 看任务列表。');
  }
  if (text === '/status') {
    const rows = [...tasks.values()].map((t) => `${t.id} [${t.status}] ${t.title}`);
    return send(rows.length ? rows.join('\n') : '暂无任务');
  }
  const m = text.match(/^#(T\d+)\s+(.+)$/s);
  if (m) {
    const t = tasks.get(m[1]);
    return t ? resumeTask(t, m[2]) : send(`没有任务 ${m[1]}（重启后旧任务需带完整上下文重新派单）`);
  }
  if (/^symphony\s*[:：]/i.test(text)) {
    const t = lastOpenTask();
    return t ? resumeTask(t, text) : send('没有待续跑的任务，直接发新任务即可');
  }
  return newTask(text);
}

async function main() {
  console.log(`MP 网关启动：HOME=${HOME}，工作区=${Object.keys(WORKSPACES).join(',')}`);
  await send('🧭 MP 网关已上线，直接发任务。/help 看用法');
  let offset = 0;
  for (;;) {
    try {
      const r = await fetch(`${API}/getUpdates?timeout=50&offset=${offset}`);
      const j = await r.json();
      for (const u of j.result || []) {
        offset = u.update_id + 1;
        const msg = u.message;
        if (!msg || String(msg.chat.id) !== CHAT_ID || !msg.text) continue; // 白名单
        handle(msg.text).catch((e) => send('网关错误：' + e.message));
      }
    } catch (e) { console.error('poll error', e.message); await new Promise((s) => setTimeout(s, 5000)); }
  }
}
main();
