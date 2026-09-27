#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let identity;
try {
  identity = JSON.parse(await readFile(resolve(root, ".codex/local-identity.json"), "utf8"));
} catch {
  console.error("尚未登记本 clone 的使用者。运行：npm run onboard -- --name <姓名>");
  process.exit(2);
}
const tasks = JSON.parse(await readFile(resolve(root, "examples/tasks.json"), "utf8"));
const assigned = tasks.filter((task) => task.owner === identity.name && task.status !== "done");
const branch = git("branch", "--show-current");

console.log(`身份：${identity.name}`);
console.log(`角色：${identity.role}`);
console.log(`当前分支：${branch || "detached HEAD"}`);
console.log(`入场文档：${identity.onboarding}`);
if (branch === "main") console.log("警告：当前在 main，禁止写操作；领取任务后切到对应任务分支。");
if (!assigned.length) {
  console.log("当前没有未完成的已分配任务。");
} else {
  console.log("分配给你的任务：");
  for (const task of assigned) console.log(`- ${task.id} [${task.status}] ${task.title} → ${task.branch}`);
}

function git(...command) {
  const result = spawnSync("git", command, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr.trim());
  return result.stdout.trim();
}
