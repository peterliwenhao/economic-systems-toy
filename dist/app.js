(function () {
  "use strict";

  const data = window.COOP_DATA;
  const app = document.querySelector("#app");
  const dialog = document.querySelector("#task-dialog");
  const toast = document.querySelector("#toast");

  const statusMeta = {
    proposed: { label: "待讨论", tone: "muted" },
    ready: { label: "可开始", tone: "cyan" },
    in_progress: { label: "进行中", tone: "blue" },
    review: { label: "待评审", tone: "amber" },
    blocked: { label: "阻塞", tone: "red" },
    done: { label: "已完成", tone: "green" }
  };

  const historyMeta = {
    proposed: { label: "提议中", tone: "muted" },
    decided: { label: "已决定", tone: "blue" },
    merged: { label: "已合并", tone: "green" }
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const badge = (label, tone) => `<span class="badge badge--${tone}">${escapeHtml(label)}</span>`;

  function setProjectMeta() {
    document.querySelectorAll("[data-project-name]").forEach((el) => { el.textContent = data.project.name; });
    document.querySelector("[data-branch]").textContent = data.project.branch;
    document.querySelector("[data-commit]").textContent = data.project.commit;
  }

  function taskCard(task) {
    const status = statusMeta[task.status] || statusMeta.proposed;
    return `
      <button class="task-card" type="button" data-task-id="${escapeHtml(task.id)}">
        <div class="task-card__top">
          <span class="task-id">${escapeHtml(task.id)}</span>
          ${badge(status.label, status.tone)}
        </div>
        <h3>${escapeHtml(task.title)}</h3>
        <p>${escapeHtml(task.goal)}</p>
        ${task.blocked ? `<div class="block-note">${escapeHtml(task.blockReason)}</div>` : ""}
        <div class="task-card__meta">
          <span>${escapeHtml(task.owner)}</span>
          <span>${escapeHtml(task.module)}</span>
          <span>${escapeHtml(task.priority)}</span>
        </div>
      </button>`;
  }

  function renderTodo(filter = "all", query = "", focusSearch = false) {
    const normalized = query.trim().toLowerCase();
    const tasks = data.tasks.filter((task) => {
      const matchesFilter = filter === "all"
        || (filter === "mine" && task.owner === "张馨月")
        || (filter === "ready" && task.status === "ready")
        || (filter === "blocked" && task.blocked)
        || task.status === filter;
      const haystack = [task.id, task.title, task.goal, task.owner, task.module].join(" ").toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
    const counts = {
      active: data.tasks.filter((item) => item.status === "in_progress").length,
      review: data.tasks.filter((item) => item.status === "review").length,
      blocked: data.tasks.filter((item) => item.blocked).length
    };

    app.innerHTML = `
      <section class="page-head">
        <div>
          <span class="eyebrow">CURRENT WORK</span>
          <h1>把研究问题变成可验证的工作</h1>
          <p>${escapeHtml(data.project.question)}</p>
        </div>
        <div class="stats" aria-label="任务统计">
          <div><strong>${counts.active}</strong><span>进行中</span></div>
          <div><strong>${counts.review}</strong><span>待评审</span></div>
          <div><strong>${counts.blocked}</strong><span>阻塞</span></div>
        </div>
      </section>
      <section class="toolbar" aria-label="任务筛选">
        <div class="filter-group">
          ${[
            ["all", "全部"], ["mine", "馨月负责"], ["ready", "可领取"],
            ["review", "待评审"], ["blocked", "阻塞"]
          ].map(([value, label]) => `<button type="button" class="filter ${filter === value ? "is-active" : ""}" data-filter="${value}">${label}</button>`).join("")}
        </div>
        <label class="search-field">
          <span class="sr-only">搜索任务</span>
          <input type="search" value="${escapeHtml(query)}" placeholder="搜索编号、任务或模块" data-task-search />
        </label>
      </section>
      <section class="task-grid" aria-label="任务列表">
        ${tasks.length ? tasks.map(taskCard).join("") : `<div class="empty-state"><strong>没有符合条件的任务</strong><span>更换筛选条件或搜索词。</span></div>`}
      </section>`;

    app.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => renderTodo(button.dataset.filter, query));
    });
    const searchInput = app.querySelector("[data-task-search]");
    searchInput.addEventListener("input", (event) => renderTodo(filter, event.target.value, true));
    if (focusSearch) {
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }
    app.querySelectorAll("[data-task-id]").forEach((button) => {
      button.addEventListener("click", () => openTask(button.dataset.taskId));
    });
  }

  function renderHistory(state = "all") {
    const entries = data.history.filter((entry) => state === "all" || entry.state === state);
    app.innerHTML = `
      <section class="page-head compact">
        <div>
          <span class="eyebrow">PROJECT MEMORY</span>
          <h1>修改有记录，决定有依据</h1>
          <p>这里保留团队认可的结论。个人探索无需全部公开。</p>
        </div>
        <div class="date-card"><span>记录更新至</span><strong>${escapeHtml(data.project.updatedAt)}</strong></div>
      </section>
      <section class="toolbar">
        <div class="filter-group">
          ${[["all", "全部"], ["proposed", "提议中"], ["decided", "已决定"], ["merged", "已合并"]]
            .map(([value, label]) => `<button type="button" class="filter ${state === value ? "is-active" : ""}" data-history-filter="${value}">${label}</button>`).join("")}
        </div>
      </section>
      <section class="timeline">
        ${entries.map((entry) => {
          const meta = historyMeta[entry.state];
          return `<article class="timeline-entry">
            <div class="timeline-date"><span>${escapeHtml(entry.date.slice(5))}</span><i></i></div>
            <div class="timeline-card">
              <div class="timeline-card__top">
                <span class="task-id">${escapeHtml(entry.id)}</span>
                ${badge(meta.label, meta.tone)}
              </div>
              <h2>${escapeHtml(entry.title)}</h2>
              <p>${escapeHtml(entry.summary)}</p>
              <dl><div><dt>原因</dt><dd>${escapeHtml(entry.reason)}</dd></div></dl>
              <div class="timeline-links">
                <span>${escapeHtml(entry.people.join(" · "))}</span>
                ${entry.links.map((link) => `<code>${escapeHtml(link)}</code>`).join("")}
              </div>
            </div>
          </article>`;
        }).join("")}
      </section>`;
    app.querySelectorAll("[data-history-filter]").forEach((button) => {
      button.addEventListener("click", () => renderHistory(button.dataset.historyFilter));
    });
  }

  function renderHelp() {
    app.innerHTML = `
      <section class="page-head compact">
        <div>
          <span class="eyebrow">TEAM PLAYBOOK</span>
          <h1>十分钟进入项目</h1>
          <p>共享项目状态，各自运行 Codex，通过 Git 汇合经过验证的成果。</p>
        </div>
      </section>
      <ol class="quickstart" aria-label="快速开始">
        ${[
          ["01", "获取仓库", "Clone 项目并创建自己的本地环境。"],
          ["02", "读取背景", "先读 AGENTS.md、项目目标和相关接口。"],
          ["03", "选择任务", "确认负责人、依赖、范围和验收条件。"],
          ["04", "创建分支", "使用 task/T-编号-简述，一项任务一个分支。"],
          ["05", "独立执行", "让自己的 Codex 在本地或独立 worktree 工作。"],
          ["06", "提交证据", "通过 PR 提交代码、检查结果、实验记录和遗留问题。"]
        ].map(([number, title, text]) => `<li><span>${number}</span><div><strong>${title}</strong><p>${text}</p></div></li>`).join("")}
      </ol>
      <section class="rule-grid">
        <article class="rule-card"><span class="rule-index">GIT</span><h2>一个任务，一个分支</h2><ul><li>不直接向主分支提交。</li><li>Commit 写明任务号和实际改动。</li><li>合并前完成检查与合作者评审。</li></ul><code>task/T-023-data-loader</code></article>
        <article class="rule-card"><span class="rule-index">CODEX</span><h2>先读约定，再改代码</h2><ul><li>从任务详情和项目文档开始。</li><li>改共享接口时同步文档与测试。</li><li>结束时列出验证结果与遗留问题。</li></ul><button class="text-button" type="button" data-copy-prompt>复制启动提示词</button></article>
        <article class="rule-card"><span class="rule-index">RUN</span><h2>每次实验都有身份证</h2><ul><li>记录 commit、数据版本、配置和种子。</li><li>输出写入唯一 run ID，不使用 latest。</li><li>把指标和产物链接回任务与 PR。</li></ul><code>runs/T-023/run-001/</code></article>
        <article class="rule-card"><span class="rule-index">DECISION</span><h2>共享结论，不共享噪声</h2><ul><li>影响团队的结论进入决策或会议记录。</li><li>明确标注提议、已决定或已生效。</li><li>个人探索和临时草稿留在个人环境。</li></ul><code>docs/decisions/D-001.md</code></article>
      </section>`;

    app.querySelector("[data-copy-prompt]").addEventListener("click", async () => {
      const prompt = "读取 AGENTS.md、docs/project.md、相关接口文档和当前任务。先检查依赖、允许修改范围与缺失信息，再给出实施计划；完成后运行规定检查并总结证据与遗留问题。";
      try {
        await navigator.clipboard.writeText(prompt);
        showToast("启动提示词已复制");
      } catch {
        showToast("无法自动复制，请从 Help 文档手动复制");
      }
    });
  }

  function openTask(id) {
    const task = data.tasks.find((item) => item.id === id);
    if (!task) return;
    const status = statusMeta[task.status] || statusMeta.proposed;
    document.querySelector("#dialog-title").textContent = `${task.id} · ${task.title}`;
    document.querySelector("#dialog-content").innerHTML = `
      <div class="dialog-badges">${badge(status.label, status.tone)}${badge(task.priority, "muted")}${badge(task.module, "muted")}</div>
      <section><h3>目标</h3><p>${escapeHtml(task.goal)}</p></section>
      ${task.blocked ? `<section class="dialog-block"><h3>阻塞原因</h3><p>${escapeHtml(task.blockReason)}</p></section>` : ""}
      <section><h3>允许修改范围</h3><div class="code-list">${task.scope.map((item) => `<code>${escapeHtml(item)}</code>`).join("")}</div></section>
      <section><h3>验收条件</h3><ul class="check-list">${task.acceptance.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      <section><h3>交付证据</h3><div class="evidence-list">${task.evidence.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div></section>
      <div class="dialog-footer"><span>负责人：<strong>${escapeHtml(task.owner)}</strong></span><code>${escapeHtml(task.branch)}</code></div>`;
    dialog.showModal();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function navigate(route) {
    const resolved = ["todo", "history", "help"].includes(route) ? route : "todo";
    document.querySelectorAll("[data-route]").forEach((tab) => {
      const active = tab.dataset.route === resolved;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if (resolved === "history") renderHistory();
    else if (resolved === "help") renderHelp();
    else renderTodo();
    document.title = `${resolved === "todo" ? "To-do list" : resolved === "history" ? "历史修改" : "Help"} · ${data.project.name}`;
    app.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-route]").forEach((tab) => {
    tab.addEventListener("click", () => { window.location.hash = tab.dataset.route; });
  });
  document.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  window.addEventListener("hashchange", () => navigate(window.location.hash.slice(1)));

  setProjectMeta();
  navigate(window.location.hash.slice(1));
})();
