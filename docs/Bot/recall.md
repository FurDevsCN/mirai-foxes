# recall

recall负责撤回一条消息。

### Typescript 方法速览

```typescript
class Bot {
  async recall(message: Message): Promise<void>
}
```

### 参数解释

- message：要撤回的消息，也可以是Bot自己发送的消息。
  通常，此消息是send返回的，或者是消息事件的**事件参数**。

### 使用示范

```typescript
import { Bot, Message, Event } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  let msg: Event.Message = await bot.send('friend',{
    qq: 0,
    message: [new Message.Plain('来点涩图')]
  })
  await bot.recall(msg)
})()
```
