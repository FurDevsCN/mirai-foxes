import { MiraiError } from '../Error'
import { Profile } from '../Base'
import axios from 'axios'
/**
 *  获取Bot信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @returns Bot资料
 */
export default async ({
  httpUrl,
  sessionKey
}: {
  httpUrl: string
  sessionKey: string
}): Promise<Profile> => {
  // 请求
  const responseData = await axios.get<Profile & { code?: number; msg?: string; }>(
    new URL('/botProfile', httpUrl).toString(),
    {
      params: { sessionKey }
    }
  )
  const { data } = responseData
  // 抛出 mirai 的异常
  if (data.code && data.code != 0) {
    throw new MiraiError(data.code, data.msg ?? '')
  }
  return data
}
