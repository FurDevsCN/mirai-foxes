# Waiter

Waiter 允许您生成一个等待器（用于`bot.wait`），不需要使用new。

### Typescript 方法速览

```typescript
function Waiter(
  type: 'friend',
  qq: UserID,
  extend?: Matcher<'FriendMessage'>
): Matcher<'FriendMessage'>
function Waiter(
  type: 'member',
  qq: MemberID,
  extend?: Matcher<'GroupMessage'>
): Matcher<'GroupMessage'>
function Waiter(
  type: 'temp',
  qq: MemberID,
  extend?: Matcher<'TempMessage'>
): Matcher<'TempMessage'>
function Waiter(
  type: 'temp',
  qq: UserID,
  extend?: Matcher<'StrangerMessage'>
): Matcher<'StrangerMessage'>
```

### 参数解释

- type：等待的类型（等待好友'friend'，等待成员'member'，等待临时消息或陌生人消息'temp'）。
- qq：对象的QQ号。
- extend：额外附加的匹配器，一般是自己编写的，可以不指定。

### 返回内容

等待器。

### 使用示范

```typescript
import { Bot,Waiter } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.wait('FriendMessage',Waiter('friend',114514)) // 等待114514的消息
})()
```