(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- scroll progress bar ---------- */
  function initProgress() {
    var bar = document.getElementById("dt-progress");
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
    }
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    upd();
  }

  /* ---------- right-hand "on this page" TOC, scroll-spied ---------- */
  function initToc() {
    var content = document.getElementById("mdbook-content");
    if (!content) return;
    var main = content.querySelector("main");
    if (!main) return;

    var headings = Array.prototype.slice.call(main.querySelectorAll("h2, h3"));

    var layout = document.createElement("div");
    layout.className = "dt-layout";
    content.parentNode.insertBefore(layout, content);
    layout.appendChild(content);

    if (!headings.length) return;

    var toc = document.createElement("aside");
    toc.className = "dt-toc";
    toc.id = "dt-toc";
    toc.innerHTML = '<h3>On this page</h3><nav id="dt-toc-nav"></nav>';
    layout.appendChild(toc);

    var nav = toc.querySelector("#dt-toc-nav");
    nav.innerHTML = headings
      .map(function (h) {
        return (
          '<a class="dt-t-' + h.tagName.toLowerCase() + '" href="#' + h.id + '">' +
          (h.textContent || "").trim() +
          "</a>"
        );
      })
      .join("");

    if (!("IntersectionObserver" in window)) return;
    var links = nav.querySelectorAll("a");
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id);
            });
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach(function (h) {
      spy.observe(h);
    });
  }

  /* ---------- code block caption bars ----------
     book.js (loaded before this script) inserts a .buttons/.clip-button
     element as a direct child of <pre>, and chrome.css's icon + hover
     rules are scoped to that exact "pre > .buttons" relationship. So we
     leave .buttons inside <pre> untouched (just made always-visible via
     CSS instead of hover-only) and only add a caption bar as a sibling
     above <pre> for the dot + language label. */
  function initCodeCaptions() {
    var blocks = document.querySelectorAll("#mdbook-content pre");
    blocks.forEach(function (pre) {
      if (pre.closest(".dt-codeblock")) return;
      var codeEl = pre.querySelector("code[class*='language-']");
      var lang = "code";
      if (codeEl) {
        var m = codeEl.className.match(/language-(\S+)/);
        if (m) lang = m[1];
      }

      var figure = document.createElement("figure");
      figure.className = "dt-codeblock";
      var figcaption = document.createElement("figcaption");
      figcaption.innerHTML =
        '<span class="dt-dot"></span><span class="dt-lang">' + lang + "</span>";

      pre.parentNode.insertBefore(figure, pre);
      figure.appendChild(figcaption);
      figure.appendChild(pre);
    });
  }

  /* ---------- prev/next pager cards ----------
     mdBook's own .nav-chapters links only contain an icon; pull the
     matching chapter title out of the sidebar (by comparing the link's
     final path segment, since path_to_root prefixes can differ) so the
     wide-screen pager reads as a labeled card instead of a bare arrow. */
  function initPager() {
    var links = document.querySelectorAll(".nav-wide-wrapper .nav-chapters");
    if (!links.length) return;
    function basename(href) {
      try {
        return new URL(href, location.href).pathname.split("/").pop();
      } catch (e) {
        return href;
      }
    }
    links.forEach(function (a) {
      if (a.querySelector(".dt-pg")) return;
      var isNext = a.classList.contains("next");
      var file = basename(a.getAttribute("href"));
      var match = Array.prototype.find.call(
        document.querySelectorAll("#mdbook-sidebar .chapter a"),
        function (l) {
          return basename(l.getAttribute("href")) === file;
        }
      );
      var title = match ? match.textContent.trim() : "";
      var pg = document.createElement("span");
      pg.className = "dt-pg";
      pg.innerHTML =
        '<span class="dt-pg-label">' + (isNext ? "Next" : "Previous") + "</span>" +
        (title ? "<b>" + title + "</b>" : "");
      a.appendChild(pg);
    });
  }

  /* ---------- footer ----------
     reuses the wordmark and repo link already rendered by
     theme/header.hbs so nothing here has to know the book's title or
     repo URL directly. Appended after .nav-wide-wrapper (a sibling of
     .page, not a child of it) so the reading order stays content,
     pager, footer instead of footer, pager. */
  function initFooter() {
    var page = document.querySelector(".page");
    if (!page || !page.parentNode || page.parentNode.querySelector(".dt-footer")) return;
    var wm = document.querySelector(".dt-brand .dt-wm");
    var repoLink = document.querySelector('.dt-links a[target="_blank"]');
    var footer = document.createElement("footer");
    footer.className = "dt-footer";
    footer.innerHTML =
      '<div class="dt-row">' +
      (wm ? '<span class="dt-wm">' + wm.textContent + "</span>" : "") +
      '<span class="dt-tag">// built with mdBook</span>' +
      (repoLink
        ? '<a href="' + repoLink.getAttribute("href") + '" target="_blank" rel="noopener">Contribute on GitHub ↗</a>'
        : "") +
      "</div>";
    page.parentNode.appendChild(footer);
  }

  ready(function () {
    initProgress();
    initToc();
    initPager();
    initCodeCaptions();
    initFooter();
  });
})();
