# mirai-foxes

[![CodeFactor](https://www.codefactor.io/repository/github/furryr/mirai-foxes/badge)](https://www.codefactor.io/repository/github/furryr/mirai-foxes)
[![HitCount](https://hits.dwyl.com/FurryR/mirai-foxes.svg?style=flat-square)](http://hits.dwyl.com/FurryR/mirai-foxes)

mirai-foxes，一个根据 [Mirai-js](https://github.com/Drincann/Mirai-js) 代码重写，运行在 Node.js 下的 Typescript QQ 机器人开发框架。

在 Mirai-js 代码的基础上进行了一些修正，总体提高了代码的可读性，并添加了几个新功能（~~还从别的框架抄了点功能过来~~）。

适合那些觉得 mirai-ts 不够顺手又无法忍受 Mirai-js 类型注释不足的 Devs。同样也适合 Mirai-js 用户！

```typescript
import { Middleware, Bot, Message, Event } from 'mirai-foxes'
bot.on(
  'FriendMessage',
  new Middleware.Middleware()
    .parser()
    .user()
    .filter([Middleware.userFilter([0])])
    .matcher([Middleware.cmdMatch('hello')])
    .done(async (data: Event.FriendMessage) => {
      await bot.send('friend', {
        qq: data.sender.id,
        message: [new Message.Plain('Hello World!')]
      })
    })
)
```

# 开发文档

若您是在Node.js 模块内看到此说明文档，很抱歉地告诉您，为了加快下载速度，npm库不会提供`docs/`和`src/`文件夹。请访问[Github](https://github.com/FurryR/mirai-foxes)来获得更多信息。

点击这里访问[mirai-foxes 开发文档](./docs/README.md)。

# 比较

[mirai-ts](https://github.com/YunYouJun/mirai-ts)：

> 类型注释和本项目相似（更好？），内部代码优雅程度比本项目好（有时候也可能是本项目比 mirai-ts 好，~~开发者本当会写 Typescript~~），但是本项目的构造参数写得比 mirai-ts 好，支持监听的~~冷门~~事件也比 mirai-ts 稍微多一点点。

[node-mirai](https://github.com/RedBeanN/node-mirai)：

> 泛用性较本项目好（只需变更 listen 就可以完成对群组/用户消息的监听），类型注释较本项目略为不足，接口较本项目复杂。

[Mirai-js](https://github.com/Drincann/Mirai-js)：

> 本项目较 Mirai-js 多出了完整的类型注释，但本项目的 Middleware 较 Mirai-js 功能更弱（我懒得重写，~~要写暑假作业了~~）（~~加上数据放 data 里的方式太迷惑了~~），仅有部分简单中间件（~~借鉴 Ariadne~~），虽然能满足基本的命令匹配需求，但操作起来可能仍然比较棘手。

## 支持这个项目

我是[FurDevsCN](https://github.com/FurDevsCN)开发组的一名成员。如果你希望支持这个项目，可以访问我们的页面来获得更多信息（~~你总不可能让我去开Patreon或者爱发电~~）。

如果觉得这个项目还不错的话，就动动小手给个 star 吧！

## 感谢

### Code editing. **Redefined.**

本项目使用免费且自由的 [Visual Studio Code](https://code.visualstudio.com/) 完成开发。

同时也推荐您使用 [JetBrains](https://www.jetbrains.com/) 开发工具。
