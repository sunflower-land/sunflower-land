import { GameState, InventoryItemName } from "./game";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import chefHat from "assets/icons/chef_hat.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";
import memoize from "lodash.memoize";
import { hasSeasonEnded } from "./seasons";

export const COLLECTIBLE_BUFF_LABELS = memoize(getCollectibleBuffLabels);

function getCollectibleBuffLabels(
  state: GameState,
): Partial<Record<InventoryItemName, BuffLabel[]>> {
  // Delete the cache if this function is invoked.
  COLLECTIBLE_BUFF_LABELS.cache.clear?.();

  return {
    // Crop Boosts
    "Basic Scarecrow": [
      {
        shortDescription: state.bumpkin.skills["Chonky Scarecrow"]
          ? translate("description.basic.scarecrow.boost.skill")
          : translate("description.basic.scarecrow.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
      {
        shortDescription: state.bumpkin.skills["Chonky Scarecrow"]
          ? translate("description.basic.scarecrow.boost.aoe.skill")
          : translate("description.basic.scarecrow.boost.aoe"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Scary Mike": [
      {
        shortDescription: state.bumpkin.skills["Horror Mike"]
          ? translate("description.scary.mike.boost.skill")
          : translate("description.scary.mike.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      {
        shortDescription: state.bumpkin.skills["Horror Mike"]
          ? translate("description.scary.mike.boost.aoe.skill")
          : translate("description.scary.mike.boost.aoe"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Laurie the Chuckle Crow": [
      {
        shortDescription: state.bumpkin.skills["Laurie's Gains"]
          ? translate("description.laurie.chuckle.crow.boost.skill")
          : translate("description.laurie.chuckle.crow.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      {
        shortDescription: state.bumpkin.skills["Laurie's Gains"]
          ? translate("description.laurie.chuckle.crow.boost.aoe.skill")
          : translate("description.laurie.chuckle.crow.boost.aoe"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    Nancy: [
      {
        shortDescription: translate("description.nancy.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
    Scarecrow: [
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
    ],
    Kuebiko: [
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
    Gnome: [
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
    ],
    "Sir Goldensnout": [
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
    "Lunar Calendar": [
      {
        shortDescription: translate("description.lunar.calendar.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
    "Peeled Potato": [
      {
        shortDescription: translate("description.peeled.potato.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Potato.crop,
      },
    ],
    "Victoria Sisters": [
      {
        shortDescription: translate("description.victoria.sisters.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Pumpkin.crop,
      },
    ],
    "Freya Fox": [
      {
        shortDescription: translate("description.freya.fox.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Pumpkin.crop,
      },
    ],
    "Easter Bunny": [
      {
        shortDescription: translate("description.easter.bunny.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Carrot.crop,
      },
    ],
    "Pablo The Bunny": [
      {
        shortDescription: translate("description.pablo.bunny.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Carrot.crop,
      },
    ],
    "Cabbage Boy": [
      {
        shortDescription: state.collectibles["Cabbage Girl"]
          ? translate("description.cabbage.boy.boost.boosted")
          : translate("description.cabbage.boy.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Cabbage.crop,
      },
    ],
    "Cabbage Girl": [
      {
        shortDescription: translate("description.cabbage.girl.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: CROP_LIFECYCLE.basic.Cabbage.crop,
      },
    ],
    Karkinos: [
      ...(state.collectibles["Cabbage Boy"]
        ? []
        : ([
            {
              shortDescription: translate("description.Karkinos.boost"),
              labelType: "success",
              boostTypeIcon: powerup,
              boostedItemIcon: CROP_LIFECYCLE.basic.Cabbage.crop,
            },
          ] as BuffLabel[])),
    ],
    "Golden Cauliflower": [
      {
        shortDescription: translate("description.golden.cauliflower.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Cauliflower.crop,
      },
    ],
    "Mysterious Parsnip": [
      {
        shortDescription: translate("description.mysterious.parsnip.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: CROP_LIFECYCLE.basic.Parsnip.crop,
      },
    ],
    "Purple Trail": [
      {
        shortDescription: translate("description.purple.trail.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Eggplant.crop,
      },
    ],
    Obie: [
      {
        shortDescription: translate("description.obie.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: CROP_LIFECYCLE.basic.Eggplant.crop,
      },
    ],
    Maximus: [
      {
        shortDescription: translate("description.maximus.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Eggplant.crop,
      },
    ],
    Poppy: [
      {
        shortDescription: translate("description.poppy.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Corn.crop,
      },
    ],
    Kernaldo: [
      {
        shortDescription: translate("description.kernaldo.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: CROP_LIFECYCLE.basic.Corn.crop,
      },
    ],
    "Queen Cornelia": [
      {
        shortDescription: translate("description.queen.cornelia.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Corn.crop,
      },
      {
        shortDescription: translate("description.queen.cornelia.boost.aoe"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    Foliant: [
      {
        shortDescription: translate("description.foliant.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Kale.crop,
      },
    ],
    Hoot: [
      {
        shortDescription: translate("description.hoot.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    "Hungry Caterpillar": [
      {
        shortDescription: translate("description.hungry.caterpillar.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],

    // Clash of Factions
    "Turbo Sprout": [
      {
        shortDescription: translate("description.turbo.sprout.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],

    Soybliss: [
      {
        shortDescription: translate("description.soybliss.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Soybean.crop,
      },
    ],

    "Grape Granny": [
      {
        shortDescription: translate("description.grape.granny.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Grape.image,
      },
    ],
    Vinny: [
      {
        shortDescription: translate("description.vinny.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Grape.image,
      },
    ],
    "Rice Panda": [
      {
        shortDescription: translate("description.rice.panda.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Rice.image,
      },
    ],

    // Fruit Boosts
    "Immortal Pear": [
      {
        shortDescription: state.bumpkin.skills["Pear Turbocharge"]
          ? translate("description.immortal.pear.boosted.boost")
          : translate("description.immortal.pear.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    "Black Bearry": [
      {
        shortDescription: translate("description.black.bearry.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Blueberry.image,
      },
    ],
    "Squirrel Monkey": [
      {
        shortDescription: translate("description.squirrel.monkey.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Orange.image,
      },
    ],
    "Lady Bug": [
      {
        shortDescription: translate("description.lady.bug.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Apple.image,
      },
    ],
    "Banana Chicken": [
      {
        shortDescription: translate("description.banana.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Banana.image,
      },
    ],
    Nana: [
      {
        shortDescription: translate("description.nana.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Banana.image,
      },
    ],

    // Mutant Crops
    "Carrot Sword": [
      {
        shortDescription: translate("description.carrot.sword.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Stellar Sunflower": [
      {
        shortDescription: translate("description.stellar.sunflower.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: CROP_LIFECYCLE.basic.Sunflower.crop,
      },
    ],
    "Potent Potato": [
      {
        shortDescription: translate("description.potent.potato.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: CROP_LIFECYCLE.basic.Potato.crop,
      },
    ],
    "Radical Radish": [
      {
        shortDescription: translate("description.radical.radish.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Radish.crop,
      },
    ],
    "Lab Grown Pumpkin": [
      {
        shortDescription: translate("description.lg.pumpkin.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Pumpkin.crop,
      },
    ],
    "Lab Grown Carrot": [
      {
        shortDescription: translate("description.lg.carrot.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Carrot.crop,
      },
    ],
    "Lab Grown Radish": [
      {
        shortDescription: translate("description.lg.radish.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Radish.crop,
      },
    ],

    // Animals
    "Fat Chicken": [
      {
        shortDescription: translate("description.fat.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
      },
    ],
    "Rich Chicken": [
      {
        shortDescription: translate("description.rich.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],
    "Speed Chicken": [
      {
        shortDescription: translate("description.speed.chicken.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],
    "Ayam Cemani": [
      {
        shortDescription: translate("description.ayam.cemani.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],
    "El Pollo Veloz": [
      {
        shortDescription: translate("description.el.pollo.veloz.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],
    Rooster: [
      {
        shortDescription: translate("description.rooster.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Undead Rooster": [
      {
        shortDescription: translate("description.undead.rooster.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],
    "Chicken Coop": [
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
    "Farm Dog": [
      {
        shortDescription: translate("description.farm.dog.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
      },
    ],
    "Gold Egg": [
      {
        shortDescription: translate("description.gold.egg.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
      },
    ],
    Bale: [
      {
        shortDescription: translate("description.bale.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    ],

    // Resources
    "Woody the Beaver": [
      {
        shortDescription: translate("description.woody.beaver.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    ],
    "Apprentice Beaver": [
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
    ],
    "Foreman Beaver": [
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
    "Wood Nymph Wendy": [
      {
        shortDescription: translate("description.wood.nymph.wendy.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    ],
    "Tiki Totem": [
      {
        shortDescription: translate("description.tiki.totem.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    ],
    "Tunnel Mole": [
      {
        shortDescription: translate("description.tunnel.mole.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.stone,
      },
    ],
    "Rocky the Mole": [
      {
        shortDescription: translate("description.rocky.mole.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    ],
    Nugget: [
      {
        shortDescription: translate("description.nugget.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    ],
    "Rock Golem": [
      {
        shortDescription: translate("description.rock.golem.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.resource.stone,
      },
    ],
    "Iron Idol": [
      {
        shortDescription: translate("description.iron.idol.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    ],
    "Tin Turtle": [
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
    "Emerald Turtle": [
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
    "Crimson Carp": [
      {
        labelType: "success",
        shortDescription: translate("description.crimson.carp.boost"),
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    ],
    "Battle Fish": [
      {
        labelType: "success",
        shortDescription: translate("description.battle.fish.boost"),
        boostTypeIcon: powerup,
      },
    ],
    "Lemon Shark": [
      {
        labelType: "success",
        shortDescription: translate("description.lemon.shark.boost"),
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Lemon.image,
      },
    ],
    "Longhorn Cowfish": [
      {
        labelType: "success",
        shortDescription: translate("description.longhorn.cowfish.boost"),
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Milk.image,
      },
    ],
    "Crim Peckster": [
      {
        shortDescription: translate("description.crim.peckster.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    ],
    "Knight Chicken": [
      {
        shortDescription: translate("description.knight.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    "Mushroom House": [
      {
        shortDescription: translate("description.mushroom.house.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
      },
    ],
    "Queen Bee": [
      {
        shortDescription: translate("description.queen.bee.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: ITEM_DETAILS.Honey.image,
      },
    ],
    "Humming Bird": [
      {
        shortDescription: translate("description.humming.bird.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    ],
    Beehive: [
      {
        shortDescription: translate("description.beehive.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Pharaoh Chicken": [
      {
        shortDescription: translate("description.pharaoh.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Sand Shovel"].image,
      },
    ],

    // Fish
    "Skill Shrimpy": [
      {
        shortDescription: translate("description.skill.shrimpy.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    ],
    Walrus: [
      {
        shortDescription: translate("description.walrus.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    ],
    Alba: [
      {
        shortDescription: translate("description.alba.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    ],

    // Other
    "Soil Krabby": [
      {
        shortDescription: translate("description.soil.krabby.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
    "Knowledge Crab": [
      {
        shortDescription: translate("description.knowledge.crab.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
      },
    ],
    "Maneki Neko": [
      {
        shortDescription: translate("description.maneki.neko.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: ITEM_DETAILS["Pumpkin Soup"].image,
      },
    ],
    "Treasure Map": [
      {
        shortDescription: translate("description.treasure.map.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Pirate Bounty"].image,
      },
    ],
    "Heart of Davy Jones": [
      {
        shortDescription: translate("description.heart.of.davy.jones.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
      },
    ],
    "Genie Lamp": [
      {
        shortDescription: translate("description.genie.lamp.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Grain Grinder": [
      {
        shortDescription: translate("description.grain.grinder.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    Observatory: [
      {
        shortDescription: translate("description.observatory.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    Blossombeard: [
      {
        labelType: "vibrant",
        shortDescription: translate("description.blossombeard.boost"),
        boostTypeIcon: lightning,
      },
    ],
    "Desert Gnome": [
      {
        labelType: "vibrant",
        shortDescription: translate("description.desertgnome.boost"),
        boostTypeIcon: lightning,
      },
    ],
    "Christmas Tree": [
      {
        shortDescription: translate("description.christmas.festive.tree.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Festive Tree": [
      {
        shortDescription: translate("description.christmas.festive.tree.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Grinx's Hammer": [
      {
        shortDescription: translate("description.grinxs.hammer.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.tools.hammer,
      },
    ],
    "Time Warp Totem": [
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
    "Radiant Ray": [
      {
        shortDescription: translate("description.radiant.ray.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    ],
    "Gilded Swordfish": [
      {
        shortDescription: translate("description.boost.gilded.swordfish"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    ],

    "Flower Fox": [
      {
        shortDescription: translate("description.flower.fox.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: ITEM_DETAILS.Honey.image,
      },
    ],

    "Hungry Hare": [
      {
        shortDescription: translate("description.hungryHare.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Fermented Carrots"].image,
      },
    ],

    // Faction Shop
    "Gourmet Hourglass": [
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
    "Harvest Hourglass": [
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
    "Timber Hourglass": [
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
    "Ore Hourglass": [
      {
        shortDescription: translate("description.ore.hourglass.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
      {
        shortDescription: translate(
          "description.ore.hourglass.boost.effectTime",
        ),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
    "Orchard Hourglass": [
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
    "Fisher's Hourglass": [
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
    "Blossom Hourglass": [
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
    "Desert Rose": [
      {
        shortDescription: translate("description.desert.rose.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.icons.plant,
      },
    ],
    Chicory: [
      {
        shortDescription: translate("description.chicory.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.icons.plant,
      },
    ],
    "Pharaoh Gnome": [
      {
        shortDescription: translate("description.pharaoh.gnome.boost"),
        labelType: "success",
        boostedItemIcon: powerup,
      },
    ],
    "Lemon Tea Bath": [
      {
        shortDescription: translate("description.lemon.tea.bath.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Lemon.image,
      },
    ],
    "Tomato Clown": [
      {
        shortDescription: translate("description.tomato.clown.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Tomato.image,
      },
    ],
    Cannonball: [
      {
        shortDescription: translate("description.cannonball.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Tomato.image,
      },
    ],
    "Tomato Bombard": [
      {
        shortDescription: translate("description.tomato.bombard.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Tomato.image,
      },
    ],
    Camel: [
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
    "Reveling Lemon": [
      {
        shortDescription: translate("description.reveling.lemon.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Lemon.image,
      },
    ],
    "Lemon Frog": [
      {
        shortDescription: translate("description.lemon.frog.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Lemon.image,
      },
    ],
    "Stone Beetle": [
      {
        shortDescription: translate("description.stone.beetle.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.stone,
      },
    ],
    "Iron Beetle": [
      {
        shortDescription: translate("description.iron.beetle.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    ],
    "Gold Beetle": [
      {
        shortDescription: translate("description.gold.beetle.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    ],
    "Fairy Circle": [
      {
        shortDescription: translate("description.fairy.circle.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
      },
    ],
    Squirrel: [
      {
        shortDescription: translate("description.squirrel.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    ],
    Butterfly: [
      {
        shortDescription: translate("description.butterfly.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    Macaw: [
      {
        shortDescription: state.bumpkin.skills["Loyal Macaw"]
          ? translate("description.macaw.boosted.boost")
          : translate("description.macaw.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    // Bull Run
    "Sheaf of Plenty": [
      {
        shortDescription: translate("description.sheafOfPlenty.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: CROP_LIFECYCLE.basic.Barley.crop,
      },
    ],
    "Moo-ver": [
      {
        shortDescription: translate("description.mooVer.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.leather,
      },
    ],
    "Swiss Whiskers": [
      {
        shortDescription: translate("description.swissWhiskers.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: chefHat,
      },
    ],
    Cluckulator: [
      {
        shortDescription: translate("description.cluckulator.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
      },
    ],
    "Alien Chicken": [
      {
        shortDescription: translate("description.alien.chicken.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.feather,
      },
    ],
    "Toxic Tuft": [
      {
        shortDescription: translate("description.toxic.tuft.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.merino_wool,
      },
    ],
    Mootant: [
      {
        shortDescription: translate("description.mootant.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.leather,
      },
    ],
    "King of Bears": [
      {
        shortDescription: translate("description.kingOfBears.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Honey.image,
      },
    ],
    "Super Totem": [
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
    "Golden Cow": [
      {
        shortDescription: translate("description.golden.cow.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
      },
    ],
    "Volcano Gnome": [
      {
        shortDescription: translate("description.volcanoGnome.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.stone,
      },
    ],
    Igloo: [
      ...(hasSeasonEnded("Winds of Change")
        ? []
        : ([
            {
              shortDescription: translate("description.bonusTimeshard.boost"),
              labelType: "success",
              boostTypeIcon: powerup,
              boostedItemIcon: ITEM_DETAILS.Timeshard.image,
            },
          ] as BuffLabel[])),
    ],
    Hammock: [
      ...(hasSeasonEnded("Winds of Change")
        ? []
        : ([
            {
              shortDescription: translate("description.bonusTimeshard.boost"),
              labelType: "success",
              boostTypeIcon: powerup,
              boostedItemIcon: ITEM_DETAILS.Timeshard.image,
            },
          ] as BuffLabel[])),
    ],

    Mammoth: [
      {
        shortDescription: translate("description.mammoth.boost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.animals.cowSleeping,
      },
    ],
    "Frozen Sheep": [
      {
        shortDescription: translate("description.frozen.sheep.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    Jellyfish: [
      {
        shortDescription: translate("description.jellyfish.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    ],
    "Frozen Cow": [
      {
        shortDescription: translate("description.frozen.cow.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Summer Chicken": [
      {
        shortDescription: translate("description.summer.chicken.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
      },
    ],
    "Golden Sheep": [
      {
        shortDescription: translate("description.goldenSheep.boost"),
        labelType: "vibrant",
        boostTypeIcon: lightning,
        boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
      },
    ],
    "Barn Blueprint": [
      {
        shortDescription: translate("description.barnBlueprint.boost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.cowIdle,
      },
    ],
  };
}
