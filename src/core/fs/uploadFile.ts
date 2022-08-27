import { MiraiError } from '../../Error'
import axios from 'axios'
import { GroupID, UserID } from '../../Base'
import FormData from 'form-data'
/**
 * 上传文件到服务器
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.type             'friend' 或 'group'。
 * @param option.target            群号
 * @param option.path	         上传文件路径
 * @param option.file	         文件二进制数据
 * @returns 文件id
 *
 * FIXME:mirai-api-http咕了，我们没有咕!目前仅支持group。
 */
export default async ({
  httpUrl,
  sessionKey,
  target,
  type,
  path,
  file,
  filename
}: {
  httpUrl: string
  sessionKey: string
  type: 'friend' | 'group'
  target: GroupID | UserID
  path: string
  file: Buffer
  filename: string
}): Promise<{ path: string; name: string }> => {
  // 构造 fromdata
  const form = new FormData()
  form.append('sessionKey', sessionKey)
  form.append('type', type)
  form.append('target', target)
  form.append('path', path)
  form.append('file', file, { filename })
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
    data: {
      name: string
      path: string
    }
  }>(new URL('/file/upload', httpUrl).toString(), form, {
    // formdata.getHeaders 将会指定 content-type，同时给定随
    // 机生成的 boundary，即分隔符，用以分隔多个表单项而不会造成混乱
    headers: form.getHeaders()
  })
  const {
    data: { msg: message, code, data }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
  return { name: data.name, path: data.path }
}
