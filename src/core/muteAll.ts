import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID } from '../Base'
/**
 * 全员禁言
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     欲全员禁言的群号
 */
export default async ({
  httpUrl,
  sessionKey,
  target
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/muteAll', httpUrl).toString(), { sessionKey, target })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
