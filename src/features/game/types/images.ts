// Consumables
import mashedPotato from "assets/food/mashed_potato.png";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import bumpkinBroth from "assets/food/bumpkin_broth.png";
import boiledEggs from "assets/food/boiled_eggs.png";
import goblinsTreat from "assets/food/goblins_treat.png";
import cauliflowerBurger from "assets/food/cauliflower_burger.png";
import pancakes from "assets/food/pancakes.png";
import roastVeggies from "assets/food/roast_veggies.png";
import clubSandwich from "assets/food/club_sandwich.png";
import bumpkinSalad from "assets/food/bumpkin_salad.png";
import blueberryJam from "assets/food/blueberry_jam.png";
import honeyCake from "assets/food/honey_cake.png";
import kaleStew from "assets/food/kale_stew.png";
import mushroomSoup from "assets/food/mushroom_soup.png";
import orangeCake from "assets/food/orange_cake.png";
import sunflowerCrunch from "assets/food/sunflower_crunch.png";
import applePie from "assets/food/apple_pie.png";
import mushroomJacketPotato from "assets/food/mushroom_jacket_potato.png";
import kaleMushroomPie from "assets/food/mushroom_kale_pie.png";
import reindeerCarrot from "assets/food/reindeer_carrot.png";
import fermentedCarrots from "assets/food/fermented_carrots.png";
import sauerkraut from "assets/food/sauerkraut.png";
import carrotCake from "src/assets/sfts/cakes/carrot_cake.png";
import radishCake from "src/assets/sfts/cakes/radish_cake.png";
import beetrootCake from "src/assets/sfts/cakes/beetroot_cake.png";
import cabbageCake from "src/assets/sfts/cakes/cabbage_cake.png";
import cauliflowerCake from "src/assets/sfts/cakes/cauliflower_cake.png";
import parsnipCake from "src/assets/sfts/cakes/parsnip_cake.png";
import potatoCake from "src/assets/sfts/cakes/potato_cake.png";
import pumpkinCake from "src/assets/sfts/cakes/pumpkin_cake.png";
import sunflowerCake from "src/assets/sfts/cakes/sunflower_cake.png";
import wheatCake from "src/assets/sfts/cakes/wheat_cake.png";
import appleJuice from "assets/food/apple_juice.png";
import orangeJuice from "assets/food/orange_juice.png";
import purpleSmoothie from "assets/food/purple_smoothie.png";
import bumpkinDetox from "assets/food/bumpkin_detox.png";
import powerSmoothie from "assets/food/power_smoothie.png";

import { ItemDetails } from "./game";

export interface ItemDetailsWithImages extends ItemDetails {
  image: string;
  secondaryImage?: string;
}

export const IMAGES: Record<number, ItemDetailsWithImages> = {
  // Consumables
  501: pumpkinSoup,
  503: sauerkraut,
  505: sunflowerCake,
  506: potatoCake,
  507: pumpkinCake,
  508: carrotCake,
  509: cabbageCake,
  510: beetrootCake,
  511: cauliflowerCake,
  512: parsnipCake,
  513: radishCake,
  514: wheatCake,
  515: boiledEggs,
  516: bumpkinBroth,
  517: bumpkinSalad,
  518: goblinsTreat,
  519: mashedPotato,
  520: cauliflowerBurger,
  521: clubSandwich,
  522: roastVeggies,
  523: pancakes,
  524: applePie,
  525: blueberryJam,
  526: fermentedCarrots,
  527: honeyCake,
  528: kaleMushroomPie,
  529: kaleStew,
  530: mushroomJacketPotato,
  531: mushroomSoup,
  532: orangeCake,
  533: sunflowerCrunch,
  534: reindeerCarrot,
  535: appleJuice,
  536: orangeJuice,
  537: purpleSmoothie,
  538: powerSmoothie,
  539: bumpkinDetox,
};
