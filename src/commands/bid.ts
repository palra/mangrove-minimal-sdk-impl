import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";
import { builder as getMarketOptsBuilder } from "./log";

const builder = (args: yargs.Argv) =>
  getMarketOptsBuilder(args)
    .option("wants", { type: "string", demandOption: true, requiresArg: true })
    .option("gives", { type: "string", demandOption: true, requiresArg: true });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `bid`,
    describe: "submit an on-the-fly bid offer",
    builder,
    async handler({ base, quote, tickSpacing, wants, gives }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      const directLP = await mgv.liquidityProvider(market);

      await (await market.quote.approve(mgv.address, wants)).wait();

      const fund = await directLP.computeBidProvision();

      const { id } = await directLP.newBid({
        wants,
        gives,
        fund,
      });

      console.log(
        `Bid [${id}] posted: requesting [${gives}] ${quote} for [${wants}] ${base}`
      );
    },
  });
}
