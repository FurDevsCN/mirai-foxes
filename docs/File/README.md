# File

File 命名空间负责对群文件的操作。可以用以下方式新建一个 File.FileManager 实例：

```js
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot = new Bot()
  await bot.open({...})
  bot.file(0)
})()
```

以下是 File 命名空间拥有的类/接口导航。

- 下载信息 -> [DownloadInfo](DownloadInfo.md)
- 文件信息 -> [FileDetail](FileDetail.md)
- 文件管理器 -> [FileManager](FileManager/README.md)
- 文件 -> [File](File/README.md)
- 文件夹 -> [Directory](Directory/README.md)
