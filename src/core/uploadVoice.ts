import { MiraiError } from '../Error'
import { Voice } from '../Message'
import axios from 'axios'
import FormData from 'form-data'
/**
 * 上传图片至服务器，返回指定 type 的 imageId，url，及 path
 * @param option 选项
 * @param option.httpUrl          mirai-api-http server 的地址
 * @param option.sessionKey       会话标识
 * @param option.type             'friend' 或 'group' 或 'temp'
 * @param option.voice            语音二进制数据
 * @param option.suffix           语音文件类型
 * @returns Voice对象
 */
export default async ({
  httpUrl,
  sessionKey,
  type,
  voice,
  suffix
}: {
  httpUrl: string
  sessionKey: string
  type: 'friend' | 'group' | 'temp'
  voice: Buffer
  suffix: string
}): Promise<Voice> => {
  // 构造 fromdata
  const form = new FormData()
  form.append('sessionKey', sessionKey)
  form.append('type', type)
  // filename 指定了文件名
  form.append('voice', voice, `audio.${suffix}`)
  // 请求
  const responseData = await axios.post<{
    msg: string
    code: number
    voiceId: string
    url: string
  }>(new URL('/uploadVoice', httpUrl).toString(), form, {
    // formdata.getHeaders 将会指定 content-type，同时给定随
    // 机生成的 boundary，即分隔符，用以分隔多个表单项而不会造成混乱
    headers: form.getHeaders()
  })
  const {
    data: { msg: message, code, voiceId, url }
  } = responseData
  // 抛出 mirai 的异常
  if (code && code != 0) {
    throw new MiraiError(code, message)
  }
  return new Voice({
    voiceId,
    url,
    path: ''
  })
}
