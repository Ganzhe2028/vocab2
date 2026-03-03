# Repository Guidelines

> MUST DO：Things that must be done: Every time there is a modification or update, the corresponding document content must also be updated. Every time a task begins, one needs to re-read the document.

## Project Structure & Module Organization

This repository is a Vite + React flashcard app with a separate vocabulary list.

- Root: `index.html`, `package.json`/`package-lock.json`, `vite.config.js`, and `vocab.md`.
- `dist/ui-ux-pro-max.skill` stores the packaged Codex skill artifact.
- `src/` holds the app: `main.jsx` mounts React, `App.jsx` contains all flashcard logic and `baseDeck` data, and `index.css` sets global styles, theme variables, and all animations.
- `node_modules/` is generated; do not edit it.
  If you add files (docs or assets), keep them in the root or `src/` and document them here.

## App Architecture & Mode System

`App.jsx` manages a three-mode state machine via the `mode` state (`'study' | 'rest' | 'spell'`):

### `study` mode (default)

Standard flashcard loop. Shows one card at a time; Space/Enter toggle and advance.

**Keyboard shortcuts:**

- `Space` — toggle reveal/hide meaning
- `Enter` — reveal if hidden; advance to next card if revealed; if on the **last card and already revealed**, enter `rest` mode
- `Tab` / `←` — previous card
- `Delete` / `Backspace` — remove current card from deck
- `ArrowLeft` — previous card

### `rest` mode (贫血模式)

Triggered after completing a full round (last card, revealed, Enter pressed). Clears all word details and shows a minimal screen:

- Title: "随手拼？"
- Subtitle: "enter 继续刷词 / space 开始随手拼"

**Keyboard shortcuts:**

- `Enter` — return to `study` mode at card 1
- `Space` — enter `spell` mode

### `spell` mode (随手拼)

Spelling practice over the current deck in order. Shows only pos + meaning; the word is hidden.

**State variables used:** `spellIndex` (current word index), `spellInput` (typed string), `spellResult` (`null | 'correct' | 'wrong'`), `shakeKey` (incremented to replay shake animation).

**Keyboard behaviour:**

- Letter keys — append to `spellInput`; if `spellResult === 'wrong'`, clears input and starts fresh from that letter
- `Backspace` — delete last character (only when not correct)
- `Enter` — submit; correct → green + show syllabified answer; wrong → shake animation + red text + show correct answer
- `Enter` again when wrong (without retyping) → replay shake
- `Esc` — exit to `study` mode at current index
- After spelling all words → automatically return to `study` mode at card 1

**Shake animation:** implemented by incrementing `shakeKey`, which is set as the React `key` prop on the input display element, forcing a re-mount and replaying the CSS `shake` keyframe animation.

## GitHub Button

A fixed, circular GitHub logo button sits in the top-right corner of the viewport (`position: fixed; top: 16px; right: 16px`). It links to `https://github.com/Ganzhe2028/vocab2` and uses a liquid-glass visual style (frosted backdrop filter, semi-transparent background, inner highlight ring).

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
