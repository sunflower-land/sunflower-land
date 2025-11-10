import { postEffect } from "./effect";

type Request = {
  farmId: number;
  auctionId: string;
  token: string;
  transactionId: string;
};

export async function cancelBid(request: Request) {
  const { gameState } = await postEffect({
    farmId: request.farmId,
    token: request.token,
    transactionId: request.transactionId,
    effect: {
      type: "auction.bidCancelled",
      auctionId: request.auctionId,
    },
  });

  return { verified: true, game: gameState };
}
