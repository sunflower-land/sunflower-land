import { InventoryItemName } from "./game";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import chefHat from "assets/icons/chef_hat.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";

export const COLLECTIBLE_BUFF_LABELS: Partial<
  Record<InventoryItemName, BuffLabel>
> = {
  Miffy: {
    shortDescription: translate("miffy.boost"),
    labelType: "info",
    boostedItemIcon: powerup,
  },
  // Crop Boosts
  "Basic Scarecrow": {
    shortDescription: translate("description.basic.scarecrow.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Scary Mike": {
    shortDescription: translate("description.scary.mike.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Laurie the Chuckle Crow": {
    shortDescription: translate("description.laurie.chuckle.crow.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Nancy: {
    shortDescription: translate("description.nancy.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  Scarecrow: {
    shortDescription: translate("description.scarecrow.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  Kuebiko: {
    shortDescription: translate("description.kuebiko.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  Gnome: {
    shortDescription: translate("description.gnome.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Sir Goldensnout": {
    shortDescription: translate("description.sir.goldensnout.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Lunar Calendar": {
    shortDescription: translate("description.lunar.calendar.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Peeled Potato": {
    shortDescription: translate("description.peeled.potato.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Potato.crop,
  },
  "Victoria Sisters": {
    shortDescription: translate("description.victoria.sisters.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Freya Fox": {
    shortDescription: translate("description.freya.fox.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Easter Bunny": {
    shortDescription: translate("description.easter.bunny.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Pablo The Bunny": {
    shortDescription: translate("description.pablo.bunny.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Cabbage Boy": {
    shortDescription: translate("description.cabbage.boy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Cabbage Girl": {
    shortDescription: translate("description.cabbage.girl.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  Karkinos: {
    shortDescription: translate("description.Karkinos.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Golden Cauliflower": {
    shortDescription: translate("description.golden.cauliflower.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cauliflower.crop,
  },
  "Mysterious Parsnip": {
    shortDescription: translate("description.mysterious.parsnip.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Parsnip.crop,
  },
  "Purple Trail": {
    shortDescription: translate("description.purple.trail.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Obie: {
    shortDescription: translate("description.obie.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Maximus: {
    shortDescription: translate("description.maximus.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Poppy: {
    shortDescription: translate("description.poppy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Kernaldo: {
    shortDescription: translate("description.kernaldo.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Queen Cornelia": {
    shortDescription: translate("description.queen.cornelia.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Foliant: {
    shortDescription: translate("description.foliant.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Kale.crop,
  },
  Hoot: {
    shortDescription: translate("description.hoot.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Hungry Caterpillar": {
    shortDescription: translate("description.hungry.caterpillar.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },

  // Clash of Factions
  "Turbo Sprout": {
    shortDescription: translate("description.turbo.sprout.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },

  Soybliss: {
    shortDescription: translate("description.soybliss.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Soybean.crop,
  },

  "Grape Granny": {
    shortDescription: translate("description.grape.granny.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    // boostedItemIcon: CROP_LIFECYCLE.grape.crop,
  },
  Vinny: {
    shortDescription: translate("description.vinny.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    // boostedItemIcon: CROP_LIFECYCLE.grape.crop,
  },
  "Rice Panda": {
    shortDescription: translate("description.rice.panda.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    // boostedItemIcon: CROP_LIFECYCLE.grape.crop,
  },

  // Fruit Boosts
  "Immortal Pear": {
    shortDescription: translate("description.immortal.pear.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Black Bearry": {
    shortDescription: translate("description.black.bearry.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Blueberry.image,
  },
  "Squirrel Monkey": {
    shortDescription: translate("description.squirrel.monkey.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Orange.image,
  },
  "Lady Bug": {
    shortDescription: translate("description.lady.bug.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Apple.image,
  },
  "Banana Chicken": {
    shortDescription: translate("description.banana.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Banana.image,
  },
  Nana: {
    shortDescription: translate("description.nana.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Banana.image,
  },

  // Mutant Crops
  "Carrot Sword": {
    shortDescription: translate("description.carrot.sword.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Stellar Sunflower": {
    shortDescription: translate("description.stellar.sunflower.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: CROP_LIFECYCLE.Sunflower.crop,
  },
  "Potent Potato": {
    shortDescription: translate("description.potent.potato.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: CROP_LIFECYCLE.Potato.crop,
  },
  "Radical Radish": {
    shortDescription: translate("description.radical.radish.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },
  "Lab Grown Pumpkin": {
    shortDescription: translate("description.lg.pumpkin.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Lab Grown Carrot": {
    shortDescription: translate("description.lg.carrot.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Lab Grown Radish": {
    shortDescription: translate("description.lg.radish.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },

  // Animals
  "Fat Chicken": {
    shortDescription: translate("description.fat.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
  },
  "Rich Chicken": {
    shortDescription: translate("description.rich.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Speed Chicken": {
    shortDescription: translate("description.speed.chicken.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Ayam Cemani": {
    shortDescription: translate("description.ayam.cemani.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "El Pollo Veloz": {
    shortDescription: translate("description.el.pollo.veloz.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  Rooster: {
    shortDescription: translate("description.rooster.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Undead Rooster": {
    shortDescription: translate("description.undead.rooster.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Chicken Coop": {
    shortDescription: translate("description.chicken.coop.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Farm Dog": {
    shortDescription: translate("description.farm.dog.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
  },
  "Gold Egg": {
    shortDescription: translate("description.gold.egg.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
  },
  Bale: {
    shortDescription: translate("description.bale.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },

  // Resources
  "Woody the Beaver": {
    shortDescription: translate("description.woody.beaver.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Apprentice Beaver": {
    shortDescription: translate("description.apprentice.beaver.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Foreman Beaver": {
    shortDescription: translate("description.foreman.beaver.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Wood Nymph Wendy": {
    shortDescription: translate("description.wood.nymph.wendy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tiki Totem": {
    shortDescription: translate("description.tiki.totem.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tunnel Mole": {
    shortDescription: translate("description.tunnel.mole.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Rocky the Mole": {
    shortDescription: translate("description.rocky.mole.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  Nugget: {
    shortDescription: translate("description.nugget.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Gold.image,
  },
  "Rock Golem": {
    shortDescription: translate("description.rock.golem.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Iron Idol": {
    shortDescription: translate("description.iron.idol.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  "Tin Turtle": {
    shortDescription: translate("description.tin.turtle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Emerald Turtle": {
    shortDescription: translate("description.emerald.turtle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Crimson Carp": {
    labelType: "success",
    shortDescription: translate("description.crimson.carp.boost"),
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Crimstone.image,
  },
  "Battle Fish": {
    labelType: "success",
    shortDescription: translate("description.battle.fish.boost"),
    boostTypeIcon: powerup,
    // boostedItemIcon: ITEM_DETAILS.Oil.image,
  },
  "Lemon Shark": {
    labelType: "success",
    shortDescription: translate("description.lemon.shark.boost"),
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Lemon.image,
  },
  "Longhorn Cowfish": {
    labelType: "success",
    shortDescription: translate("description.longhorn.cowfish.boost"),
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Milk.image,
  },
  "Crim Peckster": {
    shortDescription: translate("description.crim.peckster.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Crimstone.image,
  },
  "Knight Chicken": {
    shortDescription: translate("description.knight.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    // boostedItemIcon: ITEM_DETAILS.Oil.image,
  },
  "Mushroom House": {
    shortDescription: translate("description.mushroom.house.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
  },
  "Queen Bee": {
    shortDescription: translate("description.queen.bee.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS.Honey.image,
  },
  "Humming Bird": {
    shortDescription: translate("description.humming.bird.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
  },
  Beehive: {
    shortDescription: translate("description.beehive.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Pharaoh Chicken": {
    shortDescription: translate("description.pharaoh.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS["Sand Shovel"].image,
  },

  // Fish
  "Skill Shrimpy": {
    shortDescription: translate("description.skill.shrimpy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Walrus: {
    shortDescription: translate("description.walrus.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Alba: {
    shortDescription: translate("description.alba.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },

  // Other
  "Soil Krabby": {
    shortDescription: translate("description.soil.krabby.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Knowledge Crab": {
    shortDescription: translate("description.knowledge.crab.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
  },
  "Maneki Neko": {
    shortDescription: translate("description.maneki.neko.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Pumpkin Soup"].image,
  },
  "Treasure Map": {
    shortDescription: translate("description.treasure.map.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS["Pirate Bounty"].image,
  },
  "Heart of Davy Jones": {
    shortDescription: translate("description.heart.of.davy.jones.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
  },
  "Genie Lamp": {
    shortDescription: translate("description.genie.lamp.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Grain Grinder": {
    shortDescription: translate("description.grain.grinder.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Observatory: {
    shortDescription: translate("description.observatory.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Blossombeard: {
    labelType: "vibrant",
    shortDescription: translate("description.blossombeard.boost"),
    boostTypeIcon: lightning,
  },
  "Desert Gnome": {
    labelType: "vibrant",
    shortDescription: translate("description.desertgnome.boost"),
    boostTypeIcon: lightning,
  },
  "Christmas Tree": {
    shortDescription: translate("description.christmas.festive.tree.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Festive Tree": {
    shortDescription: translate("description.christmas.festive.tree.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Grinx's Hammer": {
    shortDescription: translate("description.grinxs.hammer.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.tools.hammer,
  },
  "Time Warp Totem": {
    shortDescription: translate("description.time.warp.totem.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },

  // Marine Marvels with Boosts
  "Radiant Ray": {
    shortDescription: translate("description.radiant.ray.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  "Gilded Swordfish": {
    shortDescription: translate("description.boost.gilded.swordfish"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Gold.image,
  },

  "Baby Panda": {
    shortDescription: translate("description.babyPanda.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },

  "Flower Fox": {
    shortDescription: translate("description.flower.fox.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS.Honey.image,
  },

  "Hungry Hare": {
    shortDescription: translate("description.hungryHare.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS["Fermented Carrots"].image,
  },

  // Faction Shop
  "Gourmet Hourglass": {
    shortDescription: translate("description.gourmet.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Harvest Hourglass": {
    shortDescription: translate("description.harvest.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Timber Hourglass": {
    shortDescription: translate("description.timber.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Ore Hourglass": {
    shortDescription: translate("description.ore.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Orchard Hourglass": {
    shortDescription: translate("description.orchard.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Fisher's Hourglass": {
    shortDescription: translate("description.fishers.hourglass.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Blossom Hourglass": {
    shortDescription: translate("description.blossom.hourglass.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Desert Rose": {
    shortDescription: translate("description.desert.rose.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.icons.plant,
  },
  Chicory: {
    shortDescription: translate("description.chicory.boost"),
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.icons.plant,
  },
  "Pharaoh Gnome": {
    shortDescription: translate("description.pharaoh.gnome.boost"),
    labelType: "success",
    boostedItemIcon: powerup,
  },
  "Lemon Tea Bath": {
    shortDescription: translate("description.lemon.tea.bath.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Lemon.image,
  },
  "Tomato Clown": {
    shortDescription: translate("description.tomato.clown.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Tomato.image,
  },
  Cannonball: {
    shortDescription: translate("description.cannonball.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Tomato.image,
  },
  "Tomato Bombard": {
    shortDescription: translate("description.tomato.bombard.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Tomato.image,
  },
  Camel: {
    shortDescription: translate("description.camel.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
  },
  "Reveling Lemon": {
    shortDescription: translate("description.reveling.lemon.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Lemon.image,
  },
  "Lemon Frog": {
    shortDescription: translate("description.lemon.frog.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Lemon.image,
  },
  "Stone Beetle": {
    shortDescription: translate("description.stone.beetle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Iron Beetle": {
    shortDescription: translate("description.iron.beetle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  "Gold Beetle": {
    shortDescription: translate("description.gold.beetle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Gold.image,
  },
  "Fairy Circle": {
    shortDescription: translate("description.fairy.circle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
  },
  Squirrel: {
    shortDescription: translate("description.squirrel.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  Butterfly: {
    shortDescription: translate("description.butterfly.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Macaw: {
    shortDescription: translate("description.macaw.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  // Bull Run
  "Sheaf of Plenty": {
    shortDescription: translate("description.sheafOfPlenty.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Barley.crop,
  },
  "Moo-ver": {
    shortDescription: translate("description.mooVer.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.leather,
  },
  "Swiss Whiskers": {
    shortDescription: translate("description.swissWhiskers.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: chefHat,
  },
  Cluckulator: {
    shortDescription: translate("description.cluckulator.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
  },
  "Alien Chicken": {
    shortDescription: translate("description.alien.chicken.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.feather,
  },
  "Toxic Tuft": {
    shortDescription: translate("description.toxic.tuft.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.merino_wool,
  },
  Mootant: {
    shortDescription: translate("description.mootant.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.leather,
  },
};
