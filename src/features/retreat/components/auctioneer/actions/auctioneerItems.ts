import { AuctioneerItemName } from "features/game/types/auctioneer";
import { InventoryItemName } from "features/game/types/game";

export type AuctioneerItem = {
  id: number;
  tokenId: number;
  name: AuctioneerItemName;
  price?: number;
  ingredients: Record<InventoryItemName, number>;
  releaseDate: number;
  endDate: number;
  supply: number;
};

export function getValidAuctionItems(
  items: AuctioneerItem[]
): AuctioneerItem[] {
  const sortedUpcomingItemNames = items
    .filter((item) => {
      const now = Date.now();
      const endDate = item.endDate;

      console.log({ now: endDate && endDate > now });
      return endDate && endDate > now;
    })
    .sort((a, b) => a.releaseDate - b.releaseDate)
    .slice(0, 10);

  return sortedUpcomingItemNames;
}
