# get

get 允许您获取群成员设置或群信息。

### Typescript 方法速览

```typescript
class Bot {
  async get(info: MemberID): Promise<Member>
  async get(info: GroupID): Promise<GroupInfo>
}
```

### 参数解释

- info：上下文对象或者群号。

### 返回内容

当 info 是群号时，返回群信息。  
当 info 是群成员时，返回群成员设置。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // 打开我们的烧0 Bot。
  })
  // 这次，我想我们要盗摄null。（null注：？）
  // 要盗摄，就需要获得他的在群里的设置，那我们开始吧。
  console.log(
    await bot.get({
      group: 287105198, // 我想，在essence中已经介绍过这个saob群了。现在我们要从这个群入手，盗摄null老师。
      // 然后，如果你想要试试这个demo（真的盗摄null老师），你可以进来看看。（null注：你们这文档怎么味道比graia社区文档还足）（灵：发给魔女看看)（null注：别，会被他杀） (中二：我超，null老师吃ㄐㄐ（注音：ji ji）)（null注：？即刻脚刹）
      qq: 0 // 这里就是null老师的QQ了。（因为他是0。)
    })
  ) // 输出他的群设置，于是你可以看到他是否被口球，最后发言时间，等等。做一个舔狗就是这么简单。（注：返回是 Member 对象，我想你在 essence 的示范中，已经伪造过一个了。）
  // 在重制文档的时候，我们多次迫害了Null。在介绍今天的主要内容后，我们希望您花一些时间看看 #NullLiveMatters。还有，我们是Rust Core Team。还有，null真的不是骚逼。（个屁
  // 有人试图使用注音打字。如果您不能理解注音是什么，我建议您使用360安全浏览器搜索，若没有结果则建议放弃。
})()
```
