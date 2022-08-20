# file

file 允许您获得群文件管理器。

### Typescript 方法速览

```typescript
class Bot {
  file(group: GroupID): FileManager
}
```

### 参数解释

- group：要获取管理器的群号。

### 返回内容

群文件管理器（参见群文件管理器文档）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  bot.file(0) // 获取群文件管理器
})()
```
