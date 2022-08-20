# mkdir

mkdir 允许您根据路径获取文件或文件夹。

### Typescript 方法速览

```typescript
class FileManager {
  async mkdir(name: string): Promise<Directory>
}
```
### 参数解释

- name：文件夹名。

### 返回内容

返回创建文件夹的实例。

### 使用示范

```typescript
import { Bot } from 'mirai-foxes'
;(async () => {
  let bot: Bot = new Bot()
  await bot.open({
    // ...
  })
  await bot.file(0).mkdir('awa') // 创建文件夹
})()
```
