// Import the Mangrove API
import { Mangrove, ethers } from "@mangrovedao/mangrove.js";

const provider = new ethers.providers.WebSocketProvider(process.env.LOCAL_URL!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// ew, bad. No Singletons!
let _mangroveInstance: Mangrove | undefined;
export async function getMangroveInstance() {
  if (!_mangroveInstance) {
    _mangroveInstance = await Mangrove.connect({ signer: wallet });
  }

  return _mangroveInstance;
}

export async function destroy() {
  await provider.destroy();
}
