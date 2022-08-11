# dispatch

dispatch允许您手动触发一个事件。

### Typescript 方法速览

```typescript
class Bot {
  async dispatch<T extends EventType>(
    type: T,
    value: EventArg<T>
  ): Promise<void>
}
```

### 参数解释

- type：要触发的事件类型。事件是`EventType`内的任何一个（参见基础类型）。
- value：事件参数。注意：事件参数和`type`存在对应关系。

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
  await bot.dispatch("FriendMessage",{...}) // 手动触发上面那个事件
})()
```
