---
uuid: 23836e90-e291-cd1e-cb7f-680e168dfafc
title: 在我的云主机上备份部署我的博客
tags:
  - Linux
  - hexo
comments: false
date: 2024-01-20 20:50:55
---

1. 仿照 `hexo` 的默认配置文件 `_config.yml`，另外新建一个新的配置文件，这里就叫它 `_ecs_config.yml`，然后根据情况更新
2. 在 `package.json` 的 scripts 下添加一行配置：
  ```json
  "scripts": {
    "ecs_publish": "hexo clean && hexo generate --config _ecs_config.yml && hexo deploy --config _ecs_config.yml && echo ✔️"
  },
  ```
3. 运行命令：`npm run ecs_publish`
4. 在 ECS 服务器上 host 这些文件（如 Nginx）

-------

关于将本地生成的文件（默认在 `public` 文件夹下）同步至 ECS 服务器，此处我使用了 [hexojs/hexo-deployer-rsync](https://github.com/hexojs/hexo-deployer-rsync) 这个插件。如果嫌麻烦，也可以自行手动同步：
```sh
scp -r public/* username@xxxx:/home/username/blog
```
