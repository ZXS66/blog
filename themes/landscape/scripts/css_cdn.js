hexo.extend.helper.register("css_cdn", function(item) {
  const css = hexo.extend.helper.get("css").bind(hexo);
  const integrityProp = "integrity";
  const placeholder = " " + integrityProp;
  const crossoriginAttr = ' crossorigin="anonymous"';
  let markup = css(item);
  if (item.hasOwnProperty(integrityProp)) {
    // default `css` helper function doesn't include crossorigin="anonymous" in the generated script markup
    const idx = markup.indexOf(placeholder);
    markup = [
      markup.substring(0, idx),
      crossoriginAttr,
      markup.substring(idx)
    ].join("");
  }
  return markup;
});
