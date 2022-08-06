import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, UserID } from '../Base'
/**
 * 移除群成员
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     欲移除成员所在群号
 * @param option.memberId   欲移除成员 qq 号
 * @param option.msg 移除信息
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  memberId,
  msg
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  memberId: UserID
  msg: string
}) => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/kick', httpUrl).toString(), {
    sessionKey,
    target,
    memberId,
    msg
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}