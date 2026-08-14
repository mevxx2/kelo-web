import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = process.cwd();
const exported = resolve(projectRoot, "out");
const destination = resolve(projectRoot, "dist");
const client = resolve(destination, "client");

if (!existsSync(exported)) {
  throw new Error("Static export was not created.");
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(client, { recursive: true });
cpSync(exported, client, { recursive: true });
mkdirSync(resolve(destination, "server"), { recursive: true });
cpSync(resolve(projectRoot, "worker", "server", "index.js"), resolve(destination, "server", "index.js"));
mkdirSync(resolve(destination, ".openai"), { recursive: true });
cpSync(resolve(projectRoot, ".openai", "hosting.json"), resolve(destination, ".openai", "hosting.json"));
