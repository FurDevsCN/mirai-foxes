import axios from 'axios'
import { UserID } from 'src/Base'
/**
 * 获取用户头像。
 * @param qq  用户的QQ。
 * @param res 解像度。可选640或140。
 * @returns   图像Buffer数据。
 */
export default async (qq: UserID, res: 640 | 140): Promise<Buffer> => {
  const responseData = await axios.get<ArrayBuffer>(
    'https://q2.qlogo.cn/headimg_dl',
    {
      params: {
        dst_uin: qq,
        spec: res
      },
      responseType: 'arraybuffer'
    }
  )
  return Buffer.from(responseData.data)
}
