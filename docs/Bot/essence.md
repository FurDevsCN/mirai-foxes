# essence

essence允许你将消息设置群精华

### Typescript 方法速览

```typescript
class Bot {
  async essence(message: GroupMessage): Promise<void>
}
```

### 参数解释

- message：要设置群精华的消息。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  bot.essence({...}) // 设精
})()
```
