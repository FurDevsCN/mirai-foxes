# upload

upload负责上传图片或语音以供发送使用。

### Typescript 方法速览

```typescript
class Bot {
  async upload(
    type: ['image', 'friend' | 'group' | 'temp'],
    option: UploadOption
  ): Promise<TemplateImage>
  async upload(
    type: ['voice', 'friend' | 'group' | 'temp'],
    option: UploadOption
  ): Promise<Voice>
}
```

### 参数解释

- type[0]：指定上传图片还是上传语音。
- type[1]：指定图片的用途（用于发给好友/发给群聊/发给临时消息）。
- option：上传选项。以下是对其内容的解释。
  - data：二进制Buffer数据。
  - suffix：文件后缀（文件类型）。

### 返回内容

（当上传图片时）返回可用于构造FlashImage或Image的对象。

（当上传语音时）返回语音对象。

### 使用示范

```typescript
import { Bot, Message } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.send('friend',{
    qq: 0,
    message: [new Message.Image(await bot.upload(["image","friend"],{
      data: get("涩图..."),
      suffix: "png"
    }))]
  }) // ？
  await bot.send('friend',{
    qq: 0,
    message: [new Message.Image(await bot.upload(["voice","friend"],{
      data: get("福瑞控喘息.slk"),
      suffix: "slk",
    }))]
  }) // 语音
})()
```
