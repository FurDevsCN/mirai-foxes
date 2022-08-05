import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID, UserID } from '../../Base'

/**
 *  删除文件
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             文件夹路径。
 * @param option.type             'friend' 或 'group'
 * @param option.target            qq号
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  target,
  type
}: {
  httpUrl: string
  sessionKey: string
  path: string
  target: UserID | GroupID
  type: 'friend' | 'group'
}): Promise<void> => {
  // TODO: 等到mirai-api-http修正接口后修改调用方式
  // 请求
  const responseData = await axios.post<{ msg: string; code: number }>(
    new URL('/file/delete', httpUrl).toString(),
    {
      sessionKey,
      path,
      target,
      group: type == 'group' ? target : undefined,
      qq: type == 'friend' ? target : undefined
    }
  )
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
