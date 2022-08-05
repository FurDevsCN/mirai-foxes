import WebSocket from 'ws'
/**
 * 停止侦听事件
 * @param ws 建立连接的 WebSocket 实例
 */
export default async (ws: WebSocket) : Promise<void> => {
  // 由于在 ws open 之前关闭连接会抛异常，故应先判断此时是否正在连接中
  if (ws.readyState == WebSocket.CONNECTING) {
    // 正在连接中，注册一个 open，等待回调时关闭
    // 由于是一个异步过程，使用 Promise 包装以配合开发者可能存在的同步调用
    await new Promise<void>(resolve => {
      ws.onopen = () => {
        // 关闭 websocket 的连接
        ws.close(1000)
        resolve()
      }
    })
  } else if (ws.readyState == WebSocket.OPEN) {
    // 关闭 websocket 的连接
    ws.close(1000)
  }
  // CLOSING or CLOSED
}
