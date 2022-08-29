import axios from 'axios'
import { GroupID } from 'src/Base'
/**
 * 获取群头像。
 * @param qq    群号。
 * @returns     图像Buffer数据。
 */
export default async (qq: GroupID): Promise<Buffer> => {
  const responseData = await axios.get<ArrayBuffer>(
    `http://p.qlogo.cn/gh/${qq}/${qq}/100`,
    {
      responseType: 'arraybuffer'
    }
  )
  return Buffer.from(responseData.data)
}
