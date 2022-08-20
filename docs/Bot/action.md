# action

action 允许你解禁某个用户或某个群，只有管理员可以使用。

### Typescript 方法速览

```typescript
class Bot {
  async action(
    event: NewFriendRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  async action(
    event: MemberJoinRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'ignore' | 'ignoredie' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  async action(
    event: BotInvitedJoinGroupRequestEvent,
    option: {
      action: 'accept' | 'refuse'
      message?: string
    }
  ): Promise<void>
}
```

### 参数解释

- event：要响应的事件。
- option：选项。
- - action：要进行的操作。"accept":同意。"refuse":拒绝。"ignore":忽略。"ignoredie":忽略并不再受理此请求。"refusedie":拒绝并不再受理此请求。
- - message：附带的信息。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.action({...}, {
    action: 'refuse',
    message: '爬'
  })
})()
```