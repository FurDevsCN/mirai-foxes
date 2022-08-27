# FileDetail

FileDetail 是对文件/文件夹信息的描述。

### Typescript 接口速览

```typescript
interface FileDetail {
  name: string
  id: string
  path: string
  parent: null | FileDetail
  contact: Group | User
  isFile: boolean
  isDirectory: boolean
  sha1: string
  md5: string
  downloadTimes: number
  uploaderId: UserID
  uploadTime: number
  lastModifyTime: number
}
```

### 属性介绍

- name：文件/文件夹的名称。
- id：文件/文件夹的唯一标识（用`FileManager.id`可以根据此获得文件/文件夹）。
- path：文件/文件夹的路径。
- parent：文件/文件夹的父文件夹，如果是根文件夹则为null。
- contact：文件/文件夹所在的群/用户。
- isFile：是否是文件。
- isDirectory：是否是文件夹（不推荐使用）。
- sha1：文件的 SHA1 值。
- md5：文件的 MD5 值。
- downloadTimes：文件的下载次数。
- uploaderId：文件的上传者QQ。
- uploadTime：文件的上传时间。
- lastModifyTime：文件的最后修改时间。