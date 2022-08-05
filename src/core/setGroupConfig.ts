import { MiraiError } from '../Error'
import axios from 'axios'
import { GroupID, GroupInfo } from '../Base'

/**
 * 设定群信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     群号
 * @param option.info       群信息
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  info
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  info: GroupInfo
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
  }>(new URL('/groupConfig', httpUrl).toString(), {
    sessionKey,
    target,
    config: info
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
