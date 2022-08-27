import { MiraiError } from '../Error'
import { GroupID, Profile, UserID } from '../Base'
import axios from 'axios'
/**
 * 获取成员信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     qq群号
 * @param option.memberId 成员qq
 * @returns 成员资料
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
}): Promise<Profile> => {
  // 请求
  const responseData = await axios.get<Profile & { code?: number; msg?: string }>(
    new URL('/memberProfile', httpUrl).toString(),
    {
      params: { sessionKey, target, memberId }
    }
  )
  const { data } = responseData
  // 抛出 mirai 的异常
  if (data.code && data.code != 0) {
    throw new MiraiError(data.code, data.msg ?? '')
  }
  return data
}
