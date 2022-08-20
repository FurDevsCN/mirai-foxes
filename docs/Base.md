# Base

Base 是对基础类型的描述。

- UserID：用户 QQ。实际上是 number。
- GroupID：群组 QQ。实际上是 number。
- MemberID：群员，又称上下文。结构如下：

  ```typescript
  interface MemberID {
    group: GroupID
    qq: UserID
  }
  ```

  - group：群组 QQ。
  - qq：用户 QQ。

- Announcement：公告。结构如下：

  ```typescript
  interface Announcement {
    group: Group
    content: string
    senderId: UserID
    fid: string
    allConfirmed: boolean
    confirmedMembersCount: number
    publicationTime: number
  }
  ```

  - group：公告所在的群聊。
  - content：公告内容。
  - senderId：创建公告的用户。
  - fid：公告唯一 id。
  - allConfirmed：是否全员确认。
  - confirmedMembersCount：已确认的人数。
  - publicationTime：公告发布的时间。

- GroupInfo：群聊设置。结构如下：

  ```typescript
  export interface GroupInfo {
    name: string
    confessTalk: boolean
    allowMemberInvite: boolean
    autoApprove: boolean
    anonymousChat: boolean
  }
  ```
  - name：群聊名称。
  - confessTalk：允许群内坦白说。
  - allowMemberInvite：允许邀请进群。
  - autoApprove：自动审核。
  - anonymousChat：允许匿名聊天。
