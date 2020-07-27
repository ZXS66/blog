(() => {
  const dependencies = [
    // {
    //   export: window.jQuery,
    //   failover: "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.3.min.js",
    //   // failover: "https://code.jquery.com/jquery-2.0.3.min.js",
    //   integrity: "sha256-sTy1mJ4I/LAjFCCdEB4RAvPSmRCb3CU7YqodohyeOLo="
    // },
    // {
    //   export: (window.jQuery || {}).fancybox,
    //   failover:
    //     "https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js",
    //   integrity:
    //     "sha384-A/Tc8RFHsjkPvgL0yZebgTxxmCGCSaTpGkyQLeFFFJQIAzSozLwNGX9AOCIpxoXC"
    // }
  ];
  // failover to load alternative files when CDN libraries failed.
  const nonLoadedDependencies = dependencies.filter(dep => !dep.export);
  /** lazy load js files */
  const loadDependency = dep => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = dep.failover;
      if (dep.integrity && dep.integrity.length) {
        script.integrity = dep.integrity;
        script.crossOrigin = "anonymous";
      }
      // // https://www.html5rocks.com/en/tutorials/speed/script-loading/#toc-dom-rescue
      script.async = false;
      script.addEventListener("load", () => {
        resolve(dep.failover + " is loaded");
      });
      script.addEventListener("error", () => {
        reject(dep.failover + " can't be loaded!");
      });
      document.body.appendChild(script);
    });
  };

  /** business logic, will be executed when all dependencies loaded */
  const myBiz = () => {
    // var $ = window.jQuery;
    // Search
    const $searchWrap = document.getElementById("search-form-wrap");
    let isSearchAnim = false;
    let searchAnimDuration = 200;
    const startSearchAnim = () => (isSearchAnim = true);
    const stopSearchAnim = callback =>
      setTimeout(() => {
        isSearchAnim = false;
        callback && callback();
      }, searchAnimDuration);
    document.getElementById("nav-search-btn").addEventListener("click", () => {
      if (isSearchAnim) return;
      startSearchAnim();
      $searchWrap.classList.add("on");
      stopSearchAnim(() =>
        document.querySelector(".search-form-input").focus()
      );
    });
    document
      .querySelector(".search-form-input")
      .addEventListener("blur", () => {
        startSearchAnim();
        $searchWrap.classList.remove("on");
        stopSearchAnim();
      });
    // Mobile nav
    const $container = document.getElementById("container");
    const mobileNavOnClass = "mobile-nav-on";
    let isMobileNavAnim = false;
    let mobileNavAnimDuration = 200;
    const startMobileNavAnim = () => (isMobileNavAnim = true);
    const stopMobileNavAnim = () => {
      setTimeout(() => (isMobileNavAnim = false), mobileNavAnimDuration);
    };
    document.getElementById("main-nav-toggle").addEventListener("click", () => {
      if (isMobileNavAnim) return;
      startMobileNavAnim();
      $container.classList.contains(mobileNavOnClass)
        ? $container.classList.remove(mobileNavOnClass)
        : $container.classList.add(mobileNavOnClass);
      stopMobileNavAnim();
    });
    document.getElementById("wrap").addEventListener("click", () => {
      if (isMobileNavAnim || !$container.classList.contains(mobileNavOnClass))
        return;
      $container.classList.remove(mobileNavOnClass);
    });

    // Share
    document.body.addEventListener("click", evt => {
      const classArticleShareBox = "article-share-box";
      const classOn = "on";
      Array.prototype.forEach.call(
        document.querySelectorAll(`.${classArticleShareBox}.${classOn}`),
        (value, inex) => {
          value.classList.remove(classOn);
        }
      );
      const $evtSrc = evt.target || evt.srcElement;
      if ($evtSrc.classList.contains("article-share-link")) {
        evt.stopPropagation();

        const id = `${classArticleShareBox}-${$evtSrc.getAttribute("data-id")}`;
        const offsetOf = el => {
          var rect = el.getBoundingClientRect(),
            scrollLeft =
              window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop =
              window.pageYOffset || document.documentElement.scrollTop;
          return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
        };
        const offset = offsetOf($evtSrc);

        let $box = document.getElementById(id);
        if ($box) {
          if ($box.classList.contains(classOn)) {
            $box.classList.remove(classOn);
            return;
          }
        } else {
          const url = $evtSrc.getAttribute("data-url");
          const title = "👍 //" + $evtSrc.getAttribute("data-title");
          const encodedUrl = encodeURIComponent(url);
          const encodedTitle = encodeURIComponent(title);

          $box = document.createElement("div");
          $box.id = id;
          $box.classList.add(classArticleShareBox);
          const $input = document.createElement("input");
          $input.classList.add("article-share-input");
          $input.setAttribute("readonly", true);
          $input.value = url;
          $input.setAttribute("title", "click to copy the URL");
          if (navigator.clipboard) {
            $input.addEventListener("click", async () => {
              event.stopPropagation();
              const $evtSrc = event.target || event.srcElement;
              const { value } = $evtSrc;
              try {
                await navigator.clipboard.writeText(value);
                console.log("URL copied!");
              } catch (error) {
                console.error("URL copy failed", error);
              }
            });
          }
          $box.appendChild($input);
          const $links = document.createElement("div");
          $links.classList.add("article-share-links");
          const html = [
            // 微博分享
            '<a href="http://service.weibo.com/share/share.php?title=' +
              encodedTitle +
              "&url=" +
              encodedUrl +
              '" class="article-share-weibo" target="_blank" title="微博分享"></a>',
            // 微信二维码分享
            '<a href="https://zixuephp.net/inc/qrcode_img.php?url=' +
              encodedUrl +
              '" class="article-share-wechat" target="_blank" title="微信分享"></a>',
            // QQ 好友分享
            '<a href="https://connect.qq.com/widget/shareqq/index.html?url=' +
              encodedUrl +
              "&sharesource=qzone&title=" +
              encodedTitle +
              '" class="article-share-qq" target="_blank" title="分享给QQ好友"></a>',
            // 邮件分享
            '<a href="mailto:your@mail.com?subject=' +
              encodedTitle +
              "&body=" +
              encodedUrl +
              '" class="article-share-mail" target="_blank" title="邮件分享"></a>'
          ].join("");
          $links.innerHTML = html;
          $box.appendChild($links);
          document.body.appendChild($box);
        }

        $box.style.top = offset.top + 25 + "px";
        $box.style.left = offset.left + "px";
        $box.classList.add(classOn);
      }
      if ($evtSrc.classList.contains(classArticleShareBox)) {
        evt.stopPropagation();
      }
      if ($evtSrc.classList.contains(classArticleShareBox + "-input")) {
        $evtSrc.select && $evtSrc.select();
      }
      if ($evtSrc.classList.contains(classArticleShareBox + "-link")) {
        evt.preventDefault();
        evt.stopPropagation();
        window.open(
          $evtSrc.href,
          `${classArticleShareBox}-window-${Performance.now()}`,
          "width=500,height=450"
        );
      }
    });

    // // Caption
    // $(".article-entry").each(function(i) {
    //   $(this)
    //     .find("img")
    //     .each(function() {
    //       if (
    //         $(this)
    //           .parent()
    //           .hasClass("fancybox")
    //       )
    //         return;

    //       var alt = this.alt;

    //       if (alt) $(this).after('<span class="caption">' + alt + "</span>");

    //       $(this).wrap(
    //         '<a href="' +
    //           this.src +
    //           '" title="' +
    //           alt +
    //           '" class="fancybox"></a>'
    //       );
    //     });

    //   $(this)
    //     .find(".fancybox")
    //     .each(function() {
    //       $(this).attr("rel", "article" + i);
    //     });
    // });
  };

  (nonLoadedDependencies.length
    ? new Promise((resolve, reject) => {
        Promise.all(nonLoadedDependencies.map(loadDependency)).then(
          () => resolve("All dependencies are loaded!"),
          reject
        );
      })
    : Promise.resolve("All dependencies are loaded!")
  ).then(myBiz);

  // let's just ignore IE users
  class FontAwesomeLink extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = '<i class="fa fa-link"></i>';
    }
  }
  customElements.define("fa-link", FontAwesomeLink);
})();
