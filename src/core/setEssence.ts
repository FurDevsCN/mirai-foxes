import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID } from '../Base'
/**
 * 将由 messageId 确定的消息设置为本群精华消息
 * @param option 选项。
 * @param option.httpUrl    mirai-api-http server 的主机地址
 * @param option.sessionKey 会话标识
 * @param option.target     群号
 * @param option.messageId  欲设置群精华消息的 messageId
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  messageId
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  messageId: number
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
  }>(new URL('/setEssence', httpUrl).toString(), {
    sessionKey,
    target,
    messageId
  })
  const {
    data: { code, msg: message }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
}
