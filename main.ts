// The Worst App Idea Ever Pitched — make.fun entry
// One sentence, at most 240 characters, pitching the worst app imaginable:
// FridgeFanfare — a standing ovation for opening your fridge.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch, split into named parts so each clause earns its place.
const HOOK = "Meet FridgeFanfare, the app that plays a standing ovation";
const PROMISE =
  "every time you open your fridge, so your midnight snacking finally gets the recognition it deserves";
const PRICE =
  "for just five dollars a month, with premium applause available for leftovers";

function buildLine(): string {
  return `${HOOK} ${PROMISE}, ${PRICE}.`;
}

type GateReport = { codePoints: number; singleSentence: boolean; nonWhitespace: boolean };

function validateEntry(entry: string): GateReport {
  const codePoints = [...entry].length;
  const sentences = entry.split(".").filter((s) => s.trim());
  return {
    codePoints,
    singleSentence: sentences.length === 1,
    nonWhitespace: entry.trim().length > 0,
  };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8").replace(/\n$/, "");
  if (written !== expected) {
    throw new Error("verification failed: written entry differs");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

const ENTRY = buildLine();
const report = validateEntry(ENTRY);
if (report.codePoints < 1 || report.codePoints > 240) {
  throw new Error(`gate failed: ${report.codePoints} code points, need 1-240`);
}
if (!report.nonWhitespace) throw new Error("gate failed: entry is only whitespace");
if (!report.singleSentence) throw new Error("gate failed: entry must be exactly one sentence");

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

const sha = verifyWritten(outPath, ENTRY);
console.log(
  `wrote ${outPath} (${report.codePoints} code points, sha256 ${sha}), verified: ${JSON.stringify(ENTRY)}`,
);
