import { MiraiError } from '../Error'
import axios from 'axios'

/**
 * 撤回由 messageId 确定的消息
 * @param option 选项。
 * @param option.httpUrl    mirai-api-http server 的主机地址
 * @param option.sessionKey 会话标识
 * @param option.target     欲撤回消息的 messageId
 */
export default async ({
  httpUrl,
  sessionKey,
  target
}: {
  httpUrl: string
  sessionKey: string
  target: number
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
  }>(new URL('/recall', httpUrl).toString(), { sessionKey, target })
  const {
    data: { code, msg: message }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
