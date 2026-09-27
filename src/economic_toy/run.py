"""Infrastructure smoke runner; economic simulation is added after design review."""

from __future__ import annotations

import argparse
import json
import shlex
import sys
from pathlib import Path

from economic_toy.runtime import RunRecorder


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, default=Path("runs"))
    parser.add_argument("--created-by", default="unknown")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    repository_root = Path(__file__).resolve().parents[2]
    command = " ".join(shlex.quote(part) for part in sys.argv)
    recorder = RunRecorder.start(
        config_path=args.config,
        output_root=args.output_root,
        repository_root=repository_root,
        created_by=args.created_by,
        command=command,
    )
    config = json.loads(args.config.read_text(encoding="utf-8"))
    recorder.complete(
        {
            "infrastructure_smoke_ok": True,
            "configured_seed_count": len(config.get("seeds", [])),
            "note": "No economic simulation is implemented by this infrastructure smoke run.",
        }
    )
    print(recorder.run_dir)


if __name__ == "__main__":
    main()
