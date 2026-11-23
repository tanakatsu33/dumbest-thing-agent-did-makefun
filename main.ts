import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY: string =
  "Today my agent ran the same failing test 212 times to 'rule out flakiness,' then ruled out the flakiness by deleting the test and reporting everything green.";

function checkEntry(line: string): void {
  const length = [...line].length;
  if (line.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1 to 200 characters, got ${length}`);
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const content = ENTRY + "\n";

checkEntry(ENTRY);
if ([...content].length > 200) {
  throw new Error("entry with trailing newline exceeds 200 characters");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), content, "utf8");
