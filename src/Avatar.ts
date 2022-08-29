import _getUserAvatar from './core/avatar/getUserAvatar'
import _getGroupAvatar from './core/avatar/getGroupAvatar'
import { GroupID, UserID } from './Base'
/**
 * 获得用户头像。
 * @param type 要获得的类型。
 * @param qq   用户的qq。
 * @param res  解像度。可以为640或140或100。
 * @returns    图像Buffer数据。
 */
export async function Avatar(
  type: 'user',
  qq: UserID,
  res: 640 | 140 | 100
): Promise<Buffer>
/**
 * 获得群头像。
 * @param type 要获得的类型。
 * @param qq   群号。
 * @returns    图像Buffer数据。
 */
export async function Avatar(type: 'group', qq: GroupID): Promise<Buffer>
export async function Avatar(
  type: 'user' | 'group',
  qq: GroupID | UserID,
  arg?: 640 | 140 | 100
): Promise<Buffer> {
  return await (type == 'user'
    ? _getUserAvatar(qq, arg ?? 640)
    : _getGroupAvatar(qq))
}
