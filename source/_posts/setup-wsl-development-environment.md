---
title: 配置 WSL 开发环境
tags:
  - wsl
  - docker
comments: false
date: 2022-11-10 21:50:30
---

### 背景

### 安装步骤

##### 启用虚拟化和WSL

![启用或关闭Windows功能](/images/setup-wsl-development-environment/turn-on-or-off-windows-features.jpg)

完成之后需要重启。

##### 启用WSL

```sh
wsl --install
```
完成之后*可能*需要重启。

##### 安装Windows Terminal

在 Microsoft Store （应用商城）中搜索 Windows Terminal 即可一键安装，此处省。

##### 安装Ubuntu

有多种方式可以安装 Ubuntu。最简单的方式，就是和上一步一样，在 Microsoft Store （应用商城）中搜索 Ubuntu 即可一键安装，此处省。

##### 配置 apt 国内软件源镜像

``` sh
sudo cp /etc/apt/sources.list /etc/apt/sources.list.20221110.bak # 备份是个好习惯
sudo vim /etc/apt/sources.list # 替换国内镜像源以加速，根据 Ubuntu 不同版本号，选择不同的路径
```

因为我在上海，使用的又是 Ubuntu 22.04，所以我的配置如下：

``` /etc/apt/sources.list
deb https://mirror.sjtu.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirror.sjtu.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirror.sjtu.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirror.sjtu.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirror.sjtu.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirror.sjtu.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirror.sjtu.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# deb-src https://mirror.sjtu.edu.cn/ubuntu/ jammy-security main restricted universe multiverse

# deb https://mirror.sjtu.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
# deb-src https://mirror.sjtu.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
```

##### 初始化

安装完成之后，打开 Windows Terminal，选择 Ubuntu：

![Windows Terminal](/images/setup-wsl-development-environment/windows-terminal.jpg)

第一次打开会提示设置用户名密码（超级用户权限）。

##### Windows 环境必要软件安装

根据各开发者技术栈不同，需要安装的软件会有所不同。包括但不限于：[Docker Desktop](https://www.docker.com/products/docker-desktop/)、[Visual Studio Code](https://code.visualstudio.com)、[Remote Development Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

##### WSL 环境必要软件安装

根据各开发者技术栈不同，需要安装的软件会有所不同。包括但不限于：[git](https://git-scm.com/download/linux)、[node.js](https://nodejs.org)、[python](https://www.python.org/downloads/)


##### GitHub 加速

其实，现在好多办法都可以加速访问 [GitHub](https://github.com)，我这里介绍一种特别原始的办法，就是修改 hosts 文件。

1. 以管理员权限，打开记事本
2. 记事本中打开 `C:\Windows\System32\drivers\etc\hosts` 文件
3. 添加以下 IP 映射：

```sh
# 需要定期更新如下代码
# New！欢迎使用基于DNS的新方案
# https://gitlab.com/ineo6/hosts/-/raw/master/next-hosts
# 地址可能会变动，请务必关注GitHub、Gitlab获取最新消息
# 也可以关注公众号：湖中剑，保证不迷路
# GitHub Host Start

140.82.114.3                 central.github.com
140.82.114.3                 assets-cdn.github.com
151.101.1.6                  github.map.fastly.net
151.101.1.6                  github.global.ssl.fastly.net
140.82.114.3                 gist.github.com
185.199.108.153              github.io
140.82.114.3                 github.com
140.82.114.3                 api.github.com
140.82.114.3                 codeload.github.com
72.21.206.80                 github-cloud.s3.amazonaws.com
72.21.206.80                 github-com.s3.amazonaws.com
72.21.206.80                 github-production-release-asset-2e65be.s3.amazonaws.com
72.21.206.80                 github-production-user-asset-6210df.s3.amazonaws.com
72.21.206.80                 github-production-repository-file-5c1aeb.s3.amazonaws.com
185.199.108.153              githubstatus.com
140.82.113.18                github.community
140.82.114.3                 raw.github.com

# Please Star : https://github.com/ineo6/hosts
# Mirror Repo : https://gitlab.com/ineo6/hosts

# Update at: 2022-11-10 16:20:33

# GitHub Host End
```

### 参考链接

- [<i class="fa fa-windows" aria-hidden="true"></i>Install Linux on Windows with WSL](https://learn.microsoft.com/en-us/windows/wsl/install)
- [上海交通大学 Linux 用户组 软件源镜像服务](https://mirrors.sjtug.sjtu.edu.cn/docs/ubuntu)
- [<i class="fa fa-windows" aria-hidden="true"></i>Set up a WSL development environment](https://learn.microsoft.com/en-us/windows/wsl/setup/environment)
- [<i class="fa fa-github" aria-hidden="true"></i>GitHub Hosts | hosts](https://ineo6.github.io/hosts/)
