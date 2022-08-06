import { MiraiError } from '../Error'
import axios from 'axios'
import { MessageBase } from '../Message'
import { GroupID, UserID } from '../Base'
/**
 * 向临时对象发送消息
 * @param option 设定
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @param option.qq           目标 qq 号
 * @param option.group        目标群号
 * @param option.quote        消息引用，使用发送时返回的 messageId
 * @param option.messageChain 消息链，MessageType 数组
 * @returns messageId
 */
export default async ({
  httpUrl,
  sessionKey,
  qq,
  group,
  quote,
  messageChain
}: {
  httpUrl: string
  sessionKey: string
  qq?: UserID
  group?: GroupID
  quote?: number
  messageChain: MessageBase[]
}): Promise<number> => {
  if (!qq && !group) {
    throw new Error('sendTempMessage 缺少必要的 qq|group 参数')
  }
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
    messageId: number
  }>(new URL('/sendTempMessage', httpUrl).toString(), {
    sessionKey,
    qq,
    group,
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
