# config

config用于获得**完整的**用户配置。

### Typescript 方法速览

```typescript
class Bot {
  get config(): FullConfig
}
```

### 说明

`FullConfig`相比`Config`添加了以下内容：

- sessionKey：mirai-api-http会话密钥。

### 警告

不推荐使用此API。手动发送请求会导致未预期的错误~~以及不能注type lint，来自用户的怨念~~。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  console.log(bot.config.sessionKey) // 获得sessionKey
})()
```
