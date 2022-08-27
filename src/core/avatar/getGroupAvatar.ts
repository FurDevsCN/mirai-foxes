import axios from 'axios'
import { GroupID } from 'src/Base'
/**
 * 获取群头像或群封面。
 * @param qq    群号。
 * @param cover 是否获取封面。
 * @returns     图像Buffer数据。
 */
export default async (qq: GroupID, cover: boolean): Promise<Buffer> => {
  const responseData = await axios.get<ArrayBuffer>(
    `https://p.qlogo.cn/gh/${qq}/${qq}_${cover ? 1 : 2}`,
    {
      responseType: 'arraybuffer'
    }
  )
  return Buffer.from(responseData.data)
}
