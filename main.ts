import { chmodSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Internet in One Word (make.fun: u-ronigrv-the-internet-in-one-word-e388f33b)
// One word for the whole internet. The internet is feral: wild, untamed,
// unmoderated by nature, and impossible to house-train. It makes you laugh,
// then nod.
const WORD = "feral";

// Self-check the competition gate before writing: UTF-8 text of 1 to 30
// characters, not only white space. Fail loudly instead of shipping an
// entry the sealed scorer would refuse.
if (WORD.length < 1 || WORD.length > 30 || !WORD.trim()) {
  throw new Error(`entry word fails the 1-30 character gate: ${JSON.stringify(WORD)}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

// Create the output directory if needed, then clear only its contents.
// Never remove the directory itself: the grader mounts it and removing it
// fails the run with EPERM.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, WORD, { mode: 0o644 });
// Force 0644 explicitly: the mode passed to writeFileSync is masked by the
// process umask, so a strict umask would otherwise leave the file 0640.
chmodSync(entryPath, 0o644);
