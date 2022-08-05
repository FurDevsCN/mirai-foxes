import { ClientRequest, IncomingMessage } from 'http'
import { User, Member, Group, OtherClient, Permission, GroupID } from './Base'
import { UserID } from './Base'
import { MessageChain } from './Message'
export type Content = EventBase
export class EventBase {
  readonly type: EventType
  constructor({ type }: { type: EventType }) {
    this.type = type
  }
}
export class BotOnlineEvent extends EventBase {
  qq: UserID
  constructor({ qq }: { qq: UserID }) {
    super({ type: 'BotOnlineEvent' })
    this.qq = qq
  }
}
export class BotOfflineEventActive extends EventBase {
  qq: UserID
  constructor({ qq }: { qq: UserID }) {
    super({ type: 'BotOfflineEventActive' })
    this.qq = qq
  }
}
export class BotOfflineEventForce extends EventBase {
  qq: UserID
  constructor({ qq }: { qq: UserID }) {
    super({ type: 'BotOfflineEventForce' })
    this.qq = qq
  }
}
export class BotOfflineEventDropped extends EventBase {
  qq: UserID
  constructor({ qq }: { qq: UserID }) {
    super({ type: 'BotOfflineEventDropped' })
    this.qq = qq
  }
}
export class BotReloginEvent extends EventBase {
  qq: UserID
  constructor({ qq }: { qq: UserID }) {
    super({ type: 'BotReloginEvent' })
    this.qq = qq
  }
}
export class FriendInputStatusChangedEvent extends EventBase {
  inputting: boolean
  friend: User
  constructor({ friend, inputting }: { inputting: boolean; friend: User }) {
    super({ type: 'FriendInputStatusChangedEvent' })
    ;[this.friend, this.inputting] = [friend, inputting]
  }
}
export class FriendNickChangedEvent extends EventBase {
  friend: User
  from: string
  to: string
  constructor({
    friend,
    from,
    to
  }: {
    friend: User
    from: string
    to: string
  }) {
    super({ type: 'FriendNickChangedEvent' })
    ;[this.friend, this.from, this.to] = [friend, from, to]
  }
}
export class BotGroupPermissionChangeEvent extends EventBase {
  origin: Permission
  current: Permission
  group: Group
  constructor({
    origin,
    current,
    group
  }: {
    origin: Permission
    current: Permission
    group: Group
  }) {
    super({ type: 'BotGroupPermissionChangeEvent' })
    ;[this.origin, this.current, this.group] = [origin, current, group]
  }
}
export class BotMuteEvent extends EventBase {
  durationSeconds: number
  operator: Member
  constructor({
    durationSeconds,
    operator
  }: {
    durationSeconds: number
    operator: Member
  }) {
    super({ type: 'BotMuteEvent' })
    ;[this.durationSeconds, this.operator] = [durationSeconds, operator]
  }
}
export class BotUnmuteEvent extends EventBase {
  operator: Member
  constructor({ operator }: { operator: Member }) {
    super({ type: 'BotUnmuteEvent' })
    this.operator = operator
  }
}
export class BotJoinGroupEvent extends EventBase {
  group: Group
  invitor: undefined | Member
  constructor({ group, invitor }: { group: Group; invitor?: Member }) {
    super({ type: 'BotJoinGroupEvent' })
    ;[this.group, this.invitor] = [group, invitor]
  }
}
export class BotLeaveEventActive extends EventBase {
  group: Group
  constructor({ group }: { group: Group }) {
    super({ type: 'BotLeaveEventActive' })
    this.group = group
  }
}
export class BotLeaveEventKick extends EventBase {
  group: Group
  constructor({ group }: { group: Group }) {
    super({ type: 'BotLeaveEventKick' })
    this.group = group
  }
}
export class BotLeaveEventDisband extends EventBase {
  group: Group
  operator: Member
  constructor({ group, operator }: { group: Group; operator: Member }) {
    super({ type: 'BotLeaveEventDisband' })
    ;[this.group, this.operator] = [group, operator]
  }
}
export class GroupRecallEvent extends EventBase {
  authorId: UserID
  messageId: number
  time: number
  group: Group
  operator: undefined | Member
  constructor({
    authorId,
    messageId,
    time,
    group,
    operator
  }: {
    authorId: UserID
    messageId: number
    time: number
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupRecallEvent' })
    ;[this.authorId, this.messageId, this.time, this.group, this.operator] = [
      authorId,
      messageId,
      time,
      group,
      operator
    ]
  }
}
export class FriendRecallEvent extends EventBase {
  authorId: UserID
  messageId: number
  time: number
  operator: UserID
  constructor({
    authorId,
    messageId,
    time,
    operator
  }: {
    authorId: UserID
    messageId: number
    time: number
    operator: UserID
  }) {
    super({ type: 'FriendRecallEvent' })
    ;[this.authorId, this.messageId, this.time, this.operator] = [
      authorId,
      messageId,
      time,
      operator
    ]
  }
}
export class NudgeEvent extends EventBase {
  fromId: UserID
  subject: {
    id: GroupID | UserID
    kind: 'Group' | 'Friend'
  }
  action: string
  suffix: string
  target: UserID
  constructor({
    fromId,
    subject,
    action,
    suffix,
    target
  }: {
    fromId: UserID
    subject: {
      id: GroupID | UserID
      kind: 'Group' | 'Friend'
    }
    action: string
    suffix: string
    target: UserID
  }) {
    super({ type: 'NudgeEvent' })
    ;[this.fromId, this.subject, this.action, this.suffix, this.target] = [
      fromId,
      subject,
      action,
      suffix,
      target
    ]
  }
}
export class GroupNameChangeEvent extends EventBase {
  origin: string
  current: string
  group: Group
  operator: undefined | Member
  constructor({
    origin,
    current,
    group,
    operator
  }: {
    origin: string
    current: string
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupNameChangeEvent' })
    ;[this.origin, this.current, this.group, this.operator] = [
      origin,
      current,
      group,
      operator
    ]
  }
}
export class GroupEntranceAnnouncementChangeEvent extends EventBase {
  origin: string
  current: string
  group: Group
  operator: undefined | Member
  constructor({
    origin,
    current,
    group,
    operator
  }: {
    origin: string
    current: string
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupEntranceAnnouncementChangeEvent' })
    ;[this.origin, this.current, this.group, this.operator] = [
      origin,
      current,
      group,
      operator
    ]
  }
}
export class GroupMuteAllEvent extends EventBase {
  origin: boolean
  current: boolean
  group: Group
  operator: undefined | Member
  constructor({
    origin,
    current,
    group,
    operator
  }: {
    origin: boolean
    current: boolean
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupMuteAllEvent' })
    ;[this.origin, this.current, this.group, this.operator] = [
      origin,
      current,
      group,
      operator
    ]
  }
}
export class GroupAllowAnonymousChatEvent extends EventBase {
  origin: boolean
  current: boolean
  group: Group
  operator: undefined | Member
  constructor({
    origin,
    current,
    group,
    operator
  }: {
    origin: boolean
    current: boolean
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupAllowAnonymousChatEvent' })
    ;[this.origin, this.current, this.group, this.operator] = [
      origin,
      current,
      group,
      operator
    ]
  }
}
export class GroupAllowConfessTalkEvent extends EventBase {
  origin: boolean
  current: boolean
  group: Group
  isByBot: boolean
  constructor({
    origin,
    current,
    group,
    isByBot
  }: {
    origin: boolean
    current: boolean
    group: Group
    isByBot: boolean
  }) {
    super({ type: 'GroupAllowConfessTalkEvent' })
    ;[this.origin, this.current, this.group, this.isByBot] = [
      origin,
      current,
      group,
      isByBot
    ]
  }
}
export class GroupAllowMemberInviteEvent extends EventBase {
  origin: boolean
  current: boolean
  group: Group
  operator: undefined | Member
  constructor({
    origin,
    current,
    group,
    operator
  }: {
    origin: boolean
    current: boolean
    group: Group
    operator?: Member
  }) {
    super({ type: 'GroupAllowMemberInviteEvent' })
    ;[this.origin, this.current, this.group, this.operator] = [
      origin,
      current,
      group,
      operator
    ]
  }
}
export class MemberJoinEvent extends EventBase {
  member: Member
  invitor: undefined | Member
  constructor({ member, invitor }: { member: Member; invitor?: Member }) {
    super({ type: 'MemberJoinEvent' })
    ;[this.member, this.invitor] = [member, invitor]
  }
}
export class MemberLeaveEventKick extends EventBase {
  member: Member
  operator: undefined | Member
  constructor({ member, operator }: { member: Member; operator?: Member }) {
    super({ type: 'MemberLeaveEventKick' })
    ;[this.member, this.operator] = [member, operator]
  }
}
export class MemberLeaveEventQuit extends EventBase {
  member: Member
  constructor({ member }: { member: Member; operator?: Member }) {
    super({ type: 'MemberLeaveEventQuit' })
    this.member = member
  }
}
export class MemberCardChangeEvent extends EventBase {
  origin: string
  current: string
  member: Member
  constructor({
    origin,
    current,
    member
  }: {
    origin: string
    current: string
    member: Member
  }) {
    super({ type: 'MemberCardChangeEvent' })
    ;[this.origin, this.current, this.member] = [origin, current, member]
  }
}
export class MemberSpecialTitleChangeEvent extends EventBase {
  origin: string
  current: string
  member: Member
  constructor({
    origin,
    current,
    member
  }: {
    origin: string
    current: string
    member: Member
  }) {
    super({ type: 'MemberSpecialTitleChangeEvent' })
    ;[this.origin, this.current, this.member] = [origin, current, member]
  }
}
export class MemberPermissionChangeEvent extends EventBase {
  origin: 'ADMINISTRATOR' | 'MEMBER'
  current: 'ADMINISTRATOR' | 'MEMBER'
  member: Member
  constructor({
    origin,
    current,
    member
  }: {
    origin: 'ADMINISTRATOR' | 'MEMBER'
    current: 'ADMINISTRATOR' | 'MEMBER'
    member: Member
  }) {
    super({ type: 'MemberPermissionChangeEvent' })
    ;[this.origin, this.current, this.member] = [origin, current, member]
  }
}
export class MemberMuteEvent extends EventBase {
  durationSeconds: number
  member: Member
  operator: undefined | Member
  constructor({
    durationSeconds,
    member,
    operator
  }: {
    durationSeconds: number
    member: Member
    operator?: Member
  }) {
    super({ type: 'MemberMuteEvent' })
    ;[this.durationSeconds, this.member, this.operator] = [
      durationSeconds,
      member,
      operator
    ]
  }
}
export class MemberUnmuteEvent extends EventBase {
  member: Member
  operator: undefined | Member
  constructor({ member, operator }: { member: Member; operator?: Member }) {
    super({ type: 'MemberUnmuteEvent' })
    ;[this.member, this.operator] = [member, operator]
  }
}
export class MemberHonorChangeEvent extends EventBase {
  honor: string
  action: 'achieve' | 'lost'
  member: Member
  constructor({
    honor,
    action,
    member
  }: {
    honor: string
    action: 'achieve' | 'lost'
    member: Member
  }) {
    super({ type: 'MemberHonorChangeEvent' })
    ;[this.honor, this.action, this.member] = [honor, action, member]
  }
}
export class NewFriendRequestEvent extends EventBase {
  eventId: number
  fromId: UserID
  groupId: 0 | GroupID
  nick: string
  message: string
  constructor({
    eventId,
    fromId,
    groupId,
    nick,
    message
  }: {
    eventId: number
    fromId: UserID
    groupId: 0 | GroupID
    nick: string
    message: string
  }) {
    super({ type: 'NewFriendRequestEvent' })
    ;[this.eventId, this.fromId, this.groupId, this.nick, this.message] = [
      eventId,
      fromId,
      groupId,
      nick,
      message
    ]
  }
}
export class MemberJoinRequestEvent extends EventBase {
  eventId: number
  fromId: UserID
  groupId: GroupID
  groupName: string
  nick: string
  message: string
  constructor({
    eventId,
    fromId,
    groupId,
    groupName,
    nick,
    message
  }: {
    eventId: number
    fromId: UserID
    groupId: GroupID
    groupName: string
    nick: string
    message: string
  }) {
    super({ type: 'MemberJoinRequestEvent' })
    ;[
      this.eventId,
      this.fromId,
      this.groupId,
      this.groupName,
      this.nick,
      this.message
    ] = [eventId, fromId, groupId, groupName, nick, message]
  }
}
export class BotInvitedJoinGroupRequestEvent extends EventBase {
  eventId: number
  fromId: UserID
  groupId: GroupID
  groupName: string
  nick: string
  message: string
  constructor({
    eventId,
    fromId,
    groupId,
    groupName,
    nick,
    message
  }: {
    eventId: number
    fromId: UserID
    groupId: GroupID
    groupName: string
    nick: string
    message: string
  }) {
    super({ type: 'BotInvitedJoinGroupRequestEvent' })
    ;[
      this.eventId,
      this.fromId,
      this.groupId,
      this.groupName,
      this.nick,
      this.message
    ] = [eventId, fromId, groupId, groupName, nick, message]
  }
}
export class OtherClientOnlineEvent extends EventBase {
  client: OtherClient
  kind: undefined | number
  constructor({ client, kind }: { client: OtherClient; kind?: number }) {
    super({ type: 'OtherClientOnlineEvent' })
    ;[this.client, this.kind] = [client, kind]
  }
}
export class OtherClientOfflineEvent extends EventBase {
  client: OtherClient
  constructor({ client }: { client: OtherClient }) {
    super({ type: 'OtherClientOfflineEvent' })
    this.client = client
  }
}
export class FriendMessage extends EventBase {
  sender: User
  messageChain: MessageChain
  constructor({
    sender,
    messageChain
  }: {
    sender: User
    messageChain: MessageChain
  }) {
    super({ type: 'FriendMessage' })
    ;[this.sender, this.messageChain] = [sender, messageChain]
  }
}
export class GroupMessage extends EventBase {
  sender: Member
  messageChain: MessageChain
  constructor({
    sender,
    messageChain
  }: {
    sender: Member
    messageChain: MessageChain
  }) {
    super({ type: 'GroupMessage' })
    ;[this.sender, this.messageChain] = [sender, messageChain]
  }
}
export class OtherClientMessage extends EventBase {
  sender: OtherClient
  messageChain: MessageChain
  constructor({
    sender,
    messageChain
  }: {
    sender: OtherClient
    messageChain: MessageChain
  }) {
    super({ type: 'OtherClientMessage' })
    ;[this.sender, this.messageChain] = [sender, messageChain]
  }
}
export interface WsClose {
  code: number
  reason: Buffer
}
export interface WsUnexpectedResponse {
  request: ClientRequest
  response: IncomingMessage
}
interface Events {
  // WebSocket 事件
  error: Error
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
export type EventType = keyof Events
export type TempMessage = GroupMessage
export type StrangerMessage = FriendMessage
export type Message = FriendMessage | GroupMessage | OtherClientMessage
/* eslint-disable @typescript-eslint/no-explicit-any */
export type EventArg<T extends EventType | null> = T extends EventType
  ? Events[T]
  : any
// Processor
export type Processor<T extends EventType | null = EventArg<null>> = (
  data: EventArg<T>
) => Promise<void> | void
export type EventMap = Map<EventType, (Processor | undefined)[]>
export type EventIndex = number
