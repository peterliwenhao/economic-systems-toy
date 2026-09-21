#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 OWNER/REPOSITORY" >&2
  exit 2
fi

repository="$1"

gh label create "research-task" --repo "$repository" --color "1D76DB" --description "Shared, reviewable research task" --force
gh label create "status:proposed" --repo "$repository" --color "6E7781" --description "Needs team discussion" --force
gh label create "status:ready" --repo "$repository" --color "0E8A9E" --description "Dependencies satisfied; ready to start" --force
gh label create "status:in-progress" --repo "$repository" --color "1D76DB" --description "Actively being worked on" --force
gh label create "status:review" --repo "$repository" --color "D4A72C" --description "Waiting for collaborator review" --force
gh label create "status:blocked" --repo "$repository" --color "D73A4A" --description "Cannot proceed until blocker is resolved" --force
gh label create "status:done" --repo "$repository" --color "2DA44E" --description "Accepted and complete" --force
gh label create "priority:p0" --repo "$repository" --color "B60205" --description "Critical priority" --force
gh label create "priority:p1" --repo "$repository" --color "D93F0B" --description "High priority" --force
gh label create "priority:p2" --repo "$repository" --color "FBCA04" --description "Normal priority" --force

echo "Core collaboration labels are ready in $repository. Add module:<name> labels for this project's modules."
