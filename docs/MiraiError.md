# MiraiError

MiraiError 是对mirai-api-http错误的描述。

### Typescript 接口速览

```typescript
class MiraiError extends Error {
  code: number
  msg: string
}

```

### 属性介绍

- code：错误码。
- msg：错误信息。

### 注意

在必要时，也可以将`MiraiError`当作`Error`使用。
