/** 上下文，用于指定群聊成员。 */
export interface MemberID {
  group: GroupID
  qq: UserID
}
/** 用户qq。 */
export type UserID = number
/** 群聊qq。 */
export type GroupID = number
/** 公告的结构。 */
export interface Announcement {
  /** 公告所在的群聊。 */
  group: Group
  /** 公告内容 */
  content: string
  /** 创建公告的用户 */
  senderId: UserID
  /** 公告唯一id */
  fid: string
  /** 是否全员确认 */
  allConfirmed: boolean
  /** 已确认的人数 */
  confirmedMembersCount: number
  /** 公告发布的时间 */
  publicationTime: number
}
/** 权限类型，群主/管理员/成员 */
export type Permission = 'OWNER' | 'ADMINISTRATOR' | 'MEMBER'
/** 群组。 */
export interface Group {
  /** 群号 */
  id: GroupID
  /** 群名称 */
  name: string
  /** Bot在群内的权限 */
  permission: Permission
}
/** 成员 */
export interface Member {
  /** 成员qq */
  id: UserID
  /** 成员群名片 */
  memberName: string
  /** 成员群头衔 */
  specialTitle: string
  /** 成员的权限 */
  permission: Permission
  /** 成员加入群组的时间 */
  joinTimestamp: number
  /** 最后发言的时间 */
  lastSpeakTimestamp: number
  /** 禁言剩余的时间 */
  muteTimeRemaining: number
  /** 成员所在的群聊 */
  group: Group
}
/** 用户 */
export interface User {
  /** 用户qq */
  id: UserID
  /** 用户昵称 */
  nickname: string
  /** 用户备注 */
  remark: string
}
/** 其它平台客户端 */
export interface OtherClient {
  /** 平台id */
  id: number
  /** 平台类型 */
  platform: string
}
/** 用户的资料 */
export interface Profile {
  /** 昵称 */
  nickname: string
  /** 电子邮箱 */
  email: string
  /** 年龄 */
  age: number
  /** QQ等级 */
  level: number
  /** 用户个性签名 */
  sign: number
  /** 用户性别 */
  sex: Sex
}
/** 群聊信息
 * 注：没有群公告是因为这个东西可能被弃用了而没有在API上更新。
 * 如果认为需要加回的情况，请开issue。
 */
export interface GroupInfo {
  /** 群聊名称 */
  name: string
  /** 允许群内坦白说 */
  confessTalk: boolean
  /** 允许邀请进群 */
  allowMemberInvite: boolean
  /** 自动审核 */
  autoApprove: boolean
  /** 允许匿名聊天 */
  anonymousChat: boolean
}
export interface MemberSetting {
  /** 成员名字 */
  memberName?: string
  /** 群头衔 */
  specialTitle?: string
  /** 权限 */
  permission?: 'ADMINISTRATOR' | 'MEMBER'
}
/** 用户性别 */
export type Sex = 'UNKNOWN' | 'MALE' | 'FEMALE'
