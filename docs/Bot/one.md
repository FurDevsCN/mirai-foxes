# one

one负责注册一个**一次性的**事件监听器。

### Typescript 方法速览

```typescript
class Bot {
  one<T extends EventType>(
    type: T,
    callback: Processor<T>,
    strict = false
  ): void
}
```

### 参数解释

- type：要注册的事件类型。事件是`EventType`内的任何一个（参见基础类型）。
- callback：回调函数，允许同步或异步。注意：函数的参数和`type`存在对应关系。
- strict：是否严格检测。若不启用严格检测，则不等待事件执行完成就移除监听器，否则等待事件处理完成再移除监听器。

### 注意

一旦注册一次性监听器就不可以在其触发前移除监听器，因为若`one`方法返回事件唯一标识，则无法确定其失效时间。

**

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  bot.one('FriendMessage',async data => {
    // 进行一些处理...
  })
  // 这个监听器只会触发一次
})()
```
