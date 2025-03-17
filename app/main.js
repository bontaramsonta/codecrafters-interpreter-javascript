import { log } from "console";
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

const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  for (const line of fileContent.split("\n")) {
    for (const char of line.split("")) {
      switch (char) {
        case "(":
          log("LEFT_PAREN ( null");
          break;
        case ")":
          log("RIGHT_PAREN ) null");
          break;
        case "{":
          log("LEFT_BRACE { null");
          break;
        case "}":
          log("RIGHT_BRACE } null");
          break;
      }
    }
  }
  log("EOF  null");
} else {
  log("EOF  null");
}
