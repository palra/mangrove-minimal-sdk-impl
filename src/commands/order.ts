import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";
import { builder as getMarketOptsBuilder } from "./log";

const builder = (args: yargs.Argv) =>
  getMarketOptsBuilder(args)
    .option("volume", { type: "number", demandOption: true, requiresArg: true })
    .option("limitPrice", {
      type: "number", // TODO: consider using string to avoid rounding errors
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

      const quoteAllowance = await market.quote.allowance();
      if (quoteAllowance.lt(volume)) {
        throw new Error(`Insufficent allowance for quote token`);
      }

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

      const orderResult = await result;
      console.log(orderResult);
    },
  });
}
