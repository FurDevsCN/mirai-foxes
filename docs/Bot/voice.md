# voice

voice与image相对，负责~~传点娇喘~~上传语音以供发送使用。

### Typescript 方法速览

```typescript
class Bot {
  async voice(
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

- type：指定语音的用途（用于发给好友/发给群聊/发给临时消息）。
- img(解构参数)：语音内容。
- suffix(解构参数)：语音的类型，默认为amr。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.send('friend',{
    qq: 0,
    message: [await bot.voice("friend",{
      img: get("娇喘..."),
      suffix: "amr"
    })]
  }) // 你们这个文档害人不浅啊
})()
```
