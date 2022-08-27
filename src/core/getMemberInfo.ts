import { MiraiError } from '../Error'
import { GroupID, Member, UserID } from '../Base'
import axios from 'axios'
/**
 * 获取群成员信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     群成员所在群号
 * @param option.memberId   群成员的 qq 号
 * @returns 群成员信息
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  memberId
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  memberId: UserID
}): Promise<Member> => {
  // 请求
  const responseData = await axios.get<Member & { code?: number; msg?: string }>(
    new URL('/memberInfo', httpUrl).toString(),
    {
      params: { sessionKey, target, memberId }
    }
  )
  const { data } = responseData
  // 抛出 mirai 的异常
  if (data.code && data.code != 0) {
    throw new MiraiError(data.code, data.msg ?? '')
  }
  return data as Member
}
