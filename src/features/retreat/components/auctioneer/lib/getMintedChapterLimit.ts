import { Auction } from "features/game/lib/auctionMachine";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  InventoryItemName,
  Auctioneer,
  AuctionNFT,
} from "features/game/types/game";
import { getCurrentChapter } from "features/game/types/chapters";

export function getMintedChapterLimit(
  auctioneer: Auctioneer,
  auction: Auction,
  item: InventoryItemName | BumpkinItem | AuctionNFT,
  now: number,
) {
  const currentChapter = getCurrentChapter(now);
  const { chapterLimit } = auction;

  const countMinted = auctioneer.minted?.[currentChapter]?.[item] ?? 0;

  return countMinted >= chapterLimit;
}
