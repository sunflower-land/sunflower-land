# PR previews

Every pull request against `main` gets a throwaway, UI-only deployment of the
game plus a handful of LLM-drafted test scenarios, each a link that opens the
preview with a specific game state already loaded. The point is to let
maintainers and community testers click through a contributor's change
without running their code locally.

A preview comment looks like this:

> **https://sunflower-land-ci-preview.s3.us-east-1.amazonaws.com/pr-7730/index.html**
> — UI-only build of `a1b2c3d` (no server, offline farm).
>
> 1. **[Hungry chicken, one Hen House](…)** — exercises the new feed check.
>    1. Open the Hen House
>    2. Feed the chicken with Hay
>    3. Expect the hunger bubble to disappear

## How it works

```
pull_request ──► Preview build (no secrets) ──► artifact: preview-dist + preview-meta
                                                        │
                                       workflow_run (main's code, secrets)
                                                        ▼
                      Preview deploy ─► verify PR ─► aws s3 sync → s3://sunflower-land-ci-preview/pr-N/
                                     ─► Codex reads diff via `git show` ─► scenarios.json
                                     ─► validate + build links ─► sticky PR comment
pull_request_target: closed ──► Preview cleanup ─► aws s3 rm pr-N/ --recursive
```

| Piece                                     | What it does                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/preview-build.yml`     | Builds the PR with `VITE_API_URL` unset (ART_MODE) and uploads `preview-dist` as an artifact. Runs with no secrets and a read-only token.                    |
| `.github/workflows/preview-deploy.yml`    | Runs from `main` on `workflow_run`. Verifies the PR, syncs the artifact to `pr-N/` in the preview S3 bucket, runs the scenario generator, posts the comment. |
| `.github/workflows/preview-cleanup.yml`   | Deletes the `pr-N/` prefix when the PR closes.                                                                                                               |
| `.github/preview/scenarios.prompt.md`     | The prompt Codex receives. `{{PR_NUMBER}}`, `{{HEAD_SHA}}`, `{{MERGE_BASE}}`, `{{REPOSITORY}}` are substituted at run time.                                  |
| `.github/preview/scenarios.schema.json`   | JSON schema the model's output must match.                                                                                                                   |
| `_scripts/preview/buildPreviewComment.ts` | Validates scenarios against main's item lists and the patch format, builds every URL, renders the comment markdown.                                          |
| `src/features/game/lib/preview/`          | The client side: URL params → fixture + patch → `GameState`, plus the `__sflPreview` console helper.                                                         |

## Shaping the state from the URL

The preview is an ART_MODE build: there is no API, auth starts connected and
the farm comes from `landData.ts`. The URL can change that farm. Parameters
go in the normal query string, **before** the hash route:

```
https://<preview>/?fixture=test&patch=<base64url json>&ls=<base64url json>#/world/plaza
```

| Param     | Meaning                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fixture` | Base farm: `default`, `new` (`INITIAL_FARM`), `test` (`TEST_FARM`, what unit tests use), `static` (`landDataStatic.ts`), or an island name `basic` … `marble` (fully expanded via `getDynamicIsland`).                                                        |
| `patch`   | Partial `GameState` deep-merged over the fixture. Base64url-encoded JSON, or raw JSON. Objects merge, arrays replace, `null` deletes a key. Numbers merged over a `Decimal` (inventory, balance…) become Decimals, as do new keys in a Decimal-valued record. |
| `ls`      | JSON object of localStorage keys to seed before boot.                                                                                                                                                                                                         |
| `intro=1` | Keep the one-off boot modals (Terms & Conditions, welcome bonus, Pumpkin Pete intro, VIP promo). By default any preview param skips them so the tester lands on the farm.                                                                                     |

Any string value can be a **relative time token**, resolved when the page
loads, so a link that means "chicken fed two hours ago" keeps meaning that
next week:

- `$now`, `$now-2h`, `$now+30m`, `$now-1.5d` → epoch milliseconds
- `$date`, `$date-1d` → ISO-8601 string (for localStorage dates)
- units: `ms`, `s`, `m`, `h`, `d`, `w`

Example patch, before encoding:

```json
{
  "inventory": { "Hen House": 1, "Hay": 5 },
  "henHouse": {
    "animals": { "0": { "state": "idle", "awakeAt": "$now-2h" } }
  }
}
```

Only the ART_MODE branch of the game machine reads these params; a real
session ignores them entirely.

### Sharing the state you are looking at

In any ART_MODE build (local dev without `VITE_API_URL` included) the console
exposes:

```js
__sflPreview.link(); // URL reproducing the current state (diff vs. the fixture)
__sflPreview.patch(); // just the patch object
await __sflPreview.copy(); // link → clipboard
```

Click into an interesting state, copy the link, paste it on the PR.

## The scenario generator

`preview-deploy.yml` fetches the PR head into `refs/preview/pr-head` (never
checked out), writes the diff and changed-file list to `.preview/`, and runs
`openai/codex-action` with `scenarios.prompt.md`. The model reads PR files
through `git show`, mines the PR's own unit tests for state setups, and
answers with JSON matching the schema: a summary plus up to six scenarios of
`{ title, why, route, fixture, patch, localStorage?, steps }`.

`buildPreviewComment.ts` then:

- drops a scenario on hard problems: bad shape, bad route, oversized patch,
  malformed `$` token, patch that cannot be applied, unknown fixture;
- keeps it with a ⚠️ on soft problems: unknown item / wearable name or
  unknown top-level state key, since the PR may be introducing them;
- builds every URL itself. The model never emits URLs, so a prompt injection
  in the PR body can at worst produce a silly scenario.

The step uses `continue-on-error`; if the model fails the comment still
carries the bare preview link. The raw `scenarios.json`, rendered prompt and
comment are uploaded as the `preview-scenarios-<pr>` artifact for debugging.

To tune the output, edit the prompt. Useful levers so far: the fixture
descriptions, the "mine the tests" instruction, the spread rule
(minimal / stressed / edge), and the scene-name hint for routes.

## Threat model

Contributors' code is treated as hostile. The design holds because:

1. **Secrets never meet PR code.** The build runs on `pull_request`, where
   GitHub removes secrets and the token is read-only. The PR's vite config,
   plugins and `postinstall` scripts run there and can steal nothing.
2. **The deploy job executes nothing from the PR.** It runs `main`'s workflow
   file, strips symlinks from the artifact, and syncs the rest to S3 as inert
   static files. The `pr-N/` prefix is derived from the PR number only after
   the artifact's metadata has been cross-checked against the GitHub API (PR
   head == run head == metadata head, PR open, targets `main` in this repo),
   so one PR can never overwrite another's preview, let alone testnet.
3. **Previews live on a different origin from the game.** The bucket's
   `*.s3.us-east-1.amazonaws.com` hostname shares no cookies or
   localStorage with sunflower-land.com, so a malicious preview cannot read a
   tester's real session. ART_MODE has no token anyway. All PR previews do
   share the bucket origin with each other, which only matters for
   localStorage leftovers between previews.
4. **The LLM sees PR content as data.** Codex gets the diff and PR body as
   files, is told they are untrusted, and its only output is validated JSON
   that becomes links on our own domain. `allow-users: "*"` is needed because
   the triggering actor is the PR author; it is acceptable because nothing
   from the PR is executed in that job.
5. **First-time contributors still need approval.** GitHub's "require approval
   for first-time contributors" setting gates the `pull_request` build, so a
   human has looked at the PR before any runner touches it.

## Setup

Secrets in the `develop` environment (all already present for the testnet
deploy and Codex review):

- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` with read/write/delete on the
  preview bucket
- `OPENAI_API_KEY`

One S3 bucket, created by hand. The name and region are the `PREVIEW_BUCKET`
/ `AWS_REGION` env values at the top of `preview-deploy.yml` and
`preview-cleanup.yml`:

- Bucket `sunflower-land-ci-preview` in `us-east-1`.
- Public read for objects: turn off "Block public access" and attach

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadPreviews",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::sunflower-land-ci-preview/pr-*/*"
      }
    ]
  }
  ```

- No static-website hosting needed: links use the HTTPS REST endpoint and
  name `index.html` explicitly, and the app is a HashRouter built with
  `base: "./"`, so deep links never need a rewrite.
- Optional safety net: a lifecycle rule expiring objects after ~14 days, in
  case a cleanup run fails.

## Running the pieces locally

```bash
# Try the validator on a hand-written scenarios file
NODE_PATH=./src NODE_ENV=metadata yarn vite-node --project metadata/node.tsconfig.json \
  _scripts/preview/buildPreviewComment.ts \
  --scenarios scenarios.json --base http://localhost:3000/ --pr 0 --out comment.md
```

With `VITE_API_URL` commented out in `.env`, `yarn dev` is itself an ART_MODE
build, so `http://localhost:3000/?fixture=spring&patch=…` behaves exactly like
a preview link.
