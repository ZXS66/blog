This is the repository for managing [my blog](https://nextwave.gitee.io) in Gitee.com

### Create a new post

``` bash
hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Generate static files

``` bash
$ npm run build
```

More info about [hexo generate](https://hexo.io/docs/generating.html)

### push to Gitee repository

``` bash
$ npm run deploy
```

More info about [hexo deploy](https://hexo.io/docs/one-command-deployment.html)

### deploy to Gitee Pages

Open [Gitee Pages](https://gitee.com/nextwave/nextwave/pages) and click `Update` button.


### best practice

1. `hexo draft "you new post name"` 
   
   draft a post

2. `hexo publish "your new post name"` 
   
   move a draft content from `source/_drafts` to `source/_posts` folder

3. `npm run go` 
   
   push the change to server, this is a combo commands for `hexo generate` and `hexo deploy`


