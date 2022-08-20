# File

File 类是群文件的单个文件。可以用以下方式新建一个 File 实例：

```js
import { Bot, File } from 'mirai-foxes'
;(async () => {
  let bot = new Bot()
  await bot.open({...})
  bot.file(0).get('一个文件') as File.File
})()
```

以下是 File 类拥有的方法导航。

- 下载信息 -> [download](download.md)
- 删除文件 -> [remove](remove.md)
- 移动文件 -> [move](move.md)
- 重命名 -> [rename](rename.md)
- 更新文件信息 -> [update](update.md)
- 文件属性信息 -> [detail](detail.md)
