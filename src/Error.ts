/** Mirai 错误 */
export class MiraiError extends Error {
  /** 错误码 */
  code: number
  /** 错误信息 */
  msg: string
  /**
   * 构造Mirai 错误
   * @param code 错误码
   * @param msg 错误消息
   */
  constructor(code: number, msg: string) {
    super(`[Mirai Error:${code}:${JSON.stringify(msg)}]`)
    ;[this.code, this.msg] = [code, msg]
  }
}
