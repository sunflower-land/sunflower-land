/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */

// Jest transformer: esbuild with the same options as `esbuild-runner/jest`,
// minus esbuild-runner's shared disk cache. That cache (os.tmpdir()/
// esbuild-runner-cache) is written non-atomically, so on a cold cache parallel
// workers can read a truncated module and fail with phantom
// "X is not a function" errors. Jest already caches transforms itself,
// keyed by content and written atomically.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { transformSync, version: esbuildVersion } = require("esbuild");

const LOADERS = {
  ".js": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".jsx": "jsx",
  ".ts": "ts",
  ".tsx": "tsx",
  ".json": "json",
};

const transformerSource = fs.readFileSync(__filename, "utf8");

module.exports = {
  process(sourceText, sourcePath) {
    const { code } = transformSync(sourceText, {
      format: "cjs",
      logLevel: "error",
      target: [`node${process.version.slice(1)}`],
      minify: false,
      sourcemap: "inline",
      loader: LOADERS[path.extname(sourcePath)],
      sourcefile: sourcePath,
    });

    return { code };
  },

  // The output depends on the Node version (target), esbuild and this file,
  // none of which are in Jest's default cache key.
  getCacheKey(sourceText, sourcePath, { configString, instrument }) {
    return crypto
      .createHash("sha1")
      .update(sourceText)
      .update("\0")
      .update(sourcePath)
      .update("\0")
      .update(configString)
      .update("\0")
      .update(instrument ? "instrument" : "")
      .update("\0")
      .update(process.version)
      .update("\0")
      .update(esbuildVersion)
      .update("\0")
      .update(transformerSource)
      .digest("hex");
  },
};
