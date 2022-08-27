# detail

detail 允许您获取文件夹属性信息。

### Typescript 方法速览

```typescript
class Directory {
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
  (await bot.file(0).get('directory')).detail // 上传文件后获得文件信息
})()
```

