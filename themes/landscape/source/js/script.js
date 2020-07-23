// document.addEventListener("DOMContentLoaded", function() {
var dependencies = [
  {
    export: window.jQuery,
    failover: "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.3.min.js",
    // failover: "https://code.jquery.com/jquery-2.0.3.min.js",
    integrity: "sha256-sTy1mJ4I/LAjFCCdEB4RAvPSmRCb3CU7YqodohyeOLo="
  },
  {
    export: (window.jQuery || {}).fancybox,
    failover:
      "https://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.pack.js",
    integrity:
      "sha384-A/Tc8RFHsjkPvgL0yZebgTxxmCGCSaTpGkyQLeFFFJQIAzSozLwNGX9AOCIpxoXC"
  }
];
// failover to load alternative files when CDN libraries failed.
var nonLoadedDependencies = dependencies.filter(function(dep) {
  return !dep.export;
});
/** lazy load js files */
function lazyLoadDependency(dep) {
  return new Promise(function(resolve, reject) {
    var script = document.createElement("script");
    script.src = dep.failover;
    if (dep.integrity && dep.integrity.length) {
      script.integrity = dep.integrity;
      script.crossOrigin = "anonymous";
    }
    // https://www.html5rocks.com/en/tutorials/speed/script-loading/#toc-dom-rescue
    script.async = false;
    script.addEventListener("load", function() {
      resolve(dep.failover + " is loaded");
    });
    script.addEventListener("error", function() {
      reject(dep.failover + " can't be loaded!");
    });
    document.head.appendChild(script);
  });
}
(nonLoadedDependencies.length
  ? new Promise(function(resolve, reject) {
      Promise.all(nonLoadedDependencies.map(lazyLoadDependency)).then(
        function() {
          resolve("All dependencies are loaded!");
        },
        reject
      );
    })
  : Promise.resolve("All dependencies are loaded!")
).then(function() {
  // library were all loaded
  // main content comes here

  var $ = window.jQuery;
  // Search
  var $searchWrap = $("#search-form-wrap"),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function() {
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback) {
    setTimeout(function() {
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $("#nav-search-btn").on("click", function() {
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass("on");
    stopSearchAnim(function() {
      $(".search-form-input").focus();
    });
  });

  $(".search-form-input").on("blur", function() {
    startSearchAnim();
    $searchWrap.removeClass("on");
    stopSearchAnim();
  });

  // Share
  $("body")
    .on("click", function() {
      $(".article-share-box.on").removeClass("on");
    })
    .on("click", ".article-share-link", function(e) {
      e.stopPropagation();

      var $this = $(this),
        url = $this.attr("data-url"),
        title = "👍 //" + $this.attr("data-title"),
        encodedUrl = encodeURIComponent(url),
        encodedTitle = encodeURIComponent(title),
        id = "article-share-box-" + $this.attr("data-id"),
        offset = $this.offset();

      if ($("#" + id).length) {
        var box = $("#" + id);
        if (box.hasClass("on")) {
          box.removeClass("on");
          return;
        }
      } else {
        var html = [
          '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '" readonly>',
          '<div class="article-share-links">',
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
            '" class="article-share-mail" target="_blank" title="邮件分享"></a>',
          "</div>",
          "</div>"
        ].join("");

        var box = $(html);
        $("body").append(box);
      }

      $(".article-share-box.on").hide();

      box
        .css({
          top: offset.top + 25,
          left: offset.left
        })
        .addClass("on");
    })
    .on("click", ".article-share-box", function(e) {
      e.stopPropagation();
    })
    .on("click", ".article-share-box-input", function() {
      $(this).select();
    })
    .on("click", ".article-share-box-link", function(e) {
      e.preventDefault();
      e.stopPropagation();

      window.open(
        this.href,
        "article-share-box-window-" + Date.now(),
        "width=500,height=450"
      );
    });

  // Caption
  $(".article-entry").each(function(i) {
    $(this)
      .find("img")
      .each(function() {
        if (
          $(this)
            .parent()
            .hasClass("fancybox")
        )
          return;

        var alt = this.alt;

        if (alt) $(this).after('<span class="caption">' + alt + "</span>");

        $(this).wrap(
          '<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>'
        );
      });

    $(this)
      .find(".fancybox")
      .each(function() {
        $(this).attr("rel", "article" + i);
      });
  });

  if ($.fancybox) {
    $(".fancybox").fancybox();
  }

  // Mobile nav
  var $container = $("#container"),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function() {
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function() {
    setTimeout(function() {
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  };

  $("#main-nav-toggle").on("click", function() {
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass("mobile-nav-on");
    stopMobileNavAnim();
  });

  $("#wrap").on("click", function() {
    if (isMobileNavAnim || !$container.hasClass("mobile-nav-on")) return;

    $container.removeClass("mobile-nav-on");
  });
});
// });
