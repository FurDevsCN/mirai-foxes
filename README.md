# mirai-foxes

[![CI Status](https://github.com/FurryR/mirai-foxes/actions/workflows/typescript.yml/badge.svg)](https://github.com/FurryR/mirai-foxes/actions/workflows/typescript.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/furryr/mirai-foxes/badge)](https://www.codefactor.io/repository/github/furryr/mirai-foxes)
[![HitCount](https://hits.dwyl.com/FurryR/mirai-foxes.svg?style=flat-square)](http://hits.dwyl.com/FurryR/mirai-foxes)

mirai-foxes，一个根据 [Mirai-js](https://github.com/Drincann/Mirai-js) 代码重写，运行在 Node.js 下的 Typescript QQ 机器人开发框架。

在 Mirai-js 代码的基础上进行了一些修正，总体提高了代码的可读性，并添加了几个新功能（~~还从别的框架抄了点功能过来~~）。

适合那些觉得 mirai-ts 不够顺手又无法忍受 Mirai-js 类型注释不足的 Devs。同样也适合 Mirai-js 用户！

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

若您是在 Node.js 模块内看到此说明文档，很抱歉地告诉您，为了加快下载速度，npm 库不会提供`docs/`和`src/`文件夹。请访问[Github](https://github.com/FurryR/mirai-foxes)来获得更多信息。

点击这里访问[mirai-foxes 开发文档](./docs/README.md)。

# 比较

[mirai-ts](https://github.com/YunYouJun/mirai-ts)：

> 类型注释和本项目相似（更好？），内部代码优雅程度比本项目好（有时候也可能是本项目比 mirai-ts 好，~~开发者本当会写 Typescript~~），但是本项目的构造参数写得比 mirai-ts 好，支持监听的~~冷门~~事件也比 mirai-ts 稍微多一点点。

[node-mirai](https://github.com/RedBeanN/node-mirai)：

> 泛用性较本项目好（只需变更 listen 就可以完成对群组/用户消息的监听），类型注释较本项目略为不足，接口较本项目复杂。

[Mirai-js](https://github.com/Drincann/Mirai-js)：

> 本项目较 Mirai-js 多出了完整的类型注释，但本项目的 Middleware 较 Mirai-js 功能更弱（我懒得重写，~~要写暑假作业了~~）（~~加上数据放 data 里的方式太迷惑了~~），仅有部分简单中间件（~~借鉴 Ariadne~~），虽然能满足基本的命令匹配需求，但操作起来可能仍然比较棘手。

[graiax](https://graiax.cn)

> 从语言上来讲没有可比性，但是从特性上来讲graiax有mirai-foxes没有的很多特性，但是mirai-foxes较graiax简单很多且mirai-foxes更易上手。仅当您需要一些高级特性，或长远来讲需要高度模块化的时候才考虑graiax。
> 若您没有熟练使用Python并希望写小项目，请更多考虑nonebot。若您还未决定好使用什么语言且希望越简单越好，请使用Javascript/Typescript侧的库（比如mirai-ts或本项目）。
> 如果您熟练掌握Python（typing和各种设计模式），能够接受高耦合、强主观的框架且愿意勤查文档，则我们十分推荐graiax，因为它和其他库配合得很好，且大部分来自于其他bot的插件等可以被快速重用。在nonebot则会遇到严重的接口兼容性问题。

## 支持这个项目

我是[FurDevsCN](https://github.com/FurDevsCN)开发组的一名成员。如果您希望支持这个项目，可以访问我们的页面来获得更多信息（~~您总不可能让我去开 Patreon 或者爱发电~~）。

如果觉得这个项目还不错的话，就动动小手给个 star 吧！

## 感谢

### Code editing. **Redefined.**

本项目使用免费且自由的 [Visual Studio Code](https://code.visualstudio.com/) 完成开发。

同时也推荐您使用 [JetBrains](https://www.jetbrains.com/) 开发工具。
