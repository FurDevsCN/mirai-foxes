# FileManager

FileManager 类是群文件的根目录。可以用以下方式新建一个 FileManager 实例：

```js
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot = new Bot()
  await bot.open({...})
  bot.file(0)
})()
```

以下是 FileManager 类拥有的方法导航。

- 列出文件列表 -> [list](list.md)
- 根据ID获得文件 -> [id](id.md)
- 根据文件名获得文件/文件夹 -> [get](get.md)
- 创建文件夹 -> [mkdir](mkdir.md)
- 上传文件 -> [upload](upload.md)
