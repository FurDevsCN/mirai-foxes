# Avatar

Avatar 允许您获得用户头像或群头像。

### Typescript 方法速览

```typescript
async function Avatar(
  type: 'user',
  qq: UserID,
  res: 640 | 140 | 100
): Promise<Buffer>
async function Avatar(
  type: 'group',
  qq: GroupID
): Promise<Buffer>
```

### 参数解释

- type：要获取的类型（获取用户'user'，获取群聊'group'）。
- qq：对象的QQ号。
- res(在type指定为user时)：解像度（分辨率）。可以指定为640(640\*640px)或140(140\*140px)或100(100\*100px)。
- cover(在type指定为group时)：若指定为avatar，则获得群头像，否则获得群封面。

### 返回内容

图像的Buffer数据。

### 使用示范

```typescript
import { Avatar } from 'mirai-foxes'
(async () => {
  const data: Buffer = await Avatar('group', 114514) // 获得114514的群头像
})()
```