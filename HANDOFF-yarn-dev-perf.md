# Handoff: `yarn dev` slow on load

## Symptom (as reported)

"`yarn dev` is very slow on load." The user asked for investigation only, with no code changes yet.

## What was measured

Nothing was timed. `yarn install --frozen-lockfile --ignore-scripts` failed in the cloud container after about 1m52s.
The GitHub tarball dependency
`https://codeload.github.com/mikewesthad/javascript-astar/tar.gz/c0304b1...` returned `403 Forbidden`
through the sandbox proxy, so `vite` could not be started. **No timings exist yet.**

Static analysis was done instead. A small Node script followed static (non-`type`, non-dynamic)
`import`/`export ... from` statements from `src/main.tsx`, resolving the tsconfig path aliases
(`features/`, `lib/`, `assets/`, `components/`, `src/`).

| Metric (initial load, static imports from `src/main.tsx`) | Value |
| --- | --- |
| Source code modules reached | 2,154 of ~2,363 non-test `.ts/.tsx` files (~91% of the app) |
| Source code size reached | ~14 MB of TS/TSX |
| Asset modules (images etc.) imported | 2,004 (`src/features/game/types/images.ts` alone has 1,317 imports) |
| JSON imported | ~8 MB (all 11 translation dictionaries) |
| npm packages reached | 58 |

Import chains for heavy packages that are not needed to boot:

- **phaser**: `src/main.tsx` → `features/portal/PortalApp.tsx` → `features/portal/example/PortalExample.tsx` → `PortalExamplePhaser.tsx`.
  It is reached even when not in portal mode, because `PortalApp` is imported statically.
- **@aws-amplify/ui-react-liveness**: `Navigation.tsx` → `features/auth/Auth.tsx` → `auth/components/LoginSettings.tsx` → `island/hud/components/settings-menu/GameOptions.tsx` → `retreat/components/personhood/FaceRecognition.tsx`.
- **colyseus.js**: `Navigation.tsx` → `game/expansion/Game.tsx` → `game/components/SessionWatcher.tsx` → `social/hooks/useSocial.ts`.

## Root causes (suspected, not yet confirmed by timings)

Vite dev serves each module unbundled and transforms it on request. That makes the size of the
startup graph (over 4,000 requests) the main cost. On top of that, `vite.config.ts` has:

1. **React Compiler through Babel on every file in dev.** `@vitejs/plugin-react` with
   `babel: { plugins: ["babel-plugin-react-compiler"] }` runs over 2,000 files through Babel. This is
   probably the biggest transform cost.
2. **JSON named exports.** Vite's default `json.namedExports` creates an ES export for each key in
   the 650–970 KB dictionaries (`src/lib/i18n/dictionaries/*.json`). All 11 are imported eagerly by
   `src/lib/i18n/dictionaries/language.ts`.
3. **PWA service worker enabled in dev.** `VitePWA({ devOptions: { enabled: true } })` compiles
   `src/sw.ts` and puts a caching worker in front of the dev server. It can also serve stale files.
4. **No `optimizeDeps.include`.** Dependencies are discovered partway through the first load, which
   is likely to cause re-optimisation and a full page reload.
5. **Old tooling.** Vite `^5.4.2`, `vite-tsconfig-paths` `^3.3.17` (resolves imports on every
   request), `vite-plugin-html` `^2.1.2`.
6. **Only 3 `lazy()` routes in `src/Navigation.tsx`.** The dashboards (Economy, Flower, Retention,
   Chapter, Minigame, PlayerEconomyEditor), Marketplace, Builder, Cave and Interior are eager.

Minor: `set NODE_ENV=development &&` in the `package.json` scripts only works on Windows and does
nothing on macOS or Linux.

## What was changed

Nothing in the code. This file is the only addition.

## What was ruled out

Nothing has been ruled out with measurements yet. Notes:

- `vite-plugin-preload` and `minifyHtml` mainly affect builds and are probably not significant in dev (not verified).
- `SUNNYSIDE` (`src/assets/sunnyside.ts`) uses URL strings, not imports, so it is not a source of asset requests.

## What's left to do

1. **Get a baseline.** Run `yarn dev` locally and record the cold first-load time (empty
   `node_modules/.vite`) and the warm reload time. Also record the request count in the Network tab,
   whether the "new dependencies optimized, reloading" message appears, and the output of
   `DEBUG=vite:transform yarn dev` (or use `vite-plugin-inspect`) to see which plugins and files are slowest.
2. **Config-only experiments** (measure each one separately):
   - Run the React Compiler only for `vite build`, or limit it to some files.
   - `json: { stringify: true }`.
   - `VitePWA.devOptions.enabled: false`, or put it behind an env var.
   - `optimizeDeps.include` for the heavy packages (phaser, wagmi/viem, firebase, xstate, i18next, …),
     plus `server.warmup.clientFiles: ["./src/main.tsx", "./src/App.tsx"]`.
   - Replace `vite-tsconfig-paths` with plain `resolve.alias` entries.
3. **Code changes** (these also make the production bundle smaller):
   - Load only the active language's dictionary at startup and fetch the others when the user switches language.
   - Make the `PortalApp` import in `src/main.tsx` dynamic, and lazy-load `FaceRecognition` and `useSocial`/colyseus.
   - Lazy-load more routes in `src/Navigation.tsx`.
   - Longer term, split `src/features/game/types/images.ts`.
4. **Bigger options:** upgrade Vite, or finish the existing `rsbuild.config.ts` (`yarn rsbuild`). It
   still needs the React Compiler, PWA and path-alias setup. Rsbuild bundles in dev, so it avoids the
   4,000-request waterfall.
