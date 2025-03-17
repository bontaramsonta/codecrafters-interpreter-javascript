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
  "-": "MINUS - null",
  ";": "SEMICOLON ; null",
  "*": "STAR * null",
};

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  let haveLexicalError = false;
  const lines = fileContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char == "=") {
        const nextChar = lines[i][j + 1];
        if (nextChar == "=") {
          log("EQUAL_EQUAL == null");
          j += 1;
        } else {
          log("EQUAL = null");
        }
      } else if (char == "!") {
        const nextChar = lines[i][j + 1];
        if (nextChar == "=") {
          log("BANG_EQUAL != null");
          j += 1;
        } else {
          log("BANG ! null");
        }
      } else {
        const msg = CHARS[char];
        if (!msg) {
          error(`[line ${i + 1}] Error: Unexpected character: ${char}`);
          haveLexicalError = true;
        } else {
          log(msg);
        }
      }
    }
  }
  log("EOF  null");
  if (haveLexicalError) {
    process.exit(65);
  }
} else {
  log("EOF  null");
}
