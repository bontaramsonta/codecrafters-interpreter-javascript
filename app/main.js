import { error, log } from "console";
import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

const filename = args[1];

const CHARS = {
  "(": "LEFT_PAREN ( null",
  ")": "RIGHT_PAREN ) null",
  "{": "LEFT_BRACE { null",
  "}": "RIGHT_BRACE } null",
  "*": "STAR * null",
  ".": "DOT . null",
  ",": "COMMA , null",
  "+": "PLUS + null",
  "*": "STAR * null",
};

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  for (const line of fileContent.split("\n")) {
    for (const char of line.split("")) {
      const msg = CHARS[char];
      if (!msg) {
        error(`UNKNOWN: ${char}`);
        process.exit(1);
      }
      log(msg);
    }
  }
  log("EOF  null");
} else {
  log("EOF  null");
}
