import { setTimeout } from "timers/promises";
import yargs from "yargs";
import { getMangroveInstance, wallet } from "../mangrove";

const builder = (args: yargs.Argv) =>
  args
    .option("setMaxAllowance", { type: "boolean", default: false })
    .option("watch", { type: "boolean", default: false })
    .positional("symbols", { type: "string", array: true, demandOption: true });

export default function registerCommand(_y: typeof yargs) {
  return _y.command({
    command: `coin [symbols...]`,
    describe: "outputs wallet information on a given token",
    builder,
    async handler({ symbols, setMaxAllowance, watch }) {
      do {
        if (watch) {
          console.log("\x1b[2J");
        }

        const mgv = await getMangroveInstance();

        const { address } = wallet;

        for (const symbol of symbols) {
          const token = await mgv.token(symbol);

          if (setMaxAllowance) {
            await token.increaseApproval(mgv.address, {
              amount: "9999999999999",
              overrides: {},
            });
          }

          console.log({
            symbol,
            balance: await token.balanceOf(address),
            mgvAllowance: await token.allowance({
              owner: address,
              spender: mgv.address,
            }),
          });
        }

        if (watch) {
          await setTimeout(1000);
        }
      } while (watch);
    },
  });
}
