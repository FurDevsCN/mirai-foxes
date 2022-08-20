# anno

anno 允许你获取群公告列表，删除群公告或发布群公告。

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
- op（如果是remove）：要删除的公告。
- op（如果是publish）：发布选项，以下是发布的解释。
- - content：公告内容。
- - pinned：是否置顶。

### 返回内容

（列出公告的情况下）返回公告列表（参见基础类型）。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.anno("list", 0) // 获得公告列表
})()
```
