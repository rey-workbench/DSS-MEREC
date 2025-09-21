const typescript = require("@rollup/plugin-typescript");

module.exports = [
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
        rootDir: "src",
      }),
    ],
    external: [],
  },
  // ES Modules build
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.mjs",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.esm.json",
        declaration: false, // Already generated in CJS build
      }),
    ],
    external: [],
  },
];
