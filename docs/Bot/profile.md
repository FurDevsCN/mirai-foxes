# profile

profile 允许您获取好友，成员，用户或者Bot的信息。

### Typescript 方法速览

```typescript
class Bot {
  /**
   * 获取用户信息
   * @param type   可以为"friend" 或 "member" 或 "user" 或 "bot"。在某些情况下friend和user可以混用，但获得信息的详细程度可能不同。
   * @param target 上下文。
   * @returns      用户资料
   */
  async profile(type: 'friend', target: UserID): Promise<Profile>
  async profile(type: 'member', target: MemberID): Promise<Profile>
  async profile(type: 'user', target: UserID): Promise<Profile>
  async profile(type: 'bot', target: void): Promise<Profile>
}
```

### 参数解释

- type：要获取的类型。
- target：好友QQ号，群号，群成员QQ号或者不填（获取Bot自身的时候）。

### 返回内容

用户资料。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.profile('friend',0) // 获取用户资料
})()
```
