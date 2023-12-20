import Big from "big.js";
import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";
import { builder as getMarketOptsBuilder } from "./log";

const builder = (args: yargs.Argv) =>
  getMarketOptsBuilder(args)
    .option("volume", { type: "string", demandOption: true, requiresArg: true })
    .option("limitPrice", {
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("slippage", { type: "number", requiresArg: true, default: 2 });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `order`,
    describe: "fill an order",
    builder,
    async handler({ base, quote, tickSpacing, volume, limitPrice, slippage }) {
      const mgv = await getMangroveInstance();
      const market = await mgv.market({ base, quote, tickSpacing });

      const neededAllowance = Big(volume)
        .mul(limitPrice)
        .mul(Big(1).plus(Big(slippage).div(100)));

      await market.quote.approveIfHigher(mgv.address, {
        amount: neededAllowance,
        overrides: {},
      });

      const { response, result } = await market.buy({
        volume,
        limitPrice,
        slippage,
      });

      const receipt = await (await response).wait();
      if (receipt.status !== 1) {
        console.error(receipt);
        throw new Error("Order failed");
      }

      const { summary, successes } = await result;
      console.log(await result);
      console.log(`Gave [${summary.totalGave}] ${quote}`);
      console.log(`Got [${summary.totalGot}] ${base}`);
      console.log(`Offer used: [${successes.map((s) => s.offerId).join(",")}]`);
    },
  });
}
