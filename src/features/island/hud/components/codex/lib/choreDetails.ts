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
};
