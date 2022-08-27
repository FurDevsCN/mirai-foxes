# Directory

Directory 类是群文件的单个文件夹。可以用以下方式新建一个 Directory 实例：

```js
import { Bot, File } from 'mirai-foxes'
;(async () => {
  let bot = new Bot()
  await bot.open({...})
  bot.file(0).get('一个文件夹') as File.Directory
})()
```

以下是 Directory 类拥有的方法导航。

- 列出文件列表 -> [list](list.md)
- 根据文件名获得文件/文件夹 -> [get](get.md)
- 创建文件夹 -> [mkdir](mkdir.md)
- 上传文件 -> [upload](upload.md)
- 更新文件信息 -> [update](update.md)
- 文件属性信息 -> [detail](detail.md)
