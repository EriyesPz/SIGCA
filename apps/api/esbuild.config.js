import nodeExternalsPlugin from "esbuild-plugin-node-externals";
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));