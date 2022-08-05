import {  GroupID, MemberID, UserID } from './Base'
import {
  FriendMessage,
  GroupMessage,
  StrangerMessage,
  TempMessage,
  EventArg
} from './Event'
/**
 * Bot.wait方法的匹配器生成器。可以利用此方法来等待指定用户的下一条消息。
 * @param type 匹配器类型。'friend'用于好友消息，'member'用于群聊消息，'temp'用于临时消息和陌生人消息。
 * @param qq 用户qq，群号或上下文。
 * @returns 匹配器
 */
export function waitFor(
  type: 'friend',
  qq: UserID
): (data: FriendMessage) => boolean
export function waitFor(
  type: 'member',
  qq: UserID
): (data: GroupMessage) => boolean
export function waitFor(
  type: 'temp',
  qq: MemberID
): (data: TempMessage) => boolean
export function waitFor(
  type: 'temp',
  qq: UserID
): (data: StrangerMessage) => boolean
export function waitFor(
  type: 'friend' | 'member' | 'temp',
  qq: UserID | MemberID | GroupID
): (data: EventArg<null>) => boolean {
  if (type == 'friend') {
    if (typeof qq != 'number') throw new Error('waitFor 参数错误')
    return (data: FriendMessage): boolean => {
      return data.sender.id == qq
    }
  } else if (type == 'temp') {
    if (typeof qq == 'number')
      return (data: StrangerMessage): boolean => {
        return data.sender.id == qq
      }
    return (data: TempMessage): boolean => {
      return data.sender.id == qq.qq && data.sender.group.id == qq.group
    }
  } else {
    if (typeof qq == 'number') throw new Error('waitFor 参数错误')
    return (data: GroupMessage): boolean => {
      return data.sender.id == qq.qq && data.sender.group.id == qq.group
    }
  }
}
