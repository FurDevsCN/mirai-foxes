export interface DownloadInfo {
  // sha1
  sha1: string
  // md5
  md5: string
  // 下载次数
  downloadTimes: number
  // 上传者QQ
  uploaderId: UserID
  // 上传时间
  uploadTime: number
  // 最后修改时间
  lastModifyTime: number
  // 下文件的url
  url: string
}
export interface FileDetail {
  // 文件名
  name: string
  // id
  id: string
  // 路径
  path: string
  // 父目录
  parent: null | FileDetail
  // 来自
  contact: Group | User
  // 是否是文件
  isFile: boolean
  // 是否是目录（可和文件二选一，统一用一个）
  isDirectory: boolean
  // sha1
  sha1: string
  // md5
  md5: string
  // 下载次数
  downloadTimes: number
  // 上传者QQ
  uploaderId: UserID
  // 上传时间
  uploadTime: number
  // 最后修改时间
  lastModifyTime: number
}
export interface MemberID {
  group: GroupID
  qq: UserID
}
export type UserID = number
export type GroupID = number
export interface Announcement {
  group: Group
  content: string
  senderId: UserID
  fid: string
  allConfirmed: boolean
  confirmedMembersCount: number
  publicationTime: number
}
export type Permission = 'OWNER' | 'ADMINISTRATOR' | 'MEMBER'
export interface Group {
  id: GroupID
  name: string
  permission: Permission
}
export interface Member {
  id: UserID
  memberName: string
  specialTitle: string
  permission: Permission
  joinTimestamp: number
  lastSpeakTimestamp: number
  muteTimeRemaining: number
  group: Group
}
export interface User {
  id: UserID
  nickname: string
  remark: string
}
export interface OtherClient {
  id: number
  OtherClient: string
}
export interface Profile {
  nickname: string
  email: string
  age: number
  level: number
  sign: number
  sex: Sex
}
export interface GroupInfo {
  name: string
  announcement: string
  confessTalk: boolean
  allowMemberInvite: boolean
  autoApprove: boolean
  anonymousChat: boolean
}
export type Sex = 'UNKNOWN' | 'MALE' | 'FEMALE'
