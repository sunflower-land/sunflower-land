import { BumpkinShopItem } from "./items";

export const UNLIMITED_SUPPLY = 1000000;
export const MOCK_SHOP: BumpkinShopItem[] = [
  {
    name: "Basic Hair",
    part: "hair",
    releases: [
      {
        price: "25",
        supply: UNLIMITED_SUPPLY,
        releaseDate: new Date("2022-10-11T01:17:00.000Z").getTime(),
      },
    ],
    tokenId: 5,
    price: 5,
    totalMinted: 200,
  },

  {
    name: "Red Farmer Shirt",
    part: "shirt",
    releases: [
      {
        price: "25",
        supply: UNLIMITED_SUPPLY,
        releaseDate: new Date("2022-10-11T01:17:00.000Z").getTime(),
        endDate: new Date("2022-10-12T01:17:00.000Z").getTime(),
      },
    ],
    tokenId: 13,
    totalMinted: 500,
  },
  {
    name: "Rancher Hair",
    part: "hair",
    releases: [
      {
        price: "25",
        supply: UNLIMITED_SUPPLY,
        releaseDate: new Date("2022-10-11T01:17:00.000Z").getTime(),
      },
    ],
    tokenId: 6,
    price: 5,
    totalMinted: 150,
  },
  {
    name: "Farm Background",
    part: "background",
    releases: [],
    tokenId: 32,
    totalMinted: 1002,
  },
  {
    name: "Blue Farmer Shirt",
    part: "shirt",
    releases: [
      {
        price: "25",
        supply: UNLIMITED_SUPPLY,
        releaseDate: new Date("2022-10-11T01:17:00.000Z").getTime(),
        endDate: new Date("2022-10-12T01:17:00.000Z").getTime(),
      },
    ],
    tokenId: 15,
    totalMinted: 3,
  },
];
