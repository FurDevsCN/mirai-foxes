# download

download 允许您获取文件的下载信息。

### Typescript 方法速览

```typescript
class File {
  async download(): Promise<DownloadInfo>
}
```

### 返回内容

返回下载信息（参见 DownloadInfo 说明）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).download() // 上传文件后下载
})()
```
