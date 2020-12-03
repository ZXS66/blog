---
title: Web 应用程序安全提升
tags: [Web, security, ASP.NET, ASP.NET MVC, CSP, Content-Security-Policy, Cache-Control]
comments: false
date: 2020-11-28 09:54:13
---

最近，应工作需要，将某小型应用整改，目的是将此前仅对内可用的小工具公布到互联网上供外部用户使用。这其中就要经历多重审核、整改、测试、上线。

鉴于细节过多，内容过于繁杂，就不一一列举每个整改步骤了。

## Session timeout

前期便于快速原型开发及上线，此应用采用的是 Windows 认证。而一般此类应用不会考虑到 Session timeout 时长。但既然审查出了这个 finding （发现），那就要整改了。

其实也很简单，就是找到 `web.config` 文件，在 `<configuration>.<system.web>` 节点添加/更改子节点 `<sessionState>`，将 `timeout` 时长（单位分钟）设置成你想要的值。

``` xml
<configuration>
  <system.web>
    <sessionState timeout="8"/>
  </system.web>
</configuration>
```

## 删除服务器版本

默认 ASP.NET Web 应用程序的 HTTP 请求的响应头，会夹带 `IIS`、`ASP.NET MVC` 及其版本信息。要想成为健壮的网页应用程序，就必须移除这些信息。以下是要做的改动:

##### web.config 文件

``` xml
<configuration>
  <system.web>
    <httpRuntime enableVersionHeader="8"/>
  </system.web>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <remove name="X-Powered-By" />
      </customHeaders>
    </httpProtocol>
    <security>
      <requestFiltering removeServerHeader="true"/>
    </security>
  </system.webServer>
</configuration>
```

## Content-Security-Policy (CSP) 响应头

通过声明 `CSP` 响应头，可以有效减少现代浏览器在动态加载资源的时候被 `XSS` （跨站攻击）风险。标准做法是在**服务器端**添加，不过也可以在 `html` 文件中添加 `meta` 头声明。具体请移步至 [官网](https://content-security-policy.com/)。

在 ASP.NET 服务器端，修改 `web.config`：

``` xml
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <!-- CSP -->
        <add name="Content-Security-Policy" value="default-src 'self'; img-src 'self' https://api.tiles.mapbox.com; style-src 'self' 'unsafe-inline'" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

## clientCache 设置 Cache-Control

公司要求禁用 `cache` ？？？

``` xml
<configuration>
    <system.webServer>
        <staticContent>
            <clientCache cacheControlMode="DisableCache"/>
        </staticContent>
    </system.webServer>
</configuration>
```

## 产品环境隐藏错误细节

这个简单，改改 `customErrors` 的模式即可。

``` xml
<configuration>
  <system.web>
    <customErrors mode="On"/>
    <!-- <customErrors mode="RemoteOnly"/> -->
  </system.web>
</configuration>
```

## 连接字符串加密

`web.config` 中连接字符串 (`connection string`) 默认是不加密的。如果启用 Windows 集成认证，那倒问题不大，但是有些情形下，会直接提供 `user id` 和 `password`，一旦泄露，会造成困扰。

对此，建议应用程序本身对连接字符串做简单加密。常见加密解密算法如下（引用网上的一张图）：

![常见加密解密算法](/images/webapp-security/algorithms.png)

##### BASE64

这个算法其实就是简单地把人类能读懂的语言文字变成 ASCII 编码。这样处理之后，人类是很难读懂了，但是机器读懂它简直不能太 easy。所以，一般这个算法不会单独用来加密，但是可以用来混淆内容。

##### MD5

emmm，严格来说，这个不算是加密算法，它只是信息摘要算法，就是把一大堆的内容转换成一串 ASCII 编码，同时这个算法有以下两个特点：

1. 相同内容的正文，肯定能输出相同的 ASCII 编码；
2. 只要内容稍加不同，输出的 ASCII 编码完全不一样。

这个算法（目前）是不可解密，所以不存在密钥一说。常用于校验我们从网上下载下来的文件是否被人恶意修改或植入病毒。在当前场景不适用。

##### SHA 

MD5 的升级版。

##### AES 对称加密

加密和解密使用同一套密码，

##### RSA 非对称加密

emmm，当今互联网社会的基石啊，多少人都在使用 `RSA` 当作公司 `VPN` 连接的双重身份认证凭证。加密的密钥（公钥）和解密的密钥（私钥）不一样，使用公钥加密的信息可以在互联网上传播，因为没有私钥解密的话此信息就算是天书吧。

结合当前场景（加密连接字符串），我们还用不上 `AES`、`RSA`，同时我们也不能单纯使用 `BASE64` 和 `MD5`/`SHA`，前者过于简单，后者不可逆（加密完我自己都读不懂，要你何用？）。

那，可不可以结合着使用？

以下是我个人在用的示例代码，仅供参考：

``` cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
public class Program
{
    public static void Main()
    {
        string connectionStringName = "Vanilla";
        /// remember to update the connection string value below
        string connectionStringValue = "Data Source=xxx.xxx.xxx.xxx;Initial Catalog=Project_Vanilla;user id=yyyy;password=zzzz";
        string secret = EncryptConnectionString(connectionStringName, connectionStringValue);
        Console.WriteLine(secret);
    }
    private static string EncryptConnectionString(string name, string connectionString)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentNullException(nameof(name));
        if (string.IsNullOrWhiteSpace(connectionString)) 
            throw new ArgumentNullException(nameof(connectionString));
        if (!connectionString.Contains('=')) 
            throw new ArgumentException(nameof(connectionString));

        connectionString = string.Join(string.Empty, connectionString.Reverse());
        int location = connectionString.IndexOf('=') / 2;
        string hash = GetCustomHash(name);
        string content = connectionString.Substring(0, location) +hash +connectionString.Substring(location);
        byte[] bytes = System.Text.Encoding.UTF8.GetBytes(content);
        return System.Convert.ToBase64String(bytes);
    }
    private static string GetCustomHash(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return string.Empty;
        using(MD5 provider = MD5.Create())
        {
            string SALT = "NewGreenLife";
            byte[] bytes = Encoding.UTF8.GetBytes(content+SALT);
            byte[] hashBytes = provider.ComputeHash(bytes);
            return BitConverter.ToString(hashBytes).Replace("-", string.Empty);
        }
    }
    private static string DecryptConnectionString(string name, string secret)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentNullException(nameof(name));
        if (string.IsNullOrEmpty(secret)) 
            throw new ArgumentNullException(nameof(secret));
        byte[] bytes = System.Convert.FromBase64String(secret);
        string base64Content = System.Text.Encoding.UTF8.GetString(bytes);
        string hash = GetCustomHash(name);
        if (!base64Content.Contains(hash))
            throw new ArgumentOutOfRangeException(nameof(secret));
        int location = base64Content.IndexOf(hash);
        string rawContent = base64Content.Substring(0, location) + base64Content.Substring(location + hash.Length);
        return string.Join(string.Empty, rawContent.Reverse());
    }
}
```

*未完待续*

## 参考链接

- [常见的加密解密算法](https://www.cnblogs.com/qianjinyan/p/10418750.html)
