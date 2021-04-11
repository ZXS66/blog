---
title: ASP.NET MVC 表单认证
tags:
  - ASP.NET
  - ASP.NET MVC
  - Form Authentication
  - Windows Authentication
comments: false
date: 2021-03-14 10:24:00
---

开始之前，先发一句牢骚，平时我们用微软技术栈（`ASP.NET`、`C#`、`.NET Core`），就是因为看中了绝大多数公司办公环境是 `Windows` 桌面系统，使用微软技术栈能够更好的与 `OA`、`SMTP` 邮箱、`ERP` 等企业内部系统深度集成。省去了用户权限设计不说（和其他系统共用一个 AD 域账户），还能方便开发者快速搭建原型。所以，我之前编写的 `ASP.NET` 网站基本上都是使用的 `Windows` 认证。然而，前几天某客户 IT 的标准要求，不能使用 `Windows` 认证。具体来说，不是不能使用 `Windows` 认证，是不能使用各浏览器自带的用户权限输入框来填写用户名密码。我们写的 APP 必须有自己的登陆/登出页面，同时为了使用 AD 域账户，我们的 APP 拿到用户名和**密码**后去 AD 里验证合法性。当时听到这个整个，心中一百个 CNM 在奔腾。你们真的确定吗？？？

先不说这个标准是谁定的，脑子瓦塌了？你真的放心让我来接触域账户密码(明文)？！我自己都害怕。。。不担心我私自存储用户密码？不担心用户填写信息时候被窃听？至少你使用 `SSO` （Single-Sign On，单点登录）都比这个强啊！

*To Be Continued*

### 参考链接

- [Implement forms-based authentication in an ASP.NET application by using C#.NET](https://docs.microsoft.com/en-us/troubleshoot/aspnet/forms-based-authentication)
- [Forms Authentication In ASP.NET](https://www.c-sharpcorner.com/UploadFile/fa9d0d/forms-authentication-in-Asp-Net/)
