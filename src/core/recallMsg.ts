import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, UserID } from 'src/Base'
/**
 * 撤回由 messageId 确定的消息
 * @param option            选项。
 * @param option.httpUrl    mirai-api-http server 的主机地址
 * @param option.sessionKey 会话标识
 * @param option.target     目标群号/好友QQ 
 * @param option.messageId  欲撤回消息的 messageId
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  messageId
}: {
  httpUrl: string
  sessionKey: string
  target: UserID | GroupID,
  messageId: number
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
  }>(new URL('/recall', httpUrl).toString(), { sessionKey, target, messageId })
  const {
    data: { code, msg: message }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
