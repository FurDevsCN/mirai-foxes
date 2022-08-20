# get

get 允许你根据相对获取文件或文件夹。

### Typescript 方法速览

```typescript
class Directory {
  async get(name: string): Promise<File | Directory>
}
```

### 参数解释

- name：文件或文件夹的路径。

### 返回内容

如果文件或文件夹存在，则返回文件或文件夹的实例。

### 使用示范

```typescript
import { Bot, File } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot
    .open({
      // ...
    })((await bot.file(0).get('文件夹')) as File.Directory)
    .get('涩图') // 由路径获取文件或文件夹
})()
```
