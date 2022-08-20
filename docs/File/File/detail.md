# detail

detail 允许你获取文件属性信息。

### Typescript 方法速览

```typescript
class File {
  get detail(): FileDetail
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
  (await bot.file(0).upload(Buffer.from('graia #1'), 'awa')).detail // 上传文件后获得文件信息
})()
```

