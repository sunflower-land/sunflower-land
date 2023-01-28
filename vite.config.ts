import { defineConfig, loadEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyHtml, injectHtml } from "vite-plugin-html";
import inject from "@rollup/plugin-inject";
import request from "request";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // grab the private images use and proxy path
  // and set it up for local development if env
  // vars are set up in devs local env file
  const { VITE_PRIVATE_IMAGE_URL, VITE_PRIVATE_IMAGE_PROXY } = loadEnv(
    mode,
    process.cwd()
  );

  const serverOptions = {};

  if (VITE_PRIVATE_IMAGE_PROXY) {
    serverOptions["server"] = {
      proxy: {
        [VITE_PRIVATE_IMAGE_PROXY]: {
          target: VITE_PRIVATE_IMAGE_URL,
          changeOrigin: true,
          secure: false,
          selfHandleResponse: true,
          rewrite: (path) => {
            console.log(
              path.replace(VITE_PRIVATE_IMAGE_PROXY, VITE_PRIVATE_IMAGE_URL)
            );
            return path.replace(
              VITE_PRIVATE_IMAGE_PROXY,
              VITE_PRIVATE_IMAGE_URL
            );
          },
          configure: (proxy, _options) => {
            // log error in node console for debugging
            proxy.on("error", (err) => {
              console.log("Proxy error", err);
            });

            // manually request the image from the testnet
            // private image server and pipe it to the client
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log(
                "Sending proxied image request:",
                req.method,
                req.url
              );
              return request(req.url).pipe(res);
            });

            // log the server url and status code for retrieved
            // response from private image server for debugging
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log(
                "Received response image server:",
                res.statusCode,
                req.url
              );
            });
          },
        },
      },
    };
  }

  return {
    ...serverOptions,
    plugins: [
      reactRefresh(),
      tsconfigPaths(),
      minifyHtml(),
      injectHtml({
        // TODO with API environment variables
        injectData: {},
      }),
    ],
    // Addresses web3 issue
    resolve: {
      alias: {
        web3: "web3/dist/web3.min.js",
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
      },
    },
    css: {
      modules: {},
    },
    base: "./",
    build: {
      chunkSizeWarningLimit: 1000,
      assetsDir: "assets",
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        plugins: [inject({ Buffer: ["buffer", "Buffer"] })],
      },
    },
  };
});
