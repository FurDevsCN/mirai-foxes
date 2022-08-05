import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'

/**
 * 发布群公告
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.target     群号
 * @param option.content    公告内容
 * @param option.pinned     是否置顶
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  content,
  pinned
}: {
  httpUrl: string
  sessionKey: string
  target: GroupID
  content: string
  pinned: boolean
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/anno/publish', httpUrl).toString(), {
    sessionKey,
    target,
    content,
    pinned
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
