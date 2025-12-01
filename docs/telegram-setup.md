# Telegram 推送配置指南

> 所有凭据都只会存储在浏览器 `localStorage` 中，不会上传至任何服务器。

## 1. 创建机器人

1. 打开 Telegram，搜索 `@BotFather`。
2. 输入 `/newbot` 并按照提示设置机器人名称与用户名（用户名必须以 `bot` 结尾）。
3. BotFather 会返回一串 `HTTP API token`，格式形如 `123456789:AA...`，请复制保存。

## 2. 获取 Chat ID

有两种常见方式：

- **单聊**：给你的机器人发送一条消息，然后访问  
  `https://api.telegram.org/bot<token>/getUpdates`  
  在返回 JSON 中的 `chat.id` 即为个人 chat id。
- **群组**：先把机器人加入群组，再将群组设置为“允许添加机器人”。在群里任意发送消息，然后同样调用 `getUpdates`，查找 `chat.id`（通常为负数，例如 `-987654321`）。

为了降低频繁拉取 `getUpdates` 的噪音，建议在确认 ID 后在 BotFather 中发送 `/setprivacy` 将机器人改为 `Disable`，这样才能看到群里全部消息。

## 3. 在 rremind 中启用

1. 打开页面右上角的“设置”。
2. 勾选“启用 Telegram 提醒”。
3. 填入刚才获得的 Token 与 Chat ID。
4. 设置“默认提前提醒天数”（比如 7 天）。
5. 点击“保存设置”后，可以在任意订阅条目上点击“发送提醒”以验证是否成功。

## 4. 常见问题

- **提示 TOKEN_INVALID**：确认复制的 token 没有空格或隐藏字符。
- **群组还是个人？** 只要填入对应 chat id 即可，机器人可以同时给多个 Chat ID 发送（可通过备份数据在不同浏览器中配置不同 chat id）。
- **Webhook 冲突**：如果之前给机器人配置过 webhook，需要先在 BotFather 中运行 `/deleteWebhook`，否则无法使用简单的 `sendMessage`。
- **安全性**：Token 与 Chat ID 被保存在本地浏览器，备份文件中也会包含它们，如需分享备份请删除相关字段。
