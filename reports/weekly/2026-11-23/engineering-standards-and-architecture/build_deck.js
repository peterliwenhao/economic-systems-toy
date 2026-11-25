const pptxgen = require('pptxgenjs');
const detailedSpeakerNotes = require('./speaker_notes');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = '李文浩';
pptx.company = 'economic-systems-toy';
pptx.subject = '科研软件工程规范与项目整体架构';
pptx.title = '科研软件工程规范与项目整体架构';
pptx.lang = 'zh-CN';
pptx.theme = { headFontFace: 'Microsoft YaHei', bodyFontFace: 'Microsoft YaHei', lang: 'zh-CN' };

const C = {
  navy: '102A43', navy2: '173D55', teal: '12A4A6', teal2: '087F80',
  blue: '3B82C4', orange: 'F28C45', green: '2FA36B', purple: '7A6FB0', red: 'D95D5D',
  ink: '243B53', muted: '627D98', line: 'D8E2EC', paper: 'F4F7FB', white: 'FFFFFF',
  paleTeal: 'E4F5F4', paleBlue: 'E9F2F9', paleOrange: 'FFF0E4', paleGreen: 'E9F6EF', palePurple: 'F3F0FA', paleRed: 'FCEBEC'
};
const S = pptx.ShapeType;

pptx.defineSlideMaster({
  title: 'MASTER',
  background: { color: C.paper },
  objects: [
    { rect: { x: 0, y: 0, w: 13.333, h: 0.08, fill: { color: C.teal }, line: { color: C.teal } } },
  ],
  slideNumber: { x: 12.2, y: 7.12, w: 0.5, h: 0.2, fontFace: 'Aptos', fontSize: 9, color: '718096', align: 'right', margin: 0 },
});

function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, {
    x, y, w, h, margin: opts.margin === undefined ? 0 : opts.margin,
    fontFace: opts.fontFace || 'Microsoft YaHei', fontSize: opts.fontSize || 17,
    color: opts.color || C.ink, bold: opts.bold || false,
    align: opts.align || 'left', valign: opts.valign || 'mid',
    breakLine: false, fit: 'shrink', ...opts,
  });
}

function title(slide, value, kicker = '', part = '') {
  text(slide, value, 0.62, 0.61, 11.65, 0.58, { fontSize: 26, color: C.navy, bold: true });
  if (part) {
    slide.addShape(S.roundRect, { x: 11.84, y: 0.31, w: 0.85, h: 0.34, rectRadius: 0.08, fill: { color: C.navy }, line: { color: C.navy } });
    text(slide, part, 11.84, 0.31, 0.85, 0.34, { fontFace: 'Aptos', fontSize: 9.5, color: C.white, bold: true, align: 'center' });
  }
  slide.addShape(S.line, { x: 0.62, y: 1.27, w: 12.05, h: 0, line: { color: C.line, width: 1 } });
}

let speakerNoteIndex = 0;
function note(slide, purpose, points, prompt, transition) {
  const fallback = `${points.replace(/^先说明/, '')}\n\n${prompt}\n\n${transition}`;
  const body = detailedSpeakerNotes[speakerNoteIndex] || fallback;
  speakerNoteIndex += 1;
  slide.addNotes(body);
}

function card(slide, x, y, w, h, heading, body, accent = C.teal, opts = {}) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.07, fill: { color: opts.fill || C.white }, line: { color: opts.line || C.line, width: 1 }, shadow: opts.shadow === false ? undefined : { type: 'outer', color: 'AAB7C4', opacity: 0.12, blur: 1, angle: 45, distance: 1 } });
  slide.addShape(S.rect, { x, y, w: 0.075, h, fill: { color: accent }, line: { color: accent } });
  text(slide, heading, x + 0.24, y + 0.14, w - 0.42, 0.38, { fontSize: opts.titleSize || 16, color: opts.titleColor || C.navy, bold: true, valign: 'top' });
  text(slide, body, x + 0.24, y + 0.59, w - 0.42, h - 0.71, { fontSize: opts.bodySize || 12.7, color: opts.bodyColor || C.muted, valign: 'top', margin: 0.01, breakLine: false });
}

function pill(slide, value, x, y, w, color = C.teal2, fill = C.paleTeal) {
  slide.addShape(S.roundRect, { x, y, w, h: 0.34, rectRadius: 0.14, fill: { color: fill }, line: { color: fill } });
  text(slide, value, x, y, w, 0.34, { fontSize: 10.2, color, bold: true, align: 'center' });
}

function arrow(slide, x1, y1, x2, y2, color = C.muted, width = 1.5, label = '') {
  slide.addShape(S.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width, endArrowType: 'triangle' } });
  if (label) text(slide, label, Math.min(x1, x2), Math.min(y1, y2) - 0.28, Math.abs(x2 - x1) || 1.2, 0.22, { fontSize: 9.5, color, align: 'center' });
}

function code(slide, value, x, y, w, h, size = 12.5) {
  slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.05, fill: { color: C.navy }, line: { color: C.navy } });
  text(slide, value, x + 0.23, y + 0.19, w - 0.46, h - 0.38, { fontFace: 'Aptos Mono', fontSize: size, color: C.white, valign: 'top', margin: 0 });
}

function sectionSlide(number, heading, body, accent = C.teal) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(S.rect, { x: 0, y: 0, w: 13.333, h: 0.1, fill: { color: accent }, line: { color: accent } });
  text(slide, number, 0.8, 0.9, 2.3, 1.4, { fontFace: 'Aptos Display', fontSize: 62, color: accent, bold: true });
  text(slide, heading, 0.82, 2.33, 11.3, 0.85, { fontSize: 34, color: C.white, bold: true });
  text(slide, body, 0.84, 3.48, 10.8, 1.25, { fontSize: 18.5, color: 'C9D8E6', valign: 'top' });
  slide.addShape(S.line, { x: 0.84, y: 5.2, w: 3.25, h: 0, line: { color: accent, width: 4 } });
  return slide;
}

function cardGridSlide(spec) {
  const slide = pptx.addSlide('MASTER');
  title(slide, spec.title, spec.kicker, spec.part);
  const items = spec.items;
  const cols = spec.cols || 2;
  const rows = Math.ceil(items.length / cols);
  const gapX = 0.3, gapY = 0.27, left = 0.66, top = 1.55, totalW = 12.0, totalH = 5.17;
  const w = (totalW - gapX * (cols - 1)) / cols;
  const h = (totalH - gapY * (rows - 1)) / rows;
  items.forEach((d, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = left + col * (w + gapX), y = top + row * (h + gapY);
    if (spec.boxed) {
      card(slide, x, y, w, h, d[0], d[1], d[2] || C.teal, { bodySize: spec.bodySize || 12.8, titleSize: spec.titleSize || 16, fill: d[3] || C.white, shadow: spec.shadow });
    } else {
      const accent = d[2] || C.teal;
      slide.addShape(S.rect, { x, y: y + 0.05, w: 0.055, h: Math.min(0.58, h - 0.12), fill: { color: accent }, line: { color: accent } });
      text(slide, d[0], x + 0.2, y, w - 0.28, 0.42, { fontSize: (spec.titleSize || 16) + 0.8, color: C.navy, bold: true, valign: 'top' });
      text(slide, d[1], x + 0.2, y + 0.5, w - 0.28, h - 0.6, { fontSize: (spec.bodySize || 12.8) + 0.7, color: C.muted, valign: 'top', margin: 0 });
      if (row < rows - 1) slide.addShape(S.line, { x: x + 0.2, y: y + h - 0.03, w: w - 0.25, h: 0, line: { color: C.line, width: 0.8 } });
    }
  });
  note(slide, spec.notes[0], spec.notes[1], spec.notes[2], spec.notes[3]);
  return slide;
}

// Structured explanatory slides.  The old implementation concatenated every
// item into one text box with full-width Chinese brackets around the label.
// Keeping the helper lets the deck share spacing rules, while `layout` gives
// each page an information structure suited to its content.
function centeredBodySlide(spec) {
  const slide = pptx.addSlide('MASTER');
  title(slide, spec.title, spec.kicker, spec.part);
  const items = spec.items;
  const layout = spec.layout || (items.length === 3 ? 'columns' : items.length >= 6 ? 'numberedGrid' : 'quadrant');
  const bodySize = spec.bodySize || 14.0;

  if (layout === 'numberedGrid') {
    const cols = 2;
    const rows = Math.ceil(items.length / cols);
    const left = 0.82, top = 1.58, gapX = 0.5, gapY = 0.16;
    const w = 5.6, h = (5.02 - gapY * (rows - 1)) / rows;
    items.forEach((item, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = left + col * (w + gapX), y = top + row * (h + gapY);
      const accent = item[2] || C.teal;
      pill(slide, String(i + 1).padStart(2, '0'), x, y + 0.02, 0.5, C.white, accent);
      text(slide, item[0], x + 0.7, y, w - 0.7, 0.34, { fontSize: 15.2, color: C.navy, bold: true, valign: 'top' });
      text(slide, item[1], x + 0.7, y + 0.42, w - 0.78, h - 0.5, { fontSize: bodySize, color: C.muted, valign: 'top', margin: 0 });
      if (row < rows - 1) slide.addShape(S.line, { x: x + 0.7, y: y + h + 0.03, w: w - 0.78, h: 0, line: { color: C.line, width: 0.8 } });
    });
  } else if (layout === 'table') {
    const left = 0.85, top = 1.58, w = 11.65;
    const h = 5.02 / items.length;
    items.forEach((item, i) => {
      const y = top + i * h;
      const accent = item[2] || C.teal;
      if (i % 2 === 0) slide.addShape(S.rect, { x: left, y, w, h, fill: { color: 'F8FAFC' }, line: { color: 'F8FAFC' } });
      slide.addShape(S.rect, { x: left, y, w: 0.07, h, fill: { color: accent }, line: { color: accent } });
      text(slide, item[0], left + 0.28, y, 2.25, h, { fontSize: 15.3, color: C.navy, bold: true });
      text(slide, item[1], left + 2.72, y, w - 3.0, h, { fontSize: bodySize, color: C.muted, margin: 0.04 });
      if (i < items.length - 1) slide.addShape(S.line, { x: left + 0.28, y: y + h, w: w - 0.28, h: 0, line: { color: C.line, width: 0.8 } });
    });
  } else if (layout === 'steps') {
    const left = 1.02, top = 1.55, h = 5.06 / items.length;
    items.forEach((item, i) => {
      const y = top + i * h;
      const accent = item[2] || C.teal;
      pill(slide, String(i + 1), left, y + 0.1, 0.48, C.white, accent);
      if (i < items.length - 1) slide.addShape(S.line, { x: left + 0.24, y: y + 0.48, w: 0, h: h - 0.38, line: { color: C.line, width: 2 } });
      text(slide, item[0], left + 0.78, y + 0.02, 2.65, 0.36, { fontSize: 15.6, color: C.navy, bold: true, valign: 'top' });
      text(slide, item[1], left + 3.35, y + 0.02, 8.0, h - 0.15, { fontSize: bodySize, color: C.muted, valign: 'top', margin: 0 });
    });
  } else if (layout === 'scenario') {
    const left = 0.92, top = 1.62, h = 4.85 / items.length;
    items.forEach((item, i) => {
      const y = top + i * h;
      const accent = item[2] || C.teal;
      slide.addShape(S.roundRect, { x: left, y: y + 0.08, w: 2.35, h: h - 0.16, rectRadius: 0.05, fill: { color: item[3] || C.white }, line: { color: accent, width: 1.2 } });
      text(slide, item[0], left + 0.2, y + 0.08, 1.95, h - 0.16, { fontSize: 15.5, color: C.navy, bold: true, align: 'center' });
      arrow(slide, left + 2.55, y + h / 2, left + 3.08, y + h / 2, accent, 1.4);
      text(slide, item[1], left + 3.32, y + 0.08, 8.1, h - 0.16, { fontSize: bodySize, color: C.ink, margin: 0.04 });
    });
  } else if (layout === 'columns') {
    const left = 0.72, top = 1.75, gap = 0.34;
    const w = (11.89 - gap * (items.length - 1)) / items.length;
    items.forEach((item, i) => {
      const x = left + i * (w + gap);
      const accent = item[2] || C.teal;
      text(slide, String(i + 1).padStart(2, '0'), x + 0.12, top, w - 0.24, 0.56, { fontFace: 'Aptos Display', fontSize: 26, color: accent, bold: true, align: 'left' });
      slide.addShape(S.line, { x: x + 0.12, y: top + 0.7, w: w - 0.24, h: 0, line: { color: accent, width: 2.5 } });
      text(slide, item[0], x + 0.12, top + 0.96, w - 0.24, 0.5, { fontSize: 16.2, color: C.navy, bold: true, align: 'left' });
      text(slide, item[1], x + 0.12, top + 1.65, w - 0.24, 2.7, { fontSize: bodySize, color: C.muted, align: 'left', valign: 'top', margin: 0.02 });
    });
  } else {
    const cols = 2, rows = Math.ceil(items.length / cols);
    const left = 0.82, top = 1.65, gapX = 0.68, gapY = 0.38;
    const w = 5.52, h = (4.8 - gapY * (rows - 1)) / rows;
    items.forEach((item, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = left + col * (w + gapX), y = top + row * (h + gapY);
      const accent = item[2] || C.teal;
      slide.addShape(S.rect, { x, y: y + 0.02, w: 0.07, h: 0.62, fill: { color: accent }, line: { color: accent } });
      text(slide, item[0], x + 0.25, y, w - 0.25, 0.42, { fontSize: 16.0, color: C.navy, bold: true, valign: 'top' });
      text(slide, item[1], x + 0.25, y + 0.6, w - 0.34, h - 0.64, { fontSize: bodySize, color: C.muted, valign: 'top', margin: 0 });
      if (row < rows - 1) slide.addShape(S.line, { x: x + 0.25, y: y + h + 0.16, w: w - 0.34, h: 0, line: { color: C.line, width: 0.8 } });
    });
  }
  note(slide, spec.notes[0], spec.notes[1], spec.notes[2], spec.notes[3]);
  return slide;
}

// Section dividers create a clear speaking pause between the six major parts.
// They add their own notes directly, so the detailed content-note index remains
// aligned with the original 62 teaching slides.
function sectionDividerSlide(number, heading, lead, accent) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(S.rect, { x: 0, y: 0, w: 13.333, h: 0.1, fill: { color: accent }, line: { color: accent } });
  text(slide, number, 0.82, 1.05, 2.25, 1.55, { fontFace: 'Aptos Display', fontSize: 62, color: accent, bold: true, valign: 'mid' });
  slide.addShape(S.line, { x: 3.25, y: 1.15, w: 0, h: 4.55, line: { color: accent, width: 3 } });
  text(slide, heading, 3.82, 1.72, 8.45, 0.9, { fontSize: 34, color: C.white, bold: true, valign: 'mid' });
  text(slide, lead, 3.84, 3.05, 7.95, 1.25, { fontSize: 18, color: 'B9CDDC', valign: 'top', margin: 0 });
  text(slide, `PART ${number}`, 3.84, 5.55, 2.1, 0.32, { fontFace: 'Aptos', fontSize: 11, color: accent, bold: true, letterSpacing: 1.4 });
  slide.addNotes(`下面进入第 ${Number(number)} 部分：${heading}。${lead}`);
  return slide;
}

// 01 Cover: title only by request.
{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(S.rect, { x: 0, y: 0, w: 13.333, h: 0.12, fill: { color: C.teal }, line: { color: C.teal } });
  slide.addShape(S.arc, { x: 8.5, y: -0.7, w: 5.5, h: 5.5, rotate: 20, fill: { color: C.teal, transparency: 84 }, line: { color: C.teal, transparency: 100 } });
  slide.addShape(S.arc, { x: 9.7, y: 2.9, w: 4.2, h: 4.2, rotate: 190, fill: { color: C.orange, transparency: 88 }, line: { color: C.orange, transparency: 100 } });
  text(slide, '科研软件工程规范\n与项目整体架构', 0.85, 1.72, 8.4, 2.2, { fontSize: 39, color: C.white, bold: true, valign: 'top' });
  text(slide, '李文浩 · 2026', 0.88, 6.55, 3.5, 0.3, { fontFace: 'Aptos', fontSize: 11.5, color: '9BB2C3' });
  note(slide, '开场只呈现主题，让大家把注意力放在今天的共同工作方式和整体架构上。', '先说明今天包含两部分：工程规范与项目框架。工程规范会通过一个自动售货机例子讲清楚，项目框架会说明每个人的子系统如何连接。', '请大家先想一件事：自己负责的代码需要从别人那里获得什么，又需要向别人提供什么？', '下一页先给出完整目录。');
}

// 02 Contents
centeredBodySlide({ title: '课程内容', kicker: 'Contents', part: '00', bodySize: 15.0, layout: 'numberedGrid',
  items: [
    ['01 开发流程', '模块责任、接口、验证、Git 与完成定义。', C.blue],
    ['02 Python 组织', '类、对象、dataclass、Protocol、函数与测试。', C.teal],
    ['03 Toy 实践', '用自动售货机走完需求、设计、实现、测试。', C.orange],
    ['04 项目架构', 'Backbone/Engine、Decision、World、Market 与 Planning。', C.purple],
    ['05 1123 任务', '类图、模块说明、逐份提供/所需接口与系统时序。', C.green],
    ['06 分步规划', '按设计、对齐、实现、集成和实验逐步推进。', C.red],
  ],
  notes: ['给听众建立全局地图。', '六部分从工作方法走向具体代码，再回到本项目和近期安排。每一部分都围绕可连接、可验证、可合并展开。', '哪一部分是大家最陌生的？先记录，结尾再回看。', '先展开每部分涉及的知识点。'] });

// 03 Knowledge map
centeredBodySlide({ title: '详细知识点', kicker: 'Knowledge map', part: '00', bodySize: 17.0, layout: 'quadrant',
  items: [
    ['协作知识', '任务边界 · 接口输入输出 · 验收条件 · Git 分支 · Pull Request · Definition of Done', C.blue],
    ['代码知识', '职责分离 · 类与对象 · 不可变数据 · Protocol · 纯函数 · 异常语义', C.teal],
    ['测试知识', '正常用例 · 边界用例 · 非法用例 · 单元测试 · 契约测试 · 集成测试', C.orange],
    ['架构知识', '实验编排 · 决策生成 · 制度机制 · 世界结算 · 状态所有权 · 实验记录', C.purple],
  ],
  notes: ['把课程内容落到可识别的概念上。', '告诉大家这些知识点会在后面的例子和项目图中反复出现。听众无需当场记住全部术语，重点是知道遇到问题时应检查哪一类信息。', '请各位指出自己已经接触过的概念。', '进入第一部分，先讲多人开发流程。'] });

sectionDividerSlide('01', '工程协作与开发流程', '从模块责任、接口契约到 Git 评审，建立多人开发的共同工作方式。', C.blue);

// 05 process
{
  const slide = pptx.addSlide('MASTER'); title(slide, '开发流程', 'Development flow', '01');
  const labels = [['1', '明确任务'], ['2', '拆分模块'], ['3', '定义接口'], ['4', '共同定测例'], ['5', '分支实现'], ['6', '提交 PR'], ['7', '评审集成']];
  labels.forEach((d, i) => {
    const x = 0.55 + i * 1.82;
    slide.addShape(S.roundRect, { x, y: 2.35, w: 1.5, h: 1.35, rectRadius: 0.07, fill: { color: i === 6 ? C.navy : C.white }, line: { color: i === 6 ? C.navy : C.line } });
    pill(slide, d[0], x + 0.51, 2.05, 0.48, i === 6 ? C.white : C.teal2, i === 6 ? C.teal : C.paleTeal);
    text(slide, d[1], x + 0.1, 2.73, 1.3, 0.4, { fontSize: 14, color: i === 6 ? C.white : C.navy, bold: true, align: 'center' });
    if (i < labels.length - 1) arrow(slide, x + 1.52, 3.03, x + 1.78, 3.03, C.teal);
  });
  card(slide, 1.0, 4.65, 11.3, 1.08, '每一步都要留下可检查的产物', '任务说明 → 模块草图 → 接口签名与语义 → 测试用例 → 代码提交 → PR 说明 → 合并记录', C.orange, { fill: C.paleOrange, shadow: false, bodySize: 14 });
  note(slide, '展示团队每轮开发的完整闭环。', '代码实现位于流程中段。接口提供方与需要方在实现前共同确定契约测例；双方再分别补充本模块内部测试。后面的 PR 与集成决定结果能否进入共同基线。', '如果测例只由提供方决定，调用方的哪些实际假设可能被遗漏？', '接着明确每个人如何拥有一个子系统。');
}

// 06 ownership
centeredBodySlide({ title: '每个人负责一个模块', kicker: 'Subsystem ownership', part: '01', bodySize: 17.2, layout: 'quadrant',
  items: [
    ['内部设计', '决定子系统内部模块、类、函数、数据流和错误处理。', C.blue],
    ['对外接口', '提供稳定的调用入口、输入输出类型、单位、时机和失败语义。', C.teal],
    ['验证证据', '准备本模块单元测试；与接口使用方共同确定契约测例。', C.orange],
    ['交付材料', '提交代码、测试、接口文档、配置示例和 PR 说明。', C.green],
  ],
  notes: ['说明“负责一个模块”的完整含义。', '负责人设计内部实现和单元测试。对外接口的契约测例由提供方与需要方共同决定：提供方说明承诺，需要方说明实际调用场景和边界假设。', '你负责的子系统目前最可能包含哪三个内部模块？', '下面说明如何拆分内部模块。'] });

// 07 decomposition
cardGridSlide({ title: '模块内部拆分', kicker: 'Module decomposition', part: '01', cols: 3, bodySize: 11.7, boxed: true,
  items: [
    ['Input / Adapter', '接收外部对象、配置或服务响应；做格式转换。', C.blue],
    ['Domain Logic', '执行本子系统的核心规则和计算。', C.teal],
    ['State / Repository', '保存或读取本子系统拥有的数据。', C.purple],
    ['Service / Orchestrator', '按顺序调用内部组件，完成一个用例。', C.orange],
    ['Validation', '检查前置条件、单位、范围和不变量。', C.red],
    ['Events / Results', '向外返回结构化结果与可审计事件。', C.green],
  ],
  notes: ['给出通用拆分思路。', '这些名称是思考框架，可以按实际复杂度合并。关键是一个模块拥有清楚职责，公共接口位于边界，内部细节保持局部。', '你的模块里哪一部分负责状态？哪一部分只做计算？', '模块要连接起来，需要接口契约。'] });

// 08 interfaces
{
  const slide = pptx.addSlide('MASTER'); title(slide, '模块之间的接口', 'Interfaces', '01');
  card(slide, 0.75, 2.05, 3.15, 2.35, '调用方 Consumer', '提出真实调用路径\n补充边界与失败场景\n验证自己的调用假设', C.blue, { fill: C.paleBlue, shadow: false, bodySize: 14 });
  card(slide, 5.1, 1.7, 3.15, 3.05, '接口 Contract', '方法名称\n输入类型、单位与约束\n输出类型与语义\n调用时机\n失败与副作用', C.teal, { fill: C.paleTeal, shadow: false, bodySize: 14 });
  card(slide, 9.45, 2.05, 3.15, 2.35, '提供方 Provider', '说明行为承诺与不变量\n提出正常和失败语义\n实现共同确认的契约', C.orange, { fill: C.paleOrange, shadow: false, bodySize: 14 });
  arrow(slide, 3.95, 3.0, 5.0, 3.0, C.teal, 1.8, '输入');
  arrow(slide, 8.3, 3.0, 9.35, 3.0, C.teal, 1.8, '调用');
  arrow(slide, 9.35, 3.75, 8.3, 3.75, C.orange, 1.8, '结果');
  arrow(slide, 5.0, 3.75, 3.95, 3.75, C.orange, 1.8, '结果');
  text(slide, '接口属于双方的共同约定；任何变更都要同步检查生产者和消费者。', 1.15, 5.45, 11.0, 0.55, { fontSize: 17, color: C.navy, bold: true, align: 'center' });
  note(slide, '解释接口连接的双方责任。', '调用方、接口、提供方形成一个可验证关系。提供方带来行为承诺，需要方带来真实使用场景；双方共同决定契约测例，分别在自己的代码中验证同一契约。', '库存接口返回 0 时，表示商品存在但缺货，还是商品不存在？这个测例应由谁确认？', '下一页展开接口应写到什么程度。');
}

// 09 detailed interface
centeredBodySlide({ title: '完整提供接口文档（后续）', kicker: 'Mature provided interface', part: '01', bodySize: 17.0, layout: 'table',
  items: [
    ['身份与时机', '接口名、负责人、所属模块、在哪个阶段由谁调用。', C.blue],
    ['输入', '字段、类型、单位、取值范围、必填项、前置条件、示例。', C.teal],
    ['输出', '字段、类型、语义、不变量、顺序保证、示例。', C.green],
    ['失败与副作用', '异常类型、失败是否重试、是否修改状态、是否记录事件。', C.red],
  ],
  notes: ['规定提供接口的详细程度。', '接口文档要让调用方可以编写假实现并开始开发。字段名称和类型只是基础，单位、边界、失败和副作用常常决定集成能否成功。', '一个返回 `float` 的价格接口还缺少哪些关键信息？', '下面用较轻量的形式提出所需接口。'] });

// 10 required interface
centeredBodySlide({ title: '完整所需接口文档（后续）', kicker: 'Mature required interface', part: '01', bodySize: 13.8, layout: 'numberedGrid',
  items: [
    ['需要什么能力', '一句话说明希望对方完成的动作或查询。', C.blue],
    ['为什么 / 何时', '说明依赖这项能力的步骤和调用时机。', C.teal],
    ['关键数据', '列出不可缺少的字段、单位和大致形态。', C.orange],
    ['正常测例草案', '输入：A01 + round=3；\n预期：返回权限过滤后的 Observation。', C.purple],
    ['边界 / 失败草案', '空历史返回 []；未知 ID 返回 SubjectNotFound。', C.red],
    ['待对齐问题', '记录命名、边界、状态归属和需要共同确认的预期。', C.green],
  ],
  notes: ['展示后续成熟接口文档。', '正常、边界和失败测例是在首次对齐之后逐步补充的内容。1123 本周只写最小接口草案，后面会在本轮任务部分明确。', '一个成熟接口为什么需要具体输入和预期结果？', '接口需求提出后，还要统一验证信息。'] });

// 11 validation
centeredBodySlide({ title: '验证信息', kicker: 'Validation evidence', part: '01', bodySize: 16.8, layout: 'steps',
  items: [
    ['提供方提出', '行为承诺、前后条件、不变量、失败语义与可观测证据。', C.orange],
    ['需要方提出', '真实调用路径、输入组合、边界值、失败处理和容易误解的假设。', C.blue],
    ['双方共同确认', '正常、边界、非法与失败测例；每个测例的输入、预期输出和状态变化。', C.teal],
    ['各自继续补充', '提供方补内部单元测试；需要方补调用逻辑测试；共同测例进入契约测试。', C.green],
  ],
  notes: ['明确接口测例的共同责任。', '提供方最了解实现承诺，需要方最了解实际使用方式。双方共同确认契约测例，能够同时检验提供方是否履约、需要方是否正确理解并调用。内部实现细节仍由各自单元测试覆盖。', '如果一个函数只返回 None，需要方希望通过什么证据确认它完成了动作？', '把共同确认的内容整理成三类接口测例。'] });

// 12 cases
centeredBodySlide({ title: '正常、边界与非法用例', kicker: 'Test cases', part: '01', bodySize: 18.0, layout: 'columns',
  items: [
    ['正常用例', '典型输入得到预期输出，覆盖主要业务路径。', C.green, C.paleGreen],
    ['边界用例', '零值、最后一个、最大容量、空列表、轮次边界。', C.orange, C.paleOrange],
    ['非法用例', '负数、未知 ID、错误单位、状态冲突、权限不足。', C.red, C.paleRed],
  ],
  notes: ['提供最低接口测例分类。', '提供方和需要方共同选择三类测例，并共同确认预期结果。契约测试可以由公共骨架统一运行，双方也应在各自测试中覆盖相关假设。', '自动售货机购买最后一瓶水属于哪一类？提供方和需要方各关心什么？', '完成共同测例后，使用 Git 开始并行实现。'] });

// 13 git flow
{
  const slide = pptx.addSlide('MASTER'); title(slide, 'Git 工作流', 'Git workflow', '01');
  const items = [['dev', '共同开发基线', C.navy], ['task/T-xxx-name', '每人每项任务的工作区', C.blue], ['Pull Request', '说明变化与测试证据', C.orange], ['review', '检查接口、测试与影响', C.purple], ['dev', '通过后合并', C.green]];
  items.forEach((d, i) => {
    const x = 0.7 + i * 2.5;
    slide.addShape(S.roundRect, { x, y: 2.25, w: 1.95, h: 1.5, rectRadius: 0.07, fill: { color: i === 0 || i === 4 ? C.navy : C.white }, line: { color: d[2], width: 1.5 } });
    text(slide, d[0], x + 0.12, 2.55, 1.71, 0.35, { fontFace: i === 1 ? 'Aptos Mono' : 'Microsoft YaHei', fontSize: i === 1 ? 11 : 16, color: i === 0 || i === 4 ? C.white : C.navy, bold: true, align: 'center' });
    text(slide, d[1], x + 0.12, 3.02, 1.71, 0.4, { fontSize: 10.5, color: i === 0 || i === 4 ? 'C9D8E6' : C.muted, align: 'center' });
    if (i < items.length - 1) arrow(slide, x + 1.98, 3.0, x + 2.4, 3.0, C.teal);
  });
  card(slide, 1.35, 4.75, 10.65, 1.08, '会议之后的起点', '先更新 dev，再从 dev 创建新的任务分支；合并后及时同步 dev，下一项任务再创建新分支。', C.teal, { fill: C.paleTeal, shadow: false, bodySize: 14 });
  note(slide, '说明团队的 Git 主路径。', '个人任务分支提供独立工作区；PR 提供可审查的变化集合；dev 保存当前可集成版本。main 保留稳定版本和阶段里程碑。', '一项任务已经合并后，下一项任务应从哪里创建分支？', '继续明确分支规则。');
}

// 14 branch rules
centeredBodySlide({ title: '分支规则', kicker: 'Branch rules', part: '01', bodySize: 17.2, layout: 'steps',
  items: [
    ['创建', '从最新 dev 创建 task/T-编号-简短名称。', C.blue],
    ['提交', '一次提交表达一个清楚意图，消息说明做了什么。', C.teal],
    ['同步', '需要时把 dev 的最新变化合入任务分支，并在本分支解决冲突。', C.orange],
    ['保护', 'main 与 dev 通过 PR 更新；个人开发保留在任务分支。', C.red],
  ],
  notes: ['给出最小分支纪律。', '规则目标是保持历史清楚和冲突可控。解决冲突的人应理解本模块变化，并重新运行测试。长期分支要定期同步 dev。', '一次提交同时修改接口、实现和无关格式，会给评审带来什么困难？', '分支完成后用 PR 交付。'] });

// Pull Request content
centeredBodySlide({ title: 'Pull Request 内容', kicker: 'Pull Request', part: '01', bodySize: 16.8, layout: 'quadrant',
  items: [
    ['PR 描述', '任务链接 · 变化摘要 · 接口变化 · 测试命令与结果 · 已知限制 · 需要关注的问题', C.blue],
    ['接口影响', '新增或修改的接口 · 影响的调用方 · 兼容方式 · 需要同步更新的文档', C.teal],
    ['测试证据', '单元测试结果 · 双方确认的契约测例 · 集成测试结果 · 复现命令', C.green],
    ['评审关注', '契约语义 · 状态所有权 · 异常路径 · 测试覆盖 · 命名与可读性 · 兼容影响', C.purple],
  ],
  notes: ['明确 Pull Request 要包含的信息。', 'PR 是交付说明和评审入口。作者要说明改动、接口影响、测试证据和希望评审者重点关注的风险。', '评审者只看到代码差异时，还缺少哪些判断依据？', '下一页给出统一的完成标准。'] });

// Definition of Done
centeredBodySlide({ title: 'Definition of Done', kicker: 'Completion standard', part: '01', bodySize: 17.0, layout: 'steps',
  items: [
    ['范围', '实现内容符合任务范围；任务外内容已经明确排除或记录。', C.blue],
    ['契约', '接口已对齐；提供方和需要方共同确认契约测例。', C.teal],
    ['证据', '核心测试通过；文档和配置示例同步；其他成员能够运行。', C.green],
    ['合并准备', 'PR 已评审；CI 通过；后续问题已记录；合并后同步 dev。', C.orange],
  ],
  notes: ['给所有任务设置统一完成标准。', '完成意味着范围、接口、测试、文档和合并准备均已到位。内部单测由负责人维护，接口契约测例由提供方与需要方共同确认。', '如果代码能运行但接口文档过期，是否达到完成标准？', '接下来进入 Python 代码组织。'] });

sectionDividerSlide('02', 'Python 代码组织', '用类、数据对象、函数与 Protocol，把代码组织成清楚、可替换、可测试的组件。', C.teal);

// 17 requirements to code
{
  const slide = pptx.addSlide('MASTER'); title(slide, '从需求到代码', 'From requirements to code', '02');
  const steps = [['需求句子', '用户投入 3 元购买 2.5 元的水'], ['数据', '商品、请求、结果、库存'], ['规则', '找零 = 投入金额 − 价格'], ['能力', '定价、支付、库存'], ['流程', '检查 → 扣款 → 出货 → 返回'], ['测试', '正常、边界、非法']];
  steps.forEach((d, i) => {
    const y = 1.55 + i * 0.82;
    pill(slide, `${i + 1}`, 0.8, y + 0.07, 0.48, C.white, i % 2 ? C.blue : C.teal);
    text(slide, d[0], 1.48, y, 1.45, 0.45, { fontSize: 15, color: C.navy, bold: true });
    text(slide, d[1], 3.05, y, 8.95, 0.45, { fontSize: 14.2, color: C.muted });
    if (i < steps.length - 1) slide.addShape(S.line, { x: 1.03, y: y + 0.45, w: 0, h: 0.37, line: { color: C.line, width: 2 } });
  });
  note(slide, '展示从需求到实现的转换层次。', '先识别名词形成数据，识别规则形成函数，识别可替换能力形成接口，识别完整用例形成流程类，最后把需求句子写成测试场景。', '“库存不足时拒绝购买”会影响哪几层？', '先讲类和对象。');
}

// 18 class syntax
{
  const slide = pptx.addSlide('MASTER'); title(slide, '类与对象', 'Class syntax', '02');
  code(slide, `class VendingMachine(BaseMachine):
    machine_type = "vending"

    def __init__(self, machine_id: str, stock: int) -> None:
        self.machine_id = machine_id
        self._stock = stock

    def dispense(self, quantity: int = 1) -> None:
        self._stock -= quantity

machine = VendingMachine("VM-01", 3)`, 0.62, 1.48, 6.55, 5.28, 12.1);
  card(slide, 7.48, 1.48, 5.2, 1.04, '继承 Inheritance', 'BaseMachine 是父类；子类可以复用或重写父类行为。', C.purple, { fill: C.palePurple, shadow: false, titleSize: 14.2, bodySize: 11.5 });
  card(slide, 7.48, 2.7, 5.2, 1.04, '类变量 Class variable', 'machine_type 定义在方法外，由该类的对象共享。', C.blue, { fill: C.paleBlue, shadow: false, titleSize: 14.2, bodySize: 11.5 });
  card(slide, 7.48, 3.92, 5.2, 1.04, '成员变量 Instance variable', 'self.machine_id 和 self._stock 属于具体对象。', C.teal, { fill: C.paleTeal, shadow: false, titleSize: 14.2, bodySize: 11.5 });
  card(slide, 7.48, 5.14, 5.2, 1.04, '成员函数 Method', 'dispense 通过 self 读写当前对象的状态。', C.orange, { fill: C.paleOrange, shadow: false, titleSize: 14.2, bodySize: 11.5 });
  note(slide, '用一个完整的类语法例子解释继承、类变量、成员变量和成员函数。', 'VendingMachine 继承 BaseMachine。machine_type 是类变量，self.machine_id 和 self._stock 是每个对象各自拥有的成员变量，dispense 是使用 self 读写对象状态的成员函数。最后一行创建一个具体对象。', '如果再创建一台库存为 10 的售货机，两个对象的 _stock 是否会相互影响？', '下一页用 dataclass 简化主要承载数据的类。');
}

// 19 dataclass
{
  const slide = pptx.addSlide('MASTER'); title(slide, 'dataclass 语法', 'dataclass', '02');
  code(slide, `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass PurchaseRequest:\n    product_id: str\n    inserted_amount: int`, 0.75, 1.7, 5.5, 3.8, 15);
  card(slide, 6.65, 1.7, 5.9, 1.1, '自动生成', '__init__、__repr__、__eq__ 等常用方法。', C.blue, { bodySize: 13.5 });
  card(slide, 6.65, 3.02, 5.9, 1.1, '类型清楚', '字段名与类型构成接口的一部分，便于检查和阅读。', C.teal, { bodySize: 13.5 });
  card(slide, 6.65, 4.34, 5.9, 1.1, 'frozen=True', '请求创建后保持不变，降低共享数据被意外修改的风险。', C.orange, { bodySize: 13.2 });
  note(slide, '讲清 dataclass 的基本语法。', '装饰器写在 class 上方；字段使用 `名称: 类型`；frozen=True 让对象创建后保持只读。数据类适合传递请求、结果、事件和配置快照。', '这个请求还需要哪个字段才能支持购买多个商品？', '规则计算可以放在普通函数中。');
}

// 20 functions
{
  const slide = pptx.addSlide('MASTER'); title(slide, '函数', 'Functions', '02');
  code(slide, `def calculate_change(inserted: int, price: int) -> int:\n    if inserted < 0 or price <= 0:\n        raise ValueError("invalid amount")\n    if inserted < price:\n        raise ValueError("insufficient money")\n    return inserted - price`, 0.75, 1.65, 6.15, 4.55, 13.8);
  card(slide, 7.25, 1.72, 5.25, 1.2, '输入决定输出', '相同输入得到相同结果，测试非常直接。', C.green, { fill: C.paleGreen, shadow: false, bodySize: 13.5 });
  card(slide, 7.25, 3.18, 5.25, 1.2, '无隐藏状态', '函数不读取全局变量，也不偷偷修改其他对象。', C.blue, { fill: C.paleBlue, shadow: false, bodySize: 13.5 });
  card(slide, 7.25, 4.64, 5.25, 1.2, '异常表达失败', '非法输入使用明确异常，让调用方决定如何处理。', C.red, { fill: C.paleRed, shadow: false, bodySize: 13.5 });
  note(slide, '说明何时选择函数。', '计算公式、验证规则和转换逻辑通常适合函数。类型标注说明输入输出，异常说明失败语义。规则复杂后可以组合多个小函数。', '这个函数的边界用例有哪些？', '当一个类要协调多个依赖时，要控制职责范围。');
}

// 21 responsibility
cardGridSlide({ title: '类的职责', kicker: 'Responsibilities', part: '02', cols: 3, bodySize: 12, boxed: true,
  items: [
    ['Data', '保存输入、输出、事件或状态快照。', C.blue],
    ['Rule Function', '计算价格、找零、损耗、产量或健康变化。', C.green],
    ['Protocol', '约定某类能力可以如何被调用。', C.purple],
    ['Implementation', '完成 Protocol 所描述的实际行为。', C.teal],
    ['Service / Engine', '按顺序调用规则和依赖，完成一个用例。', C.orange],
    ['Repository', '拥有并管理一类状态，提供受控读写。', C.red],
  ],
  notes: ['建立常见代码角色的地图。', '这些角色可以分文件，也可以在小项目中组合。评审时检查代码是否承担了过多角色，尤其要防止流程类同时解析配置、调用服务、修改所有状态和写文件。', '自动售货机的库存应该由哪个角色拥有？', '接下来重点讲 Protocol。'] });

// 22 protocol purpose
centeredBodySlide({ title: 'Protocol 的作用', kicker: 'Protocol', part: '02', bodySize: 17.0, layout: 'quadrant',
  items: [
    ['调用方只依赖能力', 'VendingMachine 只关心对象能否提供 `price_for`、`charge`、`dispense`。', C.blue],
    ['实现可以替换', '固定价格、促销价格；真实支付、测试支付；内存库存、文件库存。', C.teal],
    ['无需显式继承', '实现类只要提供匹配的方法签名，就满足静态类型检查中的结构化约定。', C.purple],
    ['便于测试', '测试可以传入简单假实现，独立验证流程类。', C.green],
  ],
  notes: ['解释 Protocol 解决的问题。', 'Protocol 把调用方需要的最小能力写成类型。实现类可以独立开发，只要方法名称、参数和返回类型符合约定。类型检查工具可以提前发现不匹配。', '如果 VendingMachine 直接创建 FixedPricingPolicy，会给测试带来什么限制？', '下一页逐行看完整语法。'] });

// 23 protocol syntax
{
  const slide = pptx.addSlide('MASTER'); title(slide, 'Protocol 完整语法', 'Protocol syntax', '02');
  code(slide, `from typing import Protocol, runtime_checkable\n\n@runtime_checkable\nclass PricingPolicy(Protocol):\n    def price_for(self, product: Product) -> int:\n        """Return price in integer cents."""\n        ...`, 0.7, 1.55, 6.4, 4.95, 13.5);
  const rows = [
    ['Protocol', '父类，声明这是结构化接口。'],
    ['方法签名', '名称、参数类型和返回类型构成契约。'],
    ['...', '只保留接口声明，不提供业务实现。'],
    ['runtime_checkable', '允许 `isinstance(obj, PricingPolicy)` 做浅层运行时检查。'],
  ];
  rows.forEach((d, i) => card(slide, 7.45, 1.55 + i * 1.18, 5.15, 0.94, d[0], d[1], [C.blue, C.teal, C.orange, C.purple][i], { titleSize: 13.5, bodySize: 11.2, shadow: false }));
  note(slide, '逐行讲解 Protocol 语法。', '导入 Protocol；接口类继承 Protocol；方法只写签名和文档；省略号代表此处没有实现。runtime_checkable 只检查属性或方法是否存在，无法完整检查参数和返回类型，严格检查仍依赖 pyright 或 mypy。', '`isinstance` 检查通过后，能否保证方法返回的一定是 int？', '看看普通类如何满足这个协议。');
}

// 24 implementation
{
  const slide = pptx.addSlide('MASTER'); title(slide, '实现 Protocol', 'Implementation', '02');
  code(slide, `class FixedPricingPolicy:\n    def __init__(self, prices: dict[str, int]) -> None:\n        self._prices = dict(prices)\n\n    def price_for(self, product: Product) -> int:\n        return self._prices[product.product_id]`, 0.7, 1.55, 6.25, 4.8, 13.2);
  code(slide, `pricing: PricingPolicy\npricing = FixedPricingPolicy({"water": 250})\n\nprice = pricing.price_for(product)\n# price == 250`, 7.3, 1.55, 5.3, 2.9, 13.2);
  card(slide, 7.3, 4.72, 5.3, 1.35, '关键点', '变量依赖 PricingPolicy；运行时对象使用具体实现。构造函数负责把具体实现传给调用方。', C.teal, { fill: C.paleTeal, shadow: false, bodySize: 13 });
  note(slide, '展示接口和实现的连接。', 'FixedPricingPolicy 没有写 `PricingPolicy` 作为父类，也能满足结构。调用方的类型标注写接口，程序启动时再注入具体实现。这样调用方不会依赖实现内部字段。', '如果促销策略也实现 `price_for`，调用方代码需要修改吗？', '一个接口可以有多个实现。');
}

// 25 multiple implementations
{
  const slide = pptx.addSlide('MASTER'); title(slide, '多个实现', 'Replaceable implementations', '02');
  card(slide, 0.75, 2.0, 3.5, 2.5, 'FixedPricingPolicy', '从字典读取固定价格\n适合基础场景和确定性测试', C.blue, { fill: C.paleBlue, shadow: false, bodySize: 14 });
  card(slide, 4.92, 2.0, 3.5, 2.5, 'PromotionPricingPolicy', '根据活动和时间计算价格\n适合扩展业务规则', C.orange, { fill: C.paleOrange, shadow: false, bodySize: 14 });
  card(slide, 9.1, 2.0, 3.5, 2.5, 'StubPricingPolicy', '返回测试指定价格\n适合隔离流程测试', C.green, { fill: C.paleGreen, shadow: false, bodySize: 14 });
  [2.5, 6.67, 10.85].forEach(x => arrow(slide, x, 4.6, 6.67, 5.35, C.teal, 1.4));
  pill(slide, 'PricingPolicy', 5.75, 5.35, 1.85, C.white, C.teal);
  note(slide, '展示 Protocol 的可替换性。', '多个实现共享同一个调用形状。项目中可以用固定 Decision 实现运行无 LLM 基线，用 LLM Decision 实现运行实验；Engine 只依赖共同接口。测试替身帮助隔离外部服务和随机性。', '本项目里哪些能力可能同时需要确定性实现和 LLM 实现？', '最后总结编码规范和测试结构。');
}

// 26 coding standards
centeredBodySlide({ title: '编码规范', kicker: 'Coding standards', part: '02', bodySize: 17.2, layout: 'quadrant',
  items: [
    ['命名与类型', '模块、类、函数和变量表达领域含义；公共函数写类型标注。', C.blue],
    ['小而清楚', '函数聚焦一个动作；类围绕一个责任；避免隐藏全局状态。', C.teal],
    ['错误明确', '验证输入；使用具体异常；错误消息包含关键 ID 和原因。', C.red],
    ['记录可复现', '随机数来自显式 seed；配置进入运行目录；日志包含关键事件。', C.green],
  ],
  notes: ['给出团队最低编码标准。', '命名、类型、职责、异常和可复现性直接影响协作。代码注释说明原因和约束，函数名与测试名说明行为。格式化工具可以统一表面风格。', '哪一种隐藏状态最容易让实验结果无法复现？', '测试目录要与代码责任对应。'] });

// 27 tests
{
  const slide = pptx.addSlide('MASTER'); title(slide, '测试结构', 'Test structure', '02');
  const layers = [
    ['Unit', '函数与单个类', '规则、验证、边界'],
    ['Contract', '接口所有实现', '共同语义与最小行为'],
    ['Integration', '多个模块连接', '数据流、状态变化、错误传播'],
    ['End-to-End', '一轮或一个实验', '配置到结果的完整可运行性'],
  ];
  layers.forEach((d, i) => {
    const w = 10.7 - i * 1.4, x = (13.333 - w) / 2, y = 1.65 + i * 1.18;
    slide.addShape(S.roundRect, { x, y, w, h: 0.88, rectRadius: 0.06, fill: { color: [C.paleGreen, C.paleTeal, C.paleBlue, C.paleOrange][i] }, line: { color: [C.green, C.teal, C.blue, C.orange][i] } });
    text(slide, d[0], x + 0.25, y, 1.55, 0.88, { fontFace: 'Aptos', fontSize: 16, color: C.navy, bold: true });
    text(slide, d[1], x + 1.9, y, 2.65, 0.88, { fontSize: 13.5, color: C.ink, bold: true });
    text(slide, d[2], x + 4.7, y, w - 4.95, 0.88, { fontSize: 12.5, color: C.muted, align: 'right' });
  });
  note(slide, '建立测试分层。', '单元测试由各模块负责人维护；契约测例由接口提供方和需要方共同决定，公共契约测试验证双方共享的语义；集成测试检查连接；端到端测试确认一轮实验可运行。', '如果双方单元测试都通过，连接后仍然失败，首先检查哪一层？', '用自动售货机走完这套流程。');
}

sectionDividerSlide('03', 'Toy 编码实践', '用一个自动售货机例子，完整走过需求、设计、实现、运行与测试。', C.orange);

// Requirements
centeredBodySlide({ title: '需求', kicker: 'Toy example', part: '03', bodySize: 17.2, layout: 'scenario',
  items: [
    ['购买', '用户选择一种商品并投入整数金额。', C.blue],
    ['成功', '系统完成支付、出货并返回找零和交易编号。', C.green],
    ['失败', '金额不足、未知商品、缺货或支付拒绝时返回明确错误。', C.red],
    ['状态约束', '成功购买扣减一件库存；支付失败保持库存不变。', C.orange],
  ],
  notes: ['先明确 Toy 示例的业务需求。', '需求包含成功路径、失败路径和状态约束。金额统一使用整数分，以便后续实现和测试使用同一语义。', '支付失败时，库存应该发生什么变化？', '下一页给出本次演示的初始条件。'] });

// Initial conditions
centeredBodySlide({ title: '初始条件', kicker: 'Toy example', part: '03', bodySize: 17.2, layout: 'table',
  items: [
    ['商品', 'product_id="water"；名称为矿泉水。', C.blue],
    ['价格', 'FixedPricingPolicy 将 water 定价为 250 分。', C.teal],
    ['库存', 'InMemoryInventory 中 water 初始数量为 3。', C.orange],
    ['支付', 'AlwaysApprovePaymentProcessor 可正常完成支付。', C.green],
  ],
  notes: ['给出可复现的演示起点。', '商品、价格、库存和支付实现全部显式给出。任何成员使用这些条件运行，都应得到同样的结果。', '哪一个初始条件改变后，会触发缺货路径？', '下一页明确输入与预期结果。'] });

// Expected result
centeredBodySlide({ title: '预期结果', kicker: 'Toy example', part: '03', bodySize: 16.8, layout: 'table',
  items: [
    ['输入', 'PurchaseRequest(product_id="water", inserted_amount=300)', C.blue],
    ['返回', 'dispensed_quantity=1；change=50；transaction_id="TX-0001"。', C.green],
    ['状态变化', 'water 库存从 3 变为 2。', C.teal],
    ['可验证证据', 'PurchaseResult 与 inventory.quantity_of("water") 可以直接断言。', C.purple],
  ],
  notes: ['把需求转成明确的验收结果。', '输入、返回对象和状态变化都写成具体值。这些值会直接出现在演示输出和自动化测试中。', '除了返回对象，还要检查哪个状态变化？', '根据需求和结果设计架构。'] });

// 30 architecture
{
  const slide = pptx.addSlide('MASTER'); title(slide, '架构', 'Toy architecture', '03');
  card(slide, 0.7, 2.15, 2.6, 2.0, 'run_demo.py', '创建对象\n组装依赖\n发起购买', C.blue, { fill: C.paleBlue, shadow: false, bodySize: 14 });
  card(slide, 4.02, 1.75, 3.0, 2.8, 'VendingMachine', '识别商品\n检查库存\n查询价格\n调用支付\n执行出货\n返回结果', C.orange, { fill: C.paleOrange, shadow: false, bodySize: 13.5 });
  const right = [['PricingPolicy', 'FixedPricingPolicy', C.teal], ['PaymentProcessor', 'AlwaysApprove…', C.purple], ['InventoryRepository', 'InMemoryInventory', C.green]];
  right.forEach((d, i) => card(slide, 8.0, 1.35 + i * 1.65, 4.6, 1.25, d[0], d[1], d[2], { shadow: false, bodySize: 12.5 }));
  arrow(slide, 3.35, 3.15, 3.95, 3.15, C.blue, 1.8, 'purchase');
  [1.98, 3.63, 5.28].forEach((y, i) => arrow(slide, 7.05, 3.15, 7.92, y, right[i][2], 1.5));
  note(slide, '展示 Toy 的依赖关系。', 'run_demo 只负责组装和启动。VendingMachine 组织购买用例。三个 Protocol 描述定价、支付和库存能力，右侧是具体实现。内部实现可替换，购买流程保持稳定。', '哪一个模块拥有库存状态？', '查看对应文件结构。');
}

// 31 files
{
  const slide = pptx.addSlide('MASTER'); title(slide, '文件结构', 'Toy files', '03');
  code(slide, `vending_demo/\n├── README.md\n├── run_demo.py\n├── vending_machine/\n│   ├── contracts.py\n│   ├── pricing.py\n│   ├── payment.py\n│   ├── inventory.py\n│   └── machine.py\n└── tests/\n    ├── test_contracts.py\n    └── test_machine.py`, 0.75, 1.5, 5.6, 5.35, 14);
  card(slide, 6.75, 1.6, 5.75, 1.2, 'contracts.py', '公共数据对象与 Protocol。', C.purple, { bodySize: 14 });
  card(slide, 6.75, 3.02, 5.75, 1.2, '实现模块', 'pricing、payment、inventory 各自实现一类能力。', C.teal, { bodySize: 13.5 });
  card(slide, 6.75, 4.44, 5.75, 1.2, 'machine.py 与 tests', '编排购买流程；测试规则、契约和失败路径。', C.orange, { bodySize: 13.5 });
  note(slide, '把架构映射到目录。', '公共契约单独放置，具体实现按能力分文件，流程类放在 machine，测试目录与主要责任对应。README 给出运行命令。', '如果增加促销定价，应新增或修改哪个文件？', '从公共数据和协议开始看代码。');
}

// Data classes
{
  const slide = pptx.addSlide('MASTER'); title(slide, '数据类', 'Toy example', '03');
  code(slide, `@dataclass(frozen=True)\nclass Product:\n    product_id: str\n    name: str\n\n@dataclass(frozen=True)\nclass PurchaseRequest:\n    product_id: str\n    inserted_amount: int\n\n@dataclass(frozen=True)\nclass PurchaseResult:\n    product_id: str\n    dispensed_quantity: int\n    change: int\n    transaction_id: str`, 0.7, 1.45, 7.1, 5.55, 12.3);
  card(slide, 8.2, 1.65, 4.3, 1.25, 'Product', '表达商品身份和名称。', C.blue, { bodySize: 13 });
  card(slide, 8.2, 3.15, 4.3, 1.25, 'PurchaseRequest', '表达一次购买请求。', C.orange, { bodySize: 13 });
  card(slide, 8.2, 4.65, 4.3, 1.25, 'PurchaseResult', '表达出货、找零和交易编号。', C.green, { bodySize: 13 });
  note(slide, '展示 Toy 工程的公共数据对象。', '三个数据类分别表达商品、请求和结果。frozen=True 让跨模块传递的数据保持稳定，字段可直接用于断言。', '如果需要一次购买两件商品，哪个数据类需要新增字段？', '下一页展示三个能力接口。');
}

// Protocols
{
  const slide = pptx.addSlide('MASTER'); title(slide, 'Protocols', 'Toy example', '03');
  code(slide, `class PricingPolicy(Protocol):\n    def price_for(self, product: Product) -> int: ...\n\nclass PaymentProcessor(Protocol):\n    def charge(self, amount: int) -> PaymentResult: ...\n\nclass InventoryRepository(Protocol):\n    def has_stock(self, product_id: str, quantity: int = 1) -> bool: ...\n    def dispense(self, product_id: str, quantity: int = 1) -> None: ...\n    def quantity_of(self, product_id: str) -> int: ...`, 0.7, 1.5, 7.55, 5.35, 12.1);
  card(slide, 8.6, 1.55, 3.95, 1.35, 'PricingPolicy', '查询商品价格。', C.teal, { bodySize: 12.8 });
  card(slide, 8.6, 3.15, 3.95, 1.35, 'PaymentProcessor', '处理支付并返回支付结果。', C.purple, { bodySize: 12.8 });
  card(slide, 8.6, 4.75, 3.95, 1.35, 'InventoryRepository', '查询和扣减库存。', C.green, { bodySize: 12.8 });
  note(slide, '展示 Toy 工程的三个能力接口。', '三个 Protocol 分别约定定价、支付和库存能力。提供方与需要方共同确认方法语义、失败方式和契约测例。', '库存接口的默认 quantity=1 需要双方共同确认哪些边界测例？', '核心规则使用纯函数实现。');
}

// 33 rules
{
  const slide = pptx.addSlide('MASTER'); title(slide, '核心规则', 'Toy rule', '03');
  code(slide, `def calculate_change(inserted_amount: int, price: int) -> int:\n    if inserted_amount < 0 or price <= 0:\n        raise ValueError("amounts must be valid integer cents")\n    if inserted_amount < price:\n        raise ValueError("insufficient money")\n    return inserted_amount - price`, 0.8, 1.7, 7.15, 4.45, 13.4);
  card(slide, 8.35, 1.75, 4.15, 1.2, '正常', '300 − 250 = 50', C.green, { fill: C.paleGreen, shadow: false, bodySize: 14 });
  card(slide, 8.35, 3.22, 4.15, 1.2, '边界', '250 − 250 = 0', C.orange, { fill: C.paleOrange, shadow: false, bodySize: 14 });
  card(slide, 8.35, 4.69, 4.15, 1.2, '非法', '200 < 250 → ValueError', C.red, { fill: C.paleRed, shadow: false, bodySize: 14 });
  note(slide, '把规则、异常和测试场景对应起来。', '函数先保护输入范围，再检查金额是否足够，最后计算找零。金额使用整数分。三个测试分别覆盖典型值、零找零边界和金额不足。', '负价格应该在哪一行被拒绝？', '流程类会组合规则和三个接口。');
}

// 34 machine class
{
  const slide = pptx.addSlide('MASTER'); title(slide, 'VendingMachine 类', 'Toy service', '03');
  code(slide, `def purchase(self, request: PurchaseRequest) -> PurchaseResult:\n    product = self._products[request.product_id]\n    if not self._inventory.has_stock(product.product_id):\n        raise LookupError("out of stock")\n\n    price = self._pricing.price_for(product)\n    change = calculate_change(request.inserted_amount, price)\n    payment = self._payment.charge(price)\n    if not payment.approved:\n        raise RuntimeError(payment.reason)\n\n    self._inventory.dispense(product.product_id)\n    return PurchaseResult(...)`, 0.7, 1.45, 7.55, 5.55, 11.8);
  const points = [['1', '先查询，后修改'], ['2', '支付成功后出货'], ['3', '依赖通过构造函数注入'], ['4', '返回结构化结果']];
  points.forEach((d, i) => card(slide, 8.6, 1.5 + i * 1.32, 3.9, 1.04, d[0], d[1], [C.blue, C.orange, C.purple, C.green][i], { titleSize: 13, bodySize: 12, shadow: false }));
  note(slide, '讲解流程类的调用顺序。', '先读取商品和库存，再计算价格与找零，支付成功后才扣库存，最后返回结果。依赖由构造函数传入，流程可以独立测试。生产系统还会考虑支付成功后出货失败的补偿策略。', '当前顺序如何保证支付失败时库存不变？', '用序列图再看一次调用。');
}

// 35 sequence
{
  const slide = pptx.addSlide('MASTER'); title(slide, '购买顺序', 'Toy sequence', '03');
  const actors = [['Client', 1.0], ['Machine', 3.35], ['Inventory', 5.7], ['Pricing', 8.05], ['Payment', 10.4]];
  actors.forEach(d => { pill(slide, d[0], d[1], 1.55, 1.45, C.white, C.navy); slide.addShape(S.line, { x: d[1] + 0.72, y: 1.95, w: 0, h: 4.4, line: { color: C.line, width: 1, dash: 'dash' } }); });
  const events = [
    [1.72, 4.07, 2.25, 'purchase(request)', C.blue],
    [4.07, 6.42, 2.85, 'has_stock()', C.teal],
    [4.07, 8.77, 3.45, 'price_for()', C.purple],
    [4.07, 11.12, 4.05, 'charge(price)', C.orange],
    [4.07, 6.42, 4.65, 'dispense()', C.red],
    [4.07, 1.72, 5.45, 'PurchaseResult', C.green],
  ];
  events.forEach(e => arrow(slide, e[0], e[2], e[1], e[2], e[4], 1.5, e[3]));
  note(slide, '让大家看懂一个简单序列图。', '横向是参与对象，纵向是时间。Machine 依次调用库存、定价、支付和出货。箭头标签对应接口方法。项目架构中的一轮执行也会用同样方式描述。', '如果定价接口失败，后面哪些调用不会发生？', '接着把序列变成测试。');
}

// 36 tests
{
  const slide = pptx.addSlide('MASTER'); title(slide, '测试', 'Toy tests', '03');
  code(slide, `def test_purchase_dispenses_one_and_reduces_stock(self):\n    machine, inventory = make_machine()\n\n    result = machine.purchase(\n        PurchaseRequest("water", 300)\n    )\n\n    self.assertEqual(result.dispensed_quantity, 1)\n    self.assertEqual(result.change, 50)\n    self.assertEqual(inventory.quantity_of("water"), 1)`, 0.7, 1.55, 7.15, 5.1, 12.5);
  card(slide, 8.2, 1.7, 4.35, 1.2, 'Arrange', '创建商品、价格、支付、库存和售货机。', C.blue, { bodySize: 12.5 });
  card(slide, 8.2, 3.15, 4.35, 1.2, 'Act', '提交一个 PurchaseRequest。', C.orange, { bodySize: 12.5 });
  card(slide, 8.2, 4.6, 4.35, 1.2, 'Assert', '检查出货、找零和剩余库存。', C.green, { bodySize: 12.5 });
  note(slide, '讲解 Arrange-Act-Assert 测试结构。', '测试先准备依赖，再执行一个动作，最后检查返回值和状态。每个测试聚焦一个场景，测试名完整描述行为。共享构造放在 make_machine 中。', '支付失败测试除了检查异常，还要检查什么？', '展示实际运行结果和练习。');
}

// Live run
centeredBodySlide({ title: '现场运行', kicker: 'Toy example', part: '03', bodySize: 15.8, layout: 'quadrant',
  items: [
    ['运行演示', '`python run_demo.py`\n返回商品 water、出货 1、找零 50、交易号 TX-0001；剩余库存 2。', C.green, C.paleGreen],
    ['运行测试', '`python -m unittest discover -s tests -v`\n共 9 个测试，覆盖协议、规则、正常购买与失败路径。', C.blue, C.paleBlue],
    ['演示输出', 'PurchaseResult(product_id="water", dispensed_quantity=1, change=50, transaction_id="TX-0001")', C.orange],
    ['测试输出', 'Ran 9 tests；全部通过；支付失败测试同时确认库存保持不变。', C.purple],
  ],
  notes: ['用真实运行结果验证前面的设计。', '代码已经随课件交付。现场先运行演示，再运行测试；输出应与预期结果完全一致。', '如果输出中的剩余库存不是 2，应从哪个模块开始检查？', '下一页布置一个小练习。'] });

// Exercise
centeredBodySlide({ title: '练习', kicker: 'Toy example', part: '03', bodySize: 17.0, layout: 'steps',
  items: [
    ['任务', '增加 PromotionPricingPolicy：water 打九折。', C.orange],
    ['保持不变', 'PricingPolicy、VendingMachine 和现有调用方式保持稳定。', C.blue],
    ['共同测例', '提供方和需要方共同确认折后价格、找零、边界金额与旧行为。', C.teal],
    ['验收标准', '新增实现通过契约检查；旧测试继续通过；新增折扣测试。', C.green],
  ],
  notes: ['用小改动练习 Protocol 和契约测试。', '新增一个定价实现，同时保持公共接口和购买流程不变。定价提供方与 VendingMachine 使用方共同确定折扣测例。', '新增折扣策略需要改动哪些文件？', '回到本项目，把同样方法映射到整体架构。'] });

sectionDividerSlide('04', '项目整体架构', '从 Engine 的主动编排出发，理解 Decision、World、Market 与 Planning 怎样连接。', C.purple);

// 39 components
cardGridSlide({ title: '核心组件', kicker: 'System components', part: '04', cols: 3, bodySize: 11.2, boxed: true,
  items: [
    ['Backbone / Engine', '配置解析、公共契约、运行编排、组件组装、终止与集成。', C.orange],
    ['Decision / LLM', '按 Context 运行规则或模型决策，返回结构化结果。', C.purple],
    ['Decision Memory', '保存决策经历、摘要与查询记录；权威状态仍由 World 维护。', C.purple],
    ['World', '初始化、权威物理状态、规则校验与确定性结算。', C.teal],
    ['Market / Firm', '商品市场、分散劳动市场、企业问题与 Lange 市场反馈。', C.blue],
    ['Planning', 'Cockshott、Lange 中央方与集中式劳动分配。', C.red],
  ],
  notes: ['先介绍组件词汇。', 'Backbone 与 Engine 负责主动组织，World 负责权威物理状态，Decision、Market 和 Planning 提供领域能力。', '哪个组件负责决定调用顺序，哪个组件负责真正修改库存？', '下一页用整体图展示调用关系。'] });

// 40 architecture diagram — system architecture first. Ownership is explained
// on the following slide, while this page focuses on layers and runtime flow.
{
  const slide = pptx.addSlide('MASTER'); title(slide, '整体架构图', 'Architecture', '04');
  const region = (x, y, w, h, heading, accent) => {
    slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.line, width: 1 } });
    slide.addShape(S.rect, { x, y, w, h: 0.055, fill: { color: accent }, line: { color: accent } });
    text(slide, heading, x + 0.16, y + 0.13, w - 0.32, 0.24, { fontFace: 'Aptos', fontSize: 10.6, color: C.navy, bold: true, align: 'left' });
    slide.addShape(S.line, { x: x + 0.16, y: y + 0.47, w: w - 0.32, h: 0, line: { color: C.line, width: 0.8 } });
  };
  const moduleBox = (x, y, w, h, heading, accent, opts = {}) => {
    const fill = opts.emphasis ? accent : (opts.fill || C.paper);
    const ink = opts.emphasis ? C.white : C.navy;
    slide.addShape(S.roundRect, { x, y, w, h, rectRadius: 0.04, fill: { color: fill }, line: { color: accent, width: opts.emphasis ? 1.2 : 0.8 } });
    text(slide, heading, x + 0.05, y + 0.06, w - 0.10, h - 0.12, { fontFace: 'Aptos', fontSize: opts.titleSize || 8.5, color: ink, bold: true, align: 'center' });
  };

  // Top: scenario inputs and common runtime skeleton.
  region(0.55, 1.42, 3.55, 1.22, 'CONFIGURATION & SCENARIO', C.teal2);
  const configNodes = [
    [0.72, 'World\nDefinition', 6.7], [1.39, 'Init\nSpec', 6.7], [2.06, 'Realized\nInstance', 6.7],
    [2.73, 'Treatment', 6.7], [3.40, 'Resolved\nScenario', 6.7],
  ];
  configNodes.forEach((d, i) => {
    moduleBox(d[0], 2.00, 0.57, 0.42, d[1], C.teal2, { titleSize: d[2], fill: C.paleTeal });
    if (i < configNodes.length - 1) arrow(slide, d[0] + 0.58, 2.21, configNodes[i + 1][0] - 0.02, 2.21, C.teal2, 0.9);
  });

  region(4.30, 1.42, 8.48, 1.22, 'COMMON SKELETON', C.orange);
  moduleBox(4.50, 1.96, 1.15, 0.50, 'Experiment\nRunner', C.orange, { titleSize: 8.0, fill: C.paleOrange });
  moduleBox(5.88, 1.91, 1.28, 0.60, 'Simulation\nEngine', C.orange, { titleSize: 8.5, emphasis: true });
  moduleBox(7.40, 1.96, 0.94, 0.50, 'Public\nContracts', C.orange, { titleSize: 7.8, fill: C.paleOrange });
  moduleBox(8.62, 1.96, 2.38, 0.50, 'Decision · Market\nPlanning · World Ports', C.orange, { titleSize: 7.2, fill: C.paleOrange });
  moduleBox(11.30, 1.96, 1.18, 0.50, 'RoundResult', C.orange, { titleSize: 8.0, fill: C.paleOrange });
  arrow(slide, 4.10, 2.18, 4.48, 2.18, C.teal2, 1.0);
  arrow(slide, 5.65, 2.21, 5.86, 2.21, C.orange, 1.0);
  arrow(slide, 7.16, 2.21, 8.60, 2.21, C.orange, 1.0);
  arrow(slide, 8.34, 2.21, 8.60, 2.21, C.orange, 1.0);

  // Middle: three runtime subsystems, matching the original diagram and HTML architecture.
  region(0.55, 2.91, 3.78, 2.00, 'DECISION / LLM / MEMORY', C.purple);
  moduleBox(0.75, 3.45, 1.25, 0.50, 'Context Builder', C.purple, { titleSize: 8.1, fill: C.palePurple });
  moduleBox(2.20, 3.45, 0.90, 0.50, 'Decision\nRouter', C.purple, { titleSize: 7.7, fill: C.palePurple });
  moduleBox(0.85, 4.20, 1.15, 0.47, 'Rule / Optimization', C.purple, { titleSize: 7.2, fill: C.palePurple });
  moduleBox(2.18, 4.20, 0.92, 0.47, 'LLM Decision', C.purple, { titleSize: 7.7, fill: C.palePurple });
  moduleBox(3.17, 3.80, 0.96, 0.64, 'Action /\nReport', C.purple, { titleSize: 7.7, fill: C.palePurple });
  arrow(slide, 2.00, 3.70, 2.18, 3.70, C.purple, 0.9);
  arrow(slide, 2.65, 3.95, 1.42, 4.18, C.purple, 0.9);
  arrow(slide, 2.65, 3.95, 2.64, 4.18, C.purple, 0.9);
  arrow(slide, 2.00, 4.43, 3.15, 4.12, C.purple, 0.9);
  arrow(slide, 3.10, 4.43, 3.15, 4.12, C.purple, 0.9);

  region(4.55, 2.91, 4.15, 2.00, 'MARKET & PLANNING', C.blue);
  moduleBox(4.73, 3.45, 1.15, 0.50, 'Market / Firm', C.blue, { titleSize: 8.0, fill: C.paleBlue });
  moduleBox(6.08, 3.45, 1.15, 0.50, 'Lange Board', C.red, { titleSize: 8.0, fill: C.paleRed });
  moduleBox(4.73, 4.20, 1.15, 0.47, 'Cockshott Planner', C.red, { titleSize: 7.4, fill: C.paleRed });
  moduleBox(6.08, 4.20, 1.15, 0.47, 'Labor Mechanisms', C.blue, { titleSize: 7.3, fill: C.paleBlue });
  moduleBox(7.42, 3.80, 1.08, 0.64, 'Coordination\nResult', C.blue, { titleSize: 7.6, fill: C.paleBlue });
  slide.addShape(S.line, { x: 5.88, y: 3.70, w: 0.20, h: 0, line: { color: C.red, width: 1.0, beginArrowType: 'triangle', endArrowType: 'triangle', dash: 'dash' } });
  arrow(slide, 5.88, 3.70, 7.40, 4.10, C.blue, 0.9);
  arrow(slide, 7.23, 3.70, 7.40, 4.10, C.red, 0.9);
  arrow(slide, 5.88, 4.43, 7.40, 4.10, C.red, 0.9);
  arrow(slide, 7.23, 4.43, 7.40, 4.10, C.blue, 0.9);

  region(8.93, 2.91, 3.85, 2.00, 'WORLD', C.teal);
  moduleBox(9.10, 3.45, 1.10, 0.50, 'WorldState', C.teal, { titleSize: 8.1, fill: C.paleTeal });
  moduleBox(10.37, 3.45, 1.18, 0.50, 'Validators', C.teal, { titleSize: 8.1, fill: C.paleTeal });
  moduleBox(11.72, 3.45, 0.86, 0.50, 'Settlement', C.teal, { titleSize: 7.5, fill: C.paleTeal });
  moduleBox(9.75, 4.20, 1.50, 0.47, 'Invariant Checks', C.teal, { titleSize: 7.8, fill: C.paleTeal });
  moduleBox(11.44, 4.20, 1.14, 0.47, 'Next State +\nRoundResult', C.teal, { titleSize: 7.0, fill: C.paleTeal });
  arrow(slide, 10.20, 3.70, 10.35, 3.70, C.teal, 0.9);
  arrow(slide, 11.55, 3.70, 11.70, 3.70, C.teal, 0.9);
  arrow(slide, 12.15, 3.95, 10.50, 4.18, C.teal, 0.9);
  arrow(slide, 11.25, 4.43, 11.42, 4.43, C.teal, 0.9);

  // Engine orchestrates the three subsystems; details of ownership belong on the next slide.
  slide.addShape(S.line, { x: 6.52, y: 2.51, w: 0, h: 0.22, line: { color: C.orange, width: 1.2, beginArrowType: 'triangle', endArrowType: 'triangle' } });
  slide.addShape(S.line, { x: 2.45, y: 2.73, w: 8.40, h: 0, line: { color: C.orange, width: 1.0 } });
  [2.45, 6.62, 10.85].forEach(x => slide.addShape(S.line, { x, y: 2.73, w: 0, h: 0.18, line: { color: C.orange, width: 1.0, beginArrowType: 'triangle', endArrowType: 'triangle' } }));

  // Bottom: one-round dataflow replaces the former storage band.
  region(0.55, 5.18, 12.23, 1.30, 'ENGINE-ORCHESTRATED ROUND', C.green);
  const roundFlow = [
    [0.83, 'Observation', C.purple], [3.20, 'Action / Report', C.purple],
    [5.57, 'CoordinationResult', C.blue], [7.94, 'World Settlement', C.teal],
    [10.31, 'RoundResult', C.green],
  ];
  roundFlow.forEach((d, i) => {
    moduleBox(d[0], 5.78, 1.68, 0.48, d[1], d[2], { titleSize: 8.2, fill: C.white });
    if (i < roundFlow.length - 1) arrow(slide, d[0] + 1.70, 6.02, roundFlow[i + 1][0] - 0.03, 6.02, C.muted, 1.0);
  });
  note(slide, '说明系统分层和一轮运行的数据流。', '上层把世界定义、初始化、具体实例和实验处理解析成 Resolved Scenario，再由 Experiment Runner 启动 Simulation Engine。公共契约和四类 Ports 规定 Engine 怎样调用 Decision、Market/Planning 与 World。中层三个子系统分别产生主体行动、协调结果和下一版权威状态。下层用一条数据流概括一轮：Observation 进入 Decision，形成 Action，经过机制协调后交给 World 结算，最终返回 RoundResult。负责人分工放在下一页说明，不作为这张架构图的主结构。', '一轮中哪个对象进入 World 结算，哪个对象代表结算后的结果？', '下一页再把架构组件映射到负责人。');
}

// 41 responsibilities
cardGridSlide({ title: '组件职责', kicker: 'Five responsibility domains', part: '04', cols: 2, bodySize: 10.9, boxed: true,
  items: [
    ['张馨月 · Backbone / Engine', '公共契约、配置、运行编排、产物、系统时序、接口对齐和最终集成。', C.orange],
    ['杜芃烨 · Decision / LLM / Memory', 'Decision、Harness/Context/Tools、Model Adapter、结构化 Action 与决策记忆。', C.purple],
    ['张津阁 · World', '世界初始化、权威 WorldState、规则校验、确定性结算和守恒检查。', C.teal],
    ['王逸忱 · Market / Firm', '商品市场、分散式劳动力市场、企业决策问题、价格与 Lange 市场反馈。', C.blue],
    ['郝依琳 · Planning', 'Cockshott、Lange 中央方、集中式劳动分配与相应计划结果。', C.red],
  ],
  notes: ['明确五个责任域与负责人。', '张馨月负责公共骨架和主动编排，四位成员分别负责 Decision、World、Market/Firm 与 Planning。', '你的责任域首先需要和哪两个责任域对齐？', '下面看一次实验如何启动。'] });

// 42 startup
{
  const slide = pptx.addSlide('MASTER'); title(slide, '实验启动', 'Experiment startup', '04');
  const steps = [['1', '读取配置', '世界、初始化、制度、模型、seed'], ['2', '校验配置', 'schema、单位、ID、范围'], ['3', '初始化', 'agents、facilities、inventories'], ['4', '组装组件', 'Decision、Market/Planning、World'], ['5', '创建运行目录', 'run_id、config snapshot、metadata'], ['6', 'Engine 推进', 'run_round() × N'], ['7', '完成或失败', 'final state、metrics、status']];
  steps.forEach((d, i) => {
    const x = 0.48 + i * 1.82;
    pill(slide, d[0], x + 0.55, 1.55, 0.48, C.white, [C.blue, C.blue, C.teal, C.purple, C.orange, C.green, C.navy][i]);
    card(slide, x, 2.05, 1.57, 2.55, d[1], d[2], [C.blue, C.blue, C.teal, C.purple, C.orange, C.green, C.navy][i], { titleSize: 13.5, bodySize: 10.5, shadow: false });
    if (i < steps.length - 1) arrow(slide, x + 1.59, 3.25, x + 1.78, 3.25, C.teal);
  });
  card(slide, 1.3, 5.25, 10.75, 0.95, '失败也要形成完整记录', '配置错误、外部调用失败或不变量破坏时，保存阶段、原因、已完成事件和最后可信快照。', C.red, { fill: C.paleRed, shadow: false, bodySize: 13 });
  note(slide, '说明 Runner 的生命周期。', '实验启动包括配置校验、世界初始化、依赖组装、运行目录创建、轮次循环和终止记录。失败运行同样是研究证据。', '如果配置中的 agent_id 重复，应该在哪一步发现？', '启动流程明确后，下面说明各位成员负责的子系统。');
}

// 44 Decision / LLM
cardGridSlide({ title: 'Decision / LLM / Memory', kicker: '杜芃烨', part: '04', cols: 2, bodySize: 11.1, boxed: true,
  items: [
    ['Decision Layer', '每种 Context 对应一个决策任务；返回结构化 Action 或明确失败。', C.blue],
    ['Harness / Context / Tools', '组装其他模块提供的信息，管理工具查询、预算、重试和调用轨迹。', C.purple],
    ['Model Adapter', '统一 API、本地模型、规则模型和测试替身的调用方式。', C.teal],
    ['Structured Action', '解析并校验模型输出，转换为公共 Action；不直接修改 WorldState。', C.orange],
    ['Decision Memory', '保存决策相关经历、摘要和查询记录；权威事实仍来自 World 或领域模块。', C.red],
    ['Rule Baseline', '提供固定或规则 Decision，支持无 LLM 的确定性基线。', C.green],
  ],
  notes: ['细化 Decision 子系统。', '其他领域负责人定义经济问题和需要的 Context，杜芃烨负责通用决策执行、模型适配和 Memory。', '企业决策的问题含义由谁定义，通用 LLM 调用由谁提供？', '公共骨架负责连接所有子系统。'] });

// 45 backbone
cardGridSlide({ title: '公共 Backbone', kicker: 'Coordinator · 张馨月', part: '04', cols: 2, bodySize: 11.6, boxed: true,
  items: [
    ['Contracts', '公共 dataclass、Protocol、枚举、异常、版本和字段语义。', C.purple],
    ['Config', '配置 schema、解析、校验、默认值和 typed config。', C.blue],
    ['Engine', 'ExperimentRunner、组件注入、轮次循环、终止和最小 CLI。', C.orange],
    ['Empty Interfaces', '四个领域模块的空接口，用固定结果跑通一轮。', C.teal],
    ['System Sequence', '画出 Engine 如何依次调用四个领域模块，并标明关键输入和输出。', C.green],
    ['Integration', '汇总接口对齐结果，组织合版、冲突解决、回归测试和版本记录。', C.red],
  ],
  notes: ['细化公共骨架与统筹责任。', 'Backbone 提供共同语言和最小可运行路径。接口提供方与需要方共同决定契约测例；张馨月负责整理公共版本、把共同测例落实为契约测试基础设施，并组织最终集成。', '公共 Action 数据类应由哪个位置定义和版本化？', '世界与 Engine 负责确定性状态演化。'] });

// 46 world
cardGridSlide({ title: 'World 子系统', kicker: '张津阁', part: '04', cols: 2, bodySize: 11.6, boxed: true,
  items: [
    ['World Initialization', '根据初始化参数创建主体、设施、地图、库存、岗位和初始状态。', C.blue],
    ['State Views', '依据权限和时机从 WorldState 生成其他模块所需的只读数据。', C.purple],
    ['Action Validation', '检查主体、地点、权限、时间、输入资源、容量和数据范围。', C.orange],
    ['Settlement Pipeline', '生产、成熟、分配、运输、消费、健康的确定性结算。', C.teal],
    ['State & Events', '维护唯一可信状态，产出可审计的状态变化事件。', C.green],
    ['Invariants', '库存守恒、非负、容量上限、seed 可复现和极小手算案例。', C.red],
  ],
  notes: ['细化 World。', 'World 对所有制度共享并维护权威物理状态；Engine 只负责安排调用。State Views 与 Decision、Market 和 Planning 都需要对齐。', '运输损耗在哪个模块结算？其他模块需要提交哪些信息？', '市场模块负责价格和交易形成。'] });

// 47 market
cardGridSlide({ title: 'Market / Firm 子系统', kicker: '王逸忱', part: '04', cols: 2, bodySize: 11.0, boxed: true,
  items: [
    ['Commodity Markets', '粮食、铁等商品订单、价格、数量、匹配、出清和未成交结果。', C.blue],
    ['Decentralized Labor Market', '市场经济中的劳动供需、岗位申请、匹配与未匹配结果。', C.purple],
    ['Firm Decisions', '定义企业要决定什么、需要哪些 Context；通用 LLM 执行由 Decision 提供。', C.teal],
    ['Settlement Result', '向 Engine 提交交易或劳动配置结果，不直接修改 WorldState。', C.orange],
    ['Lange Market Feedback', '在试探价格下返回供需、成交和超额需求，供 Planning 更新价格。', C.green],
    ['Evidence', '记录价格、成交量、未成交订单、劳动匹配和极小手算案例。', C.red],
  ],
  notes: ['细化市场子系统。', '市场模块处理订单到成交决策，Engine 验证并完成实物结算。由于 Lange 后续会使用市场试错信息，价格和超额需求接口要保持清楚、可扩展。', '订单匹配完成后，为什么仍要由 Engine 验证交易？', '最后看计划与劳动匹配子系统。'] });

// 48 planning
cardGridSlide({ title: 'Planning 子系统', kicker: '郝依琳', part: '04', cols: 2, bodySize: 11.0, boxed: true,
  items: [
    ['Lange Coordinator', '维护试算价格，读取超额需求，按规则更新价格并输出配置建议。', C.orange],
    ['Cockshott Planner', '读取实物需求、技术系数、库存和能力，生成静态生产与调拨计划。', C.red],
    ['Central Labor Allocation', '按计划经济规则，根据技能、健康、地点和岗位需求集中分配劳动。', C.purple],
    ['Planning Inputs', '明确从 World、Market 与 Decision 获得的状态摘要、报告和需求。', C.blue],
    ['Planning Results', '返回价格、生产目标、调拨、配给和集中劳动安排。', C.teal],
    ['Validation Cases', '极小手算案例；供需平衡、资源不足、岗位缺口和不可行计划。', C.green],
  ],
  notes: ['细化 Planning。', '初期先实现静态规则。Lange 中央方由郝依琳负责，市场反馈由王逸忱负责；集中式劳动分配与分散式劳动力市场是两套机制。', 'Lange 的一次价格试探需要 Market 返回哪些信息？', '五个责任域明确后，下面进入阶段推进方式。'] });

// Five-phase integrated development path
{
  const slide = pptx.addSlide('MASTER'); title(slide, '五阶段综合推进方式', 'Integrated development path', '04');
  slide.addShape(S.roundRect, { x: 0.72, y: 1.45, w: 11.9, h: 0.72, rectRadius: 0.06, fill: { color: C.navy }, line: { color: C.navy } });
  pill(slide, 'Phase 0', 0.95, 1.64, 1.05, C.white, C.teal);
  text(slide, '1123 设计草案：类图 + 模块说明 + 逐份提供 / 所需接口 → 张馨月时序图 → 首次对齐', 2.22, 1.45, 9.95, 0.72, { fontSize: 12.5, color: C.white, bold: true });

  const phases = [
    ['Phase 1', '公共骨架', '配置解析\n公共数据结构\n空接口 · 固定一轮', C.blue],
    ['Phase 2', '确定性世界', '初始化与多轮运行\n生产 · 运输\n消费 · 健康\n守恒与可复现', C.teal],
    ['Phase 3', '简化机制', 'Market · Lange\nCockshott · Labor\nMatching · 极小案例', C.orange],
    ['Phase 4', '接入 LLM', 'Observation · Prompt · Memory\n结构化 Action\n预算与失败处理', C.purple],
    ['Phase 5', '正式实验', '多 seed · 公平信息\n冲击 · 消融 · 置信区间\n失败轨迹与成本', C.green],
  ];
  phases.forEach((d, i) => {
    const x = 0.48 + i * 2.55;
    pill(slide, d[0], x + 0.55, 2.58, 1.15, C.white, d[3]);
    card(slide, x, 3.08, 2.22, 2.8, d[1], d[2], d[3], { fill: C.white, shadow: false, titleSize: 15, bodySize: 10.7 });
    if (i < phases.length - 1) arrow(slide, x + 2.24, 4.48, x + 2.48, 4.48, C.teal, 1.7);
  });
  text(slide, '阶段门槛：上一阶段的最小结果可运行、可验证、可记录，下一阶段再增加新的复杂度。', 1.05, 6.35, 11.25, 0.42, { fontSize: 14.5, color: C.navy, bold: true, align: 'center' });
  note(slide, '把项目从接口对齐到正式实验串成一条综合推进路径。', 'Phase 0 是进入开发前的准备。Phase 1 先形成公共骨架；Phase 2 固定行为并验证物理世界；Phase 3 接入三个制度方向的简化机制；Phase 4 加入 LLM 决策；Phase 5 才进行多 seed、冲击和消融实验。每个阶段都以前一阶段的稳定产物为基础。', '如果确定性世界还没有通过守恒测试，是否适合立即接入 LLM？', '下面把当前工作落到本轮任务。');
}

sectionDividerSlide('05', '本轮任务与接口对齐', '把类图、模块运作说明和接口草案整理成可以共同讨论、逐份对齐的产物。', C.green);

// 52 core assignment
{
  const slide = pptx.addSlide('MASTER'); title(slide, '1123 本轮核心任务', 'Current assignment', '05');
  text(slide, '本轮先把“模块怎样工作、怎样与别人连接”讲清楚，再进入接口对齐。', 0.82, 1.48, 11.75, 0.48, { fontSize: 17, color: C.navy, bold: true });
  const tasks = [
    ['01', '类图草案', '画出本模块主要类、数据类和关系。类名使用 PascalCase；这是一版可讨论草案，允许在接口会上修改。', C.blue],
    ['02', '模块运作说明', '说明内部构成、核心流程和模块边界。材料可用 PPT、HTML、Markdown，也可以配图口头说明。', C.teal],
    ['03', '逐份提供接口草案', '每个准备提供的接口单独写明用途、提供方、调用方、Python 签名、输入、输出和待确认问题。', C.green],
    ['04', '逐份所需接口草案', '每个希望获得的能力单独成文，说明调用背景、关键数据、初步测例与待对齐问题，便于与提供方逐份匹配。', C.orange],
  ];
  tasks.forEach((d, i) => {
    const y = 2.18 + i * 1.02;
    pill(slide, d[0], 0.86, y + 0.04, 0.62, C.white, d[3]);
    text(slide, d[1], 1.78, y, 2.35, 0.39, { fontSize: 15.8, color: C.navy, bold: true, valign: 'top' });
    text(slide, d[2], 4.18, y, 8.05, 0.69, { fontSize: 13.2, color: C.muted, valign: 'top', margin: 0 });
    if (i < tasks.length - 1) slide.addShape(S.line, { x: 1.78, y: y + 0.78, w: 10.45, h: 0, line: { color: C.line, width: 0.8 } });
  });
  text(slide, '张馨月另行整理系统时序图；本轮产物用于讨论和对齐，不要求直接提交功能代码。', 1.15, 6.42, 11.05, 0.42, { fontSize: 13.5, color: C.teal2, bold: true, align: 'center' });
  note(slide, '明确 1123 本轮统一作业。', '每位负责人完成四项交付，张馨月另外完成系统时序图。本周不要求测试、样例、最终字段或功能代码。', '你的四项交付分别准备放在哪里？', '下一页给出类图和模块说明的尺度。');
}

// 53 module template
{
  const slide = pptx.addSlide('MASTER'); title(slide, '内部模块设计', 'Module design template', '05');
  text(slide, '类图回答“内部由什么组成”；运作说明回答“这些部分怎样协同完成一次工作”。', 0.82, 1.48, 11.75, 0.45, { fontSize: 16.5, color: C.navy, bold: true });

  // A deliberately small class-diagram sketch: enough structure to discuss,
  // without implying that these example classes are already frozen.
  text(slide, '一张可讨论的类图', 0.82, 2.08, 4.45, 0.36, { fontSize: 16, color: C.blue, bold: true });
  card(slide, 0.92, 2.62, 2.05, 1.15, 'Service', '组织一次用例\n调用内部组件', C.blue, { fill: C.white, shadow: false, titleSize: 14, bodySize: 10.8 });
  card(slide, 3.33, 2.62, 2.05, 1.15, 'Rule / Adapter', '执行规则\n转换输入输出', C.teal, { fill: C.white, shadow: false, titleSize: 14, bodySize: 10.8 });
  card(slide, 2.12, 4.33, 2.05, 1.15, 'StateData', '候选 dataclass\n保存结构化数据', C.purple, { fill: C.white, shadow: false, titleSize: 14, bodySize: 10.8 });
  arrow(slide, 2.98, 3.2, 3.28, 3.2, C.blue, 1.5);
  arrow(slide, 4.15, 3.82, 3.45, 4.28, C.purple, 1.5);
  arrow(slide, 2.25, 4.28, 1.94, 3.82, C.purple, 1.5);
  text(slide, '类框可写职责、关键属性和候选方法；状态或配置数据可用 dataclass 表达。图中的数据类只是示例，是否需要、由谁定义，要在架构与接口会上共同决定。', 0.86, 5.75, 4.72, 0.77, { fontSize: 11.8, color: C.muted, valign: 'top', margin: 0 });

  slide.addShape(S.line, { x: 5.9, y: 2.08, w: 0, h: 4.48, line: { color: C.line, width: 1 } });
  text(slide, '讲清内部如何构成和运作', 6.28, 2.08, 6.05, 0.36, { fontSize: 16, color: C.teal2, bold: true });
  const modulePoints = [
    ['主要组件', '各部分分别承担什么职责，为什么需要它们。'],
    ['运行过程', '怎样初始化；一次核心工作从哪里开始、到哪里结束。'],
    ['数据流动', '重要数据在内部怎样传递、加工和返回。'],
    ['模块边界', '哪些事情由本模块完成，哪些能力需要从其他责任域获得。'],
    ['开放问题', '当前还未确定、需要在接口会上共同讨论的事项。'],
  ];
  modulePoints.forEach((d, i) => {
    const y = 2.72 + i * 0.69;
    pill(slide, `${i + 1}`, 6.3, y + 0.02, 0.42, C.white, i % 2 ? C.teal : C.blue);
    text(slide, d[0], 6.92, y, 1.38, 0.31, { fontSize: 13.2, color: C.navy, bold: true, valign: 'top' });
    text(slide, d[1], 8.36, y, 4.0, 0.46, { fontSize: 11.9, color: C.muted, valign: 'top', margin: 0 });
  });
  text(slide, '材料形式不限；目标是让其他人听懂，并能够据此提出接口问题。', 6.32, 6.18, 6.02, 0.42, { fontSize: 12.5, color: C.teal2, bold: true });
  note(slide, '规定内部模块方案的最小格式。', '图帮助看到关系，表帮助检查每个模块的责任和验证。模块数量保持可理解，过多时先合并，过少时检查是否有一个模块承担了所有工作。', '你的核心状态会放在哪个模块？', '提供接口需要更详细的模板。');
}

// 54 provided interface template
{
  const slide = pptx.addSlide('MASTER'); title(slide, '提供接口', 'Provided interface · first draft', '05');
  text(slide, '每个接口单独填写一份。第一次先让调用方看懂“谁提供、怎样调用、得到什么”。', 0.82, 1.48, 11.75, 0.45, { fontSize: 16.2, color: C.navy, bold: true });
  slide.addShape(S.roundRect, { x: 0.86, y: 2.05, w: 11.62, h: 4.5, rectRadius: 0.05, fill: { color: C.white }, line: { color: C.line, width: 1.1 } });
  slide.addShape(S.rect, { x: 0.86, y: 2.05, w: 0.08, h: 4.5, fill: { color: C.teal }, line: { color: C.teal } });
  text(slide, '接口说明单', 1.2, 2.28, 2.2, 0.38, { fontSize: 17, color: C.navy, bold: true });
  text(slide, 'Name / Purpose', 1.2, 2.88, 1.72, 0.3, { fontSize: 11.8, color: C.teal2, bold: true });
  text(slide, '接口名称，以及它解决什么问题', 2.98, 2.84, 4.05, 0.38, { fontSize: 13.2, color: C.ink });
  text(slide, 'Provider', 7.38, 2.88, 0.95, 0.3, { fontSize: 11.8, color: C.teal2, bold: true });
  text(slide, '实现与维护者', 8.35, 2.84, 1.48, 0.38, { fontSize: 13.0, color: C.ink });
  text(slide, 'Caller', 10.02, 2.88, 0.72, 0.3, { fontSize: 11.8, color: C.teal2, bold: true });
  text(slide, '调用模块', 10.78, 2.84, 1.2, 0.38, { fontSize: 13.0, color: C.ink });
  slide.addShape(S.line, { x: 1.2, y: 3.37, w: 10.8, h: 0, line: { color: C.line, width: 0.8 } });
  text(slide, 'Python Signature', 1.2, 3.62, 1.72, 0.28, { fontSize: 11.8, color: C.teal2, bold: true });
  code(slide, 'def interface_name(request: RequestType) -> ResultType:', 2.98, 3.5, 8.98, 0.68, 12.4);
  slide.addShape(S.line, { x: 1.2, y: 4.4, w: 10.8, h: 0, line: { color: C.line, width: 0.8 } });
  text(slide, 'Input', 1.2, 4.68, 0.72, 0.3, { fontSize: 12, color: C.blue, bold: true });
  text(slide, '输入对象表达什么；关键参数、单位或限制。', 2.05, 4.64, 3.82, 0.55, { fontSize: 12.5, color: C.muted, valign: 'top', margin: 0 });
  text(slide, 'Output', 6.05, 4.68, 0.82, 0.3, { fontSize: 12, color: C.green, bold: true });
  text(slide, '返回对象表达什么；调用方将怎样使用结果。', 6.98, 4.64, 4.65, 0.55, { fontSize: 12.5, color: C.muted, valign: 'top', margin: 0 });
  slide.addShape(S.line, { x: 1.2, y: 5.45, w: 10.8, h: 0, line: { color: C.line, width: 0.8 } });
  text(slide, 'Open Questions', 1.2, 5.74, 1.72, 0.3, { fontSize: 12, color: C.orange, bold: true });
  text(slide, '记录命名、调用时机、数据含义或责任上仍需共同确认的问题；本轮不要求冻结全部字段。', 2.98, 5.68, 8.98, 0.56, { fontSize: 12.6, color: C.muted, valign: 'top', margin: 0 });
  note(slide, '给出首次提供接口草案模板。', '第一次只写最小信息，目标是让供需双方能开始讨论。异常、示例、契约测试和最终字段在对齐后补充。', '这份说明是否足以让调用方判断它能否满足自己的需求？', '所需接口使用相同尺度。');
}

// 55 required template
{
  const slide = pptx.addSlide('MASTER'); title(slide, '所需接口', 'Required interface · first draft', '05');
  text(slide, '每项需求单独写一份。先把真实使用场景讲清楚，再和预计提供方共同确定接口形状。', 0.82, 1.48, 11.75, 0.45, { fontSize: 16.2, color: C.navy, bold: true });
  slide.addShape(S.roundRect, { x: 0.82, y: 2.02, w: 11.7, h: 0.58, rectRadius: 0.04, fill: { color: C.navy }, line: { color: C.navy } });
  text(slide, '暂定名称：____________', 1.08, 2.02, 2.45, 0.58, { fontSize: 12.2, color: C.white, bold: true });
  text(slide, 'Expected Provider：____________', 3.74, 2.02, 3.05, 0.58, { fontSize: 12.2, color: C.white, bold: true });
  text(slide, 'Caller：____________', 7.08, 2.02, 2.15, 0.58, { fontSize: 12.2, color: C.white, bold: true });
  text(slide, 'Desired Signature：____________', 9.42, 2.02, 2.78, 0.58, { fontSize: 11.4, color: C.white, bold: true });

  text(slide, '能力与使用场景', 0.86, 2.9, 5.6, 0.34, { fontSize: 15.5, color: C.blue, bold: true });
  const leftItems = [
    ['需要什么能力', '一句话说明希望对方完成的动作或查询。'],
    ['为什么 / 何时', '说明依赖这项能力的步骤和调用时机。'],
    ['关键数据', '列出不可缺少的字段、单位和大致形态；输入输出字段可以先不完整。'],
  ];
  leftItems.forEach((d, i) => {
    const y = 3.42 + i * 0.93;
    text(slide, d[0], 0.9, y, 1.36, 0.3, { fontSize: 12.7, color: C.navy, bold: true, valign: 'top' });
    text(slide, d[1], 2.36, y - 0.01, 3.76, 0.6, { fontSize: 12.1, color: C.muted, valign: 'top', margin: 0 });
    if (i < leftItems.length - 1) slide.addShape(S.line, { x: 0.9, y: y + 0.67, w: 5.22, h: 0, line: { color: C.line, width: 0.8 } });
  });

  slide.addShape(S.line, { x: 6.42, y: 2.86, w: 0, h: 3.65, line: { color: C.line, width: 1 } });
  text(slide, '验证草案与待对齐内容', 6.78, 2.9, 5.5, 0.34, { fontSize: 15.5, color: C.teal2, bold: true });
  const rightItems = [
    ['正常测例草案', '输入：A01 + round=3\n预期：返回权限过滤后的 Observation。', C.purple],
    ['边界 / 失败草案', '空历史返回 []；未知 ID 返回 SubjectNotFound。', C.red],
    ['待对齐问题', '记录命名、边界、状态归属，以及需要双方共同确认的预期。', C.orange],
  ];
  rightItems.forEach((d, i) => {
    const y = 3.42 + i * 0.93;
    text(slide, d[0], 6.78, y, 1.55, 0.3, { fontSize: 12.7, color: d[2], bold: true, valign: 'top' });
    text(slide, d[1], 8.45, y - 0.01, 3.68, 0.65, { fontSize: 12.0, color: C.muted, valign: 'top', margin: 0, fontFace: i < 2 ? 'Aptos' : 'Microsoft YaHei' });
    if (i < rightItems.length - 1) slide.addShape(S.line, { x: 6.78, y: y + 0.67, w: 5.35, h: 0, line: { color: C.line, width: 0.8 } });
  });
  text(slide, '需求方先写草案；接口名称、最终签名、精确字段和共同测例在对齐时由双方确认。', 1.08, 6.45, 11.15, 0.34, { fontSize: 12.5, color: C.teal2, bold: true, align: 'center' });
  note(slide, '降低提出跨模块需求的门槛。', '所需接口也要单独成文，并与提供接口采用相同的最小结构。下次会议把两侧文档放在一起对齐。', 'Decision 需要 World 提供的第一个 Context 能力是什么？', '下次会议按统一顺序做接口对齐。');
}

// 56 alignment
{
  const slide = pptx.addSlide('MASTER'); title(slide, '下次接口对齐流程', 'Interface alignment', '05');
  const steps = [
    ['1', '展示类图', '每人 5–8 分钟'],
    ['2', '讲模块运作', '内部构成与核心流程'],
    ['3', '匹配供需', '提供接口 ↔ 所需接口'],
    ['4', '核对调用形状', '用途、签名、输入与输出'],
    ['5', '记录分歧', '命名、时机、责任与缺口'],
    ['6', '形成下一版', '确认修改人和开放问题'],
  ];
  steps.forEach((d, i) => {
    const x = 0.65 + i * 2.05;
    pill(slide, d[0], x + 0.62, 1.65, 0.48, C.white, [C.blue, C.teal, C.purple, C.red, C.orange, C.green][i]);
    card(slide, x, 2.15, 1.75, 2.5, d[1], d[2], [C.blue, C.teal, C.purple, C.red, C.orange, C.green][i], { titleSize: 13.5, bodySize: 10.6, shadow: false });
    if (i < steps.length - 1) arrow(slide, x + 1.77, 3.35, x + 2.0, 3.35, C.teal);
  });
  note(slide, '规定首次接口对齐的工作顺序。', '先看类图和模块运作，再把提供与所需接口逐份配对。首次会议先解决基本调用关系并记录分歧，不要求当场完成测试或冻结最终字段。', '如果一个需求没有提供方，会议结束前要留下什么记录？', '下一页说明首次对齐重点。');
}

// 57 alignment checklist
{
  const slide = pptx.addSlide('MASTER'); title(slide, '首次接口对齐重点', 'Alignment checklist', '05');
  text(slide, '对齐的目标是让一项能力可以被准确调用，不是在现场把所有实现细节一次定完。', 0.82, 1.48, 11.75, 0.45, { fontSize: 16.2, color: C.navy, bold: true });
  text(slide, '先确认基本契约', 0.92, 2.2, 5.35, 0.36, { fontSize: 16, color: C.blue, bold: true });
  const basics = [
    ['Purpose', '提供方和调用方理解的是不是同一个功能；它解决的具体问题是什么。'],
    ['Provider / Caller', '谁实现、谁调用；有没有重复提供或无人负责的能力。'],
    ['Signature', '函数或方法的形状，能否表达这次交互及其返回结果。'],
  ];
  basics.forEach((d, i) => {
    const y = 2.83 + i * 0.92;
    pill(slide, `${i + 1}`, 0.94, y, 0.42, C.white, C.blue);
    text(slide, d[0], 1.58, y - 0.03, 4.55, 0.3, { fontSize: 12.8, color: C.navy, bold: true, valign: 'top' });
    text(slide, d[1], 1.58, y + 0.31, 4.55, 0.48, { fontSize: 11.4, color: C.muted, valign: 'top', margin: 0 });
  });
  slide.addShape(S.line, { x: 6.54, y: 2.12, w: 0, h: 3.62, line: { color: C.line, width: 1 } });
  text(slide, '再检查系统边界', 6.9, 2.2, 5.35, 0.36, { fontSize: 16, color: C.teal2, bold: true });
  const boundaries = [
    ['Input / Output', '输入输出分别代表什么，关键数据、单位和返回语义是否足够。'],
    ['Timing / Ownership', '大致在什么时机调用；涉及的权威状态由哪个模块维护。'],
    ['Open Questions', '还没决定的选项、影响范围、下一步负责人和需要谁共同确认。'],
  ];
  boundaries.forEach((d, i) => {
    const y = 2.83 + i * 0.92;
    pill(slide, `${i + 4}`, 6.92, y, 0.42, C.white, C.teal);
    text(slide, d[0], 7.56, y - 0.03, 4.7, 0.3, { fontSize: 12.6, color: C.navy, bold: true, valign: 'top' });
    text(slide, d[1], 7.56, y + 0.31, 4.7, 0.48, { fontSize: 11.4, color: C.muted, valign: 'top', margin: 0 });
  });
  slide.addShape(S.roundRect, { x: 1.05, y: 5.92, w: 11.22, h: 0.7, rectRadius: 0.05, fill: { color: C.paleOrange }, line: { color: C.orange, width: 1 } });
  text(slide, '会议判断｜如果一个未确认问题会让两个模块互相等待，就在本次会议明确负责人和下一步；其余细节可进入下一版接口文档。', 1.32, 5.92, 10.68, 0.7, { fontSize: 11.8, color: C.ink, bold: true, align: 'center' });
  note(slide, '提供首次对齐检查表。', '第一次会议优先确认功能、供需关系、调用形状和关键数据。精细字段、异常、样例与测试留到下一轮完善。', '哪个问题如果现在不确认，会导致两个模块互相等待？', '下一页说明会议输出。');
}

// Alignment outputs
centeredBodySlide({ title: '首次接口对齐输出', kicker: 'Alignment outputs', part: '05', bodySize: 17.0, layout: 'steps',
  items: [
    ['供需映射', '每个所需接口找到提供方；重复或缺失能力被标出。', C.blue],
    ['接口修订清单', '哪些名称、签名、输入输出需要由谁修改。', C.teal],
    ['系统时序更新', '张馨月根据对齐结果更新 Engine 与各模块的调用顺序。', C.green],
    ['开放问题', '尚未决定的问题、可选方案、影响范围、负责人和下一次确认时间。', C.orange],
  ],
  notes: ['明确首次接口对齐应留下的四类成果。', '张馨月整理统一版本，李文浩审阅技术边界，刘充审阅经济含义。接口下一版完成后再进入异常、样例和测试设计。', '会议结束后，谁负责把修订清单落实到文档？', '接下来进入整体分步规划。'] });

sectionDividerSlide('06', '分步推进计划', '按照设计、对齐、实现、合版和实验的顺序，让每一步都有可检查的结果。', C.red);

// Step-by-step design and alignment
{
  const slide = pptx.addSlide('MASTER'); title(slide, '设计与对齐', 'Step-by-step plan', '06');
  const steps = [
    ['Step 1', '1123 设计', '类图 · 模块说明\n逐份提供 / 所需接口'],
    ['Step 2', '首次对齐', '匹配供需\n修订签名与关键数据'],
    ['Step 3', '完善接口', '字段 · 异常 · 样例\n双方共同设计测试'],
    ['Step 4', '冻结并准备开发', 'Contracts v0.1\n骨架与假实现可运行'],
  ];
  steps.forEach((d, i) => {
    const x = 0.72 + i * 3.08;
    pill(slide, d[0], x + 0.65, 1.45, 1.2, C.white, [C.blue, C.teal, C.orange, C.green][i]);
    card(slide, x, 2.05, 2.65, 3.45, d[1], d[2], [C.blue, C.teal, C.orange, C.green][i], { titleSize: 16, bodySize: 13.2, shadow: false });
    if (i < steps.length - 1) arrow(slide, x + 2.68, 3.75, x + 3.0, 3.75, C.muted);
  });
  text(slide, '当前只完成 Step 1；测试与最终字段从 Step 3 开始。', 1.1, 6.15, 11.15, 0.45, { fontSize: 16.5, color: C.navy, bold: true, align: 'center' });
  note(slide, '把设计和对齐改成按成果逐步推进。', '先完成各自设计，再由接口提供方和需要方共同确定契约测例，然后冻结接口版本并实现契约测试，最后让骨架和假实现跑通。后一步只在前一步的可检查成果完成后开始。', '进入 Step 3 前，每个接口的提供方和需要方需要共同确认什么？', '设计与对齐完成后，进入实现与合版。');
}

// Step-by-step implementation and integration
{
  const slide = pptx.addSlide('MASTER'); title(slide, '实现与合版', 'Step-by-step plan', '06');
  const steps = [
    ['Step 5', '并行实现', '按 v0.1 接口开发\n单元测试随代码提交', C.blue],
    ['Step 6', '模块集成', '契约测试与集成测试\n及时解决接口差异', C.orange],
    ['Step 7', '合版稳定', '完整一轮 / 多轮运行\n回归测试与文档整理', C.green],
  ];
  steps.forEach((d, i) => {
    const x = 0.85 + i * 4.15;
    card(slide, x, 1.85, 3.65, 3.65, d[0], `${d[1]}\n\n${d[2]}`, d[4], { fill: [C.paleBlue, C.paleOrange, C.paleGreen][i], shadow: false, titleSize: 18, bodySize: 14 });
    if (i < steps.length - 1) arrow(slide, x + 3.68, 3.68, x + 4.05, 3.68, C.teal, 2);
  });
  text(slide, '阶段出口：共同分支能够从配置启动，稳定运行最小多轮场景，并生成完整运行目录。', 0.95, 6.18, 11.45, 0.42, { fontSize: 16, color: C.navy, bold: true, align: 'center' });
  note(slide, '把实现与合版改成三个连续步骤。', '先依据 v0.1 契约并行实现，并将单元测试随代码提交。然后持续集成，运行契约和集成测试，在差异出现时及时解决。最后稳定合版，确认最小多轮运行、回归测试和文档。接口变更通过版本和 PR 记录。', '进入 Step 7 前，契约测试和集成测试需要达到什么状态？', '系统稳定后，再进入实验与分析。');
}

// Experiment and analysis steps
centeredBodySlide({ title: '实验与分析', kicker: 'Step-by-step plan', part: '06', bodySize: 17.0, layout: 'steps',
  items: [
    ['Step 8 · 场景校准', '核对世界参数、制度参数、信息条件和手算极小案例。', C.blue],
    ['Step 9 · 实验矩阵', '多 seed、三类制度、LLM / 规则基线、冲击与消融。', C.purple],
    ['Step 10 · 正式运行', '冻结代码与配置版本；批量运行；持续检查失败轨迹与成本。', C.teal],
    ['Step 11 · 分析与复现', '从事件和快照计算指标、置信区间；保存图表脚本与结论依据。', C.green],
  ],
  notes: ['将实验工作按前置条件继续编号。', '先校准并复核经济含义，再建立公平的实验矩阵。正式运行需要冻结 commit 和配置。分析从保存的原始事件和快照生成，失败轨迹也进入结果。每个步骤以前一步的稳定产物为输入。', '多种制度进入 Step 10 前，哪些世界规则必须保持一致？', '最后把三个阶段串起来。'] });

// Stage relationship
{
  const slide = pptx.addSlide('MASTER'); title(slide, '阶段关系', 'Overall plan', '06');
  const stages = [
    ['Stage A', '设计与对齐', '模块图 · 接口 v0.1 · 共同契约测例', C.blue],
    ['Stage B', '实现与合版', '并行开发 · 持续集成 · 最小多轮运行', C.orange],
    ['Stage C', '实验与分析', '场景校准 · 正式运行 · 指标与复现', C.green],
  ];
  stages.forEach((d, i) => {
    const x = 0.85 + i * 4.15;
    pill(slide, d[0], x + 0.82, 1.55, 1.45, C.white, d[3]);
    card(slide, x, 2.15, 3.65, 3.2, d[1], d[2], d[3], { fill: [C.paleBlue, C.paleOrange, C.paleGreen][i], shadow: false, titleSize: 19, bodySize: 13.5 });
    if (i < stages.length - 1) arrow(slide, x + 3.68, 3.72, x + 4.05, 3.72, C.teal, 2);
  });
  text(slide, '前一阶段的可验证产物，是后一阶段开始工作的输入。', 1.15, 6.05, 11.0, 0.45, { fontSize: 17, color: C.navy, bold: true, align: 'center' });
  note(slide, '把三个成果阶段串成依赖关系。', 'Stage A 形成设计和契约，Stage B 依据契约完成实现与合版，Stage C 在稳定版本上运行实验。每个阶段都有明确出口，完成时间根据实际进度决定。', '如果接口尚未对齐，实现与合版最可能出现什么问题？', '下一页收束到当前的推进里程碑。');
}

// Nearest milestone
{
  const slide = pptx.addSlide('MASTER'); title(slide, '推进里程碑', 'Milestones', '06');
  const milestones = [
    ['Milestone 1', '模块方案 + 接口草案', C.blue],
    ['Milestone 2', '首次接口对齐 + 修订清单', C.teal],
    ['Milestone 3', 'Contracts v0.1 + 可运行假实现', C.orange],
    ['Milestone 4', '并行实现 + 合版稳定', C.green],
    ['Milestone 5', '正式实验 + 分析复现', C.purple],
  ];
  milestones.forEach((d, i) => {
    const x = 0.65 + i * 2.5;
    slide.addShape(S.ellipse, { x: x + 0.72, y: 2.2, w: 0.62, h: 0.62, fill: { color: d[2] }, line: { color: d[2] } });
    if (i < milestones.length - 1) slide.addShape(S.line, { x: x + 1.34, y: 2.51, w: 1.88, h: 0, line: { color: C.line, width: 3 } });
    text(slide, d[0], x + 0.08, 3.15, 1.9, 0.38, { fontSize: 15, color: C.navy, bold: true, align: 'center' });
    text(slide, d[1], x, 3.72, 2.05, 0.85, { fontSize: 12.2, color: C.muted, align: 'center', valign: 'top' });
  });
  card(slide, 1.5, 5.25, 10.35, 0.95, '当前完成标准', '每人完成类图、模块运作说明、逐份提供接口草案和逐份所需接口草案；张馨月另交系统时序图。', C.navy, { fill: C.navy, line: C.navy, shadow: false, titleSize: 14, titleColor: C.white, bodySize: 12.1, bodyColor: 'C9D8E6' });
  note(slide, '把注意力收束到当前里程碑。', '整体路径以成果是否达标推进，不绑定固定周数。当前目标是接口 v0.1，代码实现从骨架和测试替身开始。每个人当前的产物直接服务于接口对齐。', '离开会议后，你准备先画哪一张图？', '最后总结今天的共同规则。');
}

// Closing summary
{
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(S.rect, { x: 0, y: 0, w: 13.333, h: 0.1, fill: { color: C.teal }, line: { color: C.teal } });
  text(slide, '总结', 0.85, 0.78, 5.5, 0.65, { fontSize: 32, color: C.white, bold: true });
  const summary = [
    '责任：每人拥有一个子系统和完整交付结果。',
    '接口：提供接口写详细，所需接口先暴露缺口。',
    '代码：数据、Protocol、规则函数和流程类各司其职。',
    '证据：接口双方共同决定契约测例，各自维护内部测试。',
    '节奏：当前设计 → 接口对齐 → 实现合版 → 正式实验。',
    '',
    '下一步：完成类图、模块说明和逐份提供 / 所需接口草案；馨月另交系统时序图。',
  ].join('\n\n');
  text(slide, summary, 1.35, 1.58, 10.65, 4.95, { fontSize: 18.2, color: 'C9D8E6', valign: 'mid', margin: 0.05 });
  note(slide, '用五个词收束课程。', '责任让并行有边界，接口让模块可连接，代码组织让实现清楚，测试提供证据，阶段节奏让项目持续推进。最后再次确认当前交付和接口对齐。', '请每位成员用一句话说出自己当前首先要完成的产物。', '结束并进入提问。');
}

if (speakerNoteIndex !== detailedSpeakerNotes.length) {
  throw new Error(`Speaker-note count mismatch: used ${speakerNoteIndex}, available ${detailedSpeakerNotes.length}`);
}

if (require.main === module) {
  pptx.writeFile({ fileName: '科研软件工程规范与项目整体架构.pptx' });
}

module.exports = pptx;
