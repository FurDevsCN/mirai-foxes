import { GroupID, UserID } from './Base'
// 消息类型。
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
/**
 * http 接口需要的消息类型
 */
export class MessageBase {
  readonly type: MessageType
  constructor({ type }: { type: MessageType }) {
    this.type = type
  }
}
export class Source extends MessageBase {
  id: number
  time: number
  constructor({ id, time }: { id: number; time: number }) {
    super({ type: 'Source' })
    ;[this.id, this.time] = [id, time]
  }
}
export class Quote extends MessageBase {
  id: number
  groupId: GroupID
  senderId: UserID
  targetId: UserID
  origin: MessageChain
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
    origin: MessageChain
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
export class Plain extends MessageBase {
  text: string
  constructor(text: string) {
    super({ type: 'Plain' })
    this.text = text
  }
}
export class At extends MessageBase {
  target: UserID
  display: string
  constructor(target: UserID, display = '') {
    super({ type: 'At' })
    // display=客户端表示的内容
    ;[this.target, this.display] = [target, display]
  }
}
export class AtAll extends MessageBase {
  constructor() {
    super({ type: 'AtAll' })
  }
}
export class Image extends MessageBase {
  imageId: string
  url: string
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
    // 图片路径相对于 mirai-console
    // 的 plugins/MiraiAPIHTTP/images
    ;[this.imageId, this.url, this.path] = [imageId, url, path]
  }
}
export class FlashImage extends MessageBase {
  imageId: string
  url: string
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
    // 图片路径相对于 mirai-console
    // 的 plugins/MiraiAPIHTTP/images
    ;[this.imageId, this.url, this.path] = [imageId, url, path]
  }
}
export class Voice extends MessageBase {
  voiceId: string
  url: string
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
export class Poke extends MessageBase {
  name: string
  constructor({ name }: { name: string }) {
    super({ type: 'Poke' })
    this.name = name
  }
}
export class Dice extends MessageBase {
  value: number
  constructor({ value }: { value: number }) {
    super({ type: 'Dice' })
    this.value = value
  }
}
export class MarketFace extends MessageBase {
  id: number
  name: string
  constructor({ id, name }: { id: number; name: string }) {
    super({ type: 'MarketFace' })
    ;[this.id, this.name] = [id, name]
  }
}
export class MusicShare extends MessageBase {
  kind: string
  title: string
  summary: string
  jumpUrl: string
  pictureUrl: string
  musicUrl: string
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
export class File extends MessageBase {
  id: string
  name: string
  size: number
  constructor({ id, name, size }: { id: string; name: string; size: number }) {
    super({ type: 'File' })
    ;[this.id, this.name, this.size] = [id, name, size]
  }
}
export class Xml extends MessageBase {
  xml: string
  constructor(xml: string) {
    super({ type: 'Xml' })
    this.xml = xml
  }
}
export class Json extends MessageBase {
  json: string
  constructor(json: string) {
    super({ type: 'Json' })
    this.json = json
  }
}
export class App extends MessageBase {
  content: string
  constructor(content: string) {
    super({ type: 'App' })
    this.content = content
  }
}
export interface ForwardNode {
  senderId?: UserID
  time?: number
  senderName?: string
  messageChain?: MessageType[]
  messageId?: number
}
export class ForwardNodeList extends MessageBase {
  nodeList: ForwardNode[]
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
export class Face extends MessageBase {
  faceId: number
  name: string
  constructor({ faceId, name }: { faceId: number; name: string }) {
    super({
      type: 'Face'
    })
    this.faceId = faceId
    this.name = name
  }
}
export type MessageChain = MessageBase[] & {
  0: Source
}
