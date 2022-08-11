# on

on负责注册一个事件监听器。

### Typescript 方法速览

```typescript
class Bot {
  on<T extends EventType>(type: T, callback: Processor<T>): EventIndex<T>
}
```

### 参数解释

- type：要注册的事件类型。事件是`EventType`内的任何一个（参见基础类型）。
- callback：回调函数，允许同步或异步。注意：函数的参数和`type`存在对应关系。

### 返回内容

事件唯一标识符。可以用来删除这个监听器。**注意：在事件移除后此标识符将失效，并不可以再使用。**

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  bot.on('FriendMessage',async data => {
    // 进行一些处理...
  })
})()
```
