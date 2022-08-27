# Bot

Bot 类负责对机器人的操作。可以用以下方式新建一个 Bot 实例（未打开连接）：

```js
import { Bot } from 'mirai-foxes'
let bot = new Bot()
```

以下是 Bot 类拥有的方法导航。

- 打开连接 -> [open](open.md)
- 关闭连接 -> [close](close.md)
- 发送消息 -> [send](send.md)
- 获取配置 -> [config](config.md)
- 撤回消息 -> [recall](recall.md)
- 注册事件 -> [on](on.md)
- 注册一次性事件 -> [one](one.md)
- 删除事件 -> [off](off.md)
- 戳一戳！ -> [nudge](nudge.md)
- 手动触发事件 -> [dispatch](dispatch.md)
- 上传图片或语音 -> [upload](upload.md)
- 列出好友/群/群成员 -> [list](list.md)
- 获取群/群成员设置 -> [get](get.md)
- 设定群/群成员设置 -> [set](set.md)
- 获取用户信息 -> [profile](profile.md)
- 获得/发布/删除群公告 -> [anno](anno.md)
- 禁言用户/全体 -> [mute](mute.md)
- 解禁用户/全体 ->  [unmute](unmute.md)
- 移除好友/群成员/群 -> [remove](remove.md)
- 群文件管理器 -> [file](file.md)
- 设置精华消息 -> [essence](essence.md)