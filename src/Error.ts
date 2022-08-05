export class MiraiError extends Error {
  code: number
  msg: string
  constructor(code: number, msg: string) {
    super(`[Mirai Error:${code}:${JSON.stringify(msg)}]`)
    ;[this.code, this.msg] = [code, msg]
  }
}
