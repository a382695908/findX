# findX
使用白鹭3D引擎([egret-3d](https://github.com/egret-labs/egret-3d))开发的一个简单小游戏。
=======
# 概述 #

使用egret-3d写的简单小游戏，可以作为学习egret-3d的demo。
由于egret-3d本身不完善，因此对引擎代码有少量定制化修改([见我的egret-3d分支](https://github.com/aceway/egret-3d))和扩展(见./src/game/ExtraE3D.ts)。

### 功能 ###

* 计时过关小游戏。
* 在3D空间中捕获带有特殊字的飞行物(本来想做个3D的消消乐)。
* 支持PC中浏览器操作; 移动设备手机上操作，[早期版本](http://findx.huithink.com/)(未使用eui)支持，[最新版本](http://game.doogga.com/findX/)由于整合了eui，由于eui和egret-3d对触摸事件的处理不容导致不能玩。

### 如何编译? ###

* 使用 npm 自行安装所需库。
* 编译方式:
 1，可以使用egret-Wing-2.X 导入编译;
 2, 可以命令行使用 tsc 编译(需要将tsconfig.bak改名为tsconfig.json), Linux下可以参考 compile.sh 脚本;

### 如何运行部署? ###

* 1，支持使用nodejs 直接运行，见: webserver.js。
* 2，使用apache或nginx作为代理访问 nodejs启动的 webserver.js服务,详见: ./proxy.txt 。

## webserver.js的补充说明 ##

* 1，使用 nodejs 调用webserver.js启动 后台服务: node ./webserver.js 。
* 2, webserver.js功能是考虑在多个部署环境下的自适用：如支持微信分享、白鹭的nest接入、开发功能时直接进入游戏功能。

## 补充说明 ##
这个是个人业余学习H5 3D时实现的代码，所以会存在疏忽、错误，欢迎微信，QQ，邮件反馈讨论。 
个人是在近10年前对openGL等3D技术浅学过一些,去年底egret-3d首次在github放出开源代码后便开始囫囵吞枣的研读其代码，为解决问题匆匆翻出10多年前的老openGL书籍和浏览网上webgl文章恶补。而后便开始根据个人理解，整出这个玩意来，于春节期间发微信、微博一娱，移动设备对webgl 3D的支持不是很乐观，且微信更次。
在学习、使用eget-3d,webgl期间得到白鹭egret-3d开发者BlackSwan的不少帮助，在此感谢。

以上说明及这些代码，希望对希望学习，使用egret-3d、H53D的人有帮助，祝egret-3d完善，早日发展壮大...
