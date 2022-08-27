# update

update 允许您更新文件夹信息。

### Typescript 方法速览

```typescript
class Directory {
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
  await (await bot.file(0).get('文件夹')).update() // 更新文件夹信息
})()
```
