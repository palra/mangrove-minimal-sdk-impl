import { configDotenv } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { destroy } from "./mangrove";

import cmdList from "./commands/list";
import cmdLog from "./commands/log";

configDotenv();

async function main() {
  const cli = yargs(hideBin(process.argv));

  [cmdList, cmdLog].forEach((register) => register(cli));

  await cli.demandCommand().help().parseAsync();

  await destroy();
}

main();
