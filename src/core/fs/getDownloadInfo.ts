import { GroupID } from '../../Base'
import { DownloadInfo } from '../../File'
import { MiraiError } from '../../Error'
import axios from 'axios'
/**
 * 获取下载信息
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             文件夹路径，允许重名，尽可能使用id。
 * @param option.group            群号
 * @returns 群文件下载信息
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  group
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
}): Promise<DownloadInfo> => {
  // 请求
  const responseData = await axios.get<{
    code: number
    msg: string
    data: {
      downloadInfo: DownloadInfo
    }
  }>(new URL('/file/info', httpUrl).toString(), {
    params: {
      sessionKey,
      path,
      target: group,
      group,
      withDownloadInfo: true
    }
  })
  const {
    data: {
      msg: message,
      code,
      data: { downloadInfo }
    }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
  return downloadInfo
}
