# send

send负责向指定用户/群聊发送消息，并允许使用回复。

### Typescript 方法速览

```typescript
class Bot {
  async send(
    type: 'group',
    option: SendOption<GroupID>
  ): Promise<GroupMessage>
  async send(
    type: 'friend',
    option: SendOption<UserID>
  ): Promise<FriendMessage>
  async send(
    type: 'temp',
    option: SendOption<UserID>
  ): Promise<StrangerMessage>
  async send(
    type: 'temp',
    option: SendOption<MemberID>
  ): Promise<TempMessage>
}
```

### 参数解释

- type：发送目标的类型。
  `temp`：临时会话或者陌生人消息
  `group`：群聊消息
  `friend`：好友消息
  请视回复对象更改类型。
- option：发送选项。以下是对其内容的解释。
  * qq：要发送到的好友，群聊QQ号，或者*上下文*（参见基础类型）。
  * reply(可选)：要引用的消息（可以是Bot发送的消息）。
  * message：要发送的消息数组（参见`Message`命名空间中的内容）。

### 返回内容

返回发送的消息，允许用这条消息进行下一步操作，比如~~自己回复自己~~、撤回。

（不要尝试去读取`sender`，那是完全伪造的，不包含任何除上下文以外的有效信息。）

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
    message: [new Message.Plain('我趣')]
  })
  await bot.recall(msg)
  await bot.send('friend',{
    qq: 0,
    message: [new Message.Plain('不好意思，说藏话了')]
  })
})()
```
