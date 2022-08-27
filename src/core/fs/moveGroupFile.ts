import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'
/**
 * 移动群文件
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             文件路径。
 * @param option.moveToPath       移动到指定path
 * @param option.moveTo           移动到指定id
 * @param option.group            群号
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  group,
  moveToPath
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
  moveToPath: string
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{ msg: string; code: number }>(
    new URL('/file/move', httpUrl).toString(),
    {
      sessionKey,
      path,
      target: group,
      group,
      moveToPath
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
