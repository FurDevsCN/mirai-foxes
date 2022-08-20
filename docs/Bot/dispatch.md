# dispatch

dispatch允许您触发一个事件。

### Typescript 方法速览

```typescript
class Bot {
  async dispatch<T extends EventType>(
    value: EventArg<T>
  ): Promise<void>
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
  await bot.dispatch({type: "FriendMessage",...}) // 手动触发上面那个事件
})()
```
