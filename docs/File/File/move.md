# move

move 允许您移动文件。

### Typescript 方法速览

```typescript
class File {
  async move(dir: Directory): Promise<this>
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
  await (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).move(...) // 上传文件后移动
})()
```
