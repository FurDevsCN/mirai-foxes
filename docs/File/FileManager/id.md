# id

id 允许你根据id获取文件或文件夹。

### Typescript 方法速览

```typescript
class FileManager {
  async id(id: string): Promise<File | Directory>
}
```
### 参数解释

- id: 文件或文件夹的id。

### 返回内容

如果文件或文件夹存在，则返回文件或文件夹的实例。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.file(0).id('/114514') // 由ID获取文件或文件夹
})()
```
