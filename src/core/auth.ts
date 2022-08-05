import { MiraiError } from '../Error'
import axios from 'axios'
/**
 * 验证verifyKey并返回sessionKey。
 * @param option 设定
 * @param option.httpUrl http链接
 * @param option.verifyKey 认证key
 * @returns 一个sessionKey。
 */
export default async ({
  httpUrl,
  verifyKey
}: {
  httpUrl: string
  verifyKey: string
}): Promise<string> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
    session: string
  }>(new URL('/verify', httpUrl).toString(), { verifyKey })
  const {
    data: { msg: message, code, session: sessionKey }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) throw new MiraiError(code, message)
  return sessionKey
}
