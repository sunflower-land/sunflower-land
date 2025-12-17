import { GameState, InventoryItemName } from "./game";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import helpIcon from "assets/icons/help.webp";
import chefHat from "assets/icons/chef_hat.png";
import tradeIcon from "assets/icons/trade.png";
import bee from "assets/icons/bee.webp";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";
import { getChapterTicket, CHAPTERS, getCurrentChapter } from "./chapters";
import { CHAPTER_TICKET_BOOST_ITEMS } from "../events/landExpansion/completeNPCChore";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { isCollectible } from "../events/landExpansion/garbageSold";
import { getObjectEntries } from "../expansion/lib/utils";

export const COLLECTIBLE_BUFF_LABELS: Partial<
  Record<
    InventoryItemName,
    ({
      skills,
      collectibles,
    }: {
      skills: GameState["bumpkin"]["skills"];
      collectibles: GameState["collectibles"];
    }) => BuffLabel[]
  >
> = {
  // Crop Boosts
  "Basic Scarecrow": ({ skills }) => [
    {
      shortDescription: skills["Chonky Scarecrow"]
        ? translate("description.basic.scarecrow.boost.skill")
        : translate("description.basic.scarecrow.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: skills["Chonky Scarecrow"]
        ? translate("description.basic.scarecrow.boost.aoe.skill")
        : translate("description.basic.scarecrow.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Scary Mike": ({ skills }) => [
    {
      shortDescription: skills["Horror Mike"]
        ? translate("description.scary.mike.boost.skill")
        : translate("description.scary.mike.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: skills["Horror Mike"]
        ? translate("description.scary.mike.boost.aoe.skill")
        : translate("description.scary.mike.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Laurie the Chuckle Crow": ({ skills }) => [
    {
      shortDescription: skills["Laurie's Gains"]
        ? translate("description.laurie.chuckle.crow.boost.skill")
        : translate("description.laurie.chuckle.crow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: skills["Laurie's Gains"]
        ? translate("description.laurie.chuckle.crow.boost.aoe.skill")
        : translate("description.laurie.chuckle.crow.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  Nancy: () => [
    {
      shortDescription: translate("description.nancy.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.nancy.warning"),
      labelType: "danger",
    },
  ],
  Scarecrow: () => [
    {
      shortDescription: translate("description.nancy.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.scarecrow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.scarecrow.warning"),
      labelType: "danger",
    },
  ],
  Kuebiko: () => [
    {
      shortDescription: translate("description.nancy.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.scarecrow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.kuebiko.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  Gnome: () => [
    {
      shortDescription: translate("description.gnome.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.gnome.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    {
      shortDescription: translate("description.gnome.warning"),
      labelType: "danger",
    },
  ],
  "Sir Goldensnout": () => [
    {
      shortDescription: translate("description.sir.goldensnout.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.sir.goldensnout.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Lunar Calendar": () => [
    {
      shortDescription: translate("description.lunar.calendar.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Peeled Potato": () => [
    {
      shortDescription: translate("description.peeled.potato.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Potato.crop,
    },
  ],
  "Victoria Sisters": () => [
    {
      shortDescription: translate("description.victoria.sisters.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Pumpkin.crop,
    },
  ],
  "Freya Fox": () => [
    {
      shortDescription: translate("description.freya.fox.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Pumpkin.crop,
    },
  ],
  "Easter Bunny": () => [
    {
      shortDescription: translate("description.easter.bunny.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Carrot.crop,
    },
  ],
  "Pablo The Bunny": () => [
    {
      shortDescription: translate("description.pablo.bunny.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Carrot.crop,
    },
  ],
  "Cabbage Boy": ({ collectibles }) => [
    {
      shortDescription: collectibles["Cabbage Girl"]
        ? translate("description.cabbage.boy.boost.boosted")
        : translate("description.cabbage.boy.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Cabbage.crop,
    },
  ],
  "Cabbage Girl": () => [
    {
      shortDescription: translate("description.cabbage.girl.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Cabbage.crop,
    },
  ],
  Karkinos: ({ collectibles }) => [
    ...(collectibles["Cabbage Boy"]
      ? []
      : ([
          {
            shortDescription: translate("description.Karkinos.boost"),
            labelType: "success",
            boostTypeIcon: powerup,
            boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Cabbage.crop,
          },
          {
            shortDescription: translate("description.Karkinos.warning"),
            labelType: "danger",
          },
        ] as BuffLabel[])),
  ],
  "Golden Cauliflower": () => [
    {
      shortDescription: translate("description.golden.cauliflower.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Cauliflower.crop,
    },
  ],
  "Mysterious Parsnip": () => [
    {
      shortDescription: translate("description.mysterious.parsnip.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Parsnip.crop,
    },
  ],
  "Purple Trail": () => [
    {
      shortDescription: translate("description.purple.trail.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Eggplant.crop,
    },
  ],
  Obie: () => [
    {
      shortDescription: translate("description.obie.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Eggplant.crop,
    },
  ],
  Maximus: () => [
    {
      shortDescription: translate("description.maximus.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Eggplant.crop,
    },
  ],
  Poppy: () => [
    {
      shortDescription: translate("description.poppy.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Corn.crop,
    },
  ],
  Kernaldo: () => [
    {
      shortDescription: translate("description.kernaldo.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Corn.crop,
    },
  ],
  "Queen Cornelia": () => [
    {
      shortDescription: translate("description.queen.cornelia.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Corn.crop,
    },
    {
      shortDescription: translate("description.queen.cornelia.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  Foliant: () => [
    {
      shortDescription: translate("description.foliant.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Kale.crop,
    },
  ],
  Hoot: () => [
    {
      shortDescription: translate("description.hoot.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Hungry Caterpillar": () => [
    {
      shortDescription: translate("description.hungry.caterpillar.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],

  // Clash of Factions
  "Turbo Sprout": () => [
    {
      shortDescription: translate("description.turbo.sprout.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],

  Soybliss: () => [
    {
      shortDescription: translate("description.soybliss.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Soybean.crop,
    },
  ],

  "Grape Granny": () => [
    {
      shortDescription: translate("description.grape.granny.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Grape.image,
    },
  ],
  Vinny: () => [
    {
      shortDescription: translate("description.vinny.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Grape.image,
    },
  ],
  "Rice Panda": () => [
    {
      shortDescription: translate("description.rice.panda.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Rice.image,
    },
  ],

  // Fruit Boosts
  "Immortal Pear": ({ skills }) => [
    {
      shortDescription: skills["Pear Turbocharge"]
        ? translate("description.immortal.pear.boosted.boost")
        : translate("description.immortal.pear.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Black Bearry": () => [
    {
      shortDescription: translate("description.black.bearry.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Blueberry.image,
    },
  ],
  "Squirrel Monkey": () => [
    {
      shortDescription: translate("description.squirrel.monkey.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Orange.image,
    },
  ],
  "Lady Bug": () => [
    {
      shortDescription: translate("description.lady.bug.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Apple.image,
    },
  ],
  "Banana Chicken": () => [
    {
      shortDescription: translate("description.banana.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
  ],
  Nana: () => [
    {
      shortDescription: translate("description.nana.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
  ],

  // Mutant Crops
  "Carrot Sword": () => [
    {
      shortDescription: translate("description.carrot.sword.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Stellar Sunflower": () => [
    {
      shortDescription: translate("description.stellar.sunflower.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Sunflower.crop,
    },
  ],
  "Potent Potato": () => [
    {
      shortDescription: translate("description.potent.potato.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Potato.crop,
    },
  ],
  "Radical Radish": () => [
    {
      shortDescription: translate("description.radical.radish.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Radish.crop,
    },
  ],
  "Lab Grown Pumpkin": () => [
    {
      shortDescription: translate("description.lg.pumpkin.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Pumpkin.crop,
    },
  ],
  "Lab Grown Carrot": () => [
    {
      shortDescription: translate("description.lg.carrot.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Carrot.crop,
    },
  ],
  "Lab Grown Radish": () => [
    {
      shortDescription: translate("description.lg.radish.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Radish.crop,
    },
  ],

  // Animals
  "Fat Chicken": () => [
    {
      shortDescription: translate("description.fat.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Rich Chicken": () => [
    {
      shortDescription: translate("description.rich.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
  ],
  "Speed Chicken": () => [
    {
      shortDescription: translate("description.speed.chicken.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
  ],
  "Ayam Cemani": () => [
    {
      shortDescription: translate("description.ayam.cemani.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
  ],
  "El Pollo Veloz": () => [
    {
      shortDescription: translate("description.el.pollo.veloz.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
  ],
  Rooster: () => [
    {
      shortDescription: translate("description.rooster.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Undead Rooster": () => [
    {
      shortDescription: translate("description.undead.rooster.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
  ],
  "Chicken Coop": () => [
    {
      shortDescription: translate("description.chicken.coop.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
    {
      shortDescription: translate("description.chicken.coop.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.chicken.coop.boost.three"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Farm Dog": () => [
    {
      shortDescription: translate("description.farm.dog.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
    },
  ],
  "Gold Egg": () => [
    {
      shortDescription: translate("description.gold.egg.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  Bale: ({ skills }) => [
    {
      shortDescription: skills["Double Bale"]
        ? translate("description.bale.eggBoost.boosted")
        : translate("description.bale.eggBoost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.egg,
    },
    ...(skills["Bale Economy"]
      ? ([
          {
            shortDescription: skills["Double Bale"]
              ? translate("description.bale.milkBoost.boosted")
              : translate("description.bale.milkBoost"),
            labelType: "success",
            boostTypeIcon: powerup,
            boostedItemIcon: SUNNYSIDE.resource.milk,
          },
          {
            shortDescription: skills["Double Bale"]
              ? translate("description.bale.woolBoost.boosted")
              : translate("description.bale.woolBoost"),
            labelType: "success",
            boostTypeIcon: powerup,
            boostedItemIcon: SUNNYSIDE.resource.wool,
          },
        ] as BuffLabel[])
      : []),
  ],

  // Resources
  "Woody the Beaver": () => [
    {
      shortDescription: translate("description.woody.beaver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
    {
      shortDescription: translate("description.woody.beaver.warning"),
      labelType: "danger",
    },
  ],
  "Apprentice Beaver": () => [
    {
      shortDescription: translate("description.woody.beaver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
    {
      shortDescription: translate("description.apprentice.beaver.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
    {
      shortDescription: translate("description.apprentice.beaver.warning"),
      labelType: "danger",
    },
  ],
  "Foreman Beaver": () => [
    {
      shortDescription: translate("description.woody.beaver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
    {
      shortDescription: translate("description.apprentice.beaver.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
    {
      shortDescription: translate("description.foreman.beaver.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
  ],
  "Wood Nymph Wendy": () => [
    {
      shortDescription: translate("description.wood.nymph.wendy.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
  ],
  "Tiki Totem": () => [
    {
      shortDescription: translate("description.tiki.totem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
  ],
  "Tunnel Mole": () => [
    {
      shortDescription: translate("description.tunnel.mole.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],
  "Rocky the Mole": () => [
    {
      shortDescription: translate("description.rocky.mole.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  Nugget: () => [
    {
      shortDescription: translate("description.nugget.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
  ],
  "Rock Golem": () => [
    {
      shortDescription: translate("description.rock.golem.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],
  "Iron Idol": () => [
    {
      shortDescription: translate("description.iron.idol.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  "Tin Turtle": () => [
    {
      shortDescription: translate("description.tin.turtle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
    {
      shortDescription: translate("description.turtle.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],
  "Emerald Turtle": () => [
    {
      shortDescription: translate("description.emerald.turtle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.turtle.boost.aoe"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],
  "Crimson Carp": () => [
    {
      labelType: "success",
      shortDescription: translate("description.crimson.carp.boost"),
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Battle Fish": () => [
    {
      labelType: "success",
      shortDescription: translate("description.battle.fish.boost"),
      boostTypeIcon: powerup,
    },
  ],
  "Lemon Shark": () => [
    {
      labelType: "success",
      shortDescription: translate("description.lemon.shark.boost"),
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Lemon.image,
    },
  ],
  "Longhorn Cowfish": () => [
    {
      labelType: "success",
      shortDescription: translate("description.longhorn.cowfish.boost"),
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Milk.image,
    },
  ],
  "Crim Peckster": () => [
    {
      shortDescription: translate("description.crim.peckster.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Knight Chicken": () => [
    {
      shortDescription: translate("description.knight.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Mushroom House": () => [
    {
      shortDescription: translate("description.mushroom.house.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    },
  ],
  "Queen Bee": () => [
    {
      shortDescription: translate("description.queen.bee.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],
  "Humming Bird": () => [
    {
      shortDescription: translate("description.humming.bird.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
  ],
  Beehive: () => [
    {
      shortDescription: translate("description.beehive.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Pharaoh Chicken": () => [
    {
      shortDescription: translate("description.pharaoh.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Sand Shovel"].image,
    },
  ],

  // Fish
  "Skill Shrimpy": () => [
    {
      shortDescription: translate("description.skill.shrimpy.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Walrus: () => [
    {
      shortDescription: translate("description.walrus.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  "Super Star": () => [
    {
      shortDescription: translate("description.super.star.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Alba: () => [
    {
      shortDescription: translate("description.alba.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],

  // Other
  "Soil Krabby": () => [
    {
      shortDescription: translate("description.soil.krabby.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Knowledge Crab": () => [
    {
      shortDescription: translate("description.knowledge.crab.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
    },
  ],
  "Maneki Neko": () => [
    {
      shortDescription: translate("description.maneki.neko.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Pumpkin Soup"].image,
    },
  ],
  "Treasure Map": () => [
    {
      shortDescription: translate("description.treasure.map.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Pirate Bounty"].image,
    },
  ],
  "Heart of Davy Jones": () => [
    {
      shortDescription: translate("description.heart.of.davy.jones.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
    },
  ],
  "Genie Lamp": () => [
    {
      shortDescription: translate("description.genie.lamp.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Grain Grinder": () => [
    {
      shortDescription: translate("description.grain.grinder.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  Observatory: () => [
    {
      shortDescription: translate("description.observatory.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  Blossombeard: () => [
    {
      labelType: "vibrant",
      shortDescription: translate("description.blossombeard.boost"),
      boostTypeIcon: lightning,
    },
  ],
  "Desert Gnome": () => [
    {
      labelType: "vibrant",
      shortDescription: translate("description.desertgnome.boost"),
      boostTypeIcon: lightning,
    },
  ],
  "Christmas Tree": () => [
    {
      shortDescription: translate("description.christmas.festive.tree.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Festive Tree": () => [
    {
      shortDescription: translate("description.christmas.festive.tree.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Grinx's Hammer": () => [
    {
      shortDescription: translate("description.grinxs.hammer.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.tools.hammer,
    },
  ],
  "Time Warp Totem": () => [
    {
      shortDescription: translate("description.time.warp.totem.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.time.warp.totem.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],

  // Marine Marvels with Boosts
  "Radiant Ray": () => [
    {
      shortDescription: translate("description.radiant.ray.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  "Gilded Swordfish": () => [
    {
      shortDescription: translate("description.boost.gilded.swordfish"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
  ],

  "Flower Fox": () => [
    {
      shortDescription: translate("description.flower.fox.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],

  "Hungry Hare": () => [
    {
      shortDescription: translate("description.hungryHare.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Fermented Carrots"].image,
    },
  ],

  // Faction Shop
  "Gourmet Hourglass": () => [
    {
      shortDescription: translate("description.gourmet.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.gourmet.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Harvest Hourglass": () => [
    {
      shortDescription: translate("description.harvest.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.harvest.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Timber Hourglass": () => [
    {
      shortDescription: translate("description.timber.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.timber.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Ore Hourglass": () => [
    {
      shortDescription: translate("description.ore.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.ore.hourglass.boost.effectTime"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Orchard Hourglass": () => [
    {
      shortDescription: translate("description.orchard.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.orchard.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Fisher's Hourglass": () => [
    {
      shortDescription: translate("description.fishers.hourglass.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate(
        "description.fishers.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Blossom Hourglass": () => [
    {
      shortDescription: translate("description.blossom.hourglass.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate(
        "description.blossom.hourglass.boost.effectTime",
      ),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Desert Rose": () => [
    {
      shortDescription: translate("description.desert.rose.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.plant,
    },
  ],
  Chicory: () => [
    {
      shortDescription: translate("description.chicory.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.plant,
    },
  ],
  "Pharaoh Gnome": () => [
    {
      shortDescription: translate("description.pharaoh.gnome.boost"),
      labelType: "success",
      boostedItemIcon: powerup,
    },
  ],
  "Lemon Tea Bath": () => [
    {
      shortDescription: translate("description.lemon.tea.bath.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Lemon.image,
    },
  ],
  "Tomato Clown": () => [
    {
      shortDescription: translate("description.tomato.clown.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Tomato.image,
    },
  ],
  Cannonball: () => [
    {
      shortDescription: translate("description.cannonball.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Tomato.image,
    },
  ],
  "Tomato Bombard": () => [
    {
      shortDescription: translate("description.tomato.bombard.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Tomato.image,
    },
  ],
  Camel: () => [
    {
      shortDescription: translate("description.camel.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sand.image,
    },
    {
      shortDescription: translate("description.camel.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.ui.coins,
    },
  ],
  "Reveling Lemon": () => [
    {
      shortDescription: translate("description.reveling.lemon.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Lemon.image,
    },
  ],
  "Lemon Frog": () => [
    {
      shortDescription: translate("description.lemon.frog.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Lemon.image,
    },
  ],
  "Stone Beetle": () => [
    {
      shortDescription: translate("description.stone.beetle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],
  "Iron Beetle": () => [
    {
      shortDescription: translate("description.iron.beetle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  "Gold Beetle": () => [
    {
      shortDescription: translate("description.gold.beetle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
  ],
  "Fairy Circle": () => [
    {
      shortDescription: translate("description.fairy.circle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    },
  ],
  Squirrel: () => [
    {
      shortDescription: translate("description.squirrel.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wood,
    },
  ],
  Butterfly: () => [
    {
      shortDescription: translate("description.butterfly.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  Macaw: ({ skills }) => [
    {
      shortDescription: skills["Loyal Macaw"]
        ? translate("description.macaw.boosted.boost")
        : translate("description.macaw.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  // Bull Run
  "Sheaf of Plenty": () => [
    {
      shortDescription: translate("description.sheafOfPlenty.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Barley.crop,
    },
  ],
  "Moo-ver": () => [
    {
      shortDescription: translate("description.mooVer.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.leather,
    },
  ],
  "Swiss Whiskers": () => [
    {
      shortDescription: translate("description.swissWhiskers.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: chefHat,
    },
  ],
  Cluckulator: () => [
    {
      shortDescription: translate("description.cluckulator.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Alien Chicken": () => [
    {
      shortDescription: translate("description.alien.chicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.feather,
    },
  ],
  "Toxic Tuft": () => [
    {
      shortDescription: translate("description.toxic.tuft.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.merino_wool,
    },
  ],
  "Astronaut Sheep": () => [
    {
      shortDescription: translate("description.astronautSheep.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wool,
    },
  ],
  Mootant: () => [
    {
      shortDescription: translate("description.mootant.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.leather,
    },
  ],
  "King of Bears": () => [
    {
      shortDescription: translate("description.kingOfBears.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],
  "Super Totem": () => [
    {
      shortDescription: translate("description.superTotem.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.superTotem.boost.effectTime"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Golden Cow": () => [
    {
      shortDescription: translate("description.golden.cow.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Volcano Gnome": () => [
    {
      shortDescription: translate("description.volcanoGnome.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.stone,
    },
  ],

  Mammoth: () => [
    {
      shortDescription: translate("description.mammoth.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.cowSleeping,
    },
  ],
  "Frozen Sheep": () => [
    {
      shortDescription: translate("description.frozen.sheep.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  Jellyfish: () => [
    {
      shortDescription: translate("description.jellyfish.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  "Frozen Cow": () => [
    {
      shortDescription: translate("description.frozen.cow.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Summer Chicken": () => [
    {
      shortDescription: translate("description.summer.chicken.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Sleepy Chicken": () => [
    {
      shortDescription: translate("description.sleepyChicken.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Golden Sheep": () => [
    {
      shortDescription: translate("description.goldenSheep.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Barn Blueprint": () => [
    {
      shortDescription: translate("description.barnBlueprint.boost1"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.barnBlueprint.boost2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Giant Yam": () => [
    {
      shortDescription: translate("description.giantYam.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Yam.image,
    },
  ],
  "Giant Zucchini": () => [
    {
      shortDescription: translate("description.giantZucchini.boost"),
      labelType: "success",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Zucchini.image,
    },
  ],
  "Giant Kale": () => [
    {
      shortDescription: translate("description.giantKale.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Kale.image,
    },
  ],
  "Obsidian Turtle": () => [
    {
      shortDescription: translate("description.obsidianTurtle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Obsidian Turtle"].image,
    },
  ],
  Quarry: () => [
    {
      shortDescription: translate("description.quarry.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Stone"].image,
    },
  ],
  "Winter Guardian": () => [
    {
      shortDescription: translate("description.winterGuardian.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    {
      shortDescription: translate("description.winterGuardian.boost2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Autumn Guardian": () => [
    {
      shortDescription: translate("description.autumnGuardian.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    {
      shortDescription: translate("description.autumnGuardian.boost2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Spring Guardian": () => [
    {
      shortDescription: translate("description.springGuardian.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    {
      shortDescription: translate("description.springGuardian.boost2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Summer Guardian": () => [
    {
      shortDescription: translate("description.summerGuardian.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    {
      shortDescription: translate("description.summerGuardian.boost2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],

  "Nurse Sheep": () => [
    {
      shortDescription: translate("description.nurseSheep.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
    },
  ],
  "Dr Cow": () => [
    {
      shortDescription: translate("description.drCow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animals.cowSleeping,
    },
  ],
  "Pink Dolphin": () => [
    {
      shortDescription: translate("description.pinkDolphin.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Poseidon: () => [
    {
      shortDescription: translate("description.poseidon.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Toolshed: () => [
    {
      shortDescription: translate("description.toolshed.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  Warehouse: () => [
    {
      shortDescription: translate("description.warehouse.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Groovy Gramophone": () => [
    {
      shortDescription: translate("description.groovy.gramophone.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crop Machine"].image,
    },
  ],
  "Giant Onion": () => [
    {
      shortDescription: translate("description.giantOnion.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Onion"].image,
    },
  ],
  "Giant Turnip": () => [
    {
      shortDescription: translate("description.giantTurnip.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Turnip"].image,
    },
  ],
  "Baby Cow": () => [
    {
      shortDescription: translate("description.babyCow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animals.cowSleeping,
    },
  ],
  "Janitor Chicken": () => [
    {
      shortDescription: translate("description.janitorChicken.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.animals.chickenAsleep,
    },
  ],
  "Reelmaster's Chair": () => [
    {
      shortDescription: translate("description.reelmastersChair.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Rod"].image,
    },
  ],
  "Fruit Tune Box": () => [
    {
      shortDescription: translate("description.fruitTuneBox.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Fruit Patch"].image,
    },
  ],
  "Double Bed": () => [
    {
      shortDescription: translate("description.doubleBed.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Giant Artichoke": () => [
    {
      shortDescription: translate("description.giantArtichoke.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Artichoke"].image,
    },
  ],
  "Farmer's Monument": () => [
    {
      shortDescription: translate("description.monument.buff"),
      labelType: "success",
      boostTypeIcon: helpIcon,
    },
  ],
  "Woodcutter's Monument": () => [
    {
      shortDescription: translate("description.monument.buff"),
      labelType: "success",
      boostTypeIcon: helpIcon,
    },
  ],
  "Miner's Monument": () => [
    {
      shortDescription: translate("description.monument.buff"),
      labelType: "success",
      boostTypeIcon: helpIcon,
    },
  ],
  "Teamwork Monument": () => [
    {
      shortDescription: translate("description.monument.buff"),
      labelType: "success",
      boostTypeIcon: helpIcon,
    },
  ],
  "Fox Shrine": () => [
    {
      shortDescription: translate("description.foxShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crafting Box"].image,
    },
    {
      shortDescription: translate("description.foxShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crafting Box"].image,
    },
  ],
  "Boar Shrine": () => [
    {
      shortDescription: translate("description.boarShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Hound Shrine": () => [
    {
      shortDescription: translate("description.houndShrine.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Pet Bowls": () => [
    {
      shortDescription: translate("description.petBowls.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Stag Shrine": () => [
    {
      shortDescription: translate("description.stagShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
    {
      shortDescription: translate("description.stagShrine.buff.2"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
  ],
  "Sparrow Shrine": () => [
    {
      shortDescription: translate("description.sparrowShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Toucan Shrine": () => [
    {
      shortDescription: translate("description.toucanShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Collie Shrine": () => [
    {
      shortDescription: translate("description.collieShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.cowSleeping,
    },
    {
      shortDescription: translate("description.collieShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
    },
    {
      shortDescription: translate("description.collieShrine.buff.3"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Badger Shrine": () => [
    {
      shortDescription: translate("description.badgerShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Tree.image,
    },
    {
      shortDescription: translate("description.badgerShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
    },
  ],
  "Legendary Shrine": () => [
    {
      shortDescription: translate("description.legendaryShrine.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    {
      shortDescription: translate("description.legendaryShrine.buff.2"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Fruit Patch"].image,
    },
    {
      shortDescription: translate("description.legendaryShrine.buff.3"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
    {
      shortDescription: translate("description.legendaryShrine.buff.4"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
    },
    {
      shortDescription: translate("description.legendaryShrine.buff.5"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
    {
      shortDescription: translate("description.legendaryShrine.buff.6"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Obsidian Shrine": () => [
    {
      shortDescription: translate("description.obsidianShrine.buff"),
      labelType: "vibrant",
      boostTypeIcon: SUNNYSIDE.icons.lightning,
    },
  ],
  "Mole Shrine": () => [
    {
      shortDescription: translate("description.moleShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
    {
      shortDescription: translate("description.moleShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
    {
      shortDescription: translate("description.moleShrine.buff.3"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Bear Shrine": () => [
    {
      shortDescription: translate("description.bearShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
    {
      shortDescription: translate("description.bearShrine.buff.2"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: bee,
    },
  ],
  "Tortoise Shrine": () => [
    {
      shortDescription: translate("description.tortoiseShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Greenhouse"].image,
    },
    {
      shortDescription: translate("description.tortoiseShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crop Machine"].image,
    },
  ],
  "Moth Shrine": () => [
    {
      shortDescription: translate("description.mothShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
    {
      shortDescription: translate("description.mothShrine.buff.2"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
  ],
  "Bantam Shrine": () => [
    {
      shortDescription: translate("description.bantamShrine.buff"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.chickenAsleep,
    },
    {
      shortDescription: translate("description.bantamShrine.buff.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Trading Shrine": () => [
    {
      shortDescription: translate("description.tradingShrine.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: tradeIcon,
    },
  ],
  "Ancient Tree": () => [
    {
      shortDescription: translate("description.ancientTree.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Sacred Tree": () => [
    {
      shortDescription: translate("description.sacredTree.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Fused Stone Rock": () => [
    {
      shortDescription: translate("description.fusedStoneRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
    },
  ],
  "Reinforced Stone Rock": () => [
    {
      shortDescription: translate("description.reinforcedStoneRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
    },
  ],
  "Refined Iron Rock": () => [
    {
      shortDescription: translate("description.refinedIronRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  "Tempered Iron Rock": () => [
    {
      shortDescription: translate("description.temperedIronRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    },
  ],
  "Pure Gold Rock": () => [
    {
      shortDescription: translate("description.pureGoldRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
  ],
  "Prime Gold Rock": () => [
    {
      shortDescription: translate("description.primeGoldRock.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    },
  ],
  "Giant Gold Bone": () => [
    {
      shortDescription: translate("description.giantGoldBone.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Cheer.image,
    },
  ],
  "Lunar Temple": () => [
    {
      shortDescription: translate("description.lunarTemple.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Messy Bed": () => [
    {
      shortDescription: translate("description.messyBed.buff"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Magma Stone": () => [
    {
      shortDescription: translate("description.magmaStone.buff.one"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Lava Pit"].image,
    },
    {
      shortDescription: translate("description.magmaStone.buff.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Obsidian"].image,
    },
  ],
  Cornucopia: () => [
    {
      shortDescription: translate("description.cornucopia.buff"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],

  ...Object.fromEntries(
    getObjectEntries(CHAPTER_TICKET_BOOST_ITEMS)
      .filter(([chapter]) => getCurrentChapter(Date.now()) === chapter)
      .flatMap(([chapter, items]) => {
        const ticket = getChapterTicket(CHAPTERS[chapter].startDate.getTime());
        const translationKey =
          `description.bonus${ticket.replace(/\s+/g, "")}.boost` as TranslationKeys;

        return Object.values(items)
          .filter(isCollectible)
          .map((item) => [
            item,
            [
              {
                shortDescription: translate(translationKey),
                labelType: "success",
                boostTypeIcon: powerup,
                boostedItemIcon: ITEM_DETAILS[ticket].image,
              },
            ],
          ]);
      }),
  ),
};
