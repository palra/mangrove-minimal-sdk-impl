import { configDotenv } from "dotenv";
configDotenv();

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { destroy } from "./mangrove";

import cmdList from "./commands/list";
import cmdLog from "./commands/log";
import cmdAsk from "./commands/ask";
import cmdBid from "./commands/bid";
import cmdBuy from "./commands/order";
import cmdCoin from "./commands/coin";

async function main() {
  const cli = yargs(hideBin(process.argv));

  [cmdList, cmdLog, cmdAsk, cmdBid, cmdBuy, cmdCoin].forEach((register) =>
    register(cli)
  );

  await cli.help().strictCommands().parseAsync();

  await destroy();
}

main();
