import { GroupID, UserID } from './Base'
import { EventArg, FriendMessage, GroupMessage, Processor } from './Event'
import { At, MessageBase, MessageChain, MessageType, Plain } from './Message'
class GroupFilter {
  private _filt: GroupID[] = []
  private _memberfilt: Map<GroupID, UserID[]> = new Map()
  groupFilter(id: GroupID[]): this {
    this._filt = id
    return this
  }
  memberFilter(id: Map<GroupID, UserID[]>): this {
    this._memberfilt = id
    return this
  }
  done(fn: Processor<'GroupMessage'>): Processor<'GroupMessage'> {
    return async (data: GroupMessage): Promise<void> => {
      if (this._filt.includes(data.sender.group.id)) {
        if (this._memberfilt.has(data.sender.group.id)) {
          const q = this._memberfilt.get(data.sender.group.id)
          if (q && !q.includes(data.sender.id)) return
        }
        await fn(data)
      }
    }
  }
}
class UserFilter {
  private _filt: UserID[] = []
  userFilter(id: UserID[]): this {
    this._filt = id
    return this
  }
  done(fn: Processor<'FriendMessage'>): Processor<'FriendMessage'> {
    return async (data: FriendMessage): Promise<void> => {
      if (this._filt.includes(data.sender.id)) await fn(data)
    }
  }
}
/**
 * 消息匹配处理器
 */
class Matcher {
  private _matchers: ((val: MessageChain) => boolean)[] = []
  private chain2str(v: MessageChain): string {
    let m = ''
    for (const d of v.slice(1)) {
      if (d.type == 'Plain') m += (d as Plain).text
      else m += `[${d.type}]`
    }
    return m
  }
  keywordMatch(val: string): this {
    this._matchers.push((v: MessageChain): boolean =>
      this.chain2str(v).includes(val)
    )
    return this
  }
  prefixMatch(val: string): this {
    this._matchers.push((v: MessageChain): boolean =>
      this.chain2str(v).startsWith(val)
    )
    return this
  }
  suffixMatch(val: string): this {
    this._matchers.push((v: MessageChain): boolean =>
      this.chain2str(v).endsWith(val)
    )
    return this
  }
  contentMatch(val: MessageBase[]): this {
    this._matchers.push((v: MessageChain): boolean => v.slice(1) == val)
    return this
  }
  templateMatch(type: MessageType[]): this {
    this._matchers.push(
      (v: MessageChain): boolean =>
        v.length - 1 == type.length &&
        v
          .slice(1)
          .every(
            (value: MessageBase, index: number): boolean =>
              value.type == type[index]
          )
    )
    return this
  }
  regexMatch(reg: RegExp): this {
    this._matchers.push(
      (v: MessageChain): boolean => this.chain2str(v).match(reg) != undefined
    )
    return this
  }
  mention(qq: UserID): this {
    this._matchers.push(
      (v: MessageChain): boolean =>
        !v
          .slice(1)
          .every(
            (x: MessageBase) => !(x.type == 'At' && (x as At).target == qq)
          )
    )
    return this
  }
  done<T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'>(
    fn: Processor<T>
  ): Processor<T> {
    return async (data: EventArg<T>): Promise<void> => {
      if (
        this._matchers.every((v: (data: MessageChain) => boolean) =>
          v(data.messageChain)
        )
      )
        await fn(data)
    }
  }
}
/**
 * 命令处理器
 */
class Parser {
  private enable = false
  private lexer(cmd: MessageChain): MessageChain {
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
  cmd(): this {
    this.enable = true
    return this
  }
  done<T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'>(
    fn: Processor<T>
  ): Processor<T> {
    return async (data: EventArg<T>): Promise<void> => {
      if (this.enable) data.messageChain = this.lexer(data.messageChain)
      await fn(data)
    }
  }
}

class MiddlewareBase {
  private matcher: Matcher
  private parser: Parser
  /**
   * 关键字（全文/模糊）匹配。
   * @param val 内容。
   * @returns this
   */
  keywordMatch(val: string): this {
    this.matcher.keywordMatch(val)
    return this
  }
  /**
   * 文本前缀匹配。
   * @param val 内容。
   * @returns this
   */
  prefixMatch(val: string): this {
    this.matcher.prefixMatch(val)
    return this
  }
  /**
   * 文本后缀匹配。
   * @param val 内容。
   * @returns this
   */
  suffixMatch(val: string): this {
    this.matcher.suffixMatch(val)
    return this
  }
  /**
   * 内容完全匹配。
   * @param reg 正则表达式对象。
   * @returns this
   */
  contentMatch(reg: MessageBase[]): this {
    this.matcher.contentMatch(reg)
    return this
  }
  /**
   * 消息格式匹配。
   * @param type
   * @returns this
   */
  templateMatch(type: MessageType[]): this {
    this.matcher.templateMatch(type)
    return this
  }
  /**
   * 文字正则匹配。
   * @param reg 正则表达式对象。
   * @returns this
   */
  regexMatch(reg: RegExp): this {
    this.matcher.regexMatch(reg)
    return this
  }
  /**
   * 是否提到某人。
   * @param qq 这个人的qq号。
   * @returns this
   */
  mention(qq: UserID): this {
    this.matcher.mention(qq)
    return this
  }
  /**
   * 启用命令解释器
   * @returns this
   */
  cmd(): this {
    this.parser.cmd()
    return this
  }
  static done<
    T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'
  >(base: MiddlewareBase, fn: Processor<T>): Processor<T> {
    return base.parser.done(
      base.matcher.done(async (data: EventArg<T>): Promise<void> => {
        await fn(data)
      })
    )
  }
  constructor(n?: MiddlewareBase) {
    if (n) [this.matcher, this.parser] = [n.matcher, n.parser]
    else [this.matcher, this.parser] = [new Matcher(), new Parser()]
  }
}
/**
 * 群聊匹配中间件。
 */
class GroupMiddleware extends MiddlewareBase {
  private filter: GroupFilter = new GroupFilter()
  /**
   * 设定群聊过滤器
   * @param id 群号数组。
   * @returns this
   */
  groupFilter(id: GroupID[]): this {
    this.filter.groupFilter(id)
    return this
  }
  /**
   * 设定成员过滤器
   * @param id 群号->成员QQ号的映射
   * @returns this
   */
  memberFilter(id: Map<GroupID, UserID[]>): this {
    this.filter.memberFilter(id)
    return this
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done(fn: Processor<'GroupMessage'>): Processor<'GroupMessage'> {
    return MiddlewareBase.done(this, this.filter.done(fn))
  }
  constructor(base: MiddlewareBase, filter: GroupFilter) {
    super(base)
    this.filter = filter
  }
}
class UserMiddleware extends MiddlewareBase {
  private filter: UserFilter = new UserFilter()
  /**
   * 设定用户过滤器
   * @param id 群号数组。
   * @returns this
   */
  userFilter(id: UserID[]): this {
    this.filter.userFilter(id)
    return this
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done(fn: Processor<'FriendMessage'>): Processor<'FriendMessage'> {
    return MiddlewareBase.done(this, this.filter.done(fn))
  }
  constructor(base: MiddlewareBase, filter: UserFilter) {
    super(base)
    this.filter = filter
  }
}
export class Middleware extends MiddlewareBase {
  /**
   * 设定群聊过滤器
   * @param id 群号数组。
   * @returns 特化中间件
   */
  groupFilter(id: GroupID[]): GroupMiddleware {
    return new GroupMiddleware(this, new GroupFilter()).groupFilter(id)
  }
  /**
   * 设定成员过滤器
   * @param id 群号->成员QQ号的映射
   * @returns 特化中间件
   */
  memberFilter(id: Map<GroupID, UserID[]>): GroupMiddleware {
    return new GroupMiddleware(this, new GroupFilter()).memberFilter(id)
  }
  /**
   * 设定用户过滤器
   * @param id 群号数组。
   * @returns 特化中间件
   */
  userFilter(id: UserID[]): UserMiddleware {
    return new UserMiddleware(this, new UserFilter()).userFilter(id)
  }
  /**
   * 生成事件处理器
   * @param fn 处理结束后要执行的函数
   * @returns 事件处理器
   */
  done<T extends 'FriendMessage' | 'GroupMessage' | 'OtherClientMessage'>(
    fn: Processor<T>
  ): Processor<T> {
    return MiddlewareBase.done<T>(this, fn)
  }
  constructor() {
    super()
  }
}
