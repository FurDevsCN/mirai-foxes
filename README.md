# mirai-foxes

[![CI Status](https://github.com/FurDevsCN/mirai-foxes/actions/workflows/typescript.yml/badge.svg)](https://github.com/FurDevsCN/mirai-foxes/actions/workflows/typescript.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/FurDevsCN/mirai-foxes/badge)](https://www.codefactor.io/repository/github/FurDevsCN/mirai-foxes)
[![HitCount](https://hits.dwyl.com/FurDevsCN/mirai-foxes.svg?style=flat-square)](http://hits.dwyl.com/FurDevsCN/mirai-foxes)

mirai-foxes，一个根据 [Mirai-js](https://github.com/Drincann/Mirai-js) 代码重写，运行在 Node.js 下的 Typescript QQ 机器人开发框架。

在 Mirai-js 代码的基础上进行了一些修正，总体提高了代码的可读性，并添加了几个新功能（~~还从别的框架抄了点功能过来~~）。

适合那些觉得 mirai-ts 不够顺手又无法忍受 Mirai-js 类型注释不足的 Devs。同样也适合 Mirai-js 用户！

如果你希望体验完整的demo，看看[foxes-awesome](https://github.com/FurDevsCN/foxes-awesome)。

```typescript
import { Middleware, Bot, Message, Event } from 'mirai-foxes'
bot.on(
  'FriendMessage',
  Middleware.Middleware({
    filter: ['user', [Middleware.userFilter([0])]],
    parser: [Middleware.parseCmd],
    matcher: [Middleware.cmdMatch('hello')]
  })(async (data: Event.FriendMessage) => {
    await bot.send('friend', {
      qq: data.sender.id,
      message: [new Message.Plain('Hello World!')]
    })
  })
)
```

# 开发文档

mirai-foxes 开发文档 -> [https://furdevscn.github.io/mirai-foxes](https://furdevscn.github.io/mirai-foxes)

# 比较

[mirai-ts](https://github.com/YunYouJun/mirai-ts)：

> 类型注释和本项目相似（更好？），内部代码优雅程度比本项目好（有时候也可能是本项目比 mirai-ts 好，~~开发者本当会写 Typescript~~），但是本项目的构造参数写得比 mirai-ts 好，支持监听的~~冷门~~事件也比 mirai-ts 稍微多一点点。

[node-mirai](https://github.com/RedBeanN/node-mirai)：

> 泛用性较本项目好（只需变更 listen 就可以完成对群组/用户消息的监听），类型注释较本项目略为不足，接口较本项目复杂。

[Mirai-js](https://github.com/Drincann/Mirai-js)：

> 本项目较 Mirai-js 多出了完整的类型注释，但本项目的 Middleware 较 Mirai-js 功能更弱（我懒得重写，~~要写暑假作业了~~）（~~加上数据放 data 里的方式太迷惑了~~），仅有部分简单中间件（~~借鉴 Ariadne~~），虽然能满足基本的命令匹配需求，但操作起来可能仍然比较棘手。

[Graia-Ariadne / Graia-Avilla](https://graiax.cn)

> 从语言上来讲没有可比性，但论设计 mirai-foxes 比 Graia 更简单。
>
> 如果更希望使用 Javascript 的生态或更习惯 Javascript 的设计思维，则可以选择 mirai-foxes。
>
> 对于 Python 聊天机器人编程框架来说，Nonebot 适合~~弱者~~刚刚接触 Python 而不了解 Python 各种特性的初学者。若您有一定 Python 基础并愿意接受较为陡峭的学习曲线，请务必选择 Graia！
>
> ~~（Nonebot 狗都不用，感觉还不如 mirai-js）~~

## 支持这个项目

我是[FurDevsCN](https://github.com/FurDevsCN)开发组的一名成员。如果您希望支持这个项目，可以访问我们的页面来获得更多信息（~~您总不可能让我去开 Patreon 或者爱发电~~）。

如果觉得这个项目还不错的话，就动动小手给个 star 吧！

## 感谢

### Code editing. **Redefined.**

本项目使用免费且自由的 [Visual Studio Code](https://code.visualstudio.com/) 完成开发。

同时也推荐您使用 [JetBrains](https://www.jetbrains.com/) 开发工具。


**Graia Framework** 的开发者为此框架的 API 设计提出了重要建议，在此表示感谢。

**Nullqwertyuiop** 是文档的重要示范对象。由于文档是由多人编辑的，且未经过质量审查，难免包含有对其本人冒犯性的语句。在此对他的包容表示由衷感谢。此外，他还负责了 mirai-foxes 的文档部署，非常感谢。

**FurryHome** 为此框架的 debug 提供了部分支援。在此表示感谢。
