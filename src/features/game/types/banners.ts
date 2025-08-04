import { SeasonalBanner } from "./seasons";
import { SEASONAL_BANNERS } from "./seasons";
import { FactionBanner } from "./game";

type BannerName =
  | "Human War Banner"
  | "Goblin War Banner"
  | "Lifetime Farmer Banner"
  | "Earn Alliance Banner"
  | "Polygon Banner"
  | "Ronin Banner"
  | "Base Banner"
  | SeasonalBanner
  | FactionBanner;

export const BANNERS: Record<BannerName, string> = {
  ...SEASONAL_BANNERS,
  "Human War Banner": "",
  "Goblin War Banner": "",
  "Lifetime Farmer Banner": "",
  "Bumpkin Faction Banner": "",
  "Goblin Faction Banner": "",
  "Sunflorian Faction Banner": "",
  "Nightshade Faction Banner": "",
  "Earn Alliance Banner": "",
  "Polygon Banner": "",
  "Ronin Banner": "",
  "Base Banner": "",
};
