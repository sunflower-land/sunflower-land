import { GoblinRetreatItemName } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";

export type Release = {
  releaseDate: number;
  endDate: number;
  supply: number;
  price: number;
  ingredients: {
    item: InventoryItemName;
    amount: number;
  }[];
};

export interface AuctioneerItem {
  name: GoblinRetreatItemName;
  tokenId: number;
  totalMinted?: number;
  price?: number;
  releases: Release[];
  currentRelease?: Release;
}

export type Item = {
  id: number;
  releases: Release[];
  name: GoblinRetreatItemName;
  totalMinted?: number;
};

export function getMaxSupply(releases: Release[]) {
  return releases.reduce((supply, release) => {
    supply += release.supply;

    return supply;
  }, 0);
}

export function getValidAuctionItems(items: Item[]): AuctioneerItem[] {
  const sortedUpcomingItemNames = items
    .filter((item) => item.releases.length)
    .filter((item) => {
      const now = Date.now();
      const { endDate } = item.releases[item.releases.length - 1];

      return endDate && endDate > now;
    })
    .sort((a, b) => a.releases[0].releaseDate - b.releases[0].releaseDate)
    .slice(0, 10);

  const upcomingItems = sortedUpcomingItemNames.map((item) => {
    const currentRelease = item.releases.find((release) => {
      const { endDate } = release;

      return endDate && endDate > Date.now();
    });

    return {
      name: item.name,
      tokenId: item.id,
      maxSupply: getMaxSupply(item.releases),
      releases: item.releases,
      currentRelease,
      totalMinted: item.totalMinted,
    };
  });

  return upcomingItems;
}
