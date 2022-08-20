# update

update 允许你更新文件信息。

### Typescript 方法速览

```typescript
class File {
  async update(): Promise<this>
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
  await (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).update() // 上传文件后更新文件信息
})()
```
