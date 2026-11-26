(function () {
  "use strict";

  const data = window.ROADMAP_DATA;
  const trackMap = new Map(data.tracks.map((track) => [track.id, track]));
  const statusLabels = {
    draft: "草案准备中/待接口对齐",
    ready: "可开始",
    in_progress: "进行中",
    review: "待验收",
    blocked: "阻塞",
    done: "已完成"
  };
  const state = { phase: "all", track: "all", status: "all" };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function allTasks() {
    return data.phases.flatMap((phase) => phase.tasks.map((task) => ({ ...task, phase })));
  }

  function renderPhaseOverview() {
    document.querySelector("#phase-overview").innerHTML = data.phases.map((phase) => `
      <article class="phase-tile">
        <span>PHASE ${phase.number}</span>
        <h3>${escapeHtml(phase.title)}</h3>
        <p>${escapeHtml(phase.summary)}</p>
        <button type="button" data-show-phase="${phase.id}">查看本阶段任务</button>
      </article>`).join("");
    document.querySelectorAll("[data-show-phase]").forEach((button) => {
      button.addEventListener("click", () => {
        state.phase = button.dataset.showPhase;
        renderFilters();
        renderDashboard();
        document.querySelector("#dashboard").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderFilters() {
    document.querySelector("#phase-filters").innerHTML = [
      ["all", "全部阶段"],
      ...data.phases.map((phase) => [phase.id, `P${phase.number}`])
    ].map(([value, label]) => `<button type="button" class="filter-button ${state.phase === value ? "is-active" : ""}" data-phase="${value}">${label}</button>`).join("");

    document.querySelectorAll("[data-phase]").forEach((button) => {
      button.addEventListener("click", () => {
        state.phase = button.dataset.phase;
        renderFilters();
        renderDashboard();
      });
    });
  }

  function renderTrackOptions() {
    const select = document.querySelector("#track-filter");
    select.innerHTML = `<option value="all">全部成员</option>${data.tracks.map((track) => `<option value="${track.id}">${escapeHtml(track.label)} · ${escapeHtml(track.name)}</option>`).join("")}`;
    select.value = state.track;
    select.addEventListener("change", () => { state.track = select.value; renderDashboard(); });
    const status = document.querySelector("#status-filter");
    status.addEventListener("change", () => { state.status = status.value; renderDashboard(); });
  }

  function filteredTasks() {
    return allTasks().filter((task) =>
      (state.phase === "all" || task.phase.id === state.phase)
      && (state.track === "all" || task.track === state.track)
      && (state.status === "all" || task.status === state.status));
  }

  function renderSummary() {
    const tasks = allTasks();
    const completed = tasks.reduce((sum, task) => sum + task.completed, 0);
    const total = tasks.reduce((sum, task) => sum + task.total, 0);
    const taskDone = tasks.filter((task) => task.status === "done").length;
    const blocked = tasks.filter((task) => task.status === "blocked").length;
    const percent = total ? Math.round(completed / total * 100) : 0;
    const cards = [
      [`${data.phases.length}`, "Phase 0 + 五个实现阶段"],
      [`${taskDone}/${tasks.length}`, "已完成任务轨"],
      [`${completed}/${total}`, `已验收交付物 · ${percent}%`],
      [`${blocked}`, "阻塞任务"]
    ];
    document.querySelector("#summary").innerHTML = cards.map(([value, label]) => `<article class="summary-card"><strong>${value}</strong><span>${label}</span></article>`).join("");
  }

  function documentLink(path) {
    if (path.endsWith(".html")) return `<a href="${encodeURI(path)}">${escapeHtml(path)}</a>`;
    return `<code>${escapeHtml(path)}</code>`;
  }

  function taskCard(task) {
    const track = trackMap.get(task.track);
    const percent = task.total ? Math.round(task.completed / task.total * 100) : 0;
    return `<article class="task-card">
      <div class="task-top">
        <span class="task-id">${escapeHtml(task.id)}</span>
        <span class="pill">P${task.phase.number}</span>
        <span class="pill ${escapeHtml(task.status)}">${escapeHtml(statusLabels[task.status] || task.status)}</span>
      </div>
      <h3>${escapeHtml(task.title)}</h3>
      <p class="track-name">${escapeHtml(track.label)} · ${escapeHtml(track.name)}</p>
      <div class="progress">
        <div class="progress-bar" aria-label="${percent}%"><i style="width:${percent}%"></i></div>
        <output>${task.completed}/${task.total}</output>
      </div>
      <details>
        <summary>职责、交付物、依赖与文档</summary>
        <h4>职责</h4>
        <ul>${task.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h4>交付物</h4>
        <ul>${task.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h4>依赖任务</h4>
        <div class="doc-links">${task.dependencies.length ? task.dependencies.map((item) => `<code>${escapeHtml(item)}</code>`).join("") : "<span>无</span>"}</div>
        <h4>相关文档</h4>
        <div class="doc-links">${task.documents.map(documentLink).join("")}</div>
      </details>
    </article>`;
  }

  function renderDashboard() {
    const tasks = filteredTasks();
    document.querySelector("#task-grid").innerHTML = tasks.length
      ? tasks.map(taskCard).join("")
      : `<div class="empty">没有符合当前筛选条件的任务。</div>`;
  }

  document.querySelector("#updated-at").textContent = data.updatedAt;
  renderPhaseOverview();
  renderFilters();
  renderTrackOptions();
  renderSummary();
  renderDashboard();
})();
