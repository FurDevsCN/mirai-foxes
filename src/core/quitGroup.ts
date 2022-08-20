import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID } from '../Base'
/**
 * 移除群聊
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     欲移除群号
 */
export default async ({
  httpUrl,
  sessionKey,
  target
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
}) => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/quit', httpUrl).toString(), {
    sessionKey,
    target
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
}
