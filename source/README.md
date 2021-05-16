## Gitee pages

Click [here](https://gitee.com/nextwave/nextwave/pages) to publish 🙂

## code snippets

### fontawesome sample

``` html
<i class="fa fa-chain" aria-hidden="true"></i>
```

### custom element for link

``` html
[<fa-link/>](https://your-link.here)
```

### insert local image

``` html
![title](/images/postfolder/image.png)
```

## Changelog

### 2021.5.9

- [ ] feat: display references' URL when printing
- [x] feat: self-serving QR code instead of third party

### 2020.12.16

- [x] feat: implement Hexo local search by introducing hexo-generator-search

### 2020.11.10

- [x] feat: replace h3 (###) with h5 (#####) because h3 is very similar with h2 (##)
- [ ] bug: wrong date format in archive page

### 2020.9.16

- [x] feat: support of custom routing for static service engine(gitee pages)

### 2020.9.7

- [x] feat: javascript clipboard API

### 2020.9.3

- [x] feat: about me page

### 2020.7.31

- [x] feat: replace favicon with PNG file (transparent background)

### 2020.7.27

- [x] feat: append my contact info to the source code
- [ ] ~~bug: specify source code pro font version, otherwise the checksum will be changed in future~~ 
- [x] bug: remove static file integrity of font "source code pro" due to unsupport versioning by google fonts
- [x] feat: copy source code (in progress) or current url (done)

### 2020.7.24

- [x] feat: hide article content in index.html
- [x] feat: delete 3rd party libraries like jQuery and jQuery fancybox

### 2020.7.23

- [x] feat: replace search engine（Google -> Baidu、sogou）*task cancelled, the blog is aim for self review, just replaced it with hexo-generator-search*
- [x] bug: when click image in fancybox modal, the article will scroll to the top (fancybox is removed)

### 2020.7.22

- [x] feat: add integrity for static files from CDN
- [x] feat: lazy load scripts and dns-prefetch
- [x] feat: load fancybox library from CDN
- [x] feat: failover to local libraries(jquery, fancybox, fontawesome), cause now we can load it from CDN

### 2020.7.17

- [x] feat: create subfolder of source, named images, which is used for storing post's illustrations (previously used a external website instead)

### 2020.7.16

- [x] feat: add open graph meta [The Ultimate Guide to SEO Meta Tags](https://moz.com/blog/the-ultimate-guide-to-seo-meta-tags) to Hexo posts

### 2020.7.15

- [x] feat: share via mail

### 2020.7.10

- [x] research: favicon.ico will be delete automatically if user uploaded it to server manually! need to find a solution to upload favicon in Hexo manner (solution: put favicon.ico under source folder)

### 2020.7.9

- [x] research: have uploaded favicon.ico to server manually, need to check if it will be delete next time commit the code (well, your guess is right, the file can be deleted automatically)
- [x] feat: Share via Weibo, WeChat and QQ

### 2020.7.8

- [x] bug: favicon.ico can't deploy to server
- [x] initial commit source code of Hexo blog to server
