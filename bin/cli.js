#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const templateDir = resolve(__dirname, "..", "template");

const targetName = process.argv[2] ?? "my-lemon-agent";
const targetDir  = resolve(process.cwd(), targetName);

if (existsSync(targetDir)) {
  console.error(`\n✗ Directory "${targetName}" already exists. Pick a different name.\n`);
  process.exit(1);
}

console.log(`\n🍋 Scaffolding LemonCake agent in ./${targetName} ...\n`);

mkdirSync(targetDir, { recursive: true });
cpSync(templateDir, targetDir, { recursive: true });

// Rename template's gitignore (npm strips .gitignore from packages)
const gitignoreSrc = join(targetDir, "_gitignore");
const gitignoreDst = join(targetDir, ".gitignore");
if (existsSync(gitignoreSrc)) {
  cpSync(gitignoreSrc, gitignoreDst);
  try { rmSync(gitignoreSrc); } catch {}
}

// Stamp the project name into package.json
const pkgPath = join(targetDir, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = targetName.toLowerCase().replace(/[^a-z0-9-]/g, "-");
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log("✓ Files written");
console.log("\nNext:\n");
console.log(`  cd ${targetName}`);
console.log("  npm install");
console.log("  cp .env.example .env       # then paste your LEMON_CAKE_PAY_TOKEN");
console.log("  npm start");
console.log("\n📖 Get a token: https://lemoncake.xyz/dashboard");
console.log("🎁 GW2026: first $10 free with code  LCGW2026\n");
