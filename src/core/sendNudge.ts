import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, UserID } from '../Base'
/**
 * 发送戳一戳消息
 * @param option 设定。
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     戳一戳的目标
 * @param option.subject    戳一戳的上下文，群或好友
 * @param option.kind       上下文类型, 可选值 Friend, Group
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  subject,
  kind
}: {
  httpUrl: string
  sessionKey: string
  target: UserID
  subject: UserID | GroupID
  kind: 'Friend' | 'Group'
}) : Promise<void> => {
  // 请求
  const responseData = await axios.post<{ msg: string; code: number }>(
    new URL('/sendNudge', httpUrl).toString(),
    {
      sessionKey,
      target,
      subject,
      kind
    }
  )
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
