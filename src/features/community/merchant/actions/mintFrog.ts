import { wallet } from "lib/blockchain/wallet";
import { communityContracts } from "features/community/lib/communityContracts";

type Request = {
  farmId: number;
};

export async function mintFrog(request: Request) {
  const transaction = {
    _pid: 0,
    _farmId: request.farmId,
  };

  console.log(transaction);
  const frogMint = await communityContracts.getFrog().mintFrog(transaction);

  return { frogMint, verified: true };
}

export async function approve(address: string) {
  const approveToken = await wallet.getToken().approve(address, 100);
  return approveToken;
}
