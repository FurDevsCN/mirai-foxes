# DownloadInfo

DownloadInfo 是对下载信息的描述。

### Typescript 接口速览

```typescript
interface DownloadInfo {
  sha1: string
  md5: string
  downloadTimes: number
  uploaderId: UserID
  uploadTime: number
  lastModifyTime: number
  url: string
}
```

### 属性介绍

- sha1：文件的 SHA1 值。
- md5：文件的 MD5 值。
- downloadTimes：文件的下载次数。
- uploaderId：文件的上传者QQ。
- uploadTime：文件的上传时间。
- lastModifyTime：文件的最后修改时间。
- url：文件的下载链接。
