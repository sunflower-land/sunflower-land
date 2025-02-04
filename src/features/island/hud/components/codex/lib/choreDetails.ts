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
  "Mine 20 Gold": {
    description: translate("chore.mine.20.gold"),
    icon: ITEM_DETAILS.Gold.image,
  },
  "Mine 23 Gold": {
    description: translate("chore.mine.23.gold"),
    icon: ITEM_DETAILS.Gold.image,
  },
  "Mine 25 Gold": {
    description: translate("chore.mine.25.gold"),
    icon: ITEM_DETAILS.Gold.image,
  },
  "Mine 10 Crimstone": {
    description: translate("chore.mine.10.crimstone"),
    icon: ITEM_DETAILS.Crimstone.image,
  },
  "Mine 12 Crimstone": {
    description: translate("chore.mine.12.crimstone"),
    icon: ITEM_DETAILS.Crimstone.image,
  },
  "Mine 15 Crimstone": {
    description: translate("chore.mine.15.crimstone"),
    icon: ITEM_DETAILS.Crimstone.image,
  },
  "Craft 20 Iron Pickaxe": {
    description: translate("chore.craft.20.iron.pickaxe"),
    icon: ITEM_DETAILS["Iron Pickaxe"].image,
  },
  "Craft 25 Iron Pickaxe": {
    description: translate("chore.craft.25.iron.pickaxe"),
    icon: ITEM_DETAILS["Iron Pickaxe"].image,
  },
  "Craft 15 Gold Pickaxe": {
    description: translate("chore.craft.15.gold.pickaxe"),
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
  },
  "Craft 20 Gold Pickaxe": {
    description: translate("chore.craft.20.gold.pickaxe"),
    icon: ITEM_DETAILS["Gold Pickaxe"].image,
  },
  "Spend 35,000 Coins": {
    description: translate("chore.spend.35000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Spend 42,000 Coins": {
    description: translate("chore.spend.42000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Spend 55,000 Coins": {
    description: translate("chore.spend.55000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Pick 45 Blueberries": {
    description: translate("chore.pick.45.blueberries"),
    icon: ITEM_DETAILS.Blueberry.image,
  },
  "Pick 51 Blueberries": {
    description: translate("chore.pick.51.blueberries"),
    icon: ITEM_DETAILS.Blueberry.image,
  },
  "Pick 60 Blueberries": {
    description: translate("chore.pick.60.blueberries"),
    icon: ITEM_DETAILS.Blueberry.image,
  },
  "Pick 30 Oranges": {
    description: translate("chore.pick.30.oranges"),
    icon: ITEM_DETAILS.Orange.image,
  },
  "Pick 40 Oranges": {
    description: translate("chore.pick.40.oranges"),
    icon: ITEM_DETAILS.Orange.image,
  },
  "Pick 50 Oranges": {
    description: translate("chore.pick.50.oranges"),
    icon: ITEM_DETAILS.Orange.image,
  },
  "Pick 25 Apples": {
    description: translate("chore.pick.25.apples"),
    icon: ITEM_DETAILS.Apple.image,
  },
  "Pick 30 Apples": {
    description: translate("chore.pick.30.apples"),
    icon: ITEM_DETAILS.Apple.image,
  },
  "Pick 45 Apples": {
    description: translate("chore.pick.45.apples"),
    icon: ITEM_DETAILS.Apple.image,
  },
  "Pick 35 Bananas": {
    description: translate("chore.pick.35.bananas"),
    icon: ITEM_DETAILS.Banana.image,
  },
  "Pick 40 Bananas": {
    description: translate("chore.pick.40.bananas"),
    icon: ITEM_DETAILS.Banana.image,
  },
  "Pick 45 Bananas": {
    description: translate("chore.pick.45.bananas"),
    icon: ITEM_DETAILS.Banana.image,
  },
  "Pick 40 Tomatoes": {
    description: translate("chore.pick.40.tomatoes"),
    icon: ITEM_DETAILS.Tomato.image,
  },
  "Pick 60 Tomatoes": {
    description: translate("chore.pick.60.tomatoes"),
    icon: ITEM_DETAILS.Tomato.image,
  },
  "Pick 80 Tomatoes": {
    description: translate("chore.pick.80.tomatoes"),
    icon: ITEM_DETAILS.Tomato.image,
  },
  "Pick 25 Lemons": {
    description: translate("chore.pick.25.lemons"),
    icon: ITEM_DETAILS.Lemon.image,
  },
  "Pick 40 Lemons": {
    description: translate("chore.pick.40.lemons"),
    icon: ITEM_DETAILS.Lemon.image,
  },
  "Pick 65 Lemons": {
    description: translate("chore.pick.65.lemons"),
    icon: ITEM_DETAILS.Lemon.image,
  },
  "Harvest Parsnips 450 times": {
    description: translate("chore.harvest.450.parsnips"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest Parsnips 500 times": {
    description: translate("chore.harvest.500.parsnips"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest Eggplants 250 times": {
    description: translate("chore.harvest.250.eggplants"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest Eggplants 300 times": {
    description: translate("chore.harvest.300.eggplants"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest Corn 275 times": {
    description: translate("chore.harvest.275.corn"),
    icon: ITEM_DETAILS.Corn.image,
  },
  "Harvest Corn 300 times": {
    description: translate("chore.harvest.300.corn"),
    icon: ITEM_DETAILS.Corn.image,
  },
  "Harvest Radish 200 times": {
    description: translate("chore.harvest.200.radishes"),
    icon: ITEM_DETAILS.Radish.image,
  },
  "Harvest Radish 240 times": {
    description: translate("chore.harvest.240.radishes"),
    icon: ITEM_DETAILS.Radish.image,
  },
  "Harvest Wheat 200 times": {
    description: translate("chore.harvest.200.wheat"),
    icon: ITEM_DETAILS.Wheat.image,
  },
  "Harvest Wheat 240 times": {
    description: translate("chore.harvest.240.wheat"),
    icon: ITEM_DETAILS.Wheat.image,
  },
  "Harvest Kale 175 times": {
    description: translate("chore.harvest.175.kale"),
    icon: ITEM_DETAILS.Kale.image,
  },
  "Harvest Kale 200 times": {
    description: translate("chore.harvest.200.kale"),
    icon: ITEM_DETAILS.Kale.image,
  },
  "Cook 15 Honey Cake": {
    description: translate("chore.cook.15.honey.cake"),
    icon: ITEM_DETAILS["Honey Cake"].image,
  },
  "Cook 20 Honey Cake": {
    description: translate("chore.cook.20.honey.cake"),
    icon: ITEM_DETAILS["Honey Cake"].image,
  },
  "Cook 3 Parsnip Cake": {
    description: translate("chore.cook.3.parsnip.cake"),
    icon: ITEM_DETAILS["Parsnip Cake"].image,
  },
  "Cook 5 Parsnip Cake": {
    description: translate("chore.cook.5.parsnip.cake"),
    icon: ITEM_DETAILS["Parsnip Cake"].image,
  },
  "Cook 3 Eggplant Cake": {
    description: translate("chore.cook.3.eggplant.cake"),
    icon: ITEM_DETAILS["Eggplant Cake"].image,
  },
  "Cook 5 Eggplant Cake": {
    description: translate("chore.cook.5.eggplant.cake"),
    icon: ITEM_DETAILS["Eggplant Cake"].image,
  },
  "Cook 3 Radish Cake": {
    description: translate("chore.cook.3.radish.cake"),
    icon: ITEM_DETAILS["Radish Cake"].image,
  },
  "Cook 5 Radish Cake": {
    description: translate("chore.cook.5.radish.cake"),
    icon: ITEM_DETAILS["Radish Cake"].image,
  },
  "Cook 5 Cauliflower Burger": {
    description: translate("chore.cook.5.cauliflower.burger"),
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
  },
  "Cook 7 Cauliflower Burger": {
    description: translate("chore.cook.7.cauliflower.burger"),
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
  },
  "Cook 10 Cauliflower Burger": {
    description: translate("chore.cook.10.cauliflower.burger"),
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
  },
  "Cook 5 Bumpkin Salad": {
    description: translate("chore.cook.5.bumpkin.salad"),
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
  },
  "Cook 7 Bumpkin Salad": {
    description: translate("chore.cook.7.bumpkin.salad"),
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
  },
  "Cook 10 Bumpkin Salad": {
    description: translate("chore.cook.10.bumpkin.salad"),
    icon: ITEM_DETAILS["Bumpkin Salad"].image,
  },
  "Cook 3 Bumpkin ganoush": {
    description: translate("chore.cook.3.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Cook 5 Bumpkin ganoush": {
    description: translate("chore.cook.5.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Cook 7 Bumpkin ganoush": {
    description: translate("chore.cook.7.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Cook 3 Goblin's Treat": {
    description: translate("chore.cook.3.goblins.treat"),
    icon: ITEM_DETAILS["Goblin's Treat"].image,
  },
  "Cook 5 Goblin's Treat": {
    description: translate("chore.cook.5.goblins.treat"),
    icon: ITEM_DETAILS["Goblin's Treat"].image,
  },
  "Cook 7 Goblin's Treat": {
    description: translate("chore.cook.7.goblins.treat"),
    icon: ITEM_DETAILS["Goblin's Treat"].image,
  },
  "Harvest Beetroot 250 times": {
    description: translate("chore.harvest.250.beetroot"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest Beetroot 300 times": {
    description: translate("chore.harvest.300.beetroot"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest Cauliflower 180 times": {
    description: translate("chore.harvest.180.cauliflower"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest Cauliflower 200 times": {
    description: translate("chore.harvest.200.cauliflower"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest Parsnip 100 times": {
    description: translate("chore.harvest.100.parsnip"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest Parsnip 150 times": {
    description: translate("chore.harvest.150.parsnip"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest Eggplants 80 times": {
    description: translate("chore.harvest.80.eggplant"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest Eggplants 120 times": {
    description: translate("chore.harvest.120.eggplant"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest Sunflowers 150 times": {
    description: translate("chore.harvest.150.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest Sunflowers 200 times": {
    description: translate("chore.harvest.200.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest Sunflowers 250 times": {
    description: translate("chore.harvest.250.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest Potato 100 times": {
    description: translate("chore.harvest.100.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest Potato 125 times": {
    description: translate("chore.harvest.125.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest Potato 150 times": {
    description: translate("chore.harvest.150.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest Pumpkin 75 times": {
    description: translate("chore.harvest.75.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Harvest Pumpkin 100 times": {
    description: translate("chore.harvest.100.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Harvest Pumpkin 125 times": {
    description: translate("chore.harvest.125.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Eat 10 Pumpkin Soup": {
    description: translate("chore.eat.10.pumpkin.soup"),
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
  },
  "Eat 12 Pumpkin Soup": {
    description: translate("chore.eat.12.pumpkin.soup"),
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
  },
  "Eat 15 Pumpkin Soup": {
    description: translate("chore.eat.15.pumpkin.soup"),
    icon: ITEM_DETAILS["Pumpkin Soup"].image,
  },
  "Eat 8 Bumpkin Broth": {
    description: translate("chore.eat.8.bumpkin.broth"),
    icon: ITEM_DETAILS["Bumpkin Broth"].image,
  },
  "Eat 12 Bumpkin Broth": {
    description: translate("chore.eat.12.bumpkin.broth"),
    icon: ITEM_DETAILS["Bumpkin Broth"].image,
  },
  "Eat 10 Reindeer Carrot": {
    description: translate("chore.eat.10.reindeer.carrot"),
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
  },
  "Eat 15 Reindeer Carrot": {
    description: translate("chore.eat.15.reindeer.carrot"),
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
  },
  "Cook 3 Bumpkin Broth": {
    description: translate("chore.cook.3.bumpkin.broth"),
    icon: ITEM_DETAILS["Bumpkin Broth"].image,
  },
  "Cook 5 Bumpkin Broth": {
    description: translate("chore.cook.5.bumpkin.broth"),
    icon: ITEM_DETAILS["Bumpkin Broth"].image,
  },
  "Cook 8 Reindeer Carrot": {
    description: translate("chore.cook.8.reindeer.carrot"),
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
  },
  "Cook 12 Reindeer Carrot": {
    description: translate("chore.cook.12.reindeer.carrot"),
    icon: ITEM_DETAILS["Reindeer Carrot"].image,
  },
  "Chop 60 Trees": {
    description: translate("chore.chop.60.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 70 Trees": {
    description: translate("chore.chop.70.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 80 Trees": {
    description: translate("chore.chop.80.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Mine 50 Stones": {
    description: translate("chore.mine.50.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 75 Stones": {
    description: translate("chore.mine.75.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 100 Stones": {
    description: translate("chore.mine.100.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Collect 3 Honey": {
    description: translate("chore.collect.3.honey"),
    icon: ITEM_DETAILS.Honey.image,
  },
  "Collect 5 Honey": {
    description: translate("chore.collect.5.honey"),
    icon: ITEM_DETAILS.Honey.image,
  },
  "Cook 3 Fermented Fish": {
    description: translate("chore.cook.3.fermented.fish"),
    icon: ITEM_DETAILS["Fermented Fish"].image,
  },
  "Cook 4 Fermented Fish": {
    description: translate("chore.cook.4.fermented.fish"),
    icon: ITEM_DETAILS["Fermented Fish"].image,
  },
  "Cook 5 Fermented Fish": {
    description: translate("chore.cook.5.fermented.fish"),
    icon: ITEM_DETAILS["Fermented Fish"].image,
  },
  "Cook 10 Chowder": {
    description: translate("chore.cook.10.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Cook 12 Chowder": {
    description: translate("chore.cook.12.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Cook 15 Chowder": {
    description: translate("chore.cook.15.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Craft 30 Fishing Rod": {
    description: translate("chore.craft.30.fishing.rod"),
    icon: ITEM_DETAILS.Rod.image,
  },
  "Craft 40 Fishing Rod": {
    description: translate("chore.craft.40.fishing.rod"),
    icon: ITEM_DETAILS.Rod.image,
  },
  "Cook 15 Steamed Red Rice": {
    description: translate("chore.cook.15.steamed.red.rice"),
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
  },
  "Cook 17 Steamed Red Rice": {
    description: translate("chore.cook.17.steamed.red.rice"),
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
  },
  "Cook 3 Blueberry Jam": {
    description: translate("chore.cook.3.blueberry.jam"),
    icon: ITEM_DETAILS["Blueberry Jam"].image,
  },
  "Cook 4 Blueberry Jam": {
    description: translate("chore.cook.4.blueberry.jam"),
    icon: ITEM_DETAILS["Blueberry Jam"].image,
  },
  "Cook 5 Blueberry Jam": {
    description: translate("chore.cook.5.blueberry.jam"),
    icon: ITEM_DETAILS["Blueberry Jam"].image,
  },
  "Prepare 10 Banana Blast": {
    description: translate("chore.prepare.10.banana.blast"),
    icon: ITEM_DETAILS["Banana Blast"].image,
  },
  "Prepare 20 Banana Blast": {
    description: translate("chore.prepare.20.banana.blast"),
    icon: ITEM_DETAILS["Banana Blast"].image,
  },
  "Prepare 30 Banana Blast": {
    description: translate("chore.prepare.30.banana.blast"),
    icon: ITEM_DETAILS["Banana Blast"].image,
  },
  "Prepare 15 Bumpkin Detox": {
    description: translate("chore.prepare.15.bumpkin.detox"),
    icon: ITEM_DETAILS["Bumpkin Detox"].image,
  },
  "Prepare 25 Bumpkin Detox": {
    description: translate("chore.prepare.25.bumpkin.detox"),
    icon: ITEM_DETAILS["Bumpkin Detox"].image,
  },
  "Prepare 35 Bumpkin Detox": {
    description: translate("chore.prepare.35.bumpkin.detox"),
    icon: ITEM_DETAILS["Bumpkin Detox"].image,
  },
  "Dig 25 times": {
    description: translate("chore.dig.25.times"),
    icon: SUNNYSIDE.soil.sand_dug,
  },
  "Dig 35 times": {
    description: translate("chore.dig.35.times"),
    icon: SUNNYSIDE.soil.sand_dug,
  },
  "Dig 50 times": {
    description: translate("chore.dig.50.times"),
    icon: SUNNYSIDE.soil.sand_dug,
  },
  "Drink 10 Orange Juice": {
    description: translate("chore.drink.10.orange.juice"),
    icon: ITEM_DETAILS["Orange Juice"].image,
  },
  "Drink 20 Orange Juice": {
    description: translate("chore.drink.20.orange.juice"),
    icon: ITEM_DETAILS["Orange Juice"].image,
  },
  "Drink 30 Orange Juice": {
    description: translate("chore.drink.30.orange.juice"),
    icon: ITEM_DETAILS["Orange Juice"].image,
  },
  "Eat 5 Orange Cake": {
    description: translate("chore.eat.5.orange.cake"),
    icon: ITEM_DETAILS["Orange Cake"].image,
  },
  "Eat 6 Orange Cake": {
    description: translate("chore.eat.6.orange.cake"),
    icon: ITEM_DETAILS["Orange Cake"].image,
  },
  "Eat 7 Orange Cake": {
    description: translate("chore.eat.7.orange.cake"),
    icon: ITEM_DETAILS["Orange Cake"].image,
  },
  "Grow Red Balloon Flower 3 times": {
    description: translate("chore.grow.3.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow Red Balloon Flower 4 times": {
    description: translate("chore.grow.4.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow Red Balloon Flower 5 times": {
    description: translate("chore.grow.5.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow Blue Balloon Flower 3 times": {
    description: translate("chore.grow.3.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow Blue Balloon Flower 4 times": {
    description: translate("chore.grow.4.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow Blue Balloon Flower 5 times": {
    description: translate("chore.grow.5.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow Purple Daffodil 3 times": {
    description: translate("chore.grow.3.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow Purple Daffodil 4 times": {
    description: translate("chore.grow.4.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow Purple Daffodil 5 times": {
    description: translate("chore.grow.5.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow Red Daffodil 2 times": {
    description: translate("chore.grow.2.red.daffodil"),
    icon: ITEM_DETAILS["Red Daffodil"].image,
  },
  "Grow Red Daffodil 3 times": {
    description: translate("chore.grow.3.red.daffodil"),
    icon: ITEM_DETAILS["Red Daffodil"].image,
  },
  "Cook 2 Roast Veggies": {
    description: translate("chore.cook.2.roast.veggies"),
    icon: ITEM_DETAILS["Roast Veggies"].image,
  },
  "Cook 3 Roast Veggies": {
    description: translate("chore.cook.3.roast.veggies"),
    icon: ITEM_DETAILS["Roast Veggies"].image,
  },
  "Cook 4 Roast Veggies": {
    description: translate("chore.cook.4.roast.veggies"),
    icon: ITEM_DETAILS["Roast Veggies"].image,
  },
  "Cook 2 Club Sandwich": {
    description: translate("chore.cook.2.club.sandwich"),
    icon: ITEM_DETAILS["Club Sandwich"].image,
  },
  "Cook 3 Club Sandwich": {
    description: translate("chore.cook.3.club.sandwich"),
    icon: ITEM_DETAILS["Club Sandwich"].image,
  },
  "Cook 4 Club Sandwich": {
    description: translate("chore.cook.4.club.sandwich"),
    icon: ITEM_DETAILS["Club Sandwich"].image,
  },
  "Cook 1 Bumpkin ganoush": {
    description: translate("chore.cook.1.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Cook 2 Bumpkin ganoush": {
    description: translate("chore.cook.2.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Craft 10 Axes": {
    description: translate("chore.craft.10.axes"),
    icon: ITEM_DETAILS.Axe.image,
  },
  "Craft 12 Axes": {
    description: translate("chore.craft.12.axes"),
    icon: ITEM_DETAILS.Axe.image,
  },
  "Craft 15 Axes": {
    description: translate("chore.craft.15.axes"),
    icon: ITEM_DETAILS.Axe.image,
  },
  "Craft 3 Pickaxes": {
    description: translate("chore.craft.3.pickaxes"),
    icon: ITEM_DETAILS.Pickaxe.image,
  },
  "Craft 4 Pickaxes": {
    description: translate("chore.craft.4.pickaxes"),
    icon: ITEM_DETAILS.Pickaxe.image,
  },
  "Craft 5 Pickaxes": {
    description: translate("chore.craft.5.pickaxes"),
    icon: ITEM_DETAILS.Pickaxe.image,
  },
  "Chop 3 Trees": {
    description: translate("chore.chop.3.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 4 Trees": {
    description: translate("chore.chop.4.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 5 Trees": {
    description: translate("chore.chop.5.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Mine 2 Stones": {
    description: translate("chore.mine.2.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 3 Stones": {
    description: translate("chore.mine.3.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 4 Stones": {
    description: translate("chore.mine.4.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Grow Yellow Carnation 3 times": {
    description: translate("chore.grow.3.yellow.carnation"),
    icon: ITEM_DETAILS["Yellow Carnation"].image,
  },
  "Grow Blue Carnation 3 times": {
    description: translate("chore.grow.3.blue.carnation"),
    icon: ITEM_DETAILS["Blue Carnation"].image,
  },
  "Grow White Carnation 3 times": {
    description: translate("chore.grow.3.white.carnation"),
    icon: ITEM_DETAILS["White Carnation"].image,
  },
  "Grow Red Lotus 3 times": {
    description: translate("chore.grow.3.red.lotus"),
    icon: ITEM_DETAILS["Red Lotus"].image,
  },
  "Grow Yellow Lotus 3 times": {
    description: translate("chore.grow.3.yellow.lotus"),
    icon: ITEM_DETAILS["Yellow Lotus"].image,
  },
  "Grow White Lotus 3 times": {
    description: translate("chore.grow.3.white.lotus"),
    icon: ITEM_DETAILS["White Lotus"].image,
  },
  "Grow Blue Pansy 3 times": {
    description: translate("chore.grow.3.blue.pansy"),
    icon: ITEM_DETAILS["Blue Pansy"].image,
  },
  "Grow White Pansy 3 times": {
    description: translate("chore.grow.3.white.pansy"),
    icon: ITEM_DETAILS["White Pansy"].image,
  },
  "Grow White Cosmos 3 times": {
    description: translate("chore.grow.3.white.cosmos"),
    icon: ITEM_DETAILS["White Cosmos"].image,
  },
  "Grow Purple Daffodil 6 times": {
    description: translate("chore.grow.6.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow Red Balloon Flower 6 times": {
    description: translate("chore.grow.6.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Collect Eggs 40 times": {
    description: translate("chore.collect.40.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect Eggs 60 times": {
    description: translate("chore.collect.60.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect Eggs 80 times": {
    description: translate("chore.collect.80.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Eat 5 Bumpkin ganoush": {
    description: translate("chore.eat.5.bumpkin.ganoush"),
    icon: ITEM_DETAILS["Bumpkin ganoush"].image,
  },
  "Eat 5 Cauliflower Burger": {
    description: translate("chore.eat.5.cauliflower.burger"),
    icon: ITEM_DETAILS["Cauliflower Burger"].image,
  },
  "Eat 4 Club Sandwich": {
    description: translate("chore.eat.4.club.sandwich"),
    icon: ITEM_DETAILS["Club Sandwich"].image,
  },
  "Eat 6 Cabbers n Mash": {
    description: translate("chore.eat.6.cabbers.n.mash"),
    icon: ITEM_DETAILS["Cabbers n Mash"].image,
  },
  "Eat 4 Goblin's Treat": {
    description: translate("chore.eat.4.goblins.treat"),
    icon: ITEM_DETAILS["Goblin's Treat"].image,
  },
  "Eat 3 Pancakes": {
    description: translate("chore.eat.3.pancakes"),
    icon: ITEM_DETAILS.Pancakes.image,
  },
  "Drink 15 Orange Juice": {
    description: translate("chore.drink.15.orange.juice"),
    icon: ITEM_DETAILS["Orange Juice"].image,
  },
  "Drink 15 Purple Smoothies": {
    description: translate("chore.drink.15.purple.smoothies"),
    icon: ITEM_DETAILS["Purple Smoothie"].image,
  },
  "Drink 10 Apple Juice": {
    description: translate("chore.drink.10.apple.juice"),
    icon: ITEM_DETAILS["Apple Juice"].image,
  },
  "Drink 5 Power Smoothie": {
    description: translate("chore.drink.5.power.smoothie"),
    icon: ITEM_DETAILS["Power Smoothie"].image,
  },
  "Cook 10 Kale Stew": {
    description: translate("chore.cook.10.kale.stew"),
    icon: ITEM_DETAILS["Kale Stew"].image,
  },
  "Cook 8 Kale Omelette": {
    description: translate("chore.cook.8.kale.omelette"),
    icon: ITEM_DETAILS["Kale Omelette"].image,
  },
  "Cook 3 Mushroom Soup": {
    description: translate("chore.cook.3.mushroom.soup"),
    icon: ITEM_DETAILS["Mushroom Soup"].image,
  },
  "Cook 20 Boiled Eggs": {
    description: translate("chore.cook.20.boiled.eggs"),
    icon: ITEM_DETAILS["Boiled Eggs"].image,
  },
  "Cook 2 Beetroot Blaze": {
    description: translate("chore.cook.2.beetroot.blaze"),
    icon: ITEM_DETAILS["Beetroot Blaze"].image,
  },
  "Cook 5 Sushi Roll": {
    description: translate("chore.cook.5.sushi.roll"),
    icon: ITEM_DETAILS["Sushi Roll"].image,
  },
  "Cook 5 Fish n Chips": {
    description: translate("chore.cook.5.fish.n.chips"),
    icon: ITEM_DETAILS["Fish n Chips"].image,
  },
  "Cook 10 Apple Pie": {
    description: translate("chore.cook.10.apple.pie"),
    icon: ITEM_DETAILS["Apple Pie"].image,
  },
  "Cook 10 Orange Cake": {
    description: translate("chore.cook.10.orange.cake"),
    icon: ITEM_DETAILS["Orange Cake"].image,
  },
  "Prepare 20 Bumpkin Detox": {
    description: translate("chore.prepare.20.bumpkin.detox"),
    icon: ITEM_DETAILS["Bumpkin Detox"].image,
  },
  "Prepare 25 Banana Blast": {
    description: translate("chore.prepare.25.banana.blast"),
    icon: ITEM_DETAILS["Banana Blast"].image,
  },
  "Prepare 25 Carrot Juice": {
    description: translate("chore.prepare.25.carrot.juice"),
    icon: ITEM_DETAILS["Carrot Juice"].image,
  },
  "Prepare 10 Grape Juice": {
    description: translate("chore.prepare.10.grape.juice"),
    icon: ITEM_DETAILS["Grape Juice"].image,
  },
  "Prepare 7 The Lot": {
    description: translate("chore.prepare.7.the.lot"),
    icon: ITEM_DETAILS["The Lot"].image,
  },
  "Cook 2 Mushroom Syrup": {
    description: translate("chore.cook.2.mushroom.syrup"),
    icon: ITEM_DETAILS["Shroom Syrup"].image,
  },
  "Cook 5 Ocean's Olive": {
    description: translate("chore.cook.5.oceans.olive"),
    icon: ITEM_DETAILS["Ocean's Olive"].image,
  },
  "Cook 2 Fish n Chips": {
    description: translate("chore.cook.2.fish.n.chips"),
    icon: ITEM_DETAILS["Fish n Chips"].image,
  },
  "Cook 10 Sushi Roll": {
    description: translate("chore.cook.10.sushi.roll"),
    icon: ITEM_DETAILS["Sushi Roll"].image,
  },
  "Cook 5 Bumpkin Roast": {
    description: translate("chore.cook.5.bumpkin.roast"),
    icon: ITEM_DETAILS["Bumpkin Roast"].image,
  },
  "Cook 5 Goblin Brunch": {
    description: translate("chore.cook.5.goblin.brunch"),
    icon: ITEM_DETAILS["Goblin Brunch"].image,
  },
  "Cook 7 Sunflower Cakes": {
    description: translate("chore.cook.7.sunflower.cakes"),
    icon: ITEM_DETAILS["Sunflower Cake"].image,
  },
  "Cook 6 Potato Cakes": {
    description: translate("chore.cook.6.potato.cakes"),
    icon: ITEM_DETAILS["Potato Cake"].image,
  },
  "Cook 6 Pumpkin Cakes": {
    description: translate("chore.cook.6.pumpkin.cakes"),
    icon: ITEM_DETAILS["Pumpkin Cake"].image,
  },
  "Cook 5 Carrot Cakes": {
    description: translate("chore.cook.5.carrot.cakes"),
    icon: ITEM_DETAILS["Carrot Cake"].image,
  },
  "Cook 4 Cabbage Cakes": {
    description: translate("chore.cook.4.cabbage.cakes"),
    icon: ITEM_DETAILS["Cabbage Cake"].image,
  },
  "Eat 5 Anchovies": {
    description: translate("chore.eat.5.anchovies"),
    icon: ITEM_DETAILS.Anchovy.image,
  },
  "Eat 10 Anchovies": {
    description: translate("chore.eat.10.anchovies"),
    icon: ITEM_DETAILS.Anchovy.image,
  },
  "Eat 15 Anchovies": {
    description: translate("chore.eat.15.anchovies"),
    icon: ITEM_DETAILS.Anchovy.image,
  },
  "Eat 3 Tunas": {
    description: translate("chore.eat.3.tunas"),
    icon: ITEM_DETAILS.Tuna.image,
  },
  "Eat 6 Tunas": {
    description: translate("chore.eat.6.tunas"),
    icon: ITEM_DETAILS.Tuna.image,
  },
  "Eat 10 Tunas": {
    description: translate("chore.eat.10.tunas"),
    icon: ITEM_DETAILS.Tuna.image,
  },
  "Cook 10 Antipasto": {
    description: translate("chore.cook.10.antipasto"),
    icon: ITEM_DETAILS.Antipasto.image,
  },
  "Cook 15 Antipasto": {
    description: translate("chore.cook.15.antipasto"),
    icon: ITEM_DETAILS.Antipasto.image,
  },
  "Cook 20 Antipasto": {
    description: translate("chore.cook.20.antipasto"),
    icon: ITEM_DETAILS.Antipasto.image,
  },
  "Cook 25 Fruit Salad": {
    description: translate("chore.cook.25.fruit.salad"),
    icon: ITEM_DETAILS["Fruit Salad"].image,
  },
  "Cook 35 Fruit Salad": {
    description: translate("chore.cook.35.fruit.salad"),
    icon: ITEM_DETAILS["Fruit Salad"].image,
  },
  "Cook 45 Fruit Salad": {
    description: translate("chore.cook.45.fruit.salad"),
    icon: ITEM_DETAILS["Fruit Salad"].image,
  },
  "Cook 12 Steamed Red Rice": {
    description: translate("chore.cook.12.steamed.red.rice"),
    icon: ITEM_DETAILS["Steamed Red Rice"].image,
  },
  "Chop 450 Trees": {
    description: translate("chore.chop.450.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 500 Trees": {
    description: translate("chore.chop.500.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Chop 600 Trees": {
    description: translate("chore.chop.600.trees"),
    icon: ITEM_DETAILS.Wood.image,
  },
  "Mine 200 Stones": {
    description: translate("chore.mine.200.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 250 Stones": {
    description: translate("chore.mine.250.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 300 Stones": {
    description: translate("chore.mine.300.stones"),
    icon: ITEM_DETAILS.Stone.image,
  },
  "Mine 80 Iron": {
    description: translate("chore.mine.80.iron"),
    icon: ITEM_DETAILS.Iron.image,
  },
  "Mine 90 Iron": {
    description: translate("chore.mine.90.iron"),
    icon: ITEM_DETAILS.Iron.image,
  },
  "Mine 100 Iron": {
    description: translate("chore.mine.100.iron"),
    icon: ITEM_DETAILS.Iron.image,
  },
  "Earn 2,500 Coins": {
    description: translate("chore.earn.2500.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Earn 3,500 Coins": {
    description: translate("chore.earn.3500.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Earn 5,000 Coins": {
    description: translate("chore.earn.5000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Harvest Soybean 15 times": {
    description: translate("chore.harvest.15.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest Soybean 30 times": {
    description: translate("chore.harvest.30.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest Soybean 50 times": {
    description: translate("chore.harvest.50.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest Beetroot 15 times": {
    description: translate("chore.harvest.15.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest Beetroot 25 times": {
    description: translate("chore.harvest.25.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest Beetroot 35 times": {
    description: translate("chore.harvest.35.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest Cauliflower 10 times": {
    description: translate("chore.harvest.10.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest Cauliflower 20 times": {
    description: translate("chore.harvest.20.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest Cauliflower 30 times": {
    description: translate("chore.harvest.30.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Collect Eggs 10 times": {
    description: translate("chore.collect.10.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect Eggs 15 times": {
    description: translate("chore.collect.15.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect Eggs 20 times": {
    description: translate("chore.collect.20.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Craft 50 Fishing Rod": {
    description: translate("chore.craft.50.fishing.rod"),
    icon: ITEM_DETAILS["Rod"].image,
  },
  "Cook 5 Gumbo": {
    description: translate("chore.cook.5.gumbo"),
    icon: ITEM_DETAILS.Gumbo.image,
  },
  "Cook 7 Gumbo": {
    description: translate("chore.cook.7.gumbo"),
    icon: ITEM_DETAILS.Gumbo.image,
  },
  "Cook 10 Gumbo": {
    description: translate("chore.cook.10.gumbo"),
    icon: ITEM_DETAILS.Gumbo.image,
  },
  "Eat 5 Chowder": {
    description: translate("chore.eat.5.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Eat 7 Chowder": {
    description: translate("chore.eat.7.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Eat 10 Chowder": {
    description: translate("chore.eat.10.chowder"),
    icon: ITEM_DETAILS.Chowder.image,
  },
  "Grow 2 Red Pansy": {
    description: translate("chore.grow.2.red.pansy"),
    icon: ITEM_DETAILS["Red Pansy"].image,
  },
  "Grow 3 Red Pansy": {
    description: translate("chore.grow.3.red.pansy"),
    icon: ITEM_DETAILS["Red Pansy"].image,
  },
  "Grow 2 Yellow Pansy": {
    description: translate("chore.grow.2.yellow.pansy"),
    icon: ITEM_DETAILS["Yellow Pansy"].image,
  },
  "Grow 3 Yellow Pansy": {
    description: translate("chore.grow.3.yellow.pansy"),
    icon: ITEM_DETAILS["Yellow Pansy"].image,
  },
  "Grow 2 Purple Cosmos": {
    description: translate("chore.grow.2.purple.cosmos"),
    icon: ITEM_DETAILS["Purple Cosmos"].image,
  },
  "Grow 3 Purple Cosmos": {
    description: translate("chore.grow.3.purple.cosmos"),
    icon: ITEM_DETAILS["Purple Cosmos"].image,
  },
  "Grow 2 Blue Cosmos": {
    description: translate("chore.grow.2.blue.cosmos"),
    icon: ITEM_DETAILS["Blue Cosmos"].image,
  },
  "Grow 3 Blue Cosmos": {
    description: translate("chore.grow.3.blue.cosmos"),
    icon: ITEM_DETAILS["Blue Cosmos"].image,
  },
  "Spend 1,000 Coins": {
    description: translate("chore.spend.1000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Spend 2,000 Coins": {
    description: translate("chore.spend.2000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Spend 3,000 Coins": {
    description: translate("chore.spend.3000.coins"),
    icon: SUNNYSIDE.ui.coins,
  },
  "Harvest Carrots 50 times": {
    description: translate("chore.harvest.50.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest Carrots 75 times": {
    description: translate("chore.harvest.75.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest Carrots 100 times": {
    description: translate("chore.harvest.100.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest Cabbage 25 times": {
    description: translate("chore.harvest.25.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Harvest Cabbage 50 times": {
    description: translate("chore.harvest.50.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Harvest Cabbage 75 times": {
    description: translate("chore.harvest.75.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Eat 15 Mashed Potatoes": {
    description: translate("chore.eat.15.mashed.potatoes"),
    icon: ITEM_DETAILS["Mashed Potato"].image,
  },
  "Eat 20 Mashed Potatoes": {
    description: translate("chore.eat.20.mashed.potatoes"),
    icon: ITEM_DETAILS["Mashed Potato"].image,
  },
  "Eat 25 Mashed Potatoes": {
    description: translate("chore.eat.25.mashed.potatoes"),
    icon: ITEM_DETAILS["Mashed Potato"].image,
  },
  "Eat 3 Boiled Eggs": {
    description: translate("chore.eat.3.boiled.eggs"),
    icon: ITEM_DETAILS["Boiled Eggs"].image,
  },
  "Eat 5 Boiled Eggs": {
    description: translate("chore.eat.5.boiled.eggs"),
    icon: ITEM_DETAILS["Boiled Eggs"].image,
  },
  "Eat 7 Boiled Eggs": {
    description: translate("chore.eat.7.boiled.eggs"),
    icon: ITEM_DETAILS["Boiled Eggs"].image,
  },
  "Pick Grapes 12 times": {
    description: translate("chore.pick.12.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Pick Grapes 16 times": {
    description: translate("chore.pick.16.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Pick Grapes 20 times": {
    description: translate("chore.pick.20.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Harvest Rice 8 times": {
    description: translate("chore.harvest.8.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest Rice 10 times": {
    description: translate("chore.harvest.10.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest Rice 12 times": {
    description: translate("chore.harvest.12.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest Olives 4 times": {
    description: translate("chore.harvest.4.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
  "Harvest Olives 6 times": {
    description: translate("chore.harvest.6.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
  "Harvest Olives 8 times": {
    description: translate("chore.harvest.8.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
  "Harvest 450 Parsnips": {
    description: translate("chore.harvest.450.parsnips"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest 500 Parsnips": {
    description: translate("chore.harvest.500.parsnips"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest 250 Eggplants": {
    description: translate("chore.harvest.250.eggplants"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest 300 Eggplants": {
    description: translate("chore.harvest.300.eggplants"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest 275 Corn": {
    description: translate("chore.harvest.275.corn"),
    icon: ITEM_DETAILS.Corn.image,
  },
  "Harvest 300 Corn": {
    description: translate("chore.harvest.300.corn"),
    icon: ITEM_DETAILS.Corn.image,
  },
  "Harvest 200 Radishes": {
    description: translate("chore.harvest.200.radishes"),
    icon: ITEM_DETAILS.Radish.image,
  },
  "Harvest 240 Radishes": {
    description: translate("chore.harvest.240.radishes"),
    icon: ITEM_DETAILS.Radish.image,
  },
  "Harvest 200 Wheat": {
    description: translate("chore.harvest.200.wheat"),
    icon: ITEM_DETAILS.Wheat.image,
  },
  "Harvest 240 Wheat": {
    description: translate("chore.harvest.240.wheat"),
    icon: ITEM_DETAILS.Wheat.image,
  },
  "Harvest 175 Kale": {
    description: translate("chore.harvest.175.kale"),
    icon: ITEM_DETAILS.Kale.image,
  },
  "Harvest 200 Kale": {
    description: translate("chore.harvest.200.kale"),
    icon: ITEM_DETAILS.Kale.image,
  },
  "Harvest 250 Beetroot": {
    description: translate("chore.harvest.250.beetroot"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest 300 Beetroot": {
    description: translate("chore.harvest.300.beetroot"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest 180 Cauliflower": {
    description: translate("chore.harvest.180.cauliflower"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest 200 Cauliflower": {
    description: translate("chore.harvest.200.cauliflower"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest 100 Parsnip": {
    description: translate("chore.harvest.100.parsnip"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest 150 Parsnip": {
    description: translate("chore.harvest.150.parsnip"),
    icon: ITEM_DETAILS.Parsnip.image,
  },
  "Harvest 80 Eggplant": {
    description: translate("chore.harvest.80.eggplant"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest 120 Eggplant": {
    description: translate("chore.harvest.120.eggplant"),
    icon: ITEM_DETAILS.Eggplant.image,
  },
  "Harvest 150 Sunflowers": {
    description: translate("chore.harvest.150.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest 200 Sunflowers": {
    description: translate("chore.harvest.200.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest 250 Sunflowers": {
    description: translate("chore.harvest.250.sunflowers"),
    icon: ITEM_DETAILS.Sunflower.image,
  },
  "Harvest 100 Potatoes": {
    description: translate("chore.harvest.100.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest 125 Potatoes": {
    description: translate("chore.harvest.125.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest 150 Potatoes": {
    description: translate("chore.harvest.150.potatoes"),
    icon: ITEM_DETAILS.Potato.image,
  },
  "Harvest 75 Pumpkins": {
    description: translate("chore.harvest.75.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Harvest 100 Pumpkins": {
    description: translate("chore.harvest.100.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Harvest 125 Pumpkins": {
    description: translate("chore.harvest.125.pumpkins"),
    icon: ITEM_DETAILS.Pumpkin.image,
  },
  "Grow 3 Red Balloon Flower": {
    description: translate("chore.grow.3.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow 4 Red Balloon Flower": {
    description: translate("chore.grow.4.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow 5 Red Balloon Flower": {
    description: translate("chore.grow.5.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Grow 3 Blue Balloon Flower": {
    description: translate("chore.grow.3.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow 4 Blue Balloon Flower": {
    description: translate("chore.grow.4.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow 5 Blue Balloon Flower": {
    description: translate("chore.grow.5.blue.balloon.flower"),
    icon: ITEM_DETAILS["Blue Balloon Flower"].image,
  },
  "Grow 3 Purple Daffodil": {
    description: translate("chore.grow.3.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow 4 Purple Daffodil": {
    description: translate("chore.grow.4.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow 5 Purple Daffodil": {
    description: translate("chore.grow.5.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow 2 Red Daffodil": {
    description: translate("chore.grow.2.red.daffodil"),
    icon: ITEM_DETAILS["Red Daffodil"].image,
  },
  "Grow 3 Red Daffodil": {
    description: translate("chore.grow.3.red.daffodil"),
    icon: ITEM_DETAILS["Red Daffodil"].image,
  },
  "Grow 3 Yellow Carnation": {
    description: translate("chore.grow.3.yellow.carnation"),
    icon: ITEM_DETAILS["Yellow Carnation"].image,
  },
  "Grow 3 Blue Carnation": {
    description: translate("chore.grow.3.blue.carnation"),
    icon: ITEM_DETAILS["Blue Carnation"].image,
  },
  "Grow 3 White Carnation": {
    description: translate("chore.grow.3.white.carnation"),
    icon: ITEM_DETAILS["White Carnation"].image,
  },
  "Grow 3 Red Lotus": {
    description: translate("chore.grow.3.red.lotus"),
    icon: ITEM_DETAILS["Red Lotus"].image,
  },
  "Grow 3 Yellow Lotus": {
    description: translate("chore.grow.3.yellow.lotus"),
    icon: ITEM_DETAILS["Yellow Lotus"].image,
  },
  "Grow 3 White Lotus": {
    description: translate("chore.grow.3.white.lotus"),
    icon: ITEM_DETAILS["White Lotus"].image,
  },
  "Grow 3 Blue Pansy": {
    description: translate("chore.grow.3.blue.pansy"),
    icon: ITEM_DETAILS["Blue Pansy"].image,
  },
  "Grow 3 White Pansy": {
    description: translate("chore.grow.3.white.pansy"),
    icon: ITEM_DETAILS["White Pansy"].image,
  },
  "Grow 3 White Cosmos": {
    description: translate("chore.grow.3.white.cosmos"),
    icon: ITEM_DETAILS["White Cosmos"].image,
  },
  "Grow 6 Purple Daffodil": {
    description: translate("chore.grow.6.purple.daffodil"),
    icon: ITEM_DETAILS["Purple Daffodil"].image,
  },
  "Grow 6 Red Balloon Flower": {
    description: translate("chore.grow.6.red.balloon.flower"),
    icon: ITEM_DETAILS["Red Balloon Flower"].image,
  },
  "Collect 40 Eggs": {
    description: translate("chore.collect.40.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect 60 Eggs": {
    description: translate("chore.collect.60.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect 80 Eggs": {
    description: translate("chore.collect.80.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Harvest 15 Soybeans": {
    description: translate("chore.harvest.15.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest 30 Soybeans": {
    description: translate("chore.harvest.30.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest 50 Soybeans": {
    description: translate("chore.harvest.50.soybeans"),
    icon: ITEM_DETAILS.Soybean.image,
  },
  "Harvest 15 Beetroots": {
    description: translate("chore.harvest.15.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest 25 Beetroots": {
    description: translate("chore.harvest.25.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest 35 Beetroots": {
    description: translate("chore.harvest.35.beetroots"),
    icon: ITEM_DETAILS.Beetroot.image,
  },
  "Harvest 10 Cauliflowers": {
    description: translate("chore.harvest.10.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest 20 Cauliflowers": {
    description: translate("chore.harvest.20.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Harvest 30 Cauliflowers": {
    description: translate("chore.harvest.30.cauliflowers"),
    icon: ITEM_DETAILS.Cauliflower.image,
  },
  "Collect 10 Eggs": {
    description: translate("chore.collect.10.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect 15 Eggs": {
    description: translate("chore.collect.15.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Collect 20 Eggs": {
    description: translate("chore.collect.20.eggs"),
    icon: ITEM_DETAILS.Egg.image,
  },
  "Harvest 50 Carrots": {
    description: translate("chore.harvest.50.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest 75 Carrots": {
    description: translate("chore.harvest.75.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest 100 Carrots": {
    description: translate("chore.harvest.100.carrots"),
    icon: ITEM_DETAILS.Carrot.image,
  },
  "Harvest 25 Cabbage": {
    description: translate("chore.harvest.25.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Harvest 50 Cabbage": {
    description: translate("chore.harvest.50.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Harvest 75 Cabbage": {
    description: translate("chore.harvest.75.cabbage"),
    icon: ITEM_DETAILS.Cabbage.image,
  },
  "Pick 12 Grapes": {
    description: translate("chore.pick.12.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Pick 16 Grapes": {
    description: translate("chore.pick.16.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Pick 20 Grapes": {
    description: translate("chore.pick.20.grapes"),
    icon: ITEM_DETAILS.Grape.image,
  },
  "Harvest 8 Rice": {
    description: translate("chore.harvest.8.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest 10 Rice": {
    description: translate("chore.harvest.10.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest 12 Rice": {
    description: translate("chore.harvest.12.rice"),
    icon: ITEM_DETAILS.Rice.image,
  },
  "Harvest 4 Olives": {
    description: translate("chore.harvest.4.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
  "Harvest 6 Olives": {
    description: translate("chore.harvest.6.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
  "Harvest 8 Olives": {
    description: translate("chore.harvest.8.olives"),
    icon: ITEM_DETAILS.Olive.image,
  },
};
