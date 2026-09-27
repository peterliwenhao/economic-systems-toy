"""Reproducible run bookkeeping independent of economic-model semantics."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping


def _git(root: Path, *args: str) -> str:
    completed = subprocess.run(
        ["git", *args], cwd=root, check=True, capture_output=True, text=True
    )
    return completed.stdout.strip()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _write_json(path: Path, value: Mapping[str, Any]) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


@dataclass(frozen=True)
class RunRecorder:
    """Create a self-describing local run directory and finalize its metrics."""

    run_dir: Path
    manifest_path: Path

    @classmethod
    def start(
        cls,
        *,
        config_path: Path,
        output_root: Path,
        repository_root: Path,
        created_by: str,
        command: str,
    ) -> "RunRecorder":
        config = json.loads(config_path.read_text(encoding="utf-8"))
        task_id = str(config.get("task_id", "T-000"))
        task_token = task_id.replace("-", "")
        configured_id = config.get("run_id")
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        run_id = str(configured_id or f"RUN-{task_token}-{timestamp}-{os.getpid()}")
        run_dir = output_root / run_id
        run_dir.mkdir(parents=True, exist_ok=False)

        commit = _git(repository_root, "rev-parse", "HEAD")
        branch = _git(repository_root, "branch", "--show-current")
        dirty = bool(_git(repository_root, "status", "--porcelain"))
        shutil.copy2(config_path, run_dir / "config.json")
        manifest = {
            "schemaVersion": 1,
            "runId": run_id,
            "taskId": task_id,
            "createdAt": _utc_now(),
            "createdBy": created_by,
            "code": {"commit": commit, "branch": branch, "dirty": dirty},
            "execution": {"command": command, "config": str(config_path), "status": "running"},
            "results": {"status": "pending", "metricsFile": "metrics.json"},
        }
        manifest_path = run_dir / "manifest.json"
        _write_json(manifest_path, manifest)
        return cls(run_dir=run_dir, manifest_path=manifest_path)

    def complete(self, metrics: Mapping[str, Any], *, status: str = "completed") -> None:
        _write_json(self.run_dir / "metrics.json", metrics)
        manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        manifest["execution"]["finishedAt"] = _utc_now()
        manifest["execution"]["status"] = status
        manifest["results"]["status"] = status
        _write_json(self.manifest_path, manifest)
