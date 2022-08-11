import { Group, GroupID, User, UserID } from './Base'
import _getGroupFileList from './core/fs/getGroupFileList'
import _uploadFile from './core/fs/uploadFile'
import _deleteFile from './core/fs/deleteFile'
import _renameGroupFile from './core/fs/renameGroupFile'
import _getGroupFileInfo from './core/fs/getGroupFileInfo'
import _moveGroupFile from './core/fs/moveGroupFile'
import _makeDirectory from './core/fs/makeDirectory'
import _getDownloadInfo from './core/fs/getDownloadInfo'
import { Bot } from './Bot'
async function getGroupFileList({
  httpUrl,
  sessionKey,
  path,
  group
}: {
  httpUrl: string
  sessionKey: string
  path: string
  group: GroupID
}): Promise<FileDetail[]> {
  let offset = 0
  let temp: FileDetail[] = []
  const fileList: FileDetail[] = []
  while (
    (temp = await _getGroupFileList({
      httpUrl,
      sessionKey,
      group,
      path,
      offset,
      size: 10
    })).length > 0
  ) {
    fileList.push(...temp)
    // 获取下一页
    offset += 10
  }
  return fileList
}
function getInstance(
  raw: FileDetail,
  { bot, target }: { bot: Bot; target: GroupID | UserID }
): File | Directory {
  if (raw.isFile == true) {
    return new File(bot, target, raw)
  }
  return new Directory(bot, target, raw)
}
export interface DownloadInfo {
  // sha1
  sha1: string
  // md5
  md5: string
  // 下载次数
  downloadTimes: number
  // 上传者QQ
  uploaderId: UserID
  // 上传时间
  uploadTime: number
  // 最后修改时间
  lastModifyTime: number
  // 下文件的url
  url: string
}
export interface FileDetail {
  // 文件名
  name: string
  // id
  id: string
  // 路径
  path: string
  // 父目录
  parent: null | FileDetail
  // 来自
  contact: Group | User
  // 是否是文件
  isFile: boolean
  // 是否是目录（可和文件二选一，统一用一个）
  isDirectory: boolean
  // sha1
  sha1: string
  // md5
  md5: string
  // 下载次数
  downloadTimes: number
  // 上传者QQ
  uploaderId: UserID
  // 上传时间
  uploadTime: number
  // 最后修改时间
  lastModifyTime: number
}
export class FileManager {
  private bot: Bot
  private target: GroupID | UserID
  /**
   * 列出根目录的文件/文件夹
   * @returns 文件/目录 数组
   */
  async list(): Promise<(File | Directory)[]> {
    return (
      await getGroupFileList({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: '/'
      })
    ).map((fileObj: FileDetail) =>
      getInstance(fileObj, {
        bot: this.bot,
        target: this.target
      })
    )
  }
  /**
   * 由id获取文件或目录
   * @param id id
   * @returns 文件/目录
   */
  async id(id: string): Promise<File | Directory> {
    return getInstance(
      await _getGroupFileInfo({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        id,
        path: null
      }),
      {
        bot: this.bot,
        target: this.target
      }
    )
  }
  /**
   *  获取文件/目录
   * @param name 名字/id。
   * @returns 文件/目录
   */
  async get(name: string): Promise<File | Directory> {
    return getInstance(
      await _getGroupFileInfo({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: '/' + name
      }),
      {
        bot: this.bot,
        target: this.target
      }
    )
  }
  /**
   * 创建文件夹
   * @param name 文件夹名
   */
  async mkdir(name: string): Promise<Directory> {
    return getInstance(
      await _makeDirectory({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: '/',
        directoryName: name
      }),
      {
        bot: this.bot,
        target: this.target
      }
    ) as Directory
  }
  /**
   *  上传文件
   * @param file       文件二进制数据
   * @param filename   文件名
   */
  async upload(file: Buffer, filename: string): Promise<File> {
    const f = await _uploadFile({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      target: this.target,
      type: 'group',
      filename,
      path: '/',
      file
    })
    return getInstance(
      await _getGroupFileInfo({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: f.path
      }),
      {
        bot: this.bot,
        target: this.target
      }
    ) as File
  }
  constructor(bot: Bot, target: GroupID | UserID) {
    void ([this.bot, this.target] = [bot, target])
  }
}
export class File {
  private bot: Bot
  private target: GroupID
  private _detail: FileDetail
  /**
   * 获得下载信息
   */
  async download(): Promise<DownloadInfo> {
    return await _getDownloadInfo({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      path: this._detail.path,
      group: this.target
    })
  }
  /**
   *  移除该文件
   */
  async remove(): Promise<void> {
    // TODO:mah 支持不完全，及时跟进
    await _deleteFile({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      target: this.target,
      type: 'group',
      path: this._detail.path
    })
  }
  /**
   *  移动文件
   * @returns this
   */
  async move(path: string): Promise<this> {
    await _moveGroupFile({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      group: this.target,
      path: this._detail.path,
      moveToPath: path
    })
    // 更新 detail
    await this.update()
    return this
  }
  /**
   *  重命名文件
   * @returns this
   */
  async rename(name: string): Promise<this> {
    await _renameGroupFile({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      group: this.target,
      path: this._detail.path,
      renameTo: name
    })
    // 更新detail
    await this.update()
    return this
  }
  /**
   * 更新文件信息
   */
  async update(): Promise<this> {
    this._detail = await _getGroupFileInfo({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      id: this._detail.id,
      path: null,
      group: this.target
    })
    return this
  }
  /**
   *  文件属性
   */
  get detail(): FileDetail {
    return this._detail
  }
  constructor(bot: Bot, target: GroupID, detail: FileDetail) {
    void ([this.bot, this.target, this._detail] = [bot, target, detail])
  }
}
export class Directory {
  private bot: Bot
  private target: GroupID
  private _detail: FileDetail
  /**
   *  获取当前目录下的 文件/目录 数组
   */
  async list(): Promise<(File | Directory)[]> {
    return (
      await getGroupFileList({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: this._detail.path
      })
    ).map((fileObj: FileDetail) =>
      getInstance(fileObj, {
        bot: this.bot,
        target: this.target
      })
    )
  }
  /**
   *  从当前目录获得文件/目录。
   * @param filename 文件/目录名。
   * @returns 文件/目录
   */
  async get(filename: string): Promise<File | Directory> {
    return getInstance(
      await _getGroupFileInfo({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: this._detail.path + '/' + filename
      }),
      {
        bot: this.bot,
        target: this.target
      }
    )
  }
  /**
   * 创建文件夹
   * @param name 文件夹名
   */
  async mkdir(name: string): Promise<Directory> {
    return getInstance(
      await _makeDirectory({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: this._detail.path,
        directoryName: name
      }),
      {
        bot: this.bot,
        target: this.target
      }
    ) as Directory
  }
  /**
   *  上传文件至当前实例指代的目录下
   * @param file     二选一，文件二进制数据
   * @param filename 新的文件名。
   * @returns 文件。
   */
  async upload(file: Buffer, filename: string): Promise<File> {
    const f = await _uploadFile({
      httpUrl: this.bot.config.httpUrl,
      sessionKey: this.bot.config.sessionKey,
      target: this.target,
      file,
      filename,
      type: 'group',
      path: this._detail.path
    })
    return getInstance(
      await _getGroupFileInfo({
        httpUrl: this.bot.config.httpUrl,
        sessionKey: this.bot.config.sessionKey,
        group: this.target,
        path: f.path
      }),
      {
        bot: this.bot,
        target: this.target
      }
    ) as File
  }
  /**
   *  文件属性
   */
  get detail(): FileDetail {
    return this._detail
  }
  constructor(bot: Bot, target: GroupID, detail: FileDetail) {
    void ([this.bot, this.target, this._detail] = [bot, target, detail])
  }
}
