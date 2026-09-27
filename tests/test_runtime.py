import json
import sys
import tempfile
import unittest
from pathlib import Path


sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from economic_toy.runtime import RunRecorder  # noqa: E402


class RunRecorderTest(unittest.TestCase):
    def test_records_config_git_state_and_metrics(self):
        repository_root = Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            config_path = root / "config.json"
            config_path.write_text(
                json.dumps({"task_id": "T-004", "seeds": [0, 1]}),
                encoding="utf-8",
            )
            recorder = RunRecorder.start(
                config_path=config_path,
                output_root=root / "runs",
                repository_root=repository_root,
                created_by="test-user",
                command="test command",
            )
            recorder.complete({"score": 1.0})

            manifest = json.loads(recorder.manifest_path.read_text(encoding="utf-8"))
            metrics = json.loads((recorder.run_dir / "metrics.json").read_text(encoding="utf-8"))
            self.assertEqual(manifest["taskId"], "T-004")
            self.assertEqual(manifest["createdBy"], "test-user")
            self.assertEqual(manifest["results"]["status"], "completed")
            self.assertEqual(metrics, {"score": 1.0})


if __name__ == "__main__":
    unittest.main()
