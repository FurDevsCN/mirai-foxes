# 感谢使用 mirai-foxes！

此页面用于指导您进行使用本项目的事先配置，并连结到各个组件的文档页面。

如果您不是初学者，点击[这里](#更多)跳到详细文档。

## 安装并配置 mirai-api-http

要使用此框架，您需要先配置 mirai-api-http。以下是操作方法。

1. 安装 Mirai Console Loader(MCL)本体

   您需要确保您的设备已安装 Java 11+，然后从[此处](https://github.com/iTXTech/mirai-console-loader/releases)下载 Mirai Console Loader 的本体。
   没有意外的话，您将可以看到一个 zip 档案。请将其解压到您期望的位置，并在那里打开一个命令行窗口。按理来讲，新打开的命令行窗口的**工作目录**应当为您刚刚解压 zip 档案的目标位置。根据您的操作系统决定接下来要运行的命令。

   Windows：

   ```powershell
   .\mcl.cmd
   ```

   Linux:

   ```bash
   sh ./mcl
   ```

   在完成上述操作后，您将可以看到 Mirai Console Loader 控制台。先不用急着登录，请先输入`exit`退出控制台。

2. 安装 mirai-api-http

   mirai-api-http 是 mirai-console 跨越语言限制，为其它语言提供接口的重要插件。您可以在[这里](https://github.com/project-mirai/mirai-api-http/releases)下载最新的版本。下载完成后，请将其放入 Mirai Console Loader 的`plugins/`目录，并按照第 1 步的方法，再次启动 Mirai Console Loader 控制台。将会自动安装您下载的插件。完成后，请使用`exit`命令退出控制台。

3. 配置 mirai-api-http

   您需要进入`config/net.mamoe.mirai-api-http`目录，并打开`settings.yml`。您将看到一些用 YAML 表示的设置，以下是标准设置的参考。您也可以进行额外配置来满足不同需求。

   ```yaml
   adapters: #这里是“适配器”的配置，用于指定mirai-api-http要使用的协议。由于websocket协议目前还不支持上传文件，请同时使用2个。
     - http # 使用http API(mirai-foxes使用这个发送请求)
     - ws # 使用ws API(mirai-foxes使用这个接收事件)
   debug: false # 是否启用排错模式。启用后将会在控制台输出更为详细的信息。
   enableVerify: true # 是否启用连接验证。为避免恶意的用户或应用程序连接您的机器人，建议保持打开状态。
   verifyKey: FurDevsCN # 验证密钥。请牢记您的验证密钥，因为mirai-foxes连接mirai-api-http时必须指定此项。
   singleMode: false # 是否启用单会话模式。启用后只能同时使用一个实例，且mirai-foxes不兼容，请勿开启。
   cacheSize: 4096 # 消息缓存的大小，越大的数值可以让messageId失效更慢，但可能会占用更多的系统资源。
   adapterSettings: # 详细的适配器设置。
     http: # HTTP API设定。
       host: localhost # HTTP API的网络位置。如果希望mirai-foxes和mirai-api-http在同一台设备上运行，请设定为localhost，否则您可以使用IP地址。
       port: 8080 # HTTP API的端口。
       cors: [*] # 跨域策略。若不设定此项，则在浏览器端对HTTP API的请求可能会因同源策略而无法正常使用。
     ws: # Websocket API 设定。
       host: localhost # Websocket API的网络位置。说明同HTTP API host。
       port: 8080 # Websocket API的端口。因为HTTP可以自动升级为Websocket，且HTTP API和Websocket API路径无冲突，故允许重复端口。
       reservedSyncId: -1 # 用于服务器主动发送服务时，消息同步的ID。mirai-foxes不使用ws向服务器发送消息，故可以设定为任意值。
   ```

4. 登录 Mirai Console Loader

   请按照步骤 1 的方法打开 Mirai Console Loader 控制台，并输入以下命令：

   ```bash
   /login [Bot的QQ号] [密码]
   ```

   然后等待 Mirai Console Loader 登录。

   小贴士：若您的 Bot 启用了账户锁，请先用电脑浏览器(请不要使用任何国产浏览器，比如**360 安全浏览器**或**2345 浏览器**，会出现各种奇怪的问题，并更容易损坏您的电脑，也请不要使用太旧或冷门的浏览器)访问验证链接，并用手机登录 Bot QQ，然后使用 QQ 的“扫一扫”功能扫码。除非您有 2 台手机，否则不应将链接发到手机并截屏扫码（扫截屏失败的概率近 100%，此点在 gocq 和 mirai 上都有体现）。

5. 开始使用 mirai-foxes

   首先，请新建一个文件夹用于存放您的 Bot。在此文件夹内，请使用以下命令初始化 npm 项目，这样您可以在项目内安装 mirai-foxes。

   ```bash
   npm init
   ```

   注意：您可以在完成后发布到 Github 或其它开源代码托管站点（**谨防隐私泄露**）。我们提倡您分享您的成果，来维护开源社区的健康与活跃，这样您也可以使用开源社区的代码。

   **若对本框架进行任何修改，则无论是提供服务还是分发，您都必须开源源代码。**

   在项目配置完成后，请使用以下命令安装 mirai-foxes：

   ```bash
   npm install mirai-foxes # 简写 npm i mirai-foxes
   ```

   现在便可以开始使用 mirai-foxes 了。如果您是初学者，您还可以创建一个 hello-world.js 并写入以下内容：

   ```js
   const foxes = require('mirai-foxes')
   // 如果您在package.json内配置了"type":"module"，则可以使用以下方式(ES6)导入mirai-foxes：
   // import * as foxes from 'mirai-foxes'
   // 此处匿名async函数是为了更方便地使用await而无需用Promise then导致代码可读性下降
   ;(async () => {
     // 新建Bot实例
     let bot = new foxes.Bot()
     // 打开连接
     await bot.open({
       httpUrl: '', // http API 地址，前面要加http协议头
       wsUrl: '', // Websocket API 地址，前面要加ws协议头
       verifyKey: 'FurDevsCN', // 您的连接验证密码(verifyKey)
       qq: 0 // 刚刚在MCL登录的Bot的QQ号
     })
     // 监听事件
     bot.on(
       'FriendMessage', // 好友消息
       Middleware.Middleware({
         filter: ['user', [Middleware.userFilter([0])]], // 只监听群号为0的群
         parser: [Middleware.parseCmd],
         matcher: [Middleware.cmdMatch('hello')]
       })(async data => {
         // 发送消息
         await bot.send('friend', {
           qq: data.sender.id,
           message: [new Message.Plain('mirai-foxes、行きます！')]
         })
       })
     )
   })()
   ```

   怎么样？运行并试试效果吧。提示：发送“hello”给 Bot 试试看。

# 更多

以下是各大组件帮助文档的链接。

- 基础数据类型 -> [Base](Base.md)
- 机器人的操作 -> [Bot](Bot/README.md)
- 过滤/处理消息 -> [Middleware](Middleware.md)
- 接住 Mirai 的错误 -> [MiraiError](MiraiError.md)
- 等待用户的消息 -> [Waiter](Waiter.md)
