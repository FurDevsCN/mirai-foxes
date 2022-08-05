import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID } from '../Base'
import { MessageBase } from '../Message'

/**
 * 向 qq 群发送消息
 * @param option 选项。
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @param option.target       目标群号
 * @param option.quote        消息引用，使用发送时返回的 messageId
 * @param option.messageChain 消息链，MessageType 数组
 * @returns messageId
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  quote,
  messageChain
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  quote?: number
  messageChain: MessageBase[]
}): Promise<number> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
    messageId: number
  }>(new URL('/sendGroupMessage', httpUrl).toString(), {
    sessionKey,
    target,
    quote,
    messageChain
  })
  const {
    data: { msg: message, code, messageId }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
  return messageId
}
