# unmute

unmute 允许你解禁某个用户或某个群，只有管理员可以使用。

### Typescript 方法速览

```typescript
MemberID class Bot {
  async unmute(qq: MemberID | MemberID): Promise<void>
}
```

### 参数解释

- qq：可以是群成员（单体解禁），也可以是群号（全体解禁）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.unmute(
    {
      group: 0,
      qq: 0
    }
  ) // 把口球拔出来
})()
```
