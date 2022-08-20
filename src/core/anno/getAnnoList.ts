import { MiraiError } from '../../Error'
import axios from 'axios'
import { Announcement, GroupID } from '../../Base'
/**
 *  获取群公告
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.id         群号
 * @param option.offset     分页
 * @param option.size       分页, 默认 10
 * @returns 公告列表
 */
export default async ({
  httpUrl,
  sessionKey,
  id,
  offset,
  size = 10
}: {
  httpUrl: string
  sessionKey: string
  id: GroupID
  offset: number
  size?: number
}): Promise<Announcement[]> => {
  // 请求
  const responseData = await axios.get<{
    msg: string
    code: number
    data: Announcement[]
  }>(new URL('/anno/list', httpUrl).toString(), {
    params: {
      sessionKey,
      id,
      offset,
      size
    }
  })
  const {
    data: { msg: message, code, data }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
  return data
}
