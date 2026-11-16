#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "project/implementation-roadmap.json");
const target = resolve(root, "dist/roadmap-data.js");
const roadmap = JSON.parse(await readFile(source, "utf8"));

await writeFile(
  target,
  `/* Generated from project/implementation-roadmap.json. */\nwindow.ROADMAP_DATA = ${JSON.stringify(roadmap, null, 2)};\n`,
  "utf8"
);

const taskCount = roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
console.log(`Roadmap data generated: ${roadmap.phases.length} phases, ${taskCount} task tracks.`);
