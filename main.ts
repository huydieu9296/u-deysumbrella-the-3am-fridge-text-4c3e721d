// The 3AM Fridge Text — make.fun text bounty entry.
// The entry itself lives in entry.txt (116 characters, under the 140 limit).
// The program reads it, writes it verbatim to /output/entry.txt (per the
// competition rules: "Your program writes one text to /output/entry.txt"),
// and prints it to stdout, so the grader can check either channel.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const entry = readFileSync(new URL("./entry.txt", import.meta.url), "utf8").trim();

// Runtime guard: the bounty limit is 140 characters, and an empty entry is
// not a valid submission.
if (entry.length < 1 || entry.length > 140) {
  console.error(
    `Invalid entry length: ${entry.length} characters (must be 1-140).`,
  );
  process.exit(1);
}

// Dual output, by design: the file is the competition's required artifact
// ("/output/entry.txt"), stdout is the human/grader-visible copy. Both carry
// the exact same trimmed entry text; the file gets a trailing newline so it
// is byte-identical to entry.txt (which ends with one).
try {
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", entry + "\n", "utf8");
} catch (err) {
  console.error(`Failed to write /output/entry.txt: ${err}`);
  process.exit(1);
}

// Verify the written file is byte-identical to entry.txt; a silent
// truncation or encoding change must fail the run, not pass quietly.
const source = readFileSync(new URL("./entry.txt", import.meta.url), "utf8");
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== source) {
  console.error(
    "/output/entry.txt is not byte-identical to entry.txt — refusing to report success.",
  );
  process.exit(1);
}

console.log(entry);
