# mute

mute 允许您禁言某个用户或某个群，只有管理员可以使用。

### Typescript 方法速览

```typescript
class Bot {
  async mute(qq: MemberID, time: number): Promise<void>
  async mute(qq: GroupID): Promise<void>
}
```

### 参数解释

- qq：可以是群成员（单体禁言），也可以是群号（全体禁言）。
- time：禁言时长，单位: s (秒)，在全体禁言时不可指定，在单体禁言时可以指定。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // 打开你熟悉的烧0 Bot。（喜报：无头客户端处发生错误。）（灵注：草，血压upup）（null：腾讯：我去，服务器都要被这bot烧坏了）（🥵🥵🥵🥵🥵🥵）
  })
  // 今天我们的烧0 Bot要当1（其实null老师没当过1）。那么我们来给null老师塞口球吧！
  // 当然，能给null老师塞口球的前提是你的权限要比null老师高，不然一转攻势，让null老师给你塞口球就寄了。
  await bot.mute(
    {
      group: 287105198, // null所在的群。虽然你仍然可以把null老师拉进新的群，然后立刻给null老师塞口球以达到目的，但是我建议您进这个群，把93的号盗取了，再给null老师塞上口球。（null：？）
      qq: 0 // 我们不想被欧盟罚款，于是我们尊重null老师和您的隐私。（null：好亚萨西）在这里，你可以把它看成null老师的QQ（Accept All），也可以把**他**看成0（Reject）。
    },
    114514
  ) // 给null塞上长达114514秒（我数学不好，这很有可能是10年甚至9年）的口球。（中二：？）（null：？）（灵：？）
  // Null老师的形象全部Crash and burn了。空军激怒！这是不平等对待！
  // 我们在注释里发现了少量代码（草），我们在注释里发现了大量烧鸡（🥵🥵🥵🥵🥵🥵），我们在烧鸡里发现了少量注释。这是哲学的。
  // 您好！这里是WhitrayHB的烧鸡摊。请问您要多少烧鸡？
  // 在编写过程中，我们发现有人疯狂对着Markdown下断点。我们理解您希望运行Doctest的心情，但这不是Rust。
})()
```
