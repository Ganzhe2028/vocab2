# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React flashcard app with a separate vocabulary list.

- Root: `index.html`, `package.json`/`package-lock.json`, `vite.config.js`, and `vocab.md`.
- `dist/ui-ux-pro-max.skill` stores the packaged Codex skill artifact.
- `src/` holds the app: `main.jsx` mounts React, `App.jsx` contains the flashcard UI and `baseDeck` data, and `index.css` sets global styles and theme variables.
- `node_modules/` is generated; do not edit it.
  If you add files (docs or assets), keep them in the root or `src/` and document them here.

## Content Format & Naming Conventions

`vocab.md` entries use a three-line block separated by a blank line. Use a word label in brackets, Title Case; then meaning and sentence lines with `- Meaning (EN):` and `- Sentence:`. Avoid extra indentation or nested lists, and prefer ASCII unless a word requires otherwise.

Example format:

```md
[Word]

- Meaning (EN): short, clear definition
- Sentence: A full sentence that ends with a period.
```

`src/App.jsx` `baseDeck` entries include `term`, `syllables`, `respell`, `pos`, `meaning`, `meaningZh`, and `phrases`. Keep `term` in Title Case, use short part-of-speech tags with trailing periods (e.g. `adj.`), and keep `phrases` as short, common collocations.

Example `baseDeck` entry:

```js
{
  term: "Vacant",
  syllables: "Va·cant",
  respell: "[VAY-kunt]",
  pos: "adj.",
  meaning: "empty; not occupied",
  meaningZh: "空的；未被占用",
  phrases: ["vacant seat", "vacant position"],
},
```

Append new words to the end of both `vocab.md` and `baseDeck` unless you are deliberately reordering for a study plan.

## Build, Test, and Development Commands

- `npm install` (or `npm ci`)
- `npm run dev`
- `npm run build`
- `npm run preview`

## Testing Guidelines

There are no automated tests. Manually verify the UI renders and the deck navigation (Enter, Space, Tab, Delete) works after changes, then proofread for spelling and consistency.

## Commit & Pull Request Guidelines

This is a git repository. Use short, imperative commit messages like "Add 5 new words" and keep PRs focused; include a brief summary, the number of entries added or edited, and note any reorderings.

## Skills

- ui-ux-pro-max: Searchable database of UI styles, color palettes, font pairings, chart types, product recommendations, UX guidelines, and stack-specific best practices. (file: .cursor/commands/ui-ux-pro-max.md)
