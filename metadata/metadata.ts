import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "../src/features/game/types/game";
import { Attribute } from "./models";
import { getKeys } from "lib/object";
import {
  DECORATION_TEMPLATES,
  TemplateDecorationName,
} from "features/game/types/decorations";

// `image` is intentionally NOT part of the authored shape. The output URL is
// derived from KNOWN_IDS / ITEM_IDS in generateMetadata.ts (see there). It's
// kept optional on the type so that script can still assign it before
// serializing the JSON. This removes a whole class of metadata bugs where
// multiple entries pointed at the same filename, or pointed at the wrong
// folder entirely.
type Metadata = {
  description: string;
  decimals: number;
  attributes: Attribute[];
  external_url: "https://docs.sunflower-land.com/getting-started/about";
  image?: string;
  name?: InventoryItemName | BumpkinItem;
};

export const OPEN_SEA_COLLECTIBLES: Record<InventoryItemName, Metadata> = {
  "Diving Helmet": {
    description:
      "A relic from the depths of the ocean, worn by the bravest of fishermen.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Diving Helmet",
  },
  "Speckled Kissing Fish": {
    description: "A speckled fish decoration that brings ocean charm.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Speckled Kissing Fish",
  },
  "Dark Eyed Kissing Fish": {
    description: "A dark-eyed fish ornament with a mysterious gaze.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dark Eyed Kissing Fish",
  },
  "Fisherman's Boat": {
    description: "A trusty boat for the seasoned fisher.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fisherman's Boat",
  },
  "Sea Arch": {
    description: "A coral archway shaped by the tides.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sea Arch",
  },
  "Crabs and Fish Rug": {
    description: "A cozy rug woven with crabs and fish motifs.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crabs and Fish Rug",
  },
  "Fish Flags": {
    description: "Festive flags that flutter with sea spirit.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Flags",
  },
  "Fish Drying Rack": {
    description: "A simple rack for drying the day's catch.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Drying Rack",
  },
  "Yellow Submarine Trophy": {
    description: "A bright trophy celebrating deep-sea exploration.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yellow Submarine Trophy",
  },
  Oaken: {
    description: "A sturdy oaken keepsake from the shore.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oaken",
  },
  Meerkat: {
    description: "A watchful meerkat companion statue.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Meerkat",
  },
  "Pearl Bed": {
    description: "A pearl-lined bed fit for ocean royalty.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pearl Bed",
  },
  "Crimstone Clam": {
    description: "A clam infused with crimstone glow.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Clam",
  },
  "Poseidon's Throne": {
    description: "A majestic throne worthy of the sea god.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Poseidon's Throne",
  },
  "Fish Kite": {
    description: "A playful kite shaped like a fish.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Kite",
  },
  CluckCoin: {
    description:
      "A minigame currency from Chicken Rescue. Not withdrawable. No in-game utility yet; trading is experimental.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Minigame currency" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Withdrawable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "CluckCoin",
  },
  "Furikake Sprinkle": {
    description: "A lightning-fast umami sprinkle for quick snacks.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Surimi Rice Bowl": {
    description: "Rice and surimi shaped for instant energy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Creamy Crab Bite": {
    description: "A creamy crab-flavored bite crafted instantly.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimstone Infused Fish Oil": {
    description: "Crimstone-laced fish oil distilled in a flash.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Floater: {
    description: "A ticket to the Crabs and Traps.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Ticket" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ammonite Shell": {
    description: "An artefact from the Crabs and Traps.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Artefact" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crabs and Traps Banner": {
    description: "A banner for the Crabs and Traps.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Market": {
    description: "A processed fish market for fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Flake": {
    description: "A processed fish ingredient - guaranteed catch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Stick": {
    description: "A sturdy processed fish ingredient - guaranteed catch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Oil": {
    description: "A refined fish ingredient - guaranteed catch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crab Stick": {
    description: "A crab-based processed ingredient - guaranteed catch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Super Star": {
    description: "A super star that grants +1 fish during winter months!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        trait_type: "+1 fish during winter",
        value: 1,
      },
    ],
  },
  "Baby Cow": {
    description:
      "Who doesn't love a baby cow? +10 cow xp from animal affection tools.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_number",
        trait_type: "+10 cow xp from animal affection tools",
        value: 0.1,
      },
    ],
  },
  "Baby Sheep": {
    description: "Wooly and fluffy little baby",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Janitor Chicken": {
    description:
      "A busy little chicken always ready to work. Reduces chicken sleep time by 5%.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "-5% chicken sleep time",
        value: 5,
      },
    ],
  },
  "Venus Bumpkin Trap": {
    description: "Never turn your back on this snappy plant!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Black Hole Flower": {
    description:
      "A cosmic blossom that warps light itself, best admired as a centrepiece.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Sleepy Chicken": {
    description:
      "This drowsy chicken drifts off mid cluck but keeps the coop healthy through fall.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Prevent chicken sickness during fall",
        value: 0.1,
      },
    ],
  },
  "Astronaut Cow": {
    description:
      "A spacefaring cow who loves grazing among the stars and moon rocks.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Astronaut Sheep": {
    description:
      "A woolly explorer equipped for zero-gravity strolls through space.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wool Yield",
        value: 0.1,
      },
    ],
  },
  "Mermaid Cow": {
    description: "A sea-kissed cow with shimmering fins and ocean charm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Mermaid Sheep": {
    description: "A woolly mermaid with a tide-touched sparkle.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Squid Chicken": {
    description: "An inky chicken with tentacled flair from the deep.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Anemone Flower": {
    description: "A vibrant anemone that sways with the tides.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Love Chicken": {
    description: "A mutant chicken filled with love and affection",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Dr Cow": {
    description:
      "A mutant cow dressed as a caring doctor, gives 5% less feeding cost for cows",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Nurse Sheep": {
    description:
      "A mutant sheep dressed as a caring nurse, prevents sheep from getting sick during summer",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Pink Dolphin": {
    description:
      "A rare dolphin with a beautiful pink hue, increases fish catch by 1 during spring",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  Lunalist: {
    description:
      "A blooming artifact devoted to the moon. A decorative mutant flower found during the Great Bloom chapter",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Rhubarb Tart": {
    description: "A sweet and tangy tart featuring fresh rhubarb",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
  },
  "Frozen Cow": {
    description:
      "A frosty bovine mutation that prevents cows from getting sick during winter months!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Prevent cow sickness during winter",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Frozen Sheep": {
    description:
      "A frosty sheep mutation that prevents sheep from getting sick during winter months!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Prevent sheep sickness during winter",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Summer Chicken": {
    description:
      "A chicken mutation that prevents chickens from getting sick during summer months!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Prevent chicken sickness during summer",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Jellyfish: {
    description:
      "A marine marvel from the Winds of Change chapter that grants +1 fish during summer months!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        trait_type: "Increase fish catch by 1 in summer",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Chamomile: {
    description:
      "A decorative mutant flower found during the Winds of Change chapter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Bull Run Banner": {
    name: "Bull Run Banner",
    description: "A banner that celebrates the Bull Run chapter.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Horseshoe: {
    name: "Horseshoe",
    description: "A valuable token to exchange for rewards!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cow Skull": {
    name: "Cow Skull",
    description: "An ancient skull.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Seed": {
    name: "Sunflower Seed",
    description:
      "A seed used to grow sunflowers. The most basic resource used to start your farming empire.\n\nYou can buy sunflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description:
      "A seed used to grow beetroot.\n\nYou can buy beetroot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potato Seed": {
    name: "Potato Seed",
    description:
      "A seed used to grow potatoes. All great hustlers start with a potato seed.\n\nYou can buy potato seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description:
      "A seed used to grow cabbage.\n\nYou can buy cabbage seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Soybean Seed": {
    name: "Soybean Seed",
    description:
      "A seed used to grow soybean.\n\nYou can buy soybean seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description:
      "A seed used to grow pumpkins. A goblin's favourite!\n\nYou can buy pumpkin seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description:
      "A seed used to grow carrots. An easy to grow and staple vegetable in all Bumpkin's diets!\n\nYou can buy carrot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description:
      "A seed used to grow parsnip.\n\nYou can buy parsnip seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Eggplant Seed": {
    name: "Eggplant Seed",
    description:
      "A seed used to grow eggplant.\n\nYou can buy eggplant seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description:
      "A seed used to grow wheat.\n\nYou can buy wheat seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Seed": {
    name: "Radish Seed",
    description:
      "A seed used to grow radishes.\n\nYou can buy radish seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Corn Seed": {
    name: "Corn Seed",
    description:
      "A seed used to grow corn.\n\nYou can buy corn seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Seed": {
    name: "Kale Seed",
    description:
      "A seed used to grow kale.\n\nYou can buy kale seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barley Seed": {
    name: "Barley Seed",
    description:
      "Barley is a nutritious cereal grain used in animal feed.\n\nYou can buy barley seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Apple Seed": {
    name: "Apple Seed",
    description:
      "A seed used to grow apple.\n\nYou can buy apple seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description:
      "A seed used to grow cauliflower.\n\nYou can buy cauliflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sunflower: {
    name: "Sunflower",
    description: "A crop grown at Sunflower Land.\n\nA sunny flower.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Orange Seed": {
    name: "Orange Seed",
    description:
      "A seed used to grow orange.\n\nYou can buy orange seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blueberry Seed": {
    name: "Blueberry Seed",
    description:
      "A seed used to grow blueberry.\n\nYou can buy blueberry seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Banana Plant": {
    name: "Banana Plant",
    description:
      "A plant used to grow bananas.\n\nYou can buy banana plants in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Tomato Seed": {
    name: "Tomato Seed",
    description: "Rich in Lycopene",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lemon Seed": {
    name: "Lemon Seed",
    description: "Because sometimes, you just can't squeeze an orange!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunpetal Seed": {
    name: "Sunpetal Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Sunpetal seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bloom Seed": {
    name: "Bloom Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Bloom seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lily Seed": {
    name: "Lily Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Lily seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Edelweiss Seed": {
    name: "Edelweiss Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Edelweiss seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gladiolus Seed": {
    name: "Gladiolus Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Gladiolus seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lavender Seed": {
    name: "Lavender Seed",
    description:
      "A seed used to grow lavender.\n\nYou can buy lavender seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Clover Seed": {
    name: "Clover Seed",
    description:
      "A seed used to grow clover.\n\nYou can buy clover seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Beetroot: {
    name: "Beetroot",
    description:
      "A crop grown at Sunflower Land.\n\nApparently, they’re an aphrodisiac...",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Pumpkin: {
    name: "Pumpkin",
    description: "A crop grown at Sunflower Land.\n\nOoooh, spoookyy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cauliflower: {
    name: "Cauliflower",
    description:
      "A crop grown at Sunflower Land.\n\nNow in 4 different colours!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Potato: {
    name: "Potato",
    description:
      "A crop grown at Sunflower Land.\n\nHealthier than you might think!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cabbage: {
    name: "Cabbage",
    description:
      "A crop grown at Sunflower Land.\n\nOnce a luxury, now a food for many.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Soybean: {
    name: "Soybean",
    description: "A crop grown at Sunflower Land.\n\nA versatile legume!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Parsnip: {
    name: "Parsnip",
    description:
      "A crop grown at Sunflower Land.\n\nNot to be mistaken for carrots.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Eggplant: {
    name: "Eggplant",
    description:
      "A crop grown at Sunflower Land.\n\nNature's edible work of art.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Wheat: {
    name: "Wheat",
    description:
      "A crop grown at Sunflower Land.\n\nTraditionally only grown by Goblins.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Hay: {
    name: "Hay",
    description: "",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kernel Blend": {
    name: "Kernel Blend",
    description: "",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  NutriBarley: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "NutriBarley",
  },
  "Mixed Grain": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mixed Grain",
  },
  Omnifeed: {
    name: "Omnifeed",
    description: "Acts as the best feed for all animals.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barn Delight": {
    name: "Barn Delight",
    description: "A magical elixir that cures animal sickness.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Medicine" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Kale: {
    name: "Kale",
    description: "A crop grown at Sunflower Land.\n\nA Bumpkin Power Food!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Barley: {
    name: "Barley",
    description: "Barley is a nutritious cereal grain used in animal feed.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Carrot: {
    name: "Carrot",
    description:
      "A crop grown at Sunflower Land.\n\nThey’re good for your eyes!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Axe: {
    name: "Axe",
    description:
      "A tool used to chop wood. It is burnt after use.\n\nYou can craft an axe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Orange: {
    name: "Orange",
    description:
      "A fruit grown at Sunflower Land.\n\nVitamin C to keep your Bumpkin Healthy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Blueberry: {
    name: "Blueberry",
    description: "A fruit grown at Sunflower Land.\n\nA Goblin's weakness",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Apple: {
    name: "Apple",
    description:
      "A fruit grown at Sunflower Land.\n\nPerfect for homemade Apple Pie",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Banana: {
    name: "Banana",
    description: "A fruit grown at Sunflower Land.\n\nOh banana!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Tomato: {
    name: "Tomato",
    description: "Rich in Lycopene",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Lemon: {
    name: "Lemon",
    description: "Because sometimes, you just can't squeeze an orange!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pickaxe: {
    name: "Pickaxe",
    description:
      "A tool used to mine stone. It is burnt after use.\n\nYou can craft a pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Radish: {
    name: "Radish",
    description:
      "A crop grown at Sunflower Land.\n\nLegend says these were once used in melee combat.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Corn: {
    name: "Corn",
    description:
      "A crop grown at Sunflower Land.\n\nGolden corn, a gift from celestial lands, bestowed bountiful harvests upon humankind",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description:
      "A tool used to mine iron. It is burnt after use.\n\nYou can craft a stone pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description:
      "A tool used to mine gold. It is burnt after use.\n\nYou can craft an iron pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gold Pickaxe": {
    name: "Gold Pickaxe",
    description:
      "A tool used to mine crimstones and sunstones. It is burnt after use.\n\nYou can craft a gold pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Oil Drill": {
    name: "Oil Drill",
    description:
      "A tool used to drill for oil. It is burnt after use.\n\nYou can craft an oil drill at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Salt Rake": {
    name: "Salt Rake",
    description:
      "A tool used to harvest salt nodes. It is burnt after use.\n\nYou can craft a salt rake at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Petting Hand": {
    name: "Petting Hand",
    description:
      "A tool used to pet animals.\n\nYou can craft a petting hand at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Brush: {
    name: "Brush",
    description:
      "A tool used to brush animals.\n\nYou can craft a brush at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Music Box": {
    name: "Music Box",
    description:
      "A tool used to play music for animals.\n\nYou can craft a music box at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Hammer: {
    name: "Hammer",
    description:
      "A tool used to upgrade buildings.\n\nYou can craft a hammer at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Rod: {
    name: "Rod",
    description:
      "A tool used to capture fish.\n\nYou can craft a rod at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Shovel: {
    name: "Shovel",
    description:
      "A tool used to remove unwanted crops.\n\nYou can craft a shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description:
      "A symbol of the holy Sunflower Land Token. Flex your loyalty and farming status with this rare statue.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description:
      "Place on your farm during the Festive Season to get a spot and Santa's nice list!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Scarecrow: {
    name: "Scarecrow",
    description:
      "Ensures your crops grow faster when placed on your farm.\n\nRumour has it that it is crafted with a Goblin head from the great war.\n\nIncludes boosts from [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farm Dog": {
    name: "Farm Dog",
    description:
      "Sheep are no longer lazy when this farm dog is around.\n\n~~You can craft a dog at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Sheep Produce Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Potato Statue": {
    name: "Potato Statue",
    description:
      "A rare collectible for the potato hustlers of Sunflower Land.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Gnome: {
    name: "Gnome",
    description:
      "A lucky gnome. Currently used for decoration purposes\n\n~~You can craft a gnome at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type:
          "Increase Medium and Advanced Crop Yield when placed between Cobalt and Clementine",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 1,
      },
    ],
  },
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description:
      "Used to remove buildings and collectibles\n\nYou can craft a rusty shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chicken Coop": {
    name: "Chicken Coop",
    description:
      "A chicken coop that can be used to raise chickens. Increase egg production with this rare coop.\n\n~~You can craft a chicken coop at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 1,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Base Chickens",
        value: 5,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Max Chickens per Hen House Upgrade",
        value: 5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description:
      "A golden egg. What lays inside is known to be the bearer of good fortune.\n\n\n\nFeed chickens for free.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Feed chickens without food",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description:
      "A commemorative homage to Sunflower Farmers, the prototype which birthed Sunflower Land.\n\nThis item was airdropped to anyone who maxed out their farm to level 5.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description:
      "It is rumoured that a farmer created a golden fertiliser which produced this magical Cauliflower.\n\nFor some reason, when this Cauliflower is on your farm you receive twice the rewards from growing Cauliflowers.\n\n~~You can craft a Golden Cauliflower at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cauliflower Yield",
        value: 100,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farm Cat": {
    name: "Farm Cat",
    description:
      "Keep the rats away with this rare item. Currently used for decoration purposes.\n\n~~You can craft a Cat at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description:
      "Remember the time Sunflower Farmers 'broke' Polygon? Those days are gone with Sunflower Land!\n\nThis is an extremely rare decoration for your farm.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Fountain: {
    name: "Fountain",
    description:
      "A beautiful fountain that relaxes all Bumpkins.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description:
      "During the great wood shortage, Bumpkins created an alliance with the Beaver population.\n\nIncreases wood production.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description:
      "Summon the Goblin leader and reveal who the mastermind is behind the Goblin resistance.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description:
      "A well trained Beaver who has aspirations of creating a wood monopoly.\n\nIncreases wood replenishment rates.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**\n\nIncludes boosts from [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Regeneration Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description:
      "No one knows where this parsnip came from, but when it is on your farm Parsnips grow 50% faster.\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Parsnip Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description:
      "A master of construction, carving and all things wood related.\n\nChop trees without axes.\n\nIncludes boosts from [Apprentice Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/416) and [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Regeneration Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Cut trees without axe",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Nancy: {
    name: "Nancy",
    description:
      "A brave scarecrow that keeps your crops safe from crows. Ensures your crops grow faster when placed on your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description:
      "A beetroot scented bath for your farmer.\n\nAfter a long day of farming potatoes and fighting off Goblins, this is the perfect relaxation device for your hard working farmer.\n\nYou can craft the Farmer Bath at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description:
      "Legend has it that only a true farmer can yield this sword.\n\nIncreases the chance of finding a mutant crop by 300%!\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Increases chance of Mutant Crop",
        value: 300, // Means 4x the chance to get a Mutant Crop
      },
    ],
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "An extremely rare item in Sunflower Land. This scarecrow cannot move but has in-depth knowledge of the history of the Sunflower Wars.\n\nThis scarecrow is so scary that it even frightens Bumpkins. If you have this item, all seeds are free from the market.\n\nIncludes boosts from [Scarecrow](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/404) and [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 20,
      },
      {
        display_type: "boost_number",
        trait_type: "Cost of Seeds",
        value: 0,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rock Golem": {
    name: "Rock Golem",
    description:
      "The Rock Golem is the protector of Stone.\n\nMining stone causes the Golem to be become enraged giving a 10% chance to get +2 Stone from stone mines.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Stone Critical Hit Amount",
        value: 2, // +2 Stone when Critical Hit
      },
      {
        display_type: "boost_percentage",
        trait_type: "Stone Critical Hit Chance",
        value: 10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description:
      "A homage to Sir Nyon who died at the battle of the Goblin mines.\n\n~~You can craft the Nyon Statue at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description:
      "A nice and cozy tent.\n\n~~You can craft the Homeless Tent at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mysterious Head": {
    name: "Mysterious Head",
    description:
      "A Mysterious Head said to protect farmers.\n\nYou can craft the Mysterious Head at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description:
      "The pinnacle of goblin style and sophistication. A Golden Bonsai is the perfect piece to tie your farm together.\n\n~~You can only get this item trading with the Traveling Salesman in the game. ~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tunnel Mole": {
    name: "Tunnel Mole",
    description: "The tunnel mole gives a 0.25 increase to stone mines' yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rocky the Mole": {
    name: "Rocky the Mole",
    description:
      "\"Life's not about how much iron you can mine... it's about how much more you can mine, and still keep mining.\" - Rocky the Mole\n\nRocky the Mole gives a 0.25 increase to iron mines' yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Victoria Sisters": {
    name: "Victoria Sisters",
    description:
      "A Halloween collectible. Increase Pumpkin yield by 20% and summon the necromancer.\n\nTo craft this item you must collect 50 Jack-o-lantern's and trade with the Traveling Salesman.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Pumpkin Yield",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Nugget: {
    name: "Nugget",
    description:
      "Seldom seen above ground, this gold digger burrows day and night searching for the next gold rush.\n\nStrike gold with this little critter! Eureka!\n\nNugget gives a 0.25 increase to gold mines' yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wicker Man": {
    name: "Wicker Man",
    description:
      "Join hands and make a chain, the shadow of the Wicker Man will rise up again.\n\nYou can only get this item trading with the Traveling Salesman in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description:
      "A Goblin’s favourite! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description:
      "A creamy soup that Goblins love! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description:
      "Fermented Cabbage! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description:
      "Despised by humans, loved by Goblins! Owning this item unlocks crop seeds.\n\nYou can craft this item at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potato Cake": {
    name: "Potato Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Cake": {
    name: "Radish Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Stone: {
    name: "Stone",
    description:
      "A resource collected by mining stone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  Wood: {
    name: "Wood",
    description:
      "A resource collected by chopping down trees.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Iron: {
    name: "Iron",
    description:
      "A resource collected by mining iron mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Crimstone: {
    name: "Crimstone",
    description:
      "A resource collected by mining crimstone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Oil: {
    name: "Oil",
    description:
      "A resource collected by mining oil mines.\n\nIt is used to power machinery and boost cooking speed.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Egg: {
    name: "Egg",
    description:
      "A resource collected by taking care of chickens.\n\nIt is used in a range of different crafting recipes.\n\nAt Sunflower Land, the egg came first.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Leather: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Leather",
  },
  Wool: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wool",
  },
  "Merino Wool": {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merino Wool",
  },
  Feather: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Feather",
  },
  Milk: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Milk",
  },
  Gold: {
    name: "Gold",
    description:
      "A resource collected by mining gold mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Sunstone: {
    name: "Sunstone",
    description:
      "A resource collected by mining sunstone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Chicken: {
    name: "Chicken",
    description:
      "A resource used to collect eggs.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Speed Chicken": {
    name: "Speed Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant increases the speed of egg production by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Egg Production Time",
        value: -10,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Pig: {
    name: "Pig",
    description:
      "A resource used to collect manure.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sheep: {
    name: "Sheep",
    description:
      "A resource used to collect wool.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fat Chicken": {
    name: "Fat Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant reduces the food required to feed a chicken by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Chicken Feed Reduction",
        value: -10,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant adds a boost of +0.1 egg yield.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Rooster: {
    name: "Rooster",
    description:
      "Rooster increases the chance of getting a mutant chicken 2x.\n\nYou can craft this item at the Goblin Farmer in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Chicken Chance",
        value: 100,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Honey: {
    name: "Honey",
    description: "Used to sweeten your cooking.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Magic Mushroom": {
    name: "Magic Mushroom",
    description: "Used to cook advanced recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wild Mushroom": {
    name: "Wild Mushroom",
    description: "Used to cook basic recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Diamond: {
    name: "Diamond",
    description:
      "A resource collected by mining diamond mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Obsidian: {
    name: "Obsidian",
    description:
      "A resource collected by mining obsidian mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Salt: {
    name: "Salt",
    description:
      "A resource harvested from salt nodes.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Refined Salt": {
    name: "Refined Salt",
    description:
      "Processed salt suited to pickling and advanced recipes.\n\nHow it is obtained will be revealed later.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Salt Lick": {
    name: "Salt Lick",
    description:
      "A mineral block crafted at the Spice Rack.\n\nFeed to an animal to increase animal produce by 5% on the next 3 harvests.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Honey Treat": {
    name: "Honey Treat",
    description:
      "A sweet animal treat crafted at the Spice Rack.\n\nFeed to an animal to reduce animal feed consumption on the next 3 harvests.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Spice Base": {
    name: "Spice Base",
    description:
      "A peppery base for advanced cooking. Crafted at the Spice Rack.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Spiced Cheese": {
    name: "Spiced Cheese",
    description: "Cheese infused with spice base. Crafted at the Spice Rack.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Green Thumb": {
    name: "Green Thumb",
    description:
      "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Sell Price",
        value: 5,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Crop Chance",
        value: 10,
      },
    ],
  },
  "Barn Manager": {
    name: "Barn Manager",
    description:
      "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Animal Yield",
        value: 0.1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Animal Chance",
        value: 10,
      },
    ],
  },
  Cow: {
    name: "Cow",
    description:
      "A resource used to collect milk.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Seed Specialist": {
    name: "Seed Specialist",
    description:
      "~~A skill that can be earned when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Crop Chance",
        value: 10,
      },
    ],
  },
  Wrangler: {
    name: "Wrangler",
    description:
      "~~A skill that can be learnt when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Animal Produce Time",
        value: -10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Animal Chance",
        value: 10,
      },
    ],
  },
  Lumberjack: {
    name: "Lumberjack",
    description:
      "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 10,
      },
    ],
  },
  Prospector: {
    name: "Prospector",
    description:
      "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Stone Drops",
        value: 20,
      },
    ],
  },
  "Gold Rush": {
    name: "Gold Rush",
    description:
      "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Gold Drops",
        value: 50,
      },
    ],
  },
  Coder: {
    name: "Coder",
    description:
      "~~A skill that can be earned by contributing code to the game.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 10,
      },
    ],
  },
  Artist: {
    name: "Artist",
    description:
      "~~A skill that can be earned by contributing art to the game.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Seeds and Tools discount",
        value: 10,
      },
    ],
  },
  Logger: {
    name: "Logger",
    description:
      "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Amount of Axes to Chop Trees",
        value: -50,
      },
    ],
  },
  "Discord Mod": {
    name: "Discord Mod",
    description:
      "~~A skill that can be earned by moderating Discord.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 35,
      },
    ],
  },
  "Trading Ticket": {
    name: "Trading Ticket",
    description:
      "This ticket grants the owner a free ride in the hot air balloon (a free trade).\n\nUsed automatically when posting a trade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Beta Pass": {
    name: "Beta Pass",
    description: "Gain early access to features for testing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Liquidity Provider": {
    name: "Liquidity Provider",
    description:
      "~~A skill that can be earned by providing liquidity.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Withdrawal Fee",
        value: -50,
      },
    ],
  },
  "Belgian Flag": {
    name: "Belgian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Australian Flag": {
    name: "Australian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Brazilian Flag": {
    name: "Brazilian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Indonesian Flag": {
    name: "Indonesian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Warrior: {
    name: "Warrior",
    description:
      "~~A skill earned by the top 10 warriors each week.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "French Flag": {
    name: "French Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Finnish Flag": {
    name: "Finnish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Indian Flag": {
    name: "Indian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "German Flag": {
    name: "German Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Iranian Flag": {
    name: "Iranian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Italian Flag": {
    name: "Italian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Japanese Flag": {
    name: "Japanese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Moroccan Flag": {
    name: "Moroccan Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Chinese Flag": {
    name: "Chinese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Philippine Flag": {
    name: "Philippine Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dutch Flag": {
    name: "Dutch Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Polish Flag": {
    name: "Polish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Russian Flag": {
    name: "Russian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Saudi Arabian Flag": {
    name: "Saudi Arabian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Portuguese Flag": {
    name: "Portuguese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Spanish Flag": {
    name: "Spanish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Thai Flag": {
    name: "Thai Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Turkish Flag": {
    name: "Turkish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "South Korean Flag": {
    name: "South Korean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ukrainian Flag": {
    name: "Ukrainian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Vietnamese Flag": {
    name: "Vietnamese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "American Flag": {
    name: "American Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Canadian Flag": {
    name: "Canadian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Singaporean Flag": {
    name: "Singaporean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sierra Leone Flag": {
    name: "Sierra Leone Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "British Flag": {
    name: "British Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Romanian Flag": {
    name: "Romanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Flag": {
    name: "Pirate Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mexican Flag": {
    name: "Mexican Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rainbow Flag": {
    name: "Rainbow Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dominican Republic Flag": {
    name: "Dominican Republic Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Algerian Flag": {
    name: "Algerian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Argentinian Flag": {
    name: "Argentinian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Flag": {
    name: "Sunflower Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Colombian Flag": {
    name: "Colombian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Malaysian Flag": {
    name: "Malaysian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Egg Basket": {
    name: "Egg Basket",
    description:
      "An item that starts the Easter Egg Hunt.\n\nYou have 7 days to collect the 7 eggs. Every few hours an egg may appear on your farm to collect. Limited edition item!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Red Egg": {
    name: "Red Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Blue Egg": {
    name: "Blue Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Yellow Egg": {
    name: "Yellow Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Pink Egg": {
    name: "Pink Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Purple Egg": {
    name: "Purple Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Orange Egg": {
    name: "Orange Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  "Lithuanian Flag": {
    name: "Lithuanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Green Egg": {
    name: "Green Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
    ],
  },
  Observatory: {
    name: "Observatory",
    description:
      "A limited edition Observatory gained from completing the mission from Million on Mars x Sunflower Land crossover event.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 5,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Engine Core": {
    name: "Engine Core",
    description:
      "An exclusive event item for Million on Mars x Sunflower Land cross-over.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ancient Goblin Sword": {
    name: "Ancient Goblin Sword",
    description: "An Ancient Goblin Sword",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ancient Human Warhammer": {
    name: "Ancient Human Warhammer",
    description: "An Ancient Human Warhammer",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "War Bond": {
    name: "War Bond",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nWill you show your support?\n\nFor a limited time, the war collectors are offering rare War Bonds in exchange for resources. You can use these to buy rare items in Goblin Village.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rapid Growth": {
    name: "Rapid Growth",
    description:
      "A rare fertiliser. ~~Apply to your crops to grow twice as fast~~ Legacy Item",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Key": {
    name: "Sunflower Key",
    description: "A Sunflower Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Human War Point": {
    name: "Human War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Human is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description:
      "A limited edition bunny that can be crafted by those who collect all 7 eggs in the Easter Egg Hunt.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase Carrot Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Flag": {
    name: "Goblin Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Key": {
    name: "Goblin Key",
    description: "A Goblin Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin War Point": {
    name: "Goblin War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Goblin is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Human War Banner": {
    name: "Human War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Human cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Market: {
    name: "Market",
    description: "A market used to buy seeds and sell crops in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Jack-o-lantern": {
    name: "Jack-o-lantern",
    description: "A Halloween special event item.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Crop": {
    name: "Golden Crop",
    description: "A shiny golden crop",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fire Pit": {
    name: "Fire Pit",
    description: "A fire pit used to cook basic recipes in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tent: {
    name: "Tent",
    description:
      "Every Bumpkin needs a tent. Adding a tent to your land supports adding more Bumpkins (coming soon) to your land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pet House": {
    name: "Pet House",
    description: "A pet house used to support pets.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Workbench: {
    name: "Workbench",
    description:
      "A workbench used to craft tools & buildings in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin War Banner": {
    name: "Goblin War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Goblin cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Town Center": {
    name: "Town Center",
    description: "Gather round the town center and hear the latest news!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Bakery: {
    name: "Bakery",
    description: "A bakery used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Kitchen: {
    name: "Kitchen",
    description: "A kitchen used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Apron": {
    name: "Chef Apron",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Price of cakes",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Water Well": {
    name: "Water Well",
    description: "A water well to support more crops in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Deli: {
    name: "Deli",
    description: "A deli used to cook advanced recipes at Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Smoothie Shack": {
    name: "Smoothie Shack",
    description:
      "A Smoothie Shack is used to prepare juices in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Toolshed: {
    name: "Toolshed",
    description: "A Toolshed increases your tool stocks by 50%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Warehouse: {
    name: "Warehouse",
    description: "A Warehouse increases your seed stocks by 20%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflower Amulet": {
    name: "Sunflower Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Sunflower yield",
        value: 10,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Hat": {
    name: "Chef Hat",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Amulet": {
    name: "Carrot Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Carrots grow time",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Amulet": {
    name: "Beetroot Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Beetroot yield",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warrior Shirt": {
    name: "Warrior Shirt",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Green Amulet": {
    name: "Green Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Crop Critical Hit Multiplier",
        value: 10,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warrior Pants": {
    name: "Warrior Pants",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Skull Hat": {
    name: "Skull Hat",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Shield": {
    name: "Sunflower Shield",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Sunflower Seed Cost",
        value: 0,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "War Tombstone": {
    name: "War Tombstone",
    description: "R.I.P",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "War Skull": {
    name: "War Skull",
    description: "Decorate the land with the bones of your enemies.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hen House": {
    name: "Hen House",
    description: "A hen house used to support chickens.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Barn: {
    name: "Barn",
    description: "A nice and cosy home for your four legged animals.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: "An unfortunate casualty of the war. +0.1 egg yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Warrior Helmet": {
    name: "Warrior Helmet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Angel Bear": {
    description:
      "Time to transcend peasant farming. Harvest 1 million crops to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Apple Pie": {
    description: "Bumpkin Betty's famous recipe. Cook this at the bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Badass Bear": {
    description:
      "Nothing stands in your way. Chop 5,000 trees to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Basic Bear": {
    description: "A basic bear. Use this to craft advanced bears!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bear Trap": {
    description:
      "It's a trap! Unlock the high roller achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blueberry Jam": {
    description:
      "Goblins will do anything for this jam. You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Boiled Eggs": {
    description:
      "Boiled Eggs are great for breakfast. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Brilliant Bear": {
    description: "Pure brilliance! Reach lvl 20 to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin Broth": {
    description:
      "A perfect broth for a cold day. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Salad": {
    description:
      "Gotta keep your Bumpkin healthy! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Boy": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield with Cabbage Girl placed",
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cabbage Girl": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Cabbage Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cauliflower Burger": {
    description:
      "Calling all cauliflower lovers! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Bear": {
    description:
      "Every chef needs a helping hand! Bake 13 cakes to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Christmas Bear": {
    description: "Santa's favourite.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Classy Bear": {
    description:
      "More FLOWER than you know what to do with it! Mine 500 gold rocks to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Construction Bear": {
    description:
      "Always build in a bear market. Build 10 buildings to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farmer Bear": {
    description:
      "Nothing quite like a hard day's work! Harvest 10,000 crops to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rich Bear": {
    description:
      "A prized possession. Unlock the Bumpkin Billionaire achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rainbow Artist Bear": {
    description: "The owner is a beautiful bear artist!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Bear": {
    description:
      "A Bear's cherished crop. Harvest 100,000 Sunflowers to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Club Sandwich": {
    description:
      "Filled with Carrots and Roasted Sunflower Seeds. You can cook this at the Kitchen",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fermented Carrots": {
    description: "Got a surplus of carrots? You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin's Treat": {
    description:
      "Goblins go crazy for this stuff! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Honey Cake": {
    description: "A scrumptious cake! You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale & Mushroom Pie": {
    description:
      "A traditional Sapphiron recipe. You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Stew": {
    description:
      "A perfect Bumpkin Booster. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mashed Potato": {
    description: "My life is potato. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mushroom Jacket Potatoes": {
    description:
      "Cram them taters with what ya got! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mushroom Soup": {
    description:
      "Warm your Bumpkin's soul. You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Reindeer Carrot": {
    description:
      "Rudolph can't stop eating them! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Roast Veggies": {
    description:
      "Even Goblins need to eat their veggies! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Crunch": {
    description:
      "Crunchy goodness. Try not to burn it! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Orange Cake": {
    description:
      "Orange you glad we aren't cooking apples. You can can cook these at the Bakery.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pancakes: {
    description:
      "A great start to a Bumpkins day. You can can cook these at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Apple Juice": {
    description:
      "A crisp refreshing beverage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Orange Juice": {
    description:
      "OJ matches perfectly with a Club Sandwich. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Purple Smoothie": {
    description:
      "You can hardly taste the Cabbage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Power Smoothie": {
    description:
      "Official drink of the Bumpkin Powerlifting Society. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Bumpkin Detox": {
    description:
      "Wash away the sins of last night. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Potted Potato": {
    description:
      "Potato blood runs through your Bumpkin. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potted Pumpkin": {
    description:
      "Pumpkins for Bumpkins. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potted Sunflower": {
    description:
      "Brighten up your land. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Tulips": {
    description:
      "Keep the smell of goblins away. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Cactus: {
    description:
      "Saves water and makes your farm look stunning! You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sand Shovel": {
    description:
      "There are rumours that the Bumpkin pirates hid their treasure somewhere. These shovels can be used to dig for treasure!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radical Radish": {
    description: "Radical! Grants a 3% chance to get +10 radishes on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Radish Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Potent Potato": {
    description: "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Potato Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Peeled Potato": {
    description:
      "A prized possession. Discover a bonus potato 20% of harvests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Potato Critical Hit Amount",
        value: 1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Stellar Sunflower": {
    description:
      "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Sunflower Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wood Nymph Wendy": {
    description: "Cast an enchantment to entice the wood fairies.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Magic Bean": {
    description:
      "Plant, wait and discover rare items, mutant crops & more surprises!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Christmas Snow Globe": {
    description:
      "Swirl the snow and watch it come to life. A Christmas collectible.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Clam Shell": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Cucumber": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Coral: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Crab: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Starfish: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Immortal Pear": {
    description:
      "This long-lived pear ensures your fruit tree survives +1 bonus harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Extra Fruit Harvest",
        value: 1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lady Bug": {
    description:
      "An incredible bug that feeds on aphids. Improves Apple quality. +0.25 Apples each harvest",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Apple Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Squirrel Monkey": {
    description:
      "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around. 1/2 Orange Tree grow time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Orange Regenaration Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Black Bearry": {
    description:
      "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful! +1 Blueberry each Harvest",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Blueberry Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Devil Bear": {
    description: "Better the Devil you know than the Devil you don't.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ayam Cemani": {
    description:
      "The rarest chicken in Sunflower Land. This mutant adds a boost of +0.2 egg yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.2,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Maneki Neko": {
    description:
      "The beckoning cat. Pull its arm and good luck will come. A special event item from Lunar New Year!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "One free food per day",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Collectible Bear": {
    description: "A prized bear, still in mint condition!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cyborg Bear": {
    description: "Hasta la vista, bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Red Envelope": {
    description:
      "Wow, you are lucky! An item from Lunar New Year special event.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Abandoned Bear": {
    description: "A bear that was left behind on the island.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lunar Calendar": {
    description:
      "Crops now follow the lunar cycle! 10% reduction in growth time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dinosaur Bone": {
    description: "A Dinosaur Bone! What kind of creature was this?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Parasaur Skull": {
    description: "A skull from a parasaur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "T-Rex Skull": {
    description: "A skull from a T-Rex! Amazing!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Bear": {
    description: "A goblin bear. It's a bit scary.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Bear Head": {
    description: "Spooky, but cool.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Human Bear": {
    description: "A human bear. Even scarier than a goblin bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lifeguard Bear": {
    description: "Lifeguard Bear is here to save the day!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Bear": {
    description: "Argh, matey! Hug me!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Bounty": {
    description: "A bounty for a pirate. It's worth a lot of money.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pirate Cake": {
    description: "Great for Pirate themed birthday parties.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Skeleton King Staff": {
    description: "All hail the Skeleton King!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Snorkel Bear": {
    description: "Snorkel Bear loves to swim.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Whale Bear": {
    description:
      "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Coin": {
    description: "A coin made of sunflowers.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wooden Compass": {
    description:
      "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Turtle Bear": {
    description: "Turtley enough for the turtle club.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tiki Totem": {
    description: "The Tiki Totem adds 0.1 wood to every tree you chop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Heart of Davy Jones": {
    description:
      "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Heart Balloons": {
    description: "Use them as decorations for romantic occasions.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Flamingo: {
    description:
      "Represents a symbol of love's beauty standing tall and confident.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blossom Tree": {
    description:
      "Its delicate petals symbolizes the beauty and fragility of love.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Genie Lamp": {
    description:
      "A magical lamp that contains a genie who will grant you three wishes and burn the lamp after the third wish. Wish list: Genie Bear, Pirate Bounty, Pearl, Bumpkin Roast, Goblin Brunch and Sand Drill x10",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "Grants Wishes from the Wish list",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Love Letter": {
    description: "Convey feelings of love",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Treasure Map": {
    description:
      "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Beach Bounty profit",
        value: 20,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Foliant: {
    description: "A book of spells.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Kale Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Galleon: {
    description: "A toy ship, still in pretty good nick.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pearl: {
    description: "Shimmers in the sun.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pipi: {
    description: "Plebidonax deltoides, found in the Pacific Ocean.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Seaweed: {
    description: "Seaweed.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sand Drill": {
    description: "Drill deep for uncommon or rare treasure",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Block Buck": {
    description: "A valuable token in Sunflower Land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Gem: {
    description: "A valuable gem in Sunflower Land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Squeaky Chicken": {
    description: "Squeaky Chicken",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Valentine Bear": {
    description:
      "A bear for those who love. Awarded to people who showed some love",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Easter Bear": {
    description: "A bear with bunny ears?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Easter Bush": {
    description: "What is inside?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Giant Carrot": {
    description:
      "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Iron Idol": {
    description: "The Idol adds 1 iron every time you mine iron.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Drops",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin Roast": {
    description:
      "A traditional Bumpkin dish. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Brunch": {
    description: "A traditional Goblin dish. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fruit Salad": {
    description: "Fruit Salad. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Omelette": {
    description: "A healthy breakfast. You can can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbers n Mash": {
    description:
      "Cabbages and Mashed Potatoes. You can can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fancy Fries": {
    description: "Fantastic Fries. You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Solar Flare Ticket": {
    description: "A ticket used during the Solar Flare Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Breaker Ticket": {
    description: "A ticket used during the Dawn Breaker Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crow Feather": {
    description: "A ticket used during the Witches' Eve Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mermaid Scale": {
    description: "A ticket used during the Catch the Kraken Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Tulip Bulb": {
    description: "A ticket used during the Spring Blossom",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Scroll: {
    description: "A ticket used during the Clash of Factions Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Amber Fossil": {
    description: "A ticket used during the Pharaoh's Treasure Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflower Supporter": {
    description: "A true supporter of the project",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Palm Tree": {
    description: "Tall, beachy, shady and chic, palm trees make waves sashay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Beach Ball": {
    description: "Bouncy ball brings beachy vibes, blows boredom away.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Karkinos: {
    description:
      "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pablo The Bunny": {
    description: "The magical bunny that increases your carrot harvests",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Carrot Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Crop Plot": {
    description: "A precious piece of soil used to plant crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fruit Patch": {
    description: "A bountiful piece of land used to plant fruit",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Flower Bed": {
    description: "A beautiful piece of land used to plant flowers",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gold Rock": {
    description: "A scarce resource that can be used to mine gold",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Rock": {
    description: "Wow, a shiny iron rock. Used to mine iron ore",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Stone Rock": {
    description: "A staple mineral for your mining journey",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fused Stone Rock": {
    description: "An upgraded resource that can be used to mine stone",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Reinforced Stone Rock": {
    description: "An upgraded resource that can be used to mine stone",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimstone Rock": {
    description: "A rare resource used to mine crimstones",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunstone Rock": {
    description: "A radiant gem, essential for advanced crafting.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Oil Reserve": {
    description: "A valuable resource used to mine oil",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lava Pit": {
    description: "A source of obsidian",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Boulder: {
    description: "???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tree: {
    description: "Nature's most precious resource. Used to collect wood",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Basic Land": {
    description: "Build your farming empire with this basic piece of land",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dirt Path": {
    description: "Keep your farmer boots clean and travel on paths!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Bush: {
    description: "Keep your Bumpkins happy with these bushy bushes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Fence: {
    description: "Those cheeky chickens won't be escaping anymore!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Shrub: {
    description:
      "It aint much, but it adds some green to your beautiful island",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pine Tree": {
    description: "Standing tall and mighty, a needle-clad dream.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Stone Fence": {
    description: "Embrace the timeless elegance of a stone fence.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Field Maple": {
    description:
      "A petite charmer that spreads its leaves like a delicate green canopy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Maple": {
    description: "Fiery foliage and a heart full of autumnal warmth.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Maple": {
    description: "Radiating brilliance with its shimmering golden leaves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Breaker Banner": {
    description:
      "A mysterious darkness is plaguing Sunflower Land. The mark of a participant in the Dawn Breaker Season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Solar Flare Banner": {
    description:
      "The temperature is rising in Sunflower Land. The mark of a participant in our inaugural chapterr.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Witches' Eve Banner": {
    description:
      "The chapter of the witch has begun. The mark of a participant in the Witches' Eve Season.\n\nGrants 2 extra crow feathers per feather delivery during Witches' Eve Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Crow Feathers from Deliveries",
        value: 2,
      },
    ],
  },
  "Catch the Kraken Banner": {
    description:
      "The Kraken is here! The mark of a participant in the Catch the Kraken Season.\n\nGrants 2 extra mermaid scales per mermaid scale delivery during Catch the Kraken Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Mermaid Scales from Deliveries",
        value: 2,
      },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Catch the Kraken Season",
        value: 10,
      },
    ],
  },
  "Spring Blossom Banner": {
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Tulip from Deliveries",
        value: 2,
      },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Spring Blossom Season",
        value: 10,
      },
    ],
  },
  "Clash of Factions Banner": {
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Clash of Factions Season",
        value: 10,
      },
    ],
  },
  "Pharaoh's Treasure Banner": {
    description: "The mark of a participant in the Pharaoh's Treasure Season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Pharaoh's Treasure Season",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Extra Amber Fossils from Deliveries and Chores",
        value: 2,
      },
    ],
  },
  "Lifetime Farmer Banner": {
    description: "Gives lifetime access to all seasons and VIP access.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Extra Seasonal Tickets from Deliveries and Chores",
        value: 2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Luminous Lantern": {
    description: "A bright paper lantern that illuminates the way.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Radiance Lantern": {
    description: "A radiant paper lantern that shines with a powerful light.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ocean Lantern": {
    description:
      "A wavy paper lantern that sways with the bobbing of the tide.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Aurora Lantern": {
    description:
      "A paper lantern that transforms any space into a magical wonderland.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Solar Lantern": {
    description:
      "Harnessing the vibrant essence of sunflowers, the Solar Lantern emanates a warm and radiant glow, reminiscent of a blossoming field under the golden sun.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bonnie's Tombstone": {
    description:
      "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chestnut Fungi Stool": {
    description:
      "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimson Cap": {
    description:
      "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Umbrella Seat": {
    description:
      "Keep those Eggplants dry during those rainy days with the Dawn Umbrella Seat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Eggplant Grill": {
    description:
      "Get cooking with the Eggplant Grill, perfect for any outdoor meal.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Giant Dawn Mushroom": {
    description:
      "The Giant Dawn Mushroom is a majestic and magical addition to any farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grubnash's Tombstone": {
    description: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mahogany Cap": {
    description:
      "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Shroom Glow": {
    description:
      "Illuminate your farm with the enchanting glow of Shroom Glow.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Toadstool Seat": {
    description: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Clementine: {
    description:
      "The Clementine Gnome is a cheerful companion for your farming adventures.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cobalt: {
    description:
      "The Cobalt Gnome adds a pop of color to your farm with his vibrant hat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mushroom House": {
    description:
      "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mushroom Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Purple Trail": {
    description:
      "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Obie: {
    description: "A fierce eggplant soldier",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Eggplant Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Maximus: {
    description: "Squash the competition with plump Maximus",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Hoot: {
    description: "Hoot hoot! Have you solved my riddle yet?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Radish, Wheat, Kale, Rice & Barley",
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Genie Bear": {
    description: "Exactly what I wished for!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Basic Scarecrow": {
    description: "Choosy defender of your farm's VIP (Very Important Plants)",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_percentage",
        trait_type: "Basic Crop Growth Time",
        value: -20,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Compass": {
    description:
      "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Turtle": {
    description:
      "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.5,
      },
      {
        display_type: "boost_number",
        trait_type: "Minerals Affected",
        value: 8,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tin Turtle": {
    description:
      "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Drops",
        value: 0.1,
      },
      {
        display_type: "boost_number",
        trait_type: "Stone Affected",
        value: 8,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Old Bottle": {
    description: "Antique pirate bottle, echoing tales of high seas adventure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beta Bear": {
    description: "A bear found during special testing events",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Bale: {
    description:
      "A poultry's favorite neighbor, providing a cozy retreat for chickens",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sir Goldensnout": {
    description:
      "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.5,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 12,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Scary Mike": {
    description:
      "The veggie whisperer and champion of frightfully good harvests!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Medium Crop Yield",
        value: 0.2,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Betty Lantern": {
    description: "It looks so real! I wonder how they crafted this.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Lantern": {
    description: "A scary looking lantern",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin Lantern": {
    description: "Moving closer you hear murmurs of a living Bumpkin...creepy!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Eggplant Bear": {
    description: "The mark of a generous eggplant whale.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dawn Flower": {
    description:
      "Embrace the radiant beauty of the Dawn Flower as its delicate petals shimmer with the first light of day.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Laurie the Chuckle Crow": {
    description:
      "With her disconcerting chuckle, she shooes peckers away from your crops!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Advanced Crop Yield",
        value: 0.2,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Freya Fox": {
    description:
      "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Pumpkin Yield",
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Gold Pass": {
    description:
      "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "El Pollo Veloz": {
    description: "Give me those eggs, fast! Chickens sleep 2 hours shorter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Egg Production Time (hours)",
        value: -2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Poppy: {
    description: "The mystical corn kernel. +0.1 Corn per harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grain Grinder": {
    description:
      "Grind your grain and experience a delectable surge in Cake XP.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cake XP",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Kernaldo: {
    description: "The magical corn whisperer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Corn Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Queen Cornelia": {
    description:
      "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 10,
      },
    ],
  },
  Candles: {
    description:
      "Enchant your farm with flickering spectral flames during Witches' Eve.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Haunted Stump": {
    description: "Summon spirits and add eerie charm to your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Spooky Tree": {
    description: "A hauntingly fun addition to your farm's decor!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Observer: {
    description:
      "A perpetually roving eyeball, always vigilant and ever-watchful!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Crow Rock": {
    description: "A crow perched atop a mysterious rock.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mini Corn Maze": {
    description:
      "A memento of the beloved maze from the 2023 Witches' Eve chapter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin ganoush": {
    description: "Zesty roasted eggplant spread.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Cornbread: {
    description: "Hearty golden farm-fresh bread.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Eggplant Cake": {
    description: "Sweet farm-fresh dessert surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Popcorn: {
    description: "Classic homegrown crunchy snack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Cabbage": {
    description: "A giant cabbage!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Potato": {
    description: "A giant potato!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Pumpkin": {
    description: "A giant pumpkin!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Carrot": {
    description: "A lab grown carrot! +0.2 Carrot Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Carrot Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Pumpkin": {
    description: "A lab grown pumpkin! +0.3 Pumpkin Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Pumpkin Yield",
        value: 0.3,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Radish": {
    description: "A lab grown radish! +0.4 Radish Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Radish Yield",
        value: 0.4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potion Ticket": {
    description: "A Potion Ticket!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Adirondack Potato": {
    description: "A rugged spud, Adirondack style!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Black Magic": {
    description: "A dark and mysterious flower!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Helios": {
    description: "Sun-kissed grandeur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Chiogga: {
    description: "A rainbow beet!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Cauliflower": {
    description: "A regal purple cauliflower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warty Goblin Pumpkin": {
    description: "A whimsical, wart-covered pumpkin",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Carrot": {
    description: "A pale carrot with pale roots",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Compass": {
    description:
      "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bud Ticket": {
    description:
      "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bud Seedling": {
    description: "A seedling that was exchanged for a bud NFT",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Town Sign": {
    description: "Show your farm ID with pride!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Crow": {
    description: "A mysterious and ethereal white crow.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Compost Bin": {
    description:
      "Creates a nurturing Sprout Mix compost and unearths Earthworm bait for your fishing adventures!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Turbo Composter": {
    description:
      "Produces a bountiful Fruitful Blend compost and discovers Grub bait eager to join you in fishing!", // Rapid Root has been moved here on testnet
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Premium Composter": {
    description:
      "Generates a robust Rapid Root compost mix and reveals Red Wiggler bait for the perfect fishing expedition!", // Fruitful Blend has been moved here on testnet
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Earthworm: {
    description: "A wriggly worm used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Grub: {
    description: "A juicy grub used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Wiggler": {
    description: "A red wiggler used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fishing Lure": {
    description: "A fishing lure! Great for catching big fish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sprout Mix": {
    description: "Sprout Mix increases your crop yield from plots by +0.2",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Fruitful Blend": {
    description:
      "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Rapid Root": {
    description: "Rapid Root reduces crop growth time from plots by 50%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Isopod: {
    description:
      "A hardy crustacean that curls up for protection and eats detritus.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Crab": {
    description:
      "A feisty blue-clawed crab prized for its speed and tasty meat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Lobster: {
    description: "Claws like armored legends, watch your fingers!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hermit Crab": {
    description: "Borrows abandoned shells to create its mobile fortress.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Shrimp: {
    description:
      "Zips through the water with see-through speed, never stays still.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Mussel: {
    description: "Clings tight to rocks and filters flavors from the current.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Oyster: {
    description: "Mysterious shell—open it for pearls or just salty attitude.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Anemone: {
    description:
      "Tentacles sway hypnotically, turning curious fish into guests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Barnacle: {
    description:
      "Attaches to anything and doesn't let go, standing guard on the tide.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Slug": {
    description:
      "A sea slug that lives in the ocean and is known for its unique appearance.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Snail": {
    description: "Glides patiently, wearing its spiral home on its back.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Garden Eel": {
    description: "Peeks from sandy burrows, swaying in underwater gardens.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Grapes": {
    description: "Tiny green pearls; sea creatures munch them like candy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Octopus: {
    description:
      "Vanishing act extraordinaire, with eight arms and endless surprises.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Urchin": {
    description: "A spiky purple mystery nestled in underwater crevices.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Horseshoe Crab": {
    description: "Ancient survivor with a helmet shell and tail like a sword.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crustacean" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Anchovy: {
    description: "The ocean's pocket-sized darting acrobat, always in a hurry!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Butterflyfish: {
    description:
      "A fish with a fashion-forward sense, flaunting its vivid, stylish stripes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Blowfish: {
    description:
      "The round, inflated comedian of the sea, guaranteed to bring a smile.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Clownfish: {
    description:
      "The underwater jester, sporting a tangerine tuxedo and a clownish charm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Bass": {
    description:
      "Your 'not-so-exciting' friend with silver scales – a bassic catch!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Horse": {
    description:
      "The ocean's slow-motion dancer, swaying gracefully in the aquatic ballet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Horse Mackerel": {
    description:
      "A speedster with a shiny coat, always racing through the waves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Squid: {
    description: "The deep-sea enigma with tentacles to tickle your curiosity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Snapper": {
    description: "A catch worth its weight in gold, dressed in fiery crimson.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Moray Eel": {
    description: "A slinky, sinister lurker in the ocean's shadowy corners.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Olive Flounder": {
    description:
      "The seabed's master of disguise, always blending in with the crowd.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Napoleanfish: {
    description: "Meet the fish with the Napoleon complex – short, but regal!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Surgeonfish: {
    description: "The ocean's neon warrior, armed with a spine-sharp attitude.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Zebra Turkeyfish": {
    description:
      "Stripes, spines, and a zesty disposition, this fish is a true showstopper!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Ray: {
    description:
      "The underwater glider, a serene winged beauty through the waves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hammerhead shark": {
    description:
      "Meet the shark with a head for business, and a body for adventure!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tuna: {
    description:
      "The ocean's muscle-bound sprinter, ready for a fin-tastic race!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mahi Mahi": {
    description:
      "A fish that believes in living life colorfully with fins of gold.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Marlin": {
    description:
      "An oceanic legend, the marlin with an attitude as deep as the sea.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Oarfish: {
    description: "The long and the long of it – an enigmatic ocean wanderer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Football fish": {
    description:
      "The MVP of the deep, a bioluminescent star that's ready to play!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sunfish: {
    description:
      "The ocean's sunbather, basking in the spotlight with fins held high.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Coelacanth: {
    description:
      "A prehistoric relic, with a taste for the past and the present.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Whale Shark": {
    description:
      "The gentle giant of the deep, sifting treasures from the ocean's buffet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barred Knifejaw": {
    description:
      "An oceanic outlaw with black-and-white stripes and a heart of gold.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Saw Shark": {
    description:
      "With a saw-like snout, it's the ocean's carpenter, always cutting edge!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Shark": {
    description:
      "The shark with a killer smile, ruling the seas with fin-tensity!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Twilight Anglerfish": {
    description:
      "A deep-sea angler with a built-in nightlight, guiding its way through darkness.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Starlight Tuna": {
    description:
      "A tuna that outshines the stars, ready to light up your collection.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radiant Ray": {
    description:
      "A ray that prefers to glow in the dark, with a shimmering secret to share.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Yield",
        value: 0.1,
      },
    ],
  },
  "Phantom Barracuda": {
    description:
      "An elusive and ghostly fish of the deep, hiding in the shadows.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gilded Swordfish": {
    description:
      "A swordfish with scales that sparkle like gold, the ultimate catch!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Yield",
        value: 0.1,
      },
    ],
  },
  "Giant Isopod": {
    description:
      "A hardy crustacean that curls up for protection and eats detritus.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Nautilus: {
    description:
      "A sea-dwelling snail with a hard shell, swimming through the depths.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Dollocaris: {
    description:
      "A deep-sea fish with a long, sharp dorsal fin, swimming through the depths.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimson Carp": {
    description: "A rare, vibrant jewel of the Spring waters.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield",
        value: 0.05,
      },
    ],
  },
  "Battle Fish": {
    description: "The rare armored swimmer of faction chapter!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 0.05,
      },
    ],
  },
  "Lemon Shark": {
    description:
      "A zesty, zippy swimmer of the Summer seas. Only available during Pharaoh's Treasure chapter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      // Will be automatically tradable post Pharaoh's Treasure Season
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 0.2,
      },
    ],
  },
  "Longhorn Cowfish": {
    description:
      "A peculiar boxfish with horn-like spines, swimming through the seas with bovine grace.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Milk" },
      {
        display_type: "boost_number",
        trait_type: "Increase Milk Yield",
        value: 0.2,
      },
    ],
  },
  Chowder: {
    description:
      "Sailor's delight in a bowl! Dive in, there's treasure inside!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Gumbo: {
    description: "A pot full of magic! Every spoonful's a Mardi Gras parade!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fermented Fish": {
    description: "Daring delicacy! Unleash the Viking within with every bite!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lifeguard Ring": {
    description: "Stay afloat with style, your seaside savior!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Surfboard: {
    description: "Ride the waves of wonder, beach bliss on board!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hideaway Herman": {
    description: "Herman's here to hide, but always peeks for a party!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Shifty Sheldon": {
    description: "Sheldon's sly, always scuttling to the next sandy surprise!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tiki Torch": {
    description: "Light the night, tropical vibes burning bright!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Beach Umbrella": {
    description: "Shade, shelter, and seaside chic in one sunny setup!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sapo Docuras": {
    description: "A real treat this halloween!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sapo Travessuras": {
    description: "Oh oh....someone was naughty!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Walrus: {
    description:
      "With his trusty tusks and love for the deep, he'll ensure you reel in an extra fish every time",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fish Yield",
        value: 1,
      },
      { trait_type: "Boost", value: "Fish" },
    ],
  },
  Alba: {
    description:
      "With her keen instincts, she ensures you get a little extra splash in your catch. 50% chance of +1 Basic Fish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of getting an extra Basic Fish",
        value: 50,
      },
      { trait_type: "Boost", value: "Fish" },
    ],
  },
  "Knowledge Crab": {
    description:
      "The Knowledge Crab doubles your Sprout Mix effect, making your soil treasures as rich as sea plunder!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Sprout Mix Effect",
        value: 100,
      },
      { trait_type: "Boost", value: "Crop" },
    ],
  },
  Anchor: {
    description:
      "Drop anchor with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },

  "Rubber Ducky": {
    description:
      "Float on fun with this classic quacker, bringing bubbly joy to every corner!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Kraken Head": {
    description:
      "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Kraken Tentacle": {
    description: "Protect the beach and catch the Kraken!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Banana Chicken": {
    description: "A chicken that boosts bananas. What a world we live in.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Banana Drops",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Crim Peckster": {
    description: "A gem detective with a knack for unearthing Crimstones.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Alien Chicken": {
    description:
      "A peculiar chicken from another galaxy, here to boost your feather production!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Feather Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Mootant: {
    description:
      "This genetically enhanced bovine here to boost your leather production!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Leather Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Toxic Tuft": {
    description:
      "A mutated sheep whose toxic fleece produces the finest merino wool in the land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Merino Wool Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Knight Chicken": {
    description: "A strong and noble chicken boosting your oil yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pharaoh Chicken": {
    description: "A ruling chicken, +1 Dig.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Skill Shrimpy": {
    description:
      "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Fish XP",
        value: 20,
      },
    ],
  },

  "Soil Krabby": {
    description:
      "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Composter Compost Time",
        value: -10,
      },
    ],
  },

  Nana: {
    description:
      "This rare beauty is a surefire way to boost your banana harvests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Banana Growth Time",
        value: -10,
      },
    ],
  },

  "Banana Blast": {
    description: "The ultimate fruity fuel for those with a peel for power!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Time Warp Totem": {
    description:
      "The Time Warp Totem temporarily boosts your cooking, crops, fruits, trees & mineral time. Make the most of it!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking, Crop, Fruit, Tree and Mineral Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Community Coin": {
    description: "A valued coin that can be exchanged for rewards",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Arcade Token": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Bumpkin Nutcracker": {
    description: "A festive decoration from 2023.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Festive Tree": {
    description:
      "A festive tree that can be attained each festive season. I wonder if it is big enough for santa to see?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },

  "Grinx's Hammer": {
    description:
      "The magical hammer from Grinx, the legendary Goblin Blacksmith. Halves expansion natural resource requirements.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Expansion Resources cost reduction",
        value: -50,
      },
    ],
  },
  Angelfish: {
    description:
      "The aquatic celestial beauty, adorned in a palette of vibrant hues.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Parrotfish: {
    description:
      "A kaleidoscope of colors beneath the waves, this fish is nature's living artwork.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Halibut: {
    description:
      "The flat ocean floor dweller, a master of disguise in sandy camouflage.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Festive Fox": {
    description: "The blessing of the White Fox inhabits the generous farms.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  House: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  // TODO feat/manor
  Manor: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Mansion: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crop Machine": {
    description:
      "Technology arrives at the farm! Crop Machine is here to help!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Rug: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Wardrobe: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Farmhand Coupon": {
    description: "A coupon to exchange for a farm hand of your choice.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Farmhand: {
    description: "A helpful farmhand to assist you with your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Beehive: {
    name: "Beehive",
    description:
      "A bustling beehive, producing honey from actively growing flowers; 10% chance upon Honey harvest to summon a bee swarm which will pollinate all growing crops with a +0.2 boost!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
      // Bee Swarm Boost
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Crop Critical Hit Amount",
        value: 0.2,
      },
    ],
  },
  "Red Pansy": {
    name: "Red Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Pansy": {
    name: "Yellow Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Pansy": {
    name: "Purple Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Pansy": {
    name: "White Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Pansy": {
    name: "Blue Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Cosmos": {
    name: "Red Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Cosmos": {
    name: "Yellow Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Cosmos": {
    name: "White Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Cosmos": {
    name: "White Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Cosmos": {
    name: "Blue Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Balloon Flower": {
    name: "Red Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Balloon Flower": {
    name: "Yellow Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Balloon Flower": {
    name: "Purple Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Balloon Flower": {
    name: "White Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Balloon Flower": {
    name: "Blue Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Carnation": {
    name: "Red Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Carnation": {
    name: "Yellow Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Carnation": {
    name: "Purple Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Carnation": {
    name: "White Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Carnation": {
    name: "Blue Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Humming Bird": {
    name: "Humming Bird",
    description:
      "A tiny jewel of the sky, the Humming Bird flits with colorful grace.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 20,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Queen Bee": {
    name: "Queen Bee",
    description:
      "Majestic ruler of the hive, the Queen Bee buzzes with regal authority.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Honey Production Speed",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Fox": {
    name: "Flower Fox",
    description:
      "The Flower Fox, a playful creature adorned with petals, brings joy to the garden.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hungry Caterpillar": {
    name: "Hungry Caterpillar",
    description:
      "Munching through leaves, the Hungry Caterpillar is always ready for a tasty adventure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_number",
        trait_type: "Cost of Flower Seeds",
        value: 0,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunrise Bloom Rug": {
    name: "Sunrise Bloom Rug",
    description:
      "Step onto the Sunrise Bloom Rug, where petals dance around a floral sunrise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Rug": {
    name: "Flower Rug",
    description: "Add a touch of nature's elegance to your home.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tea Rug": {
    name: "Tea Rug",
    description:
      "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Green Field Rug": {
    name: "Green Field Rug",
    description:
      "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blossom Royale": {
    name: "Blossom Royale",
    description:
      "The Blossom Royale, a giant flower in vibrant blue and pink, stands in majestic bloom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Rainbow: {
    name: "Rainbow",
    description:
      "A cheerful Rainbow, bridging sky and earth with its colorful arch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Enchanted Rose": {
    name: "Enchanted Rose",
    description:
      "The Enchanted Rose, a symbol of eternal beauty, captivates with its magical allure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Cart": {
    name: "Flower Cart",
    description:
      "The Flower Cart, brimming with blooms, is a mobile garden of floral delights.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Capybara: {
    name: "Capybara",
    description:
      "The Capybara, a laid-back friend, enjoys lazy days by the water's edge.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Prism Petal": {
    name: "Prism Petal",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Celestial Frostbloom": {
    name: "Celestial Frostbloom",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Primula Enigma": {
    name: "Primula Enigma",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Blossombeard: {
    description:
      "The Blossombeard Gnome is a powerful companion for your farming adventures.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 10,
      },
    ],
  },

  "Desert Gnome": {
    description: "A gnome that can survive the harshest of conditions.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Cooking" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -10,
      },
    ],
  },
  "Volcano Gnome": {
    name: "Volcano Gnome",
    description:
      "A mineral obsessed gnome that can survive the harshest of conditions.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Minerals" },
      {
        display_type: "boost_percentage",
        trait_type: "Mineral Production",
        value: 0.1,
      },
    ],
  },

  "Red Daffodil": {
    name: "Red Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Daffodil": {
    name: "Yellow Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Daffodil": {
    name: "Purple Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Daffodil": {
    name: "White Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Daffodil": {
    name: "Blue Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Lotus": {
    name: "Red Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Lotus": {
    name: "Yellow Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Lotus": {
    name: "Purple Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Lotus": {
    name: "White Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Lotus": {
    name: "Blue Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Earn Alliance Banner": {
    name: "Earn Alliance Banner",
    description:
      "A special event banner. Gave a starter bonus of 2x XP in February 2024 for players on the beginner island.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Treasure Key": {
    name: "Treasure Key",
    description:
      "A magic key that can unlock the basic chest located in the plaza near Tywin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Luxury Key": {
    name: "Luxury Key",
    description:
      "A magic key that can unlock the luxury chest located in the plaza near Bert.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Rare Key": {
    name: "Rare Key",
    description:
      "A magic key that can unlock the rare chest located in the south of the beach.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Prize Ticket": {
    name: "Prize Ticket",
    description:
      "A prized ticket. You can use it to enter the monthly goblin raffle.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Baby Panda": {
    name: "Baby Panda",
    description:
      "A baby panda earned during the Gas Hero collaboration event. Gives new players double XP during March 2024.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Baozi: {
    name: "Baozi",
    description:
      "A delicious steamed bun. A special event item from Lunar New Year 2024.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Community Egg": {
    name: "Community Egg",
    description: "Wow, you must really care about the community",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hungry Hare": {
    name: "Hungry Hare",
    description:
      "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Fermented Carrots XP",
        value: 100,
      },
    ],
  },
  "Sunflorian Faction Banner": {
    name: "Sunflorian Faction Banner",
    description:
      "A banner that shows your allegiance to the Sunflorian Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Faction Banner": {
    name: "Goblin Faction Banner",
    description: "A banner that shows your allegiance to the Goblin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Faction Banner": {
    name: "Nightshade Faction Banner",
    description:
      "A banner that shows your allegiance to the Nightshade Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Faction Banner": {
    name: "Bumpkin Faction Banner",
    description: "A banner that shows your allegiance to the Bumpkin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Turbo Sprout": {
    name: "Turbo Sprout",
    description: "An engine that reduces the Greenhouse's growth time by 50%.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Growth Time in Greenhouse",
        value: -50,
      },
    ],
  },

  Soybliss: {
    name: "Soybliss",
    description: "A unique soy creature that gives +1 Soybean yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Soybean Yield",
        value: 1,
      },
    ],
  },

  "Grape Granny": {
    name: "Grape Granny",
    description: "Wise matriarch nurturing grapes to flourish with +1 yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: 1,
      },
    ],
  },

  "Royal Throne": {
    name: "Royal Throne",
    description: "A throne fit for the highest ranking farmer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Lily Egg": {
    name: "Lily Egg",
    description: "Tiny delight, grand beauty, endless wonder.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  Goblet: {
    name: "Goblet",
    description: "A goblet that holds the finest of wines.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Fancy Rug": {
    name: "Fancy Rug",
    description: "A rug that adds a touch of elegance to any room.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Clock: {
    name: "Clock",
    description:
      "A Clock that keeps time with the gentle ticking of the seasons.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Vinny: {
    name: "Vinny",
    description: "Vinny, a friendly grapevine, is always ready for a chat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: +0.25,
      },
    ],
  },
  "Beetroot Blaze": {
    name: "Beetroot Blaze",
    description: "A spicy beetroot-infused magic mushroom dish",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rapid Roast": {
    name: "Rapid Roast",
    description: "When you are in a hurry",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Shroom Syrup": {
    name: "Shroom Syrup",
    description: "The essence of bees and enchanted fungi",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gaucho Rug": {
    name: "Gaucho Rug",
    description: "A commerative rug to support South Brazil.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bullseye Board": {
    name: "Bullseye Board",
    description: "Hit the mark every time!",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Chess Rug": {
    name: "Chess Rug",
    description: "Checkmate.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cluckapult: {
    name: "Cluckapult",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Gallant": {
    name: "Golden Gallant",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Garrison": {
    name: "Golden Garrison",
    description:
      "Defend your territory in style with this shimmering garrison, a true fortress of flair.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Guardian": {
    name: "Golden Guardian",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Novice Knight": {
    name: "Novice Knight",
    description: "Every move is an adventure.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Regular Pawn": {
    name: "Regular Pawn",
    description:
      "Small but mighty! This pawn may just make a big move in your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rookie Rook": {
    name: "Rookie Rook",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Silver Sentinel": {
    name: "Silver Sentinel",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Silver Squire": {
    name: "Silver Squire",
    description: "Add some shine to your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Silver Stallion": {
    name: "Silver Stallion",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Trainee Target": {
    name: "Trainee Target",
    description:
      "Every champion starts somewhere! Perfect your aim with the Trainee Target.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Twister Rug": {
    name: "Twister Rug",
    description:
      "Twist, turn, and tie your decor together with this playful rug.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Battlecry Drum": {
    name: "Battlecry Drum",
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grape Seed": {
    name: "Grape Seed",
    description: "A zesty and desired fruit.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Olive Seed": {
    name: "Olive Seed",
    description: "A luxury for advanced farmers.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rice Seed": {
    name: "Rice Seed",
    description: "Perfect for rations...",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Grape: {
    name: "Grape",
    description: "A zesty and desired fruit.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Olive: {
    name: "Olive",
    description: "A luxury for advanced farmers.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Rice: {
    name: "Rice",
    description: "Perfect for rations...",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Juice": {
    name: "Carrot Juice",
    description: "Refreshing drink from farm-fresh carrots",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Seafood Basket": {
    name: "Seafood Basket",
    description: "A bountiful basket of fresh ocean delights",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Burger": {
    name: "Fish Burger",
    description: "Succulent burger made with freshly caught fish",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish n Chips": {
    name: "Fish n Chips",
    description: "Crispy chips paired with tender fish fillets",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Omelette": {
    name: "Fish Omelette",
    description: "Fluffy omelette with a flavorful fish filling",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fried Calamari": {
    name: "Fried Calamari",
    description: "Crispy calamari rings, a seafood delight",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fried Tofu": {
    name: "Fried Tofu",
    description: "Crispy tofu bites, a vegetarian favorite",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Grape Juice": {
    name: "Grape Juice",
    description: "Sweet and refreshing juice from sun-ripened grapes",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ocean's Olive": {
    name: "Ocean's Olive",
    description: "Savor the taste of the sea with these ocean-infused olives",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Quick Juice": {
    name: "Quick Juice",
    description: "A swift and energizing juice for busy days",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rice Bun": {
    name: "Rice Bun",
    description: "Soft buns made with rice flour, perfect for snacking",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Slow Juice": {
    name: "Slow Juice",
    description: "Slowly pressed juice for a burst of natural flavors",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Steamed Red Rice": {
    name: "Steamed Red Rice",
    description: "Nutritious red rice, steamed to perfection",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sushi Roll": {
    name: "Sushi Roll",
    description: "Delicious sushi rolls filled with fresh ingredients",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "The Lot": {
    name: "The Lot",
    description: "A medley of fruits for the adventurous palate",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Tofu Scramble": {
    name: "Tofu Scramble",
    description: "Scrambled tofu with a mix of vegetables, a hearty breakfast",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Antipasto: {
    name: "Antipasto",
    description: "A selection of savory bites to start your meal",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Greenhouse: {
    name: "Greenhouse",
    description: "A safehaven for sensitive crops",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rice Panda": {
    name: "Rice Panda",
    description: "A smart panda never forgets to water the rice.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Rice Yield",
        value: 0.25,
      },
    ],
  },

  "Bumpkin Emblem": {
    name: "Bumpkin Emblem",
    description:
      "A symbol of the Bumpkin Faction. Show your support for the Bumpkin Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Goblin Emblem": {
    name: "Goblin Emblem",
    description:
      "A symbol of the Goblin Faction. Show your support for the Goblin Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Nightshade Emblem": {
    name: "Nightshade Emblem",
    description:
      "A symbol of the Nightshade Faction. Show your support for the Nightshade Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflorian Emblem": {
    name: "Sunflorian Emblem",
    description:
      "A symbol of the Sunflorian Faction. Show your support for the Sunflorian Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Mark: {
    name: "Mark",
    description: "Currency of the Factions. Use this in the Faction Shop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Benevolence Flag": {
    name: "Benevolence Flag",
    description:
      "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Devotion Flag": {
    name: "Devotion Flag",
    description:
      "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Generosity Flag": {
    name: "Generosity Flag",
    description:
      "For players who have donated substantial resources to the Goblins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Splendor Flag": {
    name: "Splendor Flag",
    description:
      "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Jelly Lamp": {
    name: "Jelly Lamp",
    description:
      "A decorative lamp that emits a light that emits a light that emits a light.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Paint Can": {
    name: "Paint Can",
    description: "A can of paint found during the Festival of Colors.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflorian Throne": {
    name: "Sunflorian Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Throne": {
    name: "Nightshade Throne",
    description: "A throne fit for a Nightshade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Throne": {
    name: "Goblin Throne",
    description: "A throne fit for a Goblin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Throne": {
    name: "Bumpkin Throne",
    description: "A throne fit for a Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Sunflorian Egg": {
    name: "Golden Sunflorian Egg",
    description: "A jewelled egg created by the House of Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Mischief Egg": {
    name: "Goblin Mischief Egg",
    description: "A jewelled egg created by the House of Goblin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Charm Egg": {
    name: "Bumpkin Charm Egg",
    description: "A jewelled egg created by the House of Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Veil Egg": {
    name: "Nightshade Veil Egg",
    description: "A jewelled egg created by the House of Nightshade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Goblin Goblet": {
    name: "Emerald Goblin Goblet",
    description: "An emerald encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Opal Sunflorian Goblet": {
    name: "Opal Sunflorian Goblet",
    description: "An opal encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sapphire Bumpkin Goblet": {
    name: "Sapphire Bumpkin Goblet",
    description: "A sapphire encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Amethyst Nightshade Goblet": {
    name: "Amethyst Nightshade Goblet",
    description: "An amethyst encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Faction Goblet": {
    name: "Golden Faction Goblet",
    description: "A golden goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ruby Faction Goblet": {
    name: "Ruby Faction Goblet",
    description: "A ruby encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Bunting": {
    name: "Sunflorian Bunting",
    description: "Colorful flags celebrating the Sunflorian Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Bunting": {
    name: "Nightshade Bunting",
    description: "Colorful flags celebrating the Nightshade Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Bunting": {
    name: "Goblin Bunting",
    description: "Colorful flags celebrating the Goblin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Bunting": {
    name: "Bumpkin Bunting",
    description: "Colorful flags celebrating the Bumpkin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Candles": {
    name: "Sunflorian Candles",
    description: "Sunflorian Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Candles": {
    name: "Nightshade Candles",
    description: "Nightshade Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Candles": {
    name: "Goblin Candles",
    description: "Goblin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Candles": {
    name: "Bumpkin Candles",
    description: "Bumpkin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Left Wall Sconce": {
    name: "Sunflorian Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Left Wall Sconce": {
    name: "Nightshade Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Left Wall Sconce": {
    name: "Goblin Left Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Left Wall Sconce": {
    name: "Bumpkin Left Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Right Wall Sconce": {
    name: "Sunflorian Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Right Wall Sconce": {
    name: "Nightshade Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Right Wall Sconce": {
    name: "Goblin Right Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Right Wall Sconce": {
    name: "Bumpkin Right Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gourmet Hourglass": {
    name: "Gourmet Hourglass",
    description: "Reduces cooking time by 50% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Cooking" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Harvest Hourglass": {
    name: "Harvest Hourglass",
    description: "Reduces crop growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 6,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Timber Hourglass": {
    name: "Timber Hourglass",
    description: "Reduces tree recovery time by 25% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Regeneration Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ore Hourglass": {
    name: "Ore Hourglass",
    description: "Reduces mineral replenish cooldown by 50% for 3 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Mineral Replenish Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 3,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Orchard Hourglass": {
    name: "Orchard Hourglass",
    description: "Reduces fruit growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Fruit Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 6,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blossom Hourglass": {
    name: "Blossom Hourglass",
    description: "Reduces flower growth time by 25% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fisher's Hourglass": {
    name: "Fisher's Hourglass",
    description: "Gives a 50% chance of +1 fish for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 50,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Hit Amount",
        value: 1,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Faction Rug": {
    name: "Sunflorian Faction Rug",
    description:
      "A magnificent rug made by the talented Sunflorian Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Faction Rug": {
    name: "Nightshade Faction Rug",
    description:
      "A magnificent rug made by the talented Nightshade Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Faction Rug": {
    name: "Goblin Faction Rug",
    description:
      "A magnificent rug made by the talented Goblin Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Faction Rug": {
    name: "Bumpkin Faction Rug",
    description:
      "A magnificent rug made by the talented Bumpkin Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  ...getKeys(DECORATION_TEMPLATES).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        description: "A beautiful collection for your Sunflower Land farm.",
        decimals: 0,
        attributes: [
          { trait_type: "Purpose", value: "Decoration" },
          { trait_type: "Tradable", value: "No" },
        ],
        external_url: "https://docs.sunflower-land.com/getting-started/about",
        name: key,
      },
    }),
    {} as Record<TemplateDecorationName, Metadata>,
  ),

  Caponata: {
    name: "Caponata",
    description: "A flavorful eggplant dish, perfect for sharing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Glazed Carrots": {
    name: "Glazed Carrots",
    description: "Sweet and savory carrots, a delightful side dish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Paella: {
    name: "Paella",
    description: "A classic Spanish dish, brimming with flavor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Desert Rose": {
    name: "Desert Rose",
    description:
      "A mutant flower that can be found during the Pharaoh's Treasure chapter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Chicory: {
    name: "Chicory",
    description:
      "A mutant flower that can be found during the Bull Run chapter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Camel Bone": {
    description: "Bones of an ancient camel, rumoured to transport artefacts",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cockle Shell": {
    description: "A beautiful shell.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Hieroglyph: {
    description: "Unlock the secrets of the hieroglyphs.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sand: {
    description: "It gets everywhere!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Scarab: {
    description: "Pharaoh's lost artefact.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Vase: {
    description: "A fragile item from ancient times",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hapy Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hapy Jar",
  },
  "Imsety Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Imsety Jar",
  },
  Cannonball: {
    description:
      "Cannonball is ferocious being. Residing in Tomato Bombard, it's ready to strike anyone who gets in its way",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Tomato Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cannonball",
  },
  Sarcophagus: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sarcophagus",
  },
  "Duamutef Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Duamutef Jar",
  },
  "Qebehsenuef Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Qebehsenuef Jar",
  },
  "Clay Tablet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Clay Tablet",
  },
  "Snake in Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Snake in Jar",
  },
  "Reveling Lemon": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reveling Lemon",
  },
  "Anubis Jackal": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Anubis Jackal",
  },
  Sundial: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sundial",
  },
  "Sand Golem": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sand Golem",
  },
  "Cactus King": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cactus King",
  },
  "Lemon Frog": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Lemon Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lemon Frog",
  },
  "Scarab Beetle": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Scarab Beetle",
  },
  "Adrift Ark": {
    description:
      "A sandcastle on the shore intricately crafted to resemble a capsized boat, complete with shell portholes and seaweed flags fluttering atop its sculpted hull.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Adrift Ark",
  },
  Castellan: {
    description:
      "Castellan is a charming sandcastle figure adorned with colorful accessories, symbolizing playful spirit and creativity.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Castellan",
  },
  "Sunlit Citadel": {
    description: "A Castle to show your pride",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunlit Citadel",
  },
  "Pharaoh Gnome": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Greenhouse Produce Yield",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pharaoh Gnome",
  },
  "Lemon Tea Bath": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Lemon Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lemon Tea Bath",
  },
  "Tomato Clown": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Tomato Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tomato Clown",
  },
  Pyramid: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pyramid",
  },
  Oasis: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oasis",
  },
  "Paper Reed": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paper Reed",
  },
  Camel: {
    description: "A mean looking camel!",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase Sand Yield",
        value: 1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Artefact Shop Bounty Price",
        value: 30,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Camel",
  },
  "Baobab Tree": {
    description:
      "Guardian of the desert, the Baobab Tree stands tall and proud.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Baobab Tree",
  },
  "Tomato Bombard": {
    description:
      "Home to Cannonball, and is ready to strike anyone who gets in its way",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Tomato Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tomato Bombard",
  },
  "Stone Beetle": {
    description: "Beetle made of stone. +0.1 Stone",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Stone Beetle",
  },
  "Iron Beetle": {
    description: "Beetle made of iron. +0.1 Iron",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Iron Beetle",
  },
  "Gold Beetle": {
    description: "Beetle made of gold. +0.1 Gold",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Beetle",
  },
  "Fairy Circle": {
    description: "Circle of fairy mushrooms. +0.2 Wild Mushroom",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wild Mushroom Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fairy Circle",
  },
  Squirrel: {
    description: "Squirrel likes hanging out in the forest. +0.1 Wood",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Squirrel",
  },
  Macaw: {
    description: "Macaw loves picking fruits. +0.1 Fruit Patch Yield",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Patch Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Macaw",
  },
  Butterfly: {
    description:
      "Butterfly loves the scent of flowers. 20% chance of +1 Flower",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 20,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Butterfly",
  },
  "Crafting Box": {
    description: "A box that allows you to craft items",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crafting Box",
  },
  "Basic Bed": {
    description: "A basic bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Bed",
  },
  "Fisher Bed": {
    description: "A fisherman's bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fisher Bed",
  },
  "Floral Bed": {
    description: "A floral bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Floral Bed",
  },
  "Sturdy Bed": {
    description: "A sturdy bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sturdy Bed",
  },
  "Desert Bed": {
    description: "A desert bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Bed",
  },
  "Cow Bed": {
    description: "A cow bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cow Bed",
  },
  "Pirate Bed": {
    description: "A pirate bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Bed",
  },
  "Royal Bed": {
    description: "A royal bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Bed",
  },
  Cushion: {
    description: "A cushion.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cushion",
  },
  Timber: {
    description: "A piece of timber.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Timber",
  },
  "Bee Box": {
    description: "A box for bees.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bee Box",
  },
  Crimsteel: {
    description: "A piece of crimsteel.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimsteel",
  },
  "Merino Cushion": {
    description: "A cushion made of merino wool.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merino Cushion",
  },
  "Kelp Fibre": {
    description: "A piece of kelp fibre.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Kelp Fibre",
  },
  "Hardened Leather": {
    description: "A piece of hardened leather.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hardened Leather",
  },
  "Synthetic Fabric": {
    description: "A piece of synthetic fabric.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Synthetic Fabric",
  },
  "Ocean's Treasure": {
    description: "A treasure from the ocean.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ocean's Treasure",
  },
  "Royal Bedding": {
    description: "A royal bedding.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Bedding",
  },
  "Royal Ornament": {
    description: "A royal ornament.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Ornament",
  },
  "Cow Scratcher": {
    description:
      "A rustic yet effective tool, perfect for giving cows a satisfying scratch after a long day in the fields. Keep your cattle happy and content!",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cow Scratcher",
  },
  "Spinning Wheel": {
    description:
      "An elegant piece of craftsmanship, this spinning wheel turns raw wool into fine thread, essential for crafting quality textiles.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spinning Wheel",
  },
  "Sleepy Rug": {
    description:
      "Cozy and inviting, this soft rug is perfect for an afternoon nap. It adds warmth and charm to any space.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sleepy Rug",
  },
  Meteorite: {
    description:
      "A rare and mysterious fragment from the stars, the meteorite is rumored to hold cosmic power.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Meteorite",
  },
  "Sheaf of Plenty": {
    description:
      "A bundle of barley harvested at peak ripeness, symbolizing abundance and the hard work of the season. +2 Barley",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Barley",
        value: 2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sheaf of Plenty",
  },
  "Mechanical Bull": {
    description:
      "A lively attraction and test of endurance! Hop on the Mechanical Bull and see if you can hold on.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mechanical Bull",
  },
  "Moo-ver": {
    description:
      "A unique contraption that keeps cows active and healthy. +0.25 Leather",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Leather",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moo-ver",
  },
  "Swiss Whiskers": {
    description:
      "A culinary genius in miniature form, this skilled chef elevates every cheese recipe with his expert touch. +500 Cheese Recipe XP",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cheese Recipe XP",
        value: 500,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Swiss Whiskers",
  },
  Cluckulator: {
    description:
      "This specialized scale accurately weighs each chicken, ensuring they receive the ideal feed portion for balanced growth and health, making poultry care more efficient and sustainable. -25% Feed to Chicken",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Chicken Feed Reduction",
        value: 25,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cluckulator",
  },
  "Crop Circle": {
    description:
      "A mysterious circle that appears on your farm...what could it mean?",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crop Circle",
  },
  UFO: {
    description:
      "This extraterrestrial craft is said to emit a soft glow and hum, creating an aura of wonder and curiosity.  Keep your eyes on the skies—who knows what otherworldly secrets it might unveil!",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "UFO",
  },
  Wagon: {
    description: "A perfect wagon for your bears to rest and relax.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wagon",
  },
  "Black Sheep": {
    description: "A black sheep has taken up residence on your farm.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Black Sheep",
  },
  Cheese: {
    name: "Cheese",
    description: "A delicious dairy delight made from fresh milk",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pizza Margherita": {
    name: "Pizza Margherita",
    description: "A classic Italian pizza with tomatoes and cheese",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Cheese": {
    name: "Blue Cheese",
    description: "A strong flavored cheese with blue mold",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Honey Cheddar": {
    name: "Honey Cheddar",
    description: "A sweet and savory cheese infused with honey",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Caprese Salad": {
    name: "Caprese Salad",
    description: "A fresh salad with cheese, tomatoes and kale",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sour Shake": {
    name: "Sour Shake",
    description: "A tangy and refreshing lemon drink",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Spaghetti al Limone": {
    name: "Spaghetti al Limone",
    description: "A zesty pasta dish with lemon and cheese",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lemon Cheesecake": {
    name: "Lemon Cheesecake",
    description: "A creamy cheesecake with a citrus twist",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "King of Bears": {
    name: "King of Bears",
    description:
      "The king of all bears. It has the power to generate more honey for  its own consumption.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Yield per full beehive",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Halloween Scarecrow": {
    name: "Halloween Scarecrow",
    description: "A scary looking scarecrow",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Vampire Bear": {
    name: "Vampire Bear",
    description: "Don't put me under the sun!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Super Totem": {
    name: "Super Totem",
    description:
      "2x speed for crops, trees, fruits, cooking & minerals. Lasts for 7 days",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking, Crop, Fruit, Tree and Mineral Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (days)",
        value: 7,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Trade Point": {
    description:
      "Earned from trading collectibles and wearables in marketplace. Can be exchanged for in-game rewards",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trade Point",
  },
  "Trade Cake": {
    description: "Cake purchased at Trade Rewards Shop.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trade Cake",
  },
  "Christmas Stocking": {
    name: "Christmas Stocking",
    description:
      "A classic festive stocking, perfect for filling with holiday treats and surprises.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Christmas Stocking": {
    name: "Golden Christmas Stocking",
    description:
      "A luxurious stocking with golden accents, adding an elegant touch to your Christmas decor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cozy Fireplace": {
    name: "Cozy Fireplace",
    description:
      "A warm and inviting fireplace that sets the perfect backdrop for holiday gatherings.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Christmas Rug": {
    name: "Christmas Rug",
    description:
      "A festive rug adorned with seasonal patterns to bring warmth and holiday spirit to your home.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Christmas Candle": {
    name: "Christmas Candle",
    description:
      "A glowing candle with a festive scent, ideal for creating a cozy and magical atmosphere.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Santa Penguin": {
    name: "Santa Penguin",
    description: "A penguin thats always ready for the festive season!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Penguin Pool": {
    name: "Penguin Pool",
    description:
      "Keep your eyes on these penguins or they will cause chaos on your island!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Snowman: {
    name: "Snowman",
    description: "A special snowman that for some reason never melts!?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Festive Toy Train": {
    name: "Festive Toy Train",
    description: "A special snowman that for some reason never melts!?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Cow": {
    description: "Feed cows for free!",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Feed Reduction",
        value: 100,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Cow",
  },
  Kite: {
    description: "Soar high with the winds and let your worries drift away.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Kite",
  },
  "Acorn House": {
    description:
      "A cozy woodland retreat, perfect for squirrels and dreamers alike.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Acorn House",
  },
  "Spring Duckling": {
    description:
      "Bright and chirpy, this little duckling welcomes the season with joy.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spring Duckling",
  },
  Igloo: {
    description:
      "Cold on the outside, cozy on the inside—home sweet frozen home.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Igloo",
  },
  "Ugly Duckling": {
    description:
      "Born different, misunderstood, but destined to become something truly magnificent.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ugly Duckling",
  },
  "Lake Rug": {
    description: "Bring the calm of a peaceful lake right into your home.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lake Rug",
  },
  Hammock: {
    description: "Sway gently with the breeze and enjoy a well-earned rest.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hammock",
  },
  Mammoth: {
    description: "An ancient giant, standing strong through the test of time.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Cow Produce Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mammoth",
  },
  "Cup of Chocolate": {
    description: "Warm, rich, and the perfect companion for a chilly day.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cup of Chocolate",
  },
  "Golden Sheep": {
    description:
      "A dazzling wonder, worth more than its weight in wool. Feed Sheeps for free!",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Feed Reduction",
        value: 100,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Sheep",
  },
  "Barn Blueprint": {
    description: "The foundation of every great farm begins with a solid plan.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Base Barn Animals",
        value: 5,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Max Barn Animals per Upgrade",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Barn Blueprint",
  },
  "Mama Duck": {
    description: "Protective, loving, and always leading her little ones home.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mama Duck",
  },
  "Summer Duckling": {
    description:
      "Basking in the sun, this duckling knows how to enjoy the heat.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Summer Duckling",
  },
  "Autumn Duckling": {
    description:
      "Crisp leaves and cozy feathers, ready for the harvest season.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Summer Duckling",
  },
  "Winter Duckling": {
    description:
      "Bundled up in downy feathers, this little one waddles through the winter wonderland with cheer.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Winter Duckling",
  },

  "Rhubarb Seed": {
    description: "A seed that grows into a tart, pink vegetable stalk.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rhubarb Seed",
  },
  "Zucchini Seed": {
    description: "A seed that grows into a versatile summer squash.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Zucchini Seed",
  },
  "Yam Seed": {
    description: "A seed that grows into a nutritious root vegetable.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yam Seed",
  },
  "Broccoli Seed": {
    description: "A seed that grows into a healthy green vegetable.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Broccoli Seed",
  },
  "Pepper Seed": {
    description: "A seed that grows into a spicy capsicum.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pepper Seed",
  },
  "Onion Seed": {
    description: "A seed that grows into a flavorful bulb vegetable.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Onion Seed",
  },
  "Turnip Seed": {
    description: "A seed that grows into a hardy root vegetable.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Turnip Seed",
  },
  "Artichoke Seed": {
    description: "A seed that grows into a unique edible flower bud.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Artichoke Seed",
  },
  Rhubarb: {
    description: "A tart, pink vegetable stalk perfect for pies and jams.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rhubarb",
  },
  Zucchini: {
    description: "A versatile summer squash that can be used in many dishes.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Zucchini",
  },
  Yam: {
    description: "A nutritious root vegetable rich in vitamins and minerals.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yam",
  },
  Broccoli: {
    description: "A healthy green vegetable packed with nutrients.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Broccoli",
  },
  Pepper: {
    description: "A spicy capsicum that adds flavor to any dish.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pepper",
  },
  Onion: {
    description: "A flavorful bulb vegetable essential for cooking.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Onion",
  },
  Turnip: {
    description: "A hardy root vegetable perfect for soups and stews.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Turnip",
  },
  Artichoke: {
    description: "A unique edible flower bud with a delicate flavor.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Artichoke",
  },
  "Duskberry Seed": {
    description: "A duskberry seed.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Duskberry Seed",
  },
  "Lunara Seed": {
    description: "A Lunara seed.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lunara Seed",
  },
  "Celestine Seed": {
    description: "A Celestine seed.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Celestine Seed",
  },
  Duskberry: {
    description: "A rare berry that grows in the dark.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Duskberry",
  },
  Lunara: {
    description: "A mysterious root that grows in the darkest of places.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lunara",
  },
  Celestine: {
    description: "A rare plant that grows in the darkest of places.",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Celestine",
  },
  "Red Edelweiss": {
    description: "A beautiful red edelweiss!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Edelweiss": {
    description: "A beautiful yellow edelweiss!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Edelweiss": {
    description: "A beautiful purple edelweiss!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Edelweiss": {
    description: "A beautiful white edelweiss!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Edelweiss": {
    description: "A beautiful blue edelweiss!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Gladiolus": {
    description: "A beautiful red gladiolus!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Gladiolus": {
    description: "A beautiful yellow gladiolus!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Gladiolus": {
    description: "A beautiful purple gladiolus!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Gladiolus": {
    description: "A beautiful white gladiolus!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Gladiolus": {
    description: "A beautiful blue gladiolus!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Lavender": {
    description: "A beautiful red lavender!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Lavender": {
    description: "A beautiful yellow lavender!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Lavender": {
    description: "A beautiful purple lavender!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Lavender": {
    description: "A beautiful white lavender!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Lavender": {
    description: "A beautiful blue lavender!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Clover": {
    description: "A beautiful red clover!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Clover": {
    description: "A beautiful yellow clover!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Clover": {
    description: "A beautiful purple clover!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Clover": {
    description: "A beautiful white clover!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Clover": {
    description: "A beautiful blue clover!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Porgy: {
    description: "A beautiful porgy!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Muskellunge: {
    description: "A beautiful muskellunge!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Trout: {
    description: "A beautiful trout!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Walleye: {
    description: "A beautiful walleye!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Weakfish: {
    description: "A beautiful weakfish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rock Blackfish": {
    description: "A beautiful rock blackfish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Cobia: {
    description: "A beautiful cobia!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tilapia: {
    description: "A beautiful tilapia!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Aged Anchovy": {
    description: "Aged anchovy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Anchovy",
  },
  "Aged Butterflyfish": {
    description: "Aged butterflyfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Butterflyfish",
  },
  "Aged Blowfish": {
    description: "Aged blowfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Blowfish",
  },
  "Aged Clownfish": {
    description: "Aged clownfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Clownfish",
  },
  "Aged Angelfish": {
    description: "Aged angelfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Angelfish",
  },
  "Aged Cobia": {
    description: "Aged cobia.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Cobia",
  },
  "Aged Halibut": {
    description: "Aged halibut.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Halibut",
  },
  "Aged Muskellunge": {
    description: "Aged muskellunge.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Muskellunge",
  },
  "Aged Parrotfish": {
    description: "Aged parrotfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Parrotfish",
  },
  "Aged Porgy": {
    description: "Aged porgy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Porgy",
  },
  "Aged Sea Bass": {
    description: "Aged sea bass.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Sea Bass",
  },
  "Aged Tilapia": {
    description: "Aged tilapia.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Tilapia",
  },
  "Aged Trout": {
    description: "Aged trout.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Trout",
  },
  "Aged Walleye": {
    description: "Aged walleye.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Walleye",
  },
  "Aged Weakfish": {
    description: "Aged weakfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Weakfish",
  },
  "Aged Rock Blackfish": {
    description: "Aged rock blackfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Rock Blackfish",
  },
  "Aged Sea Horse": {
    description: "Aged sea horse.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Sea Horse",
  },
  "Aged Horse Mackerel": {
    description: "Aged horse mackerel.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Horse Mackerel",
  },
  "Aged Squid": {
    description: "Aged squid.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Squid",
  },
  "Aged Red Snapper": {
    description: "Aged red snapper.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Red Snapper",
  },
  "Aged Moray Eel": {
    description: "Aged moray eel.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Moray Eel",
  },
  "Aged Olive Flounder": {
    description: "Aged olive flounder.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Olive Flounder",
  },
  "Aged Napoleanfish": {
    description: "Aged napoleanfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Napoleanfish",
  },
  "Aged Surgeonfish": {
    description: "Aged surgeonfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Surgeonfish",
  },
  "Aged Zebra Turkeyfish": {
    description: "Aged zebra turkeyfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Zebra Turkeyfish",
  },
  "Aged Ray": {
    description: "Aged ray.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Ray",
  },
  "Aged Hammerhead shark": {
    description: "Aged hammerhead shark.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Hammerhead shark",
  },
  "Aged Barred Knifejaw": {
    description: "Aged barred knifejaw.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Barred Knifejaw",
  },
  "Aged Tuna": {
    description: "Aged tuna.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Tuna",
  },
  "Aged Mahi Mahi": {
    description: "Aged mahi mahi.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Mahi Mahi",
  },
  "Aged Blue Marlin": {
    description: "Aged blue marlin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Blue Marlin",
  },
  "Aged Oarfish": {
    description: "Aged oarfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Oarfish",
  },
  "Aged Football fish": {
    description: "Aged football fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Football fish",
  },
  "Aged Sunfish": {
    description: "Aged sunfish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Sunfish",
  },
  "Aged Coelacanth": {
    description: "Aged coelacanth.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Coelacanth",
  },
  "Aged Whale Shark": {
    description: "Aged whale shark.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Whale Shark",
  },
  "Aged Saw Shark": {
    description: "Aged saw shark.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged Saw Shark",
  },
  "Aged White Shark": {
    description: "Aged white shark.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Aged White Shark",
  },
  "Prime Aged Anchovy": {
    description:
      "Aged to perfection, this anchovy boasts deep, concentrated flavors of the sea.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Anchovy",
  },
  "Prime Aged Butterflyfish": {
    description:
      "A butterflyfish with a refined flavor, matured from gentle ocean currents.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Butterflyfish",
  },
  "Prime Aged Blowfish": {
    description:
      "This aged blowfish offers a rich, rare delicacy with a bite of adventure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Blowfish",
  },
  "Prime Aged Clownfish": {
    description:
      "A playful flavor, clowning around but matured for the prime palate.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Clownfish",
  },
  "Prime Aged Sea Bass": {
    description:
      "Savory and succulent, this prime sea bass is the result of patient aging.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Sea Bass",
  },
  "Prime Aged Sea Horse": {
    description:
      "A truly rare aged seahorse, bringing mythical umami from the depths.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Sea Horse",
  },
  "Prime Aged Horse Mackerel": {
    description:
      "A mackerel matured for robust flavor with hints of wild ocean breeze.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Horse Mackerel",
  },
  "Prime Aged Halibut": {
    description:
      "Rich, velvety, and matured for supreme quality over tide and time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Halibut",
  },
  "Prime Aged Squid": {
    description:
      "Tender and unforgettable, this squid's flavor blossoms with age.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Squid",
  },
  "Prime Aged Red Snapper": {
    description:
      "Snappily aged for a richer, sweeter taste and delicate texture.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Red Snapper",
  },
  "Prime Aged Moray Eel": {
    description: "Aged for a bold, savory experience and an oceanic afterglow.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Moray Eel",
  },
  "Prime Aged Olive Flounder": {
    description:
      "Soft and buttery, this prime flounder melts with flavor aged in brine.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Olive Flounder",
  },
  "Prime Aged Napoleanfish": {
    description:
      "Legendary Napoleanfish, refined by time, regal in flavor and stature.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Napoleanfish",
  },
  "Prime Aged Surgeonfish": {
    description:
      "Carefully aged for exquisite taste and a dash of sea-born elegance.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Surgeonfish",
  },
  "Prime Aged Zebra Turkeyfish": {
    description:
      "Striking stripes softened by the patient hands of time and tide.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Zebra Turkeyfish",
  },
  "Prime Aged Angelfish": {
    description:
      "A sublime flavor only an aged angelfish can grant, delicate and rare.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Angelfish",
  },
  "Prime Aged Ray": {
    description:
      "Silky, ethereal, this ray imparts a savory richness through careful aging.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Ray",
  },
  "Prime Aged Hammerhead shark": {
    description:
      "Aged hammerhead delivers bold, powerful flavors for the adventurous.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Hammerhead shark",
  },
  "Prime Aged Barred Knifejaw": {
    description:
      "Prime aged for complex notes, this knifejaw impresses the palate.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Barred Knifejaw",
  },
  "Prime Aged Tuna": {
    description:
      "An apex catch, this matured tuna provides an exceptional umami journey.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Tuna",
  },
  "Prime Aged Mahi Mahi": {
    description:
      "Aged mahi mahi—a radiant, golden delicacy with a sweet, savory finish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Mahi Mahi",
  },
  "Prime Aged Blue Marlin": {
    description:
      "This legendary marlin matures into a feast worthy of ocean kings.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Blue Marlin",
  },
  "Prime Aged Oarfish": {
    description:
      "Aged and elongated, the oarfish’s taste is as great as its legend.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Oarfish",
  },
  "Prime Aged Football fish": {
    description:
      "For those who crave an exotic, hearty taste—an MVP of aged fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Football fish",
  },
  "Prime Aged Sunfish": {
    description:
      "Basking in age, the sunfish attains a mellow, magnificent flavor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Sunfish",
  },
  "Prime Aged Coelacanth": {
    description:
      "Prehistoric and patient, this coelacanth rewards with deep, mysterious notes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Coelacanth",
  },
  "Prime Aged Parrotfish": {
    description:
      "Aged parrotfish: colorful, robust, its taste as bold as its hues.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Parrotfish",
  },
  "Prime Aged Whale Shark": {
    description:
      "The gentle giant, its flavor deepened and enriched over the years.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Whale Shark",
  },
  "Prime Aged Saw Shark": {
    description:
      "A bold saw shark with time-hewn, complex tastes for daring diners.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Saw Shark",
  },
  "Prime Aged White Shark": {
    description:
      "The ocean's apex predator, matured for a distinguished and hearty savor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged White Shark",
  },
  "Prime Aged Porgy": {
    description: "Nutty, meaty, and matured for a taste that’s second to none.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Porgy",
  },
  "Prime Aged Muskellunge": {
    description:
      "Prime-aged ‘muskie’, treasured for its robust, legendary flavor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Muskellunge",
  },
  "Prime Aged Trout": {
    description:
      "A time-matured trout: refined, light, and cherished by gourmet anglers.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Trout",
  },
  "Prime Aged Walleye": {
    description:
      "Crystalline flavor, perfected by age, a walleye worthy of celebration.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Walleye",
  },
  "Prime Aged Weakfish": {
    description:
      "Delicate and unique, this weakfish’s mild flavor achieves new heights with age.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Weakfish",
  },
  "Prime Aged Rock Blackfish": {
    description:
      "Dark, rich, and intense – aged rock blackfish for the true enthusiast.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Rock Blackfish",
  },
  "Prime Aged Cobia": {
    description:
      "Prime cobia: remarkably supple, aged for flavor seekers and fishing legends.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Cobia",
  },
  "Prime Aged Tilapia": {
    description:
      "Mild, tender, a tilapia elevated to perfection through careful maturing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Prime Aged Tilapia",
  },
  "Pickled Radish": {
    description: "Crisp radish, pickled to tangy perfection.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Radish",
  },
  "Pickled Zucchini": {
    description: "Sliced zucchini with a sharp, briny bite.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Zucchini",
  },
  "Pickled Tomato": {
    description: "Tomatoes steeped until sweet meets sour.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Tomato",
  },
  "Pickled Cabbage": {
    description: "Leafy crunch, folded in brine and time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Cabbage",
  },
  "Pickled Onion": {
    description: "Sharp rings mellowed into punchy preserves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Onion",
  },
  "Pickled Pepper": {
    description: "Peppers packed with heat and vinegar spark.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Pepper",
  },
  "Pickled Broccoli": {
    description: "Tiny trees, tangy and crisp, preserved in brine.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Food" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Pickled Broccoli",
  },
  "Greenhouse Glow": {
    description: "A fermented boost for the greenhouse.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Greenhouse Glow",
  },
  "Greenhouse Goodie": {
    description: "A fermented treat for the greenhouse.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Greenhouse Goodie",
  },
  "Sproutroot Surprise": {
    description: "Sprout and root mix, fermented to a punchy bite.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Sproutroot Surprise",
  },
  "Turbofruit Mix": {
    description: "Rapid roots and fruitful blend, turbo-charged by brine.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Turbofruit Mix",
  },
  "Capsule Bait": {
    description: "Fermented bait that behaves like an earthworm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Capsule Bait",
  },
  "Umbrella Bait": {
    description: "Fermented bait that behaves like a grub.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Umbrella Bait",
  },
  "Crimson Baitfish": {
    description: "Fermented bait that behaves like a red wiggler.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
    name: "Crimson Baitfish",
  },
  Timeshard: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Timeshard",
  },
  "Ancient Clock": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient Clock",
  },
  "Broken Pillar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Broken Pillar",
  },
  "Winds of Change Banner": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Winds of Change Banner",
  },
  "Great Bloom Banner": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Great Bloom Banner",
  },
  Geniseed: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Geniseed",
  },
  Jin: {
    description:
      "The Mythical Tiger of Ronin, embodies strength, resillence and adventurous spirit",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Jin",
  },
  "Love Charm": {
    description: "A spark of social interaction",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Coupon" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Charm",
  },
  "Floral Arch": {
    description:
      "A grand entrance made of nature’s finest, welcoming all who pass through.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Floral Arch",
  },
  "Flower Coin": {
    description:
      "A symbol of new beginnings, marking the bloom of a fresh era in Sunflower Land.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower Coin",
  },
  "Flower Statue": {
    description:
      "A monument to growth and transformation, standing tall as the world of Bumpkins flourishes in a new symbol.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower Statue",
  },
  "Heartstruck Tree": {
    description:
      "Legends say Cupid himself took aim at this tree, and now it grows love instead of leaves.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Heartstruck Tree",
  },
  "Mermaid Fountain": {
    description:
      "Whisper your wishes to the waters, and let the mermaid’s melody guide your heart.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mermaid Fountain",
  },
  "Mysterious Entrance": {
    description:
      "Where does it lead? Only those who dare to step through will know.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mysterious Entrance",
  },
  "Streamer's Statue": {
    description:
      "A tribute to those who amplify the community, earning rewards by sharing the stories and adventure in Sunflower Land.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Streamer's Statue",
  },
  Cetus: {
    description:
      "An ancient creature of the sea, watching over the waters with silent wisdom.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cetus",
  },
  "Goldcrest Mosaic Rug": {
    description:
      "A masterful blend of tiles, reflecting the sun’s warm embrace.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goldcrest Mosaic Rug",
  },
  "Sandy Mosaic Rug": {
    description: "A pattern woven from desert winds and sun-kissed dreams.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sandy Mosaic Rug",
  },
  "Twilight Rug": {
    description:
      "A deep, dark weave, capturing the beauty of the twilight and flowers.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Twilight Rug",
  },
  "Orchard Rug": {
    description: "Woven with care, just like the trees in a well-tended grove.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Orchard Rug",
  },
  "Carrot Rug": {
    description:
      "Perfect for a cozy farmhouse, or a rabbit with expensive taste.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Carrot Rug",
  },
  "Beetroot Rug": {
    description: "A rich, earthy hue that brings warmth to any home.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beetroot Rug",
  },
  "Harlequin Rug": {
    description: "A timeless pattern that never goes out of style.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Harlequin Rug",
  },
  "Large Rug": {
    description: "Big, bold, and built for comfort.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Large Rug",
  },
  "Golden Fence": {
    description: "Sturdy and shining, a fence built to last for ages.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Fence",
  },
  "Golden Stone Fence": {
    description: "Blending the strength of stone with a glimmer of fortune.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Stone Fence",
  },
  "Golden Pine Tree": {
    description: "Tall and proud, standing through every season.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Pine Tree",
  },
  "Golden Tree": {
    description: "A rare sight in nature, glowing under the sun’s rays.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Tree",
  },
  "Golden Bush": {
    description: "A small but majestic addition to any landscape.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Bush",
  },
  "Black Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Black Tile",
  },
  "Blue Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Tile",
  },
  "Green Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Green Tile",
  },
  "Purple Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Purple Tile",
  },
  "Red Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Red Tile",
  },
  "Yellow Tile": {
    description: "",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yellow Tile",
  },
  "Easter Token 2025": {
    name: "Easter Token 2025",
    description: "Use this in the easter event shop before the event ends!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Easter Ticket 2025": {
    name: "Easter Ticket 2025",
    description:
      "Hold this for a chance to win $FLOWER after the easter event ends!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot House": {
    description: "Is this a carrot or a house?",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Carrot House",
  },
  "Orange Bunny Lantern": {
    description: "A bunny lantern special to easter",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Orange Bunny Lantern",
  },
  "White Bunny Lantern": {
    description: "A rare bunny in lantern shape",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "White Bunny Lantern",
  },
  "Orange Tunnel Bunny": {
    description: "Who let this dig in my garden!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Orange Tunnel Bunny",
  },
  "White Tunnel Bunny": {
    description: "A rare bunny digging through!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "White Tunnel Bunny",
  },
  "Easter Basket": {
    description: "A basket filled with easter eggs!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Easter Basket",
  },
  "Test Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Common" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Test Box",
  },
  "Bronze Love Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Common" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bronze Love Box",
  },
  "Silver Love Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Uncommon" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Silver Love Box",
  },
  "Gold Love Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Bronze Food Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Silver Food Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Gold Food Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Bronze Tool Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Silver Tool Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },
  "Gold Tool Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Love Box",
  },

  "Bronze Flower Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Common" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bronze Flower Box",
  },

  "Silver Flower Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Uncommon" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Silver Flower Box",
  },
  "Gold Flower Box": {
    description: "A box filled with love!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Rarity", value: "Rare" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Flower Box",
  },
  Quarry: {
    description:
      "An age-old stone site that never runs dry—perfect for those seeking a steady supply of free stone.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Quarry",
  },
  "Obsidian Turtle": {
    description:
      "Steady and silent, this ancient creature gathers traces of volcanic stone wherever it roams.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Obsidian Turtle",
  },
  "Winter Guardian": {
    description:
      "Summoned from a land where snow never melts, this frostbound protector now watches over the skies—an honored guest in unfamiliar winds.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Winter Guardian",
  },
  "Summer Guardian": {
    description:
      "A blazing figure born under endless sun, this Guardian brings the heat of its homeland to the cooler heights of Sky Island.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Summer Guardian",
  },
  "Spring Guardian": {
    description:
      "Awakened from fertile fields far below, this gentle spirit now nurtures life among the drifting gardens of the sky.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spring Guardian",
  },
  "Autumn Guardian": {
    description:
      "With harvest hues and a wistful gaze, this Guardian carries the essence of changing seasons from distant lands into the realm above.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Autumn Guardian",
  },
  "Sky Pillar": {
    description:
      "These ancient columns are said to predate the sky itself, pulsing with the energy that keeps Sky Island afloat and in balance.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sky Pillar",
  },
  "Flower-Scribed Statue": {
    description:
      "Carved from pale stone and etched with ancient floral verses, this statue hums with the quiet wisdom of Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower-Scribed Statue",
  },

  "Balloon Rug": {
    description:
      "A soft, whimsical rug that feels lighter than air—perfect for lounging in style.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Balloon Rug",
  },
  "Giant Yam": {
    description:
      "A root so massive it could feed a village—or at least make one impressive stew.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Yam",
  },
  "Heart Air Balloon": {
    description:
      "A floating symbol of love, ready to lift spirits and hearts alike. +1 Geniseeds from deliveries, chores & bounties.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Heart Air Balloon",
  },
  "Giant Zucchini": {
    description:
      "Impossibly large and suspiciously green, this veggie is a true garden marvel.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Zucchini",
  },
  "Giant Kale": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Kale",
  },
  "Mini Floating Island": {
    description:
      "A small-sized patch of paradise that somehow stays afloat—perfect for peaceful moments.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mini Floating Island",
  },
  "Colors Token 2025": {
    description:
      "Use this in the festival of colors event shop before the event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Colors Token 2025",
  },
  "Colors Ticket 2025": {
    description:
      "Hold this for a chance to win $FLOWER after the festival of colors event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Colors Ticket 2025",
  },
  "Paint Buckets": {
    description:
      "These buckets hold the power to bring color to even the dullest day.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paint Buckets",
  },
  "Rainbow Well": {
    description:
      "This enchanted well shimmers with every color of the rainbow, offering wishes as bright as its waters.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rainbow Well",
  },
  "Floating Toy": {
    description:
      "This playful toy drifts through the air, spreading joy wherever the breeze takes it.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Floating Toy",
  },
  "Rainbow Flower": {
    description:
      "This rare flower radiates with vibrant magic and never fades.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rainbow Flower",
  },
  "Pony Toy": {
    description:
      "Crafted with love and a sprinkle of magic, this tiny pony carries the spirit of every farmer’s dreams.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pony Toy",
  },
  "Red Slime Balloon": {
    description:
      "Suspended in a ruby-red bubble, this mischievous slime squishes and squirms with excitement.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Red Slime Balloon",
  },
  "Blue Slime Balloon": {
    description:
      "Gently bobbing in a cool blue balloon, this playful slime seems to enjoy the ride.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Slime Balloon",
  },
  "Basic Biome": {
    description: "A basic biome that provides a basic income and a basic life.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Biome",
  },
  "Spring Biome": {
    description:
      "A spring biome that provides a spring income and a spring life.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spring Biome",
  },
  "Desert Biome": {
    description:
      "A desert biome that provides a desert income and a desert life.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Biome",
  },
  "Volcano Biome": {
    description:
      "A volcano biome that provides a volcano income and a volcano life.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Volcano Biome",
  },
  "Better Together Banner": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Better Together Banner",
  },
  Bracelet: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bracelet",
  },
  Coprolite: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Coprolite",
  },
  "Big Orange": {
    description: "A big orange",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Big Orange",
  },
  "Big Apple": {
    description: "It's not the big apple, it's a big apple!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Big Apple",
  },
  "Big Banana": {
    description: "A big banana",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Big Banana",
  },
  "Giant Orange": {
    description: "A giant orange",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Orange",
  },
  "Giant Apple": {
    description: "A giant apple",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Apple",
  },
  "Giant Banana": {
    description: "A giant banana",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Banana",
  },
  "Farmer's Monument": {
    description: "A monument to the farmers of Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farmer's Monument",
  },
  "Miner's Monument": {
    description: "A monument to the miners of Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Miner's Monument",
  },
  "Woodcutter's Monument": {
    description: "A monument to the woodcutters of Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Woodcutter's Monument",
  },
  "Teamwork Monument": {
    description: "A monument to the teamwork of Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Teamwork Monument",
  },
  "Basic Cooking Pot": {
    description: "A basic cooking pot",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Cooking Pot",
  },
  "Expert Cooking Pot": {
    description: "A expert cooking pot",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Expert Cooking Pot",
  },
  "Advanced Cooking Pot": {
    description: "A master cooking pot",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Advanced Cooking Pot",
  },
  "Floor Mirror": {
    description: "A tall mirror perfect for full-body reflections.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Floor Mirror",
  },
  "Long Rug": {
    description: "A horizontally long patterned rug to warm up any floor.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Long Rug",
  },
  "Garbage Bin": {
    description: "A sturdy bin used for collecting trash.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Garbage Bin",
  },
  Wheelbarrow: {
    description: "A classic tool for moving heavy items around the farm.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wheelbarrow",
  },
  "Snail King": {
    description: "Royalty with a slime trail—slow but majestic.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Snail King",
  },
  "Reelmaster's Chair": {
    description:
      "A folding chair equipped for serious fishing. Comes with built-in rod holders and fish tales.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reelmaster's Chair",
  },
  "Rat King": {
    description: "A tangled tale of tails and questionable leadership.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rat King",
  },
  "Fruit Tune Box": {
    description: "Plays nothing but berry good music.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fruit Tune Box",
  },
  "Double Bed": {
    description: "A cozy bed that fits two comfortably.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Double Bed",
  },
  "Giant Artichoke": {
    description: "The heart of the garden—literally huge Artichoke.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Artichoke",
  },
  "Rocket Statue": {
    description:
      "A rocket ready for lift-off—with the whole world on its back!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rocket Statue",
  },
  "Ant Queen": {
    description: "She rules the dirt—and your crumbs.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ant Queen",
  },
  "Jurassic Droplet": {
    description: "Dino doo, polished and preserved—nature’s weirdest relic.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Jurassic Droplet",
  },
  "Giant Onion": {
    description: "It’s big. It’s bold. It will make your whole field cry.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Onion",
  },
  "Giant Turnip": {
    description:
      "A massive turnip that stands tall in the field—too big to harvest, but perfect for display.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Turnip",
  },
  "Groovy Gramophone": {
    description: "Spins vintage vibes and funky beats.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Groovy Gramophone",
  },
  "Wheat Whiskers": {
    description: "A bundle of wheat playfully accompanied by curious mice.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wheat Whiskers",
  },
  Cheer: {
    description: "Give a cheer to your fellow farmers!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cheer",
  },
  "Paw Prints Banner": {
    description: "A banner for the Paw Prints chapter.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paw Prints Banner",
  },
  "Pet Cookie": {
    description: "Collected during the Paw Prints chapter.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Cookie",
  },
  "Moon Crystal": {
    description: "Can be found at the digsite during the Paw Prints chapter.",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moon Crystal",
  },
  "Paw Prints Rug": {
    description: "A cozy rug patterned with playful paw prints.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paw Prints Rug",
  },
  "Pet Bed": {
    description: "A snug resting spot for your loyal companions.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Bed",
  },
  "Moon Fox Statue": {
    description: "A statue honoring the Moon Fox's gentle watch.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moon Fox Statue",
  },
  "Giant Acorn": {
    description: "A towering acorn that brings woodland charm to your farm.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Acorn",
  },
  "Pet Bowls": {
    description: "Keep your furry friends happily fed with matching bowls.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Bowls",
  },

  Trash: {
    description: "A piece of trash",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trash",
  },
  Dung: {
    description: "A piece of dung",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dung",
  },
  Weed: {
    description: "A weed",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Weed",
  },
  Anthill: {
    description: "An anthill",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Anthill",
  },
  Rat: {
    description: "A rat",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rat",
  },
  Snail: {
    description: "A snail",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Snail",
  },
  "Pest Net": {
    description: "A pest net",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pest Net",
  },
  Poseidon: {
    description: "The mythical Poseidon, the god of the sea.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        trait_type: "+1 Fish during Autumn",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Poseidon",
  },
  Moonfur: {
    description: "A fluffy moonfur",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moonfur",
  },
  "Legendary Shrine": {
    description: "A legendary shrine that buffs everything!",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Legendary Shrine",
  },
  "Fossil Shell": {
    description: "A fossil shell",
    decimals: 0,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fossil Shell",
  },
  "Fox Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fox Shrine",
  },
  "Boar Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Boar Shrine",
  },
  "Hound Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hound Shrine",
  },
  "Stag Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Stag Shrine",
  },
  "Pet Egg": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Egg",
  },
  Ruffroot: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ruffroot",
  },
  "Chewed Bone": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chewed Bone",
  },
  "Heart leaf": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Heart leaf",
  },
  Acorn: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Acorn",
  },
  Meowchi: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Meowchi",
  },
  Burro: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Burro",
  },
  Twizzle: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Twizzle",
  },
  Barkley: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Barkley",
  },
  Mudhorn: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mudhorn",
  },
  Nibbles: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nibbles",
  },
  Waddles: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Waddles",
  },
  Ramsey: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ramsey",
  },
  Dewberry: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dewberry",
  },
  "Wild Grass": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wild Grass",
  },
  Ribbon: {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ribbon",
  },
  "Frost Pebble": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frost Pebble",
  },
  "Mole Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mole Shrine",
  },
  "Badger Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mole Shrine",
  },
  "Collie Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mole Shrine",
  },
  "Toucan Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mole Shrine",
  },
  "Sparrow Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mole Shrine",
  },
  "Moth Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moth Shrine",
  },
  "Bear Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bear Shrine",
  },
  "Tortoise Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tortoise Shrine",
  },
  "Obsidian Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Obsidian Shrine",
  },
  "Bantam Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bantam Shrine",
  },
  "Trading Shrine": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trading Shrine",
  },
  "Ancient Tree": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient Tree",
  },
  "Sacred Tree": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sacred Tree",
  },
  "Refined Iron Rock": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Refined Iron Rock",
  },
  "Tempered Iron Rock": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tempered Iron Rock",
  },
  "Pure Gold Rock": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pure Gold Rock",
  },
  "Prime Gold Rock": {
    decimals: 0,
    description: "",
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Prime Gold Rock",
  },
  Biscuit: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Biscuit",
  },
  Cloudy: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cloudy",
  },
  Butters: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Butters",
  },
  Smokey: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Smokey",
  },
  Flicker: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flicker",
  },
  Pippin: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pippin",
  },
  Pinto: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pinto",
  },
  Roan: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Roan",
  },
  Stallion: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Stallion",
  },
  Bison: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bison",
  },
  Oxen: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oxen",
  },
  Peanuts: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Peanuts",
  },
  Pip: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pip",
  },
  Skipper: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Skipper",
  },
  "Halloween Token 2025": {
    description: "Use this in the Halloween event shop before the event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Halloween Token 2025",
  },
  "Halloween Ticket 2025": {
    description:
      "Hold this for a chance to win $FLOWER after the Halloween event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Halloween Ticket 2025",
  },
  Cerberus: {
    description:
      "Guarding the underworld and your crops. Just don’t throw three sticks at once.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cerberus",
  },
  "Witch's Cauldron": {
    description:
      "Something’s bubbling… might be a potion, might be last week’s soup.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Witch's Cauldron",
  },
  Raveyard: {
    description:
      "Graveyard? No, Raveyard! Even the dead can’t resist these beats.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Raveyard",
  },
  "Haunted House": {
    description:
      "Next time, check if the house you buy comes with keys… maybe it’s good this one didn’t.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Haunted House",
  },
  "Mimic Egg": {
    description: "It wiggles. You blink. Now it’s winking back.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mimic Egg",
  },
  "Haunted Tomb": {
    description:
      "A ghostly wisp sits atop, probably judging your farming skills.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Haunted Tomb",
  },
  Guillotine: {
    description: "The ultimate tool for a clean cut harvest.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Guillotine",
  },
  "Vampire Coffin": {
    description: "He only comes out for night farming. Garlic not included.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Vampire Coffin",
  },
  "Petnip Plant": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Petnip Plant",
  },
  "Pet Kennel": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Kennel",
  },
  "Pet Toys": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Toys",
  },
  "Pet Playground": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Playground",
  },
  "Fish Bowl": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Bowl",
  },
  "Giant Gold Bone": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giant Gold Bone",
  },
  "Lunar Temple": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lunar Temple",
  },
  "Magma Stone": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Magma Stone",
  },
  Cornucopia: {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cornucopia",
  },
  "Messy Bed": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Messy Bed",
  },
  "Basic Farming Pack": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Farming Pack",
  },
  "Basic Food Box": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Food Box",
  },
  "Weekly Mega Box": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Weekly Mega Box",
  },
  "Basic Love Box": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Love Box",
  },
  "Holiday Token 2025": {
    name: "Holiday Token 2025",
    description: "Use this in the Holiday event shop before the event ends!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Holiday Ticket 2025": {
    name: "Holiday Ticket 2025",
    description:
      "Hold this for a chance to win $FLOWER after the Holiday event ends!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Holiday Decorative Totem": {
    name: "Holiday Decorative Totem",
    description: "A festive totem to bring holiday cheer to your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Red Holiday Ornament": {
    name: "Red Holiday Ornament",
    description:
      "A shiny huge red ornament to decorate your farm for the holidays.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Green Holiday Ornament": {
    name: "Green Holiday Ornament",
    description:
      "A shiny huge green ornament to decorate your farm for the holidays.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Gift Turtle": {
    name: "Gift Turtle",
    description: "This turtle carries gifts for all the good farmers.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Red Nose Reindeer": {
    name: "Red Nose Reindeer",
    description:
      "The legendary red-nosed reindeer that guides Santa's sleigh through the night sky.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Tuxedo Claus": {
    name: "Tuxedo Claus",
    description: "Just a normal claus... not a single penguin in sight...",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Winter Alpaca": {
    name: "Winter Alpaca",
    description:
      "Stay alert or this fluffy winter alpaca will eat your holiday decorations!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Penguin Surprise": {
    name: "Penguin Surprise",
    description:
      "A playful penguin that brings a big surprise to your farm. (Hint: It loves fish!)",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Frozen Meat": {
    name: "Frozen Meat",
    description:
      "A frozen piece of meat said to be used in special recipes in the ancient holiday times.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Ho Ho oh oh…": {
    name: "Ho Ho oh oh…",
    description:
      "With Santa stuck like this, maybe the holidays were the friends we made along the way?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Mariner Pot": {
    name: "Mariner Pot",
    description:
      "An advanced water trap to catch marine creatures. Place it near the wharf and wait 8 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crab Pot": {
    name: "Crab Pot",
    description:
      "A water trap to catch marine creatures. Place it near the wharf and wait 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Paw Prints Raffle Ticket": {
    name: "Paw Prints Raffle Ticket",
    description: "A ticket for the Paw Prints raffle.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
  },
  "Crabs and Traps Raffle Ticket": {
    name: "Crabs and Traps Raffle Ticket",
    description: "A ticket for the Crabs and Traps raffle.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
  },
  "Aging Shed": {
    name: "Aging Shed",
    description: "Age and ferment your resources into refined goods.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "April Fools Token 2026": {
    description:
      "Use this in the April Fools event shop before the event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "April Fools Token 2026",
  },
  "April Fools Ticket 2026": {
    description:
      "Hold this for a chance to win $FLOWER after the April Fools event ends!",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "April Fools Ticket 2026",
  },
  "Teeth Toy": {
    description: "Your pet loves it. Your farmer is deeply uncomfortable.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Teeth Toy",
  },
  "Fake Treasure": {
    description: "The ancient art of disappointment in treasure form.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fake Treasure",
  },
  "Fake Mouse": {
    description: "Moves when you are not looking. Probably coincidence.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fake Mouse",
  },
  "Pet Tree": {
    description:
      "A majestic climbing tower for your pet. Your furniture is finally safe. Probably.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Tree",
  },
  "Definitely not a Flower": {
    description: "Not a flower. Stop asking.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Definitely not a Flower",
  },
  "Bumpkin Rug": {
    description: "A friendly Bumpkin face for your floor.",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Rug",
  },
  "Goblin Rug": {
    description: "Still looks a little mischievous.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Rug",
  },
  "Pet Rug": {
    description: "Too cute to step on. Almost.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Rug",
  },
  "Jester in a box": {
    description: "Wind it up and prepare for chaos.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Jester in a box",
  },
  "The Sunflower Man Statue": {
    description:
      "Stories say this statue is from a hero of the legend. I think someone just thought it was funny and made it.",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "The Sunflower Man Statue",
  },
  "Salt Sculpture": {
    description:
      "A progressive sculpture providing Salt & Aging buffs per level",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Salt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Sculpture",
  },
  Pufferfish: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pufferfish",
  },
  "Fat Crab": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fat Crab",
  },
  "Navigation Table": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Navigation Table",
  },
  "Royal Crab Pot": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Crab Pot",
  },
  "Crab House": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crab House",
  },
  "Speed Trap": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Speed Trap",
  },
  "Flamingo Chicken": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flamingo Chicken",
  },
  "Salt Crystal Flower": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Crystal Flower",
  },
  "Spa Cow": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spa Cow",
  },
  "Spa Sheep": {
    description: "Wool washed white by hot springs and salt steam.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Spa Sheep",
  },
  "Deep Sea Pig": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Deep Sea Pig",
  },
  "Deep Sea Slug": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Deep Sea Slug",
  },
  "Crystal Shrimp": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crystal Shrimp",
  },
  "Salt Rock": {
    description: "Collected during the Salt Awakening chapter.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Rock",
  },
  "Salt Awakening Raffle Ticket": {
    description: "A raffle ticket for the Salt Awakening chapter.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Awakening Raffle Ticket",
  },
  "Skill Reset Ticket": {
    description: "A ticket that allows you to reset your skills for free.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Skill Reset Ticket",
  },
  "Salt Awakening Banner": {
    description: "A banner for the Salt Awakening chapter.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Awakening Banner",
  },
  "Salt Dino Egg": {
    description: "A chapter artefact unearthed during Salt Awakening.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Treasure" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Salt Dino Egg",
  },
};

export const OPEN_SEA_WEARABLES: Record<BumpkinItem, Metadata> = {
  "Beige Farmer Potion": {
    description:
      "An ancient potion of beige goodness. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beige Farmer Potion",
  },
  "Light Brown Farmer Potion": {
    description:
      "A mixture of sunflower and gold. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Light Brown Farmer Potion",
  },
  "Dark Brown Farmer Potion": {
    description:
      "A traditional recipe passed down from Bumpkin Ancestors. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dark Brown Farmer Potion",
  },
  "Goblin Potion": {
    description:
      "A recipe crafted during the Great Goblin War. Consuming this potion turns your Bumpkin into a Goblin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Potion",
  },
  "Basic Hair": {
    description:
      "Nothing says Bumpkin like this Basic Hair. This mop of hair is a signal of a true Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Basic Hair",
  },
  "Rancher Hair": {
    description:
      "Bright and orange! You can spot this hair piece a mile away in the fields.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rancher Hair",
  },
  "Explorer Hair": {
    description:
      "This cut never goes out of style. Plenty of room to store extra seeds while farming.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Explorer Hair",
  },
  "Buzz Cut": {
    description: "Short, simple & easy maintenance. More time for farming!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Buzz Cut",
  },
  "Parlour Hair": {
    description: "There is enough hair spray in here to last a year.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Parlour Hair",
  },
  "Sun Spots": {
    description:
      "Long days in the field and the blaring sun. The sign of a true worker.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sun Spots",
  },
  "Red Farmer Shirt": {
    description:
      "The Basic Bumpkin must-have. Nothing blends in the crowd quite like this red farmer shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Red Farmer Shirt",
  },
  "Yellow Farmer Shirt": {
    description:
      "The colour of happiness, warmth and sunflowers! A beloved shirt amongst all farmers.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yellow Farmer Shirt",
  },
  "Blue Farmer Shirt": {
    description:
      "Getting down to business? This is a mark of a trained and focussed farmer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Farmer Shirt",
  },
  "Chef Apron": {
    description:
      "If you are baking cakes don't forget your Apron! The mark of a true baker.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cake Sale Price",
        value: 20,
      },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chef Apron",
  },
  "Warrior Shirt": {
    description:
      "The mark of a warrior who survived the Goblin War. This shirt commands respect amongst the Sunflower community.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Warrior Shirt",
  },
  "Fancy Top": {
    description:
      "Oooh isn't that fancy? This short is worn in the royal kingdoms of Sunflorea.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fancy Top",
  },
  "Farmer Overalls": {
    description: "Plenty of pockets to store your tools!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farmer Overalls",
  },
  "Lumberjack Overalls": {
    description:
      "Chopping wood and crafting tools, what more could you want in life?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lumberjack Overalls",
  },
  "Farmer Pants": {
    description: "Basic pants that get the job down at Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farmer Pants",
  },
  "Warrior Pants": {
    description:
      "The mark of a warrior who survived the Goblin War. Gotta protect your thighs out on the battlefield!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Warrior Pants",
  },
  "Black Farmer Boots": {
    description:
      "These boots were made for walking...and exploring Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Black Farmer Boots",
  },
  "Farmer Pitchfork": {
    description:
      "A trusty pitchfork. Don't be caught dead without one when the crops are ready",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farmer Pitchfork",
  },
  Axe: {
    description: "You can't expand your empire with chopping trees!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Axe",
  },
  Sword: {
    description: "When tensions rise in Sunflower Land, you will be ready.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sword",
  },
  "Farmer Hat": {
    description:
      "The sun is harsh in Sunflower Land. Don't forget to protect your Bumpkin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farmer Hat",
  },
  "Chef Hat": {
    description:
      "A champion in the great bake off. Goblins get hungry when they see a Bumpkin wearing a chef hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chef Hat",
  },
  "Warrior Helmet": {
    description:
      "Through blood and sweat, the wearer of this helmet was victorious in the Goblin war.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Warrior Helmet",
  },
  "Sunflower Amulet": {
    description:
      "The crop that fuels the Sunflower MetaVerse. Now in necklace form!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Sunflower Yield",
        value: 10,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflower Amulet",
  },
  "Carrot Amulet": {
    description:
      "Carrots for breakfast, lunch and dinner. Rumour says that wearing this necklace improves your Bumpkin's eyesight!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Carrot Growth Time",
        value: -20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Carrot Amulet",
  },
  "Beetroot Amulet": {
    description: "Grandma always said to carry a beetroot wherever you go.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Beetroot Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beetroot Amulet",
  },
  "Green Amulet": {
    description: "King of the crops. Nothing can stop your farming empire now!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Critical Hit Yield",
        value: 900,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 10,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Green Amulet",
  },
  "Sunflower Shield": {
    description:
      "Fight smart, not hard. This shield offered protection during the Goblin War and is now a mark of a true warrior.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      {
        display_type: "boost_number",
        trait_type: "Cost of Sunflower Seeds",
        value: 0,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflower Shield",
  },
  "Farm Background": {
    description:
      "There is no better place for a Bumpkin to be...out in the fields!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Farm Background",
  },
  "Brown Boots": {
    description: "Perfect for a hard days work, you will barely see a stain!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Brown Boots",
  },
  "Brown Suspenders": {
    description:
      "Are you worried about your pants falling down? These are a must have for Goblins.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Brown Suspenders",
  },
  "Fancy Pants": {
    description: "Ooh, well don't you look all high and mighty!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fancy Pants",
  },
  "Maiden Skirt": {
    description:
      "Plowing, exploring and trading. These are a perfect choice for your Bumpkin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Maiden Skirt",
  },
  "Maiden Top": {
    description:
      "A universal choice, whether you are out on the fields or trading at the markets. You will fit right in!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Maiden Top",
  },
  "Peasant Skirt": {
    description: "No time for rest, there are crops for harvesting!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Peasant Skirt",
  },
  "SFL T-Shirt": {
    description: "Official Sunflower Land merchandise!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "SFL T-Shirt",
  },
  "Yellow Boots": {
    description: "The winner of the 2022 Goblin Fashion awards. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Yellow Boots",
  },
  "Blue Suspenders": {
    description: "A perfect outfit for the annual barn dance",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Suspenders",
  },
  "Brown Long Hair": {
    description: "Well groomed hair for a day out farming potatoes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Brown Long Hair",
  },
  "Forest Background": {
    description: "Some Bumpkins prefer the forest to the fields.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Forest Background",
  },
  "Seashore Background": {
    description:
      "Bumpkins were built to explore! Nothing excites a Bumpkin quite like a vast ocean in front of them.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Seashore Background",
  },
  "White Long Hair": {
    description:
      "Rumour has it the long forgotten Saphiro tribe passed down the white hair gene. These days, Bumpkins bleach their hair for fashion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "White Long Hair",
  },
  Blondie: {
    description: "Too much time in the sun results in a Bumpkin Blondie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blondie",
  },
  "Cemetery Background": {
    description:
      "A limited edition Halloween event! Looks like a Bumpkin Bimbo summoned the necromancer again...",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cemetery Background",
  },
  "Golden Spatula": {
    description:
      "Increase the quality of your cooking. A 10% increase of experience when eating food.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 10,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Spatula",
  },
  "Jail Background": {
    description: "This Bumpkin was accused of stealing potatoes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Jail Background",
  },
  "Space Background": {
    description: "Bumpkins to the moon!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Space Background",
  },
  "Teal Mohawk": {
    description: "Not all Bumpkins like to fit into the crowd.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Teal Mohawk",
  },
  Parsnip: {
    description:
      "Looks like you found the perfect parsnip! 20% increased yield when farming parsnips",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Parsnip Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Parsnip",
  },
  "Artist Scarf": {
    description:
      "Red wine, poetry and fine pixel art. A mark of a certified Sunflower Land contributors.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Artist Scarf",
  },
  "Bumpkin Art Competition Merch": {
    description:
      "A special event shirt for participants in the first official Bumpkin Art competition.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Art Competition Merch",
  },
  "Developer Hoodie": {
    description:
      "Coffee, comfort and coding. Time to build the Bumpkins - a mark of a certified code developer",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Developer Hoodie",
  },
  "Project Dignity Hoodie": {
    description:
      "Are you a frog collector? Project Dignity is a project built on top of Sunflower Land and an amazing community!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Project Dignity Hoodie",
  },
  "Blacksmith Hair": {
    description: "This hair is older than moon rocks!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blacksmith Hair",
  },
  Hammer: {
    description: "Bumpkins were made to build!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hammer",
  },
  "Bumpkin Boots": {
    description: "Trendy Bumpkin Boots",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Boots",
  },
  "Fire Shirt": {
    description: "Bad Bumpkins break the rules!!!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fire Shirt",
  },
  "Red Long Hair": {
    description: "Let the fiery hair flow.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Red Long Hair",
  },
  "Snowman Onesie": {
    description: "Do you want to build a snowman?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Snowman Onesie",
  },
  "Reindeer Suit": {
    description: "Rudolph can't stop eating carrots!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reindeer Suit",
  },
  "Ancient Goblin Sword": {
    description:
      "A rare artifact found from an ancient battle. The blood of enemies stain the handle.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient Goblin Sword",
  },
  "Ancient War Hammer": {
    description:
      "This ancient weapon is rumoured to bring peace to Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient War Hammer",
  },
  "Angel Wings": {
    description: "Ascend to the heavens with these beautiful wings",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of Instant Crops",
        value: 30,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Angel Wings",
  },
  "Devil Wings": {
    description:
      "This Bumpkin has been doing Lucifer's dirty work and using black magic on crops.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of Instant Crops",
        value: 30,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Devil Wings",
  },
  "Christmas Background": {
    description:
      "Deck the halls with gifts for Bumpkins, fa-la-la-la-la, la-la-la-la.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Christmas Background",
  },
  "Fire Hair": {
    description: "Some one has been eating too many beetroots!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fire Hair",
  },
  "Luscious Hair": {
    description: "The secret to Luscious Hair is eating Kale every day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Luscious Hair",
  },
  "Mountain View Background": {
    description:
      "Exploring beyond the reach of the mountains, what a nice place for a picnic",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mountain View Background",
  },
  "Reindeer Antlers": {
    description:
      "Rumour has it if you eat too many carrots, you will grow Antlers!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reindeer Antlers",
  },
  "Shark Onesie": {
    description: "Bumpkin Shark do do do do do do.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Shark Onesie",
  },
  "Skull Hat": {
    description:
      "The most fierce warriors from the Goblin War can be seen wearing the skulls of their enemies!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Skull Hat",
  },
  "Santa Hat": {
    description: "Ho ho ho! Someone found Santa's lost hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Santa Hat",
  },
  "Pineapple Shirt": {
    description:
      "You feel like taking a break from farming? Get on the holiday vibes with this shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pineapple Shirt",
  },
  "China Town Background": {
    description: "A perfect day for a hungry Goblin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "China Town Background",
  },
  "Lion Dance Mask": {
    description: "Bring good luck and drive away evil spirits.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lion Dance Mask",
  },
  "Fruit Bowl": {
    description: "A festive fruit hat fit for any occasion!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fruit Bowl",
  },
  "Fruit Picker Apron": {
    description:
      "Whether you're a professional fruit picker or just enjoy picking fruit as a hobby, this apron is a must-have accessory.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Apple, Blueberry, Orange and Banana Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fruit Picker Apron",
  },
  "Fruit Picker Shirt": {
    description:
      "A comfortable and sturdy shirt that can withstand the elements while picking fruit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fruit Picker Shirt",
  },
  "Striped Blue Shirt": {
    description:
      "Yo ho ho, the pirate with the Striped Blue Shirt has style that'll make even Davy Jones jealous!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Striped Blue Shirt",
  },
  "Peg Leg": {
    description: "Your jig dancing skills would make Blackbeard proud!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Peg Leg",
  },
  "Pirate Potion": {
    description:
      "Becoming a pirate is like trading in your suit and tie for a life of adventure on the high seas!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      {
        display_type: "boost_number",
        trait_type: "Free Gift per day in beach digging area",
        value: 1,
      },
      { trait_type: "Boost", value: "Treasure" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Potion",
  },
  "Pirate Hat": {
    description:
      "Arrr! A pirate hat is the cherry on top of a swashbuckling ensemble that inspires fear and respect on the seven seas.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Hat",
  },
  "Crab Claw": {
    description:
      "The pirate's claw-some companion was a crab with a hook for a hand, making them the terror of the seas and the king and queen of crab cakes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crab Claw",
  },
  "Pirate General Coat": {
    description: "So grand, even the seas would salute you.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate General Coat",
  },
  "Pirate Leather Polo": {
    description: "Rough and tough, just like his sea-faring reputation.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Leather Polo",
  },
  "Pirate Pants": {
    description:
      "With this pirate baggy pants, you could have hidden a whole treasure trove in the pockets.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Pants",
  },
  "Pirate Scimitar": {
    description:
      "The Pirate's scimitar is sharp enough to slice through the seven seas and sail with ease.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pirate Scimitar",
  },
  "Cupid Hair": {
    description:
      "A whimsical headpiece that resembles the iconic wings and bow of Cupid, the Roman god of love.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cupid Hair",
  },
  "Cupid Dress": {
    description:
      "A stunning piece of attire that perfectly captures the essence of Cupid. The dress is made from a soft, flowing fabric that drapes gracefully over the wearer's body.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cupid Dress",
  },
  "Cupid Sandals": {
    description:
      "A pair of stylish footwear that adds the finishing touch to the Cupid ensemble",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cupid Sandals",
  },
  "Love Quiver": {
    description:
      "A unique item that holds all of Cupid's arrows. The Love Quiver is a symbol of Cupid's power and is a must-have for any character who wants to embody the spirit of the Roman god of love.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Quiver",
  },
  "Bear Onesie": {
    description:
      "A cozy and cute outfit that will make you feel like a cuddly and playful bear. Perfect for parties!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bear Onesie",
  },
  "Bumpkin Puppet": {
    description:
      "Gather around the Puppet Master as they tell the origins of Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Puppet",
  },
  "Goblin Puppet": {
    description:
      "Gather around the Puppet Master as they tell the origins of Goblins and their struggles.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Puppet",
  },
  "Frog Onesie": {
    description:
      "This what happens when you kiss the frog! You turn into a magical amphibian.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frog Onesie",
  },
  "Hawaiian Shirt": {
    description:
      "A must have for Bumpkins with a laid-back and tropical vibe. Perfect for beach parties.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hawaiian Shirt",
  },
  "SFL Office Background": {
    description:
      "Immerse yourself in the office of the game designers! Feel right at home during live streams.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "SFL Office Background",
  },
  "Tiger Onesie": {
    description: "Rarrrrrrgh!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tiger Onesie",
  },
  "Lifeguard Hat": {
    description:
      "Stay cool and protected under the scorching sun with the Lifeguard Hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lifeguard Hat",
  },
  "Lifeguard Shirt": {
    description:
      "Stand out as a guardian of the water in our Lifeguard Shirt! The bold and recognizable 'LIFEGUARD' print on the front and back of the shirt ensures that you'll be easily spotted in an emergency situation.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lifeguard Shirt",
  },
  "Lifeguard Pants": {
    description:
      "Stay agile and ready to jump into action with our Lifeguard Pants! With multiple pockets, you can easily store your lifeguarding essentials like a whistle, sunscreen, and gloves. Whether you're patrolling the beach, pool, or waterpark, our Lifeguard Pants are the perfect addition to your lifeguarding gear.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lifeguard Pants",
  },
  "Beach Sarong": {
    description:
      "Perfect for a day in the sun or a sunset stroll along the beach, our Beach Sarong is an essential addition to your beach bag.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beach Sarong",
  },
  "Tropical Sarong": {
    description:
      "Bring the beauty of the tropics to your beach or pool day with our Tropical Sarong!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tropical Sarong",
  },
  "Sleeping Otter": {
    description:
      "This cute and cuddly otter loves nothing more than curling up on your head for a nap. A must-have for Project Dignity supporters",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sleeping Otter",
  },
  "Sequence Hat": {
    description:
      "Introducing the ultimate collectible hat for all crypto enthusiasts and bumpkins alike, created in collaboration with Sequence, a leading crypto wallet provider. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sequence Hat",
  },
  "Sequence Shirt": {
    description:
      "The ultimate wearable for those who want to show their love for crypto and the Sequence platform. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sequence Shirt",
  },
  "St Patricks Hat": {
    description:
      "Top o' the mornin' to ya, me friend! A special event item found at Bumpkin parties during the festive season",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "St Patricks Hat",
  },
  "Bunny Onesie": {
    description:
      "A charming and adorable ensemble that will transform you into a lovable and bouncy bunny. Ideal for gatherings and celebrations!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bunny Onesie",
  },
  "Polkastarter Shirt": {
    description:
      "Show your love for gaming with this exclusive Polkastarter Shirt. Available from special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Polkastarter Shirt",
  },
  "Light Brown Worried Farmer Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Light Brown Worried Farmer Potion",
  },
  "Beach Trunks": {
    description:
      "Get ready to catch some rays and make a splash with these beach trunks that are perfect for a day out by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beach Trunks",
  },
  "Club Polo": {
    description:
      "Look sharp and stylish at the farmers market with this fancy club polo that's sure to turn heads and make you stand out.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Club Polo",
  },
  "Dawn Breaker Background": {
    description:
      "Set the mood and create an atmosphere of peace and tranquility with this stunning dawn breaker background that will transport you to a serene and beautiful place.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dawn Breaker Background",
  },
  "Dawn Lamp": {
    description:
      "Light up your life and your farm with this sturdy and reliable dawn lamp that's perfect for early mornings and late nights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dawn Lamp",
  },
  "Eggplant Onesie": {
    description:
      "Keep cozy and comfortable in the eggplant fields with this cute and snuggly eggplant onesie that's perfect for lazy afternoons and chilly evenings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Eggplant Onesie",
  },
  "Fox Hat": {
    description:
      "Get wild and free with this furry and playful fox hat that's perfect for exploring the great outdoors and going on exciting adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fox Hat",
  },
  "Grave Diggers Shovel": {
    description:
      "Dig up some spooky and exciting surprises with this creepy and cool grave diggers shovel that's perfect for Halloween and other fun events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Grave Diggers Shovel",
  },
  "Infected Potion": {
    description:
      "Mix things up and add a little bit of excitement to your farming routine with this strange and mysterious infected potion that's sure to surprise and delight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infected Potion",
  },
  "Mushroom Hat": {
    description:
      "Get in touch with nature and feel like a whimsical woodland creature with this adorable and charming mushroom hat that's perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mushroom Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Hat",
  },
  "Mushroom Lamp": {
    description:
      "Set the mood and create a magical atmosphere on your farm with this enchanting and delightful mushroom lamp that will transport you to a world of wonder and whimsy.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Lamp",
  },
  "Mushroom Lights Background": {
    description:
      "Add a touch of magic and mystery to your farm with this mystical and otherworldly mushroom lights background that's perfect for creating an atmosphere of enchantment and wonder.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Lights Background",
  },
  "Mushroom Pants": {
    description:
      "Keep it practical and stylish with these sturdy and reliable mushroom pants that are perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Pants",
  },
  "Mushroom Shield": {
    description:
      "Protect yourself from danger and look cool doing it with this sturdy and reliable mushroom shield that's perfect for fending off pests and predators.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Shield",
  },
  "Mushroom Shoes": {
    description:
      "Keep your feet dry and comfy with these adorable and charming mushroom shoes that are perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Shoes",
  },
  "Mushroom Sweater": {
    description:
      "Keep warm and stylish with this cozy and comfortable mushroom sweater that's perfect for chilly nights and lazy afternoons.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mushroom Sweater",
  },
  "Rash Vest": {
    description:
      "Get ready for some fun in the sun with this stylish and practical rash vest that's perfect for staying safe and comfortable while you're out on the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rash Vest",
  },
  "Squid Hat": {
    description:
      "Get in touch with your inner sea creature with this fun and playful squid hat that's perfect for going on aquatic adventures and exploring the deep blue sea.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Squid Hat",
  },
  "Striped Red Shirt": {
    description:
      "Keep it simple and stylish with this classic and timeless striped red shirt that's perfect for any occasion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Striped Red Shirt",
  },
  "Striped Yellow Shirt": {
    description:
      "Add a pop of color and excitement to your wardrobe with this vibrant and cheerful striped yellow shirt that's sure to brighten up your day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Striped Yellow Shirt",
  },
  "Summer Top": {
    description:
      "Keep cool and comfortable during the hot summer months with this cute and stylish summer top that's perfect for any occasion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Summer Top",
  },
  "Sunburst Potion": {
    description:
      "Add a touch of magic and wonder to your farming routine with this exciting and mysterious sunburst potion that's sure to surprise and delight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunburst Potion",
  },
  "Water Gun": {
    description:
      "Get ready for some good old-fashioned fun in the sun with this playful and exciting water gun that's perfect for splashing around with your friends and family.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Water Gun",
  },
  "Wavy Pants": {
    description: "Add a touch of flair and style to your farming",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wavy Pants",
  },
  "White Turtle Neck": {
    description:
      "When the winter winds are blowin' cold and fierce, this here white turtle neck keeps me warm and toasty, and it looks darn good too.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "White Turtle Neck",
  },
  "Trial Tee": {
    description: "A shirt only attained through special testing sessions.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trial Tee",
  },
  "Auction Megaphone": {
    description:
      "Amp up the bidding frenzy with this booming piece of equipment. Nothing says 'sold!' quite like the Auction Megaphone.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Auction Megaphone",
  },
  "Auctioneer Slacks": {
    description:
      "Crafted for comfort and style, these slacks ensure you're never out of place, whether in the auction house or the cornfield.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Auctioneer Slacks",
  },
  "Bidder's Brocade": {
    description:
      "Elegance meets business with this blazer, your partner in turning any bid into a winning one.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bidder's Brocade",
  },
  "Harry's Hat": {
    description:
      "From the sun-drenched wheat fields to the auction's spotlight, this hat's a symbol of Harry's dedication to his craft.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Harry's Hat",
  },
  "Leather Shoes": {
    description:
      "No auctioneer's ensemble is complete without these sturdy, yet stylish, leather shoes. They're made for walkin', and that's just what they'll do.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Leather Shoes",
  },
  "Tangerine Hair": {
    description:
      "Stand out from the crowd with Harry's vibrant tangerine hair, spiked to perfection and crowned with a mustache of authority.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tangerine Hair",
  },
  "Witching Wardrobe": {
    description:
      "Step into the realm of style and elegance with the bewitching Witching Wardrobe wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Witching Wardrobe",
  },
  "Witch's Broom": {
    description:
      "Take flight on the wings of magic with the Witches Broom wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Witch's Broom",
  },
  "Infernal Bumpkin Potion": {
    description: "Unleash your infernal charm with the Infernal Bumpkin potion",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Bumpkin Potion",
  },
  "Infernal Goblin Potion": {
    description: "Unleash your infernal charm with the Infernal Goblin potion",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Goblin Potion",
  },
  "Imp Costume": {
    description:
      "Transform into a playful and charismatic imp with the Imp Costume wearable. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Imp Costume",
  },
  "Ox Costume": {
    description:
      "Embrace the strength and resilience of the ox with the Ox Suit wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ox Costume",
  },
  "Luna's Hat": {
    description:
      "Unleash your culinary prowess with Luna's Hat, a whimsical accessory that enhances your cooking speed.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -50,
      },
      { trait_type: "Boost", value: "Cooking" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Luna's Hat",
  },
  "Infernal Pitchfork": {
    description:
      "Embrace the power of the Infernal Pitchfork and witness the land yield a bountiful harvest. (Does not stack with criticals).",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 3,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Pitchfork",
  },
  "Infernal Horns": {
    description:
      "Tap into your inner infernal power with the Infernal Horns wearable. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Horns",
  },
  Cattlegrim: {
    description:
      "Harness the extraordinary abilities of the Cattlegrim and witness your animal produce soar to new heights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Animal Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cattlegrim",
  },
  "Crumple Crown": {
    description:
      "Crown yourself with the illustrious Crumple Crown, an exclusive wearable that exudes elegance and refinement.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crumple Crown",
  },
  "Merch Bucket Hat": {
    description: "A stylish bucket hat featuring the Sunflower Land logo.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merch Bucket Hat",
  },
  "Merch Coffee Mug": {
    description: "A Sunflower Land coffee mug to keep you caffeinated.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merch Coffee Mug",
  },
  "Dawn Breaker Tee": {
    description: "Show your love for Sunflower Land with this exclusive tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dawn Breaker Tee",
  },
  "Merch Tee": {
    description: "Official Sunflower Land merchandise tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merch Tee",
  },
  "Merch Hoodie": {
    description: "Stay cozy with this Sunflower Land hoodie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merch Hoodie",
  },
  "Birthday Hat": {
    description: "Celebrate with this festive birthday hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Birthday Hat",
  },
  "Double Harvest Cap": {
    description: "Double the harvest, double the fun.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Double Harvest Cap",
  },
  "Streamer Helmet": {
    description: "Stream your adventures with this stylish helmet.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Streamer Helmet",
  },
  "Corn Onesie": {
    description: "Transform into a cornstalk in this comfy onesie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Corn Onesie",
  },
  "Crow Wings": {
    description: "Fly high with these crow-like wings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crow Wings",
  },
  "Witches' Eve Tee": {
    description: "Celebrate Witches' Eve with this special tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Witches' Eve Tee",
  },
  "Wise Beard": {
    description: "Show your wisdom with this majestic beard.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Beard",
  },
  "Pumpkin Hat": {
    description: "Get into the spirit of autumn with this pumpkin hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pumpkin Hat",
  },
  "Wise Book": {
    description: "Carry your knowledge with this ancient tome.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Book",
  },
  "Wise Hair": {
    description: "Hair that exudes wisdom and experience.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Hair",
  },
  "Wise Robes": {
    description: "Robes worn by the wisest of Bumpkins.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Robes",
  },
  "Wise Slacks": {
    description: "Stylish and comfortable slacks for the wise Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Slacks",
  },
  "Wise Staff": {
    description: "Channel your inner wisdom with this magical staff.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wise Staff",
  },
  "Greyed Glory": {
    description: "Grey hair that adds a touch of maturity.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Greyed Glory",
  },
  "Tattered Jacket": {
    description: "A worn-out jacket with a story to tell.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tattered Jacket",
  },
  "Hoary Chin": {
    description: "A beard that shows the passage of time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hoary Chin",
  },
  "Tattered Slacks": {
    description: "Slacks that have seen their fair share of adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tattered Slacks",
  },
  "Old Shoes": {
    description: "Sturdy shoes that have stood the test of time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Old Shoes",
  },
  "Bat Wings": {
    description: "Wings that evoke the spirit of the night.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bat Wings",
  },
  "Gothic Twilight": {
    description: "A dress that captures the essence of twilight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gothic Twilight",
  },
  "Dark Enchantment Gown": {
    description: "A gown that exudes a mysterious enchantment.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dark Enchantment Gown",
  },
  "Goth Hair": {
    description: "Hair that embraces the darkness of the night.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goth Hair",
  },
  "Pale Potion": {
    description: "A potion that gives your Bumpkin a pale appearance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pale Potion",
  },
  "Stretched Jeans": {
    description: "Jeans perfect for a laid-back and casual look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Stretched Jeans",
  },
  "Skull Shirt": {
    description: "A shirt adorned with skulls for a daring style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Skull Shirt",
  },
  "Victorian Hat": {
    description: "A hat inspired by the elegance of the Victorian era.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Victorian Hat",
  },
  "Boater Hat": {
    description: "A classic boater hat for a stylish look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Boater Hat",
  },
  "Antique Dress": {
    description: "A dress that embodies vintage charm.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Antique Dress",
  },
  "Crimson Skirt": {
    description: "A skirt in a vibrant crimson shade.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimson Skirt",
  },
  "Chic Gala Blouse": {
    description: "A blouse that's perfect for a gala event.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chic Gala Blouse",
  },
  "Ash Ponytail": {
    description: "A ponytail with a subtle ash-gray hue.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ash Ponytail",
  },
  "Pink Ponytail": {
    description: "A playful ponytail in a delightful pink color.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pink Ponytail",
  },
  "Silver Streaks": {
    description: "Streaks of silver add a touch of sophistication.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Silver Streaks",
  },
  "Straw Hat": {
    description: "A classic and timeless straw hat for a sunny day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Straw Hat",
  },
  "Traveller's Backpack": {
    description:
      "A functional and stylish backpack for the adventurous Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Traveller's Backpack",
  },
  "Traveller's Pants": {
    description: "Comfortable pants that are essential for any journey.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Traveller's Pants",
  },
  "Traveller's Shirt": {
    description: "A versatile shirt that suits any traveler's wardrobe.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Traveller's Shirt",
  },
  "Potato Suit": {
    description:
      "A quirky and amusing potato-themed suit for those who love a good laugh.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Potato Suit",
  },
  "Parsnip Horns": {
    description:
      "A unique set of parsnip-shaped horns that adds a touch of whimsy to any outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Parsnip Horns",
  },
  "Brown Rancher Hair": {
    description:
      "A rugged and tousled hairstyle inspired by the hardworking ranchers of the countryside.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Brown Rancher Hair",
  },
  "Whale Hat": {
    description:
      "A fun and charming hat shaped like a friendly whale, perfect for ocean enthusiasts.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Whale Hat",
  },
  "Pumpkin Shirt": {
    description:
      "A cute shirt with a pumpkin design, perfect for fall festivities.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pumpkin Shirt",
  },
  Halo: {
    description:
      "A glowing halo that gives a celestial aura to its wearer. A symbol of a moderator",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Halo",
  },
  Kama: {
    description: "A dark mysterious farming sickle.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Kama",
  },
  "Grey Merch Hoodie": {
    description: "Stay cozy with this Sunflower Land grey hoodie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Grey Merch Hoodie",
  },
  "Unicorn Horn": {
    description: "Neiiiiigh. A magestical horn from the Crypto Unicorns collab",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Unicorn Horn",
  },
  "Unicorn Hat": {
    description: "Is that blossom? Fit right in with this rare unicorn hat",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "no" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Unicorn Hat",
  },
  "Feather Hat": {
    description:
      "A beautiful rare green feather hat - a special event giveaway",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Feather Hat",
  },
  "Valoria Wreath": {
    description: "A wreath from Valoria!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Valoria Wreath",
  },
  "Earn Alliance Sombrero": {
    description: "A sombrero from the Earn Alliance!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Earn Alliance Sombrero",
  },
  "Fresh Catch Vest": {
    description:
      "A comfortable and practical vest for your fishing adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fresh Catch Vest",
  },
  "Fish Pro Vest": {
    description: "A vest designed for professional fishermen.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Pro Vest",
  },
  "Reel Fishing Vest": {
    description:
      "A vest equipped with pockets and style to enhance your fishing experience.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reel Fishing Vest",
  },
  "Clown Shirt": {
    description:
      "A playful and colorful shirt that adds a touch of fun to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Clown Shirt",
  },
  "Luminous Anglerfish Topper": {
    description: "A unique hat featuring the luminous anglerfish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        value: 50,
        trait_type: "Increase Fish XP",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Luminous Anglerfish Topper",
  },
  "Abyssal Angler Hat": {
    description: "A mysterious hat inspired by the depths of the ocean.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Abyssal Angler Hat",
  },
  Harpoon: {
    description:
      "A versatile tool designed for spearfishing and capturing larger fish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Harpoon",
  },
  "Ancient Rod": {
    description:
      "A fishing rod with a classic design, perfect for those who appreciate tradition.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Cast Fish without Rod",
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient Rod",
  },
  "Fishing Hat": {
    description:
      "A practical and stylish hat that provides shade while fishing in the sun.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fishing Hat",
  },
  "Saw Fish": {
    description:
      "A unique and formidable fishing tool for cutting through tough materials.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Saw Fish",
  },
  Trident: {
    description: "A mythical fishing tool.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        value: 20,
        trait_type: "Fish Critical Hit Chance",
      },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Fish Critical Hit Amount",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trident",
  },
  "Bucket O' Worms": {
    description:
      "An essential secondary tool for bait, ensuring you're well-prepared for fishing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Bait" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Increase Worm Yield",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bucket O' Worms",
  },
  "Coconut Mask": {
    description: "A fun and tropical-themed mask.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Coconut Mask",
  },
  "Crab Trap": {
    description:
      "A handcrafted trap, designed for those who desire to catch an additional crab when digging or drilling.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "+1 Crab when digging or drilling",
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crab Trap",
  },
  "Seaside Tank Top": {
    description:
      "A comfortable and casual tank top, ideal for a day by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Seaside Tank Top",
  },
  "Fish Trap": {
    description: "An decorative trap for catching fish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Trap",
  },
  "Fishing Pants": {
    description:
      "Durable and comfortable pants designed for a full day of fishing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fishing Pants",
  },
  "Angler Waders": {
    description:
      "Waders that keep you dry and comfortable while fishing in water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        value: 10,
        trait_type: "Increase Daily Fishing Attempts",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Angler Waders",
  },
  "Fishing Spear": {
    description:
      "A specialized tool for spearfishing, adding excitement to your fishing adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fishing Spear",
  },
  "Flip Flops": {
    description:
      "Lightweight and easy-to-wear shoes for a relaxed day at the beach.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flip Flops",
  },
  Wellies: {
    description:
      "Waterproof and practical shoes for everyday greenhouse gardening adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wellies",
  },
  "Skinning Knife": {
    description:
      "A sharp and precise tool for cleaning and preparing your catch.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Skinning Knife",
  },
  "Sunflower Rod": {
    description:
      "A rod with a cheerful sunflower energy, perfect for sunny days by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        value: 10,
        trait_type: "Fish Critical Hit Chance",
      },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Fish Critical Hit Amount",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflower Rod",
  },
  "Tackle Box": {
    description:
      "An organized and spacious container for storing your fishing gear.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tackle Box",
  },
  "Infernal Rod": {
    description: "A fiery and eye-catching fishing rod with a unique design.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Rod",
  },
  "Mermaid Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Mermaid Potion",
  },
  "Squirrel Monkey Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Squirrel Monkey Potion",
  },
  "Koi Fish Hat": {
    description:
      "A hat inspired by the graceful and colorful koi fish, adding an elegant touch to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Koi Fish Hat",
  },
  "Normal Fish Hat": {
    description: "A classic fish-themed hat, perfect for fishing enthusiasts.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Normal Fish Hat",
  },
  "Stockeye Salmon Onesie": {
    description:
      "A cozy and fun onesie featuring the Stockeye Salmon, ideal for cold fishing trips.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Stockeye Salmon Onesie",
  },
  "Tiki Armor": {
    description:
      "A set of stylish and protective armor with a island inspired design.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tiki Armor",
  },
  "Tiki Mask": {
    description:
      "A unique mask that adds a touch of mystery and style to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tiki Mask",
  },
  "Tiki Pants": {
    description:
      "Comfortable and fashionable island themed pants, perfect for a tropical adventure.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tiki Pants",
  },
  "Banana Amulet": {
    description:
      "Go bananas for this amulet! Legends whisper it grants its wearer a-peel-ing charm and a slip-free day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_number",
        trait_type: "Increase Banana Yield",
        value: 0.5,
      },
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Banana Amulet",
  },
  "Banana Onesie": {
    description:
      "Cute and cozy, embrace the essence of a banana in this adorable onesie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Banana Growth Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Banana Onesie",
  },
  "Blossom Dumbo": {
    description:
      "A cheerful, happy expression graces this dumbo, symbolizing the fresh energy of spring. Wear it to bring a bright, joyful spirit wherever you go.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blossom Dumbo",
  },
  "Companion Cap": {
    description:
      "A trusty cap that keeps you company on your virtual adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Companion Cap",
  },
  "Radiant Dumbo": {
    description:
      "With a fiery, angry expression, this dumbo channels the intensity of the summer sun. It's perfect for those who want to wear their bold energy with pride.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Radiant Dumbo",
  },
  "Deep Sea Helm": {
    description:
      "Dive into the depths with this nautical-inspired helm, perfect for underwater explorations.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Chance of Marvel Map Pieces",
        value: 200,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Deep Sea Helm",
  },
  "Maple Dumbo": {
    description:
      "This octopus features a straight, slightly stern expression, embodying the crisp, cool energy of autumn. With its calm yet resolute demeanor, it’s perfect for those who appreciate the quiet strength of the season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Maple Dumbo",
  },
  "Pickaxe Shark": {
    description:
      "Equip yourself with this trusty pickaxe fashioned like a shark, ready for farming adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pickaxe Shark",
  },
  "Seedling Hat": {
    description:
      "Embrace the spirit of agriculture with this charming hat adorned with sprouting seedlings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Seedling Hat",
  },
  "Golden Seedling": {
    description: "A celebration of the 2 year Bud NFT Anniversary!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Seedling Hat",
  },
  "Gloomy Dumbo": {
    description:
      "This dumbo captures the melancholic stillness of winter. Perfect for those who resonate with the season's quiet, somber mood.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gloomy Dumbo",
  },
  "Ugly Christmas Sweater": {
    description: "A whimsical holiday wearable from Earn Alliance",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ugly Christmas Sweater",
  },
  "Candy Cane": {
    description: "A festive tool for spreading sweet holiday cheer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Candy Cane",
  },
  "Elf Hat": {
    description: "Get into the holiday spirit with this whimsical elf hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Elf Hat",
  },
  "Elf Potion": {
    description: "Magical elixir to bring out your inner elf.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Elf Potion",
  },
  "Elf Shoes": {
    description: "Stylish footwear to complete your elfin look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Elf Shoes",
  },
  "Elf Suit": {
    description: "A complete elf outfit for festive occasions.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Elf Suit",
  },
  "Santa Beard": {
    description: "Classic white beard to transform into the jolly old elf.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Santa Beard",
  },
  "Santa Suit": {
    description: "The iconic red suit for spreading joy as Santa Claus.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Santa Suit",
  },
  "Butterfly Wings": {
    description: "Delicate and colorful wings to add a touch of enchantment.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Butterfly Wings",
  },
  "Cozy Hoodie": {
    description:
      "Warm and comfortable hoodie for a snug and stylish winter look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cozy Hoodie",
  },
  "New Years Tiara": {
    description:
      "Elegant tiara to sparkle and shine as you welcome the new year.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "New Years Tiara",
  },
  "2026 Tiara": {
    description: "A sparkling tiara to ring in 2026 with shine and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "2026 Tiara",
  },
  "Northern Lights Background": {
    description:
      "Mesmerizing background capturing the beauty of the northern lights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Northern Lights Background",
  },
  "Short Shorts": {
    description: "Cool and trendy shorts for a casual and fashionable vibe.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Short Shorts",
  },
  "Winter Jacket": {
    description:
      "Insulated jacket to keep you warm and fashionable during winter.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Winter Jacket",
  },
  "Beehive Staff": {
    description: "A staff that harnesses the power of bees.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beehive Staff",
  },
  "Bee Smoker": {
    description: "A tool that calms bees.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bee Smoker",
  },
  "Bee Suit": {
    description: "Bee the best you can bee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Yield per full beehive",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bee Suit",
  },
  "Bee Wings": {
    description: "Wings that shimmer with the iridescence of blooming flowers",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bee Wings",
  },
  "Beekeeper Hat": {
    description: "A hat that protects you from bee stings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Production Speed",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beekeeper Hat",
  },
  "Beekeeper Suit": {
    description: "A suit that protects you from bee stings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beekeeper Suit",
  },
  "Crimstone Boots": {
    description: "Leave a trail vibrant red hues with each step.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Boots",
  },
  "Crimstone Pants": {
    description: "Exude wealth and power with these rare gem pants.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Pants",
  },
  "Crimstone Armor": {
    description: "A set of prestigious and protective armor.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Armor",
  },
  "Gardening Overalls": {
    description: "Live and breathe the cottage core life.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gardening Overalls",
  },
  "Crimstone Hammer": {
    description: "Behold the mega Crimstone.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield on 5th Mine",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Hammer",
  },
  "Crimstone Amulet": {
    description: "Regenerate Crimstone with amazing speed.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Crimstone Cooldown Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Amulet",
  },
  "Full Bloom Shirt": {
    description: "A floral masterpiece bursting with color and charm.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Full Bloom Shirt",
  },
  "Blue Blossom Shirt": {
    description:
      "Adorn yourself in soothing hues and delicate floral patterns.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Blossom Shirt",
  },
  "Fairy Sandals": {
    description: "Ethereal footwear that adds a touch of magic to every step.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fairy Sandals",
  },
  "Daisy Tee": {
    description:
      "A simple tee perfect for a day filled with sunshine and smiles.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Daisy Tee",
  },
  "Propeller Hat": {
    description:
      "A whimsical accessory that adds a playful touch to your style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Propeller Hat",
  },
  "Honeycomb Shield": {
    description: "A golden symphony of protection and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Yield per full beehive",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Honeycomb Shield",
  },
  "Hornet Mask": {
    description:
      "A bold accessory that captures the fierce yet fashionable spirit of the hornet.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Chance of Bee Swarm",
        value: 100,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Hornet Mask",
  },
  "Flower Crown": {
    description: "Crown yourself in petals, reign as the garden's royalty!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower Crown",
  },
  "Blue Monarch Dress": {
    description: "Flutter into style with the Blue Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Monarch Dress",
  },
  "Green Monarch Dress": {
    description:
      "Transform into a forest butterfly with the Green Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Green Monarch Dress",
  },
  "Orange Monarch Dress": {
    description: "Blaze with elegance in the Orange Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Orange Monarch Dress",
  },
  "Blue Monarch Shirt": {
    description: "Dress casually royal in the Blue Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Monarch Shirt",
  },
  "Green Monarch Shirt": {
    description: "Channel leafy monarch vibes with the Green Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Green Monarch Shirt",
  },
  "Orange Monarch Shirt": {
    description: "Paint the town red in the Orange Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Orange Monarch Shirt",
  },
  "Queen Bee Crown": {
    description: "Rule the hive with the Queen Bee Crown – majestic buzz!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Queen Bee Crown",
  },
  "Rose Dress": {
    description: "Bloom into beauty with the Rose Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rose Dress",
  },
  "Blue Rose Dress": {
    description:
      "A blue bloom of elegance – the Blue Rose Dress whispers enchantment!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blue Rose Dress",
  },
  "Chicken Hat": {
    description: "What can a Bumpkin do with a lazy chicken?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chicken Hat",
  },
  "Lucky Red Hat": {
    description: "A hat that captures the magic of the moon and stars.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lucky Red Hat",
  },
  "Lucky Red Suit": {
    description:
      "A suit that exudes the celestial energy of the moon and stars.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lucky Red Suit",
  },
  "Love's Topper": {
    description: "A hat that captures the essence of love and romance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love's Topper",
  },
  "Valentine's Field Background": {
    description: "A background that captures the spirit of love and romance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Valentine's Field Background",
  },
  "Non La Hat": {
    description: "A traditional hat that adds a touch of elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Rice Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Non La Hat",
  },
  "Oil Can": {
    description: "A tool for maintaining and repairing machinery.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oil Can",
  },
  "Olive Shield": {
    description: "A shield that provides protection and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Olive Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Olive Shield",
  },
  "Paw Shield": {
    description: "A shield that embodies the spirit of the wild.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Faction Pet Satiation",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 25,
      },
      { trait_type: "Boost", value: "Faction" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paw Shield",
  },
  "Royal Robe": {
    description: "A majestic cape that exudes regal elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Robe",
  },
  Crown: {
    description: "A crown that symbolizes power and authority.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crown",
  },
  Pan: {
    description: "A versatile tool for cooking and baking.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP gains",
        value: 25,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pan",
  },
  "Gift Giver": {
    description: "Wow, what a generous Bumpkin!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gift Giver",
  },
  "Soybean Onesie": {
    description: "Soy soy soy!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Soybean Onesie",
  },
  "Olive Royalty Shirt": {
    description: "A royal olive, the food of the rich.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Olive Yield",
        value: 0.25,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Olive Royalty Shirt",
  },
  "Royal Scepter": {
    description: "The scepter of the ruling family.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Scepter",
  },
  "Tofu Mask": {
    description: "The vegan warrior",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Soybean Yield",
        value: 0.1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tofu Mask",
  },
  "Cap n Bells": {
    description: "The fool's cap",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cap n Bells",
  },
  "Pixel Perfect Hoodie": {
    description: "The beautification of Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pixel Perfect Hoodie",
  },
  "Queen's Crown": {
    description: "A symbol of hope and prosperity",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Queen's Crown",
  },
  "Royal Dress": {
    description: "A dress fit for a queen.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Dress",
  },
  Motley: {
    description: "The traditional costume of a court room jester.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Motley",
  },
  "Goblin Armor": {
    description:
      "Rugged and rowdy, Goblin-approved protection. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Armor",
  },
  "Goblin Helmet": {
    description:
      "Strong and sturdy, crafted for fearless adventures in untamed lands. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Helmet",
  },
  "Goblin Pants": {
    description:
      "These pants blend agility with Goblin craftsmanship for swift maneuvers. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Pants",
  },
  "Goblin Sabatons": {
    description:
      "Designed to outpace and outlast any foe. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Sabatons",
  },
  "Goblin Axe": {
    description:
      "This axe is a testament to Goblin strength and unmatched battle prowess. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Axe",
  },
  "Nightshade Armor": {
    description:
      "An Armor, crafted for stealth and resilience in the shadows. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Armor",
  },
  "Nightshade Helmet": {
    description:
      "A strong helmet of secrecy and silent strength. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Helmet",
  },
  "Nightshade Pants": {
    description:
      "These pants are blending agility with the mystery of the night. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Pants",
  },
  "Nightshade Sabatons": {
    description:
      "Perfect design where every step is a whisper in the dark. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Sabatons",
  },
  "Nightshade Sword": {
    description:
      "A blade that strikes with the precision of moonlit steel. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Sword",
  },
  "Bumpkin Armor": {
    description:
      "A sturdy protection that honors tradition and strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Armor",
  },
  "Bumpkin Helmet": {
    description:
      "Adorn your head with a symbol of rustic fortitude and unwavering resolve. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Helmet",
  },
  "Bumpkin Sword": {
    description:
      "A weapon forged in fields and forests, ready for any challenge. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Sword",
  },
  "Bumpkin Pants": {
    description:
      "Navigate countryside and city alike blending comfort with the spirit of adventure. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Pants",
  },
  "Bumpkin Sabatons": {
    description:
      "Stampede through fields in this sturdy footwear echoing the resilience of rural life. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Sabatons",
  },
  "Sunflorian Armor": {
    description:
      "A shimmering protection that mirrors the sun's strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Armor",
  },
  "Sunflorian Sword": {
    description:
      "A blade ablaze with the courage and brilliance of the sun. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Sword",
  },
  "Sunflorian Helmet": {
    description:
      "This helmet is a beacon of light and guardian against shadows. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Helmet",
  },
  "Sunflorian Pants": {
    description:
      "Stride confidently in attire that captures the warmth and energy of all Sunflorians. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Pants",
  },
  "Sunflorian Sabatons": {
    description:
      "Each step taken in these shoes resonating with the power and vitality. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Sabatons",
  },
  "Knight Gambit": {
    description:
      "Don this hat and be ready to charge into adventure with a playful twist of strategy and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Knight Gambit",
  },
  "Royal Braids": {
    description: "A hairstyle fit for a royal.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Royal Braids",
  },
  "Painter's Cap": {
    description: "A hat fit for a painter",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Painter's Cap",
  },
  "Festival of Colors Background": {
    description: "A background fit for a painter",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Festival of Colors Background",
  },
  "Pharaoh Headdress": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pharaoh Headdress",
  },
  "Camel Onesie": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Patch Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Camel Onesie",
  },
  "Amber Amulet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Amber Amulet",
  },
  "Desert Background": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Background",
  },
  "Explorer Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Explorer Shirt",
  },
  "Dev Wrench": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Oil Cooldown Reduction Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dev Wrench",
  },
  "Rock Hammer": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rock Hammer",
  },
  "Sun Scarab Amulet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sun Scarab Amulet",
  },
  "Explorer Hat": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Explorer Hat",
  },
  "Oil Protection Hat": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oil Protection Hat",
  },
  "Explorer Shorts": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Explorer Shorts",
  },
  "Oil Overalls": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oil Overalls",
  },
  "Desert Merchant Turban": {
    description: "A turban to stay safe from the fierce desert and sand.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Merchant Turban",
  },
  "Desert Merchant Shoes": {
    description: "Protect your feet from the scorching heat of the desert.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Merchant Shoes",
  },
  "Desert Merchant Suit": {
    description: "A light-weight attire worned by desert merchants.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Merchant Suit",
  },
  "Desert Camel Background": {
    description:
      "The Desert Camel accompanies you in the sand full of discovery.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Desert Camel Background",
  },
  "Water Gourd": {
    description: "Quench your thirst while exploring the desert.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Water Gourd",
  },
  "Rocket Onesie": {
    description:
      "Ready to blast off into imagination, it's a miniature marvel of cosmic adventure!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rocket Onesie",
  },
  "Coin Aura": {
    description:
      "Its elegant dance captivates the eye, embodying the essence of prosperity and luxury before gracefully vanishing. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Coin Aura",
  },
  "Ankh Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ankh Shirt",
  },
  "Ancient Shovel": {
    description:
      "Ancient Shovel is a mystical tool that allows holders of this shovel to dig for treasure without needing a traditional sand shovel.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Dig treasure without Sand Shovel",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ancient Shovel",
  },
  "Infernal Drill": {
    description:
      "Infernal Drill is a potent device that enables holders of drill to extract oil directly without the need for a traditional oil drill.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Drill Oil without Oil Drill",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Drill",
  },
  "Lemon Shield": {
    description:
      "Lemon Shield is a boost that enhances lemon production by increasing the yield of each harvest by 1.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lemon Shield",
  },
  "Scarab Wings": {
    description:
      "Scarab Wings is a vibrant and decorative accessory featuring intricate, winged designs that evoke ancient mysticism and elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Scarab Wings",
  },
  "Grape Pants": {
    description: "Stylist pants for the grape farmer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: 0.2,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Grape Pants",
  },
  "Bionic Drill": {
    description:
      "The Bionic Drill is a state-of-the-art wearable designed for the modern desert explorer. Enjoy +5 desert digs per day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bionic Drill",
  },
  "Fossil Head": {
    description:
      "The Fossil Head is an artefact that was discovered by an ancient digger, it's said to be a rare find!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fossil Head",
  },
  "Bumpkin Crown": {
    description:
      "A magestic crown with intricate design and eerie glowing games, fit for a Bumpkin Leader. Earn 25% more in FLOWER and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase FLOWER gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Crown",
  },
  "Goblin Crown": {
    description:
      "A dark, jagged crown with glowing gems, ideal for the Goblin King. Earn 25% more in FLOWER and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase FLOWER gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Crown",
  },
  "Nightshade Crown": {
    description:
      "A midnight-black crown with deep purple and silver details, fitting for a leader whose presence commands respect and mystery. Earn 25% more in FLOWER and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase FLOWER gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Crown",
  },
  "Sunflorian Crown": {
    description:
      "A majestic crown, adorned with a radiant ruby centerpiece and golden embellishments, it evokes the grandeur and authority of a leader. Earn 25% more in FLOWER and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase FLOWER gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Crown",
  },
  "Bumpkin Shield": {
    description:
      "This shield radiates with a divine blue light, symbolizing protection and justice. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Shield",
  },
  "Goblin Shield": {
    description:
      "This shield is built for Goblin warriors who thrive in the heat of battle. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Shield",
  },
  "Nightshade Shield": {
    description:
      "The shield’s surface is a deep, shadowy black feathers with intricate violet accents that pulse with ominous energy. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Shield",
  },
  "Sunflorian Shield": {
    description:
      "A symbol of divine authority, the Sunflorian Shield is reserved for only the most noble of kings and queens. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Shield",
  },
  "Bumpkin Quiver": {
    description:
      "The Bumpkin Quiver features vibrant red and blue fabrics, reinforced with iron accents that speak to the strength and resilience of the Bumpkin. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Quiver",
  },
  "Goblin Quiver": {
    description:
      "Crafted from the parts of horned-beasts and stitched with Goblin ingenuity, this quiver is as rugged as it is practical. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Quiver",
  },
  "Nightshade Quiver": {
    description:
      "Enigmatic and sleek, the Nightshade Quiver is bound in dark, supple leather, designed for those who harvest under the cover of darkness. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Quiver",
  },
  "Sunflorian Quiver": {
    description:
      "The Sunflorian Quiver, crafted from luxurious cream-colored fabric and adorned with gleaming gold accents, is a symbol of royal grace and divine blessing. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Quiver",
  },
  "Bumpkin Medallion": {
    description:
      "This sturdy medallion, crafted from iron and adorned with blue gem, is beloved by Bumpkins. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Medallion",
  },
  "Goblin Medallion": {
    description:
      "Favored by Goblins for its efficiency, it helps you prepare meals at lightning speed, just like their ingenious contraptions and creations. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Medallion",
  },
  "Nightshade Medallion": {
    description:
      "This medallion channels the Nightshade's secretive allure and their skill in crafting refined and exotic dishes swiftly. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Nightshade Medallion",
  },
  "Sunflorian Medallion": {
    description:
      "This medallion embodies the Sunflorians' blend of warmth and efficiency, ensuring your culinary creations are prepared with grace and swiftness. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sunflorian Medallion",
  },
  "Pumpkin Plaza Background": {
    description:
      " A place where the air is filled with the scent of fresh pumpkins and the sound of a creaking windmill. The place is alive with unique Bumpkins, each with their own stories and quirks. Whether you're tending to the vibrant plaza or chatting with the locals, Pumpkin Plaza offers a warm, welcoming atmosphere that feels like home.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pumpkin Plaza Background",
  },
  "Goblin Retreat Background": {
    description:
      "This lively enclave is where Goblins gather to trade rare resources and share tales of adventure. The Retreat is a bustling hub of activity, where Bumpkins can meet friends, engage in bartering, and uncover the secrets of the Goblin's mischievous ways.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Goblin Retreat Background",
  },
  "Kingdom Background": {
    description:
      "The majestic heart of the realm, where the queen presides over the land. The Kingdom is divided among four powerful factions — Bumpkins, Goblins, Nightshades, and Sunflorians — each vying for influence and favor.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Kingdom Background",
  },
  "Gam3s Cap": {
    description:
      "This stylish cap not only shows off your in-game style but also serves as a badge of honor for supporting your favourite in Web3 gaming in GAM3S.GG, a web3 gaming platform that acts as a hub for web3 gamers. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gam3s Cap",
  },
  "Cowboy Hat": {
    description:
      "A classic wide-brimmed hat with a rugged charm, perfect for life on the open plains. Protects from the sun while adding a touch of cowboy style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowboy Hat",
  },
  "Cowboy Shirt": {
    description:
      "This durable, checked shirt is made for the hardworking cowpoke.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowboy Shirt",
  },
  "Cowboy Trouser": {
    description:
      "These sturdy trousers are built to withstand the wear and tear of ranch life, complete with a touch of style fit for a true cowboy.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowboy Trouser",
  },
  "Cowboy Boots": {
    description:
      "A tough, stylish pair of leather boots, complete with spurs. Ideal for long days in the saddle and showing off your cowboy flair.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowboy Boots",
  },
  "Infernal Bullwhip": {
    description:
      "This menacing bullwhip is imbued with fiery power, making it as intimidating as it is effective. -50% Feed to Barn Animal",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Barn Animal Feed Reduction",
        value: 50,
      },
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Bullwhip",
  },
  "White Sheep Onesie": {
    description:
      "Cozy up in this fluffy, woolly onesie—perfect for a snug night in or a playful day in the plaza! With its irresistible charm, you will be the cutest sheep in the herd. 0.25+ Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Wool",
        value: 0.25,
      },
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "White Sheep Onesie",
  },
  "Black Sheep Onesie": {
    description:
      "Stand out in the flock with this soft, warm onesie. This charming black sheep outfit adds a fun twist to cozy wear. +2 Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Wool",
        value: 2,
      },
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Black Sheep Onesie",
  },
  "Chicken Suit": {
    description:
      "Cluck your way into any gathering with this playful Chicken Suit! +1 Feather",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Feather",
        value: 1,
      },
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chicken Suit",
  },
  "Cowgirl Skirt": {
    description:
      "A stylish skirt with a Cowboy twist, perfect for those days spent in the sun or dancing around the bonfire.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowgirl Skirt",
  },
  "Merino Jumper": {
    description:
      "Crafted from the finest wool, this cozy jumper provides unparalleled warmth and comfort. +1 Merino Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Merino Wool",
        value: 1,
      },
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Merino Jumper",
  },
  "Dream Scarf": {
    description:
      "A soft, ethereal scarf that feels like a whisper in the wind. Wrap yourself in comfort and style with this dreamy accessory. 20% reduction in Sheep sleep time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Sheep Produce Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dream Scarf",
  },
  "Cowbell Necklace": {
    description:
      "A charming necklace for any dairy enthusiast featuring a tiny, jingling cowbell that cows can’t resist! +2 Milk",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Milk",
        value: 2,
      },
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cowbell Necklace",
  },
  "Milk Apron": {
    description:
      "A sturdy, practical apron designed for those working with dairy. Handy, comfortable, and perfect for any farmhouse chores. +0.5 Milk",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Milk",
        value: 0.5,
      },
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Milk Apron",
  },
  "Shepherd Staff": {
    description:
      "A tall, rustic staff crafted for herding. It’s both a trusty tool and a symbol of a watchful, caring shepherd.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Shepherd Staff",
  },
  "Sol & Luna": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sol & Luna",
  },
  "Fossil Armor": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fossil Armor",
  },
  "Fossil Pants": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fossil Pants",
  },
  "Rice Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Rice Shirt",
  },
  Sickle: {
    description:
      "With each swing, golden wheat falls, paving the way for a bountiful harvest.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wheat Yield",
        value: 2,
      },
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sickle",
  },
  "Speed Boots": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Speed Boots",
  },
  "Tomato Apron": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Tomato Apron",
  },
  "Adventurer's Suit": {
    description:
      "The suit of an adventurer mysteriously found in the forest...",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Adventurer's Suit",
  },
  "Adventurer's Torch": {
    description: "A torch of an adventurer mysteriously found in the forest.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Adventurer's Torch",
  },
  "Pumpkin Head": {
    description:
      "A special hat for the bravest bumpkins that conquered the Halloween maze!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pumpkin Head",
  },
  "Gingerbread Onesie": {
    description:
      "Step into the holiday spirit with this cozy and charming Gingerbread Onesie! Designed to resemble a freshly baked gingerbread cookie, this onesie features a rich, golden-brown fabric adorned with frosting-like white trims and colorful gumdrop buttons.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gingerbread Onesie",
  },
  "New Years Crown": {
    description: "Wow, it looks like someone started 2025 with a bang!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "New Years Crown",
  },
  "Ladybug Suit": {
    description:
      "A charming red-and-black polka-dotted suit that brings the playful energy of a ladybug to life.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Onion Coin Cost",
        value: -25,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Ladybug Suit",
  },
  "Acorn Hat": {
    description:
      "A cute, nature-inspired hat shaped like an acorn, perfect for woodland adventures. +1 Timeshard from Deliveries, Chores & Bounties during Winds of Change Chapter.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Acorn Hat",
  },
  "Crab Hat": {
    description:
      "A cute, living crab perched atop your head, adding charm and a little extra personality. This friendly companion helps you catch more treasures when fishing!",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "Bonus Fishing Bounty",
        value: 1,
      },
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crab Hat",
  },
  "Weather Hat": {
    description:
      "A stylish top hat with a unique device that gauges the season's temperature, indicating whether it's hot, cold, or neutral. Perfect for staying in tune with the weather while keeping your look sharp.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Weather Hat",
  },
  "Sakura Shirt": {
    description:
      "A beautiful shirt adorned with delicate cherry blossom patterns, celebrating spring's beauty.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sakura Shirt",
  },
  "Squirrel Onesie": {
    description:
      "A cozy, full-body outfit that transforms you into an adorable, bushy-tailed squirrel.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Squirrel Onesie",
  },
  "Walrus Onesie": {
    description:
      "A cozy, full-body outfit that transforms you into an adorable, walrus.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Pet XP" },
      {
        display_type: "boost_number",
        trait_type: "+5 pet XP per food request",
        value: 5,
      },
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Walrus Onesie",
  },
  "Crimstone Spikes Hair": {
    description:
      "Jagged crimstone spikes that let you mine crimstone for free.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crimstone" },
      {
        display_type: "boost_number",
        trait_type: "Free crimstone mining",
        value: 1,
      },
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Crimstone Spikes Hair",
  },
  "Paw Aura": {
    description: "A paw-shaped aura that lets you feed pets for free.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Pets" },
      {
        display_type: "boost_number",
        trait_type: "Free pet feeding",
        value: 1,
      },
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paw Aura",
  },
  "Victoria's Apron": {
    description: "A refined apron with a chance to reset pet food requests.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Pets" },
      {
        display_type: "boost_percentage",
        trait_type: "Pet request reset chance",
        value: 33,
      },
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Victoria's Apron",
  },
  "Beast Shoes": {
    description:
      "Sturdy shoes that grant extra XP for medium and hard food requests.",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Pet XP" },
      {
        display_type: "boost_number",
        trait_type: "+100 XP to medium food requests",
        value: 100,
      },
      {
        display_type: "boost_number",
        trait_type: "+250 XP to hard food requests",
        value: 250,
      },
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Beast Shoes",
  },
  "Fish Hook Hat": {
    description: "A fisher's hat adorned with a trusty hook.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Hook Hat",
  },
  "Fish Hook Vest": {
    description: "A practical vest built for the docks and tides.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Hook Vest",
  },
  "Fish Hook Waders": {
    description: "Waders made for long days in the shallows.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fish Hook Waders",
  },
  "Corn Silk Hair": {
    description: "Soft, flowing hair inspired by corn silk.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Corn Silk Hair",
  },
  "Locust Onesie": {
    description:
      "A striking onesie that represents the power and swarming nature of locusts. This outfit captures the essence of these formidable insects, perfect for anyone who wants to channel the energy of a locust swarm in their look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Locust Onesie",
  },
  "Locust King Onesie": {
    description:
      "A mystical body transformation onesie that grants the regal aura of a locust king.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Locust King Onesie",
  },
  "Glacial Plume": {
    description:
      "Elegant, icy wings that shimmer with a frosty glow, embodying the beauty of winter.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Glacial Plume",
  },
  "Solflare Aegis": {
    description:
      "A radiant shield infused with the power of the sun, offering both warmth and protection.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Summer Crop Growth Time",
        value: -50,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Solflare Aegis",
  },
  "Blossom Ward": {
    description:
      "A beautifully crafted shield adorned with vibrant cherry blossom flowers, designed to enhance the health and vitality of your crops during the spring season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Spring Crop Yield",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Blossom Ward",
  },
  "Autumn's Embrace": {
    description:
      "A shield crafted in warm, earthy tones, inspired by the golden hues of autumn leaves.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Autumn Crop Growth Time",
        value: -50,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Autumn's Embrace",
  },
  "Frozen Heart": {
    description:
      "A shield forged from the essence of winter's chill, its crystal surface shimmers with frosty elegance. It pulses with the quiet strength of the cold, offering protection while ensuring that even in the harshest winter, life endures and thrives.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Winter Crop Yield",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frozen Heart",
  },
  "Love Heart Onesie": {
    description:
      "A heart so big, you can wear it! Spread love and coziness wherever you go in this charming onesie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Heart Onesie",
  },
  "Love Bear Onesie": {
    description:
      "Soft, snuggly, and as huggable as a teddy bear, this onesie is a symbol of pure affection and comfort.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Bear Onesie",
  },
  "Flower Bouquet": {
    description:
      "A fragrant bundle of fresh-picked blooms, ready to brighten someone's day with the language of flowers.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower Bouquet",
  },
  "Streamer Hat": {
    description:
      "A stylish hat adorned with a microphone, perfect for those who want to make a statement. +1 Love Charm for everyone who interacts with you.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Streamer Hat",
  },
  "Dino Onesie": {
    description:
      "Stomp around in prehistoric style! Cozy, cute, and just fierce enough to remind everyone who rules the jungle.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Dino Onesie",
  },
  "Golden Wings": {
    description:
      "Radiate with celestial grace as you soar through the skies, leaving a trail of golden light in your wake.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Golden Wings",
  },
  "Flower Mask": {
    description:
      "A blooming masterpiece that frames your face in petals of charm. +1 Geniseeds from deliveries, chores & bounties.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Flower Mask",
  },
  "Luvvy Head": {
    description:
      "Head over heels in love! This heart-filled headpiece is all about spreading joy, affection, and a little bit of blush.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Luvvy Head",
  },
  "Grumpy Cat": {
    description:
      "Perched atop your head, this feline friend judges your every move… but secretly enjoys the ride.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Grumpy Cat",
  },
  "Love Puff Aura": {
    description:
      "A gentle poof of floating hearts that follows you wherever you go, because love should always be in the air.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Puff Aura",
  },
  "Carrot Pitchfork": {
    description: "Looks tasty, but it was not made for you to eat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Carrot Pitchfork",
  },
  "Handheld Bunny": {
    description: "Now all that's missing is the top hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Handheld Bunny",
  },
  "Bunny Pants": {
    description: "Leave mysterious footprints to fool the other bumpkins!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bunny Pants",
  },
  "Bunny Mask": {
    description: "Other easter bunnies will think you are one of them!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bunny Mask",
  },
  "Easter Apron": {
    description: "Perfect for getting chocolate on!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Easter Apron",
  },
  "Bloomwarden Suit": {
    description:
      "Woven from enchanted petals and dawn's dew, this suit protects the fields and those who tend them.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bloomwarden Suit",
  },
  "Embersteel Suit": {
    description:
      "Forged in volcanic heartfires, this armor blazes with the spirit of an unyielding defender.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Embersteel Suit",
  },
  "Amberfall Suit": {
    description:
      "Dripping with the golden hues of autumn, this suit whispers of fading leaves and hidden strength.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Amberfall Suit",
  },
  "Glacierguard Suit": {
    description:
      "Cold as the northern winds, this suit shields its wearer with ancient frostbound resilience.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Glacierguard Suit",
  },
  "Broccoli Hat": {
    description:
      " crunchy crown for the veggie lover — surprisingly comfortable and extremely nutritious-looking!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Broccoli Hat",
  },
  "Frost Sword": {
    description:
      "Carved from eternal ice, this blade chills foes to their core with a single graceful swing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frost Sword",
  },
  "Medic Apron": {
    description:
      "Worn by the caretakers of the sick and small, this apron carries the scent of healing herbs and kindness.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Medic Apron",
  },
  "Obsidian Necklace": {
    description:
      "A shard of molten earth turned elegant charm, pulsing softly with ancient, dormant power.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Obsidian Necklace",
  },
  "Red Pepper Onesie": {
    description:
      "Spicy, snuggly, and absolutely sizzling with personality — it’s the hottest onesie in the land!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Red Pepper Onesie",
  },
  "Love Charm Shirt": {
    description:
      "Woven with affection and stitched with sparkles. +1 Geniseeds from deliveries, chores & bounties.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Love Charm Shirt",
  },
  "Sky Island Background": {
    description:
      "High above the clouds lies a floating haven of peace, mystery, and boundless imagination.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sky Island Background",
  },
  "Oracle Syringe": {
    description:
      "Infused with the Barn Delight, this curious tool channels healing to every ailing animals with a burst of magical care.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oracle Syringe",
  },
  "Coin Head": {
    description:
      "Proof you put your tokens where your flowers are. Now you’ve got the hat to prove it.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Coin Head",
  },
  "Paint Splattered Hair": {
    description:
      "Each streak tells a story—of bold brushes, happy accidents, and a day well spent in color",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paint Splattered Hair",
  },
  "Paint Splattered Shirt": {
    description:
      "This shirt has seen things—brilliant ideas, wild inspiration, and maybe a little paint fight or two.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paint Splattered Shirt",
  },
  "Paint Splattered Overalls": {
    description:
      "Once clean and proper, now a proud canvas of your artistic chaos. Every stain is a memory.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paint Splattered Overalls",
  },
  "Paint Spray Can": {
    description:
      "A favorite tool of rebellious artists —shake it and the air tingles with creativity.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Paint Spray Can",
  },
  "Slime Hat": {
    description:
      "It crawled onto your head and refused to leave. Now you’re bonded for life... probably.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Slime Hat",
  },
  "Slime Wings": {
    description: "Delightfully gooey and questionably aerodynamic",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Slime Wings",
  },
  "Slime Aura": {
    description:
      "A squishy shimmer surrounds you, as if a mischievous slime chose you as its best friend.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Slime Aura",
  },
  "Brush Back Hair": {
    description: "Slick and stylish, ready for silly business.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Brush Back Hair",
  },
  Moustache: {
    description: "Adds instant wisdom and a dash of mischief.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moustache",
  },
  "Chemist Potion": {
    description: "A bubbling flask of who-knows-what. Handle with care!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chemist Potion",
  },
  "Diamond Patterned Vest": {
    description: "Sharp style that says, “I mean farm-ness.”",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Diamond Patterned Vest",
  },
  "Recycle Shirt": {
    description: "Wear your eco-pride right on your chest.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Recycle Shirt",
  },
  "Garbage Bin Hat": {
    description: "Trashy? Maybe. Iconic? Definitely.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Garbage Bin Hat",
  },
  "Turd Topper": {
    description: "A cheeky crown for stinkers with style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Turd Topper",
  },
  "Architect Ruler": {
    description: "For precise plans and pointy ideas.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Architect Ruler",
  },
  "Onion Leek": {
    description:
      "This veggie’s not just juicy — it’s a source of top-secret leaks.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Onion Leek",
  },
  "Oil Gallon": {
    description:
      "A full jug of thick, greasy oil. Essential for keeping engines running... and boots slippery.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Secondary Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Oil Gallon",
  },
  "Alchemist Apron": {
    description:
      "For when experiments get heated—protects against splashes and volatile fashion choices.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Alchemist Apron",
  },
  "Lava Swimwear": {
    description:
      "Forged in fire, cooled for splash zones. Warning: May cause spontaneous style eruptions.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Lava Swimwear",
  },
  "Wooly Dress": {
    description: " Fuzzy, cozy, and cute as a sheep.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wooly Dress",
  },
  "Raccoon Onesie": {
    description:
      "Cute, stripey, and ready to steal your heart and maybe your crops.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Raccoon Onesie",
  },
  "Moonseeker Potion": {
    description: "Side effects include glowing bones and zero heartbeat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moonseeker Potion",
  },
  "Frizzy Bob Cut": {
    description: "Perfect for when you wake up spooky and fabulous.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frizzy Bob Cut",
  },
  "Two-toned Layered": {
    description: "Half light, half dark — all style",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Two-toned Layered",
  },
  "Halloween Deathscythe": {
    description: "For harvesting crops… or souls. Mostly crops.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Halloween Deathscythe",
  },
  "Moonseeker Hand Puppet": {
    description: "It’s cute until it starts whispering.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Moonseeker Hand Puppet",
  },
  "Sweet Devil Horns": {
    description: "Sweet, stylish, and just a bit sinful.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sweet Devil Horns",
  },
  "Trick and Treat": {
    description: "Trick on the left, Treat on the right — both chaos.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Trick and Treat",
  },
  "Jack O'Sweets": {
    description: "The sweetest pumpkin in the patch.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Jack O'Sweets",
  },
  "Frank Onesie": {
    description: "Sewn with love, lightning, and a touch of madness.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Frank Onesie",
  },
  "Research Uniform": {
    description: "For experiments that definitely won’t explode.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Research Uniform",
  },
  "Sweet Devil Dress": {
    description: "Cute, sugary, and slightly cursed.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sweet Devil Dress",
  },
  "Underworld Stimpack": {
    description: "Boosts stamina, darkness, and dramatic entrances.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Underworld Stimpack",
  },
  "Sweet Devil Wings": {
    description: "Powered by sugar and sass.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Sweet Devil Wings",
  },
  "Wisp Aura": {
    description: "These little flames seem alive… and fond of you.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wisp Aura",
  },
  "Luna's Crescent": {
    description:
      "A mysterious weapon infused with moonlight, humming with celestial energy.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Luna's Crescent",
  },
  "Master Chef's Cleaver": {
    description: "A sharp knife for cutting through tough ingredients.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Master Chef's Cleaver",
  },
  "Training Whistle": {
    description: "A sharp whistle that keeps every champion focused and ready.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Training Whistle",
  },
  "Chef Shirt": {
    description:
      "A tailored uniform stitched for those who master the art of cooking.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Chef Shirt",
  },
  "Pet Specialist Shirt": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Specialist Shirt",
  },
  "Pet Specialist Pants": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Specialist Pants",
  },
  "Pet Specialist Hat": {
    description: "",
    decimals: 0,
    attributes: [],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pet Specialist Hat",
  },
  "Xmas Top Hat": {
    description: "A hat fit for holiday festivities and winter wonderlands.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Xmas Top Hat",
  },
  "Reindeer Mask": {
    description: "Just be sure Santa doesn't catch you wearing this!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Reindeer Mask",
  },
  "Snowman Mask": {
    description:
      "A festive mask shaped like a snowman, complete with a carrot nose and coal eyes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Snowman Mask",
  },
  "Cool Glasses": {
    description: "So cool they might just freeze you!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cool Glasses",
  },
  "Comfy Xmas Pants": {
    description:
      "A pair of cozy pants perfect for keeping you warm during the holidays.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Comfy Xmas Pants",
  },
  "Holiday Feast Background": {
    description: "Food galore!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Holiday Feast Background",
  },
  "Comfy Xmas Sweater": {
    description: "A cozy sweater to keep you warm during the holidays.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Comfy Xmas Sweater",
  },
  "Candy Halbred": {
    description:
      "A sweet and sticky halbred made from the finest candy, perfect for those who love a little sweetness in their battles.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Candy Halbred",
  },
  "Cookie Shield": {
    description:
      "A sturdy shield made from the finest cookie dough, just don't use it if your opponent is hungry!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cookie Shield",
  },
  "Cozy Reindeer Onesie": {
    description:
      "A warm and cozy onesie, perfect for keeping you snug during the holiday season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cozy Reindeer Onesie",
  },
  "Diamond Snow Aura": {
    description:
      "A sparkling aura of diamond-like snowflakes that glisten and shimmer with every movement, bringing a touch of winter magic wherever you go.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Diamond Snow Aura",
  },
  "Neon Noiz Jacket": {
    description:
      "Wearing it may cause nearby pixels to start vibing aggressively.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Neon Noiz Jacket",
  },
  "404 Chic Top": {
    description:
      "The server couldn't locate this shirt, but fashion always finds a way.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "404 Chic Top",
  },
  "Neon Noiz Pants": {
    description: "Warning: May attract moths and questionable dance moves.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Neon Noiz Pants",
  },
  "404 Chic Skirt": {
    description: "Stylish enough to crash the village rendering engine.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "404 Chic Skirt",
  },
  "Admin Fools Tools": {
    description:
      "Absolutely useless in your hands. Devs insist it's 'for decoration'.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Admin Fools Tools",
  },
  "Neon Noiz Shoes": {
    description: "Powered by vibes and unstable pixels.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Neon Noiz Shoes",
  },
  "404 Chic Boots": {
    description:
      "Error 404: Walking animation not found. Somehow still fashionable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "404 Chic Boots",
  },
  "Aether Specs": {
    description: "See beyond the veil… or at least look like you can.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Aether Specs",
  },
  "Faulty Barrier Background": {
    description: "Protects you from absolutely nothing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Faulty Barrier Background",
  },
  "Cardboard Wings": {
    description: "Flight sold separately.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Cardboard Wings",
  },
  "Glitch Aura": {
    description: "Not a bug. Definitely a feature.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Glitch Aura",
  },
  "Bumpkin Eyes": {
    description: "The classic Bumpkin gaze.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Eyes",
  },
  "Big Wink Eyes": {
    description: "Go big or go home.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Big Wink Eyes",
  },
  "Fun Eyes": {
    description: "Sparkle with mischief.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fun Eyes",
  },
  "Giggle Eyes": {
    description: "Something funny?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Giggle Eyes",
  },
  "Grumpy Eyes": {
    description: "Not a morning Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Grumpy Eyes",
  },
  "Relaxed Eyes": {
    description: "Easy does it.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Relaxed Eyes",
  },
  "Scared Eyes": {
    description: "Wide-eyed wonder.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Scared Eyes",
  },
  "Surprised Eyes": {
    description: "Plot twist!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Surprised Eyes",
  },
  "Wink Eyes": {
    description: "A little wink goes a long way.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Eyes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Wink Eyes",
  },
  "Bumpkin Smile": {
    description: "The default cheerful grin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Bumpkin Smile",
  },
  "Angry Mouth": {
    description: "Someone stole your crops.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Angry Mouth",
  },
  "Baby Teeth": {
    description: "Adorably uneven.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Baby Teeth",
  },
  "Big Smile": {
    description: "Show those pearly pixels.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Big Smile",
  },
  "Fanged Smile": {
    description: "Friendly… mostly.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Fanged Smile",
  },
  "Gold Teeth": {
    description: "Shine on.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Gold Teeth",
  },
  "Infernal Smile": {
    description: "Hot take.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Infernal Smile",
  },
  "Neutral Mouth": {
    description: "Keeping it professional.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Mouth" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Neutral Mouth",
  },
  "Pistol Shrimp": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    name: "Pistol Shrimp",
  },
};
