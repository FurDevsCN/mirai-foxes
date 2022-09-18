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
  EventType,
  NewFriendRequestEvent,
  MemberJoinRequestEvent,
  BotInvitedJoinGroupRequestEvent,
  EventArg,
  EventBase,
  GroupMessage,
  Message,
  FriendMessage,
  StrangerMessage,
  TempMessage
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
  GroupInfo,
  MemberSetting,
  OtherClient
} from './Base'
import { FileManager } from './File'
/**
 * Typescript Helper：获得事件的处理器类型。
 * 例：Processor<'FriendMessage'> = (data: FriendMessage) => Promise<void> | void
 */
export type Processor<T extends EventType> = (
  data: EventArg<T>
) => Promise<void> | void
/**
 * Typescript Helper：获得事件的匹配器类型。
 * 例：Matcher<'FriendMessage'> = (data: FriendMessage) => boolean
 */
export type Matcher<T extends EventType> = (data: EventArg<T>) => boolean
/**
 * 获得事件在事件池中的定位。
 */
export class EventIndex<T extends EventType> {
  type: T
  index: number
  constructor({ type, index }: { type: T; index: number }) {
    void ([this.type, this.index] = [type, index])
  }
}
/** send方法要求的选项 */
interface SendOption<T extends GroupID | UserID | MemberID> {
  /** 账户 qq 号或者群员上下文(上下文用于发送临时消息) */
  qq: T
  /** 要回复的消息，可以是Bot发送的 */
  reply?: Message
  /** 要发送的消息 */
  message: MessageBase[]
}
/** remove方法要求的选项 */
interface RemoveOption<T extends GroupID | UserID | MemberID> {
  /** 账户或群聊 qq 号或者群员 */
  qq: T
  /** 留言 */
  message?: string
}
/** upload方法要求的选项 */
interface UploadOption {
  /** 要上传的东西 */
  data: Buffer
  /** 后辍名 */
  suffix: string
}
interface TemplateImage {
  imageId: string
  url: string
  path: ''
}
/** anno publish方法要求的选项 */
interface AnnoOption {
  /** 公告内容 */
  content: string
  /** 是否置顶 */
  pinned?: boolean
}
/** 用户提供的机器人配置 */
interface Config {
  /** 账户QQ号。 */
  qq: UserID
  /** 认证密码。 */
  verifyKey: string
  /** websocket地址。mirai-api-http API问题导致不得不同时使用http/ws。 */
  wsUrl: string
  /** http地址。mirai-api-http API问题导致不得不同时使用http/ws。 */
  httpUrl: string
}
/** 完整的机器人配置 */
interface FullConfig extends Config {
  /** 会话token。 */
  sessionKey: string
}
export class Bot {
  /** @private 机器人内部使用的Config。 */
  private conf?: FullConfig = undefined
  /** @private 机器人内部使用的Websocket连接。 */
  private ws?: WebSocket = undefined
  /** @private 内部存储的事件池 */
  private event: Partial<Record<EventType, Partial<Processor<EventType>[]>>> =
    {}
  /** @private wait函数的等待器集合 */
  private waiting: Partial<Record<EventType, Matcher<EventType>[]>> = {}
  private static clone<T>(data: T): T {
    if (typeof data !== 'object' || data == undefined) return data
    const result: Record<string | symbol, unknown> = {}
    for (const [key, value] of Object.entries(data))
      result[key] = Bot.clone(value)
    return result as T
  }
  /**
   * @private ws监听初始化。
   */
  private async __ListenWs(): Promise<void> {
    // 判断是否有conf
    if (!this.conf) return
    // 绑定sessionKey和qq
    await _bind({
      httpUrl: this.conf.httpUrl,
      sessionKey: this.conf.sessionKey,
      qq: this.conf.qq
    })
    // 设定ws
    this.ws = await _startListen({
      wsUrl: this.conf.wsUrl,
      sessionKey: this.conf.sessionKey,
      verifyKey: this.conf.verifyKey,
      message: (data: EventBase) => {
        // 收到事件
        this.dispatch(data as EventArg<EventType>) // 强转：此处要将data转为联合类型(无法在编译期确定data类型)。
      },
      error: err => {
        this.dispatch(err)
        console.error('ws error', err)
      },
      close: obj => {
        this.dispatch(obj)
        console.log('ws close', obj)
      },
      unexpectedResponse: obj => {
        this.dispatch(obj)
        console.error('ws unexpectedResponse', obj)
      }
    })
  }
  /**
   * 获得设置项。
   */
  get config(): FullConfig {
    if (!this.conf) throw new Error('config 请先调用 open，建立一个会话')
    return this.conf
  }
  /**
   * 由消息ID获得一条消息
   * @param messageId 消息ID
   * @param target    目标群/好友QQ号
   * @returns         消息
   */
  async msg(target: GroupID | UserID, messageId: number): Promise<Message> {
    // 检查对象状态
    if (!this.conf) throw new Error('config 请先调用 open，建立一个会话')
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    return await _getMsg({
      httpUrl,
      sessionKey,
      target,
      messageId
    })
  }
  /**
   * 等待由matcher匹配的指定事件。在匹配成功时不会触发其它触发器。
   * @param type    事件类型。
   * @param matcher 匹配器。当匹配器返回true时才会回传事件。
   * @returns       匹配到的事件。
   */
  wait<T extends EventType>(
    type: T,
    matcher: Matcher<T>
  ): Promise<EventArg<T>> {
    // 检查对象状态
    if (!this.conf) throw new Error('wait 请先调用 open，建立一个会话')
    return new Promise<EventArg<T>>(resolve => {
      const resolver = ((data: EventArg<T>): boolean => {
        if (matcher(data)) {
          resolve(data)
          return true
        }
        return false
      }) as Matcher<EventType>
      if (this.waiting[type]) this.waiting[type]?.push(resolver)
      else this.waiting[type] = [resolver]
    })
  }
  /**
   * 关闭机器人连接。
   * @param option               选项。
   * @param option.keepProcessor 是否保留事件处理器。
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
    await this.__ListenWs()
  }
  /**
   * 向 qq 好友 或 qq 群发送消息。
   * @param type           群聊消息|好友消息|临时消息
   * @param option         发送选项。
   * @returns              消息
   */
  async send(type: 'group', option: SendOption<GroupID>): Promise<GroupMessage>
  async send(type: 'friend', option: SendOption<UserID>): Promise<FriendMessage>
  async send(type: 'temp', option: SendOption<UserID>): Promise<StrangerMessage>
  async send(type: 'temp', option: SendOption<MemberID>): Promise<TempMessage>
  async send(
    type: 'group' | 'friend' | 'temp',
    option: SendOption<UserID | GroupID | MemberID>
  ): Promise<Message> {
    // 检查对象状态
    if (!this.conf) throw new Error('send 请先调用 open，建立一个会话')
    let msgtype: EventType, id: number, sender: User | Member | OtherClient
    // 需要使用的参数
    const { httpUrl, sessionKey } = this.conf
    // 根据 temp、friend、group 参数的情况依次调用
    if (type == 'temp') {
      if (typeof option.qq != 'number') {
        msgtype = 'TempMessage'
        id = await _sendTempMessage({
          httpUrl,
          sessionKey,
          qq: option.qq.qq,
          group: option.qq.group,
          quote: option.reply?.messageChain[0].id,
          messageChain: option.message
        })
        sender = {
          id: this.conf.qq,
          memberName: '',
          specialTitle: '',
          permission: 'MEMBER',
          joinTimestamp: 0,
          lastSpeakTimestamp: 0,
          muteTimeRemaining: 0,
          group: {
            id: option.qq.group,
            name: '',
            permission: 'MEMBER'
          }
        }
      } else {
        msgtype = 'StrangerMessage'
        id = await _sendTempMessage({
          httpUrl,
          sessionKey,
          qq: option.qq,
          quote: option.reply?.messageChain[0].id,
          messageChain: option.message
        })
        sender = {
          id: this.conf.qq,
          nickname: '',
          remark: ''
        }
      }
    } else {
      msgtype = type == 'friend' ? 'FriendMessage' : 'GroupMessage'
      id = await (type == 'friend' ? _sendFriendMessage : _sendGroupMessage)({
        httpUrl,
        sessionKey,
        target: option.qq as UserID | GroupID,
        quote: option.reply?.messageChain[0].id,
        messageChain: option.message
      })
      if (msgtype == 'FriendMessage') {
        sender = {
          id: option.qq as UserID,
          nickname: '',
          remark: ''
        }
      } else {
        sender = {
          id: this.conf.qq,
          memberName: '',
          specialTitle: '',
          permission: 'MEMBER',
          joinTimestamp: 0,
          lastSpeakTimestamp: 0,
          muteTimeRemaining: 0,
          group: {
            id: option.qq as GroupID,
            name: '',
            permission: 'MEMBER'
          }
        }
      }
    }
    return {
      type: msgtype,
      sender: sender as User & Member & OtherClient,
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
    if (!this.conf) throw new Error('nudge 请先调用 open，建立一个会话')
    // 需要使用的参数l
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq != 'number') {
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
   * 触发一个事件。
   * @param value 事件参数。
   */
  dispatch<T extends EventType>(value: EventArg<T>): void {
    // 如果当前到达的事件拥有处理器，则依次调用所有该事件的处理器
    const f = this.waiting[value.type]
    if (f && f.length > 0) {
      // 此事件已被锁定
      for (const v in f) {
        // 事件被触发
        if (f[v](Bot.clone(value))) {
          delete f[v]
          this.waiting[value.type] = f
          return
        }
      }
    }
    this.event[value.type]?.forEach(
      (i?: Processor<T>): void =>
        void (i ? i(Bot.clone(value)) : null)
    )
  }
  /**
   * 添加一个事件处理器
   * 框架维护的 WebSocket 实例会在 ws 的事件 message 下分发 Mirai http server 的消息。
   * @param type     事件类型
   * @param callback 回调函数
   * @returns        事件处理器的标识，用于移除该处理器
   */
  on<T extends EventType>(type: T, callback: Processor<T>): EventIndex<T> {
    // 检查对象状态
    if (!this.conf) throw new Error('on 请先调用 open，建立一个会话')
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
   * @param type 事件类型
   * @param callback  回调函数
   * @param strict    是否严格检测调用，由于消息可能会被中间件拦截
   *                  当为 true 时，只有开发者的处理器结束后才会移除该处理器
   *                  当为 false 时，将不等待开发者的处理器，直接移除
   */
  one<T extends EventType>(
    type: T,
    callback: Processor<T>,
    strict = false
  ): void {
    // 检查对象状态
    if (!this.conf) throw new Error('on 请先调用 open，建立一个会话')
    let index: EventIndex<T> = new EventIndex<T>({ type, index: 0 })
    const processor: Processor<T> = async (
      data: EventArg<T>
    ): Promise<void> => {
      strict ? await callback(data) : callback(data)
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
   * @param type 事件类型
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
    if (!this.conf) throw new Error('off 请先调用 open，建立一个会话')
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
  async recall(message: Message): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('recall 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    // 撤回消息
    await _recall({
      httpUrl,
      sessionKey,
      target: message.sender.id,
      messageId: message.messageChain[0].id
    })
  }
  /**
   * FIXME: 上游错误:type 指定为 'friend' 或 'temp' 时发送的图片显示红色感叹号，无法加载，group 则正常
   * 上传图片至服务器，返回指定 type 的 imageId，url，及 path
   * @param type          "friend" 或 "group" 或 "temp"
   * @param option        选项
   * @param option.data    图片二进制数据
   * @param option.suffix 图片文件后缀名，默认为"jpg"
   * @returns             擦除类型的 Image 或 FlashImage 对象，可经实际构造后插入到message中。
   */
  async upload(
    type: ['image', 'friend' | 'group' | 'temp'],
    option: UploadOption
  ): Promise<TemplateImage>
  /**
   * FIXME: 上游错误:目前该功能返回的 voiceId 无法正常使用，无法发送给好友，提示 message is empty，发到群里则是 1s 的无声语音
   * TODO: 上游todo:目前type仅支持 "group"，请一定指定为"group"，否则将导致未定义行为。
   * 上传语音至服务器，返回 voiceId, url 及 path
   * @param type          "friend" 或 "group" 或 "temp"。
   * @param option        选项
   * @param option.data  语音二进制数据。
   * @param option.suffix 语音文件后缀名，默认为"amr"。
   * @returns             Voice 对象，可直接插入到message中。
   */
  async upload(
    type: ['voice', 'friend' | 'group' | 'temp'],
    option: UploadOption
  ): Promise<Voice>
  async upload(
    type: ['image' | 'voice', 'friend' | 'group' | 'temp'],
    option: UploadOption
  ): Promise<TemplateImage | Voice> {
    // 检查对象状态
    if (!this.conf) throw new Error('upload 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (type[0] == 'image') {
      return await _uploadImage({
        httpUrl,
        sessionKey,
        type: type[1],
        img: option.data,
        suffix: option.suffix
      })
    } else {
      return await _uploadVoice({
        httpUrl,
        sessionKey,
        type: type[1],
        voice: option.data,
        suffix: option.suffix
      })
    }
  }
  /**
   * 列出好友。
   * @param type 要列出的类型。
   * @returns    好友列表
   */
  async list(type: 'friend'): Promise<User[]>
  /**
   * 列出群聊。
   * @param type 要列出的类型。
   * @returns    好友列表
   */
  async list(type: 'group'): Promise<Group[]>
  /**
   * 列出好友。
   * @param type 要列出的类型。
   * @param id   群聊qq。
   * @returns    群员列表
   */
  async list(type: 'member', id: GroupID): Promise<Member[]>
  async list(
    type: 'friend' | 'group' | 'member',
    id?: GroupID
  ): Promise<User[] | Group[] | Member[]> {
    if (!this.conf) throw new Error('list 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (type == 'member') {
      if (!id) throw new Error('list 必须指定id')
      return await _getMemberList({
        httpUrl,
        sessionKey,
        target: id
      })
    } else {
      if (id) throw new Error('list 不能指定id')
      return await (type == 'friend' ? _getFriendList : _getGroupList)({
        httpUrl,
        sessionKey
      })
    }
  }
  /**
   * 获取群成员设置
   * @param info 上下文对象。
   * @returns    群成员设置
   */
  async get(info: MemberID): Promise<Member>
  /**
   * 获取群信息
   * @param info 群号
   * @returns    群信息
   */
  async get(info: GroupID): Promise<GroupInfo>
  async get(info: MemberID | GroupID): Promise<Member | GroupInfo> {
    // 检查对象状态
    if (!this.conf) throw new Error('getMember 请先调用 open，建立一个会话')
    // 获取列表
    const { httpUrl, sessionKey } = this.conf
    if (typeof info != 'number') {
      return await _getMemberInfo({
        httpUrl,
        sessionKey,
        target: info.group,
        memberId: info.qq
      })
    } else {
      return await _getGroupConfig({ httpUrl, sessionKey, target: info })
    }
  }
  /**
   * 设定群成员设置
   * @param info    上下文对象。
   * @param setting 成员设定。
   * @returns       群成员设置
   */
  async set(
    info: MemberID,
    setting: {
      memberName?: string
      specialTitle?: string
      permission?: 'ADMINISTRATOR' | 'MEMBER'
    }
  ): Promise<void>
  /**
   * 设定群设置
   * @param info    上下文对象。
   * @param setting 群设定。
   * @returns       群成员设置
   */
  async set(info: GroupID, setting: GroupInfo): Promise<void>
  async set(
    info: GroupID | MemberID,
    setting: MemberSetting | GroupInfo
  ): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('getMember 请先调用 open，建立一个会话')
    // 获取列表
    const { httpUrl, sessionKey } = this.conf
    if (typeof info != 'number') {
      const v = setting as MemberSetting
      await _setMemberInfo({
        httpUrl,
        sessionKey,
        target: info.group,
        memberId: info.qq,
        info: {
          name: v.memberName,
          specialTitle: v.specialTitle
        }
      })
      // setPermission
      if (v.permission) {
        await _setMemberPerm({
          httpUrl,
          sessionKey,
          target: info.group,
          memberId: info.qq,
          assign: v.permission == 'ADMINISTRATOR'
        })
      }
    } else {
      await _setGroupConfig({
        httpUrl,
        sessionKey,
        target: info,
        info: setting as GroupInfo
      })
    }
  }
  /**
   * 获取用户信息
   * @param type   可以为"friend" 或 "member" 或 "user" 或 "bot"。在某些情况下friend和user可以混用，但获得信息的详细程度可能不同。
   * @param target 上下文。
   * @returns      用户资料
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
    if (!this.conf) throw new Error('profile 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    // 检查参数
    if (type == 'member') {
      const v = target as MemberID
      return await _getMemberProfile({
        httpUrl,
        sessionKey,
        target: v.group,
        memberId: v.qq
      })
    } else if (type == 'bot') {
      return await _getBotProfile({ httpUrl, sessionKey })
    } else {
      return await (type == 'friend' ? _getFriendProfile : _getUserProfile)({
        httpUrl,
        sessionKey,
        target: target as UserID
      })
    }
  }
  /**
   * 获取群公告列表
   * @param group 群号
   * @returns     群公告列表
   */
  async anno(type: 'list', group: GroupID): Promise<Announcement[]>
  /**
   * 删除群公告
   * @param group 群号
   * @param op    公告 id
   */
  async anno(type: 'remove', group: GroupID, op: Announcement): Promise<void>
  /**
   * 发布群公告
   * @param group 群号
   * @param op    发布选项
   */
  async anno(type: 'publish', group: GroupID, op: AnnoOption): Promise<void>
  async anno(
    type: 'list' | 'remove' | 'publish',
    group: GroupID,
    op?: Announcement | AnnoOption
  ): Promise<Announcement[] | void> {
    // 检查对象状态
    if (!this.conf) throw new Error('anno 请先调用 open，建立一个会话')
    // 获取配置
    const { httpUrl, sessionKey } = this.conf
    if (type == 'list') {
      let offset = 0
      let temp: Announcement[]
      const anno: Announcement[] = []
      while (
        (temp = await _getAnnoList({
          httpUrl,
          sessionKey,
          id: group,
          offset,
          size: 10
        })).length > 0
      ) {
        anno.push(...temp)
        // 获取下一页
        offset += 10
      }
      return anno
    } else {
      if (!op) throw Error('anno 需要op参数')
      if (type == 'publish') {
        const v = op as AnnoOption
        await _publishAnno({
          httpUrl,
          sessionKey,
          target: group,
          content: v.content,
          pinned: v.pinned
        })
      } else {
        const v = op as Announcement
        await _deleteAnno({ httpUrl, sessionKey, id: group, fid: v.fid })
      }
    }
  }
  /**
   * 禁言群成员
   * @param qq   群员(单体禁言)或群号(全体禁言)
   * @param time 禁言时长，单位: s (秒)
   */
  async mute(qq: MemberID, time: number): Promise<void>
  /**
   * 全体禁言
   * @param qq   群员(单体禁言)或群号(全体禁言)
   */
  async mute(qq: GroupID): Promise<void>
  async mute(qq: MemberID | GroupID, time?: number): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('mute 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq != 'number') {
      if (!time) throw new Error('mute 必须指定时长')
      await _mute({
        httpUrl,
        sessionKey,
        target: qq.group,
        memberId: qq.qq,
        time
      })
    } else {
      await _muteAll({ httpUrl, sessionKey, target: qq })
    }
  }
  /**
   * 解除禁言
   * @param qq 群员(单体解禁)或群号(全体解禁)
   */
  async unmute(qq: MemberID | GroupID): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('unmute 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (typeof qq != 'number')
      await _unmute({ httpUrl, sessionKey, target: qq.group, memberId: qq.qq })
    else await _unmuteAll({ httpUrl, sessionKey, target: qq })
  }
  /**
   * 移除群成员，好友或群
   * @param type           要移除的类型，可以是'friend'或'group'或'member'
   * @param option         移除选项。
   */
  async remove(type: 'friend', option: RemoveOption<UserID>): Promise<void>
  async remove(type: 'group', option: RemoveOption<GroupID>): Promise<void>
  async remove(type: 'member', option: RemoveOption<MemberID>): Promise<void>
  async remove(
    type: 'friend' | 'group' | 'member',
    option: RemoveOption<UserID | GroupID | MemberID>
  ): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('remove 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (type == 'member') {
      const v = option.qq as MemberID
      await _removeMember({
        httpUrl,
        sessionKey,
        target: v.group,
        memberId: v.qq,
        msg: option.message ?? ''
      })
    } else {
      await (type == 'friend' ? _removeFriend : _quitGroup)({
        httpUrl,
        sessionKey,
        target: option.qq as UserID | GroupID
      })
    }
  }
  /**
   * 获得群文件管理器实例。
   * @param group 群号
   * @returns     群文件管理器
   */
  file(group: GroupID): FileManager {
    if (!this.conf) throw new Error('file 请先调用 open，建立一个会话')
    return new FileManager(this, group)
  }
  /**
   * 响应新朋友事件。
   * @param event          事件。
   * @param option         选项。
   * @param option.action  要进行的操作。"accept":同意。"refuse":拒绝。"refusedie":拒绝并不再受理此请求。
   * @param option.message 附带的信息。
   */
  async action(
    event: NewFriendRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  /**
   * 响应成员加入事件。
   * @param event          事件。
   * @param option         选项。
   * @param option.action  要进行的操作。"accept":同意。"refuse":拒绝。"ignore":忽略。"ignoredie":忽略并不再受理此请求。"refusedie":拒绝并不再受理此请求。
   * @param option.message 附带的信息。
   */
  async action(
    event: MemberJoinRequestEvent,
    option: {
      action: 'accept' | 'refuse' | 'ignore' | 'ignoredie' | 'refusedie'
      message?: string
    }
  ): Promise<void>
  /**
   * 响应被邀请加入群事件。
   * @param event          事件。
   * @param option         选项。
   * @param option.action  要进行的操作。"accept":同意。"refuse":拒绝。
   * @param option.message 附带的信息。
   */
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
    if (!this.conf) throw new Error('action 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    if (event.type == 'NewFriendRequestEvent') {
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
    } else if (event.type == 'MemberJoinRequestEvent') {
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
   * 设置群精华消息
   * @param message 消息
   */
  async essence(message: GroupMessage): Promise<void> {
    // 检查对象状态
    if (!this.conf) throw new Error('setEssence 请先调用 open，建立一个会话')
    const { httpUrl, sessionKey } = this.conf
    await _setEssence({
      httpUrl,
      sessionKey,
      target: message.sender.group.id,
      messageId: message.messageChain[0].id
    })
  }
}
