# Welcome to Sunflower Land docs contributing guide

Thank you for joining our journey and helping us build the #1 Community Web3 game

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

To get an overview of the project, please read the [README](../README.md).

Here are some resources to help you get started with open-source contributions:

### Disclaimer

By contributing to this repository you provide Sunflower Land the ownership of any IP contributed to the project to use indefinitely. This includes code, discussions (ideas) and all types of artwork. While often designers and developers are rewarded with the NFTs and airdrops, there is no guarantee of reward.

You confirm you have the rights to the content you are contributing to the project.

## Getting started

### Prerequisites (all platforms)

You will need:

- A [GitHub](https://www.github.com) account
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) **v22** (LTS; CI uses v22 — [nvm](https://github.com/nvm-sh/nvm) / [nvm-windows](https://github.com/coreybutler/nvm-windows) / [fnm](https://github.com/Schniz/fnm) recommended)
- [Yarn](https://yarnpkg.com/) (install via `npm install -g yarn` after Node.js; if prompted to upgrade, follow the suggested command)
- A code editor: [Visual Studio Code](https://code.visualstudio.com/Download) or [Cursor](https://cursor.com/)

### Fork and clone

1. Go to the [Sunflower Land GitHub Repository](https://github.com/sunflower-land/sunflower-land)
2. **Fork** the repo to your account (use **Fork** so you can contribute back to the parent repo).
   ![Fork Repo](https://cdn.discordapp.com/attachments/939252287363239996/1179404787519869049/image.png?ex=661fc64d&is=660d514d&hm=6d3772f71ce9f108e1c33d20f87bdd14204850623a04e99a69a0283d8c77a0ed&)
3. **Clone** your fork (choose one):
   - **GitHub Desktop:** [Download](https://desktop.github.com/), then clone your fork and set it to contribute to the parent repo.
     ![Clone Repo Locally](https://cdn.discordapp.com/attachments/939252287363239996/1179405576342610042/image.png?ex=661fc709&is=660d5209&hm=2d3f19a313df81cf0ff388ab17986e11bfbae5393c7eab1701240de51d3f36e4&)
   - **Command line:**
     ```bash
     git clone https://github.com/YOUR_USERNAME/sunflower-land.git
     cd sunflower-land
     git remote add upstream https://github.com/sunflower-land/sunflower-land.git
     ```

### Platform-specific setup

#### Windows

- **Git:** Install [Git for Windows](https://git-scm.com/download/win); this includes **Git Bash**, which is a good default shell for the project.
- **Editor:** Install [VS Code](https://code.visualstudio.com/Download) or [Cursor](https://cursor.com/).
- **GitHub Desktop (optional):**
  - File → Options → Integrations: set **External Editor** to Visual Studio Code (or Cursor) and **Shell** to **Git Bash**.
  - Open the repo in your editor: `Ctrl + Shift + A` (or Repository → Open in Visual Studio Code).
    ![Integration Settings](https://cdn.discordapp.com/attachments/939252287363239996/1179406381380550808/image.png?ex=661fc7c9&is=660d52c9&hm=d3b8a8080f64689125ca5aaa90aa797176d81edf444c4d093d9d8922ecc6eae7&)
    ![Open VSC](https://cdn.discordapp.com/attachments/939252287363239996/1179406741876785202/image.png?ex=661fc81f&is=660d521f&hm=e56768a5cfe805f69bb56539c496b173da14535b6647a131fc4cf4310db962a2&)
- **Terminal in VS Code/Cursor:** `Ctrl + Shift + P` → “Terminal: Select Default Profile” → **Git Bash**; then **Ctrl + Shift + `** (backtick key) to open the terminal.
  ![Select Default Terminal](https://cdn.discordapp.com/attachments/939252287363239996/1227463209439592521/Screenshot_2024-04-10_112012.png?ex=66287f32&is=66160a32&hm=53fcaf97134e5a79e6836b17abc03f905bb81d6554edbcd40704885b00e7da2b&)

**Shortcuts:** `Ctrl + Shift + P` (Command Palette), **Ctrl + Shift + `** (terminal), `Ctrl + Shift + A` (open in VS Code from GitHub Desktop).

#### macOS

- **Git:** Either install [Xcode Command Line Tools](https://developer.apple.com/xcode/) (`xcode-select --install`) or [Git for macOS](https://git-scm.com/download/mac). The built-in **Terminal** or [iTerm2](https://iterm2.com/) work well.
- **Editor:** [VS Code](https://code.visualstudio.com/Download) or [Cursor](https://cursor.com/).
- **GitHub Desktop (optional):** File → Preferences → Integrations: set **External Editor** and **Shell** as you prefer; use **Terminal** or **iTerm** as the default shell.

**Shortcuts:** `Cmd + Shift + P` (Command Palette), **Ctrl + `** or `Cmd + J` (terminal). In GitHub Desktop, `Cmd + Shift + A` opens the repo in the external editor.

#### Linux

- **Git:** `sudo apt install git` (Debian/Ubuntu), `sudo dnf install git` (Fedora), `sudo pacman -S git` (Arch, Manjaro, EndeavourOS), or your distro’s package manager.
- **Node.js:** Prefer [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) and use Node v22.
- **Editor:** [VS Code](https://code.visualstudio.com/) or [Cursor](https://cursor.com/) (install via `.deb`/`.rpm`, pacman, or package manager).

**Shortcuts:** `Ctrl + Shift + P` (Command Palette), **Ctrl + `** (terminal). Same as Windows for most editor shortcuts.

#### WSL2 (Windows)

If you develop on **WSL2** (Windows Subsystem for Linux), use the **Linux** instructions inside your WSL distro (e.g. Ubuntu, or Arch if you use an Arch-based WSL image). For **Arch-based** distros (Arch, Manjaro, EndeavourOS, including in WSL): use `sudo pacman -S git`; for Node.js, `sudo pacman -S nodejs` or nvm/fnm for v22. Use a Linux-native Git, install Node.js via nvm/fnm when not on Arch, and run VS Code/Cursor from Windows with the [WSL extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) so the editor runs against the WSL filesystem. Prefer `yarn` and `git` from the WSL shell.

### Install and run

In the project root, in a terminal (Git Bash on Windows, or Terminal/iTerm on macOS, or your Linux shell):

```bash
yarn install
# or: yarn
```

Installs dependencies from [package.json](../package.json).

```bash
cp .env.sample .env
```

Creates a `.env` with local config (needed to run the app).

```bash
yarn dev
```

Runs the app locally (e.g. http://localhost:3000).

![Commands](https://cdn.discordapp.com/attachments/939252287363239996/1227463321293164584/image.png?ex=66287f4c&is=66160a4c&hm=35f32e684c6e1df517207868473b7c54442232ef54690a0861c5fb4b14e64b9d&)

🎉 **Congratulations!** You’re ready to contribute to Sunflower Land.

### Advanced setup

#### GitHub CLI (gh)

[GitHub CLI](https://cli.github.com/) lets you work with forks, PRs, and issues from the terminal. Install it, then run `gh auth login` and follow the prompts.

**Install:**

- **Windows:** `winget install GitHub.cli` or [installer](https://cli.github.com/)
- **macOS:** `brew install gh`
- **Linux (apt):** `sudo apt install gh` (Debian/Ubuntu)
- **Linux (dnf):** `sudo dnf install gh` (Fedora)
- **Linux (pacman):** `sudo pacman -S github-cli` (Arch, Manjaro, EndeavourOS; WSL too if using an Arch-based distro)

**Fork and clone with gh:**

```bash
gh repo fork sunflower-land/sunflower-land --clone
cd sunflower-land
git remote add upstream https://github.com/sunflower-land/sunflower-land.git
```

**Create a branch, push, and open a PR:**

```bash
git fetch upstream
git checkout -b your-branch-name upstream/main
# ... make your changes, then:
git add .
git commit -m "[FIX] Your message"
git push origin your-branch-name
gh pr create
```

`gh pr create` opens an interactive prompt for the PR title, body, and base branch. You can use `gh pr create --fill` to reuse the commit message, or `gh pr create -t "[FIX] Title" -b "Description"` to set them directly.

### Issues

#### Create a new issue

If you spot a problem with the docs, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue doesn't exist, you can open a new issue using a relevant [issue form](https://github.com/github/docs/issues/new/choose).

#### Solve an issue

Scan through our [existing issues](https://github.com/sunflower-land/sunflower-land/issues) to find one that interests you. You can narrow down the search using `labels` as filters. See [Labels](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests#filtering-issues-and-pull-requests-by-labels) for more information.

As a general rule, we assign features with deadlines to core team members. If a ticket is already assigned and you are passionate about it, please reach out to the developer on the issue comments and help them out.

## How can I help?

If you have a bright idea, open an issue or join our active Discord #devs-chat first and start a discussion. We love to bring in the community ideas where possible!

Don't have any ideas? We would suggest scanning the open issues and seeing if there is something that catches your eye.

You can search by labels as well to see which items are more urgent than others.

## What should I work on?

Maintaining a project with over 50 open-source developers brings a range of challenges:

- Maintaining a consistent vision
- Ensuring best architecture practices
- Security concerns and vulnerabilities
- Automated and manual testing
- Readability and maintainability
- Managing expectations, deadlines and contributors leaving the project
- Tokenomics design
- Anything that gets added to the project is more code that needs to be maintained by Thought Farm.

While we appreciate UI and gameplay PRs, we need these pieces of work to fit into the core team's development workflow to ensure work is pair programmed, has sufficient automated testing, is understood by the team, is peer-reviewed, aligns with the tokenomics of the game and adheres with the vision of the project.

Due to the limited time resources of the team, at this point of time, we cannot accept any PRs that introduce major gameplay changes or UI workflows.

If you have an idea that introduces new UI workflows or gameplay, the best way forward is to first raise the idea for community and if consensus is met, it will get added to the roadmap. Once an item is on the roadmap, the core functionality will be developed by Thought Farm with the support from certified developers and the community. For new gameplay and UI workflows there will be plenty of tasks that can be worked on by community members.

**Examples of what can be worked on independently**

- Bug fixes
- Decorations
- Minor UI enhancements - Typos, buttons, alignment, colours
- CI & Build improvements
- Writing tests
- Animations + game polish

**Examples of what the core team will need to be involved in**

- New game features
- Major UI & UX workflows
- Architecture changes (state management, data storage, routers etc.)
- Smart contracts & APIs
- Testing infrastructure
- Repo tooling (testing, components, build)

### Update your Branch

Periodically the devs may push commits to the repository but they do not automatically appear in your local system.

Before starting on your project, be sure to update your branch first.

**Option A — GitHub (browser):**

1. Go to your forked repo page; if there are commits missing from your fork you’ll see a message to sync.
   ![Sync Fork](https://cdn.discordapp.com/attachments/939252287363239996/1227520084344569856/image.png?ex=6628b42a&is=66163f2a&hm=3391bb661fae133da6404ec545a62511c538a5d20e2d82ce3446c5cf2e817496&)
2. Click **Sync fork**
3. Click **Update branch**
   ![Update Branch](https://cdn.discordapp.com/attachments/939252287363239996/1227519523918446622/image.png?ex=6628b3a4&is=66163ea4&hm=026e7c8b742d5163029f5e172c079aa86b2a82054d147fcedd13db8c68dd7506&)
4. In **GitHub Desktop:** **Fetch origin**, then **Pull origin**
   ![Fetch Origin](https://cdn.discordapp.com/attachments/939252287363239996/1179427812378153031/image.png?ex=661fdbbf&is=660d66bf&hm=b6bcab68835d2985f6d5a6a8b62c972faa2e7350b653e23928fc827db92917cb&)
   ![Pull Origin](https://cdn.discordapp.com/attachments/939252287363239996/1179428162392826007/image.png?ex=661fdc12&is=660d6712&hm=e67b2d605109ee27983eea75c3a17ec0d804bfc9b69eb0c80dad86c3c1eac956&)

**Option B — Command line:**

```bash
git fetch upstream
git merge upstream/main
# or: git pull upstream main
```

Your branch should now be up to date with the main Sunflower Land repo.

### Make Changes

#### Make changes locally

**Option A — GitHub Desktop:**

1. Open GitHub Desktop
2. Create a new branch (base it on `upstream/main` if prompted)
   ![New Branch](https://cdn.discordapp.com/attachments/939252287363239996/1179408819328135288/image.png?ex=661fca0e&is=660d550e&hm=08409935e9c4215b72dd06af9468eaf69e44579905e0e73ec12af7c0b6f54cf4&)
   ![Create based on main](https://cdn.discordapp.com/attachments/939252287363239996/1179409109213257801/image.png?ex=661fca53&is=660d5553&hm=0fcfad5f4a5d417397f22637894a8927767aecf3b2e4cbf446e8b27e2fa1a9f9&)
   ![alternate](https://cdn.discordapp.com/attachments/939252287363239996/1179409109422985236/image.png?ex=661fca54&is=660d5554&hm=2e58aa2978b0a60a411a3ede6ed58478261ba99629a02112588c67fef1480c76&)
3. Open the repo in VS Code or Cursor and make your changes.

**Option B — Command line:**

```bash
git fetch upstream
git checkout -b your-branch-name upstream/main
```

Then open the repo in your editor and make your changes.

### Preparing to submit

Before you submit, ensure you have done the following:

- Written tests for any business logic code
- Provided sufficient comments on the code
- Manually tested your code by running the repo.

Some commands you can run:

- `yarn dev` — run the app locally
- `yarn tsc` — TypeScript check for syntax errors
- `yarn test` — run the test suite
- `yarn lint` — run the linter

### Commit your update

Commit the changes once you are happy with them. We prefer atomic commits that are easily revertable.

> **TIP:** If your changes include **only** documentation updates/additions/deletions,
> make sure that you add below line to your commit message while committing:
>
> **`[skip ci]`**
>
> This **_won't_** trigger the GitHub Actions CI Workflow in turn, it **_won't_** waste the resources. 🤗 🌏
>
> > E.g.
> >
> > ```
> > [CHORE] Update README.md
> > [skip ci]
> > ```

Once you have confirmed your changes, use the Source Control panel to name your commit and commit. Then sync/push to the remote.

![Commit](https://cdn.discordapp.com/attachments/939252287363239996/1179410663962050721/image.png?ex=661fcbc6&is=660d56c6&hm=d8c7425ac7cefa846d660e5892f9f79d88f4c00fc9289013dc2d19acec93fc7c&)
![Sync Changes](https://cdn.discordapp.com/attachments/939252287363239996/1179411439132364880/image.png?ex=661fcc7f&is=660d577f&hm=0f0c83f8dd2767e1ae620d4d382675bee3222e9a5bf25af2f6da114503e47c5c&)

**Other commit options (GitHub Desktop / VS Code):**

- _Commit_ — commit locally
- _Commit (Amend)_ — add to the most recent commit
- _Commit and Push_ — commit and push to the remote
- _Commit and Sync_ — commit and sync with the remote branch

![Other Commit Options](https://cdn.discordapp.com/attachments/939252287363239996/1227465427861508127/image.png?ex=66288143&is=66160c43&hm=c41631df5fbbb7d056507fd7b21722e4510c7212d31661d3151586092a2567b4&)

**Command line:** `git add .` then `git commit -m "Your message"` and `git push origin your-branch-name`.

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

You will want to prefix the name of your PR with the category it falls under:

- [FEAT] Feature or enhancement
- [CHORE] Admin type work (scripts, documentation etc)
- [FIX] A bug fix

For example - "[FEAT] Craft a sausage"
![Create PR](https://cdn.discordapp.com/attachments/939252287363239996/1227520795014729749/image.png?ex=6628b4d3&is=66163fd3&hm=99221d3950fa4db97d7e119d1951f77bc131be1b7b00a6676887af61053e8af3&)

- Once you submit your PR, a Sunflower Land team member will review your proposal. We may ask questions or request for additional information.
- We may ask for changes to be made before a PR can be merged
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://lab.github.com/githubtraining/managing-merge-conflicts) to help you resolve merge conflicts and other issues.

When a PR is opened we run Github Actions to ensure the quality of the code is up to standards. This includes:

- Typescript check
- Jest (unit testing)

### Your PR is merged!

Congratulations 🎉🎉 The Sunflower Land Dev Team thanks you for your contributions!✨️
