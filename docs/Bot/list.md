# list

list允许您列出好友/群/群成员。

### Typescript 方法速览

```typescript
class Bot {
  async list(type: 'friend'): Promise<User[]>
  async list(type: 'group'): Promise<Group[]>
  async list(type: 'member', id: GroupID): Promise<Member[]>
}
```

### 参数解释

- type：要列出的类型（好友、群聊或者群员）。
- id（当需要列出成员时）：群号。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.list('member',0) // 获取群员列表
})()
```
