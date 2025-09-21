const typescript = require("@rollup/plugin-typescript");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const dts = require("rollup-plugin-dts");

module.exports = [
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        rootDir: "src",
      }),
    ],
    external: [],
  },
  // ES Modules build
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.esm.js",
      format: "es",
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.esm.json",
        declaration: false,
        rootDir: "src",
      }),
    ],
    external: [],
  },
  // UMD build for browsers
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.umd.js",
      format: "umd",
      name: "DSSMerec",
      exports: "named",
      sourcemap: false,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        rootDir: "src",
      }),
    ],
    external: [],
  },
  // TypeScript declarations
  {
    input: "src/index.ts",
    output: {
      file: "lib/index.d.ts",
      format: "es",
    },
    plugins: [dts.default()],
  },
];
