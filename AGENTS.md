# Repository Guidelines

## Project Structure & Module Organization
This repository is a single content file: `Vocabulary Memory Kit.md` at the root. All vocabulary entries live there; there are no source, test, or asset directories. If you add supplementary materials, keep them in the root and document them here to avoid hidden structure.

## Content Format & Naming Conventions
Each entry is a three-line block with a blank line between entries. Use a word label in brackets, Title Case; then meaning and sentence lines with `- Meaning (EN):` and `- Sentence:`. Avoid extra indentation or nested lists to keep formatting uniform, and prefer ASCII characters unless a word requires otherwise.

Example format:
```md
[Word]
- Meaning (EN): short, clear definition
- Sentence: A full sentence that ends with a period.
```

Append new entries to the end unless you are deliberately reordering for a study plan.

## Build, Test, and Development Commands
No build system or scripts are configured. Edit `Vocabulary Memory Kit.md` in any editor; use your editor's Markdown preview if you want to review formatting before submitting changes.

## Testing Guidelines
There are no automated tests. Manually proofread for spelling, punctuation, and consistent formatting, and scan for duplicate words before submitting.

## Commit & Pull Request Guidelines
This folder is not a git repository, so there is no commit history to infer conventions. If you initialize git, use short, imperative messages like "Add 5 new words" and keep PRs focused; include a brief summary, the number of entries added or edited, and note any reorderings.
