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

const SINGLE_CHAR_TOKENS = {
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
  "=": "EQUAL = null",
  "!": "BANG ! null",
  ">": "GREATER > null",
  "<": "LESS < null",
  "/": "SLASH / null",
};

const DOUBLE_CHAR_TOKENS = {
  "==": "EQUAL_EQUAL == null",
  "!=": "BANG_EQUAL != null",
  ">=": "GREATER_EQUAL >= null",
  "<=": "LESS_EQUAL <= null",
};

const IGNORE_TOKENS = [" ", "\t"];
const IGNORE_DOUBLE_CHAR_TOKENS = ["//"];
const STRING_LITERAL_MODE_TOKENS = ['"'];

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  let haveLexicalError = false;
  const lines = fileContent.split("\n");
  outer: for (let i = 0; i < lines.length; i++) {
    let inStringLiteralMode = false;
    let literalAccumulator = "";

    inner: for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      const twoChar = char + lines[i][j + 1];
      if (inStringLiteralMode) {
        if (STRING_LITERAL_MODE_TOKENS.includes(char)) {
          log(`STRING \"${literalAccumulator}\" ${literalAccumulator}`);
          inStringLiteralMode = false;
          literalAccumulator = "";
          continue inner;
        }
        literalAccumulator += char;
      } else if (IGNORE_DOUBLE_CHAR_TOKENS.includes(twoChar)) {
        continue outer;
      } else if (
        !inStringLiteralMode &&
        STRING_LITERAL_MODE_TOKENS.includes(char)
      ) {
        inStringLiteralMode = true;
      } else if (IGNORE_TOKENS.includes(char)) {
        continue inner;
      } else if (DOUBLE_CHAR_TOKENS[twoChar]) {
        log(DOUBLE_CHAR_TOKENS[twoChar]);
        j += 1;
      } else if (SINGLE_CHAR_TOKENS[char]) {
        log(SINGLE_CHAR_TOKENS[char]);
      } else {
        error(`[line ${i + 1}] Error: Unexpected character: ${char}`);
        haveLexicalError = true;
      }
    }
    if (inStringLiteralMode) {
      error(`[line ${i + 1}] Error: Unterminated string.`);
    }
  }
  log("EOF  null");
  if (haveLexicalError) {
    process.exit(65);
  }
} else {
  log("EOF  null");
}
