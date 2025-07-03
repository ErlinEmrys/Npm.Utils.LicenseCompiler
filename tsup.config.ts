import { defineConfig } from "tsup";

export default defineConfig(
	{
		entry: [ "src/Cli.ts" ],
		format: [ "esm" ],
		target: "node18",
		outDir: "dist",
		clean: true,
		sourcemap: true,
		minify: false,
		splitting: false,
		bundle: true,
		dts: true,
		shims: true,
		banner: { js: "#!/usr/bin/env node" },
		external: [ "commander" ],
	},
);
