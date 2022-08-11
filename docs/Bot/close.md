# voice

close负责关闭一个机器人的连接。在关闭连接后便不可以再对机器人进行操作，除非再打开一个会话。

### Typescript 方法速览

```typescript
class Bot {
  async close({ keepProcessor = false } = {}): Promise<void>
}
```

### 参数解释

- keepProcessor(解构参数)：是否要保留事件处理器。默认为不保留。
  若设置keepProcessor为true，则打开下一个bot会话后之前的事件处理器和`EventIndex`仍然可用。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.close()
  // 不能再对bot进行操作了！
})()
```
