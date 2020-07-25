hexo.extend.helper.register("search_form_cn", function(options = {}) {
    // const { config } = this;
    const className = options.class || 'search-form';
    const { text = 'Search', button } = options;
    
    // const search_form = hexo.extend.helper.get("search_form").bind(hexo);
    // let tmpl = search_form(options);
    // return tmpl.replace('//google.com', '//baidu.com');

    return `<form action="https//www.baidu.com/s" method="get" accept-charset="UTF-8" class="${className}"><input type="search" name="wd" class="${className}-input"${text ? ` placeholder="${text}"` : ''}>${button ? `<button type="submit" class="${className}-submit">${typeof button === 'string' ? button : text}</button>` : ''}</form>`;
});
