import { Auction } from "features/game/lib/auctionMachine";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  InventoryItemName,
  Auctioneer,
  AuctionNFT,
} from "features/game/types/game";
import { getCurrentSeason } from "features/game/types/seasons";

export function getMintedChapterLimit(
  auctioneer: Auctioneer,
  auction: Auction,
  item: InventoryItemName | BumpkinItem | AuctionNFT,
) {
  const currentChapter = getCurrentSeason();
  const { chapterLimit } = auction;

  const countMinted = auctioneer.minted?.[currentChapter]?.[item] ?? 0;

  return countMinted >= chapterLimit;
}
