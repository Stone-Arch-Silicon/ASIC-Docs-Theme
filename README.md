# docs theme

A shared visual layer for any mdBook. It's layered on top of mdBook's
default theme via sanctioned override points, not a fork of mdBook's own
`index.hbs` — this is what keeps it small and upgrade-safe. Maroon + gold,
dark, with a twin-arch motif as the signature detail; every element is
CSS-variable driven so a fork can re-theme by editing `theme.css`'s
`:root` block alone.

Nothing in this theme names a specific book, club, or organization — the
brand wordmark and repo link come from the mounting book's own `book.toml`
(`book_title`, `git_repository_url`), so the same theme commit can be
pinned by any number of unrelated books:

- `head.hbs` — extra `<head>` content (fonts, favicon)
- `header.hbs` — the brand bar, spliced in above mdBook's own menu bar;
  reads `{{ book_title }}` and `{{ git_repository_url }}`, hardcodes nothing.
  The nav logo is inlined as a data URI (mdBook only auto-copies theme
  files it recognizes by name, so an arbitrary image asset — currently
  `ASICclubLogo.png` — has to travel as bytes in the HTML, not as a
  linked file); swap it for a different mark by re-running the same
  trim/resize/base64 steps against a new source image.
- `theme.css` — full reskin, loaded via `[output.html] additional-css`.
  Includes a `.hljs-*` syntax-highlighting palette that overrides
  whichever stock highlight.css/tomorrow-night.css/ayu-highlight.css
  mdBook has active, so code blocks look the same regardless of theme.
- `theme.js` — right-hand "on this page" TOC, footer, code-block
  caption bars (copy button relocated into the caption bar), pager
  labels, scroll progress bar; loaded via `[output.html] additional-js`
- `favicon.svg` — the chip + arch mark used for the browser tab icon
  (separate from the nav logo above)
- `highlight.js` — overrides mdBook's bundled highlight.js (same
  approach as favicon.svg: a file named exactly `highlight.js` in this
  directory replaces the built-in one). This is a custom build of
  highlight.js **10.1.1** (matching mdBook 0.5's bundled version, so
  the `.hljs-*` class names in `theme.css` still line up) with the same
  language set mdBook ships, plus `vhdl` and a `verilog` grammar
  (aliases `v`, `sv`, `svh`, `systemverilog` — one grammar covers both
  Verilog and SystemVerilog) patched beyond the stock upstream one: it
  also titles the declared name after `module`/`class`/`interface`/
  `program`/`package`/`primitive`/`checker`/`covergroup` (see the
  `beginKeywords` + `UNDERSCORE_TITLE_MODE` block — `task`/`function`
  are deliberately excluded, since an optional return type between the
  keyword and the name makes the real name unreliable to regex-match)
  and colors `(* ... *)` attribute instances as `meta`, same as the
  existing `` ` `` preprocessor-directive handling.
  `highlight-src/verilog.js` is the patched source (stock upstream file
  plus those two blocks) — rebuild from it, not from a fresh
  `npm pack`, or the patch is lost. To rebuild (also needed after an
  mdBook version bump, to match its highlight.js version):
  1. `npm pack highlight.js@10.1.1 && tar xzf highlight.js-10.1.1.tgz`
  2. Copy `highlight-src/verilog.js` over the extracted
     `package/lib/languages/verilog.js`
  3. Write a small entry file that `require()`s `package/lib/core` and
     every language to bundle, each with an **explicit, literal**
     `require('./package/lib/languages/<name>')` call — a templated or
     looped path defeats the bundler's static analysis and pulls in all
     ~190 languages (a 900KB+ bundle instead of ~140KB)
  4. `esbuild entry.js --bundle --format=iife --outfile=highlight.js --minify`

## Using this in a book

This repo is meant to be mounted as a git submodule at `theme/` in a book
repo (mdBook's default theme location — no `book.toml` `theme` override
needed):

```
git submodule add <this-repo-url> theme
```

Because it's a submodule, each book pins a specific commit of this theme
and updates on its own schedule:

```
cd theme
git checkout <ref>       # switch this book to a different theme version
cd ..
git add theme
git commit -m "bump docs theme"
```

`additional-css`/`additional-js` paths in `book.toml` are resolved relative
to the *book root*, not the theme directory, so they stay `theme/theme.css`
/ `theme/theme.js` regardless of where this submodule is mounted.
