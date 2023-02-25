---
uuid: fb2a37aa-c0c6-cf80-cd95-41365aa5213c
title: 本地开发环境启用 HTTPS
tags:
  - https
  - openssl
  - Chromium
comments: false
date: 2021-04-21 12:19:40
---

最近，Google Chrome 和 Microsoft Edge 自动升级到 v90 了。一般情况下，升级就升级吧，用户是无感的，页面照常打开，网照常上。但是这次不一样了，根据 changelog，这次升级带来一个[重大变更](https://chromium.googlesource.com/chromium/src/+log/89.0.4389.128..90.0.4430.72?pretty=fuller&n=10000)：优先请求HTTPS。

- 方案一：浏览器忽略本地不安全证书。
  在 Google Chrome 或者 Microsoft Edge 地址栏输入 `chrome://flags/#allow-insecure-localhost` ，强制打开开关
- 方案二：使用自签发证书。
  这个稍复杂，但是不用自行承担风险（部分木马程序会自在肉鸡本地开启不安全 https 服务）。

### 生成自签证书 (Self-Signed Certificate)

我这里选择的是使用 [OpenSSL](https://www.openssl.org/) 命令行生成证书。

1. 下载并安装 OpenSSL 的依赖项 [Perl](https://www.activestate.com/products/perl/downloads/)、Microsoft Visual C compiler、[Netwide Assembler](https://www.nasm.us)；
2. 下载 OpenSSL 最新 LTS 版本 [1.1.1](https://www.openssl.org/source/old/1.1.1/)；
3. 解压 OpenSSL 压缩文件；
4. 执行以下命令 (更多命令的介绍，可参考解压文件 INSTALL、NOTES.WIN、NOTES.PERL)：
   ```sh
    $ perl Configure { VC-WIN32 | VC-WIN64A | VC-WIN64I | VC-CE }
    $ nmake
    $ nmake test
    $ nmake install
   ```
   *`nmake` 是微软的C编译命令，我的电脑中此执行文件在 `C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\SDK\ScopeCppSDK\vc15\VC\bin` 中。*
5. 使用 `openssl` 命令生成证书： `openssl x509 -req -in client1.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client1.crt -days 1000 -sha256` 
   *OpenSSL 安装好后在我本机位置：`C:\OpenSSL-Win32\bin\openssl.exe`*

BTW，OpenSSL 的安装，真的是折磨啊！依赖项多不说，还有各种配置，不是程序员真的很难搞得定。

其实，还有另一个种各简便的办法，我在搜索相关文档时看见另外有一个小工具 [PuTTYgen](https://help.interfaceware.com/v6/how-to-create-self-certified-ssl-certificate-and-publicprivate-key-files) 也提供生成公钥/密钥，(但是好像并不能生成证书？)，有机会再试试。

但是，听说 `.Net 4.7.2` 之后已经提供自签证书 API，有机会可以试试写一个小程序直接一键生成，省的之后再安装 OpenSSL 各种麻烦了。（🖖 挖坑小能手，说的就是我）

### 导入证书

IIS 中怎么导入自签证书就不用我介绍了，本身步骤并不复杂，网上的教程又特别多。

### Angular本地开发启用HTTPS

修改 `package.json` 的 `ng server` 参数：

```json
{
  "scripts": {
    "start": "ng serve --configuration=en --ssl true --ssl-key /node_modules/browser-sync/lib/server/certs/server.key --ssl-cert /node_modules/browser-sync/lib/server/certs/server.crt"
    /// ...
  }
}
```

### 参考链接

- [Tutorial: Using OpenSSL to create self-signed certificates](https://docs.microsoft.com/en-us/azure/iot-hub/tutorial-x509-self-sign)
- [Create a self-signed public certificate to authenticate your application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-self-signed-certificate)
- [SERVE ANGULAR APP OVER HTTPS (LOCALHOST – ANGULAR CLI)](https://fmoralesdev.com/2020/01/03/serve-angular-app-over-https-using-angular-cli/)

