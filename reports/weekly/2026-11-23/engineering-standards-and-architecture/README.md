# 科研软件工程规范与项目整体架构：课件交付包

> 当前成员分工、1123 本周交付和完成范围，以项目仓库中的 [1123任务文档](../../../../docs/tasks/T-008.md) 为准。本课件前半部分包含后续开发阶段需要使用的完整工程规范；测试和功能实现不是 1123 本周任务。

## 主要文件

- `科研软件工程规范与项目整体架构.pptx`：68 页可编辑 PowerPoint，包含六张章节分隔页、“五阶段综合推进方式”和可直接讲的演讲者备注。
- 版式约定：流程图、代码和模块分解使用结构化图形；字段信息使用平面表格，普通说明使用左对齐文字或多行清单，不使用机械的中文方括号标签。
- `speaker_notes.js`：62 张内容页的详细讲稿源文本；六张章节分隔页的讲稿由 `build_deck.js` 直接生成，因此最终 68 页均含备注。
- `build_deck.js`：使用 PptxGenJS 生成课件的源文件。
- `vending_demo/`：自动售货机 Toy 工程，包含 `Protocol`、实现、演示程序和 9 个测试。
- `preview/contact-sheet.png`：整套课件的缩略图总览。
- `preview/geometry-report.json`：对象边界检查结果。
- `preview/text-overflow-report.json`：文字溢出检查结果。

## 运行 Toy 工程

```bash
cd vending_demo
python run_demo.py
python -m unittest discover -s tests -v
```

## 重新生成课件

```bash
node build_deck.js
node validate_deck.js
```

课件内容覆盖多人开发流程、接口与验证、Git 协作、Python 类与对象、`dataclass`、`Protocol`、测试、自动售货机完整示例、五责任域整体架构、五阶段综合推进方式、1123 本周任务与后续阶段规划。
