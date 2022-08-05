import { WebSocket } from 'ws'
import _auth from './core/auth'
import _bind from './core/bind'
import _stopListen from './core/listenStop'
import _startListen from './core/listenBegin'
import _releaseSession from './core/release'
import _sendTempMessage from './core/sendTempMsg'
import _sendFriendMessage from './core/sendFriendMsg'
import _sendGroupMessage from './core/sendGroupMsg'
import _sendNudge from './core/sendNudge'
import _recall from './core/recallMsg'
import _uploadImage from './core/uploadImage'
import _uploadVoice from './core/uploadVoice'
import _getFriendList from './core/getFriendList'
import _getGroupList from './core/getGroupList'
import _getMemberList from './core/getMemberList'
import _getMemberInfo from './core/getMemberInfo'
import _getMemberProfile from './core/getMemberProfile'
import _getBotProfile from './core/getBotProfile'
import _getFriendProfile from './core/getFriendProfile'
import _getUserProfile from './core/getUserProfile'
import _setMemberInfo from './core/setMemberInfo'
import _setMemberPerm from './core/setMemberPerm'
import _getAnnoList from './core/anno/getAnnoList'
import _publishAnno from './core/anno/publishAnno'
import _deleteAnno from './core/anno/deleteAnno'
import _mute from './core/mute'
import _muteAll from './core/muteAll'
import _unmute from './core/unmute'
import _unmuteAll from './core/unmuteAll'
import _removeMember from './core/removeMember'
import _removeFriend from './core/removeFriend'
import _quitGroup from './core/quitGroup'
import _getGroupConfig from './core/getGroupConfig'
import _setGroupConfig from './core/setGroupConfig'
import _botInvited from './core/event/botInvited'
import _memberJoin from './core/event/memberJoin'
import _newFriend from './core/event/newFriend'
import _setEssence from './core/setEssence'

import {
  EventIndex,
  EventMap,
  EventType,
  Processor,
  NewFriendRequestEvent,
  MemberJoinRequestEvent,
  BotInvitedJoinGroupRequestEvent,
  EventArg
} from './Event'
import { MessageBase, Voice } from './Message'
import {
  Announcement,
  Group,
  Member,
  Profile,
  User,
  UserID,
  MemberID,
  GroupID,
  GroupInfo
} from './Base'
import { FileManager } from './File'
export interface Config {
  // 账户QQ号。
  qq: UserID
  // 认证密码。
  verifyKey: string
  // websocket地址。mirai-api-http API问题导致不得不同时使用http/ws。
  wsUrl: string
  // http地址。mirai-api-http API问题导致不得不同时使用http/ws。
  httpUrl: string
  // 是否为单账户模式。
  singleMode?: boolean
}
export interface ConfigInit extends Config {
  sessionKey: string
}
export class Bot {
  private conf: undefined | ConfigInit
  private ws: undefined | WebSocket
  private event: EventMap = new Map()
  private waiting: Map<EventType, ((data: unknown) => boolean)[]> = new Map()
  /**
   * ws监听初始化。
   */
  private async __ListenWs(): Promise<void> {
    if (!this.conf) {
      throw new Error('请先设定 this.conf')
    }
    await _bind({
      httpUrl: this.conf.httpUrl,
      sessionKey: this.conf.sessionKey,
      qq: this.conf.qq
    })
    this.ws = await _startListen({
      wsUrl: this.conf.wsUrl,
      sessionKey: this.conf.sessionKey,
      verifyKey: this.conf.verifyKey,
      message: (data: { type: EventType }) => {
        // 如果当前到达的事件拥有处理器，则依次调用所有该事件的处理器
        if (this.event.has(data.type)) {
          if (this.waiting.has(data.type)) {
            const t = this.waiting.get(data.type)
            if (t && t.length > 0) {
              // 此事件已被锁定
              for (const v in t) {
                // 事件被触发
                if (t[v](data)) {
                  delete t[v]
                  return
                }
              }
            }
          }
          this.event
            .get(data.type)
            ?.forEach(
              (i: undefined | Processor): void => void (i ? i(data) : null)
            )
        }
      },
      error: err => {
        const type: EventType = 'error'
        if (this.event.has(type)) {
          if (this.waiting.has(type)) {
            const t = this.waiting.get(type)
            if (t && t.length > 0) {
              // 此事件已被锁定
              for (const v in t) {
                // 事件被触发
                if (t[v](err)) {
                  delete t[v]
                  return
                }
              }
            }
          }
          return this.event
            .get(type)
            ?.forEach(
              (i: undefined | Processor): void => void (i ? i(err) : null)
            )
        }
        console.error('ws error', err)
      },
      close: obj => {
        const type = 'close'
        if (this.event.has(type)) {
          if (this.waiting.has(type)) {
            const t = this.waiting.get(type)
            if (t && t.length > 0) {
              // 此事件已被锁定
              for (const v in t) {
                // 事件被触发
                if (t[v](obj)) {
                  delete t[v]
                  return
                }
              }
            }
          }
          return this.event
            .get(type)
            ?.forEach(
              (i: undefined | Processor): void => void (i ? i(obj) : null)
            )
        }
        console.log('ws close', obj)
      },
      unexpectedResponse: obj => {
        const type = 'unexpected-response'
        if (this.event.has(type)) {
          if (this.waiting.has(type)) {
            const t = this.waiting.get(type)
            if (t && t.length > 0) {
              // 此事件已被锁定
              for (const v in t) {
                // 事件被触发
                if (t[v](obj)) {
                  delete t[v]
                  return
                }
              }
            }
          }
          return this.event
            .get(type)
            ?.forEach(
              (i: undefined | Processor): void => void (i ? i(obj) : null)
            )
        }
        console.error('ws unexpectedResponse', obj)
      }
    })
  }
  /**
   * 获得设置项。
   */
  get config(): ConfigInit {
    if (!this.conf) {
      throw new Error('请先设定 this.conf')
    }
    return this.conf
  }
  /**
   * 获得最新的数据/等待数据。
   * @param type 事件类型。
   * @param matcher 匹配器。当匹配器返回true时才会回传data。
   */
  wait(type: EventType, matcher: (data: unknown) => boolean): Promise<unknown>
  wait<T extends EventType>(
    type: T,
    matcher: (data: EventArg<T>) => boolean
  ): Promise<EventArg<T>>
  wait(
    type: EventType,
    matcher: (data: EventArg<null>) => boolean
  ): Promise<EventArg<null>> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('wait 请先调用 open，建立一个会话')
    }
    return new Promise<unknown>(resolve => {
      const resolver = (data: unknown): boolean => {
        if (matcher(data)) {
          resolve(data)
          return true
        }
        return false
      }
      if (this.waiting.has(type)) {
        this.waiting.get(type)?.push(resolver)
      } else {
        this.waiting.set(type, [resolver])
      }
    })
  }
  /**
   * 关闭机器人连接。
   * @param option 选项。
   * @param option.keepProcessor 是否保留事件处理器
   */
  async close({ keepProcessor = false } = {}): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('close 请先调用 open，建立一个会话')
    // 需要使用的参数
    const { httpUrl, sessionKey, qq } = this.conf
    //  关闭 ws 连接
    if (this.ws) await _stopListen(this.ws)
    // 释放会话
    await _releaseSession({ httpUrl, sessionKey, qq: qq })
    // 初始化对象状态
    if (!keepProcessor) {
      this.event = new Map()
    }
    this.conf = undefined
    this.ws = undefined
  }
  /**
   * 启动机器人连接。
   * @param conf 连接设定。
   */
  async open(conf: Config): Promise<void> {
    if (this.conf) this.close()
    this.conf = Object.assign(conf, { sessionKey: '' })
    this.conf.sessionKey = await _auth({
      httpUrl: this.conf.httpUrl,
      verifyKey: this.conf.verifyKey
    })
    conf.singleMode || (await this.__ListenWs())
  }
  /**
   * 向 qq 好友 或 qq 群发送消息，若同时提供，则优先向好友发送消息
   * @param type    必选 群聊消息|好友消息|临时消息
   * @param option 选项。
   * @param option.qq      必选，账户 qq 号或上下文
   * @param option.quote   可选，消息引用，使用发送时返回的 messageId
   * @param option.message 必选，Message 实例或 MessageType 数组
   * @returns messageId
   */
  async send(
    type: 'group',
    {
      qq,
      quote,
      message
    }: {
      qq: GroupID
      quote?: number
      message: MessageBase[]
    }
  ): Promise<number>
  async send(
    type: 'friend',
    {
      qq,
      quote,
      message
    }: {
      qq: UserID
      quote?: number
      message: MessageBase[]
    }
  ): Promise<number>
  async send(
    type: 'temp',
    {
      qq,
      quote,
      message
    }: {
      qq: UserID | MemberID
      quote?: number
      message: MessageBase[]
    }
  ): Promise<number>
  async send(
    type: 'group' | 'friend' | 'temp',
    {
      qq,
      quote,
      message
    }: {
      qq: UserID | GroupID | MemberID
      quote?: number
      message: MessageBase[]
    }
  ): Promise<number> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('send 请先调用 open，建立一个会话')
    }
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    // 根据 temp、friend、group 参数的情况依次调用
    if (type == 'temp') {
      if (typeof qq == 'number') {
        return await _sendTempMessage({
          httpUrl,
          sessionKey,
          qq,
          quote,
          messageChain: message
        })
      }
      return await _sendTempMessage({
        httpUrl,
        sessionKey,
        qq: qq.qq,
        group: qq.group,
        quote,
        messageChain: message
      })
    } else if (type == 'friend') {
      if (typeof qq == 'number') {
        return await _sendFriendMessage({
          httpUrl,
          sessionKey,
          target: qq,
          quote,
          messageChain: message
        })
      } else throw new Error('friend 不允许使用上下文')
    } else {
      if (typeof qq == 'number') {
        return await _sendGroupMessage({
          httpUrl,
          sessionKey,
          target: qq,
          quote,
          messageChain: message
        })
      } else throw new Error('group 不允许使用上下文')
    }
  }
  /**
   * 向好友或群成员发送戳一戳
   * mirai-api-http-v1.10.1 feature
   * @param qq 可以是好友qq号也可以是上下文
   */
  async nudge(qq: UserID | MemberID) {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('nudge 请先调用 open，建立一个会话')
    }
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq == 'number') {
      // 发给群成员
      await _sendNudge({
        httpUrl,
        sessionKey,
        target: qq,
        subject: qq,
        kind: 'Group'
      })
    } else {
      // 发给好友
      await _sendNudge({
        httpUrl,
        sessionKey,
        target: qq.qq,
        subject: qq.group,
        kind: 'Friend'
      })
    }
  }
  /**
   * 手动触发一个事件。
   * @param type 事件类型。
   * @param value 事件参数。
   */
  async dispatch(type: EventType, value: EventArg<null>): Promise<void>
  async dispatch<T extends EventType>(
    type: T,
    value: EventArg<T>
  ): Promise<void>
  async dispatch(type: EventType, value: EventArg<null>): Promise<void> {
    // 如果当前到达的事件拥有处理器，则依次调用所有该事件的处理器
    if (this.event.has(type)) {
      if (this.waiting.has(type)) {
        const t = this.waiting.get(type)
        if (t && t.length > 0) {
          // 此事件已被锁定
          for (const v in t) {
            // 事件被触发
            if (t[v](value)) {
              delete t[v]
              return
            }
          }
        }
      }
      this.event
        .get(type)
        ?.forEach(
          (i: undefined | Processor): void => void (i ? i(value) : null)
        )
    }
  }
  /**
   * 添加一个事件处理器
   * 框架维护的 WebSocket 实例会在 ws 的事件 message 下分发 Mirai http server 的消息。
   * @param type 必选，事件类型
   * @param callback  必选，回调函数
   * @returns 事件处理器的标识，用于移除该处理器
   */
  on(type: EventType, callback: Processor): EventIndex
  on<T extends EventType>(type: T, callback: Processor<T>): EventIndex
  on(type: EventType, callback: Processor): EventIndex {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('on 请先调用 open，建立一个会话')
    }
    if (!this.event.has(type)) {
      this.event.set(type, [])
    }
    // 生成EventID用于标识。
    const t = this.event.get(type)
    if (t) {
      let i = t.indexOf(undefined)
      if (i == -1) {
        t.push(callback)
        i = t.length - 1
      } else {
        t[i] = callback
      }
      this.event.set(type, t)
      return i
    } else {
      return -1
    }
  }
  /**
   * 添加一个一次性事件处理器，回调一次后自动移除
   * @param type 必选，事件类型
   * @param callback  必选，回调函数
   * @param strict    可选，是否严格检测调用，由于消息可能会被中间件拦截
   *                             当为 true 时，只有开发者的处理器结束后才会移除该处理器
   *                             当为 false 时，即使消息被拦截，也会移除该处理器
   */
  one(type: EventType, callback: Processor, strict?: boolean): void
  one<T extends EventType>(
    type: T,
    callback: Processor<T>,
    strict?: boolean
  ): void
  one(type: EventType, callback: Processor, strict = false): void {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('on 请先调用 open，建立一个会话')
    }
    if (!this.event.has(type)) {
      this.event.set(type, [])
    }
    let index: EventIndex = 0
    const processor: Processor = async (data: unknown): Promise<void> => {
      if (strict) {
        // 严格检测回调
        // 当开发者的处理器结束后才移除该处理器，这里等待异步回调
        await callback(data)
      } else {
        // 不严格检测，直接移除处理器
        // 调用开发者提供的回调
        callback(data)
      }
      this.off(type, index)
    }
    index = this.on(type, processor)
  }
  /**
   * 移除全部处理器
   */
  off(): void
  /**
   * 移除type下的所有处理器
   * @param type 必选，事件类型
   */
  off(type: EventType): void
  /**
   * 移除type下的一个事件处理器
   * @param type 必选，事件类型
   * @param handle 事件处理器标识，由 on 方法返回。
   */
  off(type: EventType, handle: EventIndex): void
  /**
   * 移除type下的多个个事件处理器
   * @param type 必选，事件类型
   * @param handle 事件处理器标识数组，由多个 on 方法的返回值拼接而成。
   */
  off(type: EventType, handle: EventIndex[]): void
  off(type?: EventType, handle?: EventIndex | EventIndex[]): void {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('off 请先调用 open，建立一个会话')
    }
    if (type) {
      if (handle) {
        const t = this.event.get(type)
        if (!t) return
        // 从 field eventProcessorMap 中移除 handle 指定的事件处理器
        if (handle instanceof Array) {
          // 可迭代
          handle.forEach((hd: EventIndex) => {
            if (t.length > hd) t[hd] = undefined
          })
        } else {
          // 不可迭代，认为是单个标识
          if (t.length > handle) t[handle] = undefined
        }
        this.event.set(type, t)
      } else {
        // 未提供 handle，移除所有
        this.event.set(type, [])
      }
    } else {
      this.event = new Map()
    }
  }
  /**
   * 撤回由 messageId 确定的消息
   * @param messageId 欲撤回消息的 messageId
   */
  async recall(messageId: number): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('recall 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    // 撤回消息
    await _recall({ httpUrl, sessionKey, target: messageId })
  }
  /**
   * FIXME: 上游错误:type 指定为 'friend' 或 'temp' 时发送的图片显示红色感叹号，无法加载，group 则正常
   * 上传图片至服务器，返回指定 type 的 imageId，url，及 path
   * @param type     必选，"friend" 或 "group" 或 "temp"
   * @param option 选项
   * @param option.img      必选，图片二进制数据
   * @param option.suffix   图片文件后缀名，默认为"jpg"
   * @returns 擦除类型的 Image 或 FlashImage 对象，可经实际构造后插入到message中。
   */
  async image(
    type: 'friend' | 'group' | 'temp',
    {
      img,
      suffix = 'jpg'
    }: {
      img: Buffer
      suffix?: string
    }
  ): Promise<{ imageId: string; url: string; path: '' }> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('image 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _uploadImage({ httpUrl, sessionKey, type, img, suffix })
  }
  /**
   * FIXME: 上游错误:目前该功能返回的 voiceId 无法正常使用，无法
   * 发送给好友，提示 message is empty，发到群里则是 1s 的无声语音
   * TODO: 上游todo:目前type仅支持 "group"，请一定指定为"group"，
   * 否则将导致未定义行为。
   * 上传语音至服务器，返回 voiceId, url 及 path
   * @param type 必选，"friend" 或 "group" 或 "temp"。
   * @param option          选项
   * @param option.voice    必选，语音二进制数据。
   * @param option.suffix   语音文件后缀名，默认为"amr"。
   * @returns Voice 对象，可直接插入到message中。
   */
  async voice(
    type: 'friend' | 'group' | 'group',
    {
      voice,
      suffix = 'amr'
    }: {
      voice: Buffer
      suffix?: string
    }
  ): Promise<Voice> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('voice 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _uploadVoice({ httpUrl, sessionKey, type, voice, suffix })
  }
  /**
   * 获取好友列表
   * @returns 好友列表。
   */
  async friend(): Promise<User[]> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('friend 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _getFriendList({ httpUrl, sessionKey })
  }
  /**
   * 获取群列表
   * @returns 群列表。
   */
  async group(): Promise<Group[]> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('group 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _getGroupList({ httpUrl, sessionKey })
  }

  /**
   * 获取指定群的成员列表
   * @param group 必选，欲获取成员列表的群号
   * @returns 群员列表。
   */
  async member(group: GroupID): Promise<Member[]> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('member 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _getMemberList({
      httpUrl,
      sessionKey,
      target: group
    })
  }

  /**
   * 获取群成员设置(members的细化操作)
   * @param info 上下文对象。
   * @returns 群成员设置
   */
  async memberInfo(info: MemberID): Promise<Member> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('memberInfo 请先调用 open，建立一个会话')
    }
    // 获取列表
    const { httpUrl, sessionKey } = this.conf
    return await _getMemberInfo({
      httpUrl,
      sessionKey,
      target: info.group,
      memberId: info.qq
    })
  }
  /**
   * 获取用户信息
   * @param type   必选，可以为"friend" 或 "member" 或 "user" 或 "bot"。在某些情况下friend和user可以混用，但获得信息的详细程度可能不同。
   * @param target   上下文。
   * @returns 用户资料
   */
  async profile(type: 'friend', target: UserID): Promise<Profile>
  async profile(type: 'member', target: MemberID): Promise<Profile>
  async profile(type: 'user', target: UserID): Promise<Profile>
  async profile(type: 'bot', target: void): Promise<Profile>
  async profile(
    type: 'friend' | 'member' | 'user' | 'bot',
    target: UserID | MemberID | void
  ): Promise<Profile> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('profile 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    // 检查参数
    if (type == 'member') {
      if (typeof target == 'number' || !target) {
        throw new Error('getUserProfile 参数被错误指定')
      }
      return await _getMemberProfile({
        httpUrl,
        sessionKey,
        target: target.group,
        memberId: target.qq
      })
    } else if (type == 'bot') {
      if (target) {
        throw new Error('getUserProfile 参数被错误指定')
      }
      return await _getBotProfile({ httpUrl, sessionKey })
    } else {
      if (typeof target != 'number') {
        throw new Error('getUserProfile 参数被错误指定')
      }
      return type == 'friend'
        ? await _getFriendProfile({ httpUrl, sessionKey, target })
        : await _getUserProfile({ httpUrl, sessionKey, target })
    }
  }
  /**
   * 设置群成员信息
   * @param target 目标
   * @param setting 成员信息
   */
  async setMember(
    target: MemberID,
    setting: {
      memberName?: string
      specialTitle?: string
      permission?: 'ADMINISTRATOR' | 'MEMBER'
    }
  ): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('setMember 请先调用 open，建立一个会话')
    }

    // setMemberInfo
    const { httpUrl, sessionKey } = this.conf
    if (setting.memberName != undefined || setting.specialTitle != undefined) {
      await _setMemberInfo({
        httpUrl,
        sessionKey,
        target: target.group,
        memberId: target.qq,
        info: {
          name: setting.memberName,
          specialTitle: setting.specialTitle
        }
      })
    }
    // setPermission
    if (setting.permission != undefined) {
      await _setMemberPerm({
        httpUrl,
        sessionKey,
        target: target.group,
        memberId: target.qq,
        assign: setting.permission == 'ADMINISTRATOR'
      })
    }
  }
  /**
   * 获取群公告列表迭代器
   * @param group 必选，群号
   * @returns 迭代器
   * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of
   */
  async *anno(group: GroupID): AsyncGenerator<Announcement> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('anno 请先调用 open，建立一个会话')
    }
    // 获取列表
    const { httpUrl, sessionKey } = this.conf
    let offset = 0
    let annoList: Announcement[]
    while (
      (annoList = await _getAnnoList({
        httpUrl,
        sessionKey,
        id: group,
        offset,
        size: 10
      })).length > 0
    ) {
      for (const anno of annoList) {
        yield anno
      }
      // 获取下一页
      offset += 10
    }
    return
  }
  /**
   * 发布群公告
   * @param group 群号
   * @param option.content 必选，公告内容
   * @param option.pinned  可选，是否置顶，默认为否
   */
  async publishAnno(
    group: GroupID,
    {
      content,
      pinned = false
    }: {
      content: string
      pinned?: boolean
    }
  ): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('publishAnno 请先调用 open，建立一个会话')
    }
    // 发布公告
    const { httpUrl, sessionKey } = this.conf
    await _publishAnno({ httpUrl, sessionKey, target: group, content, pinned })
  }

  /**
   * 删除群公告
   * @param group 必选，群号
   * @param id 必选，公告 id
   */
  async deleteAnno(group: GroupID, id: string) {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('deleteAnno 请先调用 open，建立一个会话')
    }
    // 发布公告
    const { httpUrl, sessionKey } = this.conf
    await _deleteAnno({ httpUrl, sessionKey, id: group, fid: id })
  }
  /**
   * 禁言群成员
   * @param qq 必选，群员(单体禁言)或群号(全体禁言)
   * @param time  可选，禁言时长，单位: s (秒)
   */
  async mute(qq: MemberID | GroupID, time?: number): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('mute 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq == 'number') {
      if (time) throw new Error('mute 全体禁言时不可以指定时间')
      await _muteAll({ httpUrl, sessionKey, target: qq })
    } else {
      if (!time) throw new Error('mute 个体禁言时必须指定时间')
      await _mute({
        httpUrl,
        sessionKey,
        target: qq.group,
        memberId: qq.qq,
        time
      })
    }
  }
  /**
   * 解除禁言
   * @param qq 必选，群员(单体解禁)或群号(全体解禁)
   */
  async unmute(qq: MemberID | GroupID): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('unmute 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq == 'number') {
      await _unmuteAll({ httpUrl, sessionKey, target: qq })
    } else {
      await _unmute({ httpUrl, sessionKey, target: qq.group, memberId: qq.qq })
    }
  }
  /**
   * 移除群成员，好友或群
   * @param type           必选，要移除的类型，可以是'friend'或'group'或'member'
   * @param option         选项
   * @param option.qq      要移除的目标
   * @param option.message 可选，移除信息，默认为空串 ""，仅在'member'情况下可以指定
   * @returns {void}
   */
  async remove(
    type: 'friend' | 'group' | 'member',
    {
      qq,
      message
    }: {
      qq: UserID | GroupID | MemberID
      message?: string
    }
  ): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('remove 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    if (type == 'friend') {
      if (typeof qq != 'number') throw new Error('remove 需要一个好友qq号')
      if (message) throw new Error('remove 不支持指定message')
      await _removeFriend({ httpUrl, sessionKey, target: qq })
    } else if (type == 'group') {
      if (typeof qq != 'number') throw new Error('remove 需要一个群聊qq号')
      if (message) throw new Error('remove 不支持指定message')
      await _quitGroup({ httpUrl, sessionKey, target: qq })
    } else {
      if (typeof qq == 'number') throw new Error('remove 需要一个成员信息')
      await _removeMember({
        httpUrl,
        sessionKey,
        target: qq.group,
        memberId: qq.qq,
        msg: message ? message : ''
      })
    }
  }
  /**
   * 获取群信息
   * @param group 必选，群号
   * @returns 群信息
   */
  async groupInfo(group: GroupID): Promise<GroupInfo> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('groupInfo 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    return await _getGroupConfig({ httpUrl, sessionKey, target: group })
  }
  /**
   * 设置群信息
   * @param group 必选，群号
   * @param info 欲设置的信息
   */
  async setGroup(group: GroupID, info: GroupInfo): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('setGroup 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    await _setGroupConfig({
      httpUrl,
      sessionKey,
      target: group,
      info
    })
  }
  /**
   * 群文件管理器。
   * @param group 群号
   * @returns 群文件管理器
   */
  file(group: GroupID): FileManager {
    if (!this.conf) {
      throw new Error('file 请先调用 open，建立一个会话')
    }
    return new FileManager(this, group)
  }
  /**
   * 响应事件。
   * @param event 事件。
   * @param option 选项
   * @param option.action 要进行的操作。"accept":同意。"refuse":拒绝。"ignore":忽略。"ignoredie":忽略并不再受理此请求。"refusedie":拒绝并不再受理此请求。
   * @param option.message 附带的信息。
   */
  async action(
    event: NewFriendRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  async action(
    event: MemberJoinRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'ignore' | 'ignoredie' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  async action(
    event: BotInvitedJoinGroupRequestEvent,
    option: {
      action: 'accept' | 'refuse'
      message?: string
    }
  ): Promise<void>
  async action(
    event:
      | NewFriendRequestEvent
      | MemberJoinRequestEvent
      | BotInvitedJoinGroupRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'ignore' | 'ignoredie' | 'refusedie'
      message?: string
    }
  ): Promise<void> {
    if (!this.conf) {
      throw new Error('action 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    if (event instanceof NewFriendRequestEvent) {
      if (
        option.action != 'accept' &&
        option.action != 'refuse' &&
        option.action != 'refusedie'
      )
        throw new Error('action 不允许此动作')
      await _newFriend({
        httpUrl,
        sessionKey,
        event,
        option: {
          action: option.action,
          message: option.message
        }
      })
    } else if (event instanceof MemberJoinRequestEvent) {
      await _memberJoin({
        httpUrl,
        sessionKey,
        event,
        option
      })
    } else if (event instanceof BotInvitedJoinGroupRequestEvent) {
      if (option.action != 'accept' && option.action != 'refuse')
        throw new Error('action 不允许此动作')
      await _botInvited({
        httpUrl,
        sessionKey,
        event,
        option: {
          action: option.action,
          message: option.message
        }
      })
    }
  }
  /**
   *  设置群精华消息
   * @param messageId 必选，消息 id
   */
  async setEssence(messageId: number): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('setEssence 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    await _setEssence({ httpUrl, sessionKey, target: messageId })
  }
  constructor() {
    this.conf = undefined
    this.ws = undefined
  }
}
