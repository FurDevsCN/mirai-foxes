import { MiraiError } from '../Error'
import { User } from '../Base'
import axios from 'axios'
/**
 * 获取好友列表
 * @param option 选项
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @returns 好友列表
 */
export default async ({ httpUrl, sessionKey }:{
  httpUrl: string
  sessionKey: string
}) : Promise<User[]> => {
  // 请求
  const responseData = await axios.get<{ msg: string; code: number; data:User[] }>(new URL('/friendList',httpUrl).toString(), {
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
