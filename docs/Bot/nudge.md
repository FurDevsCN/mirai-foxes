# nudge

nudge负责~~和好友亲密贴贴~~发送戳一戳。

### Typescript 方法速览

```typescript
class Bot {
  async nudge(qq: UserID | MemberID): Promise<void>
}
```

### 参数解释

- qq：可以是好友QQ号，也可以是成员（参见基础类型）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.nudge(0) // 贴贴！
})()
```
