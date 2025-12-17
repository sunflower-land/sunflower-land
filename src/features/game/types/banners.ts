import { ChapterBanner } from "./chapters";
import { CHAPTER_BANNERS } from "./chapters";
import { FactionBanner } from "./game";

type BannerName =
  | "Human War Banner"
  | "Goblin War Banner"
  | "Lifetime Farmer Banner"
  | "Earn Alliance Banner"
  | "Polygon Banner"
  | "Ronin Banner"
  | "Base Banner"
  | ChapterBanner
  | FactionBanner;

export const BANNERS: Record<BannerName, string> = {
  ...CHAPTER_BANNERS,
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
