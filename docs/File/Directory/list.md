# list

list 允许您列出文件和文件夹列表。

### Typescript 方法速览

```typescript
class Directory {
  async list(): Promise<(File | Directory)[]>
}
```

### 返回内容

返回文件和文件夹的列表。

### 使用示范

```typescript
import { Bot, File } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await (await bot.file(0).get('文件夹') as File.Directory).list() // 列出文件列表
})()
```
