# image

image负责~~传点涩图~~上传图片以供发送使用。

### Typescript 方法速览

```typescript
class Bot {
  async image(
    type: 'friend' | 'group' | 'temp',
    {
      img,
      suffix = 'jpg'
    }: {
      img: Buffer
      suffix?: string
    }
  ): Promise<{ imageId: string; url: string; path: '' }>
}
```

### 参数解释

- type：指定图片的用途（用于发给好友/发给群聊/发给临时消息）。
- img(解构参数)：图像内容。
- suffix(解构参数)：图片的类型，默认为jpg。

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
    message: [new Message.Image(await bot.image("friend",{
      img: get("涩图..."),
      suffix: "png"
    }))]
  }) // ？
})()
```
