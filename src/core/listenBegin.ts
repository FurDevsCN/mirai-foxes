import WebSocket from 'ws'
import { EventBase, WsClose, WsError, WsUnexpectedResponse } from '../Event'
/**
 * 开始侦听事件
 * @param option 设定
 * @param option.wsUrl ws链接
 * @param option.sessionKey sessionKey
 * @param option.message 回调函数
 * @param option.error 回调函数
 * @param option.close 回调函数
 * @param option.unexpectedResponce 回调函数
 * @returns 建立连接的 WebSocket 实例
 */
export default async ({
  wsUrl,
  sessionKey,
  verifyKey,
  message,
  error,
  close,
  unexpectedResponse
}: {
  wsUrl: string
  sessionKey: string
  verifyKey: string
  message: (data: EventBase) => void
  error: (err: WsError) => void
  close: ({ code, reason }: WsClose) => void
  unexpectedResponse: (obj: WsUnexpectedResponse) => void
}): Promise<WebSocket> => {
  const ws = new WebSocket(
    new URL(
      `/all?sessionKey=${sessionKey}&verifyKey=${verifyKey}`,
      wsUrl
    ).toString()
  )
  // 监听 ws 事件，分发消息
  ws.on('open', () => {
    // 60s heartbeat
    const interval = setInterval(() => {
      ws.ping((err: Error): void => {
        if (err) console.error('ws ping error', err)
      })
    }, 60000)
    ws.on('message', (data: Buffer) =>
      message(JSON.parse(data.toString())?.data)
    )
    ws.on('error', (err: Error) => error({ type: 'error', error: err }))
    ws.on('close', (code, reason) => {
      // 关闭心跳
      clearInterval(interval)
      close({ type: 'close', code, reason })
    })
    ws.on('unexpected-response', (req, res) =>
      unexpectedResponse({
        type: 'unexpected-response',
        request: req,
        response: res
      })
    )
  })
  return ws
}
