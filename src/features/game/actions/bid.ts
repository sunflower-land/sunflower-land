import { postEffect } from "./effect";

type Request = {
  farmId: number;
  auctionId: string;
  token: string;
  transactionId: string;
  tickets: number;
};

export async function bid(request: Request) {
  const { gameState } = await postEffect({
    farmId: request.farmId,
    token: request.token,
    transactionId: request.transactionId,
    effect: {
      type: "auction.bidPlaced",
      auctionId: request.auctionId,
      tickets: request.tickets,
    },
  });

  return { verified: true, game: gameState };
}
