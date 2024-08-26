export type CollectionName =
  | "collectibles"
  | "wearables"
  | "buds"
  | "resources";

export type Tradeable = {
  id: number;
  floor: number;
  supply: number;
  type: "onchain" | "instant";
};

type Offer = {
  sfl: number;
  quantity: number;
  offeredById: number;
  offeredAt: number;
};

type Listing = {
  sfl: number;
  quantity: number;
  listedById: number;
  listedAt: number;
};

export type TradeableDetails = Tradeable & {
  offers: Offer[];
  listings: Listing[];
  history: { price: number; sales: number; date: string }[];
};

export type Collection = {
  type: CollectionName;
  items: Tradeable[];
};
