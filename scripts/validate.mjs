#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const requiredFiles = [
  "AGENTS.md",
  "README.md",
  "dist/index.html",
  "dist/styles.css",
  "dist/app.js",
  "dist/data.js",
  "project/project.json",
  "records/history.json",
  "docs/project.md",
  "docs/interfaces.md",
  "docs/git-workflow.md",
  "experiments/manifests/RUN-000-template.json",
  ".github/ISSUE_TEMPLATE/task.yml",
  ".github/pull_request_template.md"
];

await Promise.all(requiredFiles.map(async (file) => {
  try {
    await access(resolve(root, file), constants.R_OK);
  } catch {
    errors.push(`缺少必需文件: ${file}`);
  }
}));

const readJson = async (file) => {
  try {
    return JSON.parse(await readFile(resolve(root, file), "utf8"));
  } catch (error) {
    errors.push(`${file} 不是有效 JSON: ${error.message}`);
    return null;
  }
};

const project = await readJson("project/project.json");
const tasks = await readJson("examples/tasks.json");
const history = await readJson("records/history.json");
await readJson("experiments/manifests/RUN-000-template.json");

if (project) {
  for (const key of ["name", "branch", "question", "updatedAt", "repositoryUrl"]) {
    if (!project[key]) errors.push(`project/project.json 缺少字段: ${key}`);
  }
}

const taskStatuses = new Set(["proposed", "ready", "in_progress", "review", "blocked", "done"]);
if (tasks) {
  checkUnique(tasks, "id", "examples/tasks.json");
  const taskIds = new Set(tasks.map((item) => item.id));
  for (const task of tasks) {
    for (const key of ["id", "title", "owner", "status", "goal", "scope", "acceptance", "evidence"]) {
      if (task[key] === undefined || task[key] === "") errors.push(`${task.id || "未知任务"} 缺少字段: ${key}`);
    }
    if (!/^T-\d+$/.test(task.id)) errors.push(`任务编号格式错误: ${task.id}`);
    if (!taskStatuses.has(task.status)) errors.push(`${task.id} 状态无效: ${task.status}`);
    for (const field of ["scope", "acceptance", "evidence", "dependsOn"]) {
      if (!Array.isArray(task[field])) errors.push(`${task.id}.${field} 必须是数组`);
    }
    for (const dependency of task.dependsOn || []) {
      if (!taskIds.has(dependency)) errors.push(`${task.id} 引用了不存在的示例依赖: ${dependency}`);
      if (dependency === task.id) errors.push(`${task.id} 不能依赖自身`);
    }
    if (task.status === "blocked" && !task.blockReason) errors.push(`${task.id} 被阻塞但没有 blockReason`);
  }
  detectCycles(tasks);
}

const historyStates = new Set(["proposed", "decided", "merged"]);
if (history) {
  checkUnique(history, "id", "records/history.json");
  for (const entry of history) {
    for (const key of ["id", "date", "kind", "state", "title", "summary", "reason", "people", "links"]) {
      if (entry[key] === undefined || entry[key] === "") errors.push(`${entry.id || "未知历史"} 缺少字段: ${key}`);
    }
    if (!/^H-\d+$/.test(entry.id)) errors.push(`历史编号格式错误: ${entry.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) errors.push(`${entry.id} 日期格式错误: ${entry.date}`);
    if (!historyStates.has(entry.state)) errors.push(`${entry.id} 状态无效: ${entry.state}`);
  }
}

try {
  const sandbox = { window: {} };
  vm.runInNewContext(await readFile(resolve(root, "dist/data.js"), "utf8"), sandbox, { filename: "dist/data.js" });
  if (!sandbox.window.COOP_DATA?.project || !Array.isArray(sandbox.window.COOP_DATA?.tasks) || !Array.isArray(sandbox.window.COOP_DATA?.history)) {
    errors.push("dist/data.js 没有提供有效的 window.COOP_DATA");
  }
} catch (error) {
  errors.push(`dist/data.js 无法执行: ${error.message}`);
}

try {
  const html = await readFile(resolve(root, "dist/index.html"), "utf8");
  for (const asset of ["styles.css", "data.js", "app.js"]) {
    if (!html.includes(asset)) errors.push(`dist/index.html 没有引用 ${asset}`);
  }
  for (const route of ["todo", "history", "help"]) {
    if (!html.includes(`data-route=\"${route}\"`)) errors.push(`Dashboard 缺少 ${route} 标签`);
  }
} catch {}

try {
  const agents = await readFile(resolve(root, "AGENTS.md"), "utf8");
  if (Buffer.byteLength(agents, "utf8") > 32 * 1024) errors.push("AGENTS.md 超过 Codex 默认 32 KiB 指令预算");
} catch {}

if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Validation passed: repository structure, records and Dashboard data are consistent.");

function checkUnique(items, key, source) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item[key])) errors.push(`${source} 中 ${key} 重复: ${item[key]}`);
    seen.add(item[key]);
  }
}

function detectCycles(items) {
  const graph = new Map(items.map((item) => [item.id, item.dependsOn || []]));
  const visiting = new Set();
  const visited = new Set();
  const walk = (id) => {
    if (visiting.has(id)) {
      errors.push(`示例任务依赖存在环: ${id}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of graph.get(id) || []) walk(dependency);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of graph.keys()) walk(id);
}
