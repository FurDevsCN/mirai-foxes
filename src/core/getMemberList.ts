import { MiraiError } from '../Error'
import { GroupID, Member } from '../Base'
import axios from 'axios'

/**
 * 获取群成员列表
 * @param option 选项
 * @param option.httpUrl      mirai-api-http server 的地址
 * @param option.sessionKey   会话标识
 * @param option.target       目标群组
 * @returns 成员列表
 */
export default async ({
  httpUrl,
  sessionKey,
  target
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
}): Promise<Member[]> => {
  // 请求
  const responseData = await axios.get<{
    msg: string
    code: number
    data: Member[]
  }>(new URL('/memberList', httpUrl).toString(), {
    params: { sessionKey,target }
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
