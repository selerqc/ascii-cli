import Vorpal from "vorpal";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import chalk from "chalk";



import { colors } from "./utils/constants.js";
const vorpal = new Vorpal();

async function printWelcomeText() {
  const text = await figlet.text("I Use ahh BTW");
  vorpal.log(text);
  vorpal.log('Type "help" for commands.')
}

const asciiDir = path.join(process.cwd(), "ascii");
const asciiFiles = fs.readdirSync(asciiDir).map(file => file.replace('.txt', ''));


vorpal
  .command("ascii --show <name>", "Shows an ascii art.")
  .autocomplete(asciiFiles)
  .action(async (args, callback) => {
    const filePath = path.join(asciiDir, `${args.name}.txt`);
    const art = fs.readFileSync(filePath, "utf8");
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    vorpal.log(chalk[randomColor](art));

    callback();
  });

vorpal
  .command('ascii --list-logos', 'Shows All Available Logos.')
  .alias('--ll')
  .action(function (_args, callback) {
    asciiFiles.forEach((name) => {
      vorpal.log(name);
    });
    callback();
  });

vorpal
  .command('ascii --print-logos', 'Print All Available Logos.')
  .alias('--pl')
  .action(function (_args, callback) {
    let colorIndex = 0;
    asciiFiles.forEach((name) => {
      const filePath = path.join(asciiDir, `${name}.txt`);
      const art = fs.readFileSync(filePath, "utf8");
      const color = colors[colorIndex % colors.length];
      vorpal.log(chalk[color](`${name}:\n`+art));
      colorIndex++;
    });

    callback();
  });
vorpal
  .command('clear', 'Clears the terminal.')
  .alias('c')
  .action(function (_args, callback) {
    console.clear();
    callback();
  });

vorpal.delimiter("ascii$").show();

printWelcomeText();