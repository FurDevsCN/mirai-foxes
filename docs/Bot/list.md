# list

list 允许您列出好友/群/群成员。

### Typescript 方法速览

```typescript
class Bot {
  async list(type: 'friend'): Promise<User[]>
  async list(type: 'group'): Promise<Group[]>
  async list(type: 'member', id: GroupID): Promise<Member[]>
}
```

### 参数解释

- type：要列出的类型（好友、群聊或者群员）。
- id（当需要列出成员时）：群号。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // 烧0 Bot に接続します。（翻译：打开你的烧b）（中二：翻译的好，中二如是说。）(null：信达雅，null如是说)
  })
  // 要舔Null，不可避免地需要保存他在福瑞之家群里的地位，以和其它人作对比，突出null对你是多么重要。（看看null突出
  // 于是，本节会教你如何这样做。请订阅[Youtube @NullIsGay]以获取最新的舔Null指南（。（null：别搜了，啥都没有）（某只鸽子：这就记到小本本上：在YouTube上……创建……@NullIsGay频道）
  console.log(await bot.list('member', 287105198)) // 立刻获得福瑞之家群里的各路saob，与null老师进行对比。（灵注：请选择你的saob群友）(中二注：这文档一定70%都是注释吧（悲）)（凌：我怀疑你在鄙视注释，现在我代表注释保护协会要把你告上法庭。）（中二注：呜呜呜）（null: #CommentLivesMatter）（灵注：速速提上日程）
  // 凌注：你不会觉得没加进去就能运行这个Demo吧？不赶紧加？（null：别来，里面除了我全是saob）（其实null也是saob，只是没其他人sao）
})()
```
