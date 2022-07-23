This is the repository for managing [my blog](https://zxs66.github.io) in GitHub.com

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

### push to GitHub repository

``` bash
$ npm run deploy
```

More info about [hexo deploy](https://hexo.io/docs/one-command-deployment.html)

### deploy to GitHub Pages

The latest code will be pushed to GitHub Pages automatically when you submit new commit to the GitHub repository.

### best practice

1. `hexo draft "you new post name"` 
   
   draft a post

2. `hexo publish "your new post name"` 
   
   move a draft content from `source/_drafts` to `source/_posts` folder

3. `npm run go` 
   
   push the change to server, this is a combo commands for `hexo generate` and `hexo deploy`


