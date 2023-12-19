import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";

const BASE = "base";
const QUOTE = "quote";
const TICK_SPACING = "tickSpacing";

export const builder = (args: yargs.Argv) =>
  args
    .positional(BASE, { type: "string", demandOption: true })
    .positional(QUOTE, { type: "string", demandOption: true })
    .positional(TICK_SPACING, { type: "number", default: 1 });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `log <${BASE}> <${QUOTE}> [${TICK_SPACING}]`,
    describe: "log current asks and bids on a given market",
    builder,
    async handler({ base, quote, tickSpacing }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      market.consoleAsks();
      market.consoleBids();
    },
  });
}
