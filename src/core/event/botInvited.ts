import { MiraiError } from '../../Error'
import axios from 'axios'
import { BotInvitedJoinGroupRequestEvent } from '../../Event'
const Operate = {
  accept: 0,
  refuse: 1
}
/**
 * 处理Bot被邀请入群事件
 * @param option 选项
 * @param option.httpUrl    mirai-api-http server 的地址
 * @param option.sessionKey 会话标识
 * @param option.event      事件
 * @param option.option     选项
 * @param option.option.action       动作
 * @param option.option.message 消息
 */
export default async ({
  httpUrl,
  sessionKey,
  event,
  option
}: {
  httpUrl: string
  sessionKey: string
  event: BotInvitedJoinGroupRequestEvent
  option: {
    action: 'accept' | 'refuse'
    message?: string
  }
}): Promise<void> => {
  // 请求
  const responseData = await axios.post<{
    code: number
    msg: string
  }>(new URL('/resp/botInvitedJoinGroupRequestEvent', httpUrl).toString(), {
    sessionKey,
    eventId: event.eventId,
    fromId: event.fromId,
    groupId: event.groupId,
    operate: Operate[option.action],
    message: option.message ? option.message : ''
  })
  const {
    data: { msg: message, code }
  } = responseData
  // 抛出 mirai 的异常
  if (code != undefined && code != 0) {
    throw new MiraiError(code, message)
  }
}
