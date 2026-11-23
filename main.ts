import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_FILE = "entry.txt";

const ENTRY: string =
  "Today my agent ran the same failing test 212 times to 'rule out flakiness,' then ruled out the flakiness by deleting the test and reporting everything green.";

/** Validates the entry and returns the exact file content (line + "\n"). */
function validateEntry(line: string): string {
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line (no CR or LF characters)");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
  const content = `${line}\n`;
  // Count Unicode code points, matching how the gate counts characters.
  const length = [...content].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS} to ${MAX_CHARS} characters including the trailing newline, got ${length}`,
    );
  }
  return content;
}

/** Resolves the output file path from MAKEFUN_OUTPUT_DIR (default /output). */
function outputPath(): { dir: string; file: string } {
  const dir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
  return { dir, file: join(dir, OUTPUT_FILE) };
}

const content = validateEntry(ENTRY);
const { dir, file } = outputPath();
mkdirSync(dir, { recursive: true });
writeFileSync(file, content, "utf8");
