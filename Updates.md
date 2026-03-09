例句卡面更新

study 模式翻开卡片后，不再显示 phrases 列表，改为显示 2-3 条轻量例句列表
移除了例句外层强调框，只保留更小字号的句子列表
每个词条主字段改为 `examples`，每项是 `{ sentence, focus }`
卡面会优先加粗每条例句里的 `focus`；若缺失或句中找不到，再回退到加粗 `term`
导入提示词、JSON 归一化、JSON/Markdown 导出都已切到 `examples`
`vocab.md` 词条格式从单组 Sentence/Focus 扩展为 2-3 组编号 Sentence/Focus
整套内置例句已改写为更偏 B1-B2 的日常语境，降低法律/新闻/政治类表达的比例

快速启动脚本

根目录新增 `run.sh`
脚本会先切到项目目录；若缺少 `node_modules`，会自动执行 `npm install`
随后用 `npm run dev -- --host 0.0.0.0` 启动本地开发服务器

贫血模式

在最后一张词（N/N）已 revealed 的情况下按 Enter → 进入贫血屏，只有"随手拼？"标题和操作说明
贫血屏：Enter → 回到第 1 张继续刷词，Space → 进入随手拼
随手拼

只显示词性 + 中英文意思，单词隐藏，光标闪烁
实时显示键入内容（任意字母键追加）
Enter 提交：正确 → 绿色 + 显示带音节点的正确拼写；错误 → 红色 shake + 显示正确答案
拼错后直接再按 Enter → 再次 shake；开始键入字母 → 自动清空重拼
Backspace 逐字删除
拼完所有词 → 自动回普通刷词
Esc → 随时退出随手拼
shake 动画：用 key={shakeKey} 每次递增让 React 重新挂载元素，CSS animation 自动从头播，不用 setTimeout。
