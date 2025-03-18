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

const IGNORE_TOKENS = {
  " ": 1,
  "\t": 1,
};
const IGNORE_DOUBLE_CHAR_TOKENS = {
  "//": 1,
};
const STRING_LITERAL_MODE_TOKENS = {
  '"': 1,
};
const NUMBER_LITERAL_MODE_TOKENS = {
  ["0"]: 1,
  ["1"]: 1,
  ["2"]: 1,
  ["3"]: 1,
  ["4"]: 1,
  ["5"]: 1,
  ["6"]: 1,
  ["7"]: 1,
  ["8"]: 1,
  ["9"]: 1,
  ".": 1,
};

const fileContent = fs.readFileSync(filename, "utf8");
// const fileContent = "6317.4493";

if (fileContent.length !== 0) {
  let haveLexicalError = false;
  const lines = fileContent.split("\n");
  outer: for (let i = 0; i < lines.length; i++) {
    let inStringLiteralMode = false;
    let inNumberLiteralMode = false;
    let literalAccumulator = "";

    inner: for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      const twoChar = char + lines[i][j + 1];
      if (inNumberLiteralMode) {
        if (NUMBER_LITERAL_MODE_TOKENS[char]) {
          literalAccumulator += char;
        }
        if (j == lines[i].length - 1 || !NUMBER_LITERAL_MODE_TOKENS[char]) {
          // edge case
          if (literalAccumulator == ".") {
            log("DOT . null");
            continue inner;
          }
          log(
            `NUMBER ${literalAccumulator} ${Number(
              literalAccumulator,
            ).toLocaleString("en", {
              useGrouping: false,
              minimumFractionDigits: 1,
              maximumFractionDigits: 4,
            })}`,
          );
          inNumberLiteralMode = false;
          literalAccumulator = "";
          if (!NUMBER_LITERAL_MODE_TOKENS[char]) {
            j -= 1; // run the same char again
          }
        }
      } else if (inStringLiteralMode) {
        if (STRING_LITERAL_MODE_TOKENS[char]) {
          log(`STRING \"${literalAccumulator}\" ${literalAccumulator}`);
          inStringLiteralMode = false;
          literalAccumulator = "";
        } else {
          literalAccumulator += char;
        }
      } else if (IGNORE_DOUBLE_CHAR_TOKENS[twoChar]) {
        continue outer;
      } else if (!inStringLiteralMode && STRING_LITERAL_MODE_TOKENS[char]) {
        inStringLiteralMode = true;
      } else if (!inNumberLiteralMode && NUMBER_LITERAL_MODE_TOKENS[char]) {
        inNumberLiteralMode = true;
        literalAccumulator += char;
      } else if (IGNORE_TOKENS[char]) {
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
      haveLexicalError = true;
    }
  }
  log("EOF  null");
  if (haveLexicalError) {
    process.exit(65);
  }
} else {
  log("EOF  null");
}
