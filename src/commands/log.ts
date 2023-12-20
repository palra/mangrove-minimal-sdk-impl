import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";

export const BASE = "base";
export const QUOTE = "quote";
export const TICK_SPACING = "tickSpacing";

export const builder = (args: yargs.Argv) =>
  args
    .option(BASE, {
      type: "string",
      alias: "b",
      demandOption: true,
      requiresArg: true,
    })
    .option(QUOTE, {
      type: "string",
      alias: "q",
      demandOption: true,
      requiresArg: true,
    })
    .option(TICK_SPACING, { type: "number", default: 1, requiresArg: true });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `log`,
    describe: "log current asks and bids on a given market",
    builder,
    async handler({ base, quote, tickSpacing }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      market.consoleAsks();
    },
  });
}
