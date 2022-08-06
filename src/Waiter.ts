import { MemberID, UserID } from './Base'
import { GroupMessage, TempMessage, Matcher, Message, EventArg } from './Event'
interface map {
  friend: 'FriendMessage'
  member: 'GroupMessage'
  temp: 'TempMessage' | 'StrangerMessage'
}
/**
 * Bot.wait方法的匹配器生成器。可以利用此方法来等待指定用户的下一条消息。
 * @param type 匹配器类型。'friend'用于好友消息，'member'用于群聊消息，'temp'用于临时消息和陌生人消息。
 * @param qq 用户qq，群号或上下文。
 * @param extend 要附加的匹配器。
 * @returns 匹配器
 */
export function waitFor(
  type: 'friend',
  qq: UserID,
  extend?: Matcher<'FriendMessage'>
): Matcher<'FriendMessage'>
export function waitFor(
  type: 'member',
  qq: MemberID,
  extend?: Matcher<'GroupMessage'>
): Matcher<'GroupMessage'>
export function waitFor(
  type: 'temp',
  qq: MemberID,
  extend?: Matcher<'TempMessage'>
): Matcher<'TempMessage'>
export function waitFor(
  type: 'temp',
  qq: UserID,
  extend?: Matcher<'StrangerMessage'>
): Matcher<'StrangerMessage'>
export function waitFor<T extends keyof map>(
  type: T,
  qq: MemberID | UserID,
  extend?: Matcher<map[T]>
): Matcher<map[T]> {
  if (type == 'friend' && typeof qq == 'number') {
    return (data: Message): boolean =>
      data.sender.id == qq && (!extend || extend(data as EventArg<map[T]>))
  } else if (type == 'temp') {
    if (typeof qq == 'number')
      return (data: Message): boolean =>
        data.sender.id == qq && (!extend || extend(data as EventArg<map[T]>))
    return (data: Message): boolean =>
      data.sender.id == qq.qq &&
      (data as TempMessage).sender.group.id == qq.group &&
      (!extend || extend(data as EventArg<map[T]>))
  } else if (type == 'member' && typeof qq != 'number') {
    return (data: Message): boolean =>
      data.sender.id == qq.qq &&
      (data as GroupMessage).sender.group.id == qq.group &&
      (!extend || extend(data as EventArg<map[T]>))
  } else throw new Error('waitFor 参数错误')
}
