# get

get 允许您设置群成员设置或群信息。

### Typescript 方法速览

```typescript
class Bot {
  async set(
    info: MemberID,
    setting: {
      memberName?: string
      specialTitle?: string
      permission?: 'ADMINISTRATOR' | 'MEMBER'
    }
  ): Promise<void>
  async set(info: GroupID, setting: GroupInfo): Promise<void>
}
```

### 参数解释

- info：上下文对象或者群号。
- setting（如果是群成员设置）：群成员设置。
- * memberName：成员的群名片。
- * specialTitle：成员的群头衔。
- * permission：成员的群权限。
- settings（如果是群设置）：群设置（参见基础类型）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.set(0,{
    // ...
  }) // 设定群设置
})()
```
