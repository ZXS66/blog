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
    // Search
    const $searchWrap = document.getElementById("search-form-wrap");
    let isSearchAnim = false;
    const searchAnimDuration = 200;
    const startSearchAnim = () => (isSearchAnim = true);
    const stopSearchAnim = callback =>
      setTimeout(() => {
        isSearchAnim = false;
        callback && callback();
      }, searchAnimDuration);
    const showSearchForm = () => {
      if (isSearchAnim) return;
      startSearchAnim();
      $searchWrap.classList.add("on");
      stopSearchAnim(() =>
        document.querySelector(".search-form-input").focus()
      );
    };
    document
      .getElementById("nav-search-btn")
      .addEventListener("click", showSearchForm);
    const $searchInput = document.querySelector(".search-form-input");
    const $searchDataList = document.getElementById("search-form-datalist");
    let search_ww;
    $searchInput.addEventListener("keyup", evt => {
      const options = Array.from($searchDataList.children);
      let activeOptIdx = -1;
      options.some((_, i) => {
        if (_.classList.contains("active")) {
          activeOptIdx = i;
        }
      });
      const keyCode = evt.key;
      if (keyCode === "Enter") {
        // enter button was pressed
        // redirect to the highlight matched post
        const theOpt = $searchDataList.querySelector(".active");
        if (theOpt) {
          window.location.pathname = theOpt.dataset.url;
        }
      } else if (keyCode === "ArrowUp" || keyCode === "ArrowDown") {
        if (!(options && options.length && activeOptIdx !== -1)) {
          return; // no matched posts found
        }
        if (keyCode === "ArrowUp") {
          // up arrow button was pressed
          activeOptIdx--;
          if (activeOptIdx < 0) {
            activeOptIdx = options.length - 1;
          }
        } else {
          // down arrow button was pressed
          activeOptIdx = (activeOptIdx + 1) % options.length;
        }
        // highlight selected post by set class 'active'
        options.forEach((_, i) => {
          if (activeOptIdx === i) {
            _.classList.add("active");
          } else {
            _.classList.remove("active");
          }
        });
        $searchDataList.scrollTo({
          top: options[activeOptIdx].offsetTop,
          left: 0,
          behavior: "smooth"
        });
      } else {
        // user is typing search term
        // TODO: debounce
        search_ww.postMessage({ action: "SEARCH", data: $searchInput.value });
      }
    });
    $searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        startSearchAnim();
        $searchWrap.classList.remove("on");
        stopSearchAnim();
      }, 128);
    });
    if (window.Worker) {
      search_ww = new Worker("/js/search_ww.js");
      search_ww.onmessage = e => {
        // search result returned
        const matchedPosts = e.data;
        $searchDataList.innerHTML = "";
        // render datalist with matched posts
        if (matchedPosts && matchedPosts.length) {
          matchedPosts.forEach((_, i) => {
            const $opt = document.createElement("p");
            $opt.dataset.url = _.url;
            const $h = document.createElement("h5");
            $h.innerHTML = `<a href="${_.url}">${_.title}</a>`;
            $opt.appendChild($h);
            const $body = document.createElement("div");
            $body.innerText = _.content;
            $opt.appendChild($body);
            $searchDataList.appendChild($opt);
            // highlight the first matched post by default
            if (i === 0) {
              $opt.classList.add("active");
            }
          });
        } else {
          $searchDataList.innerHTML =
            "<p>NO post(s) that matched with your input can be found, please try other keywords.</p>";
        }
      };
      setTimeout(() => {
        // initial search web work with delay
        if (document.getElementById("search-index-file")) {
          const indexFilePath = document.getElementById("search-index-file")
            .value;
          search_ww.postMessage({ action: "INIT", data: indexFilePath });
        }
        // shortcut for showing search form
        document.body.addEventListener("keyup", evt => {
          if (["E", "e"].includes(evt.key)) {
            showSearchForm();
          }
        });
      }, 1024);
    }
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
          const title = "👍" + $evtSrc.getAttribute("data-title");
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
                $box.classList.add("copied");
                setTimeout(() => {
                  $box.classList.remove("copied");
                }, 1024);
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
            '<a href="https://service.weibo.com/share/share.php?title=' +
              encodedTitle +
              "&url=" +
              encodedUrl +
              '" class="article-share-weibo" target="_blank" title="微博分享"></a>',
            // 微信二维码分享
            '<a href="/app/qrcode.html?data=' +
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

  // create custom HTML element fa-link for common usage (let's just ignore IE users)
  class FontAwesomeLink extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = '<i class="fa fa-link"></i>';
    }
  }
  customElements.define("fa-link", FontAwesomeLink);
  // append copy icon to each source code section
  if (navigator.clipboard) {
    const className_shining = "shining";
    const copySourceCode = async () => {
      const $elem = event.currentTarget;
      const sourceCode = $elem.parentElement.querySelector(".code").innerText;
      await navigator.clipboard.writeText(sourceCode);
      const $msg = $elem.querySelector("span");
      // const duration = $msg.style.animationDuration;
      const duration = 512; // 512ms
      $elem.classList.add(className_shining); // add the class to trigger the animation
      // swap the innerText during the animation
      setTimeout(() => {
        $msg.innerText = $msg.dataset.afterMsg;
      }, duration / 2);
      // resume
      setTimeout(() => {
        // https://css-tricks.com/restart-css-animation/
        $elem.classList.remove(className_shining);
        void $elem.offsetWidth; // trigger reflow
        $elem.classList.add(className_shining);
        setTimeout(() => {
          $msg.innerText = $msg.dataset.beforeMsg;
        }, duration / 2);
        setTimeout(() => {
          $elem.classList.remove(className_shining);
        }, duration);
      }, duration * 4);
    };
    Array.from(
      document.querySelectorAll(".article-entry figure.highlight")
    ).forEach($fig => {
      const $fa = document.createElement("i");
      $fa.classList.add("copy");
      $fa.classList.add("fa");
      $fa.classList.add("fa-files-o");
      const beforeMsg = `👈 copy to clipboard`;
      const afterMsg = `✔️ copied`;
      const $msg = document.createElement("span");
      $msg.classList.add("msg");
      $msg.innerText = beforeMsg;
      $msg.dataset.beforeMsg = beforeMsg;
      $msg.dataset.afterMsg = afterMsg;
      const $row = document.createElement("div");
      $row.classList.add("source-clipboard");
      $row.appendChild($fa);
      $row.appendChild($msg);
      $row.addEventListener("click", copySourceCode);
      $fig.appendChild($row);
    });
  }
})();
