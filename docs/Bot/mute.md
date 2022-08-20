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
    // ...
  })
  await bot.mute(
    {
      group: 0,
      qq: 0
    },
    114514
  ) // 给0塞点114514秒的口球
})()
```
