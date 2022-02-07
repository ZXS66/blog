---
title: 我所遇到的 Python 常见问题
tags:
  - python
  - proxy
  - anaconda
comments: false
date: 2022-01-21 17:21:59
---

最近在使用 `Python` 写一些趁手的小工具，因为很久没有用 `Python` 了，有些生疏，导致一些基础的操作都忘了，没办法，又要面向搜索引擎编程了。 😂

为此，记录一下我遇到的一些 `Python` 常见问题，以后再遇到直接翻这篇文章就好了。

### 设置 pip 镜像源 
`pip install` 默认使用的是 [pypi.org](https://pypi.org) 的镜像源。国内虽然也能访问，但访问速度有限，偶尔还会抽风。为此，推荐使用国内镜像源，比如清华大学、阿里云什么的。比如下面脚本就是全局设置清华大学数据源。

``` sh
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

设置完后，安装速度直接起飞！ ✈

### 使用代理

`Python` 程序，包括使用 `pip` 安装第三方库，默认是不会使用系统的网络配置的。所以就会发生一种情况，电脑能够正常打开网页，但是运行 `Python` 程序，或者 `pip install` 总是报错说无法访问网络。可能原因之一是，电脑使用了代理脚本或者代理服务器。而 `Python` 或 `pip` 并没有使用代理。

``` sh
pip install mysql-connector-python --proxy http://{username}:{password}@{host}:{port}
```

- *Note 1: `Python`连接 `MySQL` 数据库以前使用的是 [mysql.connector](https://pypi.org/project/mysql-connector/) 这个包，现在废弃了，Python 官方推荐使用 [mysql-connector-python](https://pypi.org/project/mysql-connector-python/)。如果你使用过程当中遇到一些奇怪的报错，请先卸载这两个包(`pip uninstall mysql.connector mysql-connector-python`)，再重新安装新的包 (`pip install mysql-connector-python`)*
- *Note 2: 代理如果不需要登陆，用户名和密码可不填；如果需要用户名和密码的话，需要转义特殊字符 ([encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)，比如 `@` 字符就要用 `%40` 代替)*

### 类变量 (class variables)

`Python` 的写法和其他编程语言不太一样，我们在类中声明的变量，默认是 [类变量](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)；通常在其他编程语言中，比如 `C#`、`Java`、`JS` 等，则是实例变量。

``` py
class Dog:

    kind = 'canine'         # class variable shared by all instances

    def __init__(self, name):
        self.name = name    # instance variable unique to each instance
```

上述代码声明的变量 `kind` 就是个类变量，简单理解就是 `C#` 中的静态变量(`static`)。而另一个更 tricky 的地方是，使用 `self` 和类名都可以引用到这个**变量**，但是使用 `self` 引用或者修改这个变量的话，只是修改了这个实例的变量，并未修改类变量。

具体可以参考以下代码：

``` py
print('-'*16)
d1 = Dog('d1')
print(f"d1.kind {d1.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
d1.kind = "barbet"
print(f"d1.kind {d1.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
Dog.kind = "husky"
print(f"d1.kind {d1.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
d2 = Dog('d2')
print(f"d1.kind {d1.kind}") 
print(f"d2.kind {d2.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
d2.kind = "collie"
print(f"d1.kind {d1.kind}") 
print(f"d2.kind {d2.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
Dog.kind = "pastoral"
print(f"d1.kind {d1.kind}") 
print(f"d2.kind {d2.kind}") 
print(f"Dog.kind {Dog.kind}") 
print('-'*16)
```

输出：
```
----------------
d1.kind canine
Dog.kind canine
----------------
d1.kind barbet
Dog.kind canine
----------------
d1.kind barbet
Dog.kind husky
----------------
d1.kind barbet
d2.kind husky
Dog.kind husky
----------------
d1.kind barbet
d2.kind collie
Dog.kind husky
----------------
d1.kind barbet
d2.kind collie
Dog.kind pastoral
----------------
```

### 使用 Anaconda 环境运行 py 文件

运行环境管理从来都是程序界永恒的难题。随着 `Jupyter` 的流行，`Anaconda` 也变得使用的越来越广泛了。但是我在我本地，使用 `Jupyter` 和 `Spyder` 编写的程序运行调试都没问题，我还用 “Anaconda Prompt (Anaconda3)” 单独运行也没有问题，通过测试了，我要部署到服务器怎么办就报错了？（“程序在我本地运行的好好的，怎么搬到服务器上就不行了？”）

通常情况下，遇到这种问题，使用容器即可解决。但是项目组内没有人懂，或者没有专门的运维人员来维护怎么办（其实就是不想用容器 😄）。有一种快速解决的办法。仔细观察电脑中已经安装好的 “Anaconda Prompt (Anaconda3)” 其背后指向的路径：`%windir%\System32\cmd.exe "/K" C:\Users\xxx\Anaconda3\Scripts\activate.bat C:\Users\xxx\Anaconda3`，不难发现，它使用了 [激活虚拟环境](https://docs.python.org/3/tutorial/venv.html) 技术。这就好办了：在其他人的电脑上运行的话，我把我的虚拟环境 (`requirements.txt`) 也搬过去不就行了？(类似于 `Node` 的 `packages.json`)

本来本地运行我的 `HelloWorld` 程序，只需要打开 “Anaconda Prompt (Anaconda3)”，切换运行目录 (cd ) 至当前环境，运行 `./helloworld.py` 或者 `python ./hello.py` 即可。现在只需要把以下代码运行以下的 bat 文件

``` bat
`%windir%\System32\cmd.exe "/K" C:\Users\xxx\Anaconda3\Scripts\activate.bat C:\Users\xxx\Anaconda3 helloworld.py
```

### 参考链接

- [<i class="fa fa-github" aria-hidden="true"></i> run_python_script_in_conda_env.bat](https://gist.github.com/maximlt/531419545b039fa33f8845e5bc92edd6)
