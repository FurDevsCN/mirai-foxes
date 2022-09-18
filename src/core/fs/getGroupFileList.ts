import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'
import { FileDetail } from '../../File'
/**
 * 获取群文件列表
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             文件夹路径，允许重名，尽可能使用id。
 * @param option.group            群号
 * @param option.offset	         分页偏移
 * @param option.size	         分页大小
 * @returns 群文件列表
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  group,
  offset,
  size
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
  offset: number
  size: number
}): Promise<FileDetail[]> => {
  // 请求
  const responseData = await axios.get<{
    code: number
    msg: string
    data: FileDetail[]
  }>(new URL('/file/list', httpUrl).toString(), {
    params: {
      sessionKey,
      path,
      target: group,
      group,
      withDownloadInfo: false,
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
