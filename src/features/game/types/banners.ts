import { ChapterBanner } from "./chapters";
import { CHAPTER_BANNERS } from "./chapters";
import { FactionBanner } from "./game";
type bannerName =
  | "Human War Banner"
  | "Goblin War Banner"
  | "Lifetime Farmer Banner"
  | "Earn Alliance Banner"
  | ChapterBanner
  | FactionBanner;

export const BANNERS: Record<bannerName, string> = {
  ...CHAPTER_BANNERS,
  "Human War Banner": "",
  "Goblin War Banner": "",
  "Lifetime Farmer Banner": "",
  "Bumpkin Faction Banner": "",
  "Goblin Faction Banner": "",
  "Sunflorian Faction Banner": "",
  "Nightshade Faction Banner": "",
  "Earn Alliance Banner": "",
};
