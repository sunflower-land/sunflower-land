import type { Auction } from "features/game/lib/auctionMachine";
import type { BumpkinItem } from "features/game/types/bumpkin";
import type { InventoryItemName, AuctionNFT } from "features/game/types/game";

export function getAuctionItemType(
  auction: Auction,
): InventoryItemName | BumpkinItem | AuctionNFT {
  if (auction.type === "nft") return auction.nft;

  if (auction.type === "collectible") return auction.collectible;

  return auction.wearable;
}
