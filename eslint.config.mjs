import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  // Old hosting build folders are generated artifacts, not site source.
  globalIgnores([".next/**", ".open-next/**", ".wrangler/**", "dist/**", "out/**", "node_modules/**"]),
]);
