# mkdir

mkdir 允许您根据路径获取文件或文件夹。

### Typescript 方法速览

```typescript
class Directory {
  async mkdir(name: string): Promise<Directory>
}
```
### 参数解释

- name：文件夹名。

### 返回内容

返回创建文件夹的实例。

### 使用示范

```typescript
import { Bot, File } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await (await bot.file(0).get('文件夹')) as File.Directory).mkdir('awa') // 创建文件夹
})()
```
