# Sunflower Land — code contributing guide

Thank you for helping build Sunflower Land. This guide covers the contribution workflow: issues, local setup, branches, pull requests, and review.

This repository is the **game client** (React, Vite, Phaser) that talks to on-chain and off-chain services. For a high-level overview, read the [README](../README.md).

By contributing, you agree to the [terms of service](https://docs.sunflower-land.com/support/terms-of-service) (referenced in our PR checklist).

## Disclaimer

By contributing to this repository you grant Sunflower Land ownership of any IP you contribute, to use indefinitely. That includes code, ideas discussed in issues or PRs, and artwork. Contributors are sometimes rewarded with NFTs or airdrops, but **there is no guarantee of reward**.

You confirm you have the right to submit everything you contribute.

## Prerequisites

- A [GitHub](https://github.com) account
- **Node.js 22** (matches [CI](../.github/workflows/ci.yml))
- **Yarn** — install globally if needed: `npm install -g yarn`
- **Git** — install from [git-scm.com](https://git-scm.com/downloads). On Windows, **Git Bash** works well with the GitHub Desktop + VS Code steps below; on macOS or Linux, use your system terminal and the [command-line workflow](#git-workflow-with-the-command-line) as needed.
- Optional: [Visual Studio Code](https://code.visualstudio.com/Download) and [GitHub Desktop](https://desktop.github.com/)

## Environment setup

1. Open the [Sunflower Land repository](https://github.com/sunflower-land/sunflower-land) and **fork** it to your account. When cloning, use the option to contribute back to the **upstream** (parent) repo if your tool offers it.
2. Clone **your fork** locally (GitHub Desktop: **File → Clone repository**, or use Git — see [Git workflow with the command line](#git-workflow-with-the-command-line)).
3. In the repo root, install dependencies:

   ```bash
   yarn
   ```

   This installs packages defined in [`package.json`](../package.json).

4. Copy the environment sample:

   ```bash
   cp .env.sample .env
   ```

   Adjust values in `.env` as needed for local development. See comments in [`.env.sample`](../.env.sample) if present.

### Optional: GitHub Desktop + VS Code on Windows

1. In GitHub Desktop: **File → Options → Integrations**. Set **External editor** to Visual Studio Code and **Shell** to **Git Bash** (recommended).
2. Open the repo in VS Code from GitHub Desktop, or press **Ctrl+Shift+A** with the repo selected.
3. In VS Code, press **Ctrl+Shift+P**, run **Terminal: Select Default Profile**, and choose **Git Bash**.
4. Open the terminal from the menu (**View → Terminal**) or run **Terminal: Toggle Terminal** from the Command Palette (**Ctrl+Shift+P**).

## Running locally

Start the dev server (Windows, macOS, Linux, and WSL):

```bash
yarn dev
```

The app is served on port **3000** by default (see [`package.json`](../package.json)).

### Checks that mirror CI

Before opening a PR, run the same kinds of checks [CI](../.github/workflows/ci.yml) runs:

| Command     | Purpose                  |
| ----------- | ------------------------ |
| `yarn tsc`  | TypeScript compile check |
| `yarn test` | Jest unit tests          |
| `yarn lint` | ESLint                   |

CI sets `VITE_NETWORK=amoy` when running tests. If tests behave differently locally, try:

```bash
VITE_NETWORK=amoy yarn test
```

(On Windows Git Bash you can use the same line; in `cmd` use `set VITE_NETWORK=amoy && yarn test`.)

## Issues

### Open an issue

[Search existing issues](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments) first. If nothing fits, open a new issue using our [issue templates](https://github.com/sunflower-land/sunflower-land/issues/new/choose).

### Work on an issue

Browse [open issues](https://github.com/sunflower-land/sunflower-land/issues). Use **labels** to filter; see GitHub’s [label help](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests#filtering-issues-and-pull-requests-by-labels).

We usually assign time-sensitive features to core team members. If an issue is assigned and you still want to help, comment on the issue and coordinate with the assignee.

## How you can help

- Share ideas in an issue or on Discord (**#devs-chat**) before large changes.
- Pick an open issue that matches your skills and our scope (below).

## What to work on

Many people contribute, so we balance vision, security, testing, tokenomics, and long-term maintenance. Anything merged is maintained by Thought Farm.

We welcome many PRs, but **major gameplay or large new UI flows** need to fit the core team’s workflow (pairing, tests, review, tokenomics, product vision). We **do not** accept PRs that introduce **major gameplay changes** or **new end-to-end UI workflows** without prior alignment.

For big ideas, discuss with the community first; agreed items can land on the roadmap, with core implementation led by Thought Farm and room for community tasks around them.

**Usually fine to propose as a PR (typical community scope)**

- Bug fixes
- Decorations
- Small UI tweaks (copy, alignment, colours, minor layout)
- CI and build improvements
- Tests for business logic
- Animations and polish

**Usually needs core team involvement first**

- New game features
- Major UI/UX flows
- Architecture changes (state, storage, routing, etc.)
- Smart contracts and **backend/API** work on the server (frontend-only PRs in this repo are still welcome; if server changes are needed too, see [Backend / API](#related-repositories-and-docs))
- Testing infrastructure and broad repo tooling

## Keep your branch up to date

Upstream commits do not appear on your machine automatically. Update **before** starting new work.

### With GitHub Desktop

1. On **your fork** on GitHub, if you are behind upstream, GitHub shows **Sync fork** (or similar). Click **Sync fork**, then **Update branch**.
2. In GitHub Desktop, click **Fetch origin**, then **Pull origin** so your local `main` (or default branch) matches.

### With Git

See [Update from upstream](#update-from-upstream) below.

## Make changes

1. Create a **feature branch** from up-to-date `main` (GitHub Desktop: **Branch → New branch**; choose **main** / **upstream/main** as the base when prompted).
2. Switch to that branch and edit in your editor.
3. Commit often with clear messages; see [Commits](#commits).

## Git workflow with the command line

Use this if you prefer Git without GitHub Desktop.

### One-time setup

```bash
git clone https://github.com/<your-username>/sunflower-land.git
cd sunflower-land
git remote add upstream https://github.com/sunflower-land/sunflower-land.git
```

### Update from upstream

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

Create a branch for your work:

```bash
git checkout -b your-branch-name
```

After commits:

```bash
git push -u origin your-branch-name
```

Open a pull request from your fork’s branch against `sunflower-land/sunflower-land` **main** on GitHub.

## Before you open a pull request

- Add or update **tests** for business logic you change.
- Comment **non-obvious** code where it helps future readers.
- **Manually test** your change with `yarn dev`.
- Run **`yarn tsc`**, **`yarn test`**, and **`yarn lint`** locally.

Use our [pull request template](PULL_REQUEST_TEMPLATE.md) as a guide: short summary, motivation, **how to test**, screenshots or recording for **UI** changes (attach those **in the PR**, not required in this doc), and linked issues.

## Commits

Prefer **small, atomic commits** that are easy to revert.

**Documentation-only** changes (no code or config behaviour change): add **`[skip ci]`** on its own line in the commit message body so GitHub Actions does not run a full CI cycle for doc-only edits.

Example:

```
[CHORE] Update CODE_CONTRIBUTING.md

[skip ci]
```

### GitHub Desktop commit and push

1. Review changes in the left sidebar; stage files as needed.
2. Write a summary at the bottom; optionally add description.
3. Click **Commit to** _your-branch-name_ (the button shows the active branch).
4. Click **Push origin** (or **Publish branch** if the branch is new).

Other actions (if shown): **Commit** (local only), **Commit and Push**, **Commit (Amend)** (add to last commit — use carefully), **Commit and Sync**.

## Pull requests

1. Push your branch and open a **pull request** from your fork to **main**.
2. **Title prefix** (required for consistency):
   - **`[FEAT]`** — feature or enhancement
   - **`[CHORE]`** — maintenance, scripts, docs
   - **`[FIX]`** — bug fix

   Example: `[FEAT] Craft a sausage`

3. Fill in the template sections so reviewers can understand and test your change.

After you submit:

- A maintainer will review; we may ask questions or request changes.
- **Resolve** review threads when you address them ([how to resolve conversations](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#resolving-conversations)).
- For merge conflicts, see GitHub’s [merge conflict tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts).

### CI on pull requests

We run **GitHub Actions** on PRs, including:

- TypeScript (`yarn tsc`)
- Jest (`yarn test`)
- ESLint (`yarn lint`)

## Related repositories and docs

- **Art** — [ART_CONTRIBUTING.md](ART_CONTRIBUTING.md)
- **Backend / API** — server code lives in the private **sunflower-land-api** repository (only people with access can clone it and land server-side changes). **You can still open frontend PRs in this repo** without API access. If your UI change **needs new or different backend behaviour**, call that out in the issue or PR so the team can coordinate; **review and merge may take longer** while API work is scheduled or implemented separately.
- **Public HTTP API** (read-only tooling, rate limits, batch endpoints) — [OFFCHAIN_API.md](OFFCHAIN_API.md) and [openapi.json](openapi.json)

## After merge

Thanks for contributing. Welcome back for the next issue or idea.
