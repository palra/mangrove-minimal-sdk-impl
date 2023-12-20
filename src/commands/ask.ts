import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";
import { builder as getMarketOptsBuilder } from "./log";

const builder = (args: yargs.Argv) =>
  getMarketOptsBuilder(args)
    .option("wants", { type: "string", demandOption: true, requiresArg: true })
    .option("gives", { type: "string", demandOption: true, requiresArg: true });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `ask`,
    describe: "submit an on-the-fly ask offer",
    builder,
    async handler({ base, quote, tickSpacing, wants, gives }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      const directLP = await mgv.liquidityProvider(market);

      await (await market.base.approve(mgv.address, gives)).wait();

      const fund = await directLP.computeAskProvision();

      const { id } = await directLP.newAsk({
        wants,
        gives,
        fund,
      });

      console.log(
        `Ask [${id}] posted: requesting [${wants}] ${quote} for [${gives}] ${base}`
      );
    },
  });
}
