# Middleware

Middleware 命名空间负责处理/过滤信息。

以下是构造 Middleware 的方法：

```typescript
import { Middleware } from 'mirai-foxes'
Middleware.Middleware<'FriendMessage'>({
  // 不指定的话下面的data会变成联合类型，只能使用messageChain
  matcher: [],
  parser: [Middleware.parseCmd]
})(
  async data => {
    // 必须要指定data的类型，不然会有隐式any的问题
    // ...
  }
  // data.messageChain是被分割处理过的
) // 这里是包装器
// 可以直接把返回的内容作为事件监听器。
```

### Typescript 方法速览

```typescript
function Middleware({
  matcher,
  parser,
  filter
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
  filter: ['user', ((data: FriendMessage) => boolean)[]]
}): (fn: Processor<'FriendMessage'>) => Processor<'FriendMessage'>
function Middleware({
  matcher,
  parser,
  filter
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
  filter: ['group', ((data: GroupMessage) => boolean)[]]
}): (fn: Processor<'GroupMessage'>) => Processor<'GroupMessage'>
function Middleware<
  T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'
>({
  matcher,
  parser
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
}): (fn: Processor<T>) => Processor<T>
```

### 参数解释

- T（模板参数）：事件的类型。如果指定了`filter`则不用指定此参数。构造通用函数时若不指定会导致实际函数的参数变成联合类型。
- matcher：匹配器。参见`Middleware`命名空间中的内容。
- parser：解析器。参见`Middleware`命名空间中的内容。
- filter：过滤器。要求第一个元素为`user`或`group`用于标识是好友消息还是群消息，第二个元素为匹配器列表。

### 返回内容

返回一个包装器。您可以在包装器里面编写实际函数。包装器的返回值是实际事件。

示例：

```ts
import { Bot, Middleware } from 'mirai-foxes'
const bot = new Bot()
const event = Middleware.Middleware({...})(
  async data => {
    // 实际函数
  }
)
bot.on('FriendMessage', event)
```
