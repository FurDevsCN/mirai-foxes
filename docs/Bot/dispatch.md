# dispatch

dispatch 允许您触发一个事件。

### Typescript 方法速览

```typescript
class Bot {
  dispatch<T extends EventType>(value: EventArg<T>): void
}
```

### 参数解释

- value：事件参数。

### 使用示范

```typescript
import { Bot, Message } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // 打开你的烧0 Bot。
  })
  bot.on('FriendMessage', async data => {
    await bot.send('friend', {
      qq: data.sender.id, // 当然是要发给Null老师咯！
      // 注：data.sender.id是发送者的QQ号，请参照 Events。
      reply: data, // 在这指定回复的消息，指定的是FriendMessage而不是messageId。
      message: [new Message.Plain('...哇，好大。')] // 试着回复一下伪造的消息吧。
    })
    // 首先要把涩图下下来...这部分就留给你做吧，无论是fetch还是axios。
    // 当然，肯定是“用户”来写，我可不想承担后果。
  })
  bot.dispatch({
    type: 'FriendMessage',
    messageChain: [
      new Message.Source({ id: 0, time: 0 }), // 伪造的消息 Source。
      new Message.Image({
        url: 'https://null.onlyfans.com/20220918-01.png' // Null老师的写真。图样图森破，普遍级怎么会放R18呢？最多Strong language罢了。
      }), // 本人自拍...
      new Message.Plain('...这次是特例，下次可不准在null上访问dick了啊。') // 写点Null老师可能会说的话。
    ],
    sender: {
      id: 0, // 让我们假想这里是Null老师的QQ。
      nickname: 'AAA. 专业烧0', // 我不知道Null老师的昵称，那就这个了。
      remark: '我是Null，火速超市我' // 当然，他的签名也是可以伪造的。
    }
  }) // 我们通过触发事件的方式假装Null老师发了这条消息。
})()
```
