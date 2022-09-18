# essence

essence 允许您将消息设置为群精华。

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
import { Bot, Message } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // 打开我们的烧0 Bot。
  })
  bot.essence({
    type: 'GroupMessage', // 这里必须是GroupMessage。为什么？你总不可能给私聊消息设精吧。（null注：万一呢？等哪天tx看到mirai-foxes突发奇想给 FriendMessage 也 implement 进来设精）
    messageChain: [
      new Message.Source({
        id: 114514,
        time: 1919810
      }), // 伪造的消息 Source。
      new Message.Plain('我是公交车'), // null老师说什么的时候，我们会给他设精呢？
    ],
    sender: {  // 本次迫害对象，null老师。以下内容经过null老师审查，安心安全。(null注：啊？)
      id: 0, // 这里是null老师的ID。
      memberName: 'AAA. 五十年null中西结合专业加长加粗' // 他的群昵称。（null注：感觉不如五十年老中医专业加长加粗）（凌：中西结合。）（中二：究极融合怪是吧）
      specialTitle: '烧0', // null的群头衔。这是他应得的。
      permission: 'MEMBER', // 凌：权限低一点以允许我们塞口球。中二：塞个几把？他应该做1，我是0。（伪null注：我站起来了。）（灵：算了，还是让他当0吧。）（null注：？即刻脚刹）
      joinTimestamp: 114514, // 我怎么知道他什么时候加进来的？坏了，我自己也不知道
      lastSpeakTimestamp: 1919810, // 最后发言时间？我不到啊。
      muteTimeRemaining: 0, // 仁慈一点，他现在没被塞口球。(不过马上就要被塞口球了)
      group: { // 甲级战犯，福瑞之家群。
        id: 287105198, // 这可以进！进来逛逛？（null注：omg，完全没想过的宣群方式。坏了，我不会被后来人当成骚逼吧）
        name: '福瑞之家（saob版）', // 高情商：saob版，低情商：淫窑
        permission: 'OWNER', // 给我们的烧0 Bot权限整高一点，这样就可以给null塞口球了。
      }
    }
  }) // 这样，我们就把null老师一条根本不存在的迫真消息设精了。
})()
```
