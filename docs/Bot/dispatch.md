# dispatch

dispatch允许您手动触发一个事件。

### Typescript 方法速览

```typescript
class Bot {
  dispatch<T extends EventType>(
    value: EventArg<T>
  ): void
}
```

### 参数解释

- value：事件参数。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  bot.on('FriendMessage',async data => {
    // 进行一些处理...
  })
  bot.dispatch({type: "FriendMessage",...}) // 手动触发上面那个事件
})()
```
