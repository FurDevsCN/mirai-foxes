# list

list 允许您列出文件和文件夹列表。

### Typescript 方法速览

```typescript
class FileManager {
  async list(): Promise<(File | Directory)[]>
}
```

### 返回内容

返回文件和文件夹的列表。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.file(0).list() // 列出文件列表
})()
```
