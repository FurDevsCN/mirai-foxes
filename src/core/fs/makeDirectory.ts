import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID } from '../../Base'
import { FileDetail } from 'src/File'
/**
 *  群创建文件夹
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.path             父文件夹路径。
 * @param option.directoryName    新文件夹名称
 * @param option.group            群号
 */
export default async ({
  httpUrl,
  sessionKey,
  path,
  group,
  directoryName
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
  directoryName: string
}): Promise<FileDetail> => {
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
    data: FileDetail
  }>(new URL('/file/mkdir', httpUrl).toString(), {
    sessionKey,
    path,
    target: group,
    group,
    directoryName
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
