import { MiraiError } from '../Error'
import axios from 'axios'
import { UserID } from '../Base'
/**
 * 校验 sessionKey，将一个 session 绑定到指定的 qq 上
 * @param option 设定
 * @param option.httpUrl http地址
 * @param option.sessionKey sessionKey
 * @param option.qq 要绑定的qq
 */
export default async ({
  httpUrl,
  sessionKey,
  qq
}: {
  httpUrl: string
  sessionKey: string
  qq: UserID
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/bind', httpUrl).toString(), { sessionKey, qq })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) throw new MiraiError(code, message)
  return
}
