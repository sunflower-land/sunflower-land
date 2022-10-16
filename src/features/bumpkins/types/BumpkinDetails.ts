import beigeBody from "assets/bumpkins/shop/body/beige_potion.png";
import beigeBodyLayer from "assets/bumpkins/layer/body/beige_farmer.png";
import lightBrownBody from "assets/bumpkins/shop/body/light_brown_potion.png";
import lightBrownBodyLayer from "assets/bumpkins/layer/body/light_brown_farmer.png";
import darkBrownBody from "assets/bumpkins/shop/body/dark_brown_potion.png";
import darkBrownBodyLayer from "assets/bumpkins/layer/body/dark_brown_farmer.png";
import goblinBody from "assets/bumpkins/shop/body/goblin_potion.png";
import goblinBodyLayer from "assets/bumpkins/layer/body/goblin.png";

import redFarmerShirt from "assets/bumpkins/shop/shirts/red_farmer_shirt.png";
import redFarmerShirtLayer from "assets/bumpkins/layer/shirts/red_farmer_shirt.png";
import blueFarmerShirt from "assets/bumpkins/shop/shirts/blue_farmer_shirt.png";
import blueFarmerShirtLayer from "assets/bumpkins/layer/shirts/blue_farmer_shirt.png";
import yellowFarmerShirt from "assets/bumpkins/shop/shirts/yellow_farmer_shirt.png";
import yellowFarmerShirtLayer from "assets/bumpkins/layer/shirts/yellow_farmer_shirt.png";
import chefApron from "assets/bumpkins/shop/shirts/chef_apron.png";
import chefApronLayer from "assets/bumpkins/layer/shirts/chef_apron.png";
import warriorTop from "assets/bumpkins/shop/shirts/warrior_top.png";
import warriorTopLayer from "assets/bumpkins/layer/shirts/warrior_top.png";

import farmerPants from "assets/bumpkins/shop/pants/farmer_pants.png";
import farmerPantsLayer from "assets/bumpkins/layer/pants/farmer_pants.png";
import blueOveralls from "assets/bumpkins/shop/pants/blue_overalls.png";
import blueOverallsLayer from "assets/bumpkins/layer/pants/farmer_overalls.png";
import lumberjackOveralls from "assets/bumpkins/shop/pants/lumberjack_overalls.png";
import lumberjackOverallsLayer from "assets/bumpkins/layer/pants/lumberjack_overalls.png";
import warriorPantsLayer from "assets/bumpkins/layer/pants/warrior_pants.png";
import warriorPants from "assets/bumpkins/shop/pants/warrior_pants.png";

import rancherHair from "assets/bumpkins/shop/hair/rancher.png";
import rancherHairLayer from "assets/bumpkins/layer/hair/rancher.png";
import explorerHair from "assets/bumpkins/shop/hair/explorer.png";
import explorerHairLayer from "assets/bumpkins/layer/hair/explorer.png";
import basicHair from "assets/bumpkins/shop/hair/basic.png";
import basicHairLayer from "assets/bumpkins/layer/hair/basic.png";

import farmerBoots from "assets/bumpkins/shop/shoes/black_farmer_boots.png";
import farmerBootsLayer from "assets/bumpkins/layer/shoes/black_farmer_boots.png";

import farmerHat from "assets/bumpkins/shop/hats/farm_hat.png";
import farmerHatLayer from "assets/bumpkins/layer/hats/farm_hat.png";
import warriorHelmet from "assets/bumpkins/shop/hats/warrior_helmet.png";
import warriorHelmetLayer from "assets/bumpkins/layer/hats/warrior_helmet.png";
import chefHat from "assets/bumpkins/shop/hats/chef_hat.png";
import chefHatLayer from "assets/bumpkins/layer/hats/chef_hat.png";

import pitchFork from "assets/bumpkins/shop/tools/farmer_pitchfork.png";
import pitchForkLayer from "assets/bumpkins/layer/tools/farmer_pitchfork.png";

import background from "assets/bumpkins/shop/background/farm_background.png";
import backgroundLayer from "assets/bumpkins/layer/background/farm_background.png";

import sunflowerAmulet from "assets/bumpkins/shop/necklaces/sunflower_amulet.png";
import sunflowerAmuletLayer from "assets/bumpkins/layer/necklaces/sunflower_amulet.png";
import carrotAmulet from "assets/bumpkins/shop/necklaces/carrot_amulet.png";
import carrotAmuletLayer from "assets/bumpkins/layer/necklaces/carrot_amulet.png";
import beetrootAmulet from "assets/bumpkins/shop/necklaces/beetroot_amulet.png";
import beetrootAmuletLayer from "assets/bumpkins/layer/necklaces/beetroot_amulet.png";
import greenAmulet from "assets/bumpkins/shop/necklaces/green_amulet.png";
import greenAmuletLayer from "assets/bumpkins/layer/necklaces/green_amulet.png";

import { BumpkinItems, BumpkinPart } from "features/game/types/bumpkin";

type ItemDetails = {
  description: string;
  shopImage: string;
  layerImage: string;
  part: BumpkinPart;
  boosts?: string[];
};

export const BUMPKIN_ITEMS: Record<BumpkinItems, ItemDetails> = {
  "Beige Farmer Potion": {
    description:
      "An ancient potion of beige goodness. Consuming this potion transforms your Bumpkin's colour.",
    layerImage: beigeBodyLayer,
    shopImage: beigeBody,
    part: "body",
  },
  "Light Brown Farmer Potion": {
    description:
      "A mixture of sunflower and gold. Consuming this potion transforms your Bumpkin's colour.",
    layerImage: lightBrownBodyLayer,
    shopImage: lightBrownBody,
    part: "body",
  },
  "Dark Brown Farmer Potion": {
    description:
      "A traditional recipe passed down from Bumpkin Ancestors. Consuming this potion transforms your Bumpkin's colour.",
    layerImage: darkBrownBodyLayer,
    shopImage: darkBrownBody,
    part: "body",
  },
  "Goblin Potion": {
    description:
      "A recipe crafted during the Great Goblin War. Consuming this potion turns your Bumpkin into a Goblin",
    layerImage: goblinBodyLayer,
    shopImage: goblinBody,
    part: "body",
  },
  "Basic Hair": {
    description:
      "Nothing says Bumpkin like this Basic Hair. This mop of hair is a signal of a true Bumpkin.",
    layerImage: basicHairLayer,
    shopImage: basicHair,
    part: "hair",
  },
  "Rancher Hair": {
    description:
      "Bright and orange! You can spot this hair piece a mile away in the fields.",
    layerImage: rancherHairLayer,
    shopImage: rancherHair,
    part: "hair",
  },
  "Explorer Hair": {
    description:
      "This cut never goes out of style. Plenty of room to store extra seeds while farming.",
    layerImage: explorerHairLayer,
    shopImage: explorerHair,
    part: "hair",
  },
  "Red Farmer Shirt": {
    description:
      "The Basic Bumpkin must-have. Nothing blends in the crowd quite like this red farmer shirt.",
    layerImage: redFarmerShirtLayer,
    shopImage: redFarmerShirt,
    part: "shirt",
  },
  "Yellow Farmer Shirt": {
    description:
      "The colour of happiness, warmth and sunflowers! A beloved shirt amongst all farmers.",
    layerImage: yellowFarmerShirtLayer,
    shopImage: yellowFarmerShirt,
    part: "shirt",
  },
  "Blue Farmer Shirt": {
    description:
      "Getting down to business? This is a mark of a trained and focussed farmer.",
    layerImage: blueFarmerShirtLayer,
    shopImage: blueFarmerShirt,
    part: "shirt",
  },
  "Chef Apron": {
    description:
      "If you are baking cakes don't forget your Apron! The mark of a true baker.",
    layerImage: chefApronLayer,
    shopImage: chefApron,
    part: "shirt",
    boosts: ["Bonus 20% SFL when selling cakes"],
  },
  "Warrior Shirt": {
    description:
      "The mark of a warrior who survived the Goblin War. This shirt commands respect amongst the Sunflower community.",
    layerImage: warriorTopLayer,
    shopImage: warriorTop,
    part: "shirt",
  },

  "Farmer Overalls": {
    description: "Plenty of pockets to store your tools!",
    layerImage: blueOverallsLayer,
    shopImage: blueOveralls,
    part: "pants",
  },
  "Lumberjack Overalls": {
    description:
      "Chopping wood and crafting tools, what more could you want in life?",
    layerImage: lumberjackOverallsLayer,
    shopImage: lumberjackOveralls,
    part: "pants",
  },
  "Farmer Pants": {
    description: "Basic pants that get the job down at Sunflower Land",
    layerImage: farmerPantsLayer,
    shopImage: farmerPants,
    part: "pants",
  },
  "Warrior Pants": {
    description:
      "The mark of a warrior who survived the Goblin War. Gotta protect your thighs out on the battlefield!",
    layerImage: warriorPantsLayer,
    shopImage: warriorPants,
    part: "pants",
  },
  "Black Farmer Boots": {
    description:
      "These boots were made for walking...and exploring Sunflower Land.",
    layerImage: farmerBootsLayer,
    shopImage: farmerBoots,
    part: "shoes",
  },
  "Farmer Pitchfork": {
    description:
      "A trusty pitchfork. Don't be caught dead without one when the crops are ready",
    layerImage: pitchForkLayer,
    shopImage: pitchFork,
    part: "tool",
  },
  "Farmer Hat": {
    description:
      "The sun is harsh in Sunflower Land. Don't forget to protect your Bumpkin",
    layerImage: farmerHatLayer,
    shopImage: farmerHat,
    part: "hat",
  },
  "Chef Hat": {
    description:
      "A champion in the great bake off. Goblins get hungry when they see a Bumpkin wearing a chef hat!",
    layerImage: chefHatLayer,
    shopImage: chefHat,
    part: "hat",
  },
  "Warrior Helmet": {
    description:
      "Through blood and sweat, the wearer of this helmet was victorious in the Goblin war.",
    layerImage: warriorHelmetLayer,
    shopImage: warriorHelmet,
    part: "hat",
  },
  "Sunflower Amulet": {
    description:
      "The crop that fuels the Sunflower MetaVerse. Now in necklace form!",
    layerImage: sunflowerAmuletLayer,
    shopImage: sunflowerAmulet,
    part: "necklace",
  },
  "Carrot Amulet": {
    description:
      "Carrots for breakfast, lunch and dinner. Rumour says that wearing this necklace improves your Bumpkin's eyesight!",
    layerImage: carrotAmuletLayer,
    shopImage: carrotAmulet,
    part: "necklace",
  },
  "Beetroot Amulet": {
    description: "Grandma always said to carry a beetroot whereever you go.",
    layerImage: beetrootAmuletLayer,
    shopImage: beetrootAmulet,
    part: "necklace",
  },
  "Green Amulet": {
    description: "King of the crops. Nothing can stop your farming empire now!",
    layerImage: greenAmuletLayer,
    shopImage: greenAmulet,
    part: "necklace",
  },

  "Farm Background": {
    description:
      "There is no better place for a Bumpkin to be...out in the fields!",
    layerImage: backgroundLayer,
    shopImage: background,
    part: "background",
  },
};
