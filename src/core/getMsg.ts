import { MiraiError } from '../Error'
import axios from 'axios'
import { Message } from '../Event'
import { GroupID, UserID } from 'src/Base'
/**
 * 由messageId取信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     目标群号/好友
 * @param option.messageId  消息id
 * @returns 信息
 */
export default async ({
  httpUrl,
  sessionKey,
  messageId,
  target
}: {
  httpUrl: string
  sessionKey: string
  messageId: number
  target: GroupID | UserID
}): Promise<Message> => {
  // 请求
  const responseData = await axios.get<{
    code: number
    msg: string
    data: Message
  }>(new URL('/messageFromId', httpUrl).toString(), {
    params: { sessionKey, messageId, target }
  })
  const {
    data: { code, msg: message, data }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
  return data
}
