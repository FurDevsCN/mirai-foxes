# off

off负责删除一个或多个事件监听器。

### Typescript 方法速览

```typescript
class Bot {
  off(): void
  off<T extends EventType>(type: T): void
  off<T extends EventType>(handle: EventIndex<T>): void
  off(handle: EventIndex<EventType>[]): void
}
```

### 参数解释

- 不指定参数(void)：移除所有处理器。
- type(如果指定)：移除一个事件下的所有处理器。
- handle(如果指定且为EventIndex)：移除一个由唯一标识符指定的事件监听器。
- handle(如果指定且为EventIndex[])：移除多个由唯一标识符指定的事件监听器。

### 注意

移除一个已经失效的事件会导致未定义行为。

### 使用示范

```typescript
import { Bot, EventIndex } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // As usual, open your burning 0 bot
  })
  let d: EventIndex<'FriendMessage'> = bot.on('FriendMessage',async data => {
    // 不会被触发，因为被移除了
  })
  bot.off(d)
})()
```
