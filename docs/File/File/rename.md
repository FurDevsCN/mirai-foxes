# move

move 允许您重命名文件。

### Typescript 方法速览

```typescript
class File {
  async rename(name: string): Promise<this>
}
```

### 参数解释

- dir：目标文件夹。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).rename(...) // 上传文件后重命名
})()
```
