#!/usr/bin/env bash
set -euo pipefail

pid_file=/root/lifehub_proxy.pid

systemctl enable lifehub-proxy.service

if [[ -f "$pid_file" ]]; then
  old_pid=$(<"$pid_file")
  if [[ "$old_pid" =~ ^[0-9]+$ ]] && kill -0 "$old_pid" 2>/dev/null; then
    kill "$old_pid"
    for _ in {1..50}; do
      kill -0 "$old_pid" 2>/dev/null || break
      sleep 0.1
    done
  fi
fi

systemctl restart lifehub-proxy.service
systemctl is-active --quiet lifehub-proxy.service
