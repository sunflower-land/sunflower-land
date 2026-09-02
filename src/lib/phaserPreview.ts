/**
 * True for the preview deployment built with `--base=/phaser/` and served at
 * sunflower-land.com/phaser/ (see docs/phaser-farm-migration/). BASE_URL is
 * baked in at build time, so /play and local dev builds are unaffected.
 */
export const isPhaserPreviewBuild = import.meta.env.BASE_URL === "/phaser/";

/**
 * Pathname used to scope per-deployment localStorage keys (JWTs, wallet
 * sessions, pending transactions). The /phaser preview maps to "/play/" so it
 * shares the logged-in session and pending state with the production client
 * instead of demanding a fresh login.
 */
export const storagePathname = isPhaserPreviewBuild
  ? "/play/"
  : window.location.pathname;
