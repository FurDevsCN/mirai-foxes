import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'
/**
 * 删除群公告
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.id     群号
 * @param option.fid    公告 id
 */
export default async ({
  httpUrl,
  sessionKey,
  id,
  fid
}: {
  httpUrl: string
  sessionKey: string
  id: GroupID
  fid: string
}) : Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
  }>(new URL('/anno/delete', httpUrl).toString(), {
    sessionKey,
    id,
    fid
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
