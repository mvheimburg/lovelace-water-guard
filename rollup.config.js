import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
export default {
  input: "src/water-guard-card.ts",
  output: {
    file: "dist/water-guard-card.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.build.json" }),
  ],
};
