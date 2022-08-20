import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, UserID } from '../Base'
/**
 *  设置群成员权限
 * @param option 选项
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @param option.target       群成员所在群号
 * @param option.memberId     群成员的 qq 号
 * @param option.assign       是否设置为管理员
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  memberId,
  assign
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  memberId: UserID
  assign: boolean
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{ code: number; msg: string }>(
    new URL('/memberAdmin', httpUrl).toString(),
    {
      sessionKey,
      target,
      memberId,
      assign
    }
  )
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
}
