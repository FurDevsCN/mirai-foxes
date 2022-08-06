import { MiraiError } from '../Error'
import { Group } from '../Base'
import axios from 'axios'
/**
 * 获取群列表
 * @param option 选项
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @returns 群列表
 */
export default async ({
  httpUrl,
  sessionKey
}: {
  httpUrl: string
  sessionKey: string
}): Promise<Group[]> => {
  // 请求
  const responseData = await axios.get<{
    msg: string
    code: number
    data: Group[]
  }>(new URL('/groupList', httpUrl).toString(), {
    params: { sessionKey }
  })
  const {
    data: { msg: message, code, data }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
  return data
}
