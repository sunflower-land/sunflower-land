# Sunflower Land (frontend)

React + TypeScript + Phaser game client, built with Vite. Game logic lives in `src/features/game/` (events/reducers in `events/`, item and rule data in `types/`, helpers in `lib/`). The server is the sibling repo `sunflower-land-api`, which re-runs the same reducers to validate every player action.

## Commands

- Type-check: `yarn tsc` (`npx tsc --noEmit`)
- Lint: `yarn lint` (eslint + prettier). CI runs `tsc`, `test` and `lint`.
- Tests: `VITE_NETWORK=amoy npx jest src/features/...`, **always from the repo root** (see Testing). CI sets `VITE_NETWORK=amoy` the same way. In PowerShell: `$env:VITE_NETWORK="amoy"; npx jest src/features/...`
- Dev server: `npx vite --port 3000 --host`. Don't use `yarn dev`, which begins with the Windows-only `set NODE_ENV=development &&`.

## Pull requests

Every PR description follows [`docs/PULL_REQUEST_TEMPLATE.md`](docs/PULL_REQUEST_TEMPLATE.md), and the "PR template" check (`.github/scripts/check-pr-template.mjs`) fails the PR otherwise. Bots and GitHub "Revert" PRs are exempt.

- The title starts with `[FEAT]`, `[FIX]`, `[CHORE]` or `[BALANCE]`.
- Fill in Summary, Context / motivation and How to test, and keep the Checklist.
- **UI changes:** tick "This PR does not change the UI" only when nothing visual changes. Otherwise, fill in "Why this UI change is needed" and put a screenshot or recording in each of the four cells of the Before / after table (Desktop and Mobile, before and after). The check accepts files dragged into the GitHub editor and direct image/video URLs (`.png`, `.gif`, `.webp`, `.mp4`, …); links to hosted players such as Loom or YouTube don't count. These count as UI changes: any `.tsx`/`.css` file, `src/assets/`, images in `public/`, `dictionary.json`, `src/features/game/lib/style.ts`, `tailwind.config.js`, `index.html`, a Phaser `scenes/`/`containers/`/`shaders/` file, or an added, changed or removed art reference (`SUNNYSIDE`, `ITEM_DETAILS`, `icon:`/`image:`, image imports) in a `.ts` file. Only screenshots under "Before / after" count, and each of the table's four cells needs one.

## FE/BE parity

Game logic, types and shop data are duplicated in `sunflower-land-api`. A change to one side that the other doesn't mirror makes the server reject the client's actions, or the reverse.

- FE `src/features/game/{events,types,lib}/X.ts` mirrors BE `src/domain/game/{events,types,lib}/X.ts`. FE events mostly sit in `events/landExpansion/`; BE events are flat.
- Treat a change to a mirrored file as one two-repo edit. Find both copies before editing, edit both, and run both repos' tests before calling it done. Skip the BE only for UI-only work (styling, animations, components).
- `sunflower-land-api` is private. Contributors without access run the FE tests and say in the PR which BE change is needed; the team makes and tests the BE side.
- Tests mirror too. If one side pins a value in a test, the other side should assert the same value.
- **A new `GameState` field** must be added to FE `src/features/game/lib/transforms.ts` (`makeGame`) and to the BE mappers (`makeDBGame` / `makeGameState`). Without that it is silently dropped on load or save. A new event also needs a Joi schema in the BE `autosave.ts`.

## Code & UI conventions

### Time

- **Never call `Date.now()` in a React component, hook body or JSX**, even if the value only feeds hook config. Use `useNow` from `lib/utils/hooks/useNow` (`{ live, intervalMs, autoEndAt }`), or derive the value from existing state.
- For boost-active checks shown in the UI, or read at click time, use a **live** clock: `useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS })`. Reuse a live clock the component already has (e.g. `useNodeTimer`'s `now`). Watch for `autoEndAt` stopping a clock that something else still needs.
- Reducers use their `createdAt`. A helper that needs the time takes a required `now` parameter. Pass it up to the reducer; don't fall back to a `Date.now()` default. `Date.now()` is fine in tests and in pure non-React helpers that don't feed reducers.

### Reading game state

Use `useSelector` with a selector defined at module scope, not `useGame()`. `useGame()` wraps `useActor` and re-renders on every machine transition:

```ts
const _pigpen = (state: MachineState) => state.context.state.pigpen; // module level

const { gameService } = useContext(Context); // not useGame()
const pigpen = useSelector(gameService, _pigpen);
```

Select the narrowest slice you need. Many files still call `useGame()`; don't mass-convert them unless that is the task.

### i18n

- Add new keys **only** to `src/lib/i18n/dictionaries/dictionary.json`. A translation bot copies them to `en.json` and the other locales. Never edit those files by hand. See `LANGUAGES.md` there.
- Use one full key per label (no `` `${t("speed")}: ${x}x` `` concatenation). Don't hard-code English text or `alt` strings. Let translated popovers wrap (`max-w-[…]`, not `whitespace-nowrap`).

### UI components and design system

Every UI change follows [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md). Read it before changing any `.tsx` layout. Its rules in short:

- **No new icons, colours, borders or `Label` types**, and no giving an existing one a new meaning. These belong to the team.
- **No coloured icon tiles**: don't put icons in new coloured or framed squares to signal a category or season.
- **No new filter or tag systems.** `Chip` stays in the places it is already used; new filter UI needs team sign-off.
- **Use the primitives** in `src/components/ui/` (`Modal` + `CloseButtonPanel`, `Panel`s, `Button`, `Label`, `Box`, `RequirementLabel`, …). New code uses no raw hex classes, CSS rounded corners or shadows.
- `Label` colours carry meaning. The yellow/`warning` type means rare or reward; never use it for a neutral state or a filter.
- Check both mobile (~375px) and desktop. Keep to one UI change per PR. UI PRs need before/after screenshots on both, plus the reasoning.

Other UI conventions:

- When an interaction depends on the tool or item the player holds, read `selectedItem` from the game `Context` and use `shortcutItem(...)` to pick a default. Don't build a separate in-scene picker; plots and the beach already work this way.
- Memo dependencies that look under-specified may be on purpose. Read the comment above one before "fixing" it. For example, the animal-building sort order is keyed only on herd membership, so animals don't reshuffle mid-session.

### Feature flags (`src/lib/flags.ts`)

- `testnetFeatureFlag` means amoy only. `betaFeatureFlag` means amoy or a Beta Pass holder, which is a real mainnet audience.
- Time-windowed features are entries in `TIME_BASED_FEATURE_FLAG_WINDOWS`. Reducers call `hasTimeBasedFeatureAccess({ featureName, game, now: createdAt })`. Components **must** use `useTimeBasedFeatureAccess`.
- Keep flags identical in both repos.

## Game-logic rules

- **Multipliers before additives.** Boosts apply as base × every multiplier, then + every flat bonus. Known exceptions, which act as a final multiplier on the fully boosted total: forged (Ancient/Sacred) tree and forged node multipliers, the insect plague ×0.5, and Double Delivery. Where existing code mixes the order and isn't on that list, ask before reordering it.
- Use `getAOEExtent` for anything that needs a scarecrow-style AOE footprint (gameplay and the landscaping overlay). Don't re-derive tile counts or treat a skill as a boolean.
- A tradable item needs a `tradeAt` in `INVENTORY_RELEASES` / `WEARABLE_RELEASES`. An item's trade type ("instant"/"onchain") only says _how_ it trades once allowed.
- When a feature needs a balance number the spec doesn't give, say so and get it recorded. Don't let a placeholder quietly become canon.

## Known decisions and existing behaviour

These are deliberate, or parked on purpose. They describe the code **as it is on `main`**; a PR that changes or worsens any of them is still judged on its own merits.

- **`GameState.bumpkin` is compulsory** in both repos (`bumpkin: Bumpkin` in `types/game.ts`), so code doesn't need `game.bumpkin?.` guards or "player has no Bumpkin" fallbacks. The `bumpkin?:` that a grep turns up belongs to `SavedLayout` (the Bumpkin's placement in a layout), not to `GameState`. Old optional chaining in a few files is pre-migration leftover, not a pattern to copy.
- **`isCollectibleBuilt` reads `Date.now()`.** That makes reducers non-deterministic around a collectible's `readyAt`. The fix (threading `now` into every caller) is parked because it touches many files, so it isn't bundled into unrelated PRs.
- **`expandLand` / `revealLand` have known FE/BE differences**: `createdAt` on revealed nodes, beehive/flower-bed ids, Fire Pit vs `getRewards` order, `farmActivity` tracking, the `boostsUsed` shape, the BE `getLand` guard. Fixing them is out of scope for unrelated work. A _new_ difference introduced by a PR is a real bug.
- **Keyboard reachability of in-world click targets isn't a product requirement.** This is a pointer and touch game. Functional and touch issues still matter.

## This repo is public

- Don't explain exploits, hidden mechanics, server-side rolls or accepted security trade-offs in PR descriptions, commits, review replies or code comments. Keep unreleased chapter mechanics out of PR bodies and commits too.
- If a bot finding touches one of those, leave it unanswered. If a reply is really needed, keep it terse and neutral ("intentional, no change").

## Specs and tickets

- **Only the latest version of a spec grants scope.** Older versions in the same doc explain intent; anything that only they mention is reference, not a requirement.
- **A table in a spec that maps A → B is usually a rule** (A is only valid with B). Ask before building the permissive reading.
- **File tickets only for the spec that has just been discussed and agreed.** Don't pre-file the rest of the doc.
- **To answer "what's left?", check the code, not the board.** Grep both repos for each open ticket's constants and config. Ticket bodies go stale as items get renamed or cut.
- **Keep the project board current.** A ticket moves to In progress when work starts, to In review with the PR links when PRs open, and to Done at merge. New items get an `Order` value so the board stays sequenced.
- **Before calling an auction or BAU slot "no matching item", grep both repos for the name.** Minted auction items are final, so a missed match can't be corrected later.

## CI workflows

- **Test a workflow change on the largest open PR**, not on the small PR that carries it. Re-trigger by temporarily adding `synchronize` to the trigger, pushing once, then removing it.
- The Codex review action is pinned to `openai/codex-action@v1.11` on purpose: v1.12 hangs on large PRs. Don't bump it until upstream fixes it.

## Testing

- **TDD for game logic**: write the test, run it and see it fail, then fix it and see it pass. This covers events/reducers, FE+BE mirrored rules, planners and economy maths. Mirror the test in the BE.
- **No React component tests and no hook tests.** There are no `.test.tsx` files, by design. Small display-only predicates (which tab opens, whether a hint shows) get no test either. Rule of thumb: test it if a bug would corrupt state or desync FE/BE. Verify UI work with `tsc`, eslint, a build and the browser.
- **Jest runs on amoy.** CI sets `VITE_NETWORK=amoy`, and locally `.env` does the same (loaded by `test/env.ts`), so beta and testnet flags are **on**. If your `.env` is missing or points at another network, pass `VITE_NETWORK=amoy` on the command line. Flag-off paths need a nested `describe` that sets `CONFIG.NETWORK = "mainnet"`.
- **Run jest from the repo root.** Run from a subdirectory, `.env` isn't loaded and flag-gated suites fail with legacy values.
- **Time-gated tests are tripwires.** When a date-gated constant changes, update the hardcoded expected numbers and keep `Date.now()` in the fixture. Don't pin `createdAt`, and don't derive expectations from the production helper, which is circular. Name the expected values and show the arithmetic in a comment.
- Mutation-test new assertions: break the code under test, confirm the test goes red, then revert.

## Dev environment gotchas

- **Git worktrees** (e.g. `.claude/worktrees/<name>`) have no `.env` or `node_modules`. Symlink both from the main checkout (`ln -s <main>/node_modules node_modules`, same for `.env`). Without `.env`, jest and the dev server quietly run with flags off.
- **ESLint ignores any path containing `/.`**, so inside `.claude/worktrees/` it lints nothing and still exits 0. Pass `--no-ignore`. If the worktree has its own full `node_modules`, ESLint also loads the parent config; use `npx eslint --no-eslintrc -c .eslintrc.js --no-ignore <files>`.
- Even then, worktree eslint misses `prettier/prettier`. Run `npx prettier --check <changed files>` before pushing.
- **Art mode** (offline farm): run the dev server with `VITE_API_URL=` (empty). To seed state, put a base64url JSON patch in the real query string before the hash: `http://localhost:3000/?patch=<b64>#/`. Change `location.hash` after the farm loads. A `?patch=` inside the hash is dropped on the first navigation.
- Never hand-edit `yarn.lock`. Change it only with `yarn add` / `yarn upgrade`.

---

# Team workflow

The rest of this file applies to team members (people with write access) and their tools. Community contributors only need the sections above.

## Working style

- **Do exactly what was asked.** Don't add adjacent "improvements", refactors or regenerations. If a fix could go several ways or balloon, say so and let the requester choose.
- **An imperative line in a planning discussion extends the plan; it isn't a go-ahead.** Stay in analysis until you're explicitly told to make the change.
- **One user-visible change per step.** Land it, let the requester check it in the running game, then move on. Ask before bundling.
- **Never commit, push, open a PR or merge unless explicitly asked.** "Upload", "ship" or "put it in the repo" aren't commit instructions, and "create a branch" means only that. Prepare the change, show it, and let the requester pull the trigger.
- **Leave committed history alone.** Don't amend or force-push existing commits, e.g. to strip an attribution trailer.

## Git, PRs and merging

- **Run `git branch --show-current` before every commit and push.** The checkout may have been switched since you last looked. Never commit to `main`: branch and open a PR. `git add <files>` doesn't unstage what was already staged, so check `git diff --cached --stat` before committing.
- **Merge with `gh pr merge <n> --squash --admin --subject "<title> (#<n>)" --body "<body>"`**, and only when:
  - every check is green, and
  - CodeRabbit's final walkthrough has no actionable findings. Its first comment is a "processing" placeholder that is edited in place, so re-read it rather than waiting for a new event.
- **Never use `gh pr merge --auto` to "wait for CI".** Merges don't require status checks, so it merges at once.
- **Squash merges copy `Co-authored-by:` trailers** from the branch's commits onto `main`. Before merging, `git fetch` and run `git log origin/main..HEAD --format='%(trailers:key=Co-Authored-By)'`. If anything comes back, pass an explicit `--body`.
- Re-trigger CodeRabbit with an `@coderabbitai review` comment. After `gh pr edit`, re-read the body: edits have silently failed before. The REST fallback is `gh api -X PATCH repos/<owner>/<repo>/pulls/<n> -F body=@file.md`.

## Releases

FE and BE release separately but usually together. A paired release shares one slug.

1. **Pushing a tag is not a release.** Pushing to `main` deploys testnet; mainnet deploys only when a GitHub Release is **published**.
2. **New `dictionary.json` keys:** before tagging FE, wait for the `[BOT] Update translations` commit on `main`, so the tag includes it. Until it lands, other locales fall back to English. Merge i18n PRs a few minutes apart: two merging within seconds makes the translate job fail, and the missed keys wait for the next dictionary change.
3. **Tag the merged `main` commit explicitly:** `git fetch origin main && git tag <tag> origin/main`. Don't tag `HEAD`, which may still be a PR branch. Tags are lightweight, `v<semver>-<kebab-slug>`, with a patch bump (e.g. `v2.29.15-honey-rates`). The title is the title-cased version + slug (`v2.29.15 Honey Rates`).
4. **Publish:** push the tag first (`git push origin <tag>`), then run `gh release create <tag> --verify-tag --title "<Title>" --notes "<notes>"`. `--verify-tag` stops `gh` from creating a fresh tag at the current tip of `main` if the push was missed. Don't pass `--target`; a short SHA gives `422`. If the command errors, run `gh release view <tag>` before retrying: it may have published anyway.
5. **Publish FE and BE together, then approve the FE `production` gate straight away.** BE deploys in ~3–4 min with no gate. FE takes ~5–6 min after approval, so BE lands first on its own; this is a deliberate choice over waiting for BE to finish. Never approve FE if the BE deploy has failed. If BE stalls past ~6 min, hold the FE approval until it succeeds.
   - Find the FE run for **this** tag: `gh run list --workflow="Mainnet deploy" --branch <tag> --limit 1` (a release run's branch is its tag). Check that the run's `headBranch` is your tag, then get the environment id with `gh api repos/sunflower-land/sunflower-land/actions/runs/<id>/pending_deployments`.
   - Approve with a `POST` to the same endpoint (`-F "environment_ids[]=<env id>" -f state=approved -f comment="<release tag>"`; `comment` is required). Its response shape varies, so confirm with `gh run view <id> --json status`.
6. **After an FE release, check the World chunk serves.** Fetch `/play/`, find its `assets/index-*.js`, find the `World-*.js` it references, and `curl -m 30` that file expecting a 200. If it 500s or hangs, re-run the FE mainnet deploy and approve again; the rebuild gets fresh chunk hashes.
7. Features that change FE and BE together must be **released** together, not just merged.

## Art and assets

- **Images repo** (`sunflower-land/images`): sprites the game loads via `CONFIG.PROTECTED_IMAGE_URL`.
  - Pushing to `main` deploys testnet (~5 min). Publishing a GitHub Release (`v1.N.M-kebab-name`, title `v1.N.M Name`, no `--target`) deploys mainnet.
  - Commit art on a branch, never on `main`. Merge the images PR **before** the FE PR that uses the art.
- **Biome land art** is generated by `images/_scripts/land-levels/construct.mjs`. Base tiles for basic/desert/volcano live in `_scripts/land-levels/out/<biome>/`. The ascension biomes' base tiles live only in the `biome-toolkit` repo's `src/samples/<biome>/`.
  - To regenerate: copy the samples into `out/<biome>`, run `node construct.mjs init <biome>`, then `node construct.mjs generate <biome> 42`. Copy `out/generated/<biome>/.` to `assets/land/levels/<biome>/` and delete the temp folders.
  - Ascension biomes have 42 levels × 4 seasons.
- **Art-mode patches** for testing a screen (see Dev environment gotchas for booting art mode):
  - Buildings: `buildings.<Name>: [{ id, coordinates, readyAt: 0, createdAt: 0 }]`. Cave also needs `cave: { builtAt: 0, tier: 3, machines: { … } }`; `tier` ≠ 1 skips the tutorial.
  - Animals: `pigpen` / `barn` / `henHouse: { level, animals: { <id>: { … } } }`.
  - Level 11 is `bumpkin.experience: 10905`. Skills go in `bumpkin.skills` as rank numbers.
  - `__sflPreview.patch()` in the console returns the live state diff.

## Repo recipes

- **Updating a fork PR's branch.** `gh … update-branch` returns 403 when `main` changed a workflow file, because the gh token has no `workflow` scope. Push over SSH instead:
  1. `git fetch origin refs/pull/<n>/head:refs/remotes/pr/<n>`
  2. `git worktree add --detach <dir> pr/<n>`, then `cd <dir>`; the merge and push must run inside the worktree
  3. `git fetch origin main && git merge origin/main`
  4. `git push git@github.com:<owner>/sunflower-land.git HEAD:refs/heads/<headRefName>`

  This needs `maintainerCanModify`. Run prettier after resolving conflicts by hand.

- **Player docs** (`sunflower-land/docs`): a private repo that publishes the public docs.sunflower-land.com through GitBook.
  - Never name API source files or paths in it.
  - Navigation lives in `SUMMARY.md`. When a page moves, add a redirect to `.gitbook.yaml`.
  - Live URLs come from the nav headings, not from file paths, so check `/sitemap-pages.xml` for the real ones.
  - Only state numbers you've verified in code.
