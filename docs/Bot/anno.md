# anno

anno 允许您获取群公告列表，删除群公告或发布群公告。

### Typescript 方法速览

```typescript
class Bot {
  async anno(type: 'list', group: GroupID): Promise<Announcement[]>
  async anno(type: 'remove', group: GroupID, op: Announcement): Promise<void>
  async anno(type: 'publish', group: GroupID, op: AnnoOption): Promise<void>
}
```

### 参数解释

- type：指定对公告进行的操作。
- group：群号。
- op（如果是 remove）：要删除的公告。
- op（如果是 publish）：发布选项，以下是发布的解释。
- - content：公告内容。
- - pinned：是否置顶。

### 返回内容

（列出公告的情况下）返回公告列表（参见基础类型）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // Open our burning 0 bot as usual. （अपना बर्न 0 रोबोट हमेशा की तरह खोलें）（Откройте своего робота Burn 0, как обычно.）（WHB注：我觉得再这样下去这个文档可以作为各类外语的学习材料了）(灵注：草)
    // 我们的烧0 Bot做了英语，日语，中文和印地语的地区化，但是我惊讶地发现——居然没有德语。（百度翻译
    // 说真的，我已经开始怀疑有没有这个帐号了。（答案是：我也不知道
  })
  // 现在，假设你的烧0和null的已经有不错的关系（是对象）了，然后你进了他的亲友群。现在你想把null老师发送的每一篇发病文章（是的，他在群公告写文章）都截下来，然后晚上对着冲。
  console.log(
    await bot.anno(
      'list',
      630540720 // 这是什么？啊，这是null老师亲友群的群号。虽然它是假的，不过我建议你加进去，这样你就可以和另一个框架——Graia-Ariadne亲密贴贴（反向挖人？）。（魔女：？）
    )
  ) // 获得公告列表并输出到控制台。接下来，你就可以复制并保存它们，即使null老师把它们删了，你也可以继续欣赏。（我说一句，没人会这么变态吧？）（太烧啦，烧死我啦）
  // 由于null老师停止监工，示例的浓度下降了很多。果然，一个烧0的创造力是最强的，烧0走了，剩下一堆1自然也写不出什么来。（不过实际上，烧0搭配一堆1的干（整）活效率才是最高的）（null：？）
  // 在写这个示例的时候，我们收到了一个悲伤的消息——小霖念停止维护了。这意味着，我们失去了日后追（迫）忆（害）霖念的机会，非常伤心。（其实，Simple-Transfur-Bot 的重构一直在
  // 在我使用“Graia-Ariadne”这个词汇的时候，魔女说：“为什么连字符和大写一起用了？”，实际上是因为我也不知道别的叫法。
  // null：GraiaAriadne | graia-ariadne （都可以的（null：大概？不过我是习惯用 CamelCase 叫 GraiaAriadne
  // 好吧，我很幸运地一个也没有叫对，但是graia-ariadne真的是一个很好的框架。
  // 我发现这是一次非授权联动，故null老师发了一段到Graia Framework的群里。BlueGlassBlock看后直言：“这文档闻所未闻，比起 graiax 浓度高了 998244353 倍。”是啊，福瑞控写的文档，怎么会不浓呢？
})()
```
