# ASIC Network docs theme

The shared visual layer for every ASIC Network mdBook (tutorial-template,
analog-tutorials, digital-tutorials, ...). It's layered on top of mdBook's
default theme via sanctioned override points, not a fork of mdBook's own
`index.hbs` — this is what keeps it small and upgrade-safe:

- `head.hbs` — extra `<head>` content (fonts, favicon)
- `header.hbs` — the ASIC Network brand bar, spliced in above mdBook's own menu bar
- `asic-network.css` — full reskin, loaded via `[output.html] additional-css`
- `asic-network.js` — right-hand "on this page" TOC, footer, code-block
  caption bars, scroll progress bar; loaded via `[output.html] additional-js`

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
to the *book root*, not the theme directory, so they stay `theme/asic-network.css`
/ `theme/asic-network.js` regardless of where this submodule is mounted.
