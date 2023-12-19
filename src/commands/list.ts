import yargs from "yargs";
import { getMangroveInstance } from "../mangrove";

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: "list",
    describe: "list current markets",
    async handler() {
      const mgv = await getMangroveInstance();
      const openMarkets = await mgv.openMarkets();

      console.table(
        openMarkets.map((marketInfo) => ({
          base: marketInfo.base.id,
          quote: marketInfo.quote.id,
          tickSpacing: marketInfo.tickSpacing,
        }))
      );
    },
  });
}
