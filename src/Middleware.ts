import { GroupID, UserID } from './Base'
import { FriendMessage, GroupMessage, OtherClientMessage } from './Event'
import { Processor } from './Bot'
import { At, MessageBase, MessageChain, MessageType, Plain } from './Message'
type OneMessage = FriendMessage & GroupMessage & OtherClientMessage
type AllMessage = FriendMessage | GroupMessage | OtherClientMessage
type OneProcessor =
  | Processor<'FriendMessage'>
  | Processor<'GroupMessage'>
  | Processor<'OtherClientMessage'>
type AllProcessor = Processor<
  'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'
>
class GroupFilter {
  private fn: ((data: GroupMessage) => boolean)[] = []
  next(fn: ((data: GroupMessage) => boolean)[]): this {
    this.fn.push(...fn)
    return this
  }
  done(fn: Processor<'GroupMessage'>): Processor<'GroupMessage'> {
    return async (data: GroupMessage): Promise<void> => {
      if (this.fn.every(fn => fn(data))) await fn(data)
    }
  }
}
/**
 * 设定群聊过滤器
 * @param id 群号数组。
 * @returns 特化中间件
 */
export function groupFilter(id: GroupID[]): (data: GroupMessage) => boolean {
  return (data: GroupMessage): boolean => {
    return id.includes(data.sender.group.id)
  }
}
/**
 * 设定成员过滤器
 * @param id 群号->成员QQ号的映射
 * @returns 特化中间件
 */
export function memberFilter(
  id: Map<GroupID, UserID[]>
): (data: GroupMessage) => boolean {
  return (data: GroupMessage): boolean => {
    if (id.has(data.sender.group.id)) {
      const q = id.get(data.sender.group.id)
      if (q && !q.includes(data.sender.id)) return false
    }
    return true
  }
}
class UserFilter {
  private fn: ((data: FriendMessage) => boolean)[] = []
  next(fn: ((data: FriendMessage) => boolean)[]): this {
    this.fn.push(...fn)
    return this
  }
  done(fn: Processor<'FriendMessage'>): Processor<'FriendMessage'> {
    return async (data: FriendMessage): Promise<void> => {
      if (this.fn.every(fn => fn(data))) await fn(data)
    }
  }
}
/**
 * 设定用户过滤器
 * @param id 群号数组。
 * @returns 特化中间件
 */
export function userFilter(id: UserID[]): (data: FriendMessage) => boolean {
  return (data: FriendMessage): boolean => {
    if (id.includes(data.sender.id)) return true
    return false
  }
}
function chain2str(v: MessageChain): string {
  let m = ''
  for (const d of v.slice(1)) {
    if (d.type == 'Plain') m += (d as Plain).text
    else m += `[${d.type}]`
  }
  return m
}
/**
 * 消息匹配处理器
 */
class Matcher {
  private fn: ((data: MessageChain) => boolean)[] = []
  next(fn: ((data: MessageChain) => boolean)[]): this {
    this.fn.push(...fn)
    return this
  }
  done(fn: OneProcessor): AllProcessor {
    return async (data: AllMessage): Promise<void> => {
      if (this.fn.every(fn => fn(data.messageChain)))
        await fn(data as OneMessage)
    }
  }
}
/**
 * 关键字（全文/模糊）匹配。
 * @param val 内容。
 * @returns 装饰器
 */
export function keywordMatch(val: string): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean => chain2str(v).includes(val)
}
/**
 * 命令（除Source外第一个元素，且必须为文本）匹配。（推荐搭配命令解释器）
 * @param val 内容。
 * @returns 装饰器
 */
export function cmdMatch(val: string): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean =>
    v[1].type == 'Plain' && (v[1] as Plain).text == val
}
/**
 * 文本前缀匹配。
 * @param val 内容。
 * @returns 装饰器
 */
export function prefixMatch(val: string): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean => chain2str(v).startsWith(val)
}
/**
 * 文本后缀匹配。
 * @param val 内容。
 * @returns 装饰器
 */
export function suffixMatch(val: string): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean => chain2str(v).endsWith(val)
}
/**
 * 内容完全匹配。
 * @param val 正则表达式对象。
 * @returns 装饰器
 */
export function contentMatch(val: MessageBase[]): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean => v.slice(1) == val
}
/**
 * 消息格式匹配。
 * @param type
 * @returns 装饰器
 */
export function templateMatch(
  type: MessageType[]
): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean =>
    v.length - 1 == type.length &&
    v
      .slice(1)
      .every(
        (value: MessageBase, index: number): boolean =>
          value.type == type[index]
      )
}
/**
 * 文字正则匹配。
 * @param reg 正则表达式对象。
 * @returns this
 */
export function regexMatch(reg: RegExp): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean => chain2str(v).match(reg) != undefined
}
/**
 * 是否提到某人。
 * @param qq 这个人的qq号。
 * @returns this
 */
export function mention(qq: UserID): (v: MessageChain) => boolean {
  return (v: MessageChain): boolean =>
    !v
      .slice(1)
      .every((x: MessageBase) => !(x.type == 'At' && (x as At).target == qq))
}
/**
 * 消息解析处理器
 */
class Parser {
  private fn: ((data: MessageChain) => MessageChain)[] = []
  next(fn: ((data: MessageChain) => MessageChain)[]): this {
    this.fn.push(...fn)
    return this
  }
  done(fn: OneProcessor): AllProcessor {
    return async (data: AllMessage): Promise<void> => {
      let msgchain = data.messageChain
      this.fn.forEach(fn => (msgchain = fn(msgchain)))
      data.messageChain = msgchain
      await fn(data as OneMessage)
    }
  }
}
/**
 * 消息解析处理器。
 * 注意：这个处理器无需生成，请直接使用。
 */
export const parseCmd = (cmd: MessageChain): MessageChain => {
  const f: MessageChain = [cmd[0]]
  for (let i = 1; i < cmd.length; i++) {
    if (cmd[i].type == 'Plain') {
      const s = cmd[i] as Plain
      let temp = ''
      for (let j = 0; j < s.text.length; j++) {
        if (s.text[j] == ' ') {
          if (temp != '') f.push(new Plain(temp))
          temp = ''
        } else temp += s.text[j]
      }
      if (temp != '') f.push(new Plain(temp))
    } else {
      f.push(cmd[i])
    }
  }
  return f
}
class MiddlewareBase {
  private _matcher: Matcher
  private _parser: Parser
  /**
   * 设定匹配装饰器。
   * @param v 匹配装饰器。
   */
  matcher(v: ((v: MessageChain) => boolean)[]): this {
    this._matcher.next(v)
    return this
  }
  /**
   * 启用命令解释器
   * @param v 命令解释器。
   * @returns this
   */
  parser(v: ((data: MessageChain) => MessageChain)[]): this {
    this._parser.next(v)
    return this
  }
  static done(base: MiddlewareBase, fn: OneProcessor): AllProcessor {
    return base._parser.done(
      base._matcher.done(async (data: AllMessage): Promise<void> => {
        await fn(data as OneMessage)
      })
    )
  }
  constructor(n?: MiddlewareBase) {
    if (n) [this._matcher, this._parser] = [n._matcher, n._parser]
    else [this._matcher, this._parser] = [new Matcher(), new Parser()]
  }
}
/**
 * 群聊匹配中间件。
 */
class GroupMiddleware extends MiddlewareBase {
  private _filter: GroupFilter = new GroupFilter()
  /**
   * 设定过滤装饰器
   * @param v 装饰器
   * @returns this
   */
  filter(v: ((data: GroupMessage) => boolean)[]): this {
    this._filter.next(v)
    return this
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done(fn: Processor<'GroupMessage'>): Processor<'GroupMessage'> {
    return MiddlewareBase.done(this, this._filter.done(fn))
  }
  constructor(base: MiddlewareBase, filter: GroupFilter) {
    super(base)
    this._filter = filter
  }
}
class UserMiddleware extends MiddlewareBase {
  private _filter: UserFilter = new UserFilter()
  /**
   * 设定过滤装饰器
   * @param v 装饰器
   * @returns this
   */
  filter(v: ((data: FriendMessage) => boolean)[]): this {
    this._filter.next(v)
    return this
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done(fn: Processor<'FriendMessage'>): Processor<'FriendMessage'> {
    return MiddlewareBase.done(this, this._filter.done(fn))
  }
  constructor(base: MiddlewareBase, filter: UserFilter) {
    super(base)
    this._filter = filter
  }
}
class _Middleware extends MiddlewareBase {
  /**
   * 生成群组过滤器
   * @returns this
   */
  group(): GroupMiddleware {
    return new GroupMiddleware(this, new GroupFilter())
  }
  /**
   * 生成用户过滤器
   * @returns this
   */
  user(): UserMiddleware {
    return new UserMiddleware(this, new UserFilter())
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done(fn: OneProcessor): AllProcessor {
    return MiddlewareBase.done(this, fn)
  }
  constructor() {
    super()
  }
}
/**
 * 生成用于用户消息的中间件。
 * @param option 选项。
 * @param option.filter 用户过滤器列表。
 * @param option.parser 解析器列表。
 * @param option.matcher 匹配器列表。
 */
export function Middleware({
  matcher,
  parser,
  filter
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
  filter: ['user', ((data: FriendMessage) => boolean)[]]
}): (fn: Processor<'FriendMessage'>) => Processor<'FriendMessage'>
/**
 * 生成用于群组消息的中间件。
 * @param option 选项。
 * @param option.filter 群组过滤器列表。
 * @param option.parser 解析器列表。
 * @param option.matcher 匹配器列表。
 */
export function Middleware({
  matcher,
  parser,
  filter
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
  filter: ['group', ((data: GroupMessage) => boolean)[]]
}): (fn: Processor<'GroupMessage'>) => Processor<'GroupMessage'>
/**
 * 生成用于通用消息的中间件。
 * @param option 选项。
 * @param option.parser 解析器列表。
 * @param option.matcher 匹配器列表。
 */
export function Middleware<T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'>({
  matcher,
  parser
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
}): (fn: Processor<T>) => Processor<T>
export function Middleware({
  matcher = [],
  parser = [],
  filter
}: {
  matcher?: ((v: MessageChain) => boolean)[]
  parser?: ((data: MessageChain) => MessageChain)[]
  filter?: [
    'user' | 'group',
    ((data: FriendMessage) => boolean)[] | ((data: GroupMessage) => boolean)[]
  ]
}): (fn: OneProcessor) => AllProcessor {
  const m = new _Middleware()
  if (filter) {
    if (filter[0] == 'user') {
      if (parser) {
        return m
          .user()
          .filter(filter[1] as ((data: FriendMessage) => boolean)[])
          .parser(parser)
          .matcher(matcher ? matcher : []).done as (
          fn: OneProcessor
        ) => AllProcessor
      } else {
        return m
          .user()
          .filter(filter[1] as ((data: FriendMessage) => boolean)[])
          .matcher(matcher ? matcher : []).done as (
          fn: OneProcessor
        ) => AllProcessor
      }
    } else {
      if (parser) {
        return m
          .group()
          .filter(filter[1] as ((data: GroupMessage) => boolean)[])
          .parser(parser)
          .matcher(matcher ? matcher : []).done as (
          fn: OneProcessor
        ) => AllProcessor
      } else {
        return m
          .group()
          .filter(filter[1] as ((data: GroupMessage) => boolean)[])
          .matcher(matcher ? matcher : []).done as (
          fn: OneProcessor
        ) => AllProcessor
      }
    }
  } else {
    if (parser) {
      return m.parser(parser).matcher(matcher ? matcher : []).done
    } else {
      return m.matcher(matcher ? matcher : []).done
    }
  }
}
