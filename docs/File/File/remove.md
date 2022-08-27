# remove

remove 允许您删除文件。

### Typescript 方法速览

```typescript
class File {
  async remove(): Promise<void>
}
```

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).remove() // 上传文件后删除
})()
```
