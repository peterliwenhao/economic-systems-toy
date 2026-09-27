#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith("--") || value === undefined) usage();
  args.set(key.slice(2), value);
}

const team = JSON.parse(await readFile(resolve(root, "project/team.json"), "utf8"));
const tasks = JSON.parse(await readFile(resolve(root, "examples/tasks.json"), "utf8"));
const suppliedName = args.get("name");
if (!suppliedName) usage();
const person = team.find((member) => member.aliases.includes(suppliedName));
if (!person) fail(`未知成员“${suppliedName}”。可选：${team.map((item) => item.name).join("、")}`);

git("rev-parse", "--show-toplevel");
await mkdir(resolve(root, ".codex"), { recursive: true });
await writeFile(
  resolve(root, ".codex/local-identity.json"),
  JSON.stringify(
    { name: person.name, github: person.github, role: person.role, onboarding: person.onboarding },
    null,
    2,
  ) + "\n",
  "utf8",
);
git("config", "project.collaboratorName", person.name);

const eligible = tasks.filter(
  (task) => task.owner === person.name && ["ready", "in_progress"].includes(task.status),
);
const requestedTask = args.get("task");
let selected = null;
if (requestedTask) {
  selected = eligible.find((task) => task.id === requestedTask);
  if (!selected) fail(`${person.name} 当前没有可领取的 ${requestedTask}；请检查任务负责人和状态。`);
} else if (eligible.length === 1) {
  selected = eligible[0];
} else if (eligible.length > 1) {
  console.log(`身份已登记：${person.name}`);
  console.log("有多个可领取任务，请指定一个：");
  for (const task of eligible) console.log(`  npm run onboard -- --name ${person.name} --task ${task.id}  # ${task.title}`);
  process.exit(0);
}

if (!selected) {
  console.log(`身份已登记：${person.name}`);
  console.log("当前没有分配给你的 ready/in_progress 任务；不要自行领取他人的任务，请联系李文浩。");
  process.exit(0);
}

if (git("status", "--porcelain")) fail("工作区存在未提交修改，已登记身份但不会自动切分支。请先处理或联系项目负责人。");
git("fetch", "origin", "--prune");
const branch = selected.branch;
if (!branch || branch === "main") fail(`${selected.id} 没有合法的独立任务分支。`);
const current = git("branch", "--show-current");
if (current !== branch) {
  if (gitOk("show-ref", "--verify", `refs/heads/${branch}`)) {
    git("switch", branch);
  } else if (gitOk("show-ref", "--verify", `refs/remotes/origin/${branch}`)) {
    git("switch", "--track", `origin/${branch}`);
  } else {
    git("switch", "-c", branch, "origin/main");
  }
}

console.log(`身份：${person.name}（${person.role}）`);
console.log(`已领取：${selected.id} ${selected.title}`);
console.log(`当前分支：${branch}`);
console.log(`任务说明：docs/tasks/${selected.id}.md`);
console.log("请让 Codex 先读取 AGENTS.md、身份文件、onboarding 文档和任务说明，再开始修改。");

function git(...command) {
  const result = spawnSync("git", command, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) fail(result.stderr.trim() || `git ${command.join(" ")} 失败`);
  return result.stdout.trim();
}

function gitOk(...command) {
  return spawnSync("git", command, { cwd: root, encoding: "utf8" }).status === 0;
}

function usage() {
  console.error("用法：npm run onboard -- --name <姓名> [--task T-001]");
  process.exit(2);
}

function fail(message) {
  console.error(`Onboarding failed: ${message}`);
  process.exit(1);
}
