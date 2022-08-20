# upload

upload 允许您上传文件。

### Typescript 方法速览

```typescript
class FileManager {
  async upload(file: Buffer, filename: string): Promise<File>
}
```
### 参数解释

- file：文件二进制内容。
- filename：文件名。

### 返回内容

返回上传文件的实例。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.file(0).upload(Buffer.from("graia #1"),'awa') // 上传文件
})()
```
