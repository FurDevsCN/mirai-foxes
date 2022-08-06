import { MiraiError } from '../Error'
import axios from 'axios'
import { UserID } from '../Base'
/**
 * 关闭一个会话
 * @param option 设定。
 * @param option.httpUrl http接口
 * @param option.sessionKey sessionKey
 * @param option.qq qq号
 */
export default async ({
  httpUrl,
  sessionKey,
  qq
}: {
  httpUrl: string
  sessionKey: string
  qq: UserID
}) : Promise<void> => {
  // 请求
  const responseData = await axios.post<{ msg: string; code: number }>(
    new URL('/release', httpUrl).toString(),
    { sessionKey, qq }
  )
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) throw new MiraiError(code, message)
}
