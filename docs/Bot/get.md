# get

get 允许您获取群成员设置或群信息。

### Typescript 方法速览

```typescript
class Bot {
  async get(info: MemberID): Promise<Member>
  async get(info: GroupID): Promise<GroupInfo>
}
```

### 参数解释

- info：上下文对象或者群号。

### 返回内容

当 info 是群号时，返回群信息。  
当 info 是群成员时，返回群成员设置。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.get(0) // 群
})()
```
