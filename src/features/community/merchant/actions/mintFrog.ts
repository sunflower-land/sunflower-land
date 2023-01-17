import { wallet } from "lib/blockchain/wallet";
import { communityContracts } from "features/community/lib/communityContracts";
import { approveSFL } from "lib/blockchain/Token";

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
  const approveToken = await approveSFL(
    wallet.web3Provider,
    wallet.myAccount,
    address,
    100
  );
  return approveToken;
}
