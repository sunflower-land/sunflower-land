/**
 * Jest transformer calling esbuild directly, replacing `esbuild-runner/jest`.
 *
 * esbuild-runner's transform path funnels every file through its own disk cache
 * (`/tmp/esbuild-runner-cache`), which is shared across jest workers, keyed by
 * file PATH + mtime (not content), and written with a non-atomic
 * `fs.writeFileSync`. On a cold cache (every CI run), parallel workers race on
 * hot shared modules: a worker reading between the write's truncate and its
 * completion loads an EMPTY module, and the whole consuming test suite fails
 * with `TypeError: X is not a function`. Rerunning "fixed" it.
 *
 * Calling esbuild directly needs no disk cache of its own — jest's built-in
 * transform cache is content-keyed and written atomically.
 */
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const { transformSync } = require("esbuild");

const loaders = {
  ".js": "js",
  ".jsx": "jsx",
  ".ts": "ts",
  ".tsx": "tsx",
};

module.exports = {
  process(src, filename) {
    const { code } = transformSync(src, {
      format: "cjs",
      target: `node${process.version.slice(1)}`,
      loader: loaders[path.extname(filename)],
      sourcefile: filename,
      sourcemap: "inline",
      logLevel: "error",
    });
    return { code };
  },
};
