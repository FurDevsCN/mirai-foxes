import { ClientRequest, IncomingMessage } from 'http'
import { User, Member, Group, OtherClient, Permission, GroupID } from './Base'
import { UserID } from './Base'
import { MessageChain } from './Message'
/** 基本事件 */
export interface EventBase {
  /** 类型 */
  readonly type: EventType
}
/** bot上线事件 */
export interface BotOnlineEvent extends EventBase {
  readonly type: 'BotOnlineEvent'
  /** 上线的bot QQ */
  qq: UserID
}
/** bot主动下线事件 */
export interface BotOfflineEventActive extends EventBase {
  readonly type: 'BotOfflineEventActive'
  /** 下线的bot QQ */
  qq: UserID
}
/** bot被踢下线事件 */
export interface BotOfflineEventForce extends EventBase {
  readonly type: 'BotOfflineEventForce'
  /** 下线的bot QQ */
  qq: UserID
}
/** bot和服务器断连事件 */
export interface BotOfflineEventDropped extends EventBase {
  readonly type: 'BotOfflineEventDropped'
  /** 下线的bot QQ */
  qq: UserID
}
/** bot重登事件 */
export interface BotReloginEvent extends EventBase {
  readonly type: 'BotReloginEvent'
  /** 重登的bot QQ */
  qq: UserID
}
/** 好友输入状态改变事件 */
export interface FriendInputStatusChangedEvent extends EventBase {
  readonly type: 'FriendInputStatusChangedEvent'
  /** 现在的输入状态 */
  inputting: boolean
  /** 好友信息 */
  friend: User
}
/** 好友昵称改变事件 */
export interface FriendNickChangedEvent extends EventBase {
  readonly type: 'FriendNickChangedEvent'
  /** 好友信息 */
  friend: User
  /** 原来的昵称 */
  from: string
  /** 现在的昵称 */
  to: string
}
/** Bot 群权限被改变事件 */
export interface BotGroupPermissionChangeEvent extends EventBase {
  readonly type: 'BotGroupPermissionChangeEvent'
  /** 原来的权限 */
  origin: Permission
  /** 现在的权限 */
  current: Permission
  /** 群聊信息 */
  group: Group
}
/** Bot 被禁言事件 */
export interface BotMuteEvent extends EventBase {
  readonly type: 'BotMuteEvent'
  /** 时长 */
  durationSeconds: number
  /** 操作者 */
  operator: Member
}
/** Bot 被解禁事件 */
export interface BotUnmuteEvent extends EventBase {
  readonly type: 'BotUnmuteEvent'
  /** 操作者 */
  operator: Member
}
/** Bot 加入群组事件 */
export interface BotJoinGroupEvent extends EventBase {
  readonly type: 'BotJoinGroupEvent'
  /** 加入的群聊 */
  group: Group
  /** 邀请者（如果有） */
  invitor?: Member
}
/** Bot 主动退群事件 */
export interface BotLeaveEventActive extends EventBase {
  readonly type: 'BotLeaveEventActive'
  /** 退出的群聊 */
  group: Group
}
/** Bot 被踢事件 */
export interface BotLeaveEventKick extends EventBase {
  readonly type: 'BotLeaveEventKick'
  /** 被踢出的群聊 */
  group: Group
  /** 操作者 */
  operator: Member
}
/** Bot 群聊解散事件 */
export interface BotLeaveEventDisband extends EventBase {
  readonly type: 'BotLeaveEventDisband'
  /** 解散的群聊 */
  group: Group
  /** 操作者（一定是群主） */
  operator: Member
}
/** 群撤回消息事件 */
export interface GroupRecallEvent extends EventBase {
  readonly type: 'GroupRecallEvent'
  /** 原消息用户ID */
  authorId: UserID
  /** 撤回消息的messageId */
  messageId: number
  /** 原消息发送时间 */
  time: number
  /** 群聊 */
  group: Group
  /** 操作者（当没有数据时就是bot干的） */
  operator?: Member
}
/** 好友撤回消息事件 */
export interface FriendRecallEvent extends EventBase {
  readonly type: 'FriendRecallEvent'
  /** 原消息用户ID */
  authorId: UserID
  /** 原消息messageId */
  messageId: number
  /** 原消息发送时间 */
  time: number
  /** 好友QQ或者Bot QQ */
  operator: UserID
}
/** 戳一戳事件 */
export interface NudgeEvent extends EventBase {
  readonly type: 'NudgeEvent'
  /** 发送者ID */
  fromId: UserID
  subject: {
    /** 群号或者好友qq */
    id: GroupID | UserID
    /** id类型 */
    kind: 'Group' | 'Friend'
  }
  /** 动作类型 */
  action: string
  /** 动作后缀 */
  suffix: string
  /** 被戳人的QQ */
  target: UserID
}
/** 群名变更事件 */
export interface GroupNameChangeEvent extends EventBase {
  readonly type: 'GroupNameChangeEvent'
  /** 原来的群名 */
  origin: string
  /** 现在的群名 */
  current: string
  /** 群号 */
  group: Group
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 入群公告变更事件 */
export interface GroupEntranceAnnouncementChangeEvent extends EventBase {
  readonly type: 'GroupEntranceAnnouncementChangeEvent'
  /** 原来的入群公告 */
  origin: string
  /** 现在的入群公告 */
  current: string
  /** 群聊 */
  group: Group
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 全员禁言事件 */
export interface GroupMuteAllEvent extends EventBase {
  readonly type: 'GroupMuteAllEvent'
  /** 原状态 */
  origin: boolean
  /** 现在的状态 */
  current: boolean
  /** 群聊 */
  group: Group
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 群聊允许匿名聊天事件 */
export interface GroupAllowAnonymousChatEvent extends EventBase {
  readonly type: 'GroupAllowAnonymousChatEvent'
  /** 原状态 */
  origin: boolean
  /** 现在的状态 */
  current: boolean
  /** 群聊 */
  group: Group
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 群聊允许坦白说事件 */
export interface GroupAllowConfessTalkEvent extends EventBase {
  readonly type: 'GroupAllowConfessTalkEvent'
  /** 原状态 */
  origin: boolean
  /** 现在的状态 */
  current: boolean
  /** 群聊 */
  group: Group
  /** 是不是Bot干的 */
  isByBot: boolean
}
/** 群聊允许成员邀请加群事件 */
export interface GroupAllowMemberInviteEvent extends EventBase {
  readonly type: 'GroupAllowMemberInviteEvent'
  /** 原状态 */
  origin: boolean
  /** 现在的状态 */
  current: boolean
  /** 群聊 */
  group: Group
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 成员加入事件 */
export interface MemberJoinEvent extends EventBase {
  readonly type: 'MemberJoinEvent'
  /** 加入的成员 */
  member: Member
  /** 邀请者（如果有） */
  invitor?: Member
}
/** 成员被踢事件 */
export interface MemberLeaveEventKick extends EventBase {
  readonly type: 'MemberLeaveEventKick'
  /** 被踢的成员 */
  member: Member
  /** 邀请者（如果有） */
  operator?: Member
}
/** 成员退群事件 */
export interface MemberLeaveEventQuit extends EventBase {
  readonly type: 'MemberLeaveEventQuit'
  /** 退群的成员 */
  member: Member
}
/** 成员群名片修改事件 */
export interface MemberCardChangeEvent extends EventBase {
  readonly type: 'MemberCardChangeEvent'
  /** 原来的群名片 */
  origin: string
  /** 现在的群名片 */
  current: string
  /** （被）改群名片的成员 */
  member: Member
}
/** 成员群头衔更改事件 */
export interface MemberSpecialTitleChangeEvent extends EventBase {
  readonly type: 'MemberSpecialTitleChangeEvent'
  /** 原来的头衔 */
  origin: string
  /** 现在的头衔 */
  current: string
  /** 被改的成员 */
  member: Member
}
/** 群成员权限被改事件 */
export interface MemberPermissionChangeEvent extends EventBase {
  readonly type: 'MemberPermissionChangeEvent'
  /** 原来的权限 */
  origin: Permission
  /** 现在的权限 */
  current: Permission
  /** 被改的成员 */
  member: Member
}
/** 成员被禁言事件 */
export interface MemberMuteEvent extends EventBase {
  readonly type: 'MemberMuteEvent'
  /** 被禁言时长 */
  durationSeconds: number
  /** 被禁言的成员 */
  member: Member
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 成员被解禁事件 */
export interface MemberUnmuteEvent extends EventBase {
  readonly type: 'MemberUnmuteEvent'
  /** 被解禁的成员 */
  member: Member
  /** 操作者，没有数据就是Bot干的 */
  operator?: Member
}
/** 成员群荣誉变更事件（不是群头衔） */
export interface MemberHonorChangeEvent extends EventBase {
  readonly type: 'MemberHonorChangeEvent'
  /** 荣誉 */
  honor: string
  /** 获得/失去 */
  action: 'achieve' | 'lost'
  /** 变更的成员 */
  member: Member
}
/** 用户请求添加Bot事件 */
export interface NewFriendRequestEvent extends EventBase {
  readonly type: 'NewFriendRequestEvent'
  /** 用于回复请求的ID */
  eventId: number
  /** 谁要加Bot */
  fromId: UserID
  /** 哪个群过来的（如果是其它方式搜索到Bot则是0） */
  groupId: 0 | GroupID
  /** 用户昵称 */
  nick: string
  /** 留言 */
  message: string
}
/** 用户请求加入群事件 */
export interface MemberJoinRequestEvent extends EventBase {
  readonly type: 'MemberJoinRequestEvent'
  /** 用于回复请求的ID */
  eventId: number
  /** 谁要进群 */
  fromId: UserID
  /** 进哪个群 */
  groupId: GroupID
  /** 群名字 */
  groupName: string
  /** 用户昵称 */
  nick: string
  /** 验证信息 */
  message: string
}
/** Bot被邀请加群事件 */
export interface BotInvitedJoinGroupRequestEvent extends EventBase {
  readonly type: 'BotInvitedJoinGroupRequestEvent'
  /** 用于回复请求的ID */
  eventId: number
  /** 谁在拉Bot */
  fromId: UserID
  /** 拉到哪个群 */
  groupId: GroupID
  /** 群名字 */
  groupName: string
  /** 好友昵称 */
  nick: string
  /** 留言 */
  message: string
}
/** 其它客户端上线事件 */
export interface OtherClientOnlineEvent extends EventBase {
  readonly type: 'OtherClientOnlineEvent'
  /** 哪个客户端 */
  client: OtherClient
  /** 客户端类型 */
  kind?: number
}
/** 其它客户端下线事件 */
export interface OtherClientOfflineEvent extends EventBase {
  readonly type: 'OtherClientOfflineEvent'
  /** 哪个客户端 */
  client: OtherClient
}
/** 好友消息 */
export interface FriendMessage extends EventBase {
  readonly type: 'FriendMessage'
  /** 消息链 */
  messageChain: MessageChain
  /** 发给Bot消息的好友 */
  sender: User
}
/** 群组消息 */
export interface GroupMessage extends EventBase {
  readonly type: 'GroupMessage'
  /** 消息链 */
  messageChain: MessageChain
  /** 发消息的成员 */
  sender: Member
}
/** 临时消息 */
export interface TempMessage extends EventBase {
  readonly type: 'TempMessage'
  /** 消息链 */
  messageChain: MessageChain
  /** 发给Bot消息的成员 */
  sender: Member
}
export interface StrangerMessage extends EventBase {
  readonly type: 'StrangerMessage'
  /** 消息链 */
  messageChain: MessageChain
  /** 发给Bot消息的用户 */
  sender: User
}
/** 其它客户端消息基类 */
export interface OtherClientMessage extends EventBase {
  readonly type: 'OtherClientMessage'
  /** 消息链 */
  messageChain: MessageChain
  /** 发给Bot消息的客户端 */
  sender: OtherClient
}
/** websocket 错误事件 */
export interface WsError extends EventBase {
  readonly type: 'error'
  /** 错误信息 */
  error: Error
}
/** websocket 关闭事件 */
export interface WsClose extends EventBase {
  readonly type: 'close'
  code: number
  reason: Buffer
}
/** websocket 未预期的消息（报文格式不对）事件 */
export interface WsUnexpectedResponse extends EventBase {
  readonly type: 'unexpected-response'
  request: ClientRequest
  response: IncomingMessage
}
/** @private 事件id对参数类型，用于EventArg等 */
interface Events {
  // WebSocket 事件
  error: WsError
  close: WsClose // done
  'unexpected-response': WsUnexpectedResponse // done
  // mirai 事件
  GroupMessage: GroupMessage // done
  FriendMessage: FriendMessage // done
  TempMessage: TempMessage // done
  StrangerMessage: StrangerMessage // done
  OtherClientMessage: OtherClientMessage // done
  BotOnlineEvent: BotOnlineEvent
  BotOfflineEventActive: BotOfflineEventActive
  BotOfflineEventForce: BotOfflineEventForce
  BotOfflineEventDropped: BotOfflineEventDropped
  BotReloginEvent: BotReloginEvent
  FriendInputStatusChangedEvent: FriendInputStatusChangedEvent
  FriendNickChangedEvent: FriendNickChangedEvent
  BotGroupPermissionChangeEvent: BotGroupPermissionChangeEvent
  BotMuteEvent: BotMuteEvent
  BotUnmuteEvent: BotUnmuteEvent
  BotJoinGroupEvent: BotJoinGroupEvent
  BotLeaveEventActive: BotLeaveEventActive
  BotLeaveEventKick: BotLeaveEventKick
  BotLeaveEventDisband: BotLeaveEventDisband
  GroupRecallEvent: GroupRecallEvent
  FriendRecallEvent: FriendRecallEvent
  NudgeEvent: NudgeEvent
  GroupNameChangeEvent: GroupNameChangeEvent
  GroupEntranceAnnouncementChangeEvent: GroupEntranceAnnouncementChangeEvent
  GroupMuteAllEvent: GroupMuteAllEvent
  GroupAllowAnonymousChatEvent: GroupAllowAnonymousChatEvent
  GroupAllowConfessTalkEvent: GroupAllowConfessTalkEvent
  GroupAllowMemberInviteEvent: GroupAllowMemberInviteEvent
  MemberJoinEvent: MemberJoinEvent
  MemberLeaveEventKick: MemberLeaveEventKick
  MemberLeaveEventQuit: MemberLeaveEventQuit
  MemberCardChangeEvent: MemberCardChangeEvent
  MemberSpecialTitleChangeEvent: MemberSpecialTitleChangeEvent
  MemberPermissionChangeEvent: MemberPermissionChangeEvent
  MemberMuteEvent: MemberMuteEvent
  MemberUnmuteEvent: MemberUnmuteEvent
  MemberHonorChangeEvent: MemberHonorChangeEvent
  NewFriendRequestEvent: NewFriendRequestEvent
  MemberJoinRequestEvent: MemberJoinEvent
  BotInvitedJoinGroupRequestEvent: BotInvitedJoinGroupRequestEvent
  OtherClientOnlineEvent: OtherClientOnlineEvent
  OtherClientOfflineEvent: OtherClientOfflineEvent
}
/** Event类型 */
export type EventType = keyof Events
/** 通用消息类型 */
export type Message =
  | FriendMessage
  | GroupMessage
  | OtherClientMessage
  | StrangerMessage
  | TempMessage
/**
 * Typescript Helper：获得事件的参数类型。
 * 例：EventArg<'FriendMessage'> = FriendMessage
 * EventArg<EventType> 可获得所有参数的联合类型。
 */
export type EventArg<T extends EventType> = Events[T]
