# open

open方法负责打开一个机器人连接。在打开连接后便可以对机器人进行各种操作。

### Typescript 方法速览

```typescript
class Bot {
  async open(conf: Config): Promise<void>
}
```

### 参数解释

- conf：机器人的配置。以下是对其内容的的解释。

  * qq：机器人的QQ号。
  * verifyKey：mirai-api-http验证密钥。
  * httpUrl: HTTP API 接口。需要带上http协议头。
  * wsUrl: Websocket API 接口。需要带上ws协议头。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    wsUrl: 'ws://localhost:8080', // Websocket API 地址
    httpUrl: 'http://localhost:8080', // HTTP API 地址
    verifyKey: 'FurDevsCN', // 验证密钥
    qq: 0, // Bot的QQ
  })
  // 也可以使用 bot.open({...}).then(()=>{...}) 的方式使用。
})()
```
