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
import _getMsg from './core/getMsg'
import {
  EventIndex,
  EventType,
  Processor,
  NewFriendRequestEvent,
  MemberJoinRequestEvent,
  BotInvitedJoinGroupRequestEvent,
  EventArg,
  EventBase,
  Matcher,
  GroupMessage,
  Message,
  BaseFriendMessage,
  BaseGroupMessage,
  BaseMessage,
  BaseStrangerMessage,
  BaseTempMessage
} from './Event'
import { MessageBase, Source, Voice } from './Message'
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
interface SendOption<T extends GroupID | UserID | MemberID> {
  qq: T
  reply?: BaseMessage
  message: MessageBase[]
}
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
  private event: Partial<
    Record<EventType, (Processor<EventType> | undefined)[]>
  > = {}
  private waiting: Partial<Record<EventType, Matcher<EventType>[]>> = {}
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
      message: (data: EventBase) => {
        const f = this.waiting[data.type]
        const arg = data as EventArg<EventType>
        if (f) {
          // 此事件已被锁定
          for (const v in f) {
            // 事件被触发
            if (f[v](arg)) {
              delete f[v]
              this.waiting[data.type] = f
              return
            }
          }
        }
        this.event[data.type]?.forEach(
          (i?: Processor<EventType>): void => void (i ? i(arg) : null)
        )
      },
      error: err => {
        const f = this.waiting['error']
        console.error('ws error', err)
        if (f) {
          // 此事件已被锁定
          for (const v in f) {
            // 事件被触发
            if (f[v](err)) {
              delete f[v]
              this.waiting['error'] = f
              return
            }
          }
        }
        this.event['error']?.forEach(
          (i?: Processor<'error'>): void => void (i ? i(err) : null)
        )
      },
      close: obj => {
        const f = this.waiting['close']
        console.log('ws close', obj)
        if (f) {
          // 此事件已被锁定
          for (const v in f) {
            // 事件被触发
            if (f[v](obj)) {
              delete f[v]
              this.waiting['close'] = f
              return
            }
          }
        }
        return this.event['close']?.forEach(
          (i: undefined | Processor<'close'>): void => void (i ? i(obj) : null)
        )
      },
      unexpectedResponse: obj => {
        const f = this.waiting['unexpected-response']
        console.error('ws unexpectedResponse', obj)
        if (f) {
          // 此事件已被锁定
          for (const v in f) {
            // 事件被触发
            if (f[v](obj)) {
              delete f[v]
              this.waiting['unexpected-response'] = f
              return
            }
          }
        }
        return this.event['unexpected-response']?.forEach(
          (i: undefined | Processor<'unexpected-response'>): void =>
            void (i ? i(obj) : null)
        )
      }
    })
  }
  /**
   * 获得设置项。
   */
  get config(): ConfigInit {
    if (!this.conf) {
      throw new Error('config 请先调用 open，建立一个会话')
    }
    return this.conf
  }
  /**
   * 由消息ID获得一条消息
   * @param messageId 消息ID
   * @returns 消息
   */
  async msg(messageId: number): Promise<Message> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('config 请先调用 open，建立一个会话')
    }
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    return await _getMsg({
      httpUrl,
      sessionKey,
      messageId
    })
  }
  /**
   * 获得最新的数据/等待数据。
   * @param type 事件类型。
   * @param matcher 匹配器。当匹配器返回true时才会回传data。
   */
  wait<T extends EventType>(
    type: T,
    matcher: Matcher<T>
  ): Promise<EventArg<T>> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('wait 请先调用 open，建立一个会话')
    }
    return new Promise<EventArg<T>>(resolve => {
      const resolver = ((data: EventArg<T>): boolean => {
        if (matcher(data)) {
          resolve(data)
          return true
        }
        return false
      }) as Matcher<EventType>
      if (this.waiting[type]) {
        this.waiting[type]?.push(resolver)
      } else {
        this.waiting[type] = [resolver]
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
    if (!keepProcessor) this.off()
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
   * @param type           必选 群聊消息|好友消息|临时消息
   * @param option         选项。
   * @param option.qq      必选，账户 qq 号或上下文
   * @param option.reply   可选，消息引用，使用Message
   * @param option.message 必选，消息数组
   * @returns 消息
   */
  async send(
    type: 'group',
    option: SendOption<GroupID>
  ): Promise<BaseGroupMessage>
  async send(
    type: 'friend',
    option: SendOption<UserID>
  ): Promise<BaseFriendMessage>
  async send(
    type: 'temp',
    option: SendOption<UserID>
  ): Promise<BaseStrangerMessage>
  async send(
    type: 'temp',
    option: SendOption<MemberID>
  ): Promise<BaseTempMessage>
  async send(
    type: 'group' | 'friend' | 'temp',
    option: SendOption<UserID | GroupID | MemberID>
  ): Promise<BaseMessage> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('send 请先调用 open，建立一个会话')
    }
    let msgtype: EventType, id: number
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    // 根据 temp、friend、group 参数的情况依次调用
    if (type == 'temp') {
      if (option.qq instanceof MemberID) {
        msgtype = 'TempMessage'
        id = await _sendTempMessage({
          httpUrl,
          sessionKey,
          qq: option.qq.qq,
          group: option.qq.group,
          quote: option.reply?.messageChain[0].id,
          messageChain: option.message
        })
      } else {
        msgtype = 'StrangerMessage'
        id = await _sendTempMessage({
          httpUrl,
          sessionKey,
          qq: option.qq,
          quote: option.reply?.messageChain[0].id,
          messageChain: option.message
        })
      }
    } else if (!(option.qq instanceof MemberID)) {
      msgtype = type == 'friend' ? 'FriendMessage' : 'GroupMessage'
      id = await (type == 'friend' ? _sendFriendMessage : _sendGroupMessage)({
        httpUrl,
        sessionKey,
        target: option.qq,
        quote: option.reply?.messageChain[0].id,
        messageChain: option.message
      })
    } else throw new Error('send 参数错误')
    return {
      type: msgtype,
      messageChain: [
        new Source({
          id,
          time: Math.floor(Date.now() / 1000)
        }),
        ...option.message
      ]
    }
  }
  /**
   * 向好友或群成员发送戳一戳
   * mirai-api-http-v1.10.1 feature
   * @param qq 可以是好友qq号也可以是上下文
   */
  async nudge(qq: UserID | MemberID): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('nudge 请先调用 open，建立一个会话')
    }
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    if (qq instanceof MemberID) {
      await _sendNudge({
        httpUrl,
        sessionKey,
        target: qq.qq,
        subject: qq.group,
        kind: 'Friend'
      })
    } else {
      await _sendNudge({
        httpUrl,
        sessionKey,
        target: qq,
        subject: qq,
        kind: 'Group'
      })
    }
  }
  /**
   * 手动触发一个事件。
   * @param type 事件类型。
   * @param value 事件参数。
   */
  async dispatch<T extends EventType>(
    type: T,
    value: EventArg<T>
  ): Promise<void> {
    // 如果当前到达的事件拥有处理器，则依次调用所有该事件的处理器
    const f = this.waiting[type as EventType]
    if (f) {
      // 此事件已被锁定
      for (const v in f) {
        // 事件被触发
        if (f[v](value)) {
          delete f[v]
          this.waiting[type] = f
          return
        }
      }
    }
    this.event[type]?.forEach(
      (i: undefined | Processor<T>): void => void (i ? i(value) : null)
    )
  }
  /**
   * 添加一个事件处理器
   * 框架维护的 WebSocket 实例会在 ws 的事件 message 下分发 Mirai http server 的消息。
   * @param type 必选，事件类型
   * @param callback  必选，回调函数
   * @returns 事件处理器的标识，用于移除该处理器
   */
  on<T extends EventType>(type: T, callback: Processor<T>): EventIndex<T> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('on 请先调用 open，建立一个会话')
    }
    this.event[type] || (this.event[type] = [])
    // 生成EventID用于标识。
    let t = this.event[type]
    if (!t) t = []
    let i = t.indexOf(undefined)
    if (i == -1) {
      t.push(callback as Processor<EventType>)
      i = t.length - 1
    } else {
      t[i] = callback as Processor<EventType>
    }
    this.event[type] = t
    return new EventIndex<T>({ type, index: i })
  }
  /**
   * 添加一个一次性事件处理器，回调一次后自动移除
   * @param type 必选，事件类型
   * @param callback  必选，回调函数
   * @param strict    可选，是否严格检测调用，由于消息可能会被中间件拦截
   *                             当为 true 时，只有开发者的处理器结束后才会移除该处理器
   *                             当为 false 时，即使消息被拦截，也会移除该处理器
   */
  one<T extends EventType>(
    type: T,
    callback: Processor<T>,
    strict = false
  ): void {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('on 请先调用 open，建立一个会话')
    }
    let index: EventIndex<T> = new EventIndex<T>({ type, index: 0 })
    const processor: Processor<T> = async (
      data: EventArg<T>
    ): Promise<void> => {
      if (strict) {
        // 严格检测回调
        // 当开发者的处理器结束后才移除该处理器，这里等待异步回调
        await callback(data)
      } else {
        // 不严格检测，直接移除处理器
        // 调用开发者提供的回调
        callback(data)
      }
      this.off(index)
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
  off<T extends EventType>(type: T): void
  /**
   * 移除handle指定的事件处理器
   * @param handle 事件处理器标识，由 on 方法返回。
   */
  off<T extends EventType>(handle: EventIndex<T>): void
  /**
   * 移除多个handle指定的事件处理器
   * @param handle 事件处理器标识数组，由多个 on 方法的返回值拼接而成。
   */
  off(handle: EventIndex<EventType>[]): void
  off(
    option?: EventType | EventIndex<EventType> | EventIndex<EventType>[]
  ): void {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('off 请先调用 open，建立一个会话')
    }
    if (option) {
      if (option instanceof EventIndex) {
        const t = this.event[option.type]
        if (!t) return
        // 从 field eventProcessorMap 中移除 handle 指定的事件处理器
        if (t.length > option.index) t[option.index] = undefined
        this.event[option.type] = t
      } else if (option instanceof Array) {
        // 可迭代
        option.forEach((hd: EventIndex<EventType>) => this.off(hd))
      } else this.event[option] = [] // 只提供type，移除所有
    } else this.event = {}
  }
  /**
   * 撤回消息
   * @param message 欲撤回的消息
   */
  async recall(message: BaseMessage): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('recall 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    // 撤回消息
    await _recall({ httpUrl, sessionKey, target: message.messageChain[0].id })
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
  async listFriend(): Promise<User[]> {
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
  async listGroup(): Promise<Group[]> {
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
  async listMember(group: GroupID): Promise<Member[]> {
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
  async getMember(info: MemberID): Promise<Member> {
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
    if (type == 'member' && target instanceof MemberID) {
      return await _getMemberProfile({
        httpUrl,
        sessionKey,
        target: target.group,
        memberId: target.qq
      })
    } else if (type == 'bot' && !target) {
      return await _getBotProfile({ httpUrl, sessionKey })
    } else if (
      (type == 'friend' || type == 'user') &&
      typeof target == 'number'
    ) {
      return await (type == 'friend' ? _getFriendProfile : _getUserProfile)({
        httpUrl,
        sessionKey,
        target
      })
    } else throw new Error('getUserProfile 参数被错误指定')
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
    if (setting.memberName || setting.specialTitle) {
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
    if (setting.permission) {
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
      for (const anno of annoList) yield anno
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
  async deleteAnno(group: GroupID, id: string): Promise<void> {
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
    if (qq instanceof MemberID && time) {
      await _mute({
        httpUrl,
        sessionKey,
        target: qq.group,
        memberId: qq.qq,
        time
      })
    } else if (typeof qq == 'number' && !time) {
      await _muteAll({ httpUrl, sessionKey, target: qq })
    } else throw new Error('mute 参数错误')
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
    if (qq instanceof MemberID)
      await _unmute({ httpUrl, sessionKey, target: qq.group, memberId: qq.qq })
    else await _unmuteAll({ httpUrl, sessionKey, target: qq })
  }
  /**
   * 移除群成员，好友或群
   * @param type           必选，要移除的类型，可以是'friend'或'group'或'member'
   * @param option         选项
   * @param option.qq      要移除的目标
   * @param option.message 可选，移除信息，默认为空串 ""，仅在'member'情况下可以指定
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
    if (type == 'member' && qq instanceof MemberID) {
      await _removeMember({
        httpUrl,
        sessionKey,
        target: qq.group,
        memberId: qq.qq,
        msg: message ? message : ''
      })
    } else if (typeof qq == 'number' && !message) {
      await (type == 'friend' ? _removeFriend : _quitGroup)({
        httpUrl,
        sessionKey,
        target: qq
      })
    } else throw new Error('remove 参数错误')
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
    } else {
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
   * @param message 必选，消息
   */
  async setEssence(message: GroupMessage): Promise<void> {
    // 检查对象状态
    if (!this.conf) {
      throw new Error('setEssence 请先调用 open，建立一个会话')
    }
    const { httpUrl, sessionKey } = this.conf
    await _setEssence({
      httpUrl,
      sessionKey,
      target: message.messageChain[0].id
    })
  }
  constructor() {
    this.conf = undefined
    this.ws = undefined
  }
}
