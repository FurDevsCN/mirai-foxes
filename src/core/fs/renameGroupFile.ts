import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'
/**
 *  重命名群文件
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             文件路径。
 * @param option.renameTo         重命名到指定文件名
 * @param option.group            群号
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  group,
  renameTo
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
  renameTo: string
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{ msg: string; code: number }>(
    new URL('/file/rename', httpUrl).toString(),
    {
      sessionKey,
      path,
      target: group,
      group,
      renameTo
    }
  )
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
}
