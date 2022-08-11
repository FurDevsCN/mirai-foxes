import { GroupID, UserID } from './Base'
/** 消息类型 */
export type MessageType =
  | 'Source'
  | 'Quote'
  | 'Plain'
  | 'At'
  | 'AtAll'
  | 'Image'
  | 'FlashImage'
  | 'Voice'
  | 'Xml'
  | 'Json'
  | 'App'
  | 'Poke'
  | 'Dice'
  | 'MarketFace'
  | 'MusicShare'
  | 'Forward'
  | 'Face'
  | 'File'
/** 基本消息类型，请在判断类型后用as转换为派生类 */
export class MessageBase {
  readonly type: MessageType
  constructor({ type }: { type: MessageType }) {
    this.type = type
  }
}
/** 消息源信息，用于回复或消息操作 */
export class Source extends MessageBase {
  /** 消息id */
  id: number
  /** 发送时间 */
  time: number
  constructor({ id, time }: { id: number; time: number }) {
    super({ type: 'Source' })
    ;[this.id, this.time] = [id, time]
  }
}
/** 引用信息 */
export class Quote extends MessageBase {
  /** 原消息的id */
  id: number
  /** 群组id */
  groupId: 0 | GroupID
  /** 原消息发送人id */
  senderId: UserID
  /** 原消息的目标ID */
  targetId: GroupID | UserID
  /** 原消息内容（不带Source） */
  origin: MessageBase[]
  constructor({
    id,
    groupId,
    senderId,
    targetId,
    origin
  }: {
    id: number
    groupId: GroupID
    senderId: UserID
    targetId: UserID
    origin: MessageBase[]
  }) {
    super({ type: 'Quote' })
    ;[this.id, this.groupId, this.senderId, this.targetId, this.origin] = [
      id,
      groupId,
      senderId,
      targetId,
      origin
    ]
  }
}
/** 纯文本 */
export class Plain extends MessageBase {
  /** 消息文字 */
  text: string
  constructor(text: string) {
    super({ type: 'Plain' })
    this.text = text
  }
}
/** at消息 */
export class At extends MessageBase {
  /** 目标用户ID */
  target: UserID
  /** 他人显示的内容（被At用户的群名片） */
  display: string
  constructor(target: UserID, display = '') {
    super({ type: 'At' })
    // display=客户端表示的内容
    ;[this.target, this.display] = [target, display]
  }
}
/** at全体成员消息 */
export class AtAll extends MessageBase {
  constructor() {
    super({ type: 'AtAll' })
  }
}
/** 图片消息 */
export class Image extends MessageBase {
  /** 图片id */
  imageId: string
  /** 下载图片的url */
  url: string
  /** 本地路径，相对于JVM工作路径（不推荐） */
  path: string | undefined
  constructor({
    imageId = '',
    url = '',
    path
  }: {
    imageId?: string
    url?: string
    path?: string
  }) {
    super({ type: 'Image' })
    ;[this.imageId, this.url, this.path] = [imageId, url, path]
  }
}
/** 闪图（阅后即焚） */
export class FlashImage extends MessageBase {
  /** 图片id */
  imageId: string
  /** 下载图片的url */
  url: string
  /** 本地路径，相对于JVM工作路径（不推荐） */
  path: undefined | string
  constructor({
    imageId = '',
    url = '',
    path
  }: {
    imageId?: string
    url?: string
    path?: string
  }) {
    super({ type: 'FlashImage' })
    ;[this.imageId, this.url, this.path] = [imageId, url, path]
  }
}
/** 语音 */
export class Voice extends MessageBase {
  /** 语音id */
  voiceId: string
  /** 下载路径 */
  url: string
  /** 本地路径，相对于JVM工作路径（不推荐） */
  path: string
  constructor({
    voiceId = '',
    url = '',
    path = ''
  }: {
    voiceId?: string
    url?: string
    path?: string
  }) {
    super({ type: 'Voice' })
    // 语音路径相对于 mirai-console
    // 的 plugins/MiraiAPIHTTP/voices
    ;[this.voiceId, this.url, this.path] = [voiceId, url, path]
  }
}
/** 戳一戳 */
export class Poke extends MessageBase {
  /** 戳一戳类型 */
  name: string
  constructor({ name }: { name: string }) {
    super({ type: 'Poke' })
    this.name = name
  }
}
/** 骰子消息 */
export class Dice extends MessageBase {
  /** 扔出来的点数 */
  value: number
  constructor({ value }: { value: number }) {
    super({ type: 'Dice' })
    this.value = value
  }
}
/** 商城表情 */
export class MarketFace extends MessageBase {
  /** 表情唯一id */
  id: number
  /** 表情显示名称 */
  name: string
  constructor({ id, name }: { id: number; name: string }) {
    super({ type: 'MarketFace' })
    ;[this.id, this.name] = [id, name]
  }
}
/** 音乐分享 */
export class MusicShare extends MessageBase {
  /** 类型 */
  kind: string
  /** 标题 */
  title: string
  /** 概要 */
  summary: string
  /** 点击后跳转的链接 */
  jumpUrl: string
  /** 图片链接 */
  pictureUrl: string
  /** 音源（不点进去而是点播放时播放的声音）链接 */
  musicUrl: string
  /** 简介 */
  brief: string
  constructor({
    kind,
    title,
    summary,
    jumpUrl,
    pictureUrl,
    musicUrl,
    brief
  }: {
    kind: string
    title: string
    summary: string
    jumpUrl: string
    pictureUrl: string
    musicUrl: string
    brief: string
  }) {
    super({ type: 'MusicShare' })
    ;[
      this.kind,
      this.title,
      this.summary,
      this.jumpUrl,
      this.pictureUrl,
      this.musicUrl,
      this.brief
    ] = [kind, title, summary, jumpUrl, pictureUrl, musicUrl, brief]
  }
}
/** 文件 */
export class File extends MessageBase {
  /** 文件id(用来获得文件) */
  id: string
  /** 文件名 */
  name: string
  /** 大小 */
  size: number
  constructor({ id, name, size }: { id: string; name: string; size: number }) {
    super({ type: 'File' })
    ;[this.id, this.name, this.size] = [id, name, size]
  }
}
/** Xml卡片 */
export class Xml extends MessageBase {
  /** xml内容 */
  xml: string
  constructor(xml: string) {
    super({ type: 'Xml' })
    this.xml = xml
  }
}
/** Json卡片 */
export class Json extends MessageBase {
  /** json内容 */
  json: string
  constructor(json: string) {
    super({ type: 'Json' })
    this.json = json
  }
}
/** 小程序 */
export class App extends MessageBase {
  /** 小程序内容 */
  content: string
  constructor(content: string) {
    super({ type: 'App' })
    this.content = content
  }
}
/** 转发消息节点 */
export interface ForwardNode {
  /** 发送者id */
  senderId?: UserID
  /** 发送时间 */
  time?: number
  /** 发送者名称 */
  senderName?: string
  /** 原消息链 */
  messageChain?: MessageBase[]
  /** 可以指定messageId而不是节点 */
  messageId?: number
}
/** 转发消息 */
export class ForwardNodeList extends MessageBase {
  /** 节点 */
  nodeList: ForwardNode[]
  /**
   * 添加一个节点
   * @param node 可以是ForwardNode也可以是messageId
   * @returns    this
   */
  add(node: ForwardNode | number): this {
    if (typeof node == 'number') {
      this.nodeList.push({
        messageId: node
      })
    } else {
      this.nodeList.push(node)
    }
    return this
  }
  constructor(nodeList: ForwardNode[]) {
    super({ type: 'Forward' })
    this.nodeList = nodeList
  }
}
/** 表情 */
export class Face extends MessageBase {
  /** 表情ID */
  faceId: number
  /** 表情名称 */
  name: string
  constructor({ faceId, name }: { faceId: number; name: string }) {
    super({
      type: 'Face'
    })
    this.faceId = faceId
    this.name = name
  }
}
/** 消息链类型 */
export type MessageChain = MessageBase[] & {
  0: Source
}
