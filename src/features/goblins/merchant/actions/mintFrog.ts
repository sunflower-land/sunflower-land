import { metamask } from "lib/blockchain/metamask";

type Request = {
  farmId: number;
};

export async function mintFrog(request: Request) {
  const transaction = {
    _pid: 0,
    _farmId: request.farmId,
  };

  console.log(transaction);
  const frogMint = await metamask.getFrog().mintFrog(transaction);

  return { frogMint, verified: true };
}

export async function approve(address: string) {
  const approveToken = await metamask.getToken().approve(address, 100);
  return approveToken;
}
