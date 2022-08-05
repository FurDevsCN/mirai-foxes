import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, UserID } from '../Base'

/**
 * 解除禁言群成员
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     欲解除禁言成员所在群号
 * @param option.memberId   欲解除禁言成员 qq 号
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  memberId
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  memberId: UserID
}) => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/unmute', httpUrl).toString(), { sessionKey, target, memberId })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
