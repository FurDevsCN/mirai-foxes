import { GroupID } from '../../Base'
import { FileDetail } from '../../File'
import { MiraiError } from '../../Error'
import axios from 'axios'
/**
 *  获取群文件信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.id               文件夹id, 空串为根目录
 * @param option.path             文件路径。
 * @param option.group            群号
 * @returns 群文件信息
 */
export default async ({
  httpUrl,
  sessionKey,
  id,
  path,
  group
}: {
  httpUrl: string
  sessionKey: string
  id?: string
  path: null | string
  group: GroupID
}): Promise<FileDetail> => {
  // 请求
  const responseData = await axios.get<{
    code: number
    msg: string
    data: FileDetail
  }>(new URL('/file/info', httpUrl).toString(), {
    params: {
      sessionKey,
      id,
      path,
      target: group,
      group,
      withDownloadInfo: false
    }
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
