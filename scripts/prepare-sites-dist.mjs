import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const exported = resolve(projectRoot, "out");
const destination = resolve(projectRoot, "dist");

if (!existsSync(exported)) {
  throw new Error("Static export was not created.");
}

rmSync(destination, { recursive: true, force: true });
cpSync(exported, destination, { recursive: true });
