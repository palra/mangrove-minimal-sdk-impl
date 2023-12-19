import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";
import { builder as getMarketOptsBuilder } from "./log";

const builder = (args: yargs.Argv) =>
  getMarketOptsBuilder(args)
    .option("wants", { type: "number", demandOption: true, requiresArg: true })
    .option("gives", { type: "number", demandOption: true, requiresArg: true });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `ask`,
    describe: "submit an on-the-fly ask offer",
    builder,
    async handler({ base, quote, tickSpacing, wants, gives }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      // 1. Create LP
      const directLP = await mgv.liquidityProvider(market);

      // 2. Approve spending
      {
        const tx = await market.base.approve(mgv.address, wants);
        const receipt = await tx.wait();
        if (receipt.status !== 1) {
          console.error(receipt);
          throw new Error("Approve transaction failed");
        }
      }

      const fund = await directLP.computeAskProvision();

      const { id } = await directLP.newAsk({
        wants,
        gives,
        fund,
      });

      console.log(`Ask #[${id}] posted`);
    },
  });
}
