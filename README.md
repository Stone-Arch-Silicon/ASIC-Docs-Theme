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
  language set mdBook ships plus `verilog` (aliases `v`, `sv`, `svh`,
  `systemverilog` — one grammar covers both Verilog and SystemVerilog)
  and `vhdl`. To add another language or rebuild after an mdBook
  version bump: `npm pack highlight.js@10.1.1`, extract it, list the
  languages to register in a small entry file (use explicit
  `require('./lib/languages/<name>')` calls, not a templated/dynamic
  path — a bundler can't tree-shake a dynamic `require` and will pull
  in all ~190 languages), then `esbuild entry.js --bundle --format=iife
  --outfile=highlight.js --minify`.

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
