# unmute

unmute 允许你解禁某个用户或某个群，只有管理员可以使用。

### Typescript 方法速览

```typescript
class Bot {
  async remove(type: 'friend', option: RemoveOption<UserID>): Promise<void>
  async remove(type: 'group', option: RemoveOption<GroupID>): Promise<void>
  async remove(type: 'member', option: RemoveOption<MemberID>): Promise<void>
}
```

### 参数解释

- type：可以选择'friend'（移除好友）、'group'（移除群）或'member'（移除群成员）。
- option：移除选项。以下是对其内容的的解释。
- - qq：要移除的目标。
- - message：移除信息，默认为空串 ""，仅在'member'情况下可以指定。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.remove('member', {
    group: 0,
    qq: 0
  }) // 给张飞机票
})()
```
