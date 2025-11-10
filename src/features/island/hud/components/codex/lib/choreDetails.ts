import { SUNNYSIDE } from "assets/sunnyside";
import { ChoreName } from "features/game/types/choreBoard";
import { ITEM_DETAILS } from "features/game/types/images";
import { translate } from "lib/i18n/translate";

export const CHORE_DETAILS: Record<
  ChoreName,
  { icon: string; description: string }
> = {
  CHOP_1_TREE: {
    description: translate("chore.chop.1.tree"),
    icon: ITEM_DETAILS.Wood.image,
  },
  CHOP_2_TREE: {
    description: translate("chore.chop.2.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Harvest Sunflowers 150 times": {
    icon: ITEM_DETAILS.Sunflower.image,
    description: translate("chore.harvest.sunflower.150"),
  },
  "Harvest Sunflowers 200 times": {
    icon: ITEM_DETAILS.Sunflower.image,
    description: translate("chore.harvest.sunflower.200"),
  },
  "Harvest Sunflowers 250 times": {
    icon: ITEM_DETAILS.Sunflower.image,
    description: translate("chore.harvest.sunflower.250"),
  },
  "Harvest Potatoes 100 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.100"),
  },
  "Harvest Potatoes 125 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.125"),
  },
  "Harvest Potatoes 130 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.130"),
  },
  "Harvest Potatoes 150 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.150"),
  },
  "Harvest Potatoes 200 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.200"),
  },
  "Harvest Potatoes 250 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.250"),
  },
  "Harvest Rhubarbs 100 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.100"),
  },
  "Harvest Rhubarbs 125 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.125"),
  },
  "Harvest Rhubarbs 150 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.150"),
  },
  "Harvest Pumpkins 100 times": {
    icon: ITEM_DETAILS.Pumpkin.image,
    description: translate("chore.harvest.pumpkin.100"),
  },
  "Harvest Pumpkins 130 times": {
    icon: ITEM_DETAILS.Pumpkin.image,
    description: translate("chore.harvest.pumpkin.130"),
  },
  "Harvest Pumpkins 150 times": {
    icon: ITEM_DETAILS.Pumpkin.image,
    description: translate("chore.harvest.pumpkin.150"),
  },
  "Harvest Pumpkins 200 times": {
    icon: ITEM_DETAILS.Pumpkin.image,
    description: translate("chore.harvest.pumpkin.200"),
  },
  "Harvest Pumpkins 250 times": {
    icon: ITEM_DETAILS.Pumpkin.image,
    description: translate("chore.harvest.pumpkin.250"),
  },
  "Harvest Zucchini 50 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.50"),
  },
  "Harvest Zucchini 75 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.75"),
  },
  "Harvest Zucchini 100 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.100"),
  },
  "Harvest Carrots 50 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.50"),
  },
  "Harvest Carrots 60 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.60"),
  },
  "Harvest Carrots 75 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.75"),
  },
  "Harvest Carrots 100 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.100"),
  },
  "Harvest Carrots 120 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.120"),
  },
  "Harvest Yam 30 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.30"),
  },
  "Harvest Yam 60 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.60"),
  },
  "Harvest Yam 90 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.90"),
  },
  "Harvest Yam 125 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.125"),
  },
  "Harvest Yam 150 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.150"),
  },
  "Harvest Yam 175 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.175"),
  },
  "Harvest Cabbage 25 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.25"),
  },
  "Harvest Cabbage 30 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.30"),
  },
  "Harvest Cabbage 40 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.40"),
  },
  "Harvest Cabbage 50 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.50"),
  },
  "Harvest Cabbage 60 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.60"),
  },
  "Harvest Cabbage 75 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.75"),
  },
  "Harvest Cabbage 80 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.80"),
  },
  "Harvest Cabbage 90 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.90"),
  },
  "Harvest Cabbage 100 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.100"),
  },
  "Harvest Cabbage 125 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.125"),
  },
  "Harvest Cabbage 150 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.150"),
  },
  "Harvest Cabbage 175 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.175"),
  },
  "Harvest Broccoli 40 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.40"),
  },
  "Harvest Broccoli 80 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.80"),
  },
  "Harvest Broccoli 100 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.100"),
  },
  "Harvest Soybeans 30 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.30"),
  },
  "Harvest Soybeans 60 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.60"),
  },
  "Harvest Soybeans 90 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.90"),
  },
  "Harvest Beetroot 30 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.30"),
  },
  "Harvest Beetroot 50 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.50"),
  },
  "Harvest Beetroot 60 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.60"),
  },
  "Harvest Beetroot 75 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.75"),
  },
  "Harvest Beetroot 90 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.90"),
  },
  "Harvest Beetroot 100 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.100"),
  },
  "Harvest Beetroot 120 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.120"),
  },
  "Harvest Pepper 25 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.25"),
  },
  "Harvest Pepper 40 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.40"),
  },
  "Harvest Pepper 50 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.50"),
  },
  "Harvest Pepper 75 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.75"),
  },
  "Harvest Pepper 80 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.80"),
  },
  "Harvest Pepper 100 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.100"),
  },
  "Harvest Cauliflower 30 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.30"),
  },
  "Harvest Cauliflower 60 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.60"),
  },
  "Harvest Cauliflower 90 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.90"),
  },
  "Harvest Cauliflower 400 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.400"),
  },
  "Harvest Cauliflower 450 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.450"),
  },
  "Harvest Cauliflower 500 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.500"),
  },
  "Harvest Eggplant 300 times": {
    icon: ITEM_DETAILS.Eggplant.image,
    description: translate("chore.harvest.eggplant.300"),
  },
  "Harvest Eggplant 360 times": {
    icon: ITEM_DETAILS.Eggplant.image,
    description: translate("chore.harvest.eggplant.360"),
  },
  "Harvest Eggplant 420 times": {
    icon: ITEM_DETAILS.Eggplant.image,
    description: translate("chore.harvest.eggplant.420"),
  },
  "Harvest Corn 300 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.300"),
  },
  "Harvest Corn 360 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.360"),
  },
  "Harvest Corn 420 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.420"),
  },
  "Harvest Onions 300 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.300"),
  },
  "Harvest Onions 360 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.360"),
  },
  "Harvest Onions 420 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.420"),
  },
  "Harvest Wheat 240 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.240"),
  },
  "Harvest Wheat 250 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.250"),
  },
  "Harvest Wheat 300 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.300"),
  },
  "Harvest Wheat 360 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.360"),
  },
  "Harvest Radish 240 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.240"),
  },
  "Harvest Radish 280 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.280"),
  },
  "Harvest Radish 340 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.340"),
  },
  "Harvest Turnip 250 times": {
    icon: ITEM_DETAILS.Turnip.image,
    description: translate("chore.harvest.turnip.250"),
  },
  "Harvest Turnip 300 times": {
    icon: ITEM_DETAILS.Turnip.image,
    description: translate("chore.harvest.turnip.300"),
  },
  "Harvest Turnip 360 times": {
    icon: ITEM_DETAILS.Turnip.image,
    description: translate("chore.harvest.turnip.360"),
  },
  "Harvest Kale 120 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.120"),
  },
  "Harvest Kale 180 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.180"),
  },
  "Harvest Kale 200 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.200"),
  },
  "Harvest Kale 240 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.240"),
  },
  "Harvest Artichoke 150 times": {
    icon: ITEM_DETAILS.Artichoke.image,
    description: translate("chore.harvest.artichoke.150"),
  },
  "Harvest Artichoke 200 times": {
    icon: ITEM_DETAILS.Artichoke.image,
    description: translate("chore.harvest.artichoke.200"),
  },
  "Harvest Artichoke 260 times": {
    icon: ITEM_DETAILS.Artichoke.image,
    description: translate("chore.harvest.artichoke.260"),
  },
  "Harvest Barley 100 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.100"),
  },
  "Harvest Barley 120 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.120"),
  },
  "Harvest Barley 150 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.150"),
  },
  "Harvest Barley 180 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.180"),
  },
  "Harvest Barley 200 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.200"),
  },
  "Harvest Rice 16 times": {
    icon: ITEM_DETAILS.Rice.image,
    description: translate("chore.harvest.rice.16"),
  },
  "Harvest Rice 20 times": {
    icon: ITEM_DETAILS.Rice.image,
    description: translate("chore.harvest.rice.20"),
  },
  "Harvest Rice 24 times": {
    icon: ITEM_DETAILS.Rice.image,
    description: translate("chore.harvest.rice.24"),
  },
  "Harvest Olives 12 times": {
    icon: ITEM_DETAILS.Olive.image,
    description: translate("chore.harvest.olive.12"),
  },
  "Harvest Olives 16 times": {
    icon: ITEM_DETAILS.Olive.image,
    description: translate("chore.harvest.olive.16"),
  },
  "Harvest Olives 20 times": {
    icon: ITEM_DETAILS.Olive.image,
    description: translate("chore.harvest.olive.20"),
  },
  "Eat 3 Boiled Eggs": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.eat.boiledEgg.3"),
  },
  "Eat 5 Boiled Eggs": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.eat.boiledEgg.5"),
  },
  "Eat 7 Boiled Eggs": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.eat.boiledEgg.7"),
  },
  "Eat 10 Boiled Eggs": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.eat.boiledEgg.10"),
  },
  "Eat 15 Boiled Eggs": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.eat.boiledEgg.15"),
  },
  "Eat 10 Reindeer Carrot": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.eat.reindeerCarrot.10"),
  },
  "Eat 15 Reindeer Carrot": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.eat.reindeerCarrot.15"),
  },
  "Eat 20 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.20"),
  },
  "Eat 40 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.40"),
  },
  "Eat 60 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.60"),
  },
  "Eat 10 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.10"),
  },
  "Eat 20 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.20"),
  },
  "Eat 30 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.30"),
  },
  "Eat 5 Cauliflower Burgers": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.eat.cauliflowerBurger.5"),
  },
  "Eat 5 Club Sandwiches": {
    icon: ITEM_DETAILS["Club Sandwich"].image,
    description: translate("chore.eat.clubSandwich.5"),
  },
  "Eat 5 Pancakes": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.eat.pancake.5"),
  },
  "Eat 20 Chowder": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.eat.chowder.20"),
  },
  "Eat 25 Chowder": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.eat.chowder.25"),
  },
  "Eat 30 Chowder": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.eat.chowder.30"),
  },
  "Eat 5 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.5"),
  },
  "Eat 7 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.7"),
  },
  "Eat 10 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.10"),
  },
  "Eat 15 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.15"),
  },
  "Eat 10 Mashed Potatoes": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.eat.mashedPotato.10"),
  },
  "Eat 15 Mashed Potatoes": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.eat.mashedPotato.15"),
  },
  "Eat 20 Mashed Potatoes": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.eat.mashedPotato.20"),
  },
  "Eat 30 Mashed Potatoes": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.eat.mashedPotato.30"),
  },
  "Eat 20 Pumpkin Soup": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.eat.pumpkinSoup.20"),
  },
  "Eat 30 Pumpkin Soup": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.eat.pumpkinSoup.30"),
  },
  "Eat 5 Bumpkin Salad": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.eat.bumpkinSalad.5"),
  },
  "Drink 15 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.15"),
  },
  "Drink 15 Purple Smoothies": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.drink.purpleSmoothie.15"),
  },
  "Drink 10 Apple Juice": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.drink.appleJuice.10"),
  },
  "Drink 5 Power Smoothies": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.drink.powerSmoothie.5"),
  },
  "Drink 25 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.25"),
  },
  "Drink 35 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.35"),
  },
  "Drink 40 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.40"),
  },
  "Drink 50 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.50"),
  },
  "Drink 15 Sour Shakes": {
    icon: ITEM_DETAILS["Sour Shake"].image,
    description: translate("chore.drink.sourShake.15"),
  },
  "Drink 15 Banana Blast": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.drink.bananaBlast.15"),
  },
  "Drink 5 Grape Juice": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: translate("chore.drink.grapeJuice.5"),
  },
  "Drink 10 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.10"),
  },
  "Drink 15 Carrot Juice": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.drink.carrotJuice.15"),
  },
  "Cook Boiled Eggs 3 times": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.cook.boiledEgg.3"),
  },
  "Cook Boiled Eggs 5 times": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.cook.boiledEgg.5"),
  },
  "Cook Reindeer Carrot 8 times": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.cook.reindeerCarrot.8"),
  },
  "Cook Reindeer Carrot 12 times": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.cook.reindeerCarrot.12"),
  },
  "Cook Mashed Potatoes 15 times": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.cook.mashedPotato.15"),
  },
  "Cook Mashed Potatoes 18 times": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.cook.mashedPotato.18"),
  },
  "Cook Mashed Potatoes 20 times": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.cook.mashedPotato.20"),
  },
  "Cook Roast Veggies 5 times": {
    icon: ITEM_DETAILS["Roast Veggies"].image,
    description: translate("chore.cook.roastVeggies.5"),
  },
  "Cook Roast Veggies 6 times": {
    icon: ITEM_DETAILS["Roast Veggies"].image,
    description: translate("chore.cook.roastVeggies.6"),
  },
  "Cook Roast Veggies 7 times": {
    icon: ITEM_DETAILS["Roast Veggies"].image,
    description: translate("chore.cook.roastVeggies.7"),
  },
  "Cook Club Sandwich 5 times": {
    icon: ITEM_DETAILS["Club Sandwich"].image,
    description: translate("chore.cook.clubSandwich.5"),
  },
  "Cook Club Sandwich 6 times": {
    icon: ITEM_DETAILS["Club Sandwich"].image,
    description: translate("chore.cook.clubSandwich.6"),
  },
  "Cook Club Sandwich 7 times": {
    icon: ITEM_DETAILS["Club Sandwich"].image,
    description: translate("chore.cook.clubSandwich.7"),
  },
  "Cook Pancakes 3 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.3"),
  },
  "Cook Pancakes 4 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.4"),
  },
  "Cook Pancakes 5 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.5"),
  },
  "Cook Pancakes 6 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.6"),
  },
  "Cook Fried Calamari 1 time": {
    icon: ITEM_DETAILS["Fried Calamari"].image,
    description: translate("chore.cook.friedCalamari.1"),
  },
  "Cook Fried Calamari 2 times": {
    icon: ITEM_DETAILS["Fried Calamari"].image,
    description: translate("chore.cook.friedCalamari.2"),
  },
  "Cook Fried Calamari 3 times": {
    icon: ITEM_DETAILS["Fried Calamari"].image,
    description: translate("chore.cook.friedCalamari.3"),
  },
  "Cook Fried Calamari 4 times": {
    icon: ITEM_DETAILS["Fried Calamari"].image,
    description: translate("chore.cook.friedCalamari.4"),
  },
  "Cook Cauliflower Burger 5 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.5"),
  },
  "Cook Cauliflower Burger 7 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.7"),
  },
  "Cook Cauliflower Burger 10 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.10"),
  },
  "Cook Bumpkin Salad 5 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.5"),
  },
  "Cook Bumpkin Salad 7 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.7"),
  },
  "Cook Bumpkin Salad 10 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.10"),
  },
  "Cook Bumpkin ganoush 3 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.3"),
  },
  "Cook Bumpkin ganoush 5 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.5"),
  },
  "Cook Bumpkin ganoush 7 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.7"),
  },
  "Cook Goblin's Treat 3 times": {
    icon: ITEM_DETAILS["Goblin's Treat"].image,
    description: translate("chore.cook.goblinTreat.3"),
  },
  "Cook Goblin's Treat 5 times": {
    icon: ITEM_DETAILS["Goblin's Treat"].image,
    description: translate("chore.cook.goblinTreat.5"),
  },
  "Cook Goblin's Treat 7 times": {
    icon: ITEM_DETAILS["Goblin's Treat"].image,
    description: translate("chore.cook.goblinTreat.7"),
  },
  "Cook Gumbo 20 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.20"),
  },
  "Cook Gumbo 25 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.25"),
  },
  "Cook Gumbo 30 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.30"),
  },
  "Cook Sunflower Cake 7 times": {
    icon: ITEM_DETAILS["Sunflower Cake"].image,
    description: translate("chore.cook.sunflowerCake.7"),
  },
  "Cook Carrot Cake 5 times": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.5"),
  },
  "Cook Cabbage Cake 5 times": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.5"),
  },
  "Cook Wheat Cake 5 times": {
    icon: ITEM_DETAILS["Wheat Cake"].image,
    description: translate("chore.cook.wheatCake.5"),
  },
  "Cook Honey Cake 10 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.10"),
  },
  "Cook Honey Cake 15 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.15"),
  },
  "Cook Honey Cake 20 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.20"),
  },
  "Cook Cornbread 10 times": {
    icon: ITEM_DETAILS["Cornbread"].image,
    description: translate("chore.cook.cornbread.10"),
  },
  "Cook Lemon Cheesecakes 3 times": {
    icon: ITEM_DETAILS["Lemon Cheesecake"].image,
    description: translate("chore.cook.lemonCheesecake.3"),
  },
  "Cook Lemon Cheesecakes 5 times": {
    icon: ITEM_DETAILS["Lemon Cheesecake"].image,
    description: translate("chore.cook.lemonCheesecake.5"),
  },
  "Cook Fermented Fish 10 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.10"),
  },
  "Cook Fermented Fish 12 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.12"),
  },
  "Cook Fermented Fish 15 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.15"),
  },
  "Cook Chowder 15 times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.15"),
  },
  "Cook Chowder 18 times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.18"),
  },
  "Cook Chowder 21 times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.21"),
  },
  "Cook Antipasto 25 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.25"),
  },
  "Cook Antipasto 30 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.30"),
  },
  "Cook Antipasto 35 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.35"),
  },
  "Cook Fruit Salad 50 times": {
    icon: ITEM_DETAILS["Fruit Salad"].image,
    description: translate("chore.cook.fruitSalad.50"),
  },
  "Cook Fruit Salad 75 times": {
    icon: ITEM_DETAILS["Fruit Salad"].image,
    description: translate("chore.cook.fruitSalad.75"),
  },
  "Cook Fruit Salad 100 times": {
    icon: ITEM_DETAILS["Fruit Salad"].image,
    description: translate("chore.cook.fruitSalad.100"),
  },
  "Cook Steamed Red Rice 20 times": {
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
    description: translate("chore.cook.steamedRedRice.20"),
  },
  "Cook Steamed Red Rice 25 times": {
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
    description: translate("chore.cook.steamedRedRice.25"),
  },
  "Cook Steamed Red Rice 30 times": {
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
    description: translate("chore.cook.steamedRedRice.30"),
  },
  "Cook Rice Bun 20 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.20"),
  },
  "Cook Rice Bun 25 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.25"),
  },
  "Cook Rice Bun 30 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.30"),
  },
  "Cook Shroom Syrup 2 times": {
    icon: ITEM_DETAILS["Shroom Syrup"].image,
    description: translate("chore.cook.shroomSyrup.2"),
  },
  "Cook Cheese 50 times": {
    icon: ITEM_DETAILS["Cheese"].image,
    description: translate("chore.cook.cheese.50"),
  },
  "Cook Honey Cheddar 5 times": {
    icon: ITEM_DETAILS["Honey Cheddar"].image,
    description: translate("chore.cook.honeyCheddar.5"),
  },
  "Cook Honey Cheddar 7 times": {
    icon: ITEM_DETAILS["Honey Cheddar"].image,
    description: translate("chore.cook.honeyCheddar.7"),
  },
  "Cook Honey Cheddar 10 times": {
    icon: ITEM_DETAILS["Honey Cheddar"].image,
    description: translate("chore.cook.honeyCheddar.10"),
  },
  "Cook Blue Cheese 20 times": {
    icon: ITEM_DETAILS["Blue Cheese"].image,
    description: translate("chore.cook.blueCheese.20"),
  },
  "Cook Blue Cheese 25 times": {
    icon: ITEM_DETAILS["Blue Cheese"].image,
    description: translate("chore.cook.blueCheese.25"),
  },
  "Cook Blue Cheese 30 times": {
    icon: ITEM_DETAILS["Blue Cheese"].image,
    description: translate("chore.cook.blueCheese.30"),
  },
  "Cook Goblin Brunch 1 time": {
    icon: ITEM_DETAILS["Goblin Brunch"].image,
    description: translate("chore.cook.goblinBrunch.1"),
  },
  "Cook Goblin Brunch 2 times": {
    icon: ITEM_DETAILS["Goblin Brunch"].image,
    description: translate("chore.cook.goblinBrunch.2"),
  },
  "Cook Goblin Brunch 3 times": {
    icon: ITEM_DETAILS["Goblin Brunch"].image,
    description: translate("chore.cook.goblinBrunch.3"),
  },
  "Cook Sushi Roll 3 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.3"),
  },
  "Cook Sushi Roll 4 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.4"),
  },
  "Cook Sushi Roll 5 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.5"),
  },
  "Cook Caprese Salad 4 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.4"),
  },
  "Cook Caprese Salad 5 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.5"),
  },
  "Cook Caprese Salad 6 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.6"),
  },
  "Cook Caprese Salad 7 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.7"),
  },
  "Cook Caprese Salad 8 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.8"),
  },
  "Cook Caprese Salad 10 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.10"),
  },
  "Cook Ocean's Olive 3 times": {
    icon: ITEM_DETAILS["Ocean's Olive"].image,
    description: translate("chore.cook.oceanOlive.3"),
  },
  "Cook Ocean's Olive 5 times": {
    icon: ITEM_DETAILS["Ocean's Olive"].image,
    description: translate("chore.cook.oceanOlive.5"),
  },
  "Cook Ocean's Olive 7 times": {
    icon: ITEM_DETAILS["Ocean's Olive"].image,
    description: translate("chore.cook.oceanOlive.7"),
  },
  "Cook Eggplant Cake 5 times": {
    icon: ITEM_DETAILS["Eggplant Cake"].image,
    description: translate("chore.cook.eggplantCake.5"),
  },
  "Cook Radish Cake 5 times": {
    icon: ITEM_DETAILS["Radish Cake"].image,
    description: translate("chore.cook.radishCake.5"),
  },
  "Cook Beetroot Cake 5 times": {
    icon: ITEM_DETAILS["Beetroot Cake"].image,
    description: translate("chore.cook.beetrootCake.5"),
  },
  "Cook Pumpkin Soup 5 times": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.cook.pumpkinSoup.5"),
  },
  "Cook Pumpkin Soup 7 times": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.cook.pumpkinSoup.7"),
  },
  "Cook Pumpkin Soup 10 times": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.cook.pumpkinSoup.10"),
  },
  "Cook Bumpkin Roast 5 times": {
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
    description: translate("chore.cook.bumpkinRoast.5"),
  },
  "Cook Bumpkin Roast 7 times": {
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
    description: translate("chore.cook.bumpkinRoast.7"),
  },
  "Cook Bumpkin Roast 10 times": {
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
    description: translate("chore.cook.bumpkinRoast.10"),
  },
  "Cook Pizza Margherita 5 times": {
    icon: ITEM_DETAILS["Pizza Margherita"].image,
    description: translate("chore.cook.pizzaMargherita.5"),
  },
  "Cook Pizza Margherita 7 times": {
    icon: ITEM_DETAILS["Pizza Margherita"].image,
    description: translate("chore.cook.pizzaMargherita.7"),
  },
  "Cook Pizza Margherita 10 times": {
    icon: ITEM_DETAILS["Pizza Margherita"].image,
    description: translate("chore.cook.pizzaMargherita.10"),
  },
  "Cook Apple Pie 15 times": {
    icon: ITEM_DETAILS["Apple Pie"].image,
    description: translate("chore.cook.applePie.15"),
  },
  "Cook Potato Cake 7 times": {
    icon: ITEM_DETAILS["Potato Cake"].image,
    description: translate("chore.cook.potatoCake.7"),
  },
  "Cook Carrot Cake 7 times": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.7"),
  },
  "Cook Wheat Cake 7 times": {
    icon: ITEM_DETAILS["Wheat Cake"].image,
    description: translate("chore.cook.wheatCake.7"),
  },
  "Cook Spaghetti al Limone 4 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.4"),
  },
  "Cook Spaghetti al Limone 6 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.6"),
  },
  "Cook Spaghetti al Limone 8 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.8"),
  },
  "Cook Beetroot Cake 7 times": {
    icon: ITEM_DETAILS["Beetroot Cake"].image,
    description: translate("chore.cook.beetrootCake.7"),
  },
  "Cook Cabbage Cake 7 times": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.7"),
  },
  "Cook Parsnip Cake 7 times": {
    icon: ITEM_DETAILS["Parsnip Cake"].image,
    description: translate("chore.cook.parsnicCake.7"),
  },
  "Cook Cauliflower Cake 7 times": {
    icon: ITEM_DETAILS["Cauliflower Cake"].image,
    description: translate("chore.cook.cauliflowerCake.7"),
  },
  "Prepare Power Smoothie 20 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.20"),
  },
  "Prepare Power Smoothie 35 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.35"),
  },
  "Prepare Power Smoothie 50 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.50"),
  },
  "Prepare Slow Juice 5 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.5"),
  },
  "Prepare Slow Juice 6 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.6"),
  },
  "Prepare Slow Juice 7 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.7"),
  },
  "Prepare Banana Blast 20 times": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.prepare.bananaBlast.20"),
  },
  "Prepare Banana Blast 35 times": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.prepare.bananaBlast.35"),
  },
  "Prepare Banana Blast 50 times": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.prepare.bananaBlast.50"),
  },
  "Prepare Grape Juice 10 times": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: translate("chore.prepare.grapeJuice.10"),
  },
  "Prepare Grape Juice 12 times": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: translate("chore.prepare.grapeJuice.12"),
  },
  "Prepare Grape Juice 15 times": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: translate("chore.prepare.grapeJuice.15"),
  },
  "Prepare Apple Juice 5 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.5"),
  },
  "Prepare Apple Juice 6 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.6"),
  },
  "Prepare Apple Juice 7 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.7"),
  },
  "Prepare Apple Juice 15 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.15"),
  },
  "Prepare Apple Juice 20 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.20"),
  },
  "Prepare Apple Juice 25 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.25"),
  },
  "Prepare Carrot Juice 2 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.prepare.carrotJuice.2"),
  },
  "Prepare Carrot Juice 3 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.prepare.carrotJuice.3"),
  },
  "Prepare Carrot Juice 4 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.prepare.carrotJuice.4"),
  },
  "Prepare Purple Smoothie 5 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.5"),
  },
  "Prepare Purple Smoothie 6 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.6"),
  },
  "Prepare Purple Smoothie 7 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.7"),
  },
  "Prepare Power Smoothie 2 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.2"),
  },
  "Prepare Power Smoothie 3 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.3"),
  },
  "Prepare Power Smoothie 4 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.4"),
  },
  "Grow Red Pansy 2 times": {
    icon: ITEM_DETAILS["Red Pansy"].image,
    description: translate("chore.grow.redPansy.2"),
  },
  "Grow Red Pansy 3 times": {
    icon: ITEM_DETAILS["Red Pansy"].image,
    description: translate("chore.grow.redPansy.3"),
  },
  "Grow Yellow Pansy 2 times": {
    icon: ITEM_DETAILS["Yellow Pansy"].image,
    description: translate("chore.grow.yellowPansy.2"),
  },
  "Grow Yellow Pansy 3 times": {
    icon: ITEM_DETAILS["Yellow Pansy"].image,
    description: translate("chore.grow.yellowPansy.3"),
  },
  "Grow Purple Cosmos 2 times": {
    icon: ITEM_DETAILS["Purple Cosmos"].image,
    description: translate("chore.grow.purpleCosmos.2"),
  },
  "Grow Purple Cosmos 3 times": {
    icon: ITEM_DETAILS["Purple Cosmos"].image,
    description: translate("chore.grow.purpleCosmos.3"),
  },
  "Grow Blue Cosmos 2 times": {
    icon: ITEM_DETAILS["Blue Cosmos"].image,
    description: translate("chore.grow.blueCosmos.2"),
  },
  "Grow Blue Cosmos 3 times": {
    icon: ITEM_DETAILS["Blue Cosmos"].image,
    description: translate("chore.grow.blueCosmos.3"),
  },
  "Grow Red Balloon Flower 3 times": {
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
    description: translate("chore.grow.redBalloonFlower.3"),
  },
  "Grow Red Balloon Flower 4 times": {
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
    description: translate("chore.grow.redBalloonFlower.4"),
  },
  "Grow Red Balloon Flower 5 times": {
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
    description: translate("chore.grow.redBalloonFlower.5"),
  },
  "Grow Blue Balloon Flower 3 times": {
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
    description: translate("chore.grow.blueBalloonFlower.3"),
  },
  "Grow Blue Balloon Flower 4 times": {
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
    description: translate("chore.grow.blueBalloonFlower.4"),
  },
  "Grow Blue Balloon Flower 5 times": {
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
    description: translate("chore.grow.blueBalloonFlower.5"),
  },
  "Grow Purple Daffodil 3 times": {
    icon: ITEM_DETAILS["Purple Daffodil"].image,
    description: translate("chore.grow.purpleDaffodil.3"),
  },
  "Grow Purple Daffodil 4 times": {
    icon: ITEM_DETAILS["Purple Daffodil"].image,
    description: translate("chore.grow.purpleDaffodil.4"),
  },
  "Grow Purple Daffodil 5 times": {
    icon: ITEM_DETAILS["Purple Daffodil"].image,
    description: translate("chore.grow.purpleDaffodil.5"),
  },
  "Grow Red Daffodil 2 times": {
    icon: ITEM_DETAILS["Red Daffodil"].image,
    description: translate("chore.grow.redDaffodil.2"),
  },
  "Grow Red Daffodil 3 times": {
    icon: ITEM_DETAILS["Red Daffodil"].image,
    description: translate("chore.grow.redDaffodil.3"),
  },
  "Grow Yellow Carnation 3 times": {
    icon: ITEM_DETAILS["Yellow Carnation"].image,
    description: translate("chore.grow.yellowCarnation.3"),
  },
  "Grow Blue Carnation 3 times": {
    icon: ITEM_DETAILS["Blue Carnation"].image,
    description: translate("chore.grow.blueCarnation.3"),
  },
  "Grow White Carnation 3 times": {
    icon: ITEM_DETAILS["White Carnation"].image,
    description: translate("chore.grow.whiteCarnation.3"),
  },
  "Grow Red Lotus 3 times": {
    icon: ITEM_DETAILS["Red Lotus"].image,
    description: translate("chore.grow.redLotus.3"),
  },
  "Grow Yellow Lotus 3 times": {
    icon: ITEM_DETAILS["Yellow Lotus"].image,
    description: translate("chore.grow.yellowLotus.3"),
  },
  "Grow White Lotus 3 times": {
    icon: ITEM_DETAILS["White Lotus"].image,
    description: translate("chore.grow.whiteLotus.3"),
  },
  "Grow Blue Pansy 6 times": {
    icon: ITEM_DETAILS["Blue Pansy"].image,
    description: translate("chore.grow.bluePansy.6"),
  },
  "Grow White Pansy 6 times": {
    icon: ITEM_DETAILS["White Pansy"].image,
    description: translate("chore.grow.whitePansy.6"),
  },
  "Grow White Cosmos 3 times": {
    icon: ITEM_DETAILS["White Cosmos"].image,
    description: translate("chore.grow.whiteCosmos.3"),
  },
  "Grow Purple Daffodil 6 times": {
    icon: ITEM_DETAILS["Purple Daffodil"].image,
    description: translate("chore.grow.purpleDaffodil.6"),
  },
  "Grow Red Balloon Flower 6 times": {
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
    description: translate("chore.grow.redBalloonFlower.6"),
  },
  "Fish 20 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.20"),
  },
  "Fish 40 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.40"),
  },
  "Fish 60 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.60"),
  },
  "Fish 200 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.200"),
  },
  "Fish 250 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.250"),
  },
  "Fish 275 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.275"),
  },
  "Craft 10 Axes": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.10"),
  },
  "Craft 12 Axes": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.12"),
  },
  "Craft 15 Axes": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.15"),
  },
  "Craft 6 Pickaxes": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.6"),
  },
  "Craft 8 Pickaxes": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.8"),
  },
  "Craft 10 Pickaxes": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.10"),
  },
  "Craft 100 Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.rod.100"),
  },
  "Craft 150 Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.rod.150"),
  },
  "Craft 200 Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.rod.200"),
  },
  "Craft 25 Gold Pickaxes": {
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
    description: translate("chore.craft.goldPickaxe.25"),
  },
  "Craft 30 Gold Pickaxes": {
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
    description: translate("chore.craft.goldPickaxe.30"),
  },
  "Craft 35 Gold Pickaxes": {
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
    description: translate("chore.craft.goldPickaxe.35"),
  },
  "Craft 40 Gold Pickaxes": {
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
    description: translate("chore.craft.goldPickaxe.40"),
  },
  "Craft 5 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.5"),
  },
  "Craft 10 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.10"),
  },
  "Craft 15 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.15"),
  },
  "Chop Trees 10 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.10"),
  },
  "Chop Trees 15 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.15"),
  },
  "Chop Trees 20 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.20"),
  },
  "Chop Trees 100 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.100"),
  },
  "Chop Trees 120 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.120"),
  },
  "Chop Trees 150 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.150"),
  },
  "Chop Trees 450 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.450"),
  },
  "Chop Trees 500 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.500"),
  },
  "Chop Trees 600 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.600"),
  },
  "Mine Stones 5 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.5"),
  },
  "Mine Stones 7 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.7"),
  },
  "Mine Stones 8 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.8"),
  },
  "Mine Stones 50 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.50"),
  },
  "Mine Stones 60 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.60"),
  },
  "Mine Stones 100 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.100"),
  },
  "Mine Gold 30 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.30"),
  },
  "Mine Gold 38 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.38"),
  },
  "Mine Gold 45 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.45"),
  },
  "Mine Crimstone 20 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.20"),
  },
  "Mine Crimstone 22 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.22"),
  },
  "Mine Crimstone 24 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.24"),
  },
  "Mine Iron 150 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.150"),
  },
  "Mine Iron 175 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.175"),
  },
  "Mine Iron 200 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.200"),
  },
  "Mine Iron 225 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.225"),
  },
  "Mine Stones 200 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.200"),
  },
  "Mine Stones 250 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.250"),
  },
  "Mine Stones 300 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.300"),
  },
  "Drill Oil Reserves 15 times": {
    icon: ITEM_DETAILS["Oil"].image,
    description: translate("chore.mine.oil.15"),
  },
  "Drill Oil Reserves 18 times": {
    icon: ITEM_DETAILS["Oil"].image,
    description: translate("chore.mine.oil.18"),
  },
  "Drill Oil Reserves 21 times": {
    icon: ITEM_DETAILS["Oil"].image,
    description: translate("chore.mine.oil.21"),
  },
  "Pick Blueberries 120 times": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.120"),
  },
  "Pick Blueberries 150 times": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.150"),
  },
  "Pick Blueberries 200 times": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.200"),
  },
  "Pick Oranges 100 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.100"),
  },
  "Pick Oranges 125 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.125"),
  },
  "Pick Oranges 160 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.160"),
  },
  "Pick Apples 60 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.60"),
  },
  "Pick Apples 75 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.75"),
  },
  "Pick Apples 90 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.90"),
  },
  "Pick Tomatoes 150 times": {
    icon: ITEM_DETAILS["Tomato"].image,
    description: translate("chore.pick.tomatoes.150"),
  },
  "Pick Tomatoes 200 times": {
    icon: ITEM_DETAILS["Tomato"].image,
    description: translate("chore.pick.tomatoes.200"),
  },
  "Pick Tomatoes 250 times": {
    icon: ITEM_DETAILS["Tomato"].image,
    description: translate("chore.pick.tomatoes.250"),
  },
  "Pick Grapes 36 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.36"),
  },
  "Pick Grapes 44 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.44"),
  },
  "Pick Grapes 52 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.52"),
  },
  "Pick Bananas 80 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.80"),
  },
  "Pick Bananas 90 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.90"),
  },
  "Pick Bananas 100 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.100"),
  },
  "Pick Bananas 120 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.120"),
  },
  "Pick Bananas 150 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.150"),
  },
  "Pick Lemons 150 times": {
    icon: ITEM_DETAILS["Lemon"].image,
    description: translate("chore.pick.lemons.150"),
  },
  "Pick Lemons 200 times": {
    icon: ITEM_DETAILS["Lemon"].image,
    description: translate("chore.pick.lemons.200"),
  },
  "Pick Lemons 250 times": {
    icon: ITEM_DETAILS["Lemon"].image,
    description: translate("chore.pick.lemons.250"),
  },
  "Collect 15 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.15"),
  },
  "Collect 18 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.18"),
  },
  "Collect 21 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.21"),
  },
  "Collect Eggs 60 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.60"),
  },
  "Collect Eggs 80 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.80"),
  },
  "Collect Eggs 100 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.100"),
  },
  "Collect Eggs 125 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.125"),
  },
  "Collect Eggs 150 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.150"),
  },
  "Collect Wool 30 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.30"),
  },
  "Collect Wool 40 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.40"),
  },
  "Collect Wool 50 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.50"),
  },
  "Collect Wool 60 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.60"),
  },
  "Collect Wool 75 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.75"),
  },
  "Collect Milk 30 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.30"),
  },
  "Collect Milk 40 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.40"),
  },
  "Collect Milk 50 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.50"),
  },
  "Collect Milk 60 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.60"),
  },
  "Collect Milk 75 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.75"),
  },
  "Dig 50 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.50"),
  },
  "Dig 75 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.75"),
  },
  "Dig 100 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.100"),
  },
  "Dig 125 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.125"),
  },
  "Dig 150 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.150"),
  },
  "Dig 175 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.175"),
  },
  "Dig 200 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.200"),
  },
  "Dig 225 times": {
    icon: ITEM_DETAILS["Sand Shovel"].image,
    description: translate("chore.dig.225"),
  },
  "Spend 32,000 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.32000"),
  },
  "Spend 48,000 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.48000"),
  },
  "Spend 64,000 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.64000"),
  },

  // To Remove
  "Cook 5 Cauliflower Burger": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.5"),
  },
  "Harvest Potato 100 times": {
    icon: ITEM_DETAILS["Potato"].image,
    description: translate("chore.harvest.potato.100"),
  },
  "Eat 15 Pumpkin Soup": {
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
    description: translate("chore.eat.pumpkinSoup.15"),
  },
  "Grow 3 Blue Cosmos": {
    icon: ITEM_DETAILS["Blue Cosmos"].image,
    description: translate("chore.grow.blueCosmos.3"),
  },
  "Chop 80 Trees": {
    icon: ITEM_DETAILS["Tree"].image,
    description: translate("chore.chop.tree.80"),
  },
  "Pick 60 Blueberries": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.60"),
  },
  "Cook 10 Sushi Roll": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.10"),
  },
  "Eat 7 Chowder": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.eat.chowder.7"),
  },
  "Harvest Olives 8 times": {
    icon: ITEM_DETAILS["Olive"].image,
    description: translate("chore.harvest.olives.8"),
  },
  "Mine 10 Crimstone": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.10"),
  },
  "Prepare 15 Bumpkin Detox": {
    icon: ITEM_DETAILS["Bumpkin Detox"].image,
    description: translate("chore.prepare.bumpkinDetox.15"),
  },
  "Grow White Pansy 3 times": {
    icon: ITEM_DETAILS["White Pansy"].image,
    description: translate("chore.grow.whitePansy.3"),
  },
  "Cook 5 Fermented Fish": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.5"),
  },
  "Harvest Sunflowers 300 times": {
    icon: ITEM_DETAILS.Sunflower.image,
    description: translate("chore.harvest.sunflower.300"),
  },
  "Harvest Sunflowers 350 times": {
    icon: ITEM_DETAILS.Sunflower.image,
    description: translate("chore.harvest.sunflower.350"),
  },
  "Harvest Potatoes 175 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.175"),
  },
  "Harvest Potatoes 225 times": {
    icon: ITEM_DETAILS.Potato.image,
    description: translate("chore.harvest.potato.225"),
  },
  "Harvest Rhubarbs 200 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.200"),
  },
  "Harvest Rhubarbs 250 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.250"),
  },
  "Harvest Rhubarbs 300 times": {
    icon: ITEM_DETAILS.Rhubarb.image,
    description: translate("chore.harvest.rhubarb.300"),
  },
  "Harvest Zucchini 125 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.125"),
  },
  "Harvest Zucchini 150 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.150"),
  },
  "Harvest Zucchini 175 times": {
    icon: ITEM_DETAILS.Zucchini.image,
    description: translate("chore.harvest.zucchini.175"),
  },
  "Harvest Carrots 125 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.125"),
  },
  "Harvest Carrots 130 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.130"),
  },
  "Harvest Carrots 150 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.150"),
  },
  "Harvest Carrots 170 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.170"),
  },
  "Harvest Carrots 175 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.175"),
  },
  "Harvest Carrots 200 times": {
    icon: ITEM_DETAILS.Carrot.image,
    description: translate("chore.harvest.carrot.200"),
  },
  "Harvest Yam 200 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.200"),
  },
  "Harvest Yam 225 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.225"),
  },
  "Harvest Yam 250 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.250"),
  },
  "Harvest Yam 275 times": {
    icon: ITEM_DETAILS.Yam.image,
    description: translate("chore.harvest.yam.275"),
  },
  "Harvest Cabbage 200 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.200"),
  },
  "Harvest Cabbage 220 times": {
    icon: ITEM_DETAILS.Cabbage.image,
    description: translate("chore.harvest.cabbage.220"),
  },
  "Harvest Broccoli 125 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.125"),
  },
  "Harvest Broccoli 150 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.150"),
  },
  "Harvest Broccoli 175 times": {
    icon: ITEM_DETAILS.Broccoli.image,
    description: translate("chore.harvest.broccoli.175"),
  },
  "Harvest Soybeans 75 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.75"),
  },
  "Harvest Soybeans 100 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.100"),
  },
  "Harvest Soybeans 125 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.125"),
  },
  "Harvest Soybeans 150 times": {
    icon: ITEM_DETAILS.Soybean.image,
    description: translate("chore.harvest.soybean.150"),
  },
  "Harvest Beetroot 125 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.125"),
  },
  "Harvest Beetroot 150 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.150"),
  },
  "Harvest Beetroot 175 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.175"),
  },
  "Harvest Beetroots 125 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.125"),
  },
  "Harvest Beetroots 150 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.150"),
  },
  "Harvest Beetroots 200 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.200"),
  },
  "Harvest Beetroots 220 times": {
    icon: ITEM_DETAILS.Beetroot.image,
    description: translate("chore.harvest.beetroot.220"),
  },
  "Harvest Pepper 125 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.125"),
  },
  "Harvest Pepper 150 times": {
    icon: ITEM_DETAILS.Pepper.image,
    description: translate("chore.harvest.pepper.150"),
  },
  "Harvest Cauliflowers 75 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.75"),
  },
  "Harvest Cauliflowers 100 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.100"),
  },
  "Harvest Cauliflowers 125 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.125"),
  },
  "Harvest Cauliflowers 150 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.150"),
  },
  "Harvest Cauliflowers 175 times": {
    icon: ITEM_DETAILS.Cauliflower.image,
    description: translate("chore.harvest.cauliflower.175"),
  },
  "Harvest Parsnips 50 times": {
    icon: ITEM_DETAILS.Parsnip.image,
    description: translate("chore.harvest.parsnip.50"),
  },
  "Harvest Parsnips 75 times": {
    icon: ITEM_DETAILS.Parsnip.image,
    description: translate("chore.harvest.parsnip.75"),
  },
  "Harvest Parsnips 100 times": {
    icon: ITEM_DETAILS.Parsnip.image,
    description: translate("chore.harvest.parsnip.100"),
  },
  "Harvest Parsnips 125 times": {
    icon: ITEM_DETAILS.Parsnip.image,
    description: translate("chore.harvest.parsnip.125"),
  },
  "Harvest Eggplant 480 times": {
    icon: ITEM_DETAILS.Eggplant.image,
    description: translate("chore.harvest.eggplant.480"),
  },
  "Harvest Corn 50 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.50"),
  },
  "Harvest Corn 100 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.100"),
  },
  "Harvest Corn 125 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.125"),
  },
  "Harvest Corn 150 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.150"),
  },
  "Harvest Corn 350 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.350"),
  },
  "Harvest Corn 400 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.400"),
  },
  "Harvest Corn 450 times": {
    icon: ITEM_DETAILS.Corn.image,
    description: translate("chore.harvest.corn.450"),
  },
  "Harvest Onion 360 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.360"),
  },
  "Harvest Onion 420 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.420"),
  },
  "Harvest Onion 460 times": {
    icon: ITEM_DETAILS.Onion.image,
    description: translate("chore.harvest.onion.460"),
  },
  "Harvest Wheat 275 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.275"),
  },
  "Harvest Wheat 325 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.325"),
  },
  "Harvest Wheat 350 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.350"),
  },
  "Harvest Wheat 400 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.400"),
  },
  "Harvest Wheat 420 times": {
    icon: ITEM_DETAILS.Wheat.image,
    description: translate("chore.harvest.wheat.420"),
  },
  "Harvest Radish 275 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.275"),
  },
  "Harvest Radish 325 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.325"),
  },
  "Harvest Radish 400 times": {
    icon: ITEM_DETAILS.Radish.image,
    description: translate("chore.harvest.radish.400"),
  },
  "Harvest Turnip 350 times": {
    icon: ITEM_DETAILS.Turnip.image,
    description: translate("chore.harvest.turnip.350"),
  },
  "Harvest Turnip 400 times": {
    icon: ITEM_DETAILS.Turnip.image,
    description: translate("chore.harvest.turnip.400"),
  },
  "Harvest Kale 150 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.150"),
  },
  "Harvest Kale 220 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.220"),
  },
  "Harvest Kale 250 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.250"),
  },
  "Harvest Kale 300 times": {
    icon: ITEM_DETAILS.Kale.image,
    description: translate("chore.harvest.kale.300"),
  },
  "Harvest Artichoke 250 times": {
    icon: ITEM_DETAILS.Artichoke.image,
    description: translate("chore.harvest.artichoke.250"),
  },
  "Harvest Artichoke 300 times": {
    icon: ITEM_DETAILS.Artichoke.image,
    description: translate("chore.harvest.artichoke.300"),
  },
  "Harvest Barley 125 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.125"),
  },
  "Harvest Barley 175 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.175"),
  },
  "Harvest Barley 250 times": {
    icon: ITEM_DETAILS.Barley.image,
    description: translate("chore.harvest.barley.250"),
  },
  "Harvest Rice 28 times": {
    icon: ITEM_DETAILS.Rice.image,
    description: translate("chore.harvest.rice.28"),
  },
  "Harvest Olives 24 times": {
    icon: ITEM_DETAILS["Olive"].image,
    description: translate("chore.harvest.olives.24"),
  },
  "Eat 35 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.35"),
  },
  "Eat 50 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.50"),
  },
  "Eat 65 Anchovies": {
    icon: ITEM_DETAILS.Anchovy.image,
    description: translate("chore.eat.anchovy.65"),
  },
  "Eat 25 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.25"),
  },
  "Eat 50 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.50"),
  },
  "Eat 75 Tunas": {
    icon: ITEM_DETAILS.Tuna.image,
    description: translate("chore.eat.tuna.75"),
  },
  "Eat 15 Red Snappers": {
    icon: ITEM_DETAILS["Red Snapper"].image,
    description: translate("chore.eat.redSnapper.15"),
  },
  "Eat 30 Red Snappers": {
    icon: ITEM_DETAILS["Red Snapper"].image,
    description: translate("chore.eat.redSnapper.30"),
  },
  "Eat 45 Red Snappers": {
    icon: ITEM_DETAILS["Red Snapper"].image,
    description: translate("chore.eat.redSnapper.45"),
  },
  "Eat 13 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.13"),
  },
  "Eat 16 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.16"),
  },
  "Eat 20 Orange Cake": {
    icon: ITEM_DETAILS["Orange Cake"].image,
    description: translate("chore.eat.orangeCake.20"),
  },
  "Drink Purple Smoothies 15 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.drink.purpleSmoothie.15"),
  },
  "Drink Purple Smoothies 20 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.drink.purpleSmoothie.20"),
  },
  "Drink Apple Juice 10 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.drink.appleJuice.10"),
  },
  "Drink Apple Juice 15 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.drink.appleJuice.15"),
  },
  "Drink 45 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.45"),
  },
  "Drink 55 Orange Juice": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.55"),
  },
  "Drink Orange Juice 15 times": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.15"),
  },
  "Drink Orange Juice 20 times": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.drink.orangeJuice.20"),
  },
  "Cook Boiled Eggs 10 times": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.cook.boiledEgg.10"),
  },
  "Cook Boiled Eggs 15 times": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.cook.boiledEgg.15"),
  },
  "Cook Boiled Eggs 25 times": {
    icon: ITEM_DETAILS["Boiled Eggs"].image,
    description: translate("chore.cook.boiledEgg.25"),
  },
  "Cook Reindeer Carrot 20 times": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.cook.reindeerCarrot.20"),
  },
  "Cook Reindeer Carrot 25 times": {
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
    description: translate("chore.cook.reindeerCarrot.25"),
  },
  "Cook Mashed Potatoes 50 times": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.cook.mashedPotato.50"),
  },
  "Cook Mashed Potatoes 65 times": {
    icon: ITEM_DETAILS["Mashed Potato"].image,
    description: translate("chore.cook.mashedPotato.65"),
  },
  "Cook Pancakes 7 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.7"),
  },
  "Cook Pancakes 10 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.10"),
  },
  "Cook Pancakes 12 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.12"),
  },
  "Cook Pancakes 15 times": {
    icon: ITEM_DETAILS["Pancakes"].image,
    description: translate("chore.cook.pancake.15"),
  },
  "Cook Fried Calamari 5 times": {
    icon: ITEM_DETAILS["Fried Calamari"].image,
    description: translate("chore.cook.friedCalamari.5"),
  },
  "Cook Cauliflower Burger 15 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.15"),
  },
  "Cook Cauliflower Burger 17 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.17"),
  },
  "Cook Cauliflower Burger 20 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.20"),
  },
  "Cook Cauliflower Burger 25 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.25"),
  },
  "Cook Cauliflower Burger 30 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.30"),
  },
  "Cook Cauliflower Burger 35 times": {
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
    description: translate("chore.cook.cauliflowerBurger.35"),
  },
  "Cook Bumpkin Salad 15 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.15"),
  },
  "Cook Bumpkin Salad 17 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.17"),
  },
  "Cook Bumpkin Salad 20 times": {
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
    description: translate("chore.cook.bumpkinSalad.20"),
  },
  "Cook Bumpkin ganoush 10 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.10"),
  },
  "Cook Bumpkin ganoush 12 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.12"),
  },
  "Cook Bumpkin ganoush 15 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.15"),
  },
  "Cook Bumpkin ganoush 20 times": {
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
    description: translate("chore.cook.bumpkinGanoush.20"),
  },
  "Cook Goblin's Treat 10 times": {
    icon: ITEM_DETAILS["Goblin's Treat"].image,
    description: translate("chore.cook.goblinTreat.10"),
  },
  "Cook Goblin's Treat 12 times": {
    icon: ITEM_DETAILS["Goblin's Treat"].image,
    description: translate("chore.cook.goblinTreat.12"),
  },
  "Cook Gumbo 45 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.45"),
  },
  "Cook Gumbo 60 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.60"),
  },
  "Cook Gumbo 35 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.35"),
  },
  "Cook Gumbo 50 times": {
    icon: ITEM_DETAILS["Gumbo"].image,
    description: translate("chore.cook.gumbo.50"),
  },
  "Cook 10 Sunflower Cakes": {
    icon: ITEM_DETAILS["Sunflower Cake"].image,
    description: translate("chore.cook.sunflowerCake.10"),
  },
  "Cook 15 Sunflower Cakes": {
    icon: ITEM_DETAILS["Sunflower Cake"].image,
    description: translate("chore.cook.sunflowerCake.15"),
  },
  "Cook Sunflower Cakes 10 times": {
    icon: ITEM_DETAILS["Sunflower Cake"].image,
    description: translate("chore.cook.sunflowerCake.10"),
  },
  "Cook Sunflower Cakes 15 times": {
    icon: ITEM_DETAILS["Sunflower Cake"].image,
    description: translate("chore.cook.sunflowerCake.15"),
  },
  "Cook 7 Carrot Cakes": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.7"),
  },
  "Cook 10 Carrot Cakes": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.10"),
  },
  "Cook 7 Cabbage Cakes": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.7"),
  },
  "Cook 10 Cabbage Cakes": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.10"),
  },
  "Cook Cornbread 15 times": {
    icon: ITEM_DETAILS["Cornbread"].image,
    description: translate("chore.cook.cornbread.15"),
  },
  "Cook Wheat Cakes 7 times": {
    icon: ITEM_DETAILS["Wheat Cake"].image,
    description: translate("chore.cook.wheatCake.7"),
  },
  "Cook Wheat Cakes 10 times": {
    icon: ITEM_DETAILS["Wheat Cake"].image,
    description: translate("chore.cook.wheatCake.10"),
  },
  "Cook Wheat Cakes 5 times": {
    icon: ITEM_DETAILS["Wheat Cake"].image,
    description: translate("chore.cook.wheatCake.5"),
  },
  "Cook Honey Cakes 10 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.10"),
  },
  "Cook Honey Cakes 15 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.15"),
  },
  "Cook Honey Cakes 20 times": {
    icon: ITEM_DETAILS["Honey Cake"].image,
    description: translate("chore.cook.honeyCake.20"),
  },
  "Cook Fermented Fish 20 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.20"),
  },
  "Cook Fermented Fish 25 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.25"),
  },
  "Cook Fermented Fish 30 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.30"),
  },
  "Cook Fermented Fish 35 times": {
    icon: ITEM_DETAILS["Fermented Fish"].image,
    description: translate("chore.cook.fermentedFish.35"),
  },
  "Cook 20 Chowder times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.20"),
  },
  "Cook 25 Chowder times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.25"),
  },
  "Cook 30 Chowder times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.30"),
  },
  "Cook 35 Chowder times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.35"),
  },
  "Cook 50 Chowder times": {
    icon: ITEM_DETAILS["Chowder"].image,
    description: translate("chore.cook.chowder.50"),
  },
  "Cook Antipasto 40 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.40"),
  },
  "Cook Antipasto 45 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.45"),
  },
  "Cook Antipasto 50 times": {
    icon: ITEM_DETAILS["Antipasto"].image,
    description: translate("chore.cook.antipasto.50"),
  },
  "Cook Rice Bun 35 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.35"),
  },
  "Cook Rice Bun 40 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.40"),
  },
  "Cook Rice Bun 45 times": {
    icon: ITEM_DETAILS["Rice Bun"].image,
    description: translate("chore.cook.riceBun.45"),
  },
  "Cook Cheese 75 times": {
    icon: ITEM_DETAILS["Cheese"].image,
    description: translate("chore.cook.cheese.75"),
  },
  "Cook Cheese 100 times": {
    icon: ITEM_DETAILS["Cheese"].image,
    description: translate("chore.cook.cheese.100"),
  },
  "Cook Honey Cheddar 12 times": {
    icon: ITEM_DETAILS["Honey Cheddar"].image,
    description: translate("chore.cook.honeyCheddar.12"),
  },
  "Cook Honey Cheddar 15 times": {
    icon: ITEM_DETAILS["Honey Cheddar"].image,
    description: translate("chore.cook.honeyCheddar.15"),
  },
  "Cook Blue Cheese 33 times": {
    icon: ITEM_DETAILS["Blue Cheese"].image,
    description: translate("chore.cook.blueCheese.33"),
  },
  "Cook Blue Cheese 40 times": {
    icon: ITEM_DETAILS["Blue Cheese"].image,
    description: translate("chore.cook.blueCheese.40"),
  },
  "Cook Goblin Brunch 4 times": {
    icon: ITEM_DETAILS["Goblin Brunch"].image,
    description: translate("chore.cook.goblinBrunch.4"),
  },
  "Cook Goblin Brunch 5 times": {
    icon: ITEM_DETAILS["Goblin Brunch"].image,
    description: translate("chore.cook.goblinBrunch.5"),
  },
  "Cook Sushi Roll 7 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.7"),
  },
  "Cook Sushi Roll 10 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.10"),
  },
  "Cook Sushi Roll 12 times": {
    icon: ITEM_DETAILS["Sushi Roll"].image,
    description: translate("chore.cook.sushiRoll.12"),
  },
  "Cook Caprese Salad 12 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.12"),
  },
  "Cook Caprese Salad 15 times": {
    icon: ITEM_DETAILS["Caprese Salad"].image,
    description: translate("chore.cook.capreseSalad.15"),
  },
  "Cook Ocean's Olive 10 times": {
    icon: ITEM_DETAILS["Ocean's Olive"].image,
    description: translate("chore.cook.oceanOlive.10"),
  },
  "Cook Ocean's Olive 12 times": {
    icon: ITEM_DETAILS["Ocean's Olive"].image,
    description: translate("chore.cook.oceanOlive.12"),
  },
  "Cook Eggplant Cakes 5 times": {
    icon: ITEM_DETAILS["Eggplant Cake"].image,
    description: translate("chore.cook.eggplantCake.5"),
  },
  "Cook Eggplant Cakes 10 times": {
    icon: ITEM_DETAILS["Eggplant Cake"].image,
    description: translate("chore.cook.eggplantCake.10"),
  },
  "Cook Radish Cakes 5 times": {
    icon: ITEM_DETAILS["Radish Cake"].image,
    description: translate("chore.cook.radishCake.5"),
  },
  "Cook Radish Cakes 10 times": {
    icon: ITEM_DETAILS["Radish Cake"].image,
    description: translate("chore.cook.radishCake.10"),
  },
  "Cook Beetroot Cakes 5 times": {
    icon: ITEM_DETAILS["Beetroot Cake"].image,
    description: translate("chore.cook.beetrootCake.5"),
  },
  "Cook Beetroot Cakes 10 times": {
    icon: ITEM_DETAILS["Beetroot Cake"].image,
    description: translate("chore.cook.beetrootCake.10"),
  },
  "Cook Bumpkin Roast 12 times": {
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
    description: translate("chore.cook.bumpkinRoast.12"),
  },
  "Cook Bumpkin Roast 15 times": {
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
    description: translate("chore.cook.bumpkinRoast.15"),
  },
  "Cook Pizza Margherita 12 times": {
    icon: ITEM_DETAILS["Pizza Margherita"].image,
    description: translate("chore.cook.pizzaMargherita.12"),
  },
  "Cook Apple Pie 20 times": {
    icon: ITEM_DETAILS["Apple Pie"].image,
    description: translate("chore.cook.applePie.20"),
  },
  "Cook Potato Cakes 7 times": {
    icon: ITEM_DETAILS["Potato Cake"].image,
    description: translate("chore.cook.potatoCake.7"),
  },
  "Cook Potato Cakes 10 times": {
    icon: ITEM_DETAILS["Potato Cake"].image,
    description: translate("chore.cook.potatoCake.10"),
  },
  "Cook Carrot Cakes 7 times": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.7"),
  },
  "Cook Carrot Cakes 10 times": {
    icon: ITEM_DETAILS["Carrot Cake"].image,
    description: translate("chore.cook.carrotCake.10"),
  },
  "Cook Spaghetti al Limone 7 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.7"),
  },
  "Cook Spaghetti al Limone 10 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.10"),
  },
  "Cook Spaghetti al Limone 12 times": {
    icon: ITEM_DETAILS["Spaghetti al Limone"].image,
    description: translate("chore.cook.spaghettiAlLimone.12"),
  },
  "Cook Beetroot Cakes 7 times": {
    icon: ITEM_DETAILS["Beetroot Cake"].image,
    description: translate("chore.cook.beetrootCake.7"),
  },
  "Cook Cabbage Cakes 7 times": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.7"),
  },
  "Cook Cabbage Cakes 10 times": {
    icon: ITEM_DETAILS["Cabbage Cake"].image,
    description: translate("chore.cook.cabbageCake.10"),
  },
  "Cook Parsnip Cakes 7 times": {
    icon: ITEM_DETAILS["Parsnip Cake"].image,
    description: translate("chore.cook.parsnipCake.7"),
  },
  "Cook Parsnip Cakes 10 times": {
    icon: ITEM_DETAILS["Parsnip Cake"].image,
    description: translate("chore.cook.parsnipCake.10"),
  },
  "Cook Cauliflower Cakes 7 times": {
    icon: ITEM_DETAILS["Cauliflower Cake"].image,
    description: translate("chore.cook.cauliflowerCake.7"),
  },
  "Cook Cauliflower Cakes 10 times": {
    icon: ITEM_DETAILS["Cauliflower Cake"].image,
    description: translate("chore.cook.cauliflowerCake.10"),
  },
  "Prepare Power Smoothie 30 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.30"),
  },
  "Prepare Power Smoothie 45 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.45"),
  },
  "Prepare Power Smoothie 60 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.60"),
  },
  "Prepare Slow Juice 10 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.10"),
  },
  "Prepare Slow Juice 12 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.12"),
  },
  "Prepare Slow Juice 15 times": {
    icon: ITEM_DETAILS["Slow Juice"].image,
    description: translate("chore.prepare.slowJuice.15"),
  },
  "Prepare Banana Blast 15 times": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.prepare.bananaBlast.15"),
  },
  "Prepare Banana Blast 17 times": {
    icon: ITEM_DETAILS["Banana Blast"].image,
    description: translate("chore.prepare.bananaBlast.17"),
  },
  "Prepare Grape Juice 5 times": {
    icon: ITEM_DETAILS["Grape Juice"].image,
    description: translate("chore.prepare.grapeJuice.5"),
  },
  "Cook Apple Juice 10 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.cook.appleJuice.10"),
  },
  "Cook Apple Juice 12 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.cook.appleJuice.12"),
  },
  "Cook Apple Juice 15 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.cook.appleJuice.15"),
  },
  "Prepare Apple Juice 10 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.10"),
  },
  "Prepare Apple Juice 12 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.12"),
  },
  "Prepare Apple Juice 17 times": {
    icon: ITEM_DETAILS["Apple Juice"].image,
    description: translate("chore.prepare.appleJuice.17"),
  },
  "Prepare Orange Juice 15 times": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.prepare.orangeJuice.15"),
  },
  "Prepare Orange Juice 20 times": {
    icon: ITEM_DETAILS["Orange Juice"].image,
    description: translate("chore.prepare.orangeJuice.20"),
  },
  "Cook Carrot Juice 15 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.cook.carrotJuice.15"),
  },
  "Cook Carrot Juice 20 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.cook.carrotJuice.20"),
  },
  "Cook Carrot Juice 25 times": {
    icon: ITEM_DETAILS["Carrot Juice"].image,
    description: translate("chore.cook.carrotJuice.25"),
  },
  "Prepare Purple Smoothie 10 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.10"),
  },
  "Prepare Purple Smoothie 12 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.12"),
  },
  "Prepare Purple Smoothie 15 times": {
    icon: ITEM_DETAILS["Purple Smoothie"].image,
    description: translate("chore.prepare.purpleSmoothie.15"),
  },
  "Prepare Sour Shake 15 times": {
    icon: ITEM_DETAILS["Sour Shake"].image,
    description: translate("chore.prepare.sourShake.15"),
  },
  "Prepare Sour Shake 20 times": {
    icon: ITEM_DETAILS["Sour Shake"].image,
    description: translate("chore.prepare.sourShake.20"),
  },
  "Prepare Sour Shake 25 times": {
    icon: ITEM_DETAILS["Sour Shake"].image,
    description: translate("chore.prepare.sourShake.25"),
  },
  "Prepare Power Smoothie 5 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.5"),
  },
  "Prepare Power Smoothie 6 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.6"),
  },
  "Prepare Power Smoothie 7 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.7"),
  },
  "Prepare Power Smoothie 15 times": {
    icon: ITEM_DETAILS["Power Smoothie"].image,
    description: translate("chore.prepare.powerSmoothie.15"),
  },
  "Grow Yellow Gladiolus 3 times": {
    icon: ITEM_DETAILS["Yellow Gladiolus"].image,
    description: translate("chore.grow.yellowGladiolus.3"),
  },
  "Grow Yellow Gladiolus 4 times": {
    icon: ITEM_DETAILS["Yellow Gladiolus"].image,
    description: translate("chore.grow.yellowGladiolus.4"),
  },
  "Grow Purple Gladiolus 3 times": {
    icon: ITEM_DETAILS["Purple Gladiolus"].image,
    description: translate("chore.grow.purpleGladiolus.3"),
  },
  "Grow Purple Gladiolus 4 times": {
    icon: ITEM_DETAILS["Purple Gladiolus"].image,
    description: translate("chore.grow.purpleGladiolus.4"),
  },
  "Grow Purple Edelweiss 3 times": {
    icon: ITEM_DETAILS["Purple Edelweiss"].image,
    description: translate("chore.grow.purpleEdelweiss.3"),
  },
  "Grow Purple Edelweiss 4 times": {
    icon: ITEM_DETAILS["Purple Edelweiss"].image,
    description: translate("chore.grow.purpleEdelweiss.4"),
  },
  "Grow Yellow Edelweiss 3 times": {
    icon: ITEM_DETAILS["Yellow Edelweiss"].image,
    description: translate("chore.grow.yellowEdelweiss.3"),
  },
  "Grow Yellow Edelweiss 4 times": {
    icon: ITEM_DETAILS["Yellow Edelweiss"].image,
    description: translate("chore.grow.yellowEdelweiss.4"),
  },
  "Grow Blue Clover 3 times": {
    icon: ITEM_DETAILS["Blue Clover"].image,
    description: translate("chore.grow.blueClover.3"),
  },
  "Grow Blue Clover 4 times": {
    icon: ITEM_DETAILS["Blue Clover"].image,
    description: translate("chore.grow.blueClover.4"),
  },
  "Grow Yellow Clover 3 times": {
    icon: ITEM_DETAILS["Yellow Clover"].image,
    description: translate("chore.grow.yellowClover.3"),
  },
  "Grow Yellow Clover 4 times": {
    icon: ITEM_DETAILS["Yellow Clover"].image,
    description: translate("chore.grow.yellowClover.4"),
  },
  "Grow Red Lavender 3 times": {
    icon: ITEM_DETAILS["Red Lavender"].image,
    description: translate("chore.grow.redLavender.3"),
  },
  "Grow Red Lavender 4 times": {
    icon: ITEM_DETAILS["Red Lavender"].image,
    description: translate("chore.grow.redLavender.4"),
  },
  "Grow White Lavender 3 times": {
    icon: ITEM_DETAILS["White Lavender"].image,
    description: translate("chore.grow.whiteLavender.3"),
  },
  "Grow White Lavender 4 times": {
    icon: ITEM_DETAILS["White Lavender"].image,
    description: translate("chore.grow.whiteLavender.4"),
  },
  "Grow Purple Cosmos 5 times": {
    icon: ITEM_DETAILS["Purple Cosmos"].image,
    description: translate("chore.grow.purpleCosmos.5"),
  },
  "Grow Purple Cosmos 6 times": {
    icon: ITEM_DETAILS["Purple Cosmos"].image,
    description: translate("chore.grow.purpleCosmos.6"),
  },
  "Grow Blue Cosmos 5 times": {
    icon: ITEM_DETAILS["Blue Cosmos"].image,
    description: translate("chore.grow.blueCosmos.5"),
  },
  "Grow Blue Cosmos 6 times": {
    icon: ITEM_DETAILS["Blue Cosmos"].image,
    description: translate("chore.grow.blueCosmos.6"),
  },
  "Grow Yellow Carnation 4 times": {
    icon: ITEM_DETAILS["Yellow Carnation"].image,
    description: translate("chore.grow.yellowCarnation.4"),
  },
  "Grow Blue Carnation 4 times": {
    icon: ITEM_DETAILS["Blue Carnation"].image,
    description: translate("chore.grow.blueCarnation.4"),
  },
  "Grow White Carnation 4 times": {
    icon: ITEM_DETAILS["White Carnation"].image,
    description: translate("chore.grow.whiteCarnation.4"),
  },
  "Grow Red Lotus 4 times": {
    icon: ITEM_DETAILS["Red Lotus"].image,
    description: translate("chore.grow.redLotus.4"),
  },
  "Grow Yellow Lotus 4 times": {
    icon: ITEM_DETAILS["Yellow Lotus"].image,
    description: translate("chore.grow.yellowLotus.4"),
  },
  "Grow White Lotus 4 times": {
    icon: ITEM_DETAILS["White Lotus"].image,
    description: translate("chore.grow.whiteLotus.4"),
  },
  "Grow White Cosmos 4 times": {
    icon: ITEM_DETAILS["White Cosmos"].image,
    description: translate("chore.grow.whiteCosmos.4"),
  },
  "Fish 300 times": {
    icon: SUNNYSIDE.icons.fish,
    description: translate("chore.fish.300"),
  },
  "Craft Axes 20 times": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.20"),
  },
  "Craft Axes 25 times": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.25"),
  },
  "Craft Axes 30 times": {
    icon: ITEM_DETAILS["Axe"].image,
    description: translate("chore.craft.axe.30"),
  },
  "Craft Pickaxes 10 times": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.10"),
  },
  "Craft Pickaxes 15 times": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.15"),
  },
  "Craft Pickaxes 20 times": {
    icon: ITEM_DETAILS["Pickaxe"].image,
    description: translate("chore.craft.pickaxe.20"),
  },
  "Craft 100 Fishing Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.fishingRod.100"),
  },
  "Craft 150 Fishing Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.fishingRod.150"),
  },
  "Craft 200 Fishing Rods": {
    icon: ITEM_DETAILS["Rod"].image,
    description: translate("chore.craft.fishingRod.200"),
  },
  "Craft 20 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.20"),
  },
  "Craft 25 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.25"),
  },
  "Craft 30 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.30"),
  },
  "Craft 35 Sand Drill": {
    icon: ITEM_DETAILS["Sand Drill"].image,
    description: translate("chore.craft.sandDrill.35"),
  },
  "Chop Trees 25 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.25"),
  },
  "Chop Trees 30 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.30"),
  },
  "Chop Trees 200 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.200"),
  },
  "Chop Trees 250 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.250"),
  },
  "Chop Trees 550 times": {
    icon: ITEM_DETAILS["Wood"].image,
    description: translate("chore.chop.tree.550"),
  },
  "Mine Stones 10 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.10"),
  },
  "Mine Stones 12 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.12"),
  },
  "Mine Stones 20 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.20"),
  },
  "Mine Stones 135 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.135"),
  },
  "Mine Stones 175 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.175"),
  },
  "Mine Gold 50 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.50"),
  },
  "Mine Gold 55 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.55"),
  },
  "Mine Gold 60 times": {
    icon: ITEM_DETAILS["Gold"].image,
    description: translate("chore.mine.gold.60"),
  },
  "Mine Crimstone 28 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.28"),
  },
  "Mine Crimstone 32 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.32"),
  },
  "Mine Crimstone 36 times": {
    icon: ITEM_DETAILS["Crimstone"].image,
    description: translate("chore.mine.crimstone.36"),
  },
  "Mine Iron 250 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.250"),
  },
  "Mine Iron 300 times": {
    icon: ITEM_DETAILS["Iron"].image,
    description: translate("chore.mine.iron.300"),
  },
  "Mine Stones 275 times": {
    icon: ITEM_DETAILS["Stone"].image,
    description: translate("chore.mine.stone.275"),
  },
  "Pick Blueberries 180 times": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.180"),
  },
  "Pick Blueberries 250 times": {
    icon: ITEM_DETAILS["Blueberry"].image,
    description: translate("chore.pick.blueberries.250"),
  },
  "Pick Oranges 150 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.150"),
  },
  "Pick Oranges 175 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.175"),
  },
  "Pick Oranges 205 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.205"),
  },
  "Pick Oranges 250 times": {
    icon: ITEM_DETAILS["Orange"].image,
    description: translate("chore.pick.oranges.250"),
  },
  "Pick Apples 125 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.125"),
  },
  "Pick Apples 150 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.150"),
  },
  "Pick Apples 175 times": {
    icon: ITEM_DETAILS["Apple"].image,
    description: translate("chore.pick.apples.175"),
  },
  "Pick Tomatoes 300 times": {
    icon: ITEM_DETAILS["Tomato"].image,
    description: translate("chore.pick.tomatoes.300"),
  },
  "Pick Tomatoes 350 times": {
    icon: ITEM_DETAILS["Tomato"].image,
    description: translate("chore.pick.tomatoes.350"),
  },
  "Pick Grapes 48 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.48"),
  },
  "Pick Grapes 60 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.60"),
  },
  "Pick Grapes 72 times": {
    icon: ITEM_DETAILS["Grape"].image,
    description: translate("chore.pick.grapes.72"),
  },
  "Pick Bananas 125 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.125"),
  },
  "Pick Bananas 175 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.175"),
  },
  "Pick Bananas 200 times": {
    icon: ITEM_DETAILS["Banana"].image,
    description: translate("chore.pick.bananas.200"),
  },
  "Pick Lemons 300 times": {
    icon: ITEM_DETAILS["Lemon"].image,
    description: translate("chore.pick.lemons.300"),
  },
  "Pick Lemons 350 times": {
    icon: ITEM_DETAILS["Lemon"].image,
    description: translate("chore.pick.lemons.350"),
  },
  "Collect 20 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.20"),
  },
  "Collect 25 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.25"),
  },
  "Collect 30 Honey": {
    icon: ITEM_DETAILS["Honey"].image,
    description: translate("chore.collect.honey.30"),
  },
  "Collect Eggs 75 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.75"),
  },
  "Collect Eggs 175 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.175"),
  },
  "Collect Eggs 200 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.200"),
  },
  "Collect Eggs 225 times": {
    icon: ITEM_DETAILS["Egg"].image,
    description: translate("chore.collect.eggs.225"),
  },
  "Collect Wool 70 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.70"),
  },
  "Collect Wool 80 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.80"),
  },
  "Collect Wool 100 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.100"),
  },
  "Collect Wool 125 times": {
    icon: ITEM_DETAILS["Wool"].image,
    description: translate("chore.collect.wool.125"),
  },
  "Collect Milk 100 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.100"),
  },
  "Collect Milk 125 times": {
    icon: ITEM_DETAILS["Milk"].image,
    description: translate("chore.collect.milk.125"),
  },
  "Spend 60,606 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.60606"),
  },
  "Spend 70,707 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.70707"),
  },
  "Spend 80,808 Coins": {
    icon: SUNNYSIDE.ui.coins,
    description: translate("chore.spend.80808"),
  },
};
