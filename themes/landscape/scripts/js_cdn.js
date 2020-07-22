hexo.extend.helper.register("js_cdn", function(item) {
  const js = hexo.extend.helper.get("js").bind(hexo);
  const integrityProp = "integrity";
  const placeholder = " " + integrityProp;
  const crossoriginAttr = ' crossorigin="anonymous"';
  let markup = js(item);
  if (item.hasOwnProperty(integrityProp)) {
    // default `js` helper function doesn't include crossorigin="anonymous" in the generated script markup
    const idx = markup.indexOf(placeholder);
    markup = [markup.substring(0, idx), crossoriginAttr, markup.substring(idx)].join("");
  }
  return markup;
});
