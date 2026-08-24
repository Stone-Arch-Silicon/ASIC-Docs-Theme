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
  reads `{{ book_title }}` and `{{ git_repository_url }}`, hardcodes nothing
- `theme.css` — full reskin, loaded via `[output.html] additional-css`
- `theme.js` — right-hand "on this page" TOC, footer, code-block
  caption bars, scroll progress bar; loaded via `[output.html] additional-js`
- `favicon.svg` — the chip + arch mark; swap it for a different one to
  rebrand without touching CSS

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
