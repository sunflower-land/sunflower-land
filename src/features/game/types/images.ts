import { InventoryItemName } from "./game";

import { CROPS, CROP_SEEDS } from "./crops";
import { AchievementName } from "./achievements";

import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { LanguageCode } from "lib/i18n/dictionaries/dictionary";

import magicBean from "assets/crops/magic_bean.png";
import appleSeed from "assets/fruit/apple/apple_seed.png";
import orangeSeed from "assets/fruit/orange/orange_seed.png";
import blueberrySeed from "assets/fruit/blueberry/blueberry_seed.png";
import bananaPlant from "assets/fruit/banana/banana_plant.png";
import sunpetalSeed from "assets/flowers/sunpetal_seed.webp";
import bloomSeed from "assets/flowers/bloom_seed.webp";
import lilySeed from "assets/flowers/lily_seed.webp";
import grape from "assets/greenhouse/grape.webp";
import grapeSeed from "assets/greenhouse/grape_seed.webp";
import olive from "assets/greenhouse/olive.webp";
import oliveSeed from "assets/greenhouse/olive_seed.webp";
import rice from "assets/greenhouse/rice.webp";
import riceSeed from "assets/greenhouse/rice_seed.webp";

import communityEgg from "assets/sfts/easter_donation_egg.webp";
import hungryHare from "assets/sfts/hungryHare.png";

// NFTs
import grinxsHammer from "assets/sfts/grinx_hammer.png";
import chickenCoop from "assets/sfts/chicken_coop.png";
import christmasTree from "assets/sfts/christmas_tree.png";
import farmCat from "assets/sfts/farm_cat.gif";
import farmDog from "assets/sfts/farm_dog.gif";
import gnome from "assets/decorations/scarlet.png";
import goldEgg from "assets/sfts/gold_egg.png";
import potatoStatue from "assets/sfts/potato_statue.png";
import scarecrow from "assets/sfts/scarecrow.png";
import sunflowerStatue from "assets/sfts/sunflower_statue.png";
import sunflowerRock from "assets/sfts/sunflower_rock.png";
import sunflowerTombstone from "assets/sfts/sunflower_tombstone.png";
import goldenCauliflower from "assets/sfts/golden_cauliflower.webp";
import crown from "assets/sfts/goblin_crown.png";
import fountain from "assets/sfts/fountain.gif";
import beaver from "assets/sfts/beaver.gif";
import apprenticeBeaver from "assets/sfts/apprentice_beaver.gif";
import constructionBeaver from "assets/sfts/construction_beaver.gif";
import mysteriousParsnip from "assets/sfts/mysterious_parsnip.png";
import carrotSword from "assets/sfts/carrot_sword.png";
import goldenBonsai from "assets/sfts/golden_bonsai.png";
import nancy from "assets/sfts/nancy.png";
import kuebiko from "assets/sfts/kuebiko.gif";
import nyonStatue from "assets/sfts/nyon_statue.png";
import homelessTent from "assets/sfts/homeless_tent.png";
import farmerBath from "assets/sfts/farmer_bath.png";
import mysteriousHead from "assets/sfts/mysterious_head.png";
import tunnelMole from "assets/sfts/tunnel_mole.gif";
import rockyMole from "assets/sfts/rocky_mole.gif";
import nugget from "assets/sfts/nugget.gif";
import rockGolem from "assets/sfts/rock_golem.gif";
import rooster from "assets/animals/chickens/rooster.gif";
import undeadChicken from "assets/animals/chickens/undead_chicken.gif";
import wickerMan from "assets/sfts/wicker_man.png";
import wendy from "assets/sfts/wood_nymph_wendy.gif";
import cabbageBoy from "assets/sfts/cabbage_boy.gif";
import cabbageGirl from "assets/sfts/cabbage_girl.gif";
import prizedPotato from "assets/sfts/peeled_potato.gif";
import immortalPear from "assets/sfts/immortal_pear.webp";
import ladybug from "assets/sfts/ladybug.gif";
import blackBear from "assets/sfts/black_bear.gif";
import squirrelMonkey from "assets/sfts/squirrel_monkey.gif";
import luminousLantern from "assets/decorations/lanterns/luminous_lantern.webp";
import auroraLantern from "assets/decorations/lanterns/aurora_lantern.webp";
import radianceLantern from "assets/decorations/lanterns/radiance_lantern.webp";
import oceanLantern from "assets/decorations/lanterns/ocean_lantern.png";
import solarLantern from "assets/decorations/lanterns/solar_lantern.png";
import bumpkinLantern from "assets/decorations/lanterns/bumpkin_lantern.png";
import bettyLantern from "assets/decorations/lanterns/betty_lantern.png";
import goblinLantern from "assets/decorations/lanterns/goblin_lantern.png";
import poppy from "assets/sfts/poppy.png";
import kernaldo from "assets/sfts/kernaldo.png";
import walrus from "assets/sfts/walrus.webp";
import alba from "assets/sfts/alba.webp";
import knowledgeCrab from "assets/sfts/knowledge_crab.webp";
import anchor from "assets/sfts/anchor.webp";
import rubberDucky from "assets/sfts/rubber_ducky.webp";
import krakenTentacle from "assets/sfts/kraken_tentacle.webp";
import krakenHead from "assets/sfts/kraken_head.webp";
import skillShrimpy from "assets/sfts/skill_shrimpy.png";
import soilKrabby from "assets/sfts/soil_krabby.webp";
import nana from "assets/sfts/nana.webp";
import hummingBird from "assets/sfts/hummingbird.webp";
import queenBee from "assets/sfts/queen_bee.webp";
import flowerFox from "assets/sfts/flower_fox.webp";
import hungryCaterpillar from "assets/sfts/hungry_caterpillar.webp";
import sunriseBloomRug from "assets/sfts/sunrise_bloom_rug.webp";
import blossomRoyale from "assets/sfts/blossom_royale.webp";
import rainbow from "assets/sfts/rainbow.webp";
import enchantedRose from "assets/sfts/enchanted_rose.webp";
import flowerCart from "assets/sfts/flower_cart.webp";
import capybara from "assets/sfts/capybara.webp";
import flowerRug from "assets/sfts/flower_rug.webp";
import teaRug from "assets/sfts/tea_rug.webp";
import greenFieldRug from "assets/sfts/green_field_rug.webp";
import gauchoRug from "assets/sfts/gaucho_rug.webp";
// Clash of Factions
import turboSprout from "assets/sfts/turbo_sprout.webp";
import soybliss from "assets/sfts/soybliss.webp";
import grapeGranny from "assets/sfts/grape_granny.webp";
import royalThrone from "assets/sfts/royal_throne.webp";
import lilyEgg from "assets/sfts/lily_egg.webp";
import goblet from "assets/sfts/goblet.webp";
import fancyRug from "assets/sfts/fancy_rug.webp";
import vinny from "assets/sfts/vinny.webp";
import clock from "assets/sfts/clock.webp";

// AoE items
import basicScarecrow from "assets/sfts/aoe/basic_scarecrow.png";
import emeraldTurtle from "assets/sfts/aoe/emerald_turtle.webp";
import tinTurtle from "assets/sfts/aoe/tin_turtle.webp";
import bale from "assets/sfts/aoe/bale.png";
import scaryMike from "assets/sfts/aoe/scary_mike.png";
import laurie from "assets/sfts/aoe/laurie.png";
import queenCornelia from "assets/sfts/aoe/queen_cornelia.png";

// Mutant Chickens
import speedChicken from "assets/animals/chickens/speed_chicken.gif";
import fatChicken from "assets/animals/chickens/fat_chicken.gif";
import richChicken from "assets/animals/chickens/rich_chicken.webp";
import elPolloVeloz from "assets/animals/chickens/el_pollo_veloz.gif";
import ayamCemani from "assets/animals/chickens/ayam_cemani.gif";
import bananaChicken from "assets/animals/chickens/banana_chicken.png";
import crimPeckster from "assets/animals/chickens/crim_peckster.png";
import knightChicken from "assets/animals/chickens/knight_chicken.webp";

// Foods
import roastedCauliflower from "assets/food/roasted_cauliflower.png";
import radishPie from "assets/food/radish_pie.png";

// Flags
import australiaFlag from "assets/sfts/flags/australia_flag.gif";
import belgiumFlag from "assets/sfts/flags/belgium_flag.gif";
import brazilFlag from "assets/sfts/flags/brazil_flag.gif";
import chinaFlag from "assets/sfts/flags/china_flag.gif";
import finlandFlag from "assets/sfts/flags/finland_flag.gif";
import franceFlag from "assets/sfts/flags/france_flag.gif";
import germanFlag from "assets/sfts/flags/germany_flag.gif";
import indiaFlag from "assets/sfts/flags/india_flag.gif";
import indonesiaFlag from "assets/sfts/flags/indonesia_flag.gif";
import iranFlag from "assets/sfts/flags/iran_flag.gif";
import italyFlag from "assets/sfts/flags/italy_flag.gif";
import japanFlag from "assets/sfts/flags/japan_flag.gif";
import moroccoFlag from "assets/sfts/flags/morocco_flag.gif";
import netherlandsFlag from "assets/sfts/flags/netherlands_flag.gif";
import phillipinesFlag from "assets/sfts/flags/philippines_flag.gif";
import polandFlag from "assets/sfts/flags/poland_flag.gif";
import portugalFlag from "assets/sfts/flags/portugal_flag.gif";
import russiaFlag from "assets/sfts/flags/russia_flag.gif";
import saudiArabiaFlag from "assets/sfts/flags/saudi_arabia_flag.gif";
import southKoreaFlag from "assets/sfts/flags/south_korea_flag.gif";
import sunflowerFlag from "assets/sfts/flags/sunflower_flag.gif";
import spainFlag from "assets/sfts/flags/spain_flag.gif";
import thailandFlag from "assets/sfts/flags/thailand_flag.gif";
import turkeyFlag from "assets/sfts/flags/turkey_flag.gif";
import ukraineFlag from "assets/sfts/flags/ukraine_flag.gif";
import usaFlag from "assets/sfts/flags/usa_flag.gif";
import vietnamFlag from "assets/sfts/flags/vietnam_flag.gif";
import algerian_flag from "assets/sfts/flags/algerian_flag.gif";
import argentinian_flag from "assets/sfts/flags/argentinian_flag.gif";
import british_flag from "assets/sfts/flags/british_flag.gif";
import canadian_flag from "assets/sfts/flags/canadian_flag.gif";
import colombian_flag from "assets/sfts/flags/colombian_flag.gif";
import dominican_republic_flag from "assets/sfts/flags/dominican_republic_flag.gif";
import goblin_flag from "assets/sfts/flags/goblin_flag.gif";
import lithuanian_flag from "assets/sfts/flags/lithuanian_flag.gif";
import malaysian_flag from "assets/sfts/flags/malaysian_flag.gif";
import mexican_flag from "assets/sfts/flags/mexican_flag.gif";
import pirate_flag from "assets/sfts/flags/pirate_flag.gif";
import rainbow_flag from "assets/sfts/flags/rainbow_flag.gif";
import romanian_flag from "assets/sfts/flags/romanian_flag.gif";
import sierra_leone_flag from "assets/sfts/flags/sierra_leone_flag.gif";
import singaporean_flag from "assets/sfts/flags/singaporean_flag.gif";

import generosityFlag from "assets/sfts/generosity_flag.png";
import splendorFlag from "assets/sfts/splendor_flag.png";
import benevolenceFlag from "assets/sfts/benevolence_flag.png";
import devotionFlag from "assets/sfts/devotion_flag.png";

import paintCan from "assets/sfts/paint_can.png";
import jellyLamp from "assets/sfts/jelly_lamp.webp";

// Resources
import iron from "assets/resources/iron_ore.png";
import gold from "assets/resources/gold_ore.png";
import crimstone from "assets/resources/crimstone.png";
import sunstone from "assets/resources/sunstone/sunstone.png";
import honey from "assets/resources/honey.png";
import apple from "assets/resources/apple.png";
import orange from "assets/resources/orange.png";
import blueberry from "assets/resources/blueberry.png";
import banana from "assets/resources/banana.png";
import oil from "assets/resources/oil.webp";

// Skills
import greenThumb from "assets/skills/green_thumb.png";
import goldRush from "assets/skills/gold_rush.png";
import prospector from "assets/skills/prospector.png";
import wrangler from "assets/skills/wrangler.png";
import barnManager from "assets/skills/barn_manager.png";
import seedSpecialist from "assets/skills/seed_specialist.png";
import logger from "assets/skills/logger.png";
import lumberjack from "assets/skills/lumberjack.png";
import warrior from "assets/skills/warrior.png";
import artist from "assets/skills/artist.png";
import coder from "assets/skills/coder.png";
import discord from "assets/skills/discord.png";
import liquidityProvider from "assets/skills/liquidity_provider.png";

// Achievements

import bumpkinChainsawAmateur from "assets/achievements/bumpkin_chainsaw_amateur.png";
import twentyTwentyVision from "assets/achievements/20-20-vision.png";
import bakersDozen from "assets/achievements/bakers_dozen.png";
import beetrootBeast from "assets/achievements/beetrootBeast.png";
import bigSpender from "assets/achievements/big_spender.png";
import brilliantBumpkin from "assets/achievements/brilliant_bumpkin.png";
import bumpkinBillionaire from "assets/achievements/bumpkin_billionaire.png";
import craftmanship from "assets/achievements/craftmanship.png";
import busyBumpkin from "assets/achievements/busy_bumpkin.png";
import cabbageKing from "assets/achievements/cabbage_king.png";
import canary from "assets/achievements/canary.png";
import chefDeCuisine from "assets/achievements/chef_de_cuisine.png";
import contractor from "assets/achievements/contractor.png";
import coolCauliflower from "assets/achievements/cool_cauliflower.png";
import jackOLantern from "assets/achievements/jack_o_lantern.png";
import cropChampion from "assets/achievements/crop_champion.png";
import driller from "assets/achievements/driller.png";
import elDorado from "assets/achievements/el-dorado.png";
import goldFever from "assets/achievements/gold_fever.png";
import ironEyes from "assets/achievements/iron_eyes.png";
import stapleCrop from "assets/achievements/staple_crop.png";
import kissTheCook from "assets/achievements/kiss_the_cook.png";
import museum from "assets/achievements/museum.png";
import myLifeIsPotato from "assets/achievements/my_life_is_potato.png";
import patientParsnip from "assets/achievements/patient_parsnip.png";
import rapidRadish from "assets/achievements/rapidRadish.png";
import somethingShiny from "assets/achievements/something_shiny.png";
import sunSeeker from "assets/achievements/sun_seeker.png";
import sunflowerSuperstar from "assets/achievements/sunflower_superstar.png";
import timberrr from "assets/achievements/timber.png";
import timeToChop from "assets/achievements/time_to_chop.png";
import breadWinner from "assets/achievements/bread_winner.png";
import explorer from "assets/achievements/explorer.png";
import farmHand from "assets/achievements/farm_hand.png";
import highRoller from "assets/achievements/high_roller.png";
import orangeSqueeze from "assets/achievements/orange_squeeze.png";
import appleOfMyEye from "assets/achievements/apple_of_my_eye.png";
import blueChip from "assets/achievements/blue_chip.png";
import fruitPlatter from "assets/achievements/fruit_platter.png";

// Coupons
import ticket from "assets/icons/ticket.png";
import blockBuck from "assets/icons/block_buck.png";
import goldPass from "assets/icons/gold-pass.png";
import warBond from "assets/icons/warBond.png";
import betaPass from "assets/icons/beta_pass.png";
import solarFlareTicket from "assets/icons/solar_flare_ticket.png";
import dawnBreakerTicket from "assets/icons/dawn_breaker_ticket.png";
import potionPoint from "assets/icons/potion_point.png";
import crowFeather from "assets/icons/crow_feather.webp";
import mermaidScale from "assets/icons/mermaid_scale.webp";
import tulipBulb from "assets/icons/tulip_bulb.png";
import scroll from "assets/icons/scroll.webp";
import goblinEmblem from "assets/icons/goblin_emblem.webp";
import bumpkinEmblem from "assets/icons/bumpkin_emblem.webp";
import sunflorianEmblem from "assets/icons/sunflorian_emblem.webp";
import nightshadeEmblem from "assets/icons/nightshade_emblem.webp";
import mark from "assets/icons/faction_mark.webp";
import supporterTicket from "assets/icons/supporter_ticket.png";
import solarFlareBanner from "assets/decorations/banners/solar_flare_banner.png";
import dawnBreakerBanner from "assets/decorations/banners/dawn_breaker_banner.png";
import witchesEveBanner from "assets/decorations/banners/witches_eve_banner.webp";
import catchTheKrakenBanner from "assets/decorations/banners/catch_the_kraken_banner.webp";
import springBlossomBanner from "assets/decorations/banners/spring_banner.gif";
import clashOfFactionsBanner from "assets/decorations/banners/clash_of_factions_banner.webp";
import lifetimeFarmerBanner from "assets/decorations/banners/lifetime_farmer_banner.png";
import budTicket from "assets/icons/bud_ticket.png";
import prizeTicket from "assets/icons/prize_ticket.png";
import budSeedling from "assets/icons/bud_seedling.png";
import earnAllianceBanner from "assets/sfts/earn_alliance_banner.png";

// Banners
import goblinBanner from "assets/decorations/banners/goblin_banner.png";
import humanBanner from "assets/decorations/banners/human_banner.png";

// Egg
import redEgg from "src/assets/sfts/easter/red_egg.png";
import yellowEgg from "src/assets/sfts/easter/yellow_egg.png";
import purpleEgg from "src/assets/sfts/easter/purple_egg.png";
import blueEgg from "src/assets/sfts/easter/blue_egg.png";
import greenEgg from "src/assets/sfts/easter/green_egg.png";
import orangeEgg from "src/assets/sfts/easter/orange_egg.png";
import pinkEgg from "src/assets/sfts/easter/pink_egg.png";
import easterBasket from "src/assets/sfts/easter/basket.png";
import easterBunny from "src/assets/sfts/easter/easter_bunny.gif";
import pabloBunny from "src/assets/sfts/pablo_bunny.gif";
import easterBush from "src/assets/sfts/easter_bush.gif";
import giantCarrot from "assets/sfts/giant_carrot.png";

//MOM Event
import momCoreEngine from "src/assets/sfts/mom/engine_core.png";
import observatory from "src/assets/sfts/mom/observatory.gif";

// Cakes
import carrotCake from "src/assets/food/cakes/carrot_cake.png";
import radishCake from "src/assets/food/cakes/radish_cake.png";
import beetrootCake from "src/assets/food/cakes/beetroot_cake.png";
import cabbageCake from "src/assets/food/cakes/cabbage_cake.png";
import cauliflowerCake from "src/assets/food/cakes/cauliflower_cake.png";
import parsnipCake from "src/assets/food/cakes/parsnip_cake.png";
import potatoCake from "src/assets/food/cakes/potato_cake.png";
import pumpkinCake from "src/assets/food/cakes/pumpkin_cake.png";
import sunflowerCake from "src/assets/food/cakes/sunflower_cake.png";
import wheatCake from "src/assets/food/cakes/wheat_cake.png";

// Food
import mashedPotato from "assets/food/mashed_potato.png";
import pumpkinSoup from "assets/food/pumpkin_soup.png";
import bumpkinBroth from "assets/food/bumpkin_broth.png";
import boiledEgg from "assets/food/boiled_eggs.png";
import goblinsTreat from "assets/food/goblins_treat.png";
import cauliflowerBurger from "assets/food/cauliflower_burger.png";
import pancakes from "assets/food/pancakes.png";
import roastVeggies from "assets/food/roast_veggies.png";
import clubSandwich from "assets/food/club_sandwich.png";
import bumpkinSalad from "assets/food/bumpkin_salad.png";
import blueberryJam from "assets/food/blueberry_jam.png";
import honeyCake from "assets/food/cakes/honey_cake.png";
import kaleStew from "assets/food/kale_stew.png";
import mushroomSoup from "assets/food/mushroom_soup.png";
import orangeCake from "assets/food/cakes/orange_cake.png";
import sunflowerCrunch from "assets/food/sunflower_crunch.png";
import applePie from "assets/food/apple_pie.png";
import mushroomJacketPotato from "assets/food/mushroom_jacket_potato.png";
import kaleMushroomPie from "assets/food/mushroom_kale_pie.png";
import reindeerCarrot from "assets/food/reindeer_carrot.png";
import fermentedCarrots from "assets/food/fermented_carrots.png";
import sauerkraut from "assets/food/sauerkraut.png";
import appleJuice from "assets/food/apple_juice.png";
import orangeJuice from "assets/food/orange_juice.png";
import purpleSmoothie from "assets/food/purple_smoothie.png";
import bumpkinDetox from "assets/food/bumpkin_detox.png";
import powerSmoothie from "assets/food/power_smoothie.png";
import bumpkinRoast from "assets/food/bumpkin_roast.png";
import goblinBrunch from "assets/food/goblin_brunch.png";
import fruitSalad from "assets/food/fruit_salad.png";
import kaleOmelette from "assets/food/kale_omelette.png";
import cabbersNMash from "assets/food/cabbers_n_mash.png";
import fancyFries from "assets/food/fancy_fries.png";
import bumpkinGanoush from "assets/food/bumpkin_ganoush.png";
import eggplantCake from "assets/food/cakes/eggplant_cake.png";
import cornBread from "assets/food/corn_bread.png";
import popcorn from "assets/food/popcorn.png";
import chowder from "assets/food/chowder.png";
import gumbo from "assets/food/gumbo.png";
import fermentedFish from "assets/food/fermented_fish.png";
import bananaBlast from "assets/food/banana_blast.png";
import beetrootBlaze from "assets/food/beetroot_blaze.png";
import shroomSyrup from "assets/food/shroom_syrup.png";
import rapidRoast from "assets/food/rapid_roast.png";
import theLot from "assets/food/the_lot.webp";
import antipasto from "assets/food/antipasto.webp";
import carrotJuice from "assets/food/carrot_juice.webp";
import fishBasket from "assets/food/seafood_basket.webp";
import fishBurger from "assets/food/fish_burger.webp";
import fishnChips from "assets/food/fish_and_chips.webp";
import fishOmelette from "assets/food/fish_omelette.webp";
import friedCalamari from "assets/food/fried_calamari.webp";
import grapeJuice from "assets/food/grape_juice.webp";
import oceansOlive from "assets/food/oceans_olive.webp";
import quickJuice from "assets/food/quick_juice.webp";
import riceBun from "assets/food/rice_bun.webp";
import slowJuice from "assets/food/slow_juice.webp";
import redRice from "assets/food/red_rice.webp";
import sushiRoll from "assets/food/sushi_roll.webp";
import friedTofu from "assets/food/fried_tofu.png";
import tofuScramble from "assets/food/tofu_scramble.png";

import goblinKey from "src/assets/sfts/quest/goblin_key.png";
import sunflowerKey from "src/assets/sfts/quest/sunflower_key.png";
import rareKey from "src/assets/sfts/quest/rare_key.png";
import luxuryKey from "src/assets/sfts/quest/luxury_key.png";
import ancientGoblinSword from "src/assets/sfts/quest/ancient_goblin_sword.png";
import ancientHumanWarhammer from "src/assets/sfts/quest/ancient_human_warhammer.png";

// Fertiliser
import rapidGrowth from "src/assets/fertilisers/rapidGrowth.png";

// Buildings
import firePit from "src/assets/buildings/fire_pit.png";
import kitchen from "src/assets/buildings/kitchen.png";
import market from "src/assets/buildings/bettys_market.png";
import townCenter from "src/assets/buildings/town_center.png";
import workbench from "src/assets/buildings/workbench.png";
import tent from "src/assets/buildings/tent.png";
import well from "src/assets/buildings/well1.png";
import chickenHouse from "src/assets/buildings/hen_house.png";
import bakery from "src/assets/buildings/bakery.png";
import deli from "src/assets/buildings/deli.png";
import greenhouse from "src/assets/buildings/greenhouse.webp";
import smoothieShack from "src/assets/buildings/smoothie_shack.webp";
import toolshed from "src/assets/buildings/toolshed.png";
import warehouse from "src/assets/buildings/warehouse.png";
import basicComposter from "assets/composters/composter_basic.png";
import advancedComposter from "assets/composters/composter_advanced.png";
import expertComposter from "assets/composters/composter_expert.png";
import house from "assets/buildings/house.png";
import manor from "assets/buildings/manor.png";
import cropMachine from "assets/buildings/crop_machine.wep.webp";

// Composter Bait
import earthworm from "assets/composters/earthworm.png";
import grub from "assets/composters/grub.png";
import redWiggler from "assets/composters/red_wiggler.png";
import fishingLure from "assets/composters/fishing_lure.png";

// Compost
import sproutMix from "assets/composters/sprout_mix.png";
import fruitfulBlend from "assets/composters/fruitful_blend.png";
import rapidRoot from "assets/composters/rapid_root.png";

// Clothing
import chefHat from "src/assets/icons/chef_hat.png";

import skull from "src/assets/decorations/war_skulls.png";
import warTombstone from "src/assets/decorations/war_tombstone.png";
import jackOLanternItem from "src/assets/sfts/jack_o_lantern.png";
import victoriaSisters from "src/assets/sfts/victoria_sisters.gif";

//Decorations
import snowglobe from "src/assets/decorations/snowglobe.gif";
import pottedSunflower from "src/assets/decorations/potted_sunflower.png";
import pottedPumpkin from "src/assets/decorations/potted_pumpkin.webp";
import pottedPotato from "src/assets/decorations/potted_potato.png";
import whiteTulips from "src/assets/decorations/white_tulips.png";
import cactus from "src/assets/decorations/cactus.png";
import basicBear from "src/assets/sfts/bears/basic_bear.png";
import chefBear from "src/assets/sfts/bears/chef_bear.png";
import constructionBear from "src/assets/sfts/bears/construction_bear.png";
import angelBear from "src/assets/sfts/bears/angel_bear.png";
import devilBear from "src/assets/sfts/bears/devil_bear.png";
import badassBear from "src/assets/sfts/bears/badass_bear.png";
import sunflowerBear from "src/assets/sfts/bears/sunflower_bear.png";
import brilliantBear from "src/assets/sfts/bears/brilliant_bear.png";
import classyBear from "src/assets/sfts/bears/classy_bear.png";
import farmerBear from "src/assets/sfts/bears/farmer_bear.png";
import richBear from "src/assets/sfts/bears/rich_bear.png";
import bearTrap from "src/assets/sfts/bears/bear_trap.png";
import christmasBear from "src/assets/sfts/bears/christmas_bear.png";
import betaBear from "src/assets/sfts/bears/sfl_bear.png";
import rainbowArtistBear from "src/assets/sfts/bears/rainbow_artist_bear.png";
import cyborgBear from "src/assets/sfts/bears/cyborg_bear.png";
import collectibleBear from "src/assets/sfts/bears/collectible_bear.png";
import manekiNeko from "src/assets/sfts/maneki_neko.gif";
import redEnvelope from "src/assets/icons/red_envelope.png";
import loveLetter from "src/assets/icons/love_letter.png";
import communityCoin from "src/assets/icons/community_coin.png";
import tikiTotem from "src/assets/sfts/tiki_totem.webp";
import timeWarpTotem from "src/assets/sfts/time_warp_totem.webp";
import lunarCalendar from "src/assets/sfts/lunar_calendar.webp";
import valentineBear from "src/assets/sfts/bears/love_bear.png";
import easterBear from "src/assets/sfts/bears/easter_bear.png";
import ironIdol from "src/assets/sfts/iron_idol.webp";
import genieBear from "src/assets/sfts/bears/genie_bear.png";
import eggplantBear from "src/assets/sfts/bears/eggplant_bear.png";
import dawnFlower from "src/assets/sfts/dawn_flower.png";
import candles from "src/assets/decorations/candles.png";
import spookyTree from "src/assets/decorations/spooky_tree.png";
import hauntedStump from "src/assets/decorations/haunted_stump.png";
import sign from "src/assets/decorations/woodsign.png";
import observer from "src/assets/decorations/observer.webp";
import crowRock from "src/assets/decorations/crow_rock.webp";
import miniCornMaze from "src/assets/decorations/mini_corn_maze.webp";
import whiteCrow from "src/assets/decorations/white_crow.webp";
import lifeguardRing from "src/assets/decorations/lifeguard_ring.webp";
import surfboard from "src/assets/decorations/surfboard.webp";
import hideawayHerman from "src/assets/decorations/hideaway_herman.webp";
import shiftySheldon from "src/assets/decorations/shifty_sheldon.webp";
import tikiTorch from "src/assets/decorations/tiki_torch.webp";
import beachUmbrella from "src/assets/decorations/beach_umbrella.webp";

import pineTree from "src/assets/decorations/pine_tree.png";
import fieldMaple from "src/assets/decorations/field_maple.webp";
import redMaple from "src/assets/decorations/red_maple.webp";
import goldenMaple from "src/assets/decorations/golden_maple.webp";

// Treasure
import abandonedBear from "assets/sfts/bears/abandoned_bear.png";
import pearl from "assets/sfts/treasure/pearl.webp";
import pipi from "assets/sfts/treasure/pipi.webp";
import turtleBear from "assets/sfts/bears/turtle_bear.webp";
import tRexSkull from "assets/sfts/t_rex_skull.webp";
import parasaurSkull from "assets/sfts/parasaur_skull.webp";
import clamShell from "assets/sfts/treasure/clam_shell.webp";
import lifeguardBear from "assets/sfts/bears/lifeguard_bear.webp";
import snorkelBear from "assets/sfts/bears/snorkel_bear.webp";
import whaleBear from "assets/sfts/bears/whale_bear.webp";
import goblinBear from "assets/sfts/bears/goblin_bear.webp";
import goldenBearHead from "assets/sfts/golden_bear_head.webp";
import humanBear from "assets/sfts/bears/human_bear.webp";
import pirateBear from "assets/sfts/bears/pirate_bear.webp";
import seaweed from "assets/sfts/treasure/seaweed.webp";
import sunflowerCoin from "assets/sfts/sunflower_coin.webp";
import galleon from "assets/sfts/galleon.webp";
import treasureMap from "assets/sfts/treasure/treasure_map.webp";
import woodenCompass from "assets/sfts/treasure/wooden_compass.webp";
import ironCompass from "assets/sfts/treasure/iron_compass.webp";
import emeraldCompass from "assets/sfts/treasure/emerald_compass.webp";
import heartOfDavyJones from "assets/sfts/heart_of_davy_jones.gif";
import heartBalloons from "assets/events/valentine/sfts/heart_balloons.png";
import flamingo from "assets/events/valentine/sfts/flamingo.webp";
import blossomTree from "assets/events/valentine/sfts/blossom_tree.png";
import skeletonKingStaff from "assets/sfts/skeleton_king_staff.webp";
import foliant from "assets/sfts/foliant.webp";
import dinosaurBone from "assets/sfts/dinosaur_bone.webp";
import pirateCake from "assets/food/cakes/pirate_cake.webp";
import drill from "assets/icons/drill.png";
import karkinos from "assets/seasons/solar-flare/karkinos.png";
import palmTree from "assets/seasons/solar-flare/palm_tree.webp";
import beachBall from "assets/seasons/solar-flare/beach_ball.webp";
import dirt from "assets/sfts/dirt_path.png";
import bush from "assets/decorations/bush.png";
import shrub from "assets/decorations/shrub.png";
import fence from "assets/decorations/fence.png";
import stoneFence from "assets/decorations/stone_fence.png";
import mushroomHouse from "assets/seasons/dawn-breaker/mushroom_house.png";
import genieLamp from "assets/sfts/genie_lamp.png";
import oldBottle from "assets/sfts/treasure/old_bottle.png";
import oilDrill from "assets/icons/oil_drill.webp";

import bonniesTombstone from "assets/decorations/bonnies_tombstone.png";
import grubnashTombstone from "assets/decorations/grubnash_tombstone.png";
import crimsonCap from "assets/decorations/crimson_cap.png";
import toadstoolSeat from "assets/decorations/toadstool_seat.png";
import chestnutStool from "assets/decorations/chestnut_fungi_stool.png";
import mahoganyCap from "assets/decorations/mahogony_cap.png";
import clementine from "assets/decorations/clementine.png";
import blossombeard from "assets/sfts/blossom_beard.webp";
import desertgnome from "assets/sfts/desert_gnome.webp";
import cobalt from "assets/decorations/cobalt.png";
import dawnUmbrellaSeat from "assets/decorations/dawn_umbrella_seat.png";
import eggplantGrill from "assets/decorations/eggplant_grill.png";
import giantDawnMushroom from "assets/decorations/giant_dawn_mushroom.png";
import shroomGlow from "assets/decorations/shroom_glow.png";
import purpleTrail from "assets/sfts/purple_trail.png";
import obie from "assets/sfts/obie.png";
import maximus from "assets/sfts/maximus.png";
import hoot from "assets/sfts/hoot.png";
import sirGoldenSnout from "assets/sfts/aoe/sir_goldensnout.png";
import freyaFox from "assets/sfts/freya_fox.png";
import grainGrinder from "assets/sfts/grain_grinder.png";

import goldRock from "assets/resources/gold_small.png";
import ironRock from "assets/resources/iron_small.png";
import stoneRock from "assets/resources/stone_small.png";
import crimstoneRock from "assets/resources/crimstone/crimstone_rock_1.webp";
import sunstoneRock from "assets/resources/sunstone/sunstone_rock_1.webp";
import oilReserve from "assets/resources/oil/oil_reserve_full.webp";

// Potion House
import giantCabbage from "assets/sfts/giant_cabbage.png";
import giantPumpkin from "assets/sfts/giant_pumpkin.png";
import giantPotato from "assets/sfts/giant_potato.png";
import labGrownCarrot from "assets/sfts/lab_grown_carrot.gif";
import labGrownPumpkin from "assets/sfts/lab_grown_pumpkin.gif";
import labGrownRadish from "assets/sfts/lab_grown_radish.gif";
import adirondackPotato from "assets/potion_house/adirondack_potato.png";
import goldenHelios from "assets/potion_house/golden_helios.png";
import chiogga from "assets/potion_house/chiogga.png";
import blackMagic from "assets/potion_house/black_magic.png";
import purpleCauliflower from "assets/potion_house/purple_cauliflower.png";
import whiteCarrot from "assets/potion_house/white_carrot.png";
import wartyGoblinPumpkin from "assets/potion_house/warty_goblin_pumpkin.png";
import potatoMutant from "assets/sfts/potato_mutant.gif";
import radishMutant from "assets/sfts/radish_mutant.gif";
import sunflowerMutant from "assets/sfts/sunflower_mutant.gif";

import battleCryDrum from "assets/sfts/battlecry_drum.webp";
import bullseyBoard from "assets/sfts/bullseye_board.webp";
import chessRug from "assets/sfts/chess_rug.webp";
import cluckapult from "assets/sfts/cluckapult.webp";
import goldenGallant from "assets/sfts/golden_gallant.webp";
import goldenGarrison from "assets/sfts/golden_garrison.webp";
import goldenGurdian from "assets/sfts/golden_guardian.webp";
import noviceKnight from "assets/sfts/novice_knight.webp";
import regularPawn from "assets/sfts/regular_pawn.webp";
import rookieRook from "assets/sfts/rookie_rook.webp";
import silverSentinel from "assets/sfts/silver_sentinel.webp";
import silverSquire from "assets/sfts/silver_squire.webp";
import silverStallion from "assets/sfts/silver_stallion.webp";
import traineeTarget from "assets/sfts/trainee_target.webp";
import twisterRug from "assets/sfts/twister_rug.webp";
import ricePanda from "assets/sfts/rice_panda.webp";

import anchovy from "assets/fish/anchovy.png";
import barredKnifejaw from "assets/fish/barred_knifejaw.png";
import blowfish from "assets/fish/blowfish.png";
import blueMarlin from "assets/fish/blue_marlin.png";
import butterflyfish from "assets/fish/butterfly_fish.png";
import clownfish from "assets/fish/clownfish.png";
import coelacanth from "assets/fish/coelacanth.png";
import footballFish from "assets/fish/football_fish.png";
import hammerheadShark from "assets/fish/hammerhead_shark.png";
import horseMackerel from "assets/fish/horse_mackerel.png";
import mahiMahi from "assets/fish/mahi_mahi.png";
import morayEel from "assets/fish/moray_eel.png";
import napoleonfish from "assets/fish/napoleonfish.png";
import oarfish from "assets/fish/oarfish.png";
import oliveFlounder from "assets/fish/olive_flounder.png";
import ray from "assets/fish/ray.png";
import redSnapper from "assets/fish/red_snapper.png";
import sawShark from "assets/fish/saw_shark.png";
import seaBass from "assets/fish/sea_bass.png";
import seahorse from "assets/fish/seahorse.png";
import squid from "assets/fish/squid.png";
import sunfish from "assets/fish/sunfish.png";
import surgeonfish from "assets/fish/surgeonfish.png";
import tuna from "assets/fish/tuna.png";
import whaleShark from "assets/fish/whale_shark.png";
import whiteShark from "assets/fish/white_shark.png";
import zebraTurkeyfish from "assets/fish/zebra_turkeyfish.png";
import twilightAnglerfish from "assets/fish/twilight_anglerfish.png";
import startlightTuna from "assets/fish/starlight_tuna.png";
import radiantRay from "assets/fish/radiant_ray.png";
import phantomBarracuda from "assets/fish/phantom_barracuda.png";
import gildedSwordfish from "assets/fish/gilded_swordfish.png";
import crimsonCarp from "assets/fish/crimson_carp.png";
import halibut from "assets/fish/halibut.png";
import angelFish from "assets/fish/angel_fish.png";
import parrotFish from "assets/fish/parrot_fish.png";
import battleFish from "assets/fish/battle_fish.webp";

import festiveTree from "assets/sfts/festive_tree.png";
import nutcracker from "assets/sfts/bumpkin_nutcracker.png";
import whiteFestiveFox from "assets/sfts/white-xmas-fox.png";

import sapoDocuras from "assets/sfts/sapo_docuras.gif";
import sapoTravessura from "assets/sfts/sapo_travessura.gif";

// Flowers
import beehive from "assets/sfts/beehive.webp";
import flowerBed from "assets/flowers/empty.webp";
import redPansy from "assets/flowers/red_pansy.webp";
import yellowPansy from "assets/flowers/yellow_pansy.webp";
import bluePansy from "assets/flowers/blue_pansy.webp";
import whitePansy from "assets/flowers/white_pansy.webp";
import purplePansy from "assets/flowers/purple_pansy.webp";
import redCosmos from "assets/flowers/red_cosmos.webp";
import yellowCosmos from "assets/flowers/yellow_cosmos.webp";
import blueCosmos from "assets/flowers/blue_cosmos.webp";
import whiteCosmos from "assets/flowers/white_cosmos.webp";
import purpleCosmos from "assets/flowers/purple_cosmos.webp";
import redBalloonFlower from "assets/flowers/red_balloon_flower.webp";
import yellowBalloonFlower from "assets/flowers/yellow_balloon_flower.webp";
import blueBalloonFlower from "assets/flowers/blue_balloon_flower.webp";
import whiteBalloonFlower from "assets/flowers/white_balloon_flower.webp";
import purpleBalloonFlower from "assets/flowers/purple_balloon_flower.webp";
import redCarnation from "assets/flowers/red_carnation.png";
import yellowCarnation from "assets/flowers/yellow_carnation.png";
import blueCarnation from "assets/flowers/blue_carnation.png";
import whiteCarnation from "assets/flowers/white_carnation.png";
import purpleCarnation from "assets/flowers/purple_carnation.png";
import prismPetal from "assets/flowers/prism_petal.webp";
import celestialFrostbloom from "assets/flowers/celestial_frostbloom.webp";
import primulaEnigma from "assets/flowers/primula_enigma.webp";
import redDaffodil from "assets/flowers/red_daffodil.webp";
import yellowDaffodil from "assets/flowers/yellow_daffodil.webp";
import blueDaffodil from "assets/flowers/blue_daffodil.webp";
import whiteDaffodil from "assets/flowers/white_daffodil.webp";
import purpleDaffodil from "assets/flowers/purple_daffodil.webp";
import redLotus from "assets/flowers/red_lotus.webp";
import yellowLotus from "assets/flowers/yellow_lotus.webp";
import blueLotus from "assets/flowers/blue_lotus.webp";
import whiteLotus from "assets/flowers/white_lotus.webp";
import purpleLotus from "assets/flowers/purple_lotus.webp";

import babyPanda from "assets/sfts/baby_panda.png";
import baozi from "assets/sfts/baozi.webp";

// Faction Banners
import sunflorianFactionBanner from "assets/decorations/banners/factions/sunflorians_banner.webp";
import nightshadeFactionBanner from "assets/decorations/banners/factions/nightshades_banner.webp";
import bumpkinFactionBanner from "assets/decorations/banners/factions/bumpkins_banner.webp";
import goblinFactionBanner from "assets/decorations/banners/factions/goblins_banner.webp";

// Faction Shop

import sunflorianThrone from "assets/factions/sunflorian_throne.webp";
import nightshadeThrone from "assets/factions/nightshade_throne.webp";
import goblinThrone from "assets/factions/goblin_throne.webp";
import bumpkinThrone from "assets/factions/bumpkins_throne.webp";
import goldenSunflorianEgg from "assets/factions/golden_sunflorian_egg.webp";
import goblinMischiefEgg from "assets/factions/goblin_mischief_egg.webp";
import bumpkinCharmEgg from "assets/factions/bumpkin_charm_egg.webp";
import nightshadeVeilEgg from "assets/factions/nightshade_veil_egg.webp";
import emeraldGoblinGoblet from "assets/factions/emerald_goblin_goblet.webp";
import opalSunflorianGoblet from "assets/factions/opal_sunflorian_goblet.webp";
import sapphireBumpkinGoblet from "assets/factions/sapphire_bumpkin_goblet.webp";
import amethystNightshadeGoblet from "assets/factions/amethyst_nightshade_goblet.webp";
import goldenFactionGoblet from "assets/factions/golden_faction_goblet.webp";
import rubyFactionGoblet from "assets/factions/ruby_faction_goblet.webp";
import sunflorianBunting from "assets/factions/sunflorian_victory_bunting.webp";
import nightshadeBunting from "assets/factions/nightshade_victory_bunting.webp";
import goblinBunting from "assets/factions/goblin_victory_bunting.webp";
import bumpkinBunting from "assets/factions/bumpkin_victory_bunting.webp";
import sunflorianCandles from "assets/factions/sunflorian_candles.webp";
import nightshadeCandles from "assets/factions/nightshade_candles.webp";
import goblinCandles from "assets/factions/goblin_candles.webp";
import bumpkinCandles from "assets/factions/bumpkin_candles.webp";
import sunflorianLeftWall from "assets/factions/sunflorian_left_wall_candle.webp";
import nightshadeLeftWall from "assets/factions/nightshade_left_wall_candle.webp";
import goblinLeftWall from "assets/factions/goblin_left_wall_candle.webp";
import bumpkinLeftWall from "assets/factions/bumpkin_left_wall_candle.webp";
import sunflorianRightWall from "assets/factions/sunflorian_right_wall_candle.webp";
import nightshadeRightWall from "assets/factions/nightshade_right_wall_candle.webp";
import goblinRightWall from "assets/factions/goblin_right_wall_candle.webp";
import bumpkinRightWall from "assets/factions/bumpkin_right_wall_candle.webp";
import gourmetHourglass from "assets/factions/boosts/cooking_boost_full.webp";
import harvestHourglass from "assets/factions/boosts/crop_boost_full.webp";
import timberHourglass from "assets/factions/boosts/wood_boost_full.webp";
import oreHourglass from "assets/factions/boosts/mineral_boost_full.webp";
import orchardHourglass from "assets/factions/boosts/fruit_boost_full.webp";
import blossomHourglass from "assets/factions/boosts/flower_boost_full.webp";
import fishersHourglass from "assets/factions/boosts/fish_boost_full.webp";
import sunflorianFactionRug from "assets/factions/sunflorian_faction_rug.webp";
import nightshadeFactionRug from "assets/factions/nightshade_faction_rug.webp";
import goblinFactionRug from "assets/factions/goblin_faction_rug.webp";
import bumpkinFactionRug from "assets/factions/bumpkin_faction_rug.webp";
import goblinGoldChampion from "assets/sfts/goblin_gold_champion.png";
import goblinSilverChampion from "assets/sfts/goblin_silver_champion.png";

export interface Attribute {
  trait_type?: string;
  value: string | number;
  display_type?: string;
}

type TranslatedDescriptions = Record<LanguageCode, string>;

export interface ItemDetails {
  description: TranslatedDescriptions;
  boostedDescriptions?: [{ name: string; description: string }];
  image: any;
  secondaryImage?: any;
  howToGetItem?: TranslatedDescriptions[];
  itemType?: "collectible";

  // Leave emtpy to auto generate
  opensea?: {
    description: string;
    attributes: Attribute[];
    image?: string; // Leave empty to auto generate
  };
}

type Items = Record<InventoryItemName | AchievementName, ItemDetails>;

export const ITEM_DETAILS: Items = {
  Sunflower: {
    image: CROP_LIFECYCLE.Sunflower.crop,
    description: {
      en: "A sunny flower",
      pt: "A sunny flower",
      "zh-CN": "A sunny flower",
      fr: "A sunny flower",
      tk: "A sunny flower",
    },
    opensea: {
      description: "A crop grown at Sunflower Land.\n\nA sunny flower.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/201.png",
    },
  },
  Potato: {
    image: CROP_LIFECYCLE.Potato.crop,
    description: {
      en: "Healthier than you might think.",
      pt: "Healthier than you might think.",
      "zh-CN": "Healthier than you might think.",
      fr: "Healthier than you might think.",
      tk: "Healthier than you might think.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nHealthier than you might think!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/202.png",
    },
  },
  Pumpkin: {
    image: CROP_LIFECYCLE.Pumpkin.crop,
    description: {
      en: "There's more to pumpkin than pie.",
      pt: "There's more to pumpkin than pie.",
      "zh-CN": "There's more to pumpkin than pie.",
      fr: "There's more to pumpkin than pie.",
      tk: "There's more to pumpkin than pie.",
    },
    opensea: {
      description: "A crop grown at Sunflower Land.\n\nOoooh, spoookyy",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/203.png",
    },
  },
  Carrot: {
    image: CROP_LIFECYCLE.Carrot.crop,
    description: {
      en: "They're good for your eyes!",
      pt: "They're good for your eyes!",
      "zh-CN": "They're good for your eyes!",
      fr: "They're good for your eyes!",
      tk: "They're good for your eyes!",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nThey’re good for your eyes!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/204.png",
    },
  },
  Cabbage: {
    image: CROP_LIFECYCLE.Cabbage.crop,
    description: {
      en: "Once a luxury, now a food for many.",
      pt: "Once a luxury, now a food for many.",
      "zh-CN": "Once a luxury, now a food for many.",
      fr: "Once a luxury, now a food for many.",
      tk: "Once a luxury, now a food for many.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nOnce a luxury, now a food for many.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/205.png",
    },
  },
  Beetroot: {
    image: CROP_LIFECYCLE.Beetroot.crop,
    description: {
      en: "Good for hangovers!",
      pt: "Good for hangovers!",
      "zh-CN": "Good for hangovers!",
      fr: "Good for hangovers!",
      tk: "Good for hangovers!",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nApparently, they’re an aphrodisiac...",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/206.png",
    },
  },
  Cauliflower: {
    image: CROP_LIFECYCLE.Cauliflower.crop,
    description: {
      en: "Excellent rice substitute!",
      pt: "Excellent rice substitute!",
      "zh-CN": "Excellent rice substitute!",
      fr: "Excellent rice substitute!",
      tk: "Excellent rice substitute!",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nNow in 4 different colours!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/207.png",
    },
  },
  Parsnip: {
    image: CROP_LIFECYCLE.Parsnip.crop,
    description: {
      en: "Not to be mistaken for carrots.",
      pt: "Not to be mistaken for carrots.",
      "zh-CN": "Not to be mistaken for carrots.",
      fr: "Not to be mistaken for carrots.",
      tk: "Not to be mistaken for carrots.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nNot to be mistaken for carrots.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/208.png",
    },
  },
  Eggplant: {
    image: CROP_LIFECYCLE.Eggplant.crop,
    description: {
      en: "Nature's edible work of art.",
      pt: "Nature's edible work of art.",
      "zh-CN": "Nature's edible work of art.",
      fr: "Nature's edible work of art.",
      tk: "Nature's edible work of art.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nNature's edible work of art.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/215.png",
    },
  },
  Corn: {
    image: CROP_LIFECYCLE.Corn.crop,
    description: {
      en: "Sun-kissed kernels of delight, nature's summer treasure.",
      pt: "Sun-kissed kernels of delight, nature's summer treasure.",
      "zh-CN": "Sun-kissed kernels of delight, nature's summer treasure.",
      fr: "Sun-kissed kernels of delight, nature's summer treasure.",
      tk: "Sun-kissed kernels of delight, nature's summer treasure.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nGolden corn, a gift from celestial lands, bestowed bountiful harvests upon humankind",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/216.png",
    },
  },
  Radish: {
    image: CROP_LIFECYCLE.Radish.crop,
    description: {
      en: "Takes time but is worth the wait!",
      pt: "Takes time but is worth the wait!",
      "zh-CN": "Takes time but is worth the wait!",
      fr: "Takes time but is worth the wait!",
      tk: "Takes time but is worth the wait!",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nLegend says these were once used in melee combat.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/209.png",
    },
  },
  Wheat: {
    image: CROP_LIFECYCLE.Wheat.crop,
    description: {
      en: "The most harvested crop in the world.",
      pt: "The most harvested crop in the world.",
      "zh-CN": "The most harvested crop in the world.",
      fr: "The most harvested crop in the world.",
      tk: "The most harvested crop in the world.",
    },
    opensea: {
      description:
        "A crop grown at Sunflower Land.\n\nTraditionally only grown by Goblins.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/210.png",
    },
  },
  Kale: {
    image: CROP_LIFECYCLE.Kale.crop,
    description: {
      en: "A Bumpkin Power Food!",
      pt: "A Bumpkin Power Food!",
      "zh-CN": "A Bumpkin Power Food!",
      fr: "A Bumpkin Power Food!",
      tk: "A Bumpkin Power Food!",
    },
    opensea: {
      description: "A crop grown at Sunflower Land.\n\nA Bumpkin Power Food!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/211.png",
    },
  },
  Soybean: {
    image: CROP_LIFECYCLE.Soybean.crop,
    description: {
      en: "A versatile legume!",
      pt: "A versatile legume!",
      "zh-CN": "A versatile legume!",
      fr: "A versatile legume!",
      tk: "A versatile legume!",
    },
    opensea: {
      description: "A crop grown at Sunflower Land.\n\nA versatile legume!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/251.png",
    },
  },
  "Sunflower Seed": {
    image: CROP_LIFECYCLE.Sunflower.seed,
    secondaryImage: "undefined/crops/sunflower/crop.png",
    description: {
      en: "A sunny flower",
      pt: "A sunny flower",
      "zh-CN": "A sunny flower",
      fr: "A sunny flower",
      tk: "A sunny flower",
    },
    opensea: {
      description:
        "A seed used to grow sunflowers. The most basic resource used to start your farming empire.\n\nYou can buy sunflower seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/101.png",
    },
  },
  "Potato Seed": {
    image: CROP_LIFECYCLE.Potato.seed,
    secondaryImage: "undefined/crops/potato/crop.png",
    description: {
      en: "Healthier than you might think.",
      pt: "Healthier than you might think.",
      "zh-CN": "Healthier than you might think.",
      fr: "Healthier than you might think.",
      tk: "Healthier than you might think.",
    },
    opensea: {
      description:
        "A seed used to grow potatoes. All great hustlers start with a potato seed.\n\nYou can buy potato seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/102.png",
    },
  },
  "Pumpkin Seed": {
    image: CROP_LIFECYCLE.Pumpkin.seed,
    secondaryImage: "undefined/crops/pumpkin/crop.png",
    description: {
      en: "There's more to pumpkin than pie.",
      pt: "There's more to pumpkin than pie.",
      "zh-CN": "There's more to pumpkin than pie.",
      fr: "There's more to pumpkin than pie.",
      tk: "There's more to pumpkin than pie.",
    },
    opensea: {
      description:
        "A seed used to grow pumpkins. A goblin's favourite!\n\nYou can buy pumpkin seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/103.png",
    },
  },
  "Carrot Seed": {
    image: CROP_LIFECYCLE.Carrot.seed,
    secondaryImage: "undefined/crops/carrot/crop.png",
    description: {
      en: "They're good for your eyes!",
      pt: "They're good for your eyes!",
      "zh-CN": "They're good for your eyes!",
      fr: "They're good for your eyes!",
      tk: "They're good for your eyes!",
    },
    opensea: {
      description:
        "A seed used to grow carrots. An easy to grow and staple vegetable in all Bumpkin's diets!\n\nYou can buy carrot seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/104.png",
    },
  },
  "Cabbage Seed": {
    image: CROP_LIFECYCLE.Cabbage.seed,
    secondaryImage: "undefined/crops/cabbage/crop.png",
    description: {
      en: "Once a luxury, now a food for many.",
      pt: "Once a luxury, now a food for many.",
      "zh-CN": "Once a luxury, now a food for many.",
      fr: "Once a luxury, now a food for many.",
      tk: "Once a luxury, now a food for many.",
    },
    opensea: {
      description:
        "A seed used to grow cabbage.\n\nYou can buy cabbage seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/105.png",
    },
  },
  "Beetroot Seed": {
    image: CROP_LIFECYCLE.Beetroot.seed,
    secondaryImage: "undefined/crops/beetroot/crop.png",
    description: {
      en: "Good for hangovers!",
      pt: "Good for hangovers!",
      "zh-CN": "Good for hangovers!",
      fr: "Good for hangovers!",
      tk: "Good for hangovers!",
    },
    opensea: {
      description:
        "A seed used to grow beetroot.\n\nYou can buy beetroot seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/106.png",
    },
  },
  "Cauliflower Seed": {
    image: CROP_LIFECYCLE.Cauliflower.seed,
    secondaryImage: "undefined/crops/cauliflower/crop.png",
    description: {
      en: "Excellent rice substitute!",
      pt: "Excellent rice substitute!",
      "zh-CN": "Excellent rice substitute!",
      fr: "Excellent rice substitute!",
      tk: "Excellent rice substitute!",
    },
    opensea: {
      description:
        "A seed used to grow cauliflower.\n\nYou can buy cauliflower seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/107.png",
    },
  },
  "Parsnip Seed": {
    image: CROP_LIFECYCLE.Parsnip.seed,
    secondaryImage: "undefined/crops/parsnip/crop.png",
    description: {
      en: "Not to be mistaken for carrots.",
      pt: "Not to be mistaken for carrots.",
      "zh-CN": "Not to be mistaken for carrots.",
      fr: "Not to be mistaken for carrots.",
      tk: "Not to be mistaken for carrots.",
    },
    opensea: {
      description:
        "A seed used to grow parsnip.\n\nYou can buy parsnip seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/108.png",
    },
  },
  "Eggplant Seed": {
    image: CROP_LIFECYCLE.Eggplant.seed,
    secondaryImage: "undefined/crops/eggplant/crop.png",
    description: {
      en: "Nature's edible work of art.",
      pt: "Nature's edible work of art.",
      "zh-CN": "Nature's edible work of art.",
      fr: "Nature's edible work of art.",
      tk: "Nature's edible work of art.",
    },
    opensea: {
      description:
        "A seed used to grow eggplant.\n\nYou can buy eggplant seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/118.png",
    },
  },
  "Corn Seed": {
    image: CROP_LIFECYCLE.Corn.seed,
    secondaryImage: "undefined/crops/corn/crop.png",
    description: {
      en: "Sun-kissed kernels of delight, nature's summer treasure.",
      pt: "Sun-kissed kernels of delight, nature's summer treasure.",
      "zh-CN": "Sun-kissed kernels of delight, nature's summer treasure.",
      fr: "Sun-kissed kernels of delight, nature's summer treasure.",
      tk: "Sun-kissed kernels of delight, nature's summer treasure.",
    },
    opensea: {
      description:
        "A seed used to grow corn.\n\nYou can buy corn seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/119.png",
    },
  },
  "Radish Seed": {
    image: CROP_LIFECYCLE.Radish.seed,
    secondaryImage: "undefined/crops/radish/crop.png",
    description: {
      en: "Takes time but is worth the wait!",
      pt: "Takes time but is worth the wait!",
      "zh-CN": "Takes time but is worth the wait!",
      fr: "Takes time but is worth the wait!",
      tk: "Takes time but is worth the wait!",
    },
    opensea: {
      description:
        "A seed used to grow radishes.\n\nYou can buy radish seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/109.png",
    },
  },
  "Wheat Seed": {
    image: CROP_LIFECYCLE.Wheat.seed,
    secondaryImage: "undefined/crops/wheat/crop.png",
    description: {
      en: "The most harvested crop in the world.",
      pt: "The most harvested crop in the world.",
      "zh-CN": "The most harvested crop in the world.",
      fr: "The most harvested crop in the world.",
      tk: "The most harvested crop in the world.",
    },
    opensea: {
      description:
        "A seed used to grow wheat.\n\nYou can buy wheat seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/110.png",
    },
  },
  "Magic Bean": {
    image: magicBean,
    description: {
      en: "What will grow?",
      pt: "What will grow?",
      "zh-CN": "What will grow?",
      fr: "What will grow?",
      tk: "What will grow?",
    },
    opensea: {
      description:
        "Plant, wait and discover rare items, mutant crops & more surprises!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/115.png",
    },
  },
  "Kale Seed": {
    image: CROP_LIFECYCLE.Kale.seed,
    description: {
      en: "A Bumpkin Power Food!",
      pt: "A Bumpkin Power Food!",
      "zh-CN": "A Bumpkin Power Food!",
      fr: "A Bumpkin Power Food!",
      tk: "A Bumpkin Power Food!",
    },
    opensea: {
      description:
        "A seed used to grow kale.\n\nYou can buy kale seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/111.png",
    },
  },
  "Soybean Seed": {
    image: CROP_LIFECYCLE.Soybean.seed,
    description: {
      en: "A versatile legume!",
      pt: "A versatile legume!",
      "zh-CN": "A versatile legume!",
      fr: "A versatile legume!",
      tk: "A versatile legume!",
    },
    opensea: {
      description:
        "A seed used to grow soybean.\n\nYou can buy soybean seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/124.png",
    },
  },
  "Apple Seed": {
    image: appleSeed,
    description: {
      en: "Perfect for homemade Apple Pie",
      pt: "Perfect for homemade Apple Pie",
      "zh-CN": "Perfect for homemade Apple Pie",
      fr: "Perfect for homemade Apple Pie",
      tk: "Perfect for homemade Apple Pie",
    },
    opensea: {
      description:
        "A seed used to grow apple.\n\nYou can buy apple seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/112.png",
    },
  },
  "Blueberry Seed": {
    image: blueberrySeed,
    description: {
      en: "A Goblin's weakness",
      pt: "A Goblin's weakness",
      "zh-CN": "A Goblin's weakness",
      fr: "A Goblin's weakness",
      tk: "A Goblin's weakness",
    },
    opensea: {
      description:
        "A seed used to grow blueberry.\n\nYou can buy blueberry seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/113.png",
    },
  },
  "Orange Seed": {
    image: orangeSeed,
    description: {
      en: "Vitamin C to keep your Bumpkin Healthy",
      pt: "Vitamin C to keep your Bumpkin Healthy",
      "zh-CN": "Vitamin C to keep your Bumpkin Healthy",
      fr: "Vitamin C to keep your Bumpkin Healthy",
      tk: "Vitamin C to keep your Bumpkin Healthy",
    },
    opensea: {
      description:
        "A seed used to grow orange.\n\nYou can buy orange seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/114.png",
    },
  },
  "Banana Plant": {
    image: bananaPlant,
    description: {
      en: "Oh banana!",
      pt: "Oh banana!",
      "zh-CN": "Oh banana!",
      fr: "Oh banana!",
      tk: "Oh banana!",
    },
    opensea: {
      description:
        "A plant used to grow bananas.\n\nYou can buy banana plants in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/120.png",
    },
  },
  "Sunpetal Seed": {
    image: sunpetalSeed,
    description: {
      en: "A sunpetal seed",
      pt: "A sunpetal seed",
      "zh-CN": "A sunpetal seed",
      fr: "A sunpetal seed",
      tk: "A sunpetal seed",
    },
    opensea: {
      description:
        "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Sunpetal seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Rarity",
          value: "Rare",
        },
      ],
      image: "../public/erc1155/images/121.png",
    },
  },
  "Bloom Seed": {
    image: bloomSeed,
    description: {
      en: "A bloom seed",
      pt: "A bloom seed",
      "zh-CN": "A bloom seed",
      fr: "A bloom seed",
      tk: "A bloom seed",
    },
    opensea: {
      description:
        "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Bloom seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Rarity",
          value: "Rare",
        },
      ],
      image: "../public/erc1155/images/122.png",
    },
  },
  "Lily Seed": {
    image: lilySeed,
    description: {
      en: "A lily seed",
      pt: "A lily seed",
      "zh-CN": "A lily seed",
      fr: "A lily seed",
      tk: "A lily seed",
    },
    opensea: {
      description:
        "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Lily seeds in game at the market.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Rarity",
          value: "Rare",
        },
      ],
      image: "../public/erc1155/images/123.png",
    },
  },
  "Apple Pie": {
    image: applePie,
    description: {
      en: "Bumpkin Betty's famous recipe",
      pt: "Bumpkin Betty's famous recipe",
      "zh-CN": "Bumpkin Betty's famous recipe",
      fr: "Bumpkin Betty's famous recipe",
      tk: "Bumpkin Betty's famous recipe",
    },
    opensea: {
      description: "Bumpkin Betty's famous recipe. Cook this at the bakery",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/524.png",
    },
  },
  "Blueberry Jam": {
    image: blueberryJam,
    description: {
      en: "Goblins will do anything for this jam",
      pt: "Goblins will do anything for this jam",
      "zh-CN": "Goblins will do anything for this jam",
      fr: "Goblins will do anything for this jam",
      tk: "Goblins will do anything for this jam",
    },
    opensea: {
      description:
        "Goblins will do anything for this jam. You can cook this at the Deli.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/525.png",
    },
  },
  "Honey Cake": {
    image: honeyCake,
    description: {
      en: "A scrumptious cake!",
      pt: "A scrumptious cake!",
      "zh-CN": "A scrumptious cake!",
      fr: "A scrumptious cake!",
      tk: "A scrumptious cake!",
    },
    opensea: {
      description: "A scrumptious cake! You can cook this at the Bakery",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/527.png",
    },
  },
  "Kale & Mushroom Pie": {
    image: kaleMushroomPie,
    description: {
      en: "A traditional Sapphiron recipe",
      pt: "A traditional Sapphiron recipe",
      "zh-CN": "A traditional Sapphiron recipe",
      fr: "A traditional Sapphiron recipe",
      tk: "A traditional Sapphiron recipe",
    },
    opensea: {
      description:
        "A traditional Sapphiron recipe. You can cook this at the Bakery",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/528.png",
    },
  },
  "Kale Stew": {
    image: kaleStew,
    description: {
      en: "A perfect Bumpkin Booster!",
      pt: "A perfect Bumpkin Booster!",
      "zh-CN": "A perfect Bumpkin Booster!",
      fr: "A perfect Bumpkin Booster!",
      tk: "A perfect Bumpkin Booster!",
    },
    opensea: {
      description:
        "A perfect Bumpkin Booster. You can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/529.png",
    },
  },
  "Mushroom Jacket Potatoes": {
    image: mushroomJacketPotato,
    description: {
      en: "Cram them taters with what ya got!",
      pt: "Cram them taters with what ya got!",
      "zh-CN": "Cram them taters with what ya got!",
      fr: "Cram them taters with what ya got!",
      tk: "Cram them taters with what ya got!",
    },
    opensea: {
      description:
        "Cram them taters with what ya got! You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/530.png",
    },
  },
  "Mushroom Soup": {
    image: mushroomSoup,
    description: {
      en: "Warm your Bumpkin's soul.",
      pt: "Warm your Bumpkin's soul.",
      "zh-CN": "Warm your Bumpkin's soul.",
      fr: "Warm your Bumpkin's soul.",
      tk: "Warm your Bumpkin's soul.",
    },
    opensea: {
      description:
        "Warm your Bumpkin's soul. You can can cook these at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/531.png",
    },
  },
  "Orange Cake": {
    image: orangeCake,
    description: {
      en: "Orange you glad we aren't cooking apples",
      pt: "Orange you glad we aren't cooking apples",
      "zh-CN": "Orange you glad we aren't cooking apples",
      fr: "Orange you glad we aren't cooking apples",
      tk: "Orange you glad we aren't cooking apples",
    },
    opensea: {
      description:
        "Orange you glad we aren't cooking apples. You can can cook these at the Bakery.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/532.png",
    },
  },
  "Sunflower Crunch": {
    image: sunflowerCrunch,
    description: {
      en: "Crunchy goodness. Try not to burn it.",
      pt: "Crunchy goodness. Try not to burn it.",
      "zh-CN": "Crunchy goodness. Try not to burn it.",
      fr: "Crunchy goodness. Try not to burn it.",
      tk: "Crunchy goodness. Try not to burn it.",
    },
    opensea: {
      description:
        "Crunchy goodness. Try not to burn it! You can can cook these at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/533.png",
    },
  },
  "Magic Mushroom": {
    image: SUNNYSIDE.resource.magic_mushroom,
    description: {
      en: "Used to cook advanced recipes",
      pt: "Used to cook advanced recipes",
      "zh-CN": "Used to cook advanced recipes",
      fr: "Used to cook advanced recipes",
      tk: "Used to cook advanced recipes",
    },
    opensea: {
      description: "Used to cook advanced recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/616.png",
    },
  },
  "Wild Mushroom": {
    image: SUNNYSIDE.resource.wild_mushroom,
    description: {
      en: "Used to cook basic recipes",
      pt: "Used to cook basic recipes",
      "zh-CN": "Used to cook basic recipes",
      fr: "Used to cook basic recipes",
      tk: "Used to cook basic recipes",
    },
    opensea: {
      description: "Used to cook basic recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/615.png",
    },
  },
  Apple: {
    image: apple,
    description: {
      en: "Perfect for homemade Apple Pie",
      pt: "Perfect for homemade Apple Pie",
      "zh-CN": "Perfect for homemade Apple Pie",
      fr: "Perfect for homemade Apple Pie",
      tk: "Perfect for homemade Apple Pie",
    },
    opensea: {
      description:
        "A fruit grown at Sunflower Land.\n\nPerfect for homemade Apple Pie",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/212.png",
    },
  },
  Blueberry: {
    image: blueberry,
    description: {
      en: "A Goblin's weakness",
      pt: "A Goblin's weakness",
      "zh-CN": "A Goblin's weakness",
      fr: "A Goblin's weakness",
      tk: "A Goblin's weakness",
    },
    opensea: {
      description: "A fruit grown at Sunflower Land.\n\nA Goblin's weakness",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/213.png",
    },
  },
  Orange: {
    image: orange,
    description: {
      en: "Vitamin C to keep your Bumpkin Healthy",
      pt: "Vitamin C to keep your Bumpkin Healthy",
      "zh-CN": "Vitamin C to keep your Bumpkin Healthy",
      fr: "Vitamin C to keep your Bumpkin Healthy",
      tk: "Vitamin C to keep your Bumpkin Healthy",
    },
    opensea: {
      description:
        "A fruit grown at Sunflower Land.\n\nVitamin C to keep your Bumpkin Healthy",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/214.png",
    },
  },
  Banana: {
    image: banana,
    description: {
      en: "Oh banana!",
      pt: "Oh banana!",
      "zh-CN": "Oh banana!",
      fr: "Oh banana!",
      tk: "Oh banana!",
    },
    opensea: {
      description: "A fruit grown at Sunflower Land.\n\nOh banana!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/217.png",
    },
  },
  Honey: {
    image: honey,
    description: {
      en: "Used to sweeten your cooking",
      pt: "Used to sweeten your cooking",
      "zh-CN": "Used to sweeten your cooking",
      fr: "Used to sweeten your cooking",
      tk: "Used to sweeten your cooking",
    },
    opensea: {
      description: "Used to sweeten your cooking.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/614.png",
    },
  },
  "Apple Juice": {
    image: appleJuice,
    description: {
      en: "A crisp refreshing beverage",
      pt: "A crisp refreshing beverage",
      "zh-CN": "A crisp refreshing beverage",
      fr: "A crisp refreshing beverage",
      tk: "A crisp refreshing beverage",
    },
    opensea: {
      description:
        "A crisp refreshing beverage. You can can prepare these at the Smoothie Shack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/535.png",
    },
  },
  "Orange Juice": {
    image: orangeJuice,
    description: {
      en: "OJ matches perfectly with a Club Sandwich",
      pt: "OJ matches perfectly with a Club Sandwich",
      "zh-CN": "OJ matches perfectly with a Club Sandwich",
      fr: "OJ matches perfectly with a Club Sandwich",
      tk: "OJ matches perfectly with a Club Sandwich",
    },
    opensea: {
      description:
        "OJ matches perfectly with a Club Sandwich. You can can prepare these at the Smoothie Shack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/536.png",
    },
  },
  "Purple Smoothie": {
    image: purpleSmoothie,
    description: {
      en: "You can hardly taste the Cabbage",
      pt: "You can hardly taste the Cabbage",
      "zh-CN": "You can hardly taste the Cabbage",
      fr: "You can hardly taste the Cabbage",
      tk: "You can hardly taste the Cabbage",
    },
    opensea: {
      description:
        "You can hardly taste the Cabbage. You can can prepare these at the Smoothie Shack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/537.png",
    },
  },
  "Bumpkin Detox": {
    image: bumpkinDetox,
    description: {
      en: "Wash away the sins of last night",
      pt: "Wash away the sins of last night",
      "zh-CN": "Wash away the sins of last night",
      fr: "Wash away the sins of last night",
      tk: "Wash away the sins of last night",
    },
    opensea: {
      description:
        "Wash away the sins of last night. You can can prepare these at the Smoothie Shack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/539.png",
    },
  },
  "Power Smoothie": {
    image: powerSmoothie,
    description: {
      en: "Official drink of the Bumpkin Powerlifting Society",
      pt: "Official drink of the Bumpkin Powerlifting Society",
      "zh-CN": "Official drink of the Bumpkin Powerlifting Society",
      fr: "Official drink of the Bumpkin Powerlifting Society",
      tk: "Official drink of the Bumpkin Powerlifting Society",
    },
    opensea: {
      description:
        "Official drink of the Bumpkin Powerlifting Society. You can can prepare these at the Smoothie Shack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/538.png",
    },
  },
  "Bumpkin Roast": {
    image: bumpkinRoast,
    description: {
      en: "A traditional Bumpkin dish",
      pt: "A traditional Bumpkin dish",
      "zh-CN": "A traditional Bumpkin dish",
      fr: "A traditional Bumpkin dish",
      tk: "A traditional Bumpkin dish",
    },
    opensea: {
      description:
        "A traditional Bumpkin dish. You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/541.png",
    },
  },
  "Goblin Brunch": {
    image: goblinBrunch,
    description: {
      en: "A traditional Goblin dish",
      pt: "A traditional Goblin dish",
      "zh-CN": "A traditional Goblin dish",
      fr: "A traditional Goblin dish",
      tk: "A traditional Goblin dish",
    },
    opensea: {
      description:
        "A traditional Goblin dish. You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/542.png",
    },
  },
  "Fruit Salad": {
    image: fruitSalad,
    description: {
      en: "Fruit Salad, Yummy Yummy",
      pt: "Fruit Salad, Yummy Yummy",
      "zh-CN": "Fruit Salad, Yummy Yummy",
      fr: "Fruit Salad, Yummy Yummy",
      tk: "Fruit Salad, Yummy Yummy",
    },
    opensea: {
      description: "Fruit Salad. You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/543.png",
    },
  },
  "Kale Omelette": {
    image: kaleOmelette,
    description: {
      en: "A healthy breakfast",
      pt: "A healthy breakfast",
      "zh-CN": "A healthy breakfast",
      fr: "A healthy breakfast",
      tk: "A healthy breakfast",
    },
    opensea: {
      description:
        "A healthy breakfast. You can can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/544.png",
    },
  },
  "Cabbers n Mash": {
    image: cabbersNMash,
    description: {
      en: "Cabbages and Mashed Potatoes",
      pt: "Cabbages and Mashed Potatoes",
      "zh-CN": "Cabbages and Mashed Potatoes",
      fr: "Cabbages and Mashed Potatoes",
      tk: "Cabbages and Mashed Potatoes",
    },
    opensea: {
      description:
        "Cabbages and Mashed Potatoes. You can can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/545.png",
    },
  },
  "Fancy Fries": {
    image: fancyFries,
    description: {
      en: "Fantastic Fries",
      pt: "Fantastic Fries",
      "zh-CN": "Fantastic Fries",
      fr: "Fantastic Fries",
      tk: "Fantastic Fries",
    },
    opensea: {
      description: "Fantastic Fries. You can cook this at the Deli.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/546.png",
    },
  },
  "Banana Blast": {
    image: bananaBlast,
    description: {
      en: "The ultimate fruity fuel for those with a peel for power!",
      pt: "The ultimate fruity fuel for those with a peel for power!",
      "zh-CN": "The ultimate fruity fuel for those with a peel for power!",
      fr: "The ultimate fruity fuel for those with a peel for power!",
      tk: "The ultimate fruity fuel for those with a peel for power!",
    },
    opensea: {
      description: "The ultimate fruity fuel for those with a peel for power!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/554.png",
    },
  },
  Wood: {
    image: SUNNYSIDE.resource.wood,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by chopping down trees.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/601.png",
    },
  },
  Stone: {
    image: SUNNYSIDE.resource.stone,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining stone mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/602.png",
    },
  },
  Iron: {
    image: iron,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining iron mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/603.png",
    },
  },
  Crimstone: {
    image: crimstone,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining crimstone mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/636.png",
    },
  },
  Gold: {
    image: gold,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining gold mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/604.png",
    },
  },
  Diamond: {
    image: SUNNYSIDE.resource.diamond,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining diamond mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/617.png",
    },
  },
  Sunstone: {
    image: sunstone,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining sunstone mines.\n\nIt is used in a range of different crafting recipes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/638.png",
    },
  },
  Oil: {
    image: oil,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by mining oil mines.\n\nIt is used to power machinery and boost cooking speed.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/639.png",
    },
  },
  Egg: {
    image: SUNNYSIDE.resource.egg,
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
    opensea: {
      description:
        "A resource collected by taking care of chickens.\n\nIt is used in a range of different crafting recipes.\n\nAt Sunflower Land, the egg came first.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/605.png",
    },
  },
  Chicken: {
    image: SUNNYSIDE.resource.chicken,
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
    opensea: {
      description:
        "A resource used to collect eggs.\n\nIt can be purchased at the barn.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/606.gif",
    },
  },
  Cow: {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
    opensea: {
      description:
        "A resource used to collect milk.\n\nIt can be purchased at the barn.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/607.png",
    },
  },
  Sheep: {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
    opensea: {
      description:
        "A resource used to collect wool.\n\nIt can be purchased at the barn.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/609.png",
    },
  },
  Pig: {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
    opensea: {
      description:
        "A resource used to collect manure.\n\nIt can be purchased at the barn.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/608.png",
    },
  },
  Axe: {
    image: SUNNYSIDE.tools.axe,
    description: {
      en: "Used to chop wood",
      pt: "Used to chop wood",
      "zh-CN": "Used to chop wood",
      fr: "Used to chop wood",
      tk: "Used to chop wood",
    },
    opensea: {
      description:
        "A tool used to chop wood. It is burnt after use.\n\nYou can craft an axe at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/301.png",
    },
  },
  Pickaxe: {
    image: SUNNYSIDE.tools.wood_pickaxe,
    description: {
      en: "Used to mine stone",
      pt: "Used to mine stone",
      "zh-CN": "Used to mine stone",
      fr: "Used to mine stone",
      tk: "Used to mine stone",
    },
    opensea: {
      description:
        "A tool used to mine stone. It is burnt after use.\n\nYou can craft a pickaxe at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/302.png",
    },
  },
  "Stone Pickaxe": {
    image: SUNNYSIDE.tools.stone_pickaxe,
    description: {
      en: "Used to mine iron",
      pt: "Used to mine iron",
      "zh-CN": "Used to mine iron",
      fr: "Used to mine iron",
      tk: "Used to mine iron",
    },
    opensea: {
      description:
        "A tool used to mine iron. It is burnt after use.\n\nYou can craft a stone pickaxe at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/303.png",
    },
  },
  "Iron Pickaxe": {
    image: SUNNYSIDE.tools.iron_pickaxe,
    description: {
      en: "Used to mine gold",
      pt: "Used to mine gold",
      "zh-CN": "Used to mine gold",
      fr: "Used to mine gold",
      tk: "Used to mine gold",
    },
    opensea: {
      description:
        "A tool used to mine gold. It is burnt after use.\n\nYou can craft an iron pickaxe at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/304.png",
    },
  },
  "Gold Pickaxe": {
    image: SUNNYSIDE.tools.gold_pickaxe,
    description: {
      en: "Used to mine crimstone and sunstone",
      pt: "Used to mine crimstone and sunstone",
      "zh-CN": "Used to mine crimstone and sunstone",
      fr: "Used to mine crimstone and sunstone",
      tk: "Used to mine crimstone and sunstone",
    },
    opensea: {
      description:
        "A tool used to mine crimstones and sunstones. It is burnt after use.\n\nYou can craft a gold pickaxe at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/304.png",
    },
  },
  Hammer: {
    image: SUNNYSIDE.tools.hammer,
    description: {
      en: "Coming soon",
      pt: "Coming soon",
      "zh-CN": "Coming soon",
      fr: "Coming soon",
      tk: "Coming soon",
    },
    opensea: {
      description:
        "A tool used to upgrade buildings.\n\nYou can craft a hammer at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/305.png",
    },
  },
  Rod: {
    image: SUNNYSIDE.tools.fishing_rod,
    description: {
      en: "Used to catch fish",
      pt: "Used to catch fish",
      "zh-CN": "Used to catch fish",
      fr: "Used to catch fish",
      tk: "Used to catch fish",
    },
    opensea: {
      description:
        "A tool used to capture fish.\n\nYou can craft a rod at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/306.png",
    },
  },
  "Rusty Shovel": {
    image: SUNNYSIDE.tools.rusty_shovel,
    description: {
      en: "Used to remove buildings and collectibles",
      pt: "Used to remove buildings and collectibles",
      "zh-CN": "Used to remove buildings and collectibles",
      fr: "Used to remove buildings and collectibles",
      tk: "Used to remove buildings and collectibles",
    },
    opensea: {
      description:
        "Used to remove buildings and collectibles\n\nYou can craft a rusty shovel at the Workbench in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/307.png",
    },
  },
  Shovel: {
    image: SUNNYSIDE.tools.shovel,
    description: {
      en: "Plant and harvest crops.",
      pt: "Plant and harvest crops.",
      "zh-CN": "Plant and harvest crops.",
      fr: "Plant and harvest crops.",
      tk: "Plant and harvest crops.",
    },
    opensea: {
      description:
        "A tool used to remove unwanted crops.\n\nYou can craft a shovel at the Workbench in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/308.png",
    },
  },
  "Sand Shovel": {
    image: SUNNYSIDE.tools.sand_shovel,
    description: {
      en: "Used for digging treasure",
      pt: "Usado para escavar tesouros",
      "zh-CN": "用来挖宝藏",
      fr: "Utilisé pour creuser des trésors",
      tk: "Hazine kazmak için kullanılır",
    },
    opensea: {
      description:
        "There are rumours that the Bumpkin pirates hid their treasure somewhere. These shovels can be used to dig for treasure!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/310.png",
    },
  },
  "Sand Drill": {
    image: drill,
    description: {
      en: "Drill deep for uncommon or rare treasure",
      pt: "Perfurar profundamente por tesouros incomuns ou raros",
      "zh-CN": "深入挖掘不寻常或稀有的宝藏",
      fr: "Creusez profondément pour trouver des trésors peu communs ou rares",
      tk: "Sıra dışı veya nadir hazineler için derinlere inin",
    },
    opensea: {
      description: "Drill deep for uncommon or rare treasure",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/311.png",
    },
  },
  "Oil Drill": {
    image: oilDrill,
    description: {
      en: "Drill for oil",
      pt: "Drill for oil",
      "zh-CN": "石油钻探",
      fr: "Drill for oil",
      tk: "Drill for oil",
    },
    opensea: {
      description:
        "A tool used to drill for oil. It is burnt after use.\n\nYou can craft an oil drill at the Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Tool",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/313.png",
    },
  },
  "Block Buck": {
    image: blockBuck,
    description: {
      en: "A valuable token in Sunflower Land!",
      pt: "Um token valioso em Sunflower Land!",
      "zh-CN": "A valuable token in Sunflower Land!",
      fr: "Un jeton précieux dans Sunflower Land!",
      tk: "Ayçiçeği Ülkesinde değerli bir jeton!",
    },
    opensea: {
      description: "A valuable token in Sunflower Land!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/718.png",
    },
  },
  "Sunflower Statue": {
    image: sunflowerStatue,
    description: {
      en: "A symbol of the holy token",
      pt: "A symbol of the holy token",
      "zh-CN": "A symbol of the holy token",
      fr: "A symbol of the holy token",
      tk: "A symbol of the holy token",
    },
    opensea: {
      description:
        "A symbol of the holy Sunflower Land Token. Flex your loyalty and farming status with this rare statue.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/401.png",
    },
  },
  "Potato Statue": {
    image: potatoStatue,
    description: {
      en: "The OG potato hustler flex",
      pt: "The OG potato hustler flex",
      "zh-CN": "The OG potato hustler flex",
      fr: "The OG potato hustler flex",
      tk: "The OG potato hustler flex",
    },
    opensea: {
      description:
        "A rare collectible for the potato hustlers of Sunflower Land.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/402.png",
    },
  },
  Nancy: {
    image: nancy,
    description: {
      en: "Keeps a few crows away. Crops grow 15% faster",
      pt: "Keeps a few crows away. Crops grow 15% faster",
      "zh-CN": "Keeps a few crows away. Crops grow 15% faster",
      fr: "Keeps a few crows away. Crops grow 15% faster",
      tk: "Keeps a few crows away. Crops grow 15% faster",
    },
    opensea: {
      description:
        "A brave scarecrow that keeps your crops safe from crows. Ensures your crops grow faster when placed on your farm.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Crop Growth Time",
          value: -15,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/420.png",
    },
  },
  Scarecrow: {
    image: scarecrow,
    description: {
      en: "A goblin scarecrow. Yield 20% more crops",
      pt: "A goblin scarecrow. Yield 20% more crops",
      "zh-CN": "A goblin scarecrow. Yield 20% more crops",
      fr: "A goblin scarecrow. Yield 20% more crops",
      tk: "A goblin scarecrow. Yield 20% more crops",
    },
    opensea: {
      description:
        "Ensures your crops grow faster when placed on your farm.\n\nRumour has it that it is crafted with a Goblin head from the great war.\n\nIncludes boosts from [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/404.png",
    },
  },
  Kuebiko: {
    image: kuebiko,
    description: {
      en: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      pt: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      "zh-CN":
        "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      fr: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      tk: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    },
    opensea: {
      description:
        "An extremely rare item in Sunflower Land. This scarecrow cannot move but has in-depth knowledge of the history of the Sunflower Wars.\n\nThis scarecrow is so scary that it even frightens Bumpkins. If you have this item, all seeds are free from the market.\n\nIncludes boosts from [Scarecrow](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/404) and [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/421.gif",
    },
  },
  "Christmas Tree": {
    image: christmasTree,
    description: {
      en: "Receive a Santa Airdrop on Christmas day",
      pt: "Receive a Santa Airdrop on Christmas day",
      "zh-CN": "Receive a Santa Airdrop on Christmas day",
      fr: "Receive a Santa Airdrop on Christmas day",
      tk: "Receive a Santa Airdrop on Christmas day",
    },
    opensea: {
      description:
        "Place on your farm during the Festive Season to get a spot and Santa's nice list!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/403.png",
    },
  },
  Gnome: {
    image: gnome,
    description: {
      en: "A lucky gnome",
      pt: "A lucky gnome",
      "zh-CN": "A lucky gnome",
      fr: "A lucky gnome",
      tk: "A lucky gnome",
    },
    opensea: {
      description:
        "A lucky gnome. Currently used for decoration purposes\n\n~~You can craft a gnome at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_number",
          trait_type:
            "Increase Medium and Advanced Crop Yield when placed between Clementine and Cobalt",
          value: 10,
        },
        {
          display_type: "boost_number",
          trait_type: "Plots Affected",
          value: 1,
        },
      ],
      image: "../public/erc1155/images/407.png",
    },
  },
  "Gold Egg": {
    image: goldEgg,
    description: {
      en: "Feed chickens without needing wheat",
      pt: "Feed chickens without needing wheat",
      "zh-CN": "Feed chickens without needing wheat",
      fr: "Feed chickens without needing wheat",
      tk: "Feed chickens without needing wheat",
    },
    opensea: {
      description:
        "A golden egg. What lays inside is known to be the bearer of good fortune.\n\n\n\nFeed chickens without wheat.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          display_type: "boost_number",
          trait_type: "Feed chickens without Wheat",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/409.gif",
    },
  },
  "Farm Cat": {
    image: farmCat,
    description: {
      en: "Keep the rats away",
      pt: "Keep the rats away",
      "zh-CN": "Keep the rats away",
      fr: "Keep the rats away",
      tk: "Keep the rats away",
    },
    opensea: {
      description:
        "Keep the rats away with this rare item. Currently used for decoration purposes.\n\n~~You can craft a Cat at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/405.gif",
    },
  },
  "Farm Dog": {
    image: farmDog,
    description: {
      en: "Herd sheep with your farm dog",
      pt: "Herd sheep with your farm dog",
      "zh-CN": "Herd sheep with your farm dog",
      fr: "Herd sheep with your farm dog",
      tk: "Herd sheep with your farm dog",
    },
    opensea: {
      description:
        "Sheep are no longer lazy when this farm dog is around. Increases wool production. Currently used for decoration purposes.\n\n~~You can craft a dog at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/406.gif",
    },
  },
  "Chicken Coop": {
    image: chickenCoop,
    description: {
      en: "Collect 2x the amount of eggs",
      pt: "Collect 2x the amount of eggs",
      "zh-CN": "Collect 2x the amount of eggs",
      fr: "Collect 2x the amount of eggs",
      tk: "Collect 2x the amount of eggs",
    },
    opensea: {
      description:
        "A chicken coop that can be used to raise chickens. Increase egg production with this rare coop on your farm.\n\n~~You can craft a chicken coop at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Egg Production",
          value: 100,
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Max Chickens per Hen House",
          value: 5,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/408.png",
    },
  },
  "Golden Cauliflower": {
    image: goldenCauliflower,
    description: {
      en: "Doubles cauliflower yield",
      pt: "Doubles cauliflower yield",
      "zh-CN": "Doubles cauliflower yield",
      fr: "Doubles cauliflower yield",
      tk: "Doubles cauliflower yield",
    },
    opensea: {
      description:
        "It is rumoured that a farmer created a golden fertiliser which produced this magical Cauliflower.\n\nFor some reason, when this Cauliflower is on your farm you receive twice the rewards from growing Cauliflowers.\n\n~~You can craft a Golden Cauliflower at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Cauliflower Yield",
          value: 100,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/410.png",
    },
  },
  "Sunflower Rock": {
    image: sunflowerRock,
    description: {
      en: "The game that broke Polygon",
      pt: "The game that broke Polygon",
      "zh-CN": "The game that broke Polygon",
      fr: "The game that broke Polygon",
      tk: "The game that broke Polygon",
    },
    opensea: {
      description:
        "Remember the time Sunflower Farmers 'broke' Polygon? Those days are gone with Sunflower Land!\n\nThis is an extremely rare decoration for your farm.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/412.png",
    },
  },
  "Sunflower Tombstone": {
    image: sunflowerTombstone,
    description: {
      en: "In memory of Sunflower Farmers",
      pt: "In memory of Sunflower Farmers",
      "zh-CN": "In memory of Sunflower Farmers",
      fr: "In memory of Sunflower Farmers",
      tk: "In memory of Sunflower Farmers",
    },
    opensea: {
      description:
        "A commemorative homage to Sunflower Farmers, the prototype which birthed Sunflower Land.\n\nThis item was airdropped to anyone who maxed out their farm to level 5.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/411.png",
    },
  },
  "Goblin Crown": {
    image: crown,
    description: {
      en: "Summon the leader of the Goblins",
      pt: "Summon the leader of the Goblins",
      "zh-CN": "Summon the leader of the Goblins",
      fr: "Summon the leader of the Goblins",
      tk: "Summon the leader of the Goblins",
    },
    opensea: {
      description:
        "Summon the Goblin leader and reveal who the mastermind is behind the Goblin resistance.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/413.png",
    },
  },
  Fountain: {
    image: fountain,
    description: {
      en: "A relaxing fountain for your farm",
      pt: "A relaxing fountain for your farm",
      "zh-CN": "A relaxing fountain for your farm",
      fr: "A relaxing fountain for your farm",
      tk: "A relaxing fountain for your farm",
    },
    opensea: {
      description:
        "A beautiful fountain that relaxes all Bumpkins.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/414.gif",
    },
  },
  "Woody the Beaver": {
    image: beaver,
    description: {
      en: "Increase wood drops by 20%",
      pt: "Increase wood drops by 20%",
      "zh-CN": "Increase wood drops by 20%",
      fr: "Increase wood drops by 20%",
      tk: "Increase wood drops by 20%",
    },
    opensea: {
      description:
        "During the great wood shortage, Bumpkins created an alliance with the Beaver population.\n\nIncreases wood production.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Wood Drops",
          value: 20,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/415.gif",
    },
  },
  "Apprentice Beaver": {
    image: apprenticeBeaver,
    description: {
      en: "Trees recover 50% faster",
      pt: "Trees recover 50% faster",
      "zh-CN": "Trees recover 50% faster",
      fr: "Trees recover 50% faster",
      tk: "Trees recover 50% faster",
    },
    opensea: {
      description:
        "A well trained Beaver who has aspirations of creating a wood monopoly.\n\nIncreases wood replenishment rates.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**\n\nIncludes boosts from [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Wood Drops",
          value: 20,
        },
        {
          display_type: "boost_percentage",
          trait_type: "Tree Recovery Time",
          value: -50,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/416.gif",
    },
  },
  "Foreman Beaver": {
    image: constructionBeaver,
    description: {
      en: "Cut trees without axes",
      pt: "Cut trees without axes",
      "zh-CN": "Cut trees without axes",
      fr: "Cut trees without axes",
      tk: "Cut trees without axes",
    },
    opensea: {
      description:
        "A master of construction, carving and all things wood related.\n\nChop trees without axes.\n\nIncludes boosts from [Apprentice Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/416) and [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Wood Drops",
          value: 20,
        },
        {
          display_type: "boost_percentage",
          trait_type: "Tree Recovery Time",
          value: -50,
        },
        {
          display_type: "boost_number",
          trait_type: "Cut trees without axe",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/417.gif",
    },
  },
  "Mysterious Parsnip": {
    image: mysteriousParsnip,
    description: {
      en: "Parsnips grow 50% faster",
      pt: "Parsnips grow 50% faster",
      "zh-CN": "Parsnips grow 50% faster",
      fr: "Parsnips grow 50% faster",
      tk: "Parsnips grow 50% faster",
    },
    opensea: {
      description:
        "No one knows where this parsnip came from, but when it is on your farm Parsnips grow 50% faster.\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Parsnip Growth Time",
          value: -50,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/418.png",
    },
  },
  "Carrot Sword": {
    image: carrotSword,
    description: {
      en: "Increase chance of a mutant crop appearing",
      pt: "Increase chance of a mutant crop appearing",
      "zh-CN": "Increase chance of a mutant crop appearing",
      fr: "Increase chance of a mutant crop appearing",
      tk: "Increase chance of a mutant crop appearing",
    },
    opensea: {
      description:
        "Legend has it that only a true farmer can yield this sword.\n\nIncreases the chance of finding a mutant crop by 300%!\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increases chance of Mutant Crop",
          value: 300,
        },
      ],
      image: "../public/erc1155/images/419.png",
    },
  },
  "Golden Bonsai": {
    image: goldenBonsai,
    description: {
      en: "Goblins love bonsai too",
      pt: "Goblins love bonsai too",
      "zh-CN": "Goblins love bonsai too",
      fr: "Goblins love bonsai too",
      tk: "Goblins love bonsai too",
    },
    opensea: {
      description:
        "The pinnacle of goblin style and sophistication. A Golden Bonsai is the perfect piece to tie your farm together.\n\n~~You can only get this item trading with the Traveling Salesman in the game. ~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/426.png",
    },
  },
  "Nyon Statue": {
    image: nyonStatue,
    description: {
      en: "In memory of Nyon Lann",
      pt: "In memory of Nyon Lann",
      "zh-CN": "In memory of Nyon Lann",
      fr: "In memory of Nyon Lann",
      tk: "In memory of Nyon Lann",
    },
    opensea: {
      description:
        "A homage to Sir Nyon who died at the battle of the Goblin mines.\n\n~~You can craft the Nyon Statue at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/422.png",
    },
  },
  "Homeless Tent": {
    image: homelessTent,
    description: {
      en: "A nice and cozy tent",
      pt: "A nice and cozy tent",
      "zh-CN": "A nice and cozy tent",
      fr: "A nice and cozy tent",
      tk: "A nice and cozy tent",
    },
    opensea: {
      description:
        "A nice and cozy tent.\n\n~~You can craft the Homeless Tent at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/424.png",
    },
  },
  "Farmer Bath": {
    image: farmerBath,
    description: {
      en: "A beetroot scented bath for the farmers",
      pt: "A beetroot scented bath for the farmers",
      "zh-CN": "A beetroot scented bath for the farmers",
      fr: "A beetroot scented bath for the farmers",
      tk: "A beetroot scented bath for the farmers",
    },
    opensea: {
      description:
        "A beetroot scented bath for your farmer.\n\nAfter a long day of farming potatoes and fighting off Goblins, this is the perfect relaxation device for your hard working farmer.\n\nYou can craft the Farmer Bath at the Goblin Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/423.png",
    },
  },
  "Mysterious Head": {
    image: mysteriousHead,
    description: {
      en: "A statue thought to protect farmers",
      pt: "A statue thought to protect farmers",
      "zh-CN": "A statue thought to protect farmers",
      fr: "A statue thought to protect farmers",
      tk: "A statue thought to protect farmers",
    },
    opensea: {
      description:
        "A Mysterious Head said to protect farmers.\n\nYou can craft the Mysterious Head at the Goblin Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/425.png",
    },
  },
  "Tunnel Mole": {
    image: tunnelMole,
    description: {
      en: "Gives a 25% increase to stone mines",
      pt: "Gives a 25% increase to stone mines",
      "zh-CN": "Gives a 25% increase to stone mines",
      fr: "Gives a 25% increase to stone mines",
      tk: "Gives a 25% increase to stone mines",
    },
    opensea: {
      description:
        "The tunnel mole gives a 25% increase to stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Stone Drops",
          value: 0.25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/428.gif",
    },
  },
  "Rocky the Mole": {
    image: rockyMole,
    description: {
      en: "Gives a 25% increase to iron mines",
      pt: "Gives a 25% increase to iron mines",
      "zh-CN": "Gives a 25% increase to iron mines",
      fr: "Gives a 25% increase to iron mines",
      tk: "Gives a 25% increase to iron mines",
    },
    opensea: {
      description:
        "\"Life's not about how much iron you can mine... it's about how much more you can mine, and still keep mining.\" - Rocky the Mole\n\nRocky the Mole gives a 25% increase to iron mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Iron Drops",
          value: 0.25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/429.gif",
    },
  },
  Nugget: {
    image: nugget,
    description: {
      en: "Gives a 25% increase to gold mines",
      pt: "Gives a 25% increase to gold mines",
      "zh-CN": "Gives a 25% increase to gold mines",
      fr: "Gives a 25% increase to gold mines",
      tk: "Gives a 25% increase to gold mines",
    },
    opensea: {
      description:
        "Seldom seen above ground, this gold digger burrows day and night searching for the next gold rush.\n\nStrike gold with this little critter! Eureka!\n\nNugget gives a 25% increase to gold mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Gold Drops",
          value: 0.25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/430.gif",
    },
  },
  "Rock Golem": {
    image: rockGolem,
    description: {
      en: "Gives a 10% chance to get 3x stone",
      pt: "Gives a 10% chance to get 3x stone",
      "zh-CN": "Gives a 10% chance to get 3x stone",
      fr: "Gives a 10% chance to get 3x stone",
      tk: "Gives a 10% chance to get 3x stone",
    },
    opensea: {
      description:
        "The Rock Golem is the protector of Stone.\n\nMining stone causes the Golem to be become enraged giving a 10% chance to get 3x stone from stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Stone Critical Hit Amount",
          value: 2,
        },
        {
          display_type: "boost_percentage",
          trait_type: "Stone Critical Hit Chance",
          value: 10,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/427.gif",
    },
  },
  Rooster: {
    image: rooster,
    description: {
      en: "Doubles the chance of dropping a mutant chicken",
      pt: "Doubles the chance of dropping a mutant chicken",
      "zh-CN": "Doubles the chance of dropping a mutant chicken",
      fr: "Doubles the chance of dropping a mutant chicken",
      tk: "Doubles the chance of dropping a mutant chicken",
    },
    opensea: {
      description:
        "Rooster increases the chance of getting a mutant chicken 2x.\n\nYou can craft this item at the Goblin Farmer in the game.",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Increase Mutant Chicken Chance",
          value: 100,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/613.gif",
    },
  },
  "Wicker Man": {
    image: wickerMan,
    description: {
      en: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      pt: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      "zh-CN":
        "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      fr: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      tk: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
    },
    opensea: {
      description:
        "Join hands and make a chain, the shadow of the Wicker Man will rise up again.\n\nYou can only get this item trading with the Traveling Salesman in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/431.png",
    },
  },
  "Pumpkin Soup": {
    image: pumpkinSoup,
    description: {
      en: "A creamy soup that goblins love",
      pt: "A creamy soup that goblins love",
      "zh-CN": "A creamy soup that goblins love",
      fr: "A creamy soup that goblins love",
      tk: "A creamy soup that goblins love",
    },
    opensea: {
      description:
        "A creamy soup that Goblins love! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/501.png",
    },
  },
  "Roasted Cauliflower": {
    image: roastedCauliflower,
    description: {
      en: "A Goblin's favourite",
      pt: "A Goblin's favourite",
      "zh-CN": "A Goblin's favourite",
      fr: "A Goblin's favourite",
      tk: "A Goblin's favourite",
    },
    opensea: {
      description:
        "A Goblin’s favourite! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/502.png",
    },
  },
  "Radish Pie": {
    image: radishPie,
    description: {
      en: "Despised by humans, loved by goblins",
      pt: "Despised by humans, loved by goblins",
      "zh-CN": "Despised by humans, loved by goblins",
      fr: "Despised by humans, loved by goblins",
      tk: "Despised by humans, loved by goblins",
    },
    opensea: {
      description:
        "Despised by humans, loved by Goblins! Owning this item unlocks crop seeds.\n\nYou can craft this item at the Kitchen in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/504.png",
    },
  },
  "Beetroot Cake": {
    image: beetrootCake,
    description: {
      en: "Beetroot Cake",
      pt: "Beetroot Cake",
      "zh-CN": "Beetroot Cake",
      fr: "Beetroot Cake",
      tk: "Beetroot Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/510.png",
    },
  },
  "Cabbage Cake": {
    image: cabbageCake,
    description: {
      en: "Cabbage Cake",
      pt: "Cabbage Cake",
      "zh-CN": "Cabbage Cake",
      fr: "Cabbage Cake",
      tk: "Cabbage Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/509.png",
    },
  },
  "Carrot Cake": {
    image: carrotCake,
    description: {
      en: "Carrot Cake",
      pt: "Carrot Cake",
      "zh-CN": "Carrot Cake",
      fr: "Carrot Cake",
      tk: "Carrot Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/508.png",
    },
  },
  "Cauliflower Cake": {
    image: cauliflowerCake,
    description: {
      en: "Cauliflower Cake",
      pt: "Cauliflower Cake",
      "zh-CN": "Cauliflower Cake",
      fr: "Cauliflower Cake",
      tk: "Cauliflower Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/511.png",
    },
  },
  "Parsnip Cake": {
    image: parsnipCake,
    description: {
      en: "Parsnip Cake",
      pt: "Parsnip Cake",
      "zh-CN": "Parsnip Cake",
      fr: "Parsnip Cake",
      tk: "Parsnip Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/512.png",
    },
  },
  "Potato Cake": {
    image: potatoCake,
    description: {
      en: "Potato Cake",
      pt: "Potato Cake",
      "zh-CN": "Potato Cake",
      fr: "Potato Cake",
      tk: "Potato Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/506.png",
    },
  },
  "Pumpkin Cake": {
    image: pumpkinCake,
    description: {
      en: "Pumpkin Cake",
      pt: "Pumpkin Cake",
      "zh-CN": "Pumpkin Cake",
      fr: "Pumpkin Cake",
      tk: "Pumpkin Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/507.png",
    },
  },
  "Radish Cake": {
    image: radishCake,
    description: {
      en: "Radish Cake",
      pt: "Radish Cake",
      "zh-CN": "Radish Cake",
      fr: "Radish Cake",
      tk: "Radish Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/513.png",
    },
  },
  "Sunflower Cake": {
    image: sunflowerCake,
    description: {
      en: "Sunflower Cake",
      pt: "Sunflower Cake",
      "zh-CN": "Sunflower Cake",
      fr: "Sunflower Cake",
      tk: "Sunflower Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/505.png",
    },
  },
  "Wheat Cake": {
    image: wheatCake,
    description: {
      en: "Wheat Cake",
      pt: "Wheat Cake",
      "zh-CN": "Wheat Cake",
      fr: "Wheat Cake",
      tk: "Wheat Cake",
    },
    opensea: {
      description:
        "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/514.png",
    },
  },
  "Green Thumb": {
    image: greenThumb,
    description: {
      en: "Crops are worth 5% more",
      pt: "Crops are worth 5% more",
      "zh-CN": "Crops are worth 5% more",
      fr: "Crops are worth 5% more",
      tk: "Crops are worth 5% more",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
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
      image: "../public/erc1155/images/701.png",
    },
  },
  "Barn Manager": {
    image: barnManager,
    description: {
      en: "Animals yield 10% more goods",
      pt: "Animals yield 10% more goods",
      "zh-CN": "Animals yield 10% more goods",
      fr: "Animals yield 10% more goods",
      tk: "Animals yield 10% more goods",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Animal Yield",
          value: 5,
        },
      ],
      image: "../public/erc1155/images/702.png",
    },
  },
  "Seed Specialist": {
    image: seedSpecialist,
    description: {
      en: "Crops grow 10% faster",
      pt: "Crops grow 10% faster",
      "zh-CN": "Crops grow 10% faster",
      fr: "Crops grow 10% faster",
      tk: "Crops grow 10% faster",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
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
      image: "../public/erc1155/images/703.png",
    },
  },
  Wrangler: {
    image: wrangler,
    description: {
      en: "Animals produce goods 10% faster",
      pt: "Animals produce goods 10% faster",
      "zh-CN": "Animals produce goods 10% faster",
      fr: "Animals produce goods 10% faster",
      tk: "Animals produce goods 10% faster",
    },
    opensea: {
      description:
        "~~A skill that can be learnt when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Animal Produce Time",
          value: -10,
        },
      ],
      image: "../public/erc1155/images/704.png",
    },
  },
  Lumberjack: {
    image: lumberjack,
    description: {
      en: "Increase wood drops by 10%",
      pt: "Increase wood drops by 10%",
      "zh-CN": "Increase wood drops by 10%",
      fr: "Increase wood drops by 10%",
      tk: "Increase wood drops by 10%",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Wood drop increase",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/705.png",
    },
  },
  Prospector: {
    image: prospector,
    description: {
      en: "Increase stone drops by 20%",
      pt: "Increase stone drops by 20%",
      "zh-CN": "Increase stone drops by 20%",
      fr: "Increase stone drops by 20%",
      tk: "Increase stone drops by 20%",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Stone drop increase",
          value: 20,
        },
      ],
      image: "../public/erc1155/images/706.png",
    },
  },
  Logger: {
    image: logger,
    description: {
      en: "Axes last 50% longer",
      pt: "Axes last 50% longer",
      "zh-CN": "Axes last 50% longer",
      fr: "Axes last 50% longer",
      tk: "Axes last 50% longer",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Axe Strength",
          value: 200,
        },
      ],
      image: "../public/erc1155/images/707.png",
    },
  },
  "Gold Rush": {
    image: goldRush,
    description: {
      en: "Increase gold drops by 50%",
      pt: "Increase gold drops by 50%",
      "zh-CN": "Increase gold drops by 50%",
      fr: "Increase gold drops by 50%",
      tk: "Increase gold drops by 50%",
    },
    opensea: {
      description:
        "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Gold Drops",
          value: 50,
        },
      ],
      image: "../public/erc1155/images/708.png",
    },
  },
  Artist: {
    image: artist,
    description: {
      en: "Save 10% on shop & blacksmith tools",
      pt: "Save 10% on shop & blacksmith tools",
      "zh-CN": "Save 10% on shop & blacksmith tools",
      fr: "Save 10% on shop & blacksmith tools",
      tk: "Save 10% on shop & blacksmith tools",
    },
    opensea: {
      description:
        "~~A skill that can be earned by contributing art to the game.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Tools discount",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/709.png",
    },
  },
  Coder: {
    image: coder,
    description: {
      en: "Crops yield 20% more",
      pt: "Crops yield 20% more",
      "zh-CN": "Crops yield 20% more",
      fr: "Crops yield 20% more",
      tk: "Crops yield 20% more",
    },
    opensea: {
      description:
        "~~A skill that can be earned by contributing code to the game.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Crop Yield",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/710.png",
    },
  },
  "Liquidity Provider": {
    image: liquidityProvider,
    description: {
      en: "50% reduced SFL withdrawal fee",
      pt: "50% reduced SFL withdrawal fee",
      "zh-CN": "50% reduced SFL withdrawal fee",
      fr: "50% reduced SFL withdrawal fee",
      tk: "50% reduced SFL withdrawal fee",
    },
    opensea: {
      description:
        "~~A skill that can be earned by providing liquidity.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Withdrawal fee discount",
          value: 50,
        },
      ],
      image: "../public/erc1155/images/711.png",
    },
  },
  "Discord Mod": {
    image: discord,
    description: {
      en: "Yield 35% more wood",
      pt: "Yield 35% more wood",
      "zh-CN": "Yield 35% more wood",
      fr: "Yield 35% more wood",
      tk: "Yield 35% more wood",
    },
    opensea: {
      description:
        "~~A skill that can be earned by moderating Discord.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Boost",
          value: "Skill",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Wood Drops",
          value: 35,
        },
      ],
      image: "../public/erc1155/images/712.png",
    },
  },
  Warrior: {
    image: warrior,
    description: {
      en: "Early access to land expansion",
      pt: "Early access to land expansion",
      "zh-CN": "Early access to land expansion",
      fr: "Early access to land expansion",
      tk: "Early access to land expansion",
    },
    opensea: {
      description:
        "~~A skill earned by the top 10 warriors each week.~~ **Not Available**",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/714.png",
    },
  },
  "Trading Ticket": {
    image: ticket,
    description: {
      en: "Free Trades! Woohoo!",
      pt: "Negociações grátis! Uhu!",
      "zh-CN": "Free Trades! Woohoo!",
      fr: "Échanges gratuits ! Hourra!",
      tk: "Serbest Ticaret! Vay be!",
    },
    opensea: {
      description:
        "This ticket grants the owner a free ride in the hot air balloon (a free trade).\n\nUsed automatically when posting a trade.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/713.png",
    },
  },
  "Beta Pass": {
    image: betaPass,
    description: {
      en: "Gain early access to features for testing.",
      pt: "Acesso antecipado a recursos para teste.",
      "zh-CN": "Gain early access to features for testing.",
      fr: "Accédez en avant-première à des fonctionnalités pour les tester.",
      tk: "Test amaçlı özelliklere erken erişim sağlayın.",
    },
    opensea: {
      description: "Gain early access to features for testing.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/715.png",
    },
  },
  "War Bond": {
    image: warBond,
    description: {
      en: "A mark of a true warrior",
      pt: "Uma marca de um verdadeiro guerreiro",
      "zh-CN": "A mark of a true warrior",
      fr: "La marque d'un vrai guerrier",
      tk: "Gerçek bir savaşçının işareti",
    },
    opensea: {
      description:
        "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nWill you show your support?\n\nFor a limited time, the war collectors are offering rare War Bonds in exchange for resources. You can use these to buy rare items in Goblin Village.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/917.png",
    },
  },
  "Goblin War Point": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A display of allegiance",
      pt: "Uma exibição de lealdade",
      "zh-CN": "A display of allegiance",
      fr: "Une déclaration d'allégeance",
      tk: "Bir bağlılık gösterisi",
    },
    opensea: {
      description:
        "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Goblin is providing.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/918.png",
    },
  },
  "Human War Point": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A display of allegiance",
      pt: "Uma exibição de lealdade",
      "zh-CN": "A display of allegiance",
      fr: "Une déclaration d'allégeance",
      tk: "Bir bağlılık gösterisi",
    },
    opensea: {
      description:
        "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Human is providing.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/919.png",
    },
  },
  "Human War Banner": {
    image: humanBanner,
    description: {
      en: "A display of allegiance to the Human cause",
      pt: "Uma exibição de lealdade à causa humana",
      "zh-CN": "彰显为人类伟业献身的盟约",
      fr: "Un affichage d'allégeance à la cause des Humains.",
      tk: "İnsan davasına bağlılığın bir göstergesi",
    },
    opensea: {
      description:
        "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Human cause.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/920.png",
    },
  },
  "Goblin War Banner": {
    image: goblinBanner,
    description: {
      en: "A display of allegiance to the Goblin cause",
      pt: "Uma exibição de lealdade à causa dos Goblins",
      "zh-CN": "彰显为哥布林伟业献身的盟约",
      fr: "Un affichage d'allégeance à la cause des Gobelins.",
      tk: "Goblin davasına bağlılığın bir göstergesi",
    },
    opensea: {
      description:
        "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Goblin cause.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/921.png",
    },
  },
  "Sunflorian Faction Banner": {
    image: sunflorianFactionBanner,
    description: {
      en: "A display of allegiance to the Sunflorian Faction",
      pt: "A display of allegiance to the Sunflorian Faction",
      "zh-CN": "彰显对 Sunflorian 派系的忠心",
      fr: "A display of allegiance to the Sunflorian Faction",
      tk: "A display of allegiance to the Sunflorian Faction",
    },
    opensea: {
      description:
        "A banner that shows your allegiance to the Sunflorian Faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/941.png",
    },
  },
  "Nightshade Faction Banner": {
    image: nightshadeFactionBanner,
    description: {
      en: "A display of allegiance to the Nightshade Faction",
      pt: "A display of allegiance to the Nightshade Faction",
      "zh-CN": "彰显对 Nightshade 派系的忠心",
      fr: "A display of allegiance to the Nightshade Faction",
      tk: "A display of allegiance to the Nightshade Faction",
    },
    opensea: {
      description:
        "A banner that shows your allegiance to the Nightshade Faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/940.png",
    },
  },
  "Bumpkin Faction Banner": {
    image: bumpkinFactionBanner,
    description: {
      en: "A display of allegiance to the Bumpkin Faction",
      pt: "A display of allegiance to the Bumpkin Faction",
      "zh-CN": "彰显对 Bumpkin 派系的忠心",
      fr: "A display of allegiance to the Bumpkin Faction",
      tk: "A display of allegiance to the Bumpkin Faction",
    },
    opensea: {
      description:
        "A banner that shows your allegiance to the Bumpkin Faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/939.png",
    },
  },
  "Goblin Faction Banner": {
    image: goblinFactionBanner,
    description: {
      en: "A display of allegiance to the Goblin Faction",
      pt: "A display of allegiance to the Goblin Faction",
      "zh-CN": "彰显对 Goblin 派系的忠心",
      fr: "A display of allegiance to the Goblin Faction",
      tk: "A display of allegiance to the Goblin Faction",
    },
    opensea: {
      description: "A banner that shows your allegiance to the Goblin Faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/942.png",
    },
  },
  "Australian Flag": {
    image: australiaFlag,
    description: {
      en: "Australian flag",
      pt: "Australian flag",
      "zh-CN": "Australian flag",
      fr: "Australian flag",
      tk: "Australian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/801.gif",
    },
  },
  "Belgian Flag": {
    image: belgiumFlag,
    description: {
      en: "Belgian flag",
      pt: "Belgian flag",
      "zh-CN": "Belgian flag",
      fr: "Belgian flag",
      tk: "Belgian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/802.gif",
    },
  },
  "Brazilian Flag": {
    image: brazilFlag,
    description: {
      en: "Brazilian flag",
      pt: "Brazilian flag",
      "zh-CN": "Brazilian flag",
      fr: "Brazilian flag",
      tk: "Brazilian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/803.gif",
    },
  },
  "Chinese Flag": {
    image: chinaFlag,
    description: {
      en: "Chinese flag",
      pt: "Chinese flag",
      "zh-CN": "Chinese flag",
      fr: "Chinese flag",
      tk: "Chinese flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/804.gif",
    },
  },
  "Finnish Flag": {
    image: finlandFlag,
    description: {
      en: "Finnish flag",
      pt: "Finnish flag",
      "zh-CN": "Finnish flag",
      fr: "Finnish flag",
      tk: "Finnish flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/805.gif",
    },
  },
  "French Flag": {
    image: franceFlag,
    description: {
      en: "French flag",
      pt: "French flag",
      "zh-CN": "French flag",
      fr: "French flag",
      tk: "French flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/806.gif",
    },
  },
  "German Flag": {
    image: germanFlag,
    description: {
      en: "German flag",
      pt: "German flag",
      "zh-CN": "German flag",
      fr: "German flag",
      tk: "German flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/807.gif",
    },
  },
  "Indonesian Flag": {
    image: indonesiaFlag,
    description: {
      en: "Indonesian flag",
      pt: "Indonesian flag",
      "zh-CN": "Indonesian flag",
      fr: "Indonesian flag",
      tk: "Indonesian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/808.gif",
    },
  },
  "Indian Flag": {
    image: indiaFlag,
    description: {
      en: "Indian flag",
      pt: "Indian flag",
      "zh-CN": "Indian flag",
      fr: "Indian flag",
      tk: "Indian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/809.gif",
    },
  },
  "Iranian Flag": {
    image: iranFlag,
    description: {
      en: "Iranian flag",
      pt: "Iranian flag",
      "zh-CN": "Iranian flag",
      fr: "Iranian flag",
      tk: "Iranian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/810.gif",
    },
  },
  "Italian Flag": {
    image: italyFlag,
    description: {
      en: "Italian flag",
      pt: "Italian flag",
      "zh-CN": "Italian flag",
      fr: "Italian flag",
      tk: "Italian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/811.gif",
    },
  },
  "Japanese Flag": {
    image: japanFlag,
    description: {
      en: "Japanese flag",
      pt: "Japanese flag",
      "zh-CN": "Japanese flag",
      fr: "Japanese flag",
      tk: "Japanese flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/812.gif",
    },
  },
  "Moroccan Flag": {
    image: moroccoFlag,
    description: {
      en: "Moroccan flag",
      pt: "Moroccan flag",
      "zh-CN": "Moroccan flag",
      fr: "Moroccan flag",
      tk: "Moroccan flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/813.gif",
    },
  },
  "Dutch Flag": {
    image: netherlandsFlag,
    description: {
      en: "Dutch flag",
      pt: "Dutch flag",
      "zh-CN": "Dutch flag",
      fr: "Dutch flag",
      tk: "Dutch flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/814.gif",
    },
  },
  "Philippine Flag": {
    image: phillipinesFlag,
    description: {
      en: "Philippine flag",
      pt: "Philippine flag",
      "zh-CN": "Philippine flag",
      fr: "Philippine flag",
      tk: "Philippine flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/815.gif",
    },
  },
  "Polish Flag": {
    image: polandFlag,
    description: {
      en: "Polish flag",
      pt: "Polish flag",
      "zh-CN": "Polish flag",
      fr: "Polish flag",
      tk: "Polish flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/816.gif",
    },
  },
  "Portuguese Flag": {
    image: portugalFlag,
    description: {
      en: "Portuguese flag",
      pt: "Portuguese flag",
      "zh-CN": "Portuguese flag",
      fr: "Portuguese flag",
      tk: "Portuguese flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/817.gif",
    },
  },
  "Russian Flag": {
    image: russiaFlag,
    description: {
      en: "Russian flag",
      pt: "Russian flag",
      "zh-CN": "Russian flag",
      fr: "Russian flag",
      tk: "Russian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/818.gif",
    },
  },
  "Saudi Arabian Flag": {
    image: saudiArabiaFlag,
    description: {
      en: "Saudi Arabian flag",
      pt: "Saudi Arabian flag",
      "zh-CN": "Saudi Arabian flag",
      fr: "Saudi Arabian flag",
      tk: "Saudi Arabian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/819.gif",
    },
  },
  "South Korean Flag": {
    image: southKoreaFlag,
    description: {
      en: "South Korean flag",
      pt: "South Korean flag",
      "zh-CN": "South Korean flag",
      fr: "South Korean flag",
      tk: "South Korean flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/820.gif",
    },
  },
  "Spanish Flag": {
    image: spainFlag,
    description: {
      en: "Spanish flag",
      pt: "Spanish flag",
      "zh-CN": "Spanish flag",
      fr: "Spanish flag",
      tk: "Spanish flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/821.gif",
    },
  },
  "Sunflower Flag": {
    image: sunflowerFlag,
    description: {
      en: "Sunflower flag",
      pt: "Sunflower flag",
      "zh-CN": "Sunflower flag",
      fr: "Sunflower flag",
      tk: "Sunflower flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/822.gif",
    },
  },
  "Thai Flag": {
    image: thailandFlag,
    description: {
      en: "Thai flag",
      pt: "Thai flag",
      "zh-CN": "Thai flag",
      fr: "Thai flag",
      tk: "Thai flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/823.gif",
    },
  },
  "Turkish Flag": {
    image: turkeyFlag,
    description: {
      en: "Turkish flag",
      pt: "Turkish flag",
      "zh-CN": "Turkish flag",
      fr: "Turkish flag",
      tk: "Turkish flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/824.gif",
    },
  },
  "Ukrainian Flag": {
    image: ukraineFlag,
    description: {
      en: "Ukrainian flag",
      pt: "Ukrainian flag",
      "zh-CN": "Ukrainian flag",
      fr: "Ukrainian flag",
      tk: "Ukrainian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/825.gif",
    },
  },
  "American Flag": {
    image: usaFlag,
    description: {
      en: "American flag",
      pt: "American flag",
      "zh-CN": "American flag",
      fr: "American flag",
      tk: "American flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/826.gif",
    },
  },
  "Vietnamese Flag": {
    image: vietnamFlag,
    description: {
      en: "Vietnamese flag",
      pt: "Vietnamese flag",
      "zh-CN": "Vietnamese flag",
      fr: "Vietnamese flag",
      tk: "Vietnamese flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/827.gif",
    },
  },
  "Canadian Flag": {
    image: canadian_flag,
    description: {
      en: "Canadian flag",
      pt: "Canadian flag",
      "zh-CN": "Canadian flag",
      fr: "Canadian flag",
      tk: "Canadian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/828.gif",
    },
  },
  "Singaporean Flag": {
    image: singaporean_flag,
    description: {
      en: "Singaporean flag",
      pt: "Singaporean flag",
      "zh-CN": "Singaporean flag",
      fr: "Singaporean flag",
      tk: "Singaporean flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/829.gif",
    },
  },
  "British Flag": {
    image: british_flag,
    description: {
      en: "British flag",
      pt: "British flag",
      "zh-CN": "British flag",
      fr: "British flag",
      tk: "British flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/830.gif",
    },
  },
  "Sierra Leone Flag": {
    image: sierra_leone_flag,
    description: {
      en: "Sierra Leone flag",
      pt: "Sierra Leone flag",
      "zh-CN": "Sierra Leone flag",
      fr: "Sierra Leone flag",
      tk: "Sierra Leone flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/831.gif",
    },
  },
  "Romanian Flag": {
    image: romanian_flag,
    description: {
      en: "Romanian flag",
      pt: "Romanian flag",
      "zh-CN": "Romanian flag",
      fr: "Romanian flag",
      tk: "Romanian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/832.gif",
    },
  },
  "Rainbow Flag": {
    image: rainbow_flag,
    description: {
      en: "Rainbow flag",
      pt: "Rainbow flag",
      "zh-CN": "Rainbow flag",
      fr: "Rainbow flag",
      tk: "Rainbow flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/833.gif",
    },
  },
  "Goblin Flag": {
    image: goblin_flag,
    description: {
      en: "Goblin flag",
      pt: "Goblin flag",
      "zh-CN": "Goblin flag",
      fr: "Goblin flag",
      tk: "Goblin flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/834.gif",
    },
  },
  "Pirate Flag": {
    image: pirate_flag,
    description: {
      en: "Pirate flag",
      pt: "Pirate flag",
      "zh-CN": "Pirate flag",
      fr: "Pirate flag",
      tk: "Pirate flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/835.gif",
    },
  },
  "Algerian Flag": {
    image: algerian_flag,
    description: {
      en: "Algerian flag",
      pt: "Algerian flag",
      "zh-CN": "Algerian flag",
      fr: "Algerian flag",
      tk: "Algerian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/836.gif",
    },
  },
  "Mexican Flag": {
    image: mexican_flag,
    description: {
      en: "Mexican flag",
      pt: "Mexican flag",
      "zh-CN": "Mexican flag",
      fr: "Mexican flag",
      tk: "Mexican flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/837.gif",
    },
  },
  "Dominican Republic Flag": {
    image: dominican_republic_flag,
    description: {
      en: "Dominican Republic flag",
      pt: "Dominican Republic flag",
      "zh-CN": "Dominican Republic flag",
      fr: "Dominican Republic flag",
      tk: "Dominican Republic flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/838.gif",
    },
  },
  "Argentinian Flag": {
    image: argentinian_flag,
    description: {
      en: "Argentinian flag",
      pt: "Argentinian flag",
      "zh-CN": "Argentinian flag",
      fr: "Argentinian flag",
      tk: "Argentinian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/839.gif",
    },
  },
  "Lithuanian Flag": {
    image: lithuanian_flag,
    description: {
      en: "Lithuanian flag",
      pt: "Lithuanian flag",
      "zh-CN": "Lithuanian flag",
      fr: "Lithuanian flag",
      tk: "Lithuanian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/840.gif",
    },
  },
  "Malaysian Flag": {
    image: malaysian_flag,
    description: {
      en: "Malaysian flag",
      pt: "Malaysian flag",
      "zh-CN": "Malaysian flag",
      fr: "Malaysian flag",
      tk: "Malaysian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/841.gif",
    },
  },
  "Colombian Flag": {
    image: colombian_flag,
    description: {
      en: "Colombian flag",
      pt: "Colombian flag",
      "zh-CN": "Colombian flag",
      fr: "Colombian flag",
      tk: "Colombian flag",
    },
    opensea: {
      description:
        "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flag",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/842.gif",
    },
  },
  "Egg Basket": {
    image: easterBasket,
    description: {
      en: "Easter Event",
      pt: "Evento de Páscoa",
      "zh-CN": "复活节活动",
      fr: "Événement de Pâques",
      tk: "Paskalya Etkinliği",
    },
    opensea: {
      description:
        "An item that starts the Easter Egg Hunt.\n\nYou have 7 days to collect the 7 eggs. Every few hours an egg may appear on your farm to collect. Limited edition item!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/901.png",
    },
  },
  "Easter Bunny": {
    image: easterBunny,
    description: {
      en: "Earn 20% more Carrots",
      pt: "Ganhe 20% mais cenouras",
      "zh-CN": "增加 20 % 胡萝卜产出",
      fr: "Gagnez 20 % de carottes supplémentaires.",
      tk: "%20 daha fazla Havuç kazanın",
    },
    opensea: {
      description:
        "A limited edition bunny that can be crafted by those who collect all 7 eggs in the Easter Egg Hunt.",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Increase Carrot Yield",
          value: 20,
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/909.gif",
    },
  },
  "Pablo The Bunny": {
    image: pabloBunny,
    description: {
      en: "A magical Easter bunny",
      pt: "Um coelho mágico de Páscoa",
      "zh-CN": "一只神奇的复活节兔子",
      fr: "Un lapin de Pâques magique",
      tk: "Büyülü bir paskalya tavşanı",
    },
    opensea: {
      description: "The magical bunny that increases your carrot harvests",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Carrot Yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/926.gif",
    },
  },
  "Blue Egg": {
    image: blueEgg,
    description: {
      en: "A blue easter egg",
      pt: "Um ovo de Páscoa azul",
      "zh-CN": "一个蓝色的复活节彩蛋",
      fr: "Un œuf de Pâques bleu",
      tk: "Mavi bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/903.png",
    },
  },
  "Orange Egg": {
    image: orangeEgg,
    description: {
      en: "An orange easter egg",
      pt: "Um ovo de Páscoa laranja",
      "zh-CN": "一个橙色的复活节彩蛋",
      fr: "Un œuf de Pâques orange",
      tk: "Turuncu bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/907.png",
    },
  },
  "Green Egg": {
    image: greenEgg,
    description: {
      en: "A green easter egg",
      pt: "Um ovo de Páscoa verde",
      "zh-CN": "一个绿色的复活节彩蛋",
      fr: "Un œuf de Pâques vert",
      tk: "Yeşil bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/908.png",
    },
  },
  "Yellow Egg": {
    image: yellowEgg,
    description: {
      en: "A yellow easter egg",
      pt: "Um ovo de Páscoa amarelo",
      "zh-CN": "一个黄色的复活节彩蛋",
      fr: "Un œuf de Pâques jaune",
      tk: "Sarı bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/904.png",
    },
  },
  "Red Egg": {
    image: redEgg,
    description: {
      en: "A red easter egg",
      pt: "Um ovo de Páscoa vermelho",
      "zh-CN": "一个红色的复活节彩蛋",
      fr: "Un œuf de Pâques rouge",
      tk: "Kırmızı bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/902.png",
    },
  },
  "Pink Egg": {
    image: pinkEgg,
    description: {
      en: "A pink easter egg",
      pt: "Um ovo de Páscoa rosa",
      "zh-CN": "一个粉色的复活节彩蛋",
      fr: "Un œuf de Pâques rose",
      tk: "Pembe bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/905.png",
    },
  },
  "Purple Egg": {
    image: purpleEgg,
    description: {
      en: "A purple easter egg",
      pt: "Um ovo de Páscoa roxo",
      "zh-CN": "一个紫色的复活节彩蛋",
      fr: "Un œuf de Pâques violet",
      tk: "Mor bir Paskalya yumurtası",
    },
    opensea: {
      description:
        "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Event",
        },
      ],
      image: "../public/erc1155/images/906.png",
    },
  },
  "Engine Core": {
    image: momCoreEngine,
    description: {
      en: "The power of the sunflower",
      pt: "The power of the sunflower",
      "zh-CN": "The power of the sunflower",
      fr: "The power of the sunflower",
      tk: "The power of the sunflower",
    },
    opensea: {
      description:
        "An exclusive event item for Million on Mars x Sunflower Land cross-over.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/910.png",
    },
  },
  Observatory: {
    image: observatory,
    description: {
      en: "Explore the stars and improve scientific development",
      pt: "Explore the stars and improve scientific development",
      "zh-CN": "Explore the stars and improve scientific development",
      fr: "Explore the stars and improve scientific development",
      tk: "Explore the stars and improve scientific development",
    },
    opensea: {
      description:
        "A limited edition Observatory gained from completing the mission from Million on Mars x Sunflower Land crossover event.",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Increase XP",
          value: 5,
        },
        {
          trait_type: "Boost",
          value: "XP",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/911.gif",
    },
  },
  "Goblin Key": {
    image: goblinKey,
    description: {
      en: "The Goblin Key",
      pt: "A Chave do Goblin",
      "zh-CN": "The Goblin Key",
      fr: "La Clé des Gobelins",
      tk: "Goblin Anahtarı",
    },
    opensea: {
      description: "A Goblin Key",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/912.png",
    },
  },
  "Sunflower Key": {
    image: sunflowerKey,
    description: {
      en: "The Sunflower Key",
      pt: "A Chave do Girassol",
      "zh-CN": "The Sunflower Key",
      fr: "La Clé du Tournesol",
      tk: "Ayçiçeği Anahtarı",
    },
    opensea: {
      description: "A Sunflower Key",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/913.png",
    },
  },
  "Ancient Goblin Sword": {
    image: ancientGoblinSword,
    description: {
      en: "An Ancient Goblin Sword",
      pt: "Uma Antiga Espada de Goblin",
      "zh-CN": "An Ancient Goblin Sword",
      fr: "Une Ancienne Épée des Gobelins",
      tk: "Kadim Bir Goblin Kılıcı",
    },
    opensea: {
      description: "An Ancient Goblin Sword",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/914.png",
    },
  },
  "Ancient Human Warhammer": {
    image: ancientHumanWarhammer,
    description: {
      en: "An Ancient Human Warhammer",
      pt: "Um Antigo Martelo de Guerra Humano",
      "zh-CN": "An Ancient Human Warhammer",
      fr: "Un Ancien Marteau de Guerre Humain",
      tk: "Kadim Bir İnsan Savaş Çekici",
    },
    opensea: {
      description: "An Ancient Human Warhammer",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/915.png",
    },
  },
  "Speed Chicken": {
    image: speedChicken,
    description: {
      en: "Produces eggs 10% faster",
      pt: "Produces eggs 10% faster",
      "zh-CN": "Produces eggs 10% faster",
      fr: "Produces eggs 10% faster",
      tk: "Produces eggs 10% faster",
    },
    opensea: {
      description:
        "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant increases the speed of egg production by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Egg Production Time",
          value: -10,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/610.gif",
    },
  },
  "Fat Chicken": {
    image: fatChicken,
    description: {
      en: "10% less wheat needed to feed a chicken",
      pt: "10% less wheat needed to feed a chicken",
      "zh-CN": "10% less wheat needed to feed a chicken",
      fr: "10% less wheat needed to feed a chicken",
      tk: "10% less wheat needed to feed a chicken",
    },
    opensea: {
      description:
        "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant reduces the wheat required to feed a chicken by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Amount of Wheat to Feed Chickens",
          value: -10,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/611.gif",
    },
  },
  "Rich Chicken": {
    image: richChicken,
    description: {
      en: "Yields 10% more eggs",
      pt: "Yields 10% more eggs",
      "zh-CN": "Yields 10% more eggs",
      fr: "Yields 10% more eggs",
      tk: "Yields 10% more eggs",
    },
    opensea: {
      description:
        "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant adds a boost of 10% higher egg yield.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
      attributes: [
        {
          display_type: "boost_number",
          trait_type: "Increase Egg Yield",
          value: 0.1,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/612.gif",
    },
  },
  "Chef Apron": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Gives 20% extra SFL selling cakes",
      pt: "Dá 20% a mais na venda de bolos SFL",
      "zh-CN": "给予额外 20 % 蛋糕销售 SFL 利润",
      fr: "Donne 20 % de revenus SFL supplémentaires en vendant des gâteaux.",
      tk: "Pasta satışında %20 ekstra SFL verir",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Price of cakes",
          value: 20,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1101.png",
    },
  },
  "Chef Hat": {
    image: chefHat,
    description: {
      en: "La couronne d'un boulanger légendaire !",
      pt: "A coroa de um padeiro lendário!",
      "zh-CN": "传奇面包师的桂冠！",
      fr: "La couronne d'un boulanger légendaire!",
      tk: "Efsanevi fırıncının tacı!",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1102.png",
    },
  },
  "Rapid Growth": {
    image: rapidGrowth,
    description: {
      en: "Apply to a crop to grow twice as fast",
      pt: "Apply to a crop to grow twice as fast",
      "zh-CN": "Apply to a crop to grow twice as fast",
      fr: "Apply to a crop to grow twice as fast",
      tk: "Apply to a crop to grow twice as fast",
    },
    opensea: {
      description:
        "A rare fertiliser. ~~Apply to your crops to grow twice as fast~~ Legacy Item",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/916.png",
    },
  },
  "Fire Pit": {
    image: firePit,
    description: {
      en: "Roast your Sunflowers, feed and level up your Bumpkin",
      pt: "Faça comidas, alimente e evolua seu Bumpkin",
      "zh-CN": "火堆。烤你的向日葵，喂食并升级你的乡包佬",
      fr: "Faites griller vos Sunflowers, nourrissez et améliorez votre Bumpkin",
      tk: "Ayçiçeği kavurun, Bumpkininizi besleyin ve seviye atlatın.",
    },
    opensea: {
      description: "A fire pit used to cook basic recipes in game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1002.png",
    },
  },
  Market: {
    image: market,
    description: {
      en: "Buy and sell at the Farmer's Market",
      pt: "Compre e venda no Mercado dos Agricultores",
      "zh-CN": "市场。在农贸市场购买和出售",
      fr: "Achetez et vendez au marché des fermiers",
      tk: "Çiftçi pazarında alım ve satım yapın.",
    },
    opensea: {
      description: "A market used to buy seeds and sell crops in game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1001.png",
    },
  },
  "Town Center": {
    image: townCenter,
    description: {
      en: "Gather around the town center for the latest news",
      pt: "Reúna-se ao redor do centro da cidade para as últimas notícias",
      "zh-CN": "镇中心。聚集到 Town Center 获取最新消息",
      fr: "Rassemblez-vous autour du centre-ville pour les dernières nouvelles",
      tk: "En son haberler için şehir merkezinde toplanın.",
    },
    opensea: {
      description: "Gather round the town center and hear the latest news!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1013.png",
    },
  },
  House: {
    image: house,
    description: {
      en: "A place to rest your head",
      pt: "Um lugar para descansar a cabeça",
      "zh-CN": "房屋。一个让你休息的地方",
      fr: "Un endroit où reposer votre tête",
      tk: "Kafanı dinleyebileceğin bir yer.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1017.png",
    },
  },
  Manor: {
    image: manor,
    description: {
      en: "A place to rest your head",
      pt: "Um lugar para descansar a cabeça",
      "zh-CN": "房屋。一个让你休息的地方",
      fr: "Un endroit où reposer votre tête",
      tk: "Kafanı dinleyebileceğin bir yer.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1017.png",
    },
  },
  "Crop Machine": {
    image: cropMachine,
    description: {
      en: "Automate your crop production",
      pt: "Automatize suas plantações",
      "zh-CN": "基础庄稼生产自动化（消耗石油运转）",
      fr: "Automate your crop production",
      tk: "Automate your crop production",
    },
    opensea: {
      description:
        "Technology arrives at the farm! Crop Machine is here to help!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1020.png",
    },
  },
  Kitchen: {
    image: kitchen,
    description: {
      en: "Step up your cooking game",
      pt: "Melhore sua habilidade culinária",
      "zh-CN": "厨房。升级您的烹饪游戏",
      fr: "Améliorez vos compétences en cuisine",
      tk: "Aşçılığınızı geliştirin",
    },
    opensea: {
      description: "A kitchen used to cook recipes in Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1008.png",
    },
  },
  Bakery: {
    image: bakery,
    description: {
      en: "Bake your favourite cakes",
      pt: "Asse seus bolos favoritos",
      "zh-CN": "面包房。烤你最喜欢的蛋糕",
      fr: "Préparez vos gâteaux préférés",
      tk: "Favori pastalarınızı pişirin",
    },
    opensea: {
      description: "A bakery used to cook recipes in Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1007.png",
    },
  },
  Workbench: {
    image: workbench,
    description: {
      en: "Craft tools to collect resources",
      pt: "Faça ferramentas para coletar recursos",
      "zh-CN": "工作台。锻造收集资源的工具",
      fr: "Fabriquez des outils pour collecter des ressources",
      tk: "Kaynak toplamak için alet üretin",
    },
    opensea: {
      description: "A workbench used to craft tools in Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1003.png",
    },
  },
  "Water Well": {
    image: well,
    description: {
      en: "Crops need water!",
      pt: "As plantações precisam de água!",
      "zh-CN": "水井。庄稼需要水！",
      fr: "Les cultures ont besoin d'eau!",
      tk: "Mahsullerin suya ihtiyacı var!",
    },
    opensea: {
      description: "A water well to support more crops in Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1005.png",
    },
  },
  Tent: {
    image: tent,
    description: {
      en: "(Discontinued)",
      pt: "(Descontinuado)",
      "zh-CN": "帐篷。（已绝版）",
      fr: "(Arrêté)",
      tk: "(Artık üretilmiyor)",
    },
    opensea: {
      description:
        "Every Bumpkin needs a tent. Adding a tent to your land supports adding more Bumpkins (coming soon) to your land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1004.png",
    },
  },
  "Hen House": {
    image: chickenHouse,
    description: {
      en: "Grow your chicken empire",
      pt: "Expanda seu império de galinhas",
      "zh-CN": "鸡窝。发展您的养鸡帝国。",
      fr: "Développez votre empire de poulets",
      tk: "Tavuk imparatorluğunuzu kurun",
    },
    opensea: {
      description: "A hen house used to support chickens.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1006.png",
    },
  },
  Deli: {
    image: deli,
    description: {
      en: "Satisfy your appetite with these delicatessen foods!",
      pt: "Satisfaça seu apetite com esses alimentos delicatessen!",
      "zh-CN": "熟食店。这些熟食满足你的口腹之欲！",
      fr: "Satisfaites votre appétit avec ces mets délicats!",
      tk: "Mezelerle iştahınızı tatmin edin!",
    },
    opensea: {
      description: "A deli used to cook advanced recipes at Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1009.png",
    },
  },
  "Smoothie Shack": {
    image: smoothieShack,
    description: {
      en: "Freshly squeezed!",
      pt: "Produz sucos e batidas espremidos na hora!",
      "zh-CN": "沙冰屋。鲜榨！",
      fr: "Pressé à froid!",
      tk: "Taze sıkılmış!",
    },
    opensea: {
      description:
        "A Smoothie Shack is used to prepare juices in Sunflower Land.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1010.png",
    },
  },
  Toolshed: {
    image: toolshed,
    description: {
      en: "Increase your workbench tool stock by 50%",
      pt: "Aumente seu estoque de ferramentas em 50%",
      "zh-CN": "工具棚。Workbench 工具库存增加 50 %",
      fr: "Augmentez votre stock d'outils d'établi de 50 %",
      tk: "Çalışma tezgahı aletlerinizi %50 arttırın",
    },
    opensea: {
      description: "A Toolshed increases your tool stocks by 50%",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1011.png",
    },
  },
  Warehouse: {
    image: warehouse,
    description: {
      en: "Increase your seed stocks by 20%",
      pt: "Aumente seu estoque de sementes em 20%",
      "zh-CN": "仓库。种子库存增加 20 %",
      fr: "Augmentez vos stocks de graines de 20 %",
      tk: "Tohum stoğunuzu %20 arttırın",
    },
    opensea: {
      description: "A Warehouse increases your seed stocks by 20%",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1012.png",
    },
  },
  "Sunflower Amulet": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "10% increased Sunflower yield.",
      pt: "Aumenta o rendimento do Girassol em 10%.",
      "zh-CN": "增加 10 % 向日葵产出",
      fr: "Augmentation de 10 % du rendement en Sunflowers.",
      tk: "Ayçiçeği veriminde %10 artış.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Sunflower yield",
          value: 10,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1103.png",
    },
  },
  "Carrot Amulet": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Carrots grow 20% faster.",
      pt: "As cenouras crescem 20% mais rápido.",
      "zh-CN": "增加 20 % 胡萝卜生长速度",
      fr: "Les carottes poussent 20 % plus vite.",
      tk: "Havuçlar %20 daha hızlı büyür.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Carrots grow time",
          value: 20,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1104.png",
    },
  },
  "Beetroot Amulet": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "20% increased Beetroot yield.",
      pt: "Aumento de 20% na produção de Beterraba.",
      "zh-CN": "增加 20 % 甜菜根产出",
      fr: "Augmentation de 20 % du rendement en betteraves.",
      tk: "Pancar veriminde %20 artış.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_percentage",
          trait_type: "Beetroot yield",
          value: 20,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1105.png",
    },
  },
  "Green Amulet": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Chance for 10x crop yield.",
      pt: "Chance de colheita 10 vezes maior.",
      "zh-CN": "有几率收获 10 倍庄稼产出",
      fr: "Chance d'obtenir un rendement de culture 10 fois supérieur.",
      tk: "10x mahsul verimi şansı.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_number",
          trait_type: "Crop Critical Hit Multiplier",
          value: 10,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1106.png",
    },
  },
  "Warrior Shirt": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A mark of a true warrior.",
      pt: "Marca de um verdadeiro guerreiro.",
      "zh-CN": "真正战士的标志",
      fr: "Marque d'un véritable guerrier.",
      tk: "Gerçek bir savaşçının işareti.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1107.png",
    },
  },
  "Warrior Pants": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Protect your thighs.",
      pt: "Proteja suas coxas.",
      "zh-CN": "保驾你的腿部",
      fr: "Protégez vos cuisses.",
      tk: "Kalçalarınızı koruyun.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1109.png",
    },
  },
  "Warrior Helmet": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "Immune to arrows.",
      pt: "Imune a flechas.",
      "zh-CN": "免疫箭矢",
      fr: "Immunité aux flèches.",
      tk: "Oklara karşı bağışıklı.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1108.png",
    },
  },
  "Sunflower Shield": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A hero of Sunflower Land. Free Sunflower Seeds!",
      pt: "Um herói da Terra do Girassol. Sementes de girassol grátis!",
      "zh-CN": "Sunflower Land 的英雄。免费向日葵种子！",
      fr: "Un héros de Sunflower Land. Des graines de tournesol gratuites!",
      tk: "Ayçiçeği Diyarı'nın bir kahramanı. Ücretsiz Ayçiçeği Tohumları!",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          display_type: "boost_number",
          trait_type: "Sunflower Seed Cost",
          value: 0,
        },
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1110.png",
    },
  },
  "Skull Hat": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A rare hat for your Bumpkin.",
      pt: "Um chapéu raro para o seu Bumpkin.",
      "zh-CN": "乡包佬的稀有帽子",
      fr: "Un chapeau rare pour votre Bumpkin.",
      tk: "Bumpkin'iniz için nadir bir şapka.",
    },
    opensea: {
      description: "Legacy item, DO NOT BUY!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Legacy",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1111.png",
    },
  },
  "War Skull": {
    image: skull,
    description: {
      en: "Decorate the land with the bones of your enemies.",
      pt: "Decore a terra com os ossos de seus inimigos.",
      "zh-CN": "用敌人的骨颅装点您的地盘",
      fr: "Décorez l'île avec les os de vos ennemis.",
      tk: "Ülkeyi düşmanlarınızın kemikleriyle süsleyin.",
    },
    opensea: {
      description: "Decorate the land with the bones of your enemies.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1112.png",
    },
  },
  "War Tombstone": {
    image: warTombstone,
    description: {
      en: "R.I.P",
      pt: "R.I.P",
      "zh-CN": "愿您安息",
      fr: "R.I.P",
      tk: "HUZUR İÇİNDE YATSIN",
    },
    opensea: {
      description: "R.I.P",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1113.png",
    },
  },
  "Undead Rooster": {
    image: undeadChicken,
    description: {
      en: "An unfortunate casualty of the war. 10% increased egg yield.",
      pt: "Uma casualidade da guerra. 10% de aumento na produção de ovos.",
      "zh-CN": "战争的不幸亡者。提升 10 % 鸡蛋产量。",
      fr: "Une victime malheureuse de la guerre. 10% de rendement en œufs supplémentaire.",
      tk: "Savaşın talihsiz bir kaybı. Yumurta veriminde 10% artış.",
    },
    opensea: {
      description:
        "An unfortunate casualty of the war. 10% increased egg yield.",
      attributes: [
        {
          display_type: "boost_number",
          trait_type: "Increase Egg Yield",
          value: 0.1,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1114.gif",
    },
  },
  "Boiled Eggs": {
    image: boiledEgg,
    description: {
      en: "Boiled Eggs are great for breakfast",
      pt: "Ovos cozidos são ótimos para o café da manhã",
      "zh-CN": "煮鸡蛋非常适合早餐。",
      fr: "Les œufs durs sont parfaits pour le petit-déjeuner",
      tk: "Haşlanmış Yumurta kahvaltıda harikadır",
    },
    opensea: {
      description:
        "Boiled Eggs are great for breakfast. You can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/515.png",
    },
  },
  "Bumpkin Broth": {
    image: bumpkinBroth,
    description: {
      en: "A nutritious broth to replenish your Bumpkin",
      pt: "Um caldo nutritivo para repor seu Bumpkin",
      "zh-CN": "营养丰富的肉汤，可以补充你的乡巴佬。",
      fr: "Un bouillon nutritif pour recharger votre Bumpkin",
      tk: "Bumpkin'inizi yenilemek için besleyici bir et suyu",
    },
    opensea: {
      description:
        "A perfect broth for a cold day. You can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/516.png",
    },
  },
  "Mashed Potato": {
    image: mashedPotato,
    description: {
      en: "My life is potato.",
      pt: "Minha vida é batata.",
      "zh-CN": "我的生活就是土豆。",
      fr: "Ma vie, c'est la potato.",
      tk: "Benim hayatım patates.",
    },
    opensea: {
      description: "My life is potato. You can cook this at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/519.png",
    },
  },
  "Bumpkin Salad": {
    image: bumpkinSalad,
    description: {
      en: "Gotta keep your Bumpkin healthy!",
      pt: "Você precisa manter seu Bumpkin saudável!",
      "zh-CN": "Gotta keep your Bumpkin healthy!",
      fr: "Il faut garder votre Bumpkin en bonne santé!",
      tk: "Bumpkin'inizi sağlıklı tutmalısınız!",
    },
    opensea: {
      description:
        "Gotta keep your Bumpkin healthy! You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/517.png",
    },
  },
  "Goblin's Treat": {
    image: goblinsTreat,
    description: {
      en: "Goblins go crazy for this stuff!",
      pt: "Goblins ficam loucos por isso!",
      "zh-CN": "Goblins go crazy for this stuff!",
      fr: "Les gobelins raffolent de ce truc!",
      tk: "Goblinler bu şeylere deli oluyor!",
    },
    opensea: {
      description:
        "Goblins go crazy for this stuff! You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/518.png",
    },
  },
  "Cauliflower Burger": {
    image: cauliflowerBurger,
    description: {
      en: "Calling all cauliflower lovers!",
      pt: "Chamando todos os amantes de couve-flor!",
      "zh-CN": "Calling all cauliflower lovers!",
      fr: "Appel à tous les amateurs de Cauliflower!",
      tk: "Tüm karnabahar severleri çağırıyoruz!",
    },
    opensea: {
      description:
        "Calling all cauliflower lovers! You can cook this at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/520.png",
    },
  },
  "Club Sandwich": {
    image: clubSandwich,
    description: {
      en: "Filled with Carrots and Roasted Sunflower Seeds",
      pt: "Recheado com cenouras e sementes de girassol torradas",
      "zh-CN": "Filled with Carrots and Roasted Sunflower Seeds",
      fr: "Rempli de carottes et de graines de tournesol rôties",
      tk: "Havuç ve Kavrulmuş Ay Çekirdeği Dolgulu",
    },
    opensea: {
      description:
        "Filled with Carrots and Roasted Sunflower Seeds. You can cook this at the Kitchen",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/521.png",
    },
  },
  "Roast Veggies": {
    image: roastVeggies,
    description: {
      en: "Even Goblins need to eat their veggies!",
      pt: "Até os Goblins precisam comer seus vegetais!",
      "zh-CN": "Even Goblins need to eat their veggies!",
      fr: "Même les gobelins ont besoin de manger leurs légumes!",
      tk: "Goblinlerin bile sebzelerini yemesi gerekiyor!",
    },
    opensea: {
      description:
        "Even Goblins need to eat their veggies! You can can cook these at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/522.png",
    },
  },
  Pancakes: {
    image: pancakes,
    description: {
      en: "A great start to a Bumpkins day",
      pt: "Um ótimo começo para o dia de um Bumpkin",
      "zh-CN": "A great start to a Bumpkins day",
      fr: "Un excellent début de journée pour un Bumpkin",
      tk: "Bumpkins gününe harika bir başlangıç",
    },
    opensea: {
      description:
        "A great start to a Bumpkins day. You can can cook these at the Kitchen.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/523.png",
    },
  },
  "Fermented Carrots": {
    image: fermentedCarrots,
    description: {
      en: "Got a surplus of carrots?",
      pt: "Tem um excedente de cenouras?",
      "zh-CN": "有多剩余的胡萝卜吗？",
      fr: "Vous avez un surplus de carottes?",
      tk: "Fazla havuç var mı?",
    },
    opensea: {
      description: "Got a surplus of carrots? You can cook this at the Deli.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/526.png",
    },
  },
  Sauerkraut: {
    image: sauerkraut,
    description: {
      en: "No more boring Cabbage!",
      pt: "Não mais repolho chato!",
      "zh-CN": "再也不是无聊的卷心菜了！",
      fr: "Fini le Cabbage ennuyeux!",
      tk: "Artık sıkıcı Lahana yok!",
    },
    opensea: {
      description:
        "Fermented Cabbage! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/503.png",
    },
  },
  "Reindeer Carrot": {
    image: reindeerCarrot,
    description: {
      en: "Rudolph can't stop eating them!",
      pt: "Rudolph não consegue parar de comê-los!",
      "zh-CN": "鲁道夫无法停止吃它们！",
      fr: "Rudolph ne peut pas s'arrêter de les manger!",
      tk: "Rudolph onları yemeyi bırakamıyor!",
    },
    opensea: {
      description:
        "Rudolph can't stop eating them! You can can cook these at the Fire Pit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/534.png",
    },
  },
  "Bumpkin ganoush": {
    image: bumpkinGanoush,
    description: {
      en: "Zesty roasted eggplant spread.",
      pt: "Espalhe berinjela assada com zeste.",
      "zh-CN": "Zesty roasted eggplant spread.",
      fr: "Sauce d'aubergine rôtie relevée.",
      tk: "Lezzetli közlenmiş patlıcan yayıldı.",
    },
    opensea: {
      description: "Zesty roasted eggplant spread.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/547.png",
    },
  },
  "Eggplant Cake": {
    image: eggplantCake,
    description: {
      en: "Sweet farm-fresh dessert surprise.",
      pt: "Surpresa de sobremesa fresca da fazenda.",
      "zh-CN": "甜美的新鲜甜点惊喜。",
      fr: "Douceur sucrée tout droit de la ferme.",
      tk: "Taze tatlı sürpriz.",
    },
    opensea: {
      description: "Sweet farm-fresh dessert surprise.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/549.png",
    },
  },
  Cornbread: {
    image: cornBread,
    description: {
      en: "Hearty golden farm-fresh bread.",
      pt: "Pão de fazenda dourado e saudável.",
      "zh-CN": "丰盛的金色农家面包。",
      fr: "Un pain rustique doré et frais de la ferme.",
      tk: "Doyurucu altın çiftlik taze ekmeği.",
    },
    opensea: {
      description: "Hearty golden farm-fresh bread.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/548.png",
    },
  },
  Popcorn: {
    image: popcorn,
    description: {
      en: "Classic homegrown crunchy snack.",
      pt: "Lanche crocante caseiro clássico.",
      "zh-CN": "经典的自制脆脆小吃。",
      fr: "Une collation croustillante classique cultivée à la maison.",
      tk: "Klasik evde yetiştirilen çıtır atıştırmalık.",
    },
    opensea: {
      description: "Classic homegrown crunchy snack.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/550.png",
    },
  },
  Chowder: {
    image: chowder,
    description: {
      en: "Sailor's delight in a bowl! Dive in, there's treasure inside!",
      pt: "Delícia de marinheiro em uma tigela! Mergulhe, há tesouro dentro!",
      "zh-CN": "Sailor's delight in a bowl! Dive in, there's treasure inside!",
      fr: "Le délice d'un marin dans un bol ! Plongez-y, il y a un trésor à l'intérieur!",
      tk: "Denizcinin kasedeki lokumu! Dalın, içeride hazine var!",
    },
    opensea: {
      description:
        "Sailor's delight in a bowl! Dive in, there's treasure inside!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/551.png",
    },
  },
  Gumbo: {
    image: gumbo,
    description: {
      en: "A pot full of magic! Every spoonful's a Mardi Gras parade!",
      pt: "Uma panela cheia de magia! Cada colherada é um desfile de Mardi Gras!",
      "zh-CN": "一锅充满魔力！ 每一勺都是狂欢节游行！",
      fr: "Une marmite pleine de magie ! Chaque cuillerée est une parade de Mardi Gras!",
      tk: "Büyü dolu bir kap! Her kaşık dolusu bir Mardi Gras geçit törenidir!",
    },
    opensea: {
      description: "A pot full of magic! Every spoonful's a Mardi Gras parade!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/552.png",
    },
  },
  "Fermented Fish": {
    image: fermentedFish,
    description: {
      en: "Daring delicacy! Unleash the Viking within with every bite!",
      pt: "Delicadeza audaciosa! Liberte o Viking que há dentro com cada mordida!",
      "zh-CN": "大胆的美食！每一口都能释放内心的维京战士！",
      fr: "Délice audacieux ! Libérez le Viking qui est en vous à chaque bouchée!",
      tk: "Cesur bir lezzet! Her lokmada içinizdeki Viking'i serbest bırakın!",
    },
    opensea: {
      description:
        "Daring delicacy! Unleash the Viking within with every bite!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/553.png",
    },
  },
  Explorer: {
    image: explorer,
    description: {
      en: "Expand your Land",
      pt: "Expand your Land",
      "zh-CN": "Expand your Land",
      fr: "Expand your Land",
      tk: "Expand your Land",
    },
  },
  "Busy Bumpkin": {
    image: busyBumpkin,
    description: {
      en: "Reach level 2",
      pt: "Reach level 2",
      "zh-CN": "Reach level 2",
      fr: "Reach level 2",
      tk: "Reach level 2",
    },
  },
  "Brilliant Bumpkin": {
    image: brilliantBumpkin,
    description: {
      en: "Reach level 20",
      pt: "Reach level 20",
      "zh-CN": "Reach level 20",
      fr: "Reach level 20",
      tk: "Reach level 20",
    },
  },
  "Sun Seeker": {
    image: sunSeeker,
    description: {
      en: "Harvest Sunflower 100 times",
      pt: "Harvest Sunflower 100 times",
      "zh-CN": "Harvest Sunflower 100 times",
      fr: "Harvest Sunflower 100 times",
      tk: "Harvest Sunflower 100 times",
    },
  },
  "Sunflower Superstar": {
    image: sunflowerSuperstar,
    description: {
      en: "Harvest Sunflower 100,000 times",
      pt: "Harvest Sunflower 100,000 times",
      "zh-CN": "Harvest Sunflower 100,000 times",
      fr: "Harvest Sunflower 100,000 times",
      tk: "Harvest Sunflower 100,000 times",
    },
  },
  "My life is potato": {
    image: myLifeIsPotato,
    description: {
      en: "Harvest Potato 5,000 times",
      pt: "Harvest Potato 5,000 times",
      "zh-CN": "Harvest Potato 5,000 times",
      fr: "Harvest Potato 5,000 times",
      tk: "Harvest Potato 5,000 times",
    },
  },
  "Jack O'Latern": {
    image: jackOLantern,
    description: {
      en: "Harvest Pumpkin 500 times",
      pt: "Harvest Pumpkin 500 times",
      "zh-CN": "Harvest Pumpkin 500 times",
      fr: "Harvest Pumpkin 500 times",
      tk: "Harvest Pumpkin 500 times",
    },
  },
  "20/20 Vision": {
    image: twentyTwentyVision,
    description: {
      en: "Harvest Carrot 10,000 times",
      pt: "Harvest Carrot 10,000 times",
      "zh-CN": "Harvest Carrot 10,000 times",
      fr: "Harvest Carrot 10,000 times",
      tk: "Harvest Carrot 10,000 times",
    },
  },
  "Cabbage King": {
    image: cabbageKing,
    description: {
      en: "Harvest Cabbage 200 times",
      pt: "Harvest Cabbage 200 times",
      "zh-CN": "Harvest Cabbage 200 times",
      fr: "Harvest Cabbage 200 times",
      tk: "Harvest Cabbage 200 times",
    },
  },
  "Beetroot Beast": {
    image: beetrootBeast,
    description: {
      en: "Harvest Beetroot 2,000 times",
      pt: "Harvest Beetroot 2,000 times",
      "zh-CN": "Harvest Beetroot 2,000 times",
      fr: "Harvest Beetroot 2,000 times",
      tk: "Harvest Beetroot 2,000 times",
    },
  },
  "Cool Flower": {
    image: coolCauliflower,
    description: {
      en: "Harvest Cauliflower 100 times",
      pt: "Harvest Cauliflower 100 times",
      "zh-CN": "Harvest Cauliflower 100 times",
      fr: "Harvest Cauliflower 100 times",
      tk: "Harvest Cauliflower 100 times",
    },
  },
  "Patient Parsnips": {
    image: patientParsnip,
    description: {
      en: "Harvest Parsnip 5,000 times",
      pt: "Harvest Parsnip 5,000 times",
      "zh-CN": "Harvest Parsnip 5,000 times",
      fr: "Harvest Parsnip 5,000 times",
      tk: "Harvest Parsnip 5,000 times",
    },
  },
  "Rapid Radish": {
    image: rapidRadish,
    description: {
      en: "Harvest Radish 200 times",
      pt: "Harvest Radish 200 times",
      "zh-CN": "Harvest Radish 200 times",
      fr: "Harvest Radish 200 times",
      tk: "Harvest Radish 200 times",
    },
  },
  "Staple Crop": {
    image: stapleCrop,
    description: {
      en: "Harvest Wheat 10,000 times",
      pt: "Harvest Wheat 10,000 times",
      "zh-CN": "Harvest Wheat 10,000 times",
      fr: "Harvest Wheat 10,000 times",
      tk: "Harvest Wheat 10,000 times",
    },
  },
  "Farm Hand": {
    image: farmHand,
    description: {
      en: "Harvest crops 10,000 times",
      pt: "Harvest crops 10,000 times",
      "zh-CN": "Harvest crops 10,000 times",
      fr: "Harvest crops 10,000 times",
      tk: "Harvest crops 10,000 times",
    },
  },
  "Crop Champion": {
    image: cropChampion,
    description: {
      en: "Harvest 1 million crops",
      pt: "Harvest 1 million crops",
      "zh-CN": "Harvest 1 million crops",
      fr: "Harvest 1 million crops",
      tk: "Harvest 1 million crops",
    },
  },
  "Bread Winner": {
    image: breadWinner,
    description: {
      en: "Earn 0.001 SFL",
      pt: "Earn 0.001 SFL",
      "zh-CN": "Earn 0.001 SFL",
      fr: "Earn 0.001 SFL",
      tk: "Earn 0.001 SFL",
    },
  },
  "Bumpkin Billionaire": {
    image: bumpkinBillionaire,
    description: {
      en: "Earn 5,000 SFL",
      pt: "Earn 5,000 SFL",
      "zh-CN": "Earn 5,000 SFL",
      fr: "Earn 5,000 SFL",
      tk: "Earn 5,000 SFL",
    },
  },
  "Big Spender": {
    image: bigSpender,
    description: {
      en: "Spend 10 SFL",
      pt: "Spend 10 SFL",
      "zh-CN": "Spend 10 SFL",
      fr: "Spend 10 SFL",
      tk: "Spend 10 SFL",
    },
  },
  "High Roller": {
    image: highRoller,
    description: {
      en: "Spend 7,500 SFL",
      pt: "Spend 7,500 SFL",
      "zh-CN": "Spend 7,500 SFL",
      fr: "Spend 7,500 SFL",
      tk: "Spend 7,500 SFL",
    },
  },
  Timbeerrr: {
    image: timberrr,
    description: {
      en: "Chop 150 trees",
      pt: "Chop 150 trees",
      "zh-CN": "Chop 150 trees",
      fr: "Chop 150 trees",
      tk: "Chop 150 trees",
    },
  },
  "Bumpkin Chainsaw Amateur": {
    image: bumpkinChainsawAmateur,
    description: {
      en: "Chop 5,000 trees",
      pt: "Chop 5,000 trees",
      "zh-CN": "Chop 5,000 trees",
      fr: "Chop 5,000 trees",
      tk: "Chop 5,000 trees",
    },
  },
  Driller: {
    image: driller,
    description: {
      en: "Mine 50 stone rocks",
      pt: "Mine 50 stone rocks",
      "zh-CN": "Mine 50 stone rocks",
      fr: "Mine 50 stone rocks",
      tk: "Mine 50 stone rocks",
    },
  },
  Canary: {
    image: canary,
    description: {
      en: "Mine 1,000 stone rocks",
      pt: "Mine 1,000 stone rocks",
      "zh-CN": "Mine 1,000 stone rocks",
      fr: "Mine 1,000 stone rocks",
      tk: "Mine 1,000 stone rocks",
    },
  },
  "Iron Eyes": {
    image: ironEyes,
    description: {
      en: "Mine 50 iron rocks",
      pt: "Mine 50 iron rocks",
      "zh-CN": "Mine 50 iron rocks",
      fr: "Mine 50 iron rocks",
      tk: "Mine 50 iron rocks",
    },
  },
  "Something Shiny": {
    image: somethingShiny,
    description: {
      en: "Mine 500 iron rocks",
      pt: "Mine 500 iron rocks",
      "zh-CN": "Mine 500 iron rocks",
      fr: "Mine 500 iron rocks",
      tk: "Mine 500 iron rocks",
    },
  },
  "El Dorado": {
    image: elDorado,
    description: {
      en: "Mine 50 gold rocks",
      pt: "Mine 50 gold rocks",
      "zh-CN": "Mine 50 gold rocks",
      fr: "Mine 50 gold rocks",
      tk: "Mine 50 gold rocks",
    },
  },
  "Gold Fever": {
    image: goldFever,
    description: {
      en: "Mine 500 gold rocks",
      pt: "Mine 500 gold rocks",
      "zh-CN": "Mine 500 gold rocks",
      fr: "Mine 500 gold rocks",
      tk: "Mine 500 gold rocks",
    },
  },
  "Kiss the Cook": {
    image: kissTheCook,
    description: {
      en: "Cook 20 meals",
      pt: "Cook 20 meals",
      "zh-CN": "Cook 20 meals",
      fr: "Cook 20 meals",
      tk: "Cook 20 meals",
    },
  },
  "Bakers Dozen": {
    image: bakersDozen,
    description: {
      en: "Bake 13 cakes",
      pt: "Bake 13 cakes",
      "zh-CN": "Bake 13 cakes",
      fr: "Bake 13 cakes",
      tk: "Bake 13 cakes",
    },
  },
  "Chef de Cuisine": {
    image: chefDeCuisine,
    description: {
      en: "Cook 5,000 meals",
      pt: "Cook 5,000 meals",
      "zh-CN": "Cook 5,000 meals",
      fr: "Cook 5,000 meals",
      tk: "Cook 5,000 meals",
    },
  },
  Craftmanship: {
    image: craftmanship,
    description: {
      en: "Craft 100 tools",
      pt: "Craft 100 tools",
      "zh-CN": "Craft 100 tools",
      fr: "Craft 100 tools",
      tk: "Craft 100 tools",
    },
  },
  "Time to chop": {
    image: timeToChop,
    description: {
      en: "Craft 500 axes",
      pt: "Craft 500 axes",
      "zh-CN": "Craft 500 axes",
      fr: "Craft 500 axes",
      tk: "Craft 500 axes",
    },
  },
  Contractor: {
    image: contractor,
    description: {
      en: "Have 10 buildings constructed on your land",
      pt: "Have 10 buildings constructed on your land",
      "zh-CN": "Have 10 buildings constructed on your land",
      fr: "Have 10 buildings constructed on your land",
      tk: "Have 10 buildings constructed on your land",
    },
  },
  Museum: {
    image: museum,
    description: {
      en: "Have 10 different kinds of rare items placed on your land",
      pt: "Have 10 different kinds of rare items placed on your land",
      "zh-CN": "Have 10 different kinds of rare items placed on your land",
      fr: "Have 10 different kinds of rare items placed on your land",
      tk: "Have 10 different kinds of rare items placed on your land",
    },
  },
  "Crowd Favourite": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Delivery Dynamo": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Egg-cellent Collection": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Fruit Aficionado": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Baron": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Expansion Enthusiast": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Expansion Extraordinaire": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Scarecrow Maestro": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Seasoned Farmer": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Treasure Hunter": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Well of Prosperity": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "White Tulips": {
    image: whiteTulips,
    description: {
      en: "Keep the smell of goblins away.",
      pt: "Mantenha o cheiro dos goblins afastado.",
      "zh-CN": "远离哥布林的嗅味",
      fr: "Éloignez l'odeur des Gobelins.",
      tk: "Goblinlerin kokusunu uzak tutun.",
    },
    opensea: {
      description:
        "Keep the smell of goblins away. You can craft this at the Decorations shop at Helios.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1201.png",
    },
  },
  "Potted Sunflower": {
    image: pottedSunflower,
    description: {
      en: "Brighten up your land.",
      pt: "Ilumine sua terra.",
      "zh-CN": "为你的岛上增添阳光",
      fr: "Illuminez votre île.",
      tk: "Toprağınızı aydınlatın.",
    },
    opensea: {
      description:
        "Brighten up your land. You can craft this at the Decorations shop at Helios.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1202.png",
    },
  },
  Cactus: {
    image: cactus,
    description: {
      en: "Saves water and makes your farm look stunning!",
      pt: "Economiza água e deixa sua fazenda deslumbrante!",
      "zh-CN": "节约用水并让您的农场美丽惊人！",
      fr: "Économise de l'eau et rend votre ferme magnifique!",
      tk: "Su tasarrufu sağlar ve çiftliğinizin muhteşem görünmesini sağlar!",
    },
    opensea: {
      description:
        "Saves water and makes your farm look stunning! You can craft this at the Decorations shop at Helios.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1203.png",
    },
  },
  "Jack-o-lantern": {
    image: jackOLanternItem,
    description: {
      en: "A Halloween special event item",
      pt: "Um item especial de evento de Halloween",
      "zh-CN": "A Halloween special event item",
      fr: "Un objet spécial d'événement d'Halloween",
      tk: "Cadılar Bayramı özel etkinlik öğesi",
    },
    opensea: {
      description: "A Halloween special event item.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/923.png",
    },
  },
  "Victoria Sisters": {
    image: victoriaSisters,
    description: {
      en: "The pumpkin loving sisters",
      pt: "As irmãs amantes de abóbora",
      "zh-CN": "热爱南瓜的姐妹们",
      fr: "Les sœurs amatrices de pumpkins",
      tk: "Balkabağı seven kız kardeşler",
    },
    opensea: {
      description:
        "A Halloween collectible. Increase Pumpkin yield by 20% and summon the necromancer.\n\nTo craft this item you must collect 50 Jack-o-lantern's and trade with the Traveling Salesman.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Pumpkin Yield",
          value: 20,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/432.gif",
    },
  },
  "Basic Bear": {
    image: basicBear,
    description: {
      en: "A basic bear. Use this at Goblin Retreat to build a bear!",
      pt: "A basic bear. Use this at Goblin Retreat to build a bear!",
      "zh-CN": "A basic bear. Use this at Goblin Retreat to build a bear!",
      fr: "A basic bear. Use this at Goblin Retreat to build a bear!",
      tk: "A basic bear. Use this at Goblin Retreat to build a bear!",
    },
    opensea: {
      description: "A basic bear. Use this to craft advanced bears!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1204.png",
    },
  },
  "Chef Bear": {
    image: chefBear,
    description: {
      en: "Every chef needs a helping hand",
      pt: "Todo chef precisa de uma mãozinha",
      "zh-CN": "每个厨师都需要个帮手",
      fr: "Chaque chef a besoin d'une aide précieuse.",
      tk: "Her şefin bir yardım eline ihtiyacı vardır",
    },
    opensea: {
      description:
        "Every chef needs a helping hand! Bake 13 cakes to unlock this bear.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1205.png",
    },
  },
  "Construction Bear": {
    image: constructionBear,
    description: {
      en: "Always build in a bear market",
      pt: "Sempre construa em um mercado em baixa",
      "zh-CN": "熊市里就是要建设投入",
      fr: "Toujours construire en période de marché baissier.",
      tk: "Her zaman bir ayı piyasasında inşa edin",
    },
    opensea: {
      description:
        "Always build in a bear market. Build 10 buildings to claim this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1206.png",
    },
  },
  "Angel Bear": {
    image: angelBear,
    description: {
      en: "Time to transcend peasant farming",
      pt: "Hora de transcender a agricultura camponesa",
      "zh-CN": "是时候升华耕地生活了",
      fr: "Le moment de transcender l'agriculture paysanne.",
      tk: "Köylü çiftçiliğini aşmanın zamanı geldi",
    },
    opensea: {
      description:
        "Time to transcend peasant farming. Harvest 1 million crops to unlock this bear.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1207.png",
    },
  },
  "Badass Bear": {
    image: badassBear,
    description: {
      en: "Nothing stands in your way.",
      pt: "Nada fica no seu caminho.",
      "zh-CN": "没人能挡着你的道",
      fr: "Rien ne se dresse sur votre chemin.",
      tk: "Hiçbir şey yolunuza çıkamaz.",
    },
    opensea: {
      description:
        "Nothing stands in your way. Chop 5,000 trees to unlock this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1208.png",
    },
  },
  "Bear Trap": {
    image: bearTrap,
    description: {
      en: "It's a trap!",
      pt: "É uma armadilha!",
      "zh-CN": "是个陷阱！",
      fr: "C'est un piège!",
      tk: "Bu bir tuzak!",
    },
    opensea: {
      description:
        "It's a trap! Unlock the high roller achievement to claim this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1209.png",
    },
  },
  "Brilliant Bear": {
    image: brilliantBear,
    description: {
      en: "Pure brilliance!",
      pt: "Pura genialidade!",
      "zh-CN": "纯然聪耀！",
      fr: "Pure brillance!",
      tk: "Saf parlaklık!",
    },
    opensea: {
      description: "Pure brilliance! Reach lvl 20 to claim this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1210.png",
    },
  },
  "Classy Bear": {
    image: classyBear,
    description: {
      en: "More SFL than you know what to do with it!",
      pt: "Mais SFL do que você sabe o que fazer com isso!",
      "zh-CN": "SFL 多到你都不知道怎么花！",
      fr: "Plus SFL que vous ne savez quoi en faire!",
      tk: "Bununla ne yapacağınızı bildiğinizden daha fazla SFL!",
    },
    opensea: {
      description:
        "More SFL than you know what to do with it! Mine 500 gold rocks to claim this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1211.png",
    },
  },
  "Farmer Bear": {
    image: farmerBear,
    description: {
      en: "Nothing quite like a hard day's work!",
      pt: "Nada como um dia de trabalho árduo!",
      "zh-CN": "辛勤劳作的一天，无可比拟！",
      fr: "Rien de tel qu'une dure journée de travail!",
      tk: "Hiçbir şey zorlu bir günlük çalışma gibisi yoktur!",
    },
    opensea: {
      description:
        "Nothing quite like a hard day's work! Harvest 10,000 crops to unlock this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1212.png",
    },
  },
  "Rich Bear": {
    image: richBear,
    description: {
      en: "A prized possession",
      pt: "Uma posse valorizada",
      "zh-CN": "好一个珍贵的财物",
      fr: "Une possession précieuse.",
      tk: "Değerli bir sahiplik",
    },
    opensea: {
      description:
        "A prized possession. Unlock the Bumpkin Billionaire achievement to claim this bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1214.png",
    },
  },
  "Sunflower Bear": {
    image: sunflowerBear,
    description: {
      en: "A Bear's cherished crop",
      pt: "Uma colheita apreciada pelo urso",
      "zh-CN": "这庄稼，小熊视如珍宝",
      fr: "Une culture chérie par un ours.",
      tk: "Bir Ayının değerli mahsulü",
    },
    opensea: {
      description:
        "A Bear's cherished crop. Harvest 100,000 Sunflowers to unlock this bear.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1213.png",
    },
  },
  "Christmas Bear": {
    image: christmasBear,
    description: {
      en: "Santa's favorite",
      pt: "Santa's favorite",
      "zh-CN": "Santa's favorite",
      fr: "Santa's favorite",
      tk: "Santa's favorite",
    },
    opensea: {
      description: "Santa's favourite.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1217.png",
    },
  },
  "Beta Bear": {
    image: betaBear,
    description: {
      en: "A bear found through special testing events",
      pt: "Um urso encontrado através de eventos de teste especiais",
      "zh-CN": "特殊测试活动找到的小熊",
      fr: "Un ours trouvé lors d'événements de test spéciaux.",
      tk: "Özel test etkinlikleriyle bulunan bir ayı",
    },
    opensea: {
      description: "A bear found during special testing events",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1266.png",
    },
  },
  "Rainbow Artist Bear": {
    image: rainbowArtistBear,
    description: {
      en: "The owner is a beautiful bear artist!",
      pt: "O proprietário é um belo artista urso!",
      "zh-CN": "主人可是个美丽小熊艺术家！",
      fr: "Le propriétaire est un bel artiste de l'ours!",
      tk: "Sahibi güzel bir ayı sanatçısı!",
    },
    opensea: {
      description: "The owner is a beautiful bear artist!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1218.png",
    },
  },
  "Cabbage Boy": {
    image: cabbageBoy,
    description: {
      en: "Don't wake the baby!",
      pt: "Não acorde o bebê!",
      "zh-CN": "不要吵醒宝宝！",
      fr: "Ne réveillez pas le bébé!",
      tk: "Bebeği uyandırma!",
    },
    opensea: {
      description: "Don't wake the baby!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/434.png",
    },
  },
  "Cabbage Girl": {
    image: cabbageGirl,
    description: {
      en: "Shhh it's sleeping",
      pt: "Shhh, está dormindo",
      "zh-CN": "嘘，它正在睡觉",
      fr: "Chut, il dort",
      tk: "Şşş.. Uyuyor",
    },
    opensea: {
      description: "Don't wake the baby!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Cabbage Growth Time",
          value: -50,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/435.png",
    },
  },
  "Wood Nymph Wendy": {
    image: wendy,
    description: {
      en: "Cast an enchantment to entice the wood fairies.",
      pt: "Lance um encantamento para atrair as fadas da madeira.",
      "zh-CN": "施放一个魔法来吸引林中仙子",
      fr: "Lancez un enchantement pour attirer les fées de la forêt.",
      tk: "Orman perilerini baştan çıkarmak için bir büyü yap.",
    },
    opensea: {
      description: "Cast an enchantment to entice the wood fairies.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Wood Drops",
          value: 0.2,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/436.gif",
    },
  },
  "Peeled Potato": {
    image: prizedPotato,
    description: {
      en: "A precious potato, encourages bonus potatoes on harvest.",
      pt: "Uma batata preciosa, incentiva batatas extras na colheita.",
      "zh-CN": "一颗珍贵的土豆，能在收获时带来额外土豆",
      fr: "Une précieuse potato, encourage les potato bonus à la récolte.",
      tk: "Değerli bir patates, hasat sırasında bonus patatesleri teşvik eder.",
    },
    opensea: {
      description:
        "A prized possession. Discover a bonus potato 20% of harvests.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/433.gif",
    },
  },
  "Potent Potato": {
    image: potatoMutant,
    description: {
      en: "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
      pt: "Potente! Concede 3% de chance de obter +10 batatas na colheita.",
      "zh-CN": "强效！在收获时有 3 % 的机会 +10 土豆",
      fr: "Puissant ! Donne une chance de 3% d'obtenir +10 potato à la récolte.",
      tk: "Etkili! Hasatta 3% şans ile +10 patates verir.",
    },
    opensea: {
      description: "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/438.gif",
    },
  },
  "Radical Radish": {
    image: radishMutant,
    description: {
      en: "Radical! Grants a 3% chance to get +10 radishes on harvest.",
      pt: "Radical! Concede 3% de chance de obter +10 rabanetes na colheita.",
      "zh-CN": "激进！在收获时有 3 % 的机会 +10 小萝卜",
      fr: "Radical ! Donne une chance de 3% d'obtenir +10 Radish à la récolte.",
      tk: "Radikal! Hasatta 3% şans ile +10 turp verir.",
    },
    opensea: {
      description:
        "Radical! Grants a 3% chance to get +10 radishes on harvest.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/439.gif",
    },
  },
  "Stellar Sunflower": {
    image: sunflowerMutant,
    description: {
      en: "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
      pt: "Estelar! Concede 3% de chance de obter +10 girassóis na colheita.",
      "zh-CN": "卓越！在收获时有 3 % 的机会 +10 向日葵",
      fr: "Stellaire ! Donne une chance de 3% d'obtenir +10 Sunflowers à la récolte.",
      tk: "Yıldız! Hasatta 3% şans ile +10 ayçiçeği verir.",
    },
    opensea: {
      description:
        "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/437.gif",
    },
  },
  "Potted Potato": {
    image: pottedPotato,
    description: {
      en: "Potato blood runs through your Bumpkin.",
      pt: "O sangue da batata corre pelo seu Bumpkin.",
      "zh-CN": "土豆血在你的乡包佬体内流淌。",
      fr: "Le sang de la potato coule dans votre Bumpkin.",
      tk: "Bumpkin'in içinden patates kanı akıyor.",
    },
    opensea: {
      description:
        "Potato blood runs through your Bumpkin. You can craft this at the Decorations shop at Helios.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1215.png",
    },
  },
  "Potted Pumpkin": {
    image: pottedPumpkin,
    description: {
      en: "Pumpkins for Bumpkins",
      pt: "Pumpkins for Bumpkins",
      "zh-CN": "Pumpkins for Bumpkins",
      fr: "Pumpkins for Bumpkins",
      tk: "Pumpkins for Bumpkins",
    },
    opensea: {
      description:
        "Pumpkins for Bumpkins. You can craft this at the Decorations shop at Helios.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1216.png",
    },
  },
  "Golden Crop": {
    image: SUNNYSIDE.icons.expression_confused,
    description: {
      en: "A shiny golden crop",
      pt: "Uma safra dourada brilhante",
      "zh-CN": "A shiny golden crop",
      fr: "Une culture dorée étincelante",
      tk: "Parlak altın bir mahsul",
    },
    opensea: {
      description: "A shiny golden crop",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/924.gif",
    },
  },
  "Christmas Snow Globe": {
    image: snowglobe,
    description: {
      en: "Swirl the snow and watch it come to life",
      pt: "Gire a neve e veja-a ganhar vida",
      "zh-CN": "摇一摇，看雪再活生机",
      fr: "Remuez la neige et regardez-la prendre vie.",
      tk: "Karları döndürün ve canlanmasını izleyin",
    },
    opensea: {
      description:
        "Swirl the snow and watch it come to life. A Christmas collectible.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1219.gif",
    },
  },
  "Immortal Pear": {
    image: immortalPear,
    description: {
      en: "Increase the survival of your fruit patches.",
      pt: "Increase the survival of your fruit patches.",
      "zh-CN": "一种能使果树寿命变长的长寿梨",
      fr: "Increase the survival of your fruit patches.",
      tk: "Increase the survival of your fruit patches.",
    },
    opensea: {
      description:
        "This long-lived pear ensures your fruit tree survives +1 bonus harvest.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          display_type: "boost_number",
          trait_type: "Extra Fruit Harvest",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/441.gif",
    },
  },
  "Lady Bug": {
    image: ladybug,
    description: {
      en: "An incredible bug that feeds on aphids. Improves Apple quality.",
      pt: "Um inseto incrível que se alimenta de pulgões. Melhora a qualidade da maçã.",
      "zh-CN": "一种令人啧啧称奇的虫子，以蚜虫为食。 能够提升苹果品质",
      fr: "Un incroyable insecte qui se nourrit de pucerons. Améliore la qualité des pommes.",
      tk: "Yaprak bitleriyle beslenen inanılmaz bir böcek. Elma kalitesini artırır.",
    },
    opensea: {
      description:
        "An incredible bug that feeds on aphids. Improves Apple quality. +0.25 Apples each harvest",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Apple Drops",
          value: 0.25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/442.gif",
    },
  },
  "Squirrel Monkey": {
    image: squirrelMonkey,
    description: {
      en: "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
      pt: "Um predador natural de laranjas. As árvores de laranja ficam assustadas quando um Macaco-Esquilo está por perto.",
      "zh-CN": "天然的香橙捕食客。有 Squirrel Monkey 在附近时，橙树都感到害怕",
      fr: "Un prédateur naturel des oranges. Les arbres d'orange ont peur quand un Singe Écureuil est dans les parages.",
      tk: "Doğal turuncu bir yırtıcı hayvan. Portakal ağaçları Squirrel Monkey etraftayken korkar.",
    },
    opensea: {
      description:
        "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around. 1/2 Orange Tree grow time.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Orange Regenaration Time",
          value: -50,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/443.gif",
    },
  },
  "Black Bearry": {
    image: blackBear,
    description: {
      en: "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
      pt: "Seu deleite favorito - Mirtilos suculentos e rechonchudos. Devora-os a punhados!",
      "zh-CN": "他最喜欢的零食——丰满多汁的蓝莓。他一把把地狼吞虎咽！",
      fr: "Sa gourmandise préférée - des myrtilles dodues et juteuses. Il les engloutit par poignées!",
      tk: "En sevdiği ikram; dolgun,sulu yaban mersini. Onları avuç avuç yutar!",
    },
    opensea: {
      description:
        "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful! +1 Blueberry each Harvest",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Blueberry Yield",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/444.gif",
    },
  },
  "Devil Bear": {
    image: devilBear,
    description: {
      en: "Better the Devil you know than the Devil you don't",
      pt: "Melhor o Diabo que você conhece do que o Diabo que você não conhece",
      "zh-CN": "知根知底的恶魔总比不知的好",
      fr: "Mieux vaut le Diable que vous connaissez que le Diable que vous ne connaissez pas.",
      tk: "Tanıdığın Şeytan tanımadığın Şeytandan iyidir",
    },
    opensea: {
      description: "Better the Devil you know than the Devil you don't.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1220.png",
    },
  },
  "Orange Squeeze": {
    image: orangeSqueeze,
    description: {
      en: "Harvest Orange 100 times",
      pt: "Harvest Orange 100 times",
      "zh-CN": "Harvest Orange 100 times",
      fr: "Harvest Orange 100 times",
      tk: "Harvest Orange 100 times",
    },
  },
  "Apple of my Eye": {
    image: appleOfMyEye,
    description: {
      en: "Harvest Apple 500 times",
      pt: "Harvest Apple 500 times",
      "zh-CN": "Harvest Apple 500 times",
      fr: "Harvest Apple 500 times",
      tk: "Harvest Apple 500 times",
    },
  },
  "Blue Chip": {
    image: blueChip,
    description: {
      en: "Harvest Blueberry 5,000 times",
      pt: "Harvest Blueberry 5,000 times",
      "zh-CN": "Harvest Blueberry 5,000 times",
      fr: "Harvest Blueberry 5,000 times",
      tk: "Harvest Blueberry 5,000 times",
    },
  },
  "Fruit Platter": {
    image: fruitPlatter,
    description: {
      en: "Harvest 50,000 fruits",
      pt: "Harvest 50,000 fruits",
      "zh-CN": "Harvest 50,000 fruits",
      fr: "Harvest 50,000 fruits",
      tk: "Harvest 50,000 fruits",
    },
  },
  "Ayam Cemani": {
    image: ayamCemani,
    description: {
      en: "The rarest chicken in existence!",
      pt: "O frango mais raro que existe!",
      "zh-CN": "世上最稀有的鸡！",
      fr: "La poule la plus rare qui existe!",
      tk: "Var olan en nadir tavuk!",
    },
    opensea: {
      description:
        "The rarest chicken in Sunflower Land. This mutant adds a boost of +0.2 egg yield.",
      attributes: [
        {
          display_type: "boost_number",
          trait_type: "Increase Egg Yield",
          value: 0.2,
        },
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/445.gif",
    },
  },
  "Collectible Bear": {
    image: collectibleBear,
    description: {
      en: "A prized bear, still in mint condition!",
      pt: "Um urso valioso, ainda em condição de menta!",
      "zh-CN": "小熊奖品，全新无损！",
      fr: "Un ours précieux, toujours en parfait état!",
      tk: "Değerli bir ayı, hala mükemmel durumda!",
    },
    opensea: {
      description: "A prized bear, still in mint condition!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1221.png",
    },
  },
  "Cyborg Bear": {
    image: cyborgBear,
    description: {
      en: "Hasta la vista, bear",
      pt: "Hasta la vista, urso",
      "zh-CN": "后会有期，熊儿",
      fr: "Hasta la vista, l'ours.",
      tk: "Görüşürüz, ayı",
    },
    opensea: {
      description: "Hasta la vista, bear",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1222.png",
    },
  },
  "Maneki Neko": {
    image: manekiNeko,
    description: {
      en: "The beckoning cat. Pull its arm and good luck will come",
      pt: "O gato da sorte. Puxe o braço e a boa sorte virá",
      "zh-CN": "招财猫。拉动手臂，好运来临",
      fr: "Le chat qui fait signe. Tirez sur son bras et la bonne chance viendra",
      tk: "Şanslı kedi. Kolunu çek ve güzel şanslar gelecek",
    },
    opensea: {
      description:
        "The beckoning cat. Pull its arm and good luck will come. A special event item from Lunar New Year!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_number",
          trait_type: "One free food per day",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/446.gif",
    },
  },
  "Red Envelope": {
    image: redEnvelope,
    description: {
      en: "Wow, you are lucky!",
      pt: "Uau, você tem sorte!",
      "zh-CN": "Wow, you are lucky!",
      fr: "Wow, vous avez de la chance!",
      tk: "Vay, şanslısın!",
    },
    opensea: {
      description:
        "Wow, you are lucky! An item from Lunar New Year special event.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/716.png",
    },
  },
  "Love Letter": {
    image: loveLetter,
    description: {
      en: "Convey feelings of love",
      pt: "Expressar sentimentos de amor",
      "zh-CN": "Convey feelings of love",
      fr: "Transmettez des sentiments d'amour",
      tk: "Sevgi duygularını aktarın",
    },
    opensea: {
      description: "Convey feelings of love",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/717.png",
    },
  },
  "Clam Shell": {
    image: clamShell,
    description: {
      en: "A clam shell.",
      pt: "Uma concha de marisco.",
      "zh-CN": "蛤壳。一块蛤壳。",
      fr: "Une coquille de palourde.",
      tk: "Bir İstiridye kabuğu.",
    },
    opensea: {
      description: "Find at Treasure Island ???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1304.png",
    },
  },
  "Sea Cucumber": {
    image: SUNNYSIDE.resource.sea_cucumber,
    description: {
      en: "A sea cucumber.",
      pt: "Um pepino-do-mar.",
      "zh-CN": "海参。一根海参。",
      fr: "Un concombre de mer.",
      tk: "Bir Deniz hıyarı.",
    },
    opensea: {
      description: "Find at Treasure Island ???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1308.png",
    },
  },
  Coral: {
    image: SUNNYSIDE.resource.coral,
    description: {
      en: "A piece of coral, it's pretty",
      pt: "Um pedaço de coral, é bonito",
      "zh-CN": "珊瑚。一块珊瑚，很漂亮",
      fr: "Un morceau de corail, c'est joli",
      tk: "Bir parça mercan, çok tatlı.",
    },
    opensea: {
      description: "Find at Treasure Island ???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1303.png",
    },
  },
  Crab: {
    image: SUNNYSIDE.resource.crab,
    description: {
      en: "A crab, watch out for its claws!",
      pt: "Um caranguejo, cuidado com suas garras!",
      "zh-CN": "螃蟹。小心它的爪子！",
      fr: "Un crabe, attention à ses pinces!",
      tk: "Bir yengeç, kıskaçlarına dikkat et!!",
    },
    opensea: {
      description: "Find at Treasure Island ???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1309.png",
    },
  },
  Starfish: {
    image: SUNNYSIDE.resource.starfish,
    description: {
      en: "The star of the sea.",
      pt: "A estrela do mar.",
      "zh-CN": "海星。海中之星。",
      fr: "L'étoile de la mer.",
      tk: "Denizin yıldızı.",
    },
    opensea: {
      description: "Find at Treasure Island ???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1306.png",
    },
  },
  "Pirate Bounty": {
    image: SUNNYSIDE.resource.pirate_bounty,
    description: {
      en: "A bounty for a pirate. It's worth a lot of money.",
      pt: "Uma recompensa por um pirata. Vale muito dinheiro.",
      "zh-CN": "海盗赏金。给海盗的赏金，值很多钱。",
      fr: "Une prime pour un pirate. Elle vaut beaucoup d'argent.",
      tk: "Korsan için bir ganimet. Çok para ediyor.",
    },
    opensea: {
      description: "A bounty for a pirate. It's worth a lot of money.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1301.png",
    },
  },
  "Pirate Cake": {
    image: pirateCake,
    description: {
      en: "Great for Pirate themed birthday parties.",
      pt: "Great for Pirate themed birthday parties.",
      "zh-CN": "Great for Pirate themed birthday parties.",
      fr: "Great for Pirate themed birthday parties.",
      tk: "Great for Pirate themed birthday parties.",
    },
    opensea: {
      description: "Great for Pirate themed birthday parties.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/540.png",
    },
  },
  "Abandoned Bear": {
    image: abandonedBear,
    description: {
      en: "A bear that was left behind on the island.",
      pt: "Um urso que foi deixado para trás na ilha.",
      "zh-CN": "一只被落在岛上的小熊",
      fr: "Un ours qui a été laissé derrière sur l'île.",
      tk: "Adada geride bırakılan bir ayı.",
    },
    opensea: {
      description: "A bear that was left behind on the island.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1223.png",
    },
  },
  "Turtle Bear": {
    image: turtleBear,
    description: {
      en: "Turtley enough for the turtle club.",
      pt: "Suficientemente tartarugoso para o clube da tartaruga.",
      "zh-CN": "够龟样去参加龟龟俱乐部了",
      fr: "Assez pour le club des tortues.",
      tk: "Kaplumbağa kulübü için yeterince kaplumbağa var.",
    },
    opensea: {
      description: "Turtley enough for the turtle club.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1224.png",
    },
  },
  "T-Rex Skull": {
    image: tRexSkull,
    description: {
      en: "A skull from a T-Rex! Amazing!",
      pt: "Um crânio de um T-Rex! Incrível!",
      "zh-CN": "暴龙头骨！棒极了！",
      fr: "Un crâne de T-Rex ! Incroyable!",
      tk: "T-Rex'ten bir kafatası! İnanılmaz!",
    },
    opensea: {
      description: "A skull from a T-Rex! Amazing!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1225.png",
    },
  },
  "Sunflower Coin": {
    image: sunflowerCoin,
    description: {
      en: "A coin made of sunflowers.",
      pt: "Uma moeda feita de girassóis.",
      "zh-CN": "一颗向日葵做的硬币",
      fr: "Une pièce faite de Sunflowers.",
      tk: "Ayçiçeklerinden yapılmış bir madeni para.",
    },
    opensea: {
      description: "A coin made of sunflowers.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1226.png",
    },
  },
  Foliant: {
    image: foliant,
    description: {
      en: "A book of spells.",
      pt: "Um livro de feitiços.",
      "zh-CN": "一本咒法书",
      fr: "Un livre de sorts.",
      tk: "Bir büyü kitabı.",
    },
    opensea: {
      description: "A book of spells.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Kale Yield",
          value: 0.2,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1227.png",
    },
  },
  "Skeleton King Staff": {
    image: skeletonKingStaff,
    description: {
      en: "All hail the Skeleton King!",
      pt: "Toda a glória ao Rei Esquelético!",
      "zh-CN": "骷髅王万岁！",
      fr: "Tous saluent le Roi Squelette!",
      tk: "Hepiniz İskelet Kral'ı selamlayın!",
    },
    opensea: {
      description: "All hail the Skeleton King!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1228.png",
    },
  },
  "Lifeguard Bear": {
    image: lifeguardBear,
    description: {
      en: "Lifeguard Bear is here to save the day!",
      pt: "O Urso Salva-vidas está aqui para salvar o dia!",
      "zh-CN": "救生熊来拯救世界了！",
      fr: "L'ours sauveteur est là pour sauver la journée!",
      tk: "Cankurtaran Ayı günü kurtarmak için burada!",
    },
    opensea: {
      description: "Lifeguard Bear is here to save the day!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1229.png",
    },
  },
  "Snorkel Bear": {
    image: snorkelBear,
    description: {
      en: "Snorkel Bear loves to swim.",
      pt: "O Urso Snorkel adora nadar.",
      "zh-CN": "呼吸管熊热爱游泳",
      fr: "L'ours tuba aime nager.",
      tk: "Şnorkel Ayı yüzmeyi çok seviyor.",
    },
    opensea: {
      description: "Snorkel Bear loves to swim.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1230.png",
    },
  },
  "Parasaur Skull": {
    image: parasaurSkull,
    description: {
      en: "A skull from a parasaur!",
      pt: "Um crânio de um parasaur!",
      "zh-CN": "一个副栉龙头骨！",
      fr: "Un crâne de parasaur!",
      tk: "Parasaur'dan bir kafatası!",
    },
    opensea: {
      description: "A skull from a parasaur!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1231.png",
    },
  },
  "Goblin Bear": {
    image: goblinBear,
    description: {
      en: "A goblin bear. It's a bit scary.",
      pt: "Um urso goblin. É um pouco assustador.",
      "zh-CN": "一只哥布林熊。有点吓人",
      fr: "Un ours gobelin. C'est un peu effrayant.",
      tk: "Bir goblin ayı. Biraz korkutucu.",
    },
    opensea: {
      description: "A goblin bear. It's a bit scary.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1234.png",
    },
  },
  "Golden Bear Head": {
    image: goldenBearHead,
    description: {
      en: "Spooky, but cool.",
      pt: "Assustador, mas legal.",
      "zh-CN": "诡异，但很酷",
      fr: "Effrayant, mais cool.",
      tk: "Ürkütücü ama harika.",
    },
    opensea: {
      description: "Spooky, but cool.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1232.png",
    },
  },
  "Pirate Bear": {
    image: pirateBear,
    description: {
      en: "Argh, matey! Hug me!",
      pt: "Argh, pirata! Abraço!",
      "zh-CN": "呀啊，伙计！抱我！",
      fr: "Argh, matelot ! Serre-moi dans tes bras!",
      tk: "Ah, dostum! Sarıl bana!",
    },
    opensea: {
      description: "Argh, matey! Hug me!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1233.png",
    },
  },
  Galleon: {
    image: galleon,
    description: {
      en: "A toy ship, still in pretty good nick.",
      pt: "Um navio de brinquedo, ainda em muito bom estado.",
      "zh-CN": "玩具船，但完好无损",
      fr: "Un navire jouet, toujours en très bon état.",
      tk: "Oyuncak bir gemi, hala oldukça iyi durumda.",
    },
    opensea: {
      description: "A toy ship, still in pretty good nick.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1235.png",
    },
  },
  "Dinosaur Bone": {
    image: dinosaurBone,
    description: {
      en: "A Dinosaur Bone! What kind of creature was this?",
      pt: "Um Osso de Dinossauro! Que tipo de criatura era esta?",
      "zh-CN": "恐龙骨头！这真是怎么一种生物？",
      fr: "Un os de dinosaure ! De quelle créature s'agit-il?",
      tk: "Bir Dinozor Kemiği! Bu nasıl bir yaratıktı?",
    },
    opensea: {
      description: "A Dinosaur Bone! What kind of creature was this?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1237.png",
    },
  },
  "Human Bear": {
    image: humanBear,
    description: {
      en: "A human bear. Even scarier than a goblin bear.",
      pt: "Um urso humano. Ainda mais assustador do que um urso goblin.",
      "zh-CN": "人型熊。甚至比哥布林熊还要吓人",
      fr: "Un ours humain. Encore plus effrayant qu'un ours gobelin.",
      tk: "Bir insan ayı. Bir goblin ayıdan bile daha korkutucu.",
    },
    opensea: {
      description: "A human bear. Even scarier than a goblin bear.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1238.png",
    },
  },
  "Wooden Compass": {
    image: woodenCompass,
    description: {
      en: "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
      pt: "Pode não ser alta tecnologia, mas sempre vai te guiar na direção certa, você acreditaria nisso?",
      "zh-CN":
        "木指南针。它可能不是高科技，但它总会引导你走向正确的方向，你信不？",
      fr: "Il n'est peut-être pas high-tech, mais il vous orientera toujours dans la bonne direction, vous le croyez en bois?",
      tk: "Yüksek teknoloji olmayabilir ama seni her zaman doğru istikamete yönlendirecek, buna inanabiliyo musun?",
    },
    opensea: {
      description:
        "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/925.png",
    },
  },
  "Iron Compass": {
    image: ironCompass,
    description: {
      en: "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
      pt: "Endireite seu caminho para o tesouro! Esta bússola é 'atrativa', e não apenas para o Norte magnético!",
      "zh-CN":
        "铁指南针。开辟你的宝藏之路！这个指南针很有吸引力，而且不仅仅是对磁极！",
      fr: "Redressez votre chemin vers le trésor ! Ce compas est 'attirant', et pas seulement vers le Nord magnétique!",
      tk: "Yolunu hazineye doğru çiz! Bu pusula çok ‘çekici’, ve sadece manyetik kuzey kutbuna değil!",
    },
    opensea: {
      description:
        "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/927.png",
    },
  },
  "Emerald Compass": {
    image: emeraldCompass,
    description: {
      en: "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
      pt: "Guie seu caminho através dos mistérios exuberantes da vida! Esta bússola aponta para a opulência e grandiosidade!",
      "zh-CN":
        "玉指南针。引导你探索生命的繁茂奥秘！这个指南针不仅指向北方，还指向富贵伟业！",
      fr: "Guidez votre chemin à travers les mystères luxuriants de la vie ! Ce compas ne pointe pas seulement vers le Nord, il pointe vers l'opulence et la grandeur!",
      tk: "Yolunuzu hayatın bereketli gizemlerine çevirin! Bu pusula sadece kuzeyi göstermiyor, aynı zamanda zenginliği ve ihtişamı işaret ediyor!",
    },
    opensea: {
      description:
        "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/929.png",
    },
  },
  "Old Bottle": {
    image: oldBottle,
    description: {
      en: "Antique pirate bottle, echoing tales of high seas adventure.",
      pt: "Garrafa de pirata antiga, ecoando contos de aventura em alto mar.",
      "zh-CN": "老旧漂流瓶。古董海盗瓶，印照着公海冒险传说。",
      fr: "Bouteille de pirate antique, évoquant des récits d'aventures en haute mer.",
      tk: "Antik korsan şişesi, açık deniz maceralarının hikayelerini yankılıyor.",
    },
    opensea: {
      description:
        "Antique pirate bottle, echoing tales of high seas adventure.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/928.png",
    },
  },
  "Tiki Totem": {
    image: tikiTotem,
    description: {
      en: "The Tiki Totem adds 0.1 wood to every tree you chop.",
      pt: "O Totem Tiki adiciona 0,1 madeira a cada árvore que você corta.",
      "zh-CN": "Tiki Totem 会在你每次砍树时额外增加 0.1 个木头",
      fr: "Le Totem Tiki ajoute 0,1 de Wood à chaque arbre que vous coupez.",
      tk: "Tiki Totem kestiğiniz her ağaca 0.1 odun ekler.",
    },
    opensea: {
      description: "The Tiki Totem adds 0.1 wood to every tree you chop.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Wood Drops",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/447.png",
    },
  },
  "Lunar Calendar": {
    image: lunarCalendar,
    description: {
      en: "Crops now follow the lunar cycle! 10% increase to crop growth speed.",
      pt: "Os cultivos agora seguem o ciclo lunar! Aumento de 10% na velocidade de crescimento das plantações.",
      "zh-CN": "庄稼现在遵循满月周期！庄稼生长速度提高 10 %",
      fr: "Les cultures suivent désormais le cycle lunaire ! Augmentation de 10% de la vitesse de croissance des cultures.",
      tk: "Mahsuller artık ay döngüsünü takip ediyor! Mahsullerin büyüme hızında 10% artış.",
    },
    opensea: {
      description:
        "Crops now follow the lunar cycle! 10% reduction in growth time.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Crop Growth Time",
          value: -10,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/448.png",
    },
  },
  "Heart of Davy Jones": {
    image: heartOfDavyJones,
    description: {
      en: "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
      pt: "Quem o possui detém um poder imenso sobre os sete mares, pode cavar tesouros sem se cansar.",
      "zh-CN": "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
      fr: "Celui qui le possède détient un immense pouvoir sur les sept mers, peut creuser des trésors sans se fatiguer.",
      tk: "Ona sahip olan kişi yedi deniz üzerinde muazzam bir güce sahip olur,yorulmadan hazine kazabilir.",
    },
    opensea: {
      description:
        "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase daily digs",
          value: 20,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/450.gif",
    },
  },
  "Treasure Map": {
    image: treasureMap,
    description: {
      en: "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
      pt: "Um mapa encantado que leva o portador a tesouros valiosos. +20% de lucro com a venda de itens de recompensa da praia.",
      "zh-CN": "一张魔法地图，能引领持有者找到珍贵的财宝。沙岸财宝的利润 +20 %",
      fr: "Une carte enchantée qui guide son détenteur vers un trésor précieux. +20% de profit sur les objets de la chasse à la plage.",
      tk: "Sahibini değerli bir hazineye götüren gizemli bir harita. Plaj ödül eşyalarından +20% kar.",
    },
    opensea: {
      description:
        "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Beach Bounty profit",
          value: 20,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/449.png",
    },
  },
  "Heart Balloons": {
    image: heartBalloons,
    description: {
      en: "Use them as decorations for romantic occasions.",
      pt: "Use-os como decoração para ocasiões românticas.",
      "zh-CN": "用作浪漫场合的装饰吧",
      fr: "Utilisez-les comme décoration pour des occasions romantiques.",
      tk: "Bunları romantik günler için dekorasyon olarak kullanın.",
    },
    opensea: {
      description: "Use them as decorations for romantic occasions.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/451.png",
    },
  },
  Flamingo: {
    image: flamingo,
    description: {
      en: "Represents a symbol of love's beauty standing tall and confident.",
      pt: "Representa um símbolo da beleza do amor, alto e confiante.",
      "zh-CN": "爱的标志挺立高岸",
      fr: "Représente un symbole de la beauté de l'amour, debout grand et confiant.",
      tk: "Dikenli ve kendinden emin duran aşkın güzelliğinin simgesidir.",
    },
    opensea: {
      description:
        "Represents a symbol of love's beauty standing tall and confident.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/452.png",
    },
  },
  "Blossom Tree": {
    image: blossomTree,
    description: {
      en: "Its delicate petals symbolizes the beauty and fragility of love.",
      pt: "Suas delicadas pétalas simbolizam a beleza e fragilidade do amor.",
      "zh-CN": "精致的花瓣象征着美丽而脆弱的爱",
      fr: "Ses pétales délicats symbolisent la beauté et la fragilité de l'amour.",
      tk: "Narin yaprakları aşkın güzelliğini ve kırılganlığını simgelemektedir.",
    },
    opensea: {
      description:
        "Its delicate petals symbolizes the beauty and fragility of love.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/453.png",
    },
  },
  Pearl: {
    image: pearl,
    description: {
      en: "Shimmers in the sun.",
      pt: "Brilha ao sol.",
      "zh-CN": "珍珠。阳光之下闪闪发光。",
      fr: "Brille au soleil.",
      tk: "Güneşte parlıyor.",
    },
    opensea: {
      description: "Shimmers in the sun.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1302.png",
    },
  },
  Pipi: {
    image: pipi,
    description: {
      en: "Plebidonax deltoides, found in the Pacific Ocean.",
      pt: "Plebidonax deltoides, encontrado no Oceano Pacífico.",
      "zh-CN": "三角斧蛤。发现于太平洋。",
      fr: "Plebidonax deltoides, trouvé dans l'océan Pacifique.",
      tk: "Plebidonax deltoides, Pasifik okyanusunda bulundu.",
    },
    opensea: {
      description: "Plebidonax deltoides, found in the Pacific Ocean.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1305.png",
    },
  },
  Seaweed: {
    image: seaweed,
    description: {
      en: "Seaweed.",
      pt: "Algas marinhas.",
      "zh-CN": "海藻。",
      fr: "Des algues marines.",
      tk: "Deniz yosunu.",
    },
    opensea: {
      description: "Seaweed.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bounty",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1307.png",
    },
  },
  "Whale Bear": {
    image: whaleBear,
    description: {
      en: "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
      pt: "Tem um corpo redondo e peludo como um urso, mas com as barbatanas, cauda e sopro de uma baleia.",
      "zh-CN": "圆润毛绒的身体恰似小熊，但有着鲸鱼的鱼鳍、鱼尾和气孔",
      fr: "Il a un corps rond et poilu comme un ours, mais avec les nageoires, la queue et le blowhole d'une baleine.",
      tk: "Bir ayı gibi yuvarlak, tüylü bir vücudu vardır, ancak yüzgeçleri, kuyruğu ve bir balinanın hava deliği vardır.",
    },
    opensea: {
      description:
        "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1239.png",
    },
  },
  "Valentine Bear": {
    image: valentineBear,
    description: {
      en: "For those who love.",
      pt: "Para aqueles que amam.",
      "zh-CN": "为愿爱之人",
      fr: "Pour ceux qui aiment.",
      tk: "Sevenler için.",
    },
    opensea: {
      description:
        "A bear for those who love. Awarded to people who showed some love",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1240.png",
    },
  },
  "Easter Bear": {
    image: easterBear,
    description: {
      en: "How can a Bunny lay eggs?",
      pt: "Como um coelho pode botar ovos?",
      "zh-CN": "兔子怎么下蛋？",
      fr: "Comment un lapin peut-il pondre des œufs?",
      tk: "Bir Tavşan nasıl yumurtlayabilir?",
    },
    opensea: {
      description: "A bear with bunny ears?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1236.png",
    },
  },
  "Easter Bush": {
    image: easterBush,
    description: {
      en: "What is inside?",
      pt: "O que tem dentro?",
      "zh-CN": "里头是什么？",
      fr: "Qu'y a-t-il à l'intérieur?",
      tk: "İçerideki ne?",
    },
    opensea: {
      description: "What is inside?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1243.png",
    },
  },
  "Giant Carrot": {
    image: giantCarrot,
    description: {
      en: "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
      pt: "Uma cenoura gigante ficou, lançando sombras divertidas, enquanto coelhos observavam maravilhados.",
      "zh-CN": "巨大的胡萝卜直立着，奇趣的影子投下着，注视的兔子惊讶着",
      fr: "Une grosse carotte debout, projetant des ombres amusantes, alors que les lapins contemplent avec émerveillement.",
      tk: "Tavşanlar merakla bakarken dev bir havuç eğlenceli gölgeler yaratarak duruyordu.",
    },
    opensea: {
      description:
        "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1244.png",
    },
  },
  "Iron Idol": {
    image: ironIdol,
    description: {
      en: "The Idol adds 1 iron every time you mine iron.",
      pt: "O Ídolo adiciona 1 ferro toda vez que você minera ferro.",
      "zh-CN": "每次开采铁矿，偶像都会额外赐你 1 块铁矿",
      fr: "L'Idole ajoute 1 fer à chaque fois que vous minez du fer.",
      tk: "Idol, demir kazdığında +1 demir ekler.",
    },
    opensea: {
      description: "The Idol adds 1 iron every time you mine iron.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Iron Drops",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/454.png",
    },
  },
  "Genie Lamp": {
    image: genieLamp,
    description: {
      en: "A magical lamp that contains a genie who will grant you three wishes.",
      pt: "Uma lâmpada mágica que contém um gênio que concederá três desejos.",
      "zh-CN": "一盏有魔力的灯，里面有一个能帮你实现三个愿望的精灵",
      fr: "Une lampe magique contenant un génie qui vous accordera trois vœux.",
      tk: "İçinde sana 3 dilek hakkı verecek bir cin içeren sihirli bir lamba.",
    },
    opensea: {
      description:
        "A magical lamp that contains a genie who will grant you three wishes.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_number",
          trait_type: "Grants Wishes",
          value: 3,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/460.png",
    },
  },
  "Emerald Turtle": {
    image: emeraldTurtle,
    description: {
      en: "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
      pt: "A Tartaruga Esmeralda dá +0,5 a quaisquer minerais que você minera dentro de sua Área de Efeito.",
      "zh-CN":
        "Emerald Turtle 会为你在其作用范围内开采的任何基矿带来 +0.5 增益",
      fr: "La Tortue d'Émeraude ajoute +0,5 à tous les minéraux que vous minez dans sa zone d'effet.",
      tk: "Zümrüt Kaplumbağa etki alanı içinde kazdığın tüm minerallere +0.5 verir.",
    },
    opensea: {
      description:
        "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/463.png",
    },
  },
  "Tin Turtle": {
    image: tinTurtle,
    description: {
      en: "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
      pt: "A Tartaruga de Estanho dá +0,1 a Pedras que você minera dentro de sua Área de Efeito.",
      "zh-CN": "Tin Turtle 会为你在其作用范围内开采的石头带来 +0.1 增益",
      fr: "La Tortue d'Étain ajoute +0,1 aux pierres que vous minez dans sa zone d'effet.",
      tk: "Küçük Kaplumbağa etki alanı içinde kazdığın taşlara +0.1 verir.",
    },
    opensea: {
      description:
        "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/464.png",
    },
  },
  "Basic Scarecrow": {
    image: basicScarecrow,
    description: {
      en: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      pt: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      "zh-CN": "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      fr: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      tk: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
    },
    opensea: {
      description: "Choosy defender of your farm's VIP (Very Important Plants)",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/462.png",
    },
  },
  Bale: {
    image: bale,
    description: {
      en: "Boost nearby chickens.",
      pt: "Vizinho favorito das aves, fornece um retiro aconchegante para as galinhas",
      "zh-CN": "家禽们最喜欢的邻居，为鸡们提供一个舒适的休息地",
      fr: "Le voisin préféré de la volaille, offrant une retraite confortable aux poules",
      tk: "Tavuklar için konforlu bir sığınak sağlayan,kümes hayvanlarının en sevdiği komşusu.",
    },
    opensea: {
      description:
        "A poultry's favorite neighbor, providing a cozy retreat for chickens",
      attributes: [
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Egg Yield",
          value: 0.2,
        },
        {
          display_type: "boost_number",
          trait_type: "Chickens Affected",
          value: 12,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/465.png",
    },
  },
  "Sir Goldensnout": {
    image: sirGoldenSnout,
    description: {
      en: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      pt: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      "zh-CN":
        "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      fr: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      tk: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
    },
    opensea: {
      description:
        "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/466.png",
    },
  },
  "Scary Mike": {
    image: scaryMike,
    description: {
      en: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      pt: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      "zh-CN":
        "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      fr: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      tk: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
    },
    opensea: {
      description:
        "The veggie whisperer and champion of frightfully good harvests!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/467.png",
    },
  },
  "Laurie the Chuckle Crow": {
    image: laurie,
    description: {
      en: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      pt: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      "zh-CN": "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      fr: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      tk: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
    },
    opensea: {
      description:
        "With her disconcerting chuckle, she shooes peckers away from your crops!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
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
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/468.png",
    },
  },
  "Freya Fox": {
    image: freyaFox,
    description: {
      en: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      pt: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      "zh-CN":
        "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      fr: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      tk: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
    },
    opensea: {
      description:
        "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Pumpkin Yield",
          value: 0.5,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/469.png",
    },
  },
  "Queen Cornelia": {
    image: queenCornelia,
    description: {
      en: "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
      pt: "Comande o poder régio da Rainha Cornelia e experimente um magnífico impulso de Área de Efeito para a produção de milho. +1 Milho.",
      "zh-CN":
        "掌控Queen Cornelia的威严力量，并体验大块区域内玉米产量的显著提升。+1 玉米",
      fr: "Commandez le pouvoir royal de la Reine Cornelia et bénéficiez d'un magnifique boost de zone d'effet pour votre production de Corn. +1 de Corn.",
      tk: "Queen Cornelia’nın muhteşem gücünü kontrol edin ve mısır üretiminde müthiş bir etki alanı artışını deneyimleyin.+1 mısır.",
    },
    opensea: {
      description:
        "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Boost",
          value: "Area of Effect",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Corn Yield",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_number",
          trait_type: "Plots Affected",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/474.png",
    },
  },
  "Compost Bin": {
    image: basicComposter,
    description: {
      en: "Produces bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes regularmente.",
      "zh-CN": "箱式堆肥器。定期生产鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais.",
      tk: "Düzenli olarak yem ve gübre üretir.",
    },
    opensea: {
      description:
        "Creates a nurturing Sprout Mix compost and unearths Earthworm bait for your fishing adventures!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1014.png",
    },
  },
  "Turbo Composter": {
    image: advancedComposter,
    description: {
      en: "Produces advanced bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes avançados regularmente.",
      "zh-CN": "涡轮堆肥器。定期生产高级鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais avancés.",
      tk: "Düzenli olarak gelişmiş yem ve gübre üretir.",
    },
    opensea: {
      description:
        "Produces a bountiful Fruitful Blend compost and discovers Grub bait eager to join you in fishing!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1015.png",
    },
  },
  "Premium Composter": {
    image: expertComposter,
    description: {
      en: "Produces expert bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes especialistas regularmente.",
      "zh-CN": "旗舰堆肥器。定期生产专业鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais experts.",
      tk: "Düzenli olarak uzman yem ve gübre üretir.",
    },
    opensea: {
      description:
        "Generates a robust Rapid Root compost mix and reveals Red Wiggler bait for the perfect fishing expedition!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1016.png",
    },
  },
  "Solar Flare Ticket": {
    image: solarFlareTicket,
    description: {
      en: "A ticket used during the Solar Flare Season",
      pt: "Um ticket usado durante a Temporada de Solar Flare",
      "zh-CN": "A ticket used during the Solar Flare Season",
      fr: "Un billet utilisé pendant la saison des Éruptions Solaires",
      tk: "Güneş Patlaması Sezonunda kullanılan bir bilet",
    },
    opensea: {
      description: "A ticket used during the Solar Flare Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/719.png",
    },
  },
  "Dawn Breaker Ticket": {
    image: dawnBreakerTicket,
    description: {
      en: "A ticket used during the Dawn Breaker Season",
      pt: "Um ticket usado durante a Temporada Danw Breaker",
      "zh-CN": "A ticket used during the Dawn Breaker Season",
      fr: "Un billet utilisé pendant la saison de l'Éclaireur de l'Aube",
      tk: "Şafak Kıran Sezonunda kullanılan bir bilet",
    },
    opensea: {
      description: "A ticket used during the Dawn Breaker Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/720.png",
    },
  },
  "Crow Feather": {
    image: crowFeather,
    description: {
      en: "A ticket used during the Witches' Eve Ticket Season",
      pt: "Um ticket usado durante Whiches' Eve",
      "zh-CN": "A ticket used during the Witches' Eve Ticket Season",
      fr: "Un billet utilisé pendant la saison des Billets de la Veille des Sorcières",
      tk: "Cadılar Bayramı Bilet Sezonunda kullanılan bir bilet",
    },
    opensea: {
      description: "A ticket used during the Witches' Eve Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/725.png",
    },
  },
  "Mermaid Scale": {
    image: mermaidScale,
    description: {
      en: "A ticket used during the Catch the Kraken Season",
      pt: "Um ticket usado durante a Temporada de Catch the Kraken",
      "zh-CN": "A ticket used during the Catch the Kraken Season",
      fr: "Un billet utilisé pendant la saison de la Chasse au Kraken",
      tk: "Kraken'i Yakala Sezonunda kullanılan bir bilet",
    },
    opensea: {
      description: "A ticket used during the Catch the Kraken Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/731.png",
    },
  },
  "Tulip Bulb": {
    image: tulipBulb,
    description: {
      en: "A ticket used during the Spring Blossom",
      pt: "Um ticket usado durante a ",
      "zh-CN": "A ticket used during the Spring Blossom",
      fr: "Un billet utilisé pendant la Floraison du Printemps.",
      tk: "Bahar Çiçeği sırasında kullanılan bir bilet",
    },
    opensea: {
      description: "A ticket used during the Spring Blossom",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/737.png",
    },
  },
  Scroll: {
    image: scroll,
    description: {
      en: "A ticket used during the Clash of Factions Season",
      pt: "Um ticket usado durante a temporada Clash of Factions",
      "zh-CN": "A ticket used during the Clash of Factions Season",
      fr: "A ticket used during the Clash of Factions Season",
      tk: "A ticket used during the Clash of Factions Season",
    },
    opensea: {
      description: "A ticket used during the Clash of Factions Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/739.png",
    },
  },
  "Bumpkin Emblem": {
    image: bumpkinEmblem,
    description: {
      en: "Show your allegiance to the Bumpkins",
      pt: "Show your allegiance to the Bumpkins",
      "zh-CN": "Show your allegiance to the Bumpkins",
      fr: "Show your allegiance to the Bumpkins",
      tk: "Show your allegiance to the Bumpkins",
    },
    opensea: {
      description:
        "A symbol of the Bumpkin Faction. Show your support for the Bumpkin Faction with this emblem.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/742.png",
    },
  },
  "Goblin Emblem": {
    image: goblinEmblem,
    description: {
      en: "Show your allegiance to the Goblins",
      pt: "Show your allegiance to the Goblins",
      "zh-CN": "Show your allegiance to the Goblins",
      fr: "Show your allegiance to the Goblins",
      tk: "Show your allegiance to the Goblins",
    },
    opensea: {
      description:
        "A symbol of the Goblin Faction. Show your support for the Goblin Faction with this emblem.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/741.png",
    },
  },
  "Nightshade Emblem": {
    image: nightshadeEmblem,
    description: {
      en: "Show your allegiance to the Nightshades",
      pt: "Show your allegiance to the Nightshades",
      "zh-CN": "Show your allegiance to the Nightshades",
      fr: "Show your allegiance to the Nightshades",
      tk: "Show your allegiance to the Nightshades",
    },
    opensea: {
      description:
        "A symbol of the Nightshade Faction. Show your support for the Nightshade Faction with this emblem.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/744.png",
    },
  },
  "Sunflorian Emblem": {
    image: sunflorianEmblem,
    description: {
      en: "Show your allegiance to the Sunflorians",
      pt: "Show your allegiance to the Sunflorians",
      "zh-CN": "Show your allegiance to the Sunflorians",
      fr: "Show your allegiance to the Sunflorians",
      tk: "Show your allegiance to the Sunflorians",
    },
    opensea: {
      description:
        "A symbol of the Sunflorian Faction. Show your support for the Sunflorian Faction with this emblem.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/743.png",
    },
  },
  Mark: {
    image: mark,
    description: {
      en: "Use these in the faction shop",
      pt: "Use these in the faction shop",
      "zh-CN": "Use these in the faction shop",
      fr: "Use these in the faction shop",
      tk: "Use these in the faction shop",
    },
    opensea: {
      description: "Currency of the Factions. Use this in the Marks Shop.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/745.png",
    },
  },
  "Sunflower Supporter": {
    image: supporterTicket,
    description: {
      en: "The mark of a true supporter of the game!",
      pt: "A marca de um verdadeiro apoiador do jogo!",
      "zh-CN": "The mark of a true supporter of the game!",
      fr: "La marque d'un véritable supporter du jeu!",
      tk: "Oyunun gerçek bir destekçisinin işareti!",
    },
    opensea: {
      description: "A true supporter of the project",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/721.png",
    },
  },
  "Treasure Key": {
    image: sunflowerKey,
    description: {
      en: "Visit the plaza to unlock your reward",
      pt: "Visite o Plaza para desbloquear sua recompensa",
      "zh-CN": "Visit the plaza to unlock your reward",
      fr: "Visitez la place pour débloquer votre récompense",
      tk: "Ödülünüzün kilidini açmak için Plazayı ziyaret edin",
    },
    opensea: {
      description: "A magic key that can unlock rewards in the plaza",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/931.png",
    },
  },
  "Beach Ball": {
    image: beachBall,
    description: {
      en: "Bouncy ball brings beachy vibes, blows boredom away.",
      pt: "A bola saltitante traz vibrações de praia, afasta o tédio.",
      "zh-CN": "弹跳的小球跃动着海滩气息，赶走所有无聊",
      fr: "La balle rebondissante apporte des vibrations de plage, chasse l'ennui.",
      tk: "Zıplayan top, plaj havası verir ve can sıkıntısını giderir.",
    },
    opensea: {
      description: "Bouncy ball brings beachy vibes, blows boredom away.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1242.png",
    },
  },
  "Palm Tree": {
    image: palmTree,
    description: {
      en: "Tall, beachy, shady and chic, palm trees make waves sashay.",
      pt: "Alto, de praia, sombreado e chique, as palmeiras fazem as ondas gingarem.",
      "zh-CN": "高大、滩岸、阴凉、别致，棕榈树摇曳着海浪",
      fr: "Haut, branché, ombragé et chic, les palmiers font des vagues.",
      tk: "Uzun, kumsal, gölgeli ve şık palmiye ağaçları dalgaları dalgalandırıyor.",
    },
    opensea: {
      description:
        "Tall, beachy, shady and chic, palm trees make waves sashay.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1241.png",
    },
  },
  Karkinos: {
    image: karkinos,
    description: {
      en: "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
      pt: "Afiado mas gentil, adição de repolho “caranguejo” à sua fazenda!",
      "zh-CN": "咔叽诺斯。掐得也温柔，卷心好帮手！",
      fr: "Pincé mais gentil, l'ajout crabe-Cabbage à votre ferme qui améliore la production de choux!",
      tk: "Çimdik sever ama kibar, çiftliğine lahana artırıcı bir yengeç!",
    },
    opensea: {
      description:
        "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Cabbage Yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/455.png",
    },
  },
  "Mushroom House": {
    image: mushroomHouse,
    description: {
      en: "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",
      pt: "Uma morada fungosa e caprichosa onde as paredes brotam com charme e até os móveis têm um toque 'esporacular'!",
      "zh-CN": "好一个真上老菌的奇趣妙妙屋，四壁散发迷人魅力，家具孢含惊奇！",
      fr: "Une demeure fantasque pleine de champignons où les murs poussent avec charme et même les meubles ont un flair 'spore-taculaire'!",
      tk: "Duvarların cazibesiyle filizlendiği ve eşyaların bile mantarşem bir zarafete sahip olduğu tuhaf mantar meskeni!",
    },
    opensea: {
      description:
        "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Mushroom Yield",
          value: 0.2,
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/456.png",
    },
  },
  "Basic Land": {
    image: SUNNYSIDE.resource.land,
    description: {
      en: "A basic piece of land",
      pt: "Um pedaço básico de terra",
      "zh-CN": "一片基础岛地",
      fr: "Un morceau d'île basique.",
      tk: "Temel bir toprak parçası",
    },
    opensea: {
      description: "Build your farming empire with this basic piece of land",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/625.png",
    },
  },
  "Crop Plot": {
    image: SUNNYSIDE.resource.plot,
    description: {
      en: "An empty plot to plant crops on",
      pt: "Um espaço vazio para plantar",
      "zh-CN": "一块空田以种庄稼",
      fr: "Une parcelle vide pour planter des cultures.",
      tk: "Bitki yetiştirmek için boş bir arsa",
    },
    opensea: {
      description: "A precious piece of soil used to plant crops.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/622.png",
    },
  },
  "Sunstone Rock": {
    image: sunstoneRock,
    description: {
      en: "A mineable rock to collect sunstone",
      pt: "A mineable rock to collect sunstone",
      "zh-CN": "A mineable rock to collect sunstone",
      fr: "A mineable rock to collect sunstone",
      tk: "A mineable rock to collect sunstone",
    },
    opensea: {
      description: "A radiant gem, essential for advanced crafting.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/637.gif",
    },
  },
  "Gold Rock": {
    image: goldRock,
    description: {
      en: "A mineable rock to collect gold",
      pt: "Uma rocha minerável para coletar ouro",
      "zh-CN": "一片矿脉以收集黄金",
      fr: "Une roche exploitable pour collecter de l'or.",
      tk: "Altın toplamak için kazılabilen bir kaya",
    },
    opensea: {
      description: "A scarce resource that can be used to mine gold",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/621.png",
    },
  },
  "Iron Rock": {
    image: ironRock,
    description: {
      en: "A mineable rock to collect iron",
      pt: "Uma rocha minerável para coletar ferro",
      "zh-CN": "一片矿脉以收集铁矿",
      fr: "Une roche exploitable pour collecter du fer.",
      tk: "Demir toplamak için kazılabilen bir kaya",
    },
    opensea: {
      description: "Wow, a shiny iron rock. Used to mine iron ore",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/620.png",
    },
  },
  "Stone Rock": {
    image: stoneRock,
    description: {
      en: "A mineable rock to collect stone",
      pt: "Uma rocha minerável para coletar pedra",
      "zh-CN": "一片矿脉以收集石头",
      fr: "Une roche exploitable pour collecter de la pierre.",
      tk: "Taş toplamak için kazılabilen bir kaya",
    },
    opensea: {
      description: "A staple mineral for your mining journey",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/619.png",
    },
  },
  "Crimstone Rock": {
    image: crimstoneRock,
    description: {
      en: "A mineable rock to collect crimstone",
      pt: "Uma rocha minerável para coletar Crimstone",
      "zh-CN": "一片矿脉以收集红宝石",
      fr: "Une roche exploitable pour collecter du crimstone.",
      tk: "Kızıltaş toplamak için kazılabilen bir kaya",
    },
    opensea: {
      description: "A rare resource used to mine crimstones",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/635.gif",
    },
  },
  "Oil Reserve": {
    image: oilReserve,
    description: {
      en: "A source of oil",
      pt: "Uma reserva para coletar petróleo",
      "zh-CN": "石油之源",
      fr: "A source of oil",
      tk: "A source of oil",
    },
    opensea: {
      description: "A valuable resource used to mine oil",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/640.gif",
    },
  },
  Tree: {
    image: SUNNYSIDE.resource.tree,
    description: {
      en: "A choppable tree to collect wood",
      pt: "Uma árvore cortável para coletar madeira",
      "zh-CN": "一棵树木以收集木头",
      fr: "Un arbre que vous pouvez abattre pour collecter du Wood.",
      tk: "Odun toplamak için kesilebilir bir ağaç",
    },
    opensea: {
      description: "Nature's most precious resource. Used to collect wood",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/618.gif",
    },
  },
  "Fruit Patch": {
    image: SUNNYSIDE.resource.fruitPatch,
    description: {
      en: "An empty plot to plant fruit on",
      pt: "Um terreno vazio para plantar frutas",
      "zh-CN": "一块空田以种水果",
      fr: "Une parcelle vide pour planter des fruits.",
      tk: "Meyve dikmek için boş bir arsa",
    },
    opensea: {
      description: "A bountiful piece of land used to plant fruit",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/623.png",
    },
  },
  "Flower Bed": {
    image: flowerBed,
    description: {
      en: "An empty plot to plant flowers on",
      pt: "Um terreno vazio para plantar flores",
      "zh-CN": "一块空田以种花卉",
      fr: "Une parcelle vide pour planter des fleurs.",
      tk: "Çiçek dikmek için boş bir arsa",
    },
    opensea: {
      description: "A beautiful piece of land used to plant flowers",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/634.gif",
    },
  },
  Boulder: {
    image: SUNNYSIDE.resource.boulder,
    description: {
      en: "A mythical rock that can drop rare minerals",
      pt: "Uma rocha mítica que pode liberar minerais raros",
      "zh-CN": "一片神秘矿脉可掉落稀有矿物",
      fr: "Une roche mythique qui peut laisser tomber des minéraux rares.",
      tk: "Nadir mineralleri düşürebilen efsanevi bir kaya",
    },
    opensea: {
      description: "???",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/question_mark.png",
    },
  },
  "Dirt Path": {
    image: dirt,
    description: {
      en: "Keep your farmer boots clean with a well trodden path.",
      pt: "Mantenha suas botas de fazendeiro limpas com um caminho bem pisado.",
      "zh-CN": "千足踏过的小径总不脏鞋",
      fr: "Gardez vos bottes de fermier propres avec un chemin bien foulé.",
      tk: "Çiftçi botlarınızı iyi işlenmiş bir yolla temiz tutun.",
    },
    opensea: {
      description: "Keep your farmer boots clean and travel on paths!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1245.png",
    },
  },
  Bush: {
    image: bush,
    description: {
      en: "What's lurking in the bushes?",
      pt: "O que está espreitando nas moitas?",
      "zh-CN": "草丛里都躲着什么？",
      fr: "Que se cache-t-il dans les buissons?",
      tk: "Çalıların arasında ne gizleniyor?",
    },
    opensea: {
      description: "Keep your Bumpkins happy with these bushy bushes.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1246.png",
    },
  },
  Fence: {
    image: fence,
    description: {
      en: "Add a touch of rustic charm to your farm.",
      pt: "Adicione um toque de charme rústico à sua fazenda.",
      "zh-CN": "给你的农场来点乡村魅力",
      fr: "Ajoutez une touche de charme rustique à votre ferme.",
      tk: "Çiftliğinize rustik bir çekicilik katın.",
    },
    opensea: {
      description: "Those cheeky chickens won't be escaping anymore!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1247.png",
    },
  },
  "Stone Fence": {
    image: stoneFence,
    description: {
      en: "Embrace the timeless elegance of a stone fence.",
      pt: "Abrace a elegância atemporal de uma cerca de pedra.",
      "zh-CN": "拥抱石栏的永恒优雅",
      fr: "Adoptez l'élégance intemporelle d'une clôture en pierre.",
      tk: "Taş çitin zamansız zarafetini kucaklayın.",
    },
    opensea: {
      description: "Embrace the timeless elegance of a stone fence.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1271.png",
    },
  },
  Shrub: {
    image: shrub,
    description: {
      en: "Enhance your in-game landscaping with a beautiful shrub",
      pt: "Melhore seu paisagismo no jogo com um arbusto bonito",
      "zh-CN": "一簇美妙灌木倍增您的游乐景象",
      fr: "Améliorez votre aménagement paysager en jeu avec un bel arbuste.",
      tk: "Güzel bir çalıyla oyun içi peyzajınızı geliştirin",
    },
    opensea: {
      description:
        "It aint much, but it adds some green to your beautiful island",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1248.png",
    },
  },
  "Pine Tree": {
    image: pineTree,
    description: {
      en: "Standing tall and mighty, a needle-clad dream.",
      pt: "De pé alto e poderoso.",
      "zh-CN": "高岸雄伟，一趟层层针叶梦",
      fr: "Debout haut et puissant, un rêve habillé d'aiguilles.",
      tk: "Dik ve kudretli durmak, iğnelerle kaplı bir rüya.",
    },
    opensea: {
      description: "Standing tall and mighty, a needle-clad dream.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1270.png",
    },
  },
  "Field Maple": {
    image: fieldMaple,
    description: {
      en: "A petite charmer that spreads its leaves like a delicate green canopy.",
      pt: "Um charme pequeno que espalha suas folhas como um dossel verde delicado.",
      "zh-CN": "娇枝嫩叶展开翠绿天蓬",
      fr: "Un charmeur petit qui étend ses feuilles comme une délicate canopée verte.",
      tk: "Yapraklarını narin yeşil bir gölgelik gibi yayan küçük bir büyücü.",
    },
    opensea: {
      description:
        "A petite charmer that spreads its leaves like a delicate green canopy.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1267.png",
    },
  },
  "Red Maple": {
    image: redMaple,
    description: {
      en: "Fiery foliage and a heart full of autumnal warmth.",
      pt: "Folhagem ardente e um coração cheio de calor outonal.",
      "zh-CN": "火热红叶有一颗秋日暖心",
      fr: "Foliage enflammé et un cœur plein de chaleur automnale.",
      tk: "Ateşli yapraklar ve sonbahar sıcaklığıyla dolu bir kalp.",
    },
    opensea: {
      description: "Fiery foliage and a heart full of autumnal warmth.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1268.png",
    },
  },
  "Golden Maple": {
    image: goldenMaple,
    description: {
      en: "Radiating brilliance with its shimmering golden leaves.",
      pt: "Irradiando brilho com suas folhas douradas cintilantes.",
      "zh-CN": "金光枫叶四绽光芒",
      fr: "Illuminant de sa brillance avec ses feuilles dorées scintillantes.",
      tk: "Parıldayan altın yapraklarıyla parlaklık saçıyor.",
    },
    opensea: {
      description: "Radiating brilliance with its shimmering golden leaves.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1269.png",
    },
  },
  "Solar Flare Banner": {
    image: solarFlareBanner,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description:
        "The temperature is rising in Sunflower Land. The mark of a participant in our inaugural season.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/722.png",
    },
  },
  "Dawn Breaker Banner": {
    image: dawnBreakerBanner,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description:
        "A mysterious darkness is plaguing Sunflower Land. The mark of a participant in the Dawn Breaker Season.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/723.png",
    },
  },
  "Witches' Eve Banner": {
    image: witchesEveBanner,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description:
        "The season of the witch has begun. The mark of a participant in the Witches' Eve Season.\n\nGrants 2 extra crow feathers per feather delivery during Witches' Eve Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_number",
          trait_type: "Extra Crow Feathers from Deliveries",
          value: 2,
        },
      ],
      image: "../public/erc1155/images/724.png",
    },
  },
  "Catch the Kraken Banner": {
    image: catchTheKrakenBanner,
    description: {
      en: "The Kraken is here! The mark of a participant in the Catch the Kraken Season.",
      pt: "O Kraken está aqui! O símbolo de um participante na Temporada de Pegar o Kraken.",
      "zh-CN": "海怪浮现！追捕海怪时季参与者的标志",
      fr: "Le Kraken est là ! La marque d'un participant à la saison Catch the Kraken.",
      tk: "Kraken burada! Kraken Yakalama Sezonu katılımcısının işareti.",
    },
    opensea: {
      description:
        "The Kraken is here! The mark of a participant in the Catch the Kraken Season.\n\nGrants 2 extra mermaid scales per mermaid scale delivery during Catch the Kraken Season",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
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
      image: "../public/erc1155/images/730.png",
    },
  },
  "Spring Blossom Banner": {
    image: springBlossomBanner,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
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
      image: "../public/erc1155/images/736.gif",
    },
  },
  "Clash of Factions Banner": {
    image: clashOfFactionsBanner,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          display_type: "boost_percentage",
          trait_type: "XP increase during Clash of Factions Season",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/738.png",
    },
  },
  "Lifetime Farmer Banner": {
    image: lifetimeFarmerBanner,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "Gives lifetime access to all seasons and VIP access.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase XP",
          value: 10,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/740.png",
    },
  },
  "Luminous Lantern": {
    image: luminousLantern,
    description: {
      en: "A bright paper lantern that illuminates the way.",
      pt: "Uma lanterna de papel brilhante que ilumina o caminho.",
      "zh-CN": "明亮纸灯笼照亮前方道路",
      fr: "Une lanterne en papier lumineuse qui éclaire le chemin.",
      tk: "Yolu aydınlatan parlak bir kağıt fener.",
    },
    opensea: {
      description: "A bright paper lantern that illuminates the way.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1249.png",
    },
  },
  "Radiance Lantern": {
    image: radianceLantern,
    description: {
      en: "A radiant paper lantern that shines with a powerful light.",
      pt: "Uma lanterna de papel radiante que brilha com uma luz poderosa.",
      "zh-CN": "光亮纸灯笼射出强光闪耀",
      fr: "Une lanterne en papier radieuse qui brille d'une lumière puissante.",
      tk: "Güçlü bir ışıkla parlayan parlak bir kağıt fener.",
    },
    opensea: {
      description: "A radiant paper lantern that shines with a powerful light.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1250.png",
    },
  },
  "Ocean Lantern": {
    image: oceanLantern,
    description: {
      en: "A wavy paper lantern that sways with the bobbing of the tide.",
      pt: "Uma lanterna de papel ondulante que balança com o movimento da maré.",
      "zh-CN": "海浪纸灯笼随着波涛摇曳",
      fr: "Une lanterne en papier ondulée qui flotte avec la marée.",
      tk: "Gelgitin sallanmasıyla sallanan dalgalı bir kağıt fener.",
    },
    opensea: {
      description:
        "A wavy paper lantern that sways with the bobbing of the tide.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1265.png",
    },
  },
  "Solar Lantern": {
    image: solarLantern,
    description: {
      en: "Harnessing the vibrant essence of sunflowers, the Solar Lantern emanates a warm and radiant glow.",
      pt: "Aproveitando a essência vibrante dos girassóis, a Lanterna Solar emana um brilho quente e radiante.",
      "zh-CN": "掌持向日葵的跃动精粹，向日灯笼散发着温暖又耀眼的荧光",
      fr: "Utilisant l'essence vibrante des Sunflowers, la lanterne solaire émet une lueur chaude et radieuse.",
      tk: "Ayçiçeklerinin canlı özünü kullanan Solar Fener, sıcak ve ışıltılı bir ışıltı yayıyor.",
    },
    opensea: {
      description:
        "Harnessing the vibrant essence of sunflowers, the Solar Lantern emanates a warm and radiant glow, reminiscent of a blossoming field under the golden sun.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1272.png",
    },
  },
  "Aurora Lantern": {
    image: auroraLantern,
    description: {
      en: "A paper lantern that transforms any space into a magical wonderland.",
      pt: "Uma lanterna de papel que transforma qualquer espaço em um mundo mágico.",
      "zh-CN": "极光纸灯笼晕染魔法幻境",
      fr: "Une lanterne en papier qui transforme tout espace en un pays des merveilles magique.",
      tk: "Herhangi bir alanı büyülü bir harikalar diyarına dönüştüren bir kağıt fener.",
    },
    opensea: {
      description:
        "A paper lantern that transforms any space into a magical wonderland.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1251.png",
    },
  },
  "Bonnie's Tombstone": {
    image: bonniesTombstone,
    description: {
      en: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      pt: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      "zh-CN":
        "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      fr: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      tk: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
    },
    opensea: {
      description:
        "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1252.png",
    },
  },
  "Chestnut Fungi Stool": {
    image: chestnutStool,
    description: {
      en: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      pt: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      "zh-CN":
        "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      fr: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      tk: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
    },
    opensea: {
      description:
        "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1253.png",
    },
  },
  "Crimson Cap": {
    image: crimsonCap,
    description: {
      en: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      pt: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      "zh-CN":
        "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      fr: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      tk: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
    },
    opensea: {
      description:
        "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1254.png",
    },
  },
  "Dawn Umbrella Seat": {
    image: dawnUmbrellaSeat,
    description: {
      en: "Keep those Eggplants dry during those rainy days with the Dawn Umbrella Seat.",
      pt: "Mantenha essas Berinjelas secas durante os dias chuvosos com o Guarda-chuva Assento da Aurora.",
      "zh-CN": "有了晨曦伞座，叫茄子在阴雨云天也保持干爽",
      fr: "Gardez ces Eggplants au sec lors des journées pluvieuses avec le siège-parapluie Dawn.",
      tk: "Şafak Şemsiye Koltuğu ile bu yağmurlu günlerde patlıcanları kuru tutun.",
    },
    opensea: {
      description:
        "Keep those Eggplants dry during those rainy days with the Dawn Umbrella Seat.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1255.png",
    },
  },
  "Eggplant Grill": {
    image: eggplantGrill,
    description: {
      en: "Get cooking with the Eggplant Grill, perfect for any outdoor meal.",
      pt: "Comece a cozinhar com a Churrasqueira de Berinjela, perfeita para qualquer refeição ao ar livre.",
      "zh-CN": "用上茄子烤架做饭，户外就餐完美精选",
      fr: "Préparez vos repas en plein air avec le Eggplant Grill, parfait pour tout repas en plein air.",
      tk: "Her türlü açık hava yemeği için mükemmel olan Patlıcan Izgara ile yemek pişirin.",
    },
    opensea: {
      description:
        "Get cooking with the Eggplant Grill, perfect for any outdoor meal.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1256.png",
    },
  },
  "Giant Dawn Mushroom": {
    image: giantDawnMushroom,
    description: {
      en: "The Giant Dawn Mushroom is a majestic and magical addition to any farm.",
      pt: "O Cogumelo Gigante da Aurora é uma adição majestosa e mágica para qualquer fazenda.",
      "zh-CN": "巨型晨曦蘑菇在任何农场都显得雄伟又魔幻",
      fr: "Le champignon géant Dawn est un ajout majestueux et magique à toute ferme.",
      tk: "Dev Şafak Mantarı her çiftliğe görkemli ve büyülü bir katkıdır.",
    },
    opensea: {
      description:
        "The Giant Dawn Mushroom is a majestic and magical addition to any farm.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1257.png",
    },
  },
  "Grubnash's Tombstone": {
    image: grubnashTombstone,
    description: {
      en: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      pt: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      "zh-CN": "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      fr: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      tk: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
    },
    opensea: {
      description:
        "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1258.png",
    },
  },
  "Mahogany Cap": {
    image: mahoganyCap,
    description: {
      en: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      pt: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      "zh-CN":
        "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      fr: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      tk: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
    },
    opensea: {
      description:
        "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1259.png",
    },
  },
  "Shroom Glow": {
    image: shroomGlow,
    description: {
      en: "Illuminate your farm with the enchanting glow of Shroom Glow.",
      pt: "Ilumine sua fazenda com o brilho encantador do Brilho dos Cogumelos.",
      "zh-CN": "蘑菇灯的魔力荧光照亮您的农场",
      fr: "Illuminez votre ferme avec la lueur enchanteresse de Shroom Glow.",
      tk: "Çiftliğinizi Shroom Glow'un büyüleyici ışıltısıyla aydınlatın.",
    },
    opensea: {
      description:
        "Illuminate your farm with the enchanting glow of Shroom Glow.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1263.png",
    },
  },
  "Toadstool Seat": {
    image: toadstoolSeat,
    description: {
      en: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      pt: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      "zh-CN": "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      fr: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      tk: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
    },
    opensea: {
      description:
        "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1260.png",
    },
  },
  Clementine: {
    image: clementine,
    description: {
      en: "The Clementine Gnome is a cheerful companion for your farming adventures.",
      pt: "O Gnomo Clementine é um companheiro alegre para suas aventuras na fazenda.",
      "zh-CN": "小橙侏儒是你耕作冒险的欢乐伙伴",
      fr: "Le gnome Clementine est un compagnon joyeux pour vos aventures agricoles.",
      tk: "Clementine Gnome, çiftçilik maceralarınız için neşeli bir yol arkadaşıdır.",
    },
    opensea: {
      description:
        "The Clementine Gnome is a cheerful companion for your farming adventures.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1261.png",
    },
  },
  Blossombeard: {
    image: blossombeard,
    description: {
      en: "The Blossombeard Gnome is a powerful companion for your farming adventures.",
      pt: "O Gnomo Blossombeard é um companheiro poderoso para suas aventuras na fazenda.",
      "zh-CN": "开花胡茬侏儒是你耕作冒险的强力帮手",
      fr: "Le gnome Blossombeard est un compagnon puissant pour vos aventures agricoles.",
      tk: "Çiçek Sakallı Gnome, çiftçilik maceralarınız için güçlü bir yol arkadaşıdır.",
    },
    opensea: {
      description:
        "The Blossombeard Gnome is a powerful companion for your farming adventures.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "XP",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Experience",
          value: 10,
        },
      ],
      image: "../public/erc1155/images/2010.png",
    },
  },
  "Desert Gnome": {
    image: desertgnome,
    description: {
      en: "A gnome that can survive the harshest of conditions.",
      pt: "A gnome that can survive the harshest of conditions.",
      "zh-CN": "能够在最恶劣的条件下生存的侏儒。",
      fr: "A gnome that can survive the harshest of conditions.",
      tk: "A gnome that can survive the harshest of conditions.",
    },
    opensea: {
      description:
        "The Blossombeard Gnome is a powerful companion for your farming adventures.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Cooking Time",
          value: -10,
        },
      ],
      image: "../public/erc1155/images/2017.png",
    },
  },
  Cobalt: {
    image: cobalt,
    description: {
      en: "The Cobalt Gnome adds a pop of color to your farm with his vibrant hat.",
      pt: "O Gnomo Cobalt adiciona um toque de cor à sua fazenda com seu chapéu vibrante.",
      "zh-CN": "钴侏儒用他的鲜艳帽子为你的农场另添时兴增色",
      fr: "Le gnome Cobalt ajoute une touche de couleur à votre ferme avec son chapeau vibrant.",
      tk: "Kobalt Gnome, canlı şapkasıyla çiftliğinize renk katar.",
    },
    opensea: {
      description:
        "The Cobalt Gnome adds a pop of color to your farm with his vibrant hat.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1262.png",
    },
  },
  "Purple Trail": {
    image: purpleTrail,
    description: {
      en: "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",
      pt: "Deixe seus oponentes com inveja com a trilha roxa única e fascinante",
      "zh-CN": "有了这迷人独特的 Purple Trail，让你的对手垂涎食尘吧",
      fr: "Laissez vos adversaires derrière vous dans un sillage d'envie avec le sentier violet captivant et unique",
      tk: "Büyüleyici ve eşsiz Purple Trail ile rakiplerini kıskançlık içinde bırak.",
    },
    opensea: {
      description:
        "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Eggplant Yield",
          value: 0.2,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/457.png",
    },
  },
  Maximus: {
    image: maximus,
    description: {
      en: "Squash the competition with plump Maximus",
      pt: "Esmague a competição com o robusto Maximus",
      "zh-CN": "用丰满的 Maximus 碾压全场",
      fr: "Écrasez la concurrence avec le joufflu Maximus",
      tk: "Tombul Maximus ile rekabeti ezip geç!",
    },
    opensea: {
      description: "Squash the competition with plump Maximus",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Eggplant Yield",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/459.png",
    },
  },
  Obie: {
    image: obie,
    description: {
      en: "A fierce eggplant soldier",
      pt: "Um feroz soldado de Berinjela",
      "zh-CN": "凶悍的长茄兵。",
      fr: "Un vaillant soldat Eggplant",
      tk: "Azılı bir patlıcan askeri",
    },
    opensea: {
      description: "A fierce eggplant soldier",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Eggplant Growth Time",
          value: -25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/458.png",
    },
  },
  Hoot: {
    image: hoot,
    description: {
      en: "Hoot hoot! Have you solved my riddle yet?",
      pt: "Hoot hoot! Você já resolveu meu enigma?",
      "zh-CN": "呼呜！呼呜！解开我的谜语没？",
      fr: "Hibou hibou ! Avez-vous résolu mon énigme?",
      tk: "Vay vay! Bilmecemi hâlâ çözmedin mi?",
    },
    opensea: {
      description: "Hoot hoot! Have you solved my riddle yet?",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Yield of Radish, Wheat, Kale & Rice",
          value: 0.5,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/461.png",
    },
  },
  "Genie Bear": {
    image: genieBear,
    description: {
      en: "Exactly what I wished for!",
      pt: "Exatamente o que eu desejei!",
      "zh-CN": "正是我想要的！",
      fr: "Exactement ce que je souhaitais!",
      tk: "Tam olarak istediğim şey!",
    },
    opensea: {
      description: "Exactly what I wished for!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1264.png",
    },
  },
  "Betty Lantern": {
    image: bettyLantern,
    description: {
      en: "It looks so real! I wonder how they crafted this.",
      pt: "Parece tão real! Eu me pergunto como eles fizeram isso.",
      "zh-CN": "看起来栩栩如生！好奇他们是怎么打造这出来的",
      fr: "Elle a l'air tellement réelle ! Je me demande comment ils l'ont fabriquée.",
      tk: "O kadar gerçek görünüyor ki! Bunu nasıl hazırladıklarını merak ediyorum.",
    },
    opensea: {
      description: "It looks so real! I wonder how they crafted this.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1273.png",
    },
  },
  "Bumpkin Lantern": {
    image: bumpkinLantern,
    description: {
      en: "Moving closer you hear murmurs of a living Bumpkin...creepy!",
      pt: "Aproximando-se, você ouve murmúrios de um Bumpkin vivo... assustador!",
      "zh-CN": "凑近听，能听到乡包佬的呢喃低语……可怕！",
      fr: "En vous approchant, vous entendez des murmures d'un Bumpkin vivant... effrayant!",
      tk: "Yaklaştığınızda yaşayan bir Bumpkin'in mırıltılarını duyarsınız... tüyler ürpertici!",
    },
    opensea: {
      description:
        "Moving closer you hear murmurs of a living Bumpkin...creepy!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1274.png",
    },
  },
  "Eggplant Bear": {
    image: eggplantBear,
    description: {
      en: "The mark of a generous eggplant whale.",
      pt: "O símbolo de uma baleia berinjela generosa.",
      "zh-CN": "茄子大亨慷慨的标志",
      fr: "La marque généreuse Eggplant balaine.",
      tk: "Cömert bir patlıcan balinasının işareti.",
    },
    opensea: {
      description: "The mark of a generous eggplant whale.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1275.png",
    },
  },
  "Goblin Lantern": {
    image: goblinLantern,
    description: {
      en: "A scary looking lantern",
      pt: "Uma lanterna com uma aparência assustadora",
      "zh-CN": "看着吓人的灯笼",
      fr: "Une lanterne au look effrayant.",
      tk: "Korkunç görünümlü bir fener",
    },
    opensea: {
      description: "A scary looking lantern",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1276.png",
    },
  },
  "Dawn Flower": {
    image: dawnFlower,
    description: {
      en: "Embrace the radiant beauty of the Dawn Flower as its delicate petals shimmer with the first light of day",
      pt: "Abraçe a beleza radiante da Flor da Aurora enquanto suas pétalas delicadas brilham com a primeira luz do dia",
      "zh-CN": "拥吻 Dawn Flower 的夺目美丽，她精致的花瓣闪烁着第一缕晨光",
      fr: "Embrassez la beauté radieuse de la Dawn Flower alors que ses pétales délicats scintillent avec les premières lueurs du jour.",
      tk: "Günün ilk ışıklarında narin yaprakları parıldayan Şafak Çiçeğinin ışıltılı güzelliğini kucaklayın",
    },
    opensea: {
      description:
        "Embrace the radiant beauty of the Dawn Flower as its delicate petals shimmer with the first light of day.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1277.png",
    },
  },
  "Gold Pass": {
    image: goldPass,
    description: {
      en: "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
      pt: "Um passe exclusivo que permite ao portador criar NFTs raros, negociar, sacar e acessar conteúdo bônus.",
      "zh-CN":
        "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
      fr: "Un laissez-passer exclusif permettant au détenteur de fabriquer des NFT rares, de commercer, de retirer et d'accéder à du contenu bonus.",
      tk: "Sahibinin nadir NFT'ler oluşturmasına, ticaret yapmasına, para çekmesine ve bonus içeriğe erişmesine olanak tanıyan özel bir geçiş kartı.",
    },
    opensea: {
      description:
        "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/726.png",
    },
  },
  Poppy: {
    image: poppy,
    description: {
      en: "The mystical corn kernel. +0.1 Corn per harvest,",
      pt: "O grão de milho místico. +0,1 Milho por colheita,",
      "zh-CN": "神秘的玉米粒。玉米产量 +0.1",
      fr: "Le noyau de maïs mystique. +0,1 de Corn par récolte,",
      tk: "Mistik mısır çekirdeği.Mısır hasatında hasat başı +0.1 ekler,",
    },
    opensea: {
      description: "The mystical corn kernel. +0.1 Corn per harvest.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Corn Yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/471.png",
    },
  },
  "El Pollo Veloz": {
    image: elPolloVeloz,
    description: {
      en: "Give me those eggs, fast! 4 hour speed boost on egg laying.",
      pt: "Dê-me esses ovos rápido! Aumento de velocidade de 4 horas na postura de ovos.",
      "zh-CN": "交出那些蛋，快！鸡的下蛋速度加快 4 小时。",
      fr: "Donnez-moi ces œufs, vite ! Boost de vitesse de 4 heures sur la ponte des œufs.",
      tk: "Şu yumurtaları bana ver,çabuk! Yumurtlamada 4 saatlik hız artışı.",
    },
    opensea: {
      description:
        "Give me those eggs, fast! 4 hour speed boost on egg laying.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Animal",
        },
        {
          display_type: "boost_number",
          trait_type: "Egg Production Time (hours)",
          value: -4,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/470.gif",
    },
  },
  "Grain Grinder": {
    image: grainGrinder,
    description: {
      en: "Grind your grain and experience a delectable surge in Cake XP.",
      pt: "Moa seu grão e experimente um aumento delicioso no XP do bolo.",
      "zh-CN": "磨碎你的谷物，享受美味蛋糕，增加你获得的 XP",
      fr: "Moulez votre grain et ressentez une montée délectable de l'XP du gâteau.",
      tk: "Tahılını öğüt ve pasta XP’sinde nefis bir artışın tadını çıkar.",
    },
    opensea: {
      description:
        "Grind your grain and experience a delectable surge in Cake XP.",
      attributes: [
        {
          trait_type: "Boost",
          value: "XP",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Cake XP",
          value: 20,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/472.png",
    },
  },
  Kernaldo: {
    image: kernaldo,
    description: {
      en: "The magical corn whisperer. +25% Corn Growth Speed.",
      pt: "O sussurro de milho mágico. +25% de Velocidade de Crescimento de Milho.",
      "zh-CN": "神奇的玉米语者让玉米达 25 % 更快高长大",
      fr: "Le chuchoteur de maïs magique. +25% de vitesse de croissance du Corn.",
      tk: "Büyülü mısır fısıldayan. Mısırlar için 25% büyüme hızı.",
    },
    opensea: {
      description: "The magical corn whisperer.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Corn Growth Time",
          value: -25,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/473.png",
    },
  },
  Candles: {
    image: candles,
    description: {
      en: "Enchant your farm with flickering spectral flames during Witches' Eve.",
      pt: "Encante sua fazenda com chamas espectrais cintilantes durante a Véspera das Bruxas.",
      "zh-CN": "在女巫之夜借跳跃的火焰为您的农场附上魔力",
      fr: "Enchantez votre ferme avec des flammes spectrales vacillantes pendant la Veille des Sorcières.",
      tk: "Cadılar Bayramı sırasında çiftliğinizi titreyen hayalet alevlerle büyüleyin.",
    },
    opensea: {
      description:
        "Enchant your farm with flickering spectral flames during Witches' Eve.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1278.png",
    },
  },
  "Haunted Stump": {
    image: hauntedStump,
    description: {
      en: "Summon spirits and add eerie charm to your farm.",
      pt: "Chame espíritos e adicione charme sinistro à sua fazenda.",
      "zh-CN": "召来通灵让你的农场萦绕鬼魅",
      fr: "Invoquez des esprits et ajoutez un charme étrange à votre ferme.",
      tk: "Ruhları çağırın ve çiftliğinize ürkütücü bir çekicilik katın.",
    },
    opensea: {
      description: "Summon spirits and add eerie charm to your farm.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1279.png",
    },
  },
  "Spooky Tree": {
    image: spookyTree,
    description: {
      en: "A hauntingly fun addition to your farm's decor!",
      pt: "Uma adição assustadoramente divertida à decoração da sua fazenda!",
      "zh-CN": "增添农场上的闹鬼奇趣！",
      fr: "Un ajout amusant et hanté à la décoration de votre ferme!",
      tk: "Çiftliğinizin dekoruna akıl almaz derecede eğlenceli bir katkı!",
    },
    opensea: {
      description: "A hauntingly fun addition to your farm's decor!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1280.png",
    },
  },
  Observer: {
    image: observer,
    description: {
      en: "A perpetually roving eyeball, always vigilant and ever-watchful!",
      pt: "Um globo ocular em movimento perpétuo, sempre vigilante e sempre atento!",
      "zh-CN": "永不停转的眼珠，永存戒心、永不松眼！",
      fr: "Un œil perpétuellement en mouvement, toujours vigilant et attentif!",
      tk: "Sürekli gezinen bir göz küresi, her zaman tetikte ve her zaman tetikte!",
    },
    opensea: {
      description:
        "A perpetually roving eyeball, always vigilant and ever-watchful!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1285.png",
    },
  },
  "Crow Rock": {
    image: crowRock,
    description: {
      en: "A crow perched atop a mysterious rock.",
      pt: "Um corvo empoleirado em uma rocha misteriosa.",
      "zh-CN": "乌鸦栖息的神秘石块",
      fr: "Un corbeau perché sur un rocher mystérieux.",
      tk: "Gizemli bir kayanın tepesine tünemiş bir karga.",
    },
    opensea: {
      description: "A crow perched atop a mysterious rock.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1286.png",
    },
  },
  "Mini Corn Maze": {
    image: miniCornMaze,
    description: {
      en: "A memento of the beloved maze from the 2023 Witches' Eve season.",
      pt: "Uma lembrança do adorado labirinto da temporada Witches' Eve de 2023.",
      "zh-CN": "2023 年女巫之夜时季广受喜爱迷宫的纪念品",
      fr: "Un souvenir du labyrinthe bien-aimé de la saison de la Veille des Sorcières 2023.",
      tk: "2023 Cadılar Bayramı sezonundan sevilen labirentten bir hatıra.",
    },
    opensea: {
      description:
        "A memento of the beloved maze from the 2023 Witches' Eve season.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1287.png",
    },
  },
  "Giant Cabbage": {
    image: giantCabbage,
    description: {
      en: "A giant cabbage.",
      pt: "A giant cabbage.",
      "zh-CN": "A giant cabbage.",
      fr: "A giant cabbage.",
      tk: "A giant cabbage.",
    },
    opensea: {
      description: "A giant cabbage!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1281.png",
    },
  },
  "Giant Potato": {
    image: giantPotato,
    description: {
      en: "A giant potato.",
      pt: "A giant potato.",
      "zh-CN": "A giant potato.",
      fr: "A giant potato.",
      tk: "A giant potato.",
    },
    opensea: {
      description: "A giant potato!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1282.png",
    },
  },
  "Giant Pumpkin": {
    image: giantPumpkin,
    description: {
      en: "A giant pumpkin.",
      pt: "A giant pumpkin.",
      "zh-CN": "A giant pumpkin.",
      fr: "A giant pumpkin.",
      tk: "A giant pumpkin.",
    },
    opensea: {
      description: "A giant pumpkin!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1283.png",
    },
  },
  "Potion Ticket": {
    image: potionPoint,
    description: {
      en: "A reward from the Potion House. Use this to buy items from Garth.",
      pt: "A reward from the Potion House. Use this to buy items from Garth.",
      "zh-CN":
        "A reward from the Potion House. Use this to buy items from Garth.",
      fr: "A reward from the Potion House. Use this to buy items from Garth.",
      tk: "A reward from the Potion House. Use this to buy items from Garth.",
    },
    opensea: {
      description: "A Potion Ticket!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/727.png",
    },
  },
  "Lab Grown Carrot": {
    image: labGrownCarrot,
    description: {
      en: "+0.2 Carrot Yield",
      pt: "+0.2 Carrot Yield",
      "zh-CN": "+0.2 Carrot Yield",
      fr: "+0.2 Carrot Yield",
      tk: "+0.2 Carrot Yield",
    },
    opensea: {
      description: "A lab grown carrot! +0.2 Carrot Yield.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Carrot Yield",
          value: 0.2,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/475.png",
    },
  },
  "Lab Grown Pumpkin": {
    image: labGrownPumpkin,
    description: {
      en: "+0.3 Pumpkin Yield",
      pt: "+0.3 Pumpkin Yield",
      "zh-CN": "+0.3 Pumpkin Yield",
      fr: "+0.3 Pumpkin Yield",
      tk: "+0.3 Pumpkin Yield",
    },
    opensea: {
      description: "A lab grown pumpkin! +0.3 Pumpkin Yield.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Pumpkin Yield",
          value: 0.3,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/476.png",
    },
  },
  "Lab Grown Radish": {
    image: labGrownRadish,
    description: {
      en: "+0.4 Radish Yield",
      pt: "+0.4 Radish Yield",
      "zh-CN": "+0.4 Radish Yield",
      fr: "+0.4 Radish Yield",
      tk: "+0.4 Radish Yield",
    },
    opensea: {
      description: "A lab grown radish! +0.4 Radish Yield.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Radish Yield",
          value: 0.4,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/477.png",
    },
  },
  "Adirondack Potato": {
    image: adirondackPotato,
    description: {
      en: "A rugged spud, Adirondack style!",
      pt: "A rugged spud, Adirondack style!",
      "zh-CN": "A rugged spud, Adirondack style!",
      fr: "A rugged spud, Adirondack style!",
      tk: "A rugged spud, Adirondack style!",
    },
    opensea: {
      description: "A rugged spud, Adirondack style!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1405.png",
    },
  },
  "Black Magic": {
    image: blackMagic,
    description: {
      en: "A dark and mysterious flower!",
      pt: "A dark and mysterious flower!",
      "zh-CN": "A dark and mysterious flower!",
      fr: "A dark and mysterious flower!",
      tk: "A dark and mysterious flower!",
    },
    opensea: {
      description: "A dark and mysterious flower!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1401.png",
    },
  },
  Chiogga: {
    image: chiogga,
    description: {
      en: "A rainbow beet!",
      pt: "A rainbow beet!",
      "zh-CN": "A rainbow beet!",
      fr: "A rainbow beet!",
      tk: "A rainbow beet!",
    },
    opensea: {
      description: "A rainbow beet!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1403.png",
    },
  },
  "Golden Helios": {
    image: goldenHelios,
    description: {
      en: "Sun-kissed grandeur!",
      pt: "Sun-kissed grandeur!",
      "zh-CN": "Sun-kissed grandeur!",
      fr: "Sun-kissed grandeur!",
      tk: "Sun-kissed grandeur!",
    },
    opensea: {
      description: "Sun-kissed grandeur!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1402.png",
    },
  },
  "Purple Cauliflower": {
    image: purpleCauliflower,
    description: {
      en: "A regal purple cauliflowser",
      pt: "A regal purple cauliflowser",
      "zh-CN": "A regal purple cauliflowser",
      fr: "A regal purple cauliflowser",
      tk: "A regal purple cauliflowser",
    },
    opensea: {
      description: "A regal purple cauliflower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1404.png",
    },
  },
  "Warty Goblin Pumpkin": {
    image: wartyGoblinPumpkin,
    description: {
      en: "A whimsical, wart-covered pumpkin",
      pt: "A whimsical, wart-covered pumpkin",
      "zh-CN": "A whimsical, wart-covered pumpkin",
      fr: "A whimsical, wart-covered pumpkin",
      tk: "A whimsical, wart-covered pumpkin",
    },
    opensea: {
      description: "A whimsical, wart-covered pumpkin",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1406.png",
    },
  },
  "White Carrot": {
    image: whiteCarrot,
    description: {
      en: "A pale carrot with pale roots",
      pt: "A pale carrot with pale roots",
      "zh-CN": "A pale carrot with pale roots",
      fr: "A pale carrot with pale roots",
      tk: "A pale carrot with pale roots",
    },
    opensea: {
      description: "A pale carrot with pale roots",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Exotic",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1407.png",
    },
  },
  "Bud Ticket": {
    image: budTicket,
    description: {
      en: "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
      pt: "Um lugar garantido para mintar um Bud no lançamento de NFTs do Sunflower Land Buds.",
      "zh-CN":
        "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
      fr: "Une place garantie pour frapper un Bud lors de la distribution des NFT Sunflower Land Buds.",
      tk: "Sunflower Land Buds NFT düşüşünde Bud basmak için garantili bir yer.",
    },
    opensea: {
      description:
        "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/728.png",
    },
  },
  "Bud Seedling": {
    image: budSeedling,
    description: {
      en: "A seedling to be exchanged for a free Bud NFT",
      pt: "Uma muda a ser trocada por um Bud NFT gratuito",
      "zh-CN": "A seedling to be exchanged for a free Bud NFT",
      fr: "Une jeune pousse à échanger contre un NFT Bud gratuit",
      tk: "Ücretsiz Bud NFT ile değiştirilecek bir fide",
    },
    opensea: {
      description: "A seedling that was exchanged for a bud NFT",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/729.png",
    },
  },
  "Town Sign": {
    image: sign,
    description: {
      en: "Show your farm ID with pride!",
      pt: "Mostre sua identificação da fazenda com orgulho!",
      "zh-CN": "骄傲地炫耀您的农场号码吧！",
      fr: "Montrez fièrement votre ID de ferme!",
      tk: "Çiftlik kimliğinizi gururla gösterin!",
    },
    opensea: {
      description: "Show your farm ID with pride!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1284.png",
    },
  },
  "White Crow": {
    image: whiteCrow,
    description: {
      en: "A mysterious and ethereal white crow",
      pt: "Um corvo branco misterioso e etéreo",
      "zh-CN": "神秘空灵的白乌鸦",
      fr: "Un corbeau blanc mystérieux et éthéré.",
      tk: "Gizemli ve ruhani bir beyaz karga",
    },
    opensea: {
      description: "A mysterious and ethereal white crow.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1288.gif",
    },
  },
  Earthworm: {
    image: earthworm,
    description: {
      en: "A wriggly worm that attracts small fish.",
      pt: "A wriggly worm that attracts small fish.",
      "zh-CN": "A wriggly worm that attracts small fish.",
      fr: "A wriggly worm that attracts small fish.",
      tk: "A wriggly worm that attracts small fish.",
    },
    opensea: {
      description: "A wriggly worm used to catch fish.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bait",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/626.png",
    },
  },
  Grub: {
    image: grub,
    description: {
      en: "A juicy grub - perfect for advanced fish.",
      pt: "A juicy grub - perfect for advanced fish.",
      "zh-CN": "A juicy grub - perfect for advanced fish.",
      fr: "A juicy grub - perfect for advanced fish.",
      tk: "A juicy grub - perfect for advanced fish.",
    },
    opensea: {
      description: "A juicy grub used to catch fish.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bait",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/627.png",
    },
  },
  "Red Wiggler": {
    image: redWiggler,
    description: {
      en: "An exotic worm that entices rare fish.",
      pt: "An exotic worm that entices rare fish.",
      "zh-CN": "An exotic worm that entices rare fish.",
      fr: "An exotic worm that entices rare fish.",
      tk: "An exotic worm that entices rare fish.",
    },
    opensea: {
      description: "A red wiggler used to catch fish.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bait",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/628.png",
    },
  },
  "Fishing Lure": {
    image: fishingLure,
    description: {
      en: "Great for catching rare fish ! ",
      pt: "Great for catching rare fish ! ",
      "zh-CN": "Great for catching rare fish ! ",
      fr: "Great for catching rare fish ! ",
      tk: "Great for catching rare fish ! ",
    },
    opensea: {
      description: "A fishing lure! Great for catching big fish!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Bait",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/632.png",
    },
  },
  "Sprout Mix": {
    boostedDescriptions: [
      {
        name: "Knowledge Crab",
        description: "Sprout Mix increases your crop yield from plots by +0.4",
      },
    ],
    image: "sproutMix",
    description: {
      en: "Sprout Mix increases your crop yield from plots by +0.2",
      pt: "Sprout Mix increases your crop yield from plots by +0.2",
      "zh-CN": "Sprout Mix increases your crop yield from plots by +0.2",
      fr: "Sprout Mix increases your crop yield from plots by +0.2",
      tk: "Sprout Mix increases your crop yield from plots by +0.2",
    },
    opensea: {
      description: "Sprout Mix increases your crop yield by +0.2",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Purpose",
          value: "Fertiliser",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Crop Yield",
          value: 0.2,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/629.png",
    },
  },
  "Fruitful Blend": {
    image: fruitfulBlend,
    description: {
      en: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      pt: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      "zh-CN":
        "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      fr: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      tk: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
    },
    opensea: {
      description: "This compost boosts each fruit yield by +0.1",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          trait_type: "Purpose",
          value: "Fertiliser",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Fruit Yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/630.png",
    },
  },
  "Rapid Root": {
    image: rapidRoot,
    description: {
      en: "Rapid Root reduces crop growth time from plots by 50%",
      pt: "Rapid Root reduces crop growth time from plots by 50%",
      "zh-CN": "Rapid Root reduces crop growth time from plots by 50%",
      fr: "Rapid Root reduces crop growth time from plots by 50%",
      tk: "Rapid Root reduces crop growth time from plots by 50%",
    },
    opensea: {
      description: "Rapid Root reduces crop growth time by 50%",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Purpose",
          value: "Fertiliser",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Crop Growth Time",
          value: -50,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/631.png",
    },
  },
  Anchovy: {
    image: anchovy,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's pocket-sized darting acrobat, always in a hurry!",
      pt: "O acrobata saltitante do oceano, sempre com pressa!",
      "zh-CN": "海洋里的袖珍飞镖，总是匆匆忙忙！",
      fr: "L'acrobate miniature des océans, toujours pressé!",
      tk: "Okyanusun cep boyutunda dart akrobatı, her zaman acelesi var!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1501.png",
    },
  },
  Butterflyfish: {
    image: butterflyfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A fish with a fashion-forward sense, flaunting its vivid, stylish stripes.",
      pt: "Um peixe com um senso de moda avançado, exibindo suas listras vívidas e estilosas.",
      "zh-CN": "时尚前卫的鱼，显摆其鲜艳、时髦的条纹。",
      fr: "Un poisson à la mode, arborant ses rayures vives et élégantes.",
      tk: "Canlı, şık çizgileriyle gösteriş yapan, ileri moda anlayışına sahip bir balık.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1502.png",
    },
  },
  Blowfish: {
    image: blowfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The round, inflated comedian of the sea, guaranteed to bring a smile.",
      pt: "O comediante redondo e inflado do mar, garantido para trazer um sorriso.",
      "zh-CN": "海中的圆润喜剧演员，保证让你笑容满面。",
      fr: "Le comique rond et gonflé de la mer, garanti pour vous faire sourire.",
      tk: "Denizin yuvarlak, şişirilmiş komedyeni, bir gülümseme getirmeyi garanti ediyor.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1503.png",
    },
  },
  Clownfish: {
    image: clownfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The underwater jester, sporting a tangerine tuxedo and a clownish charm.",
      pt: "O bobo da corte subaquático, vestindo um terno tangerina e um charme de palhaço.",
      "zh-CN": "水下的小丑，身着橘色礼服，充满小丑般的魅力。",
      fr: "Le bouffon sous-marin, portant un smoking mandarine et un charme clownesque.",
      tk: "Mandalina rengi bir smokini ve palyaço çekiciliğiyle su altı soytarısı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1504.png",
    },
  },
  "Sea Bass": {
    image: seaBass,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Your 'not-so-exciting' friend with silver scales – a bassic catch!",
      pt: "Seu amigo 'não-tão-exciting' com escamas prateadas - uma captura básica!",
      "zh-CN": "你的“不那么令人兴奋的”朋友，银色的鳞片——一个基础的捕获！",
      fr: "Votre ami 'pas très excitant' aux écailles argentées - une prise basique!",
      tk: "Gümüş pullu 'o kadar da heyecan verici olmayan' arkadaşınız – basit bir yakalama!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1505.png",
    },
  },
  "Sea Horse": {
    image: seahorse,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's slow-motion dancer, swaying gracefully in the aquatic ballet.",
      pt: "O dançarino em câmera lenta do oceano, balançando gracioso no balé aquático.",
      "zh-CN": "海洋中的慢动作舞者，在水下芭蕾中优雅地摇摆。",
      fr: "La danseuse au ralenti de l'océan, se balançant gracieusement dans le ballet aquatique.",
      tk: "Okyanusun ağır çekim dansçısı, su balesinde zarif bir şekilde sallanıyor.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1506.png",
    },
  },
  "Horse Mackerel": {
    image: horseMackerel,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A speedster with a shiny coat, always racing through the waves.",
      pt: "Um velocista com um casaco brilhante, sempre correndo pelas ondas.",
      "zh-CN": "一位身披闪亮外衣的速度选手，总是在波浪中穿梭。",
      fr: "Un sprinter à la brillante robe, toujours en course à travers les vagues.",
      tk: "Daima dalgaların arasında yarışan, parlak paltolu bir hızcı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1507.png",
    },
  },
  Squid: {
    image: squid,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The deep-sea enigma with tentacles to tickle your curiosity.",
      pt: "O enigma das profundezas com tentáculos para despertar sua curiosidade.",
      "zh-CN": "深海之谜，用其触须勾起你的好奇心。",
      fr: "L'énigme des profondeurs avec des tentacules pour titiller votre curiosité.",
      tk: "Merakınızı gıdıklayacak dokunaçlara sahip derin deniz gizemi.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1508.png",
    },
  },
  "Red Snapper": {
    image: redSnapper,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A catch worth its weight in gold, dressed in fiery crimson.",
      pt: "Uma captura que vale seu peso em ouro, vestida de carmesim ardente.",
      "zh-CN": "价值连城的捕获，身披火红色。",
      fr: "Une prise qui vaut son pesant d'or, vêtue de rouge ardent.",
      tk: "Ağır kırmızıya bürünmüş, ağırlığınca altın değerinde bir av.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1509.png",
    },
  },
  "Moray Eel": {
    image: morayEel,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A slinky, sinister lurker in the ocean's shadowy corners.",
      pt: "Um espreitador sinistro e sinuoso nos cantos sombrios do oceano.",
      "zh-CN": "海洋中阴暗角落里的狡猾潜伏者。",
      fr: "Un habitant sinistre et insaisissable des coins sombres de l'océan.",
      tk: "Okyanusun gölgeli köşelerinde sinsi, uğursuz bir pusuya yatmış.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1510.png",
    },
  },
  "Olive Flounder": {
    image: oliveFlounder,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The seabed's master of disguise, always blending in with the crowd.",
      pt: "O mestre do disfarce do leito marinho, sempre se misturando com a multidão.",
      "zh-CN": "海床上的伪装大师，总是与众不同。",
      fr: "Le maître du déguisement du fond marin, toujours en train de se fondre dans la foule.",
      tk: "Deniz yatağının kılık değiştirme ustası, her zaman kalabalığa karışıyor.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1511.png",
    },
  },
  Napoleanfish: {
    image: napoleonfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Meet the fish with the Napoleon complex – short, but regal!",
      pt: "Conheça o peixe com o complexo de Napoleão - curto, mas real!",
      "zh-CN": "认识一下患有拿破仑情结的鱼——短小，但雍容华贵！",
      fr: "Rencontrez le poisson au complexe de Napoléon - petit, mais royal!",
      tk: "Balıklarla Napolyon kompleksiyle tanışın – kısa ama muhteşem!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1512.png",
    },
  },
  Surgeonfish: {
    image: surgeonfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's neon warrior, armed with a spine-sharp attitude.",
      pt: "O guerreiro neon do oceano, armado com uma atitude afiada de espinha.",
      "zh-CN": "海洋中的霓虹战士，武装着锋利的态度。",
      fr: "Le guerrier néon de l'océan, armé d'une attitude pointue.",
      tk: "Okyanusun neon savaşçısı, keskin bir tavırla donanmış.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1513.png",
    },
  },
  "Zebra Turkeyfish": {
    image: zebraTurkeyfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Stripes, spines, and a zesty disposition, this fish is a true showstopper!",
      pt: "Listras, espinhos e uma disposição, este peixe é um verdadeiro espetáculo!",
      "zh-CN": "条纹、刺和充满活力的性格，这条鱼是真正的焦点！",
      fr: "Des rayures, des épines et une disposition zestée, ce poisson est vraiment sensationnel!",
      tk: "Çizgileri, dikenleri ve neşeli yapısıyla bu balık gerçek bir gösterişçidir!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1514.png",
    },
  },
  Ray: {
    image: ray,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The underwater glider, a serene winged beauty through the waves.",
      pt: "O planejador subaquático, uma beleza alada serena através das ondas.",
      "zh-CN": "水下的滑翔者，通过波浪中的宁静翅膀展现出的优雅。",
      fr: "Le planeur sous-marin, une belle aile sereine à travers les vagues.",
      tk: "Su altı planörü, dalgaların arasından geçen sakin kanatlı bir güzellik.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1515.png",
    },
  },
  "Hammerhead shark": {
    image: hammerheadShark,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Meet the shark with a head for business, and a body for adventure!",
      pt: "Conheça o tubarão com cabeça para negócios e corpo para aventura!",
      "zh-CN": "这是一只头脑灵活、身体追求冒险的鲨鱼！",
      fr: "Rencontrez le requin à la tête d'affiche, prêt pour une collision de tête avec la saveur!",
      tk: "İş için kafası ve macera için vücudu olan köpekbalığıyla tanışın!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1516.png",
    },
  },
  Tuna: {
    image: tuna,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's muscle-bound sprinter, ready for a fin-tastic race!",
      pt: "O velocista musculoso do oceano, pronto para uma corrida fantástica!",
      "zh-CN": "海洋中肌肉发达的短跑运动员，准备好进行一场鳍部的精彩比赛！",
      fr: "Le sprinter musclé de l'océan, prêt pour une course fantastique!",
      tk: "Okyanusun kaslı sprinteri, muhteşem bir yarışa hazır!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1517.png",
    },
  },
  "Mahi Mahi": {
    image: mahiMahi,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A fish that believes in living life colorfully with fins of gold.",
      pt: "Um peixe que acredita em viver a vida coloridamente com barbatanas de ouro.",
      "zh-CN": "一条相信生活要多姿多彩的鱼，金色的鳍片。",
      fr: "Un poisson qui croit en une vie colorée avec des nageoires dorées.",
      tk: "Altın yüzgeçlerle hayatı rengarenk yaşamaya inanan bir balık.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1518.png",
    },
  },
  "Blue Marlin": {
    image: blueMarlin,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "An oceanic legend, the marlin with an attitude as deep as the sea.",
      pt: "Uma lenda oceânica, o marlim com uma atitude tão profunda quanto o mar.",
      "zh-CN": "海洋的传奇，马林鱼，拥有深海一样的态度。",
      fr: "Une légende océanique, le marlin avec une attitude aussi profonde que la mer.",
      tk: "Okyanus efsanesi, tavrı deniz kadar derin olan marlin.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1519.png",
    },
  },
  Oarfish: {
    image: oarfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The long and the long of it – an enigmatic ocean wanderer.",
      pt: "O longo e o longo disso - um errante enigmático do oceano.",
      "zh-CN": "长而漫长——一位神秘的海洋流浪者。",
      fr: "Le long et le long de lui - un voyageur océanique énigmatique.",
      tk: "Uzun lafın kısası esrarengiz bir okyanus gezgini.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1520.png",
    },
  },
  "Football fish": {
    image: footballFish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The MVP of the deep, a bioluminescent star that's ready to play!",
      pt: "O MVP do fundo do mar, uma estrela bioluminescente pronta para jogar!",
      "zh-CN": "深海的MVP，一颗准备参与比赛的生物发光之星！",
      fr: "Le MVP des profondeurs, une star bioluminescente prête à jouer!",
      tk: "Derinlerin MVP'si, oynamaya hazır biyolüminesan bir yıldız!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1521.png",
    },
  },
  Sunfish: {
    image: sunfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's sunbather, basking in the spotlight with fins held high.",
      pt: "O banhista do oceano, banhando-se no holofote com barbatanas erguidas.",
      "zh-CN": "海洋中的晒太阳者，高举鳍片，享受着聚光灯下的时刻。",
      fr: "Le preneur de soleil de l'océan, se prélassant sous les projecteurs avec des nageoires bien dressées.",
      tk: "Okyanusta güneşlenen, yüzgeçlerini yüksekte tutarak spot ışıklarının tadını çıkarıyor.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1522.png",
    },
  },
  Coelacanth: {
    image: coelacanth,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A prehistoric relic, with a taste for the past and the present.",
      pt: "Um relicário pré-histórico, com um gosto pelo passado e pelo presente.",
      "zh-CN": "一个古老的遗迹，对过去和现在都有一种品味。",
      fr: "Un vestige préhistorique, avec un goût pour le passé et le présent.",
      tk: "Geçmişe ve bugüne dair bir tada sahip, tarih öncesi bir kalıntı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1523.png",
    },
  },
  "Whale Shark": {
    image: whaleShark,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The gentle giant of the deep, sifting treasures from the ocean's buffet.",
      pt: "O gigante gentil das profundezas, peneirando tesouros no buffet do oceano.",
      "zh-CN": "深海的温柔巨人，从海洋的自助餐中筛选珍宝。",
      fr: "Le doux géant des profondeurs, filtrant les trésors du buffet océanique.",
      tk: "Derinlerin nazik devi, okyanusun büfesinden hazineleri ayıklıyor.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1524.png",
    },
  },
  "Barred Knifejaw": {
    image: barredKnifejaw,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "An oceanic outlaw with black-and-white stripes and a heart of gold.",
      pt: "Um fora da lei oceânico com listras em preto e branco e um coração de ouro.",
      "zh-CN": "一位带有黑白条纹和黄金心的海洋流氓。",
      fr: "Un hors-la-loi océanique aux rayures noires et blanches et au cœur d'or.",
      tk: "Siyah-beyaz çizgili ve altın kalpli bir okyanus kanun kaçağı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1525.png",
    },
  },
  "Saw Shark": {
    image: sawShark,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "With a saw-like snout, it's the ocean's carpenter, always cutting edge!",
      pt: "Com um focinho em forma de serra, é o carpinteiro do oceano, sempre à frente!",
      "zh-CN": "以锯齿状的吻，它是海洋的木工，总是走在潮流的前沿！",
      fr: "Avec un museau en forme de scie, c'est le charpentier de l'océan, toujours à la pointe!",
      tk: "Testere benzeri burnuyla okyanusun marangozudur, her zaman son teknolojiye sahiptir!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1526.png",
    },
  },
  "White Shark": {
    image: whiteShark,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The shark with a killer smile, ruling the seas with fin-tensity!",
      pt: "O tubarão com um sorriso assassino, dominando os mares com intensidade de barbatana!",
      "zh-CN": "带着杀手般的笑容统治海洋的鲨鱼，以鳍的强度为傲！",
      fr: "Le requin au sourire meurtrier, régnant sur les mers avec une fin-tensité!",
      tk: "Denizleri son derece güçlü bir şekilde yöneten, öldürücü gülümsemeye sahip köpekbalığı!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1527.png",
    },
  },
  "Twilight Anglerfish": {
    image: twilightAnglerfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A deep-sea angler with a built-in nightlight, guiding its way through darkness.",
      pt: "Um pescador de águas profundas com uma luz noturna embutida, guiando seu caminho através da escuridão.",
      "zh-CN": "一种深海琵琶鱼，内置夜灯，引领其穿越黑暗。",
      fr: "Un poisson-pêcheur des profondeurs avec une lumière intégrée, guidant son chemin à travers les ténèbres.",
      tk: "Dahili gece lambasına sahip, karanlıkta yolunu gösteren bir derin deniz balıkçısı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1528.png",
    },
  },
  "Starlight Tuna": {
    image: startlightTuna,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A tuna that outshines the stars, ready to light up your collection.",
      pt: "Um atum que supera as estrelas, pronto para iluminar sua coleção.",
      "zh-CN": "一条比星星还要耀眼的金枪鱼，准备照亮你的收藏。",
      fr: "Un thon qui brille plus que les étoiles, prêt à illuminer votre collection.",
      tk: "Koleksiyonunuzu aydınlatmaya hazır, yıldızları gölgede bırakan bir ton balığı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1529.png",
    },
  },
  "Radiant Ray": {
    image: radiantRay,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A ray that prefers to glow in the dark, with a shimmering secret to share.",
      pt: "Um raio que prefere brilhar no escuro, com um segredo cintilante para compartilhar.",
      "zh-CN": "一种在黑暗中发光的鳐鱼，有着闪亮的秘密要分享。",
      fr: "Une raie qui préfère briller dans l'obscurité, avec un secret scintillant à partager.",
      tk: "Paylaşacak parıldayan bir sırrı olan, karanlıkta parlamayı tercih eden bir ışın.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Iron Yield",
          value: 0.1,
        },
      ],
      image: "../public/erc1155/images/1530.png",
    },
  },
  "Phantom Barracuda": {
    image: phantomBarracuda,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "An elusive and ghostly fish of the deep, hiding in the shadows.",
      pt: "Um peixe fantasmagórico e elusivo das profundezas, escondido nas sombras.",
      "zh-CN": "一种深海中难以捉摸且幽灵般的鱼，隐藏在阴影中。",
      fr: "Un barracuda insaisissable et fantomatique des profondeurs, se cachant dans les ombres.",
      tk: "Derinlerin, gölgelerde saklanan, bulunması zor ve hayaletimsi bir balığı.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1531.png",
    },
  },
  "Gilded Swordfish": {
    image: gildedSwordfish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A swordfish with scales that sparkle like gold, the ultimate catch!",
      pt: "Um peixe-espada com escamas que brilham como ouro, a captura definitiva!",
      "zh-CN": "一条鳞片闪耀如金的剑鱼，终极的捕获！",
      fr: "Un espadon aux écailles qui scintillent comme de l'or, la capture ultime!",
      tk: "Altın gibi parıldayan pullara sahip bir kılıç balığı, en iyi av!",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Gold Yield",
          value: 0.1,
        },
      ],
      image: "../public/erc1155/images/1532.png",
    },
  },
  "Crimson Carp": {
    image: crimsonCarp,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A rare, vibrant jewel of the Spring waters.",
      pt: "Uma joia rara e vibrante das águas da primavera.",
      "zh-CN": "春天水域中稀有、充满活力的宝石。",
      fr: "Un joyau rare et vibrant des eaux du printemps.",
      tk: "Kaynak sularının nadir, canlı bir mücevheri.",
    },
    opensea: {
      description: "A rare, vibrant jewel of the Spring waters.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Crimstone Yield",
          value: 0.05,
        },
      ],
      image: "../public/erc1155/images/1537.png",
    },
  },
  "Battle Fish": {
    image: battleFish,
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "The rare armored swimmer of faction season!",
      pt: "The rare armored swimmer of faction season!",
      "zh-CN": "派系赛季稀有的装甲游泳者！",
      fr: "The rare armored swimmer of faction season!",
      tk: "The rare armored swimmer of faction season!",
    },
    opensea: {
      description: "The rare armored swimmer of faction season!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Oil Yield",
          value: 0.05,
        },
      ],
      image: "../public/erc1155/images/1538.png",
    },
  },
  "Kraken Tentacle": {
    image: krakenTentacle,
    description: {
      en: "Dive into deep-sea mystery! This tentacle teases tales of ancient ocean legends and watery wonders.",
      pt: "Mergulhe no mistério do mar profundo! Este tentáculo provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
      "zh-CN": "挖掘深海奥秘！这触手戏说着古老海洋传说与水底奇世的故事",
      fr: "Plongez dans le mystère des profondeurs ! Cette tentacule évoque des contes anciens de légendes marines et de merveilles aquatiques.",
      tk: "Derin deniz gizemine dalın! Bu dokunaç, antik okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
    },
    opensea: {
      description: "Protect the beach and catch the Kraken!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1533.png",
    },
  },
  "Sapo Docuras": {
    image: sapoDocuras,
    description: {
      en: "A real treat!",
      pt: "Um verdadeiro agrado!",
      "zh-CN": "真正的享受！",
      fr: "Un vrai régal!",
      tk: "Gerçek bir tehdit!",
    },
    opensea: {
      description: "A real treat this halloween!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1295.gif",
    },
  },
  "Sapo Travessuras": {
    image: sapoTravessura,
    description: {
      en: "Oh oh...someone was naughty",
      pt: "Oh oh... alguém foi travesso",
      "zh-CN": "噢噢……有人调皮了",
      fr: "Oh oh... quelqu'un a été méchant.",
      tk: "Oh oh... birisi yaramazlık yapmış",
    },
    opensea: {
      description: "Oh oh....someone was naughty!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1296.gif",
    },
  },
  "Lifeguard Ring": {
    image: lifeguardRing,
    description: {
      en: "Stay afloat with style, your seaside savior!",
      pt: "Mantenha-se à tona com estilo, seu salvador à beira-mar!",
      "zh-CN": "漂浮你的风尚，你的海岸救星！",
      fr: "Restez à flot avec style, votre sauveur en bord de mer!",
      tk: "Deniz kenarındaki kurtarıcınız, stilinizle ayakta kalın!",
    },
    opensea: {
      description: "Stay afloat with style, your seaside savior!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1289.png",
    },
  },
  "Beach Umbrella": {
    image: beachUmbrella,
    description: {
      en: "Shade, shelter, and seaside chic in one sunny setup!",
      pt: "Sombra, abrigo e elegância à beira-mar em um único conjunto ensolarado!",
      "zh-CN": "遮阳、歇息，一撑架起海滨风尚！",
      fr: "Ombre, abri et élégance en bord de mer en un seul arrangement ensoleillé!",
      tk: "Güneşli bir ortamda gölge, barınak ve deniz kenarı şıklığı!",
    },
    opensea: {
      description: "Shade, shelter, and seaside chic in one sunny setup!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1294.png",
    },
  },
  "Hideaway Herman": {
    image: hideawayHerman,
    description: {
      en: "Herman's here to hide, but always peeks for a party!",
      pt: "Herman está aqui para se esconder, mas sempre dá uma espiada em uma festa!",
      "zh-CN": "Herman 在这躲着，但总是瞄着等派对！",
      fr: "Herman est là pour se cacher, mais regarde toujours pour une fête!",
      tk: "Herman saklanmak için burada ama her zaman bir parti arıyor!",
    },
    opensea: {
      description: "Herman's here to hide, but always peeks for a party!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1291.png",
    },
  },
  "Shifty Sheldon": {
    image: shiftySheldon,
    description: {
      en: "Sheldon's sly, always scuttling to the next sandy surprise!",
      pt: "Sheldon é astuto, sempre se movendo para a próxima surpresa arenosa!",
      "zh-CN": "狡猾的 Sheldon，总是匆忙凿着下一个沙岸惊喜！",
      fr: "Sheldon est sournois, toujours en train de se faufiler vers la prochaine surprise sableuse!",
      tk: "Sheldon kurnazdır, her zaman bir sonraki sürprize koşar!",
    },
    opensea: {
      description:
        "Sheldon's sly, always scuttling to the next sandy surprise!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1292.png",
    },
  },
  "Tiki Torch": {
    image: tikiTorch,
    description: {
      en: "Light the night, tropical vibes burning bright!",
      pt: "Ilumine a noite, vibrações tropicais brilhando intensamente!",
      "zh-CN": "照亮黑夜，热带风味点燃一切！",
      fr: "Illuminez la nuit, des vibrations tropicales brûlant brillamment!",
      tk: "Geceyi aydınlatın, tropik titreşimler parlak bir şekilde yanıyor!",
    },
    opensea: {
      description: "Light the night, tropical vibes burning bright!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1293.png",
    },
  },
  Surfboard: {
    image: surfboard,
    description: {
      en: "Ride the waves of wonder, beach bliss on board!",
      pt: "Surfe nas ondas da maravilha, bliss de praia a bordo!",
      "zh-CN": "驾驭你的惊涛骇浪，愿沙滩祝福你的浪板！",
      fr: "Ridez les vagues de l'émerveillement, béatitude de plage à bord!",
      tk: "Harika dalgalarda gezin, teknede plaj mutluluğu!",
    },
    opensea: {
      description: "Ride the waves of wonder, beach bliss on board!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/1290.png",
    },
  },
  Walrus: {
    image: walrus,
    description: {
      en: "With his trusty tusks and love for the deep, he'll ensure you reel in an extra fish every time",
      pt: "Com suas presas confiáveis e amor pelo fundo do mar, ele garantirá que você pesque um peixe extra toda vez",
      "zh-CN":
        "凭借他可靠的獠牙和对深海的热爱，他会确保你每次都能钓上额外一条鱼",
      fr: "Avec ses défenses fiables et son amour pour les profondeurs, il s'assurera que vous pêchiez un poisson de plus à chaque fois.",
      tk: "Güvenilir dişleri ve derinlere olan sevgisiyle, her seferinde ekstra bir balık yakalamanızı sağlayacaktır.",
    },
    opensea: {
      description:
        "With his trusty tusks and love for the deep, he'll ensure you reel in an extra fish every time",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Fish Yield",
          value: 1,
        },
        {
          trait_type: "Boost",
          value: "Fish",
        },
      ],
      image: "../public/erc1155/images/478.png",
    },
  },
  Alba: {
    image: alba,
    description: {
      en: "With her keen instincts, she ensures you get a little extra splash in your catch. 50% chance of +1 Basic Fish!",
      pt: "Com seus instintos afiados, ela garante que você receba um pouco de splash extra em sua pesca. 50% de chance de +1 Peixe Básico!",
      "zh-CN":
        "凭借她的敏锐直觉，她会确保你上钩的会有额外水花。50% 的几率 +1 基础鱼！",
      fr: "Avec ses instincts aiguisés, elle s'assure que vous avez un peu plus de plaisir dans votre pêche. 50 % de chances d'obtenir +1 poisson de base!",
      tk: "Keskin içgüdüleri sayesinde avınıza biraz daha fazla katkı sağlamanızı sağlar. %50 ihtimalle +1 Temel Balık!",
    },
    opensea: {
      description:
        "With her keen instincts, she ensures you get a little extra splash in your catch. 50% chance of +1 Basic Fish!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Chance of getting an extra Basic Fish",
          value: 50,
        },
        {
          trait_type: "Boost",
          value: "Fish",
        },
      ],
      image: "../public/erc1155/images/479.png",
    },
  },
  "Knowledge Crab": {
    image: knowledgeCrab,
    description: {
      en: "The Knowledge Crab doubles your Sprout Mix effect, making your soil treasures as rich as sea plunder!",
      pt: "O Caranguejo do Conhecimento duplica o efeito da sua Mistura de Broto, tornando seus tesouros de solo tão ricos quanto pilhagem do mar!",
      "zh-CN":
        "Knowledge Crab 让你的 Sprout Mix 效果翻倍，让你的田地财宝跟海上劫掠一样滋润！",
      fr: "Le crabe de la connaissance double l'effet de votre mélange de graines, rendant vos trésors de sol aussi riches que les pillages marins!",
      tk: "Bilgi Yengeç, Filiz Karışımı etkinizi ikiye katlayarak toprak hazinelerinizi deniz yağmacılığı kadar zengin hale getirir!",
    },
    opensea: {
      description:
        "The Knowledge Crab doubles your Sprout Mix effect, making your soil treasures as rich as sea plunder!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Sprout Mix Effect",
          value: 100,
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
      ],
      image: "../public/erc1155/images/480.png",
    },
  },
  Anchor: {
    image: anchor,
    description: {
      en: "Drop anchor with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
      pt: "Ancore com esta joia náutica, tornando cada local próprio para navegação e estilisticamente espirituoso!",
      "zh-CN": "用这颗航海明珠抛锚，让每一块地方都风生水起又流行时锚！",
      fr: "Jetez l'ancre avec cette gemme nautique, rendant chaque endroit navigable et d'une élégance éclaboussante!",
      tk: "Bu deniz mücevheriyle demir atın, her noktayı denize uygun hale getirin ve su sıçramasına son derece şık bir hale getirin!",
    },
    opensea: {
      description:
        "Drop anchor' with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/481.png",
    },
  },
  "Rubber Ducky": {
    image: rubberDucky,
    description: {
      en: "Float on fun with this classic quacker, bringing bubbly joy to every corner!",
      pt: "Flutue na diversão com este patinho clássico, trazendo alegria borbulhante para todos os cantos!",
      "zh-CN": "伴着这经典叫叫玩具漂浮，传颂胶胶奇趣到每一角落！",
      fr: "Flottez dans le plaisir avec ce canard classique, apportant une joie pétillante à chaque coin!",
      tk: "Her köşeye neşeli bir neşe getiren bu klasik şarlatanla eğlencenin tadını çıkarın!",
    },
    opensea: {
      description:
        "Float on fun with this classic quacker, bringing bubbly joy to every corner!",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/483.png",
    },
  },
  "Kraken Head": {
    image: krakenHead,
    description: {
      en: "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
      pt: "Mergulhe no mistério do mar profundo! Esta cabeça provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
      "zh-CN": "挖掘深海奥秘！这大脑戏说着古老海洋传说与水底奇世的故事",
      fr: "Plongez dans le mystère des profondeurs ! Cette tête évoque des contes anciens de légendes marines et de merveilles aquatiques.",
      tk: "Derin deniz gizemine dalın! Bu kafa, eski okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
    },
    opensea: {
      description:
        "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/484.png",
    },
  },
  "Banana Chicken": {
    image: bananaChicken,
    description: {
      en: "A chicken that boosts bananas. What a world we live in.",
      pt: "Um frango que impulsiona bananas. Em que mundo vivemos?!",
      "zh-CN": "一只能让香蕉增加产量的鸡。我们这世界可真奇妙。",
      fr: "Une poule qui booste les bananes. Quel monde nous vivons.",
      tk: "Muzları artıran bir tavuk. Nasıl bir dünyada yaşıyoruz.",
    },
    opensea: {
      description: "A chicken that boosts bananas. What a world we live in.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Banana Drops",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/488.png",
    },
  },
  "Crim Peckster": {
    image: crimPeckster,
    description: {
      en: "A gem detective with a knack for unearthing Crimstones.",
      pt: "Um detetive de gemas com habilidade para desenterrar Crimstones.",
      "zh-CN": "一位精通揪出红宝石的宝石侦探",
      fr: "Un détective de gemmes avec un talent pour déterrer des Crimstones.",
      tk: "Kızıltaşları gün yüzüne çıkarma yeteneğine sahip bir mücevher dedektifi.",
    },
    opensea: {
      description: "A gem detective with a knack for unearthing Crimstones.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Crimstone yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/494.png",
    },
  },
  "Knight Chicken": {
    image: knightChicken,
    description: {
      en: "A strong and noble chicken boosting your oil yield.",
      pt: "A strong and noble chicken boosting your oil yield.",
      "zh-CN": "一只强大而高贵的鸡为您的油田增强产出",
      fr: "A strong and noble chicken boosting your oil yield.",
      tk: "A strong and noble chicken boosting your oil yield.",
    },
    opensea: {
      description: "A strong and noble chicken boosting your oil yield.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Oil yield",
          value: 0.1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/500.gif",
    },
  },
  "Skill Shrimpy": {
    image: skillShrimpy,
    description: {
      en: "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
      pt: "Shrimpy está aqui para ajudar! Ele garantirá que você obtenha XP extra de peixes.",
      "zh-CN": "Shrimpy 来帮忙了！他来保你从鱼身上获取额外 XP",
      fr: "Shrimpy est là pour vous aider ! Il s'assurera que vous obteniez de l'XP supplémentaire des poissons.",
      tk: "Shrimpy yardım etmek için burada! Balıklardan ekstra XP elde etmeni sağlayacaktır.",
    },
    opensea: {
      description:
        "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "XP",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Fish XP",
          value: 20,
        },
      ],
      image: "../public/erc1155/images/485.png",
    },
  },
  "Soil Krabby": {
    image: soilKrabby,
    description: {
      en: "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
      pt: "Peneira rápida com um sorriso! Desfrute de um aumento de velocidade de 10% no composto com este campeão crustáceo.",
      "zh-CN": "微笑面对挑拣！有这位坚壳硬汉超人相伴，享受更快 10 % 的堆肥时间",
      fr: "Tamisage rapide avec le sourire ! Profitez d'une augmentation de vitesse de 10% de la compostière avec ce champion crustacé.",
      tk: "Bir gülümseme ile hızlan! Bu kabuklu şampiyon ile 10% gübre üretme hızı artışının tadını çıkar.",
    },
    opensea: {
      description:
        "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Composter Compost Time",
          value: -10,
        },
      ],
      image: "../public/erc1155/images/486.png",
    },
  },
  Nana: {
    image: nana,
    description: {
      en: "This rare beauty is a surefire way to boost your banana harvests.",
      pt: "Esta beleza rara é uma maneira infalível de impulsionar suas colheitas de banana.",
      "zh-CN": "这个稀有品种的香蕉美人保你香蕉收成有所增进",
      fr: "Cette beauté rare est un moyen sûr d'augmenter votre récolte de bananes.",
      tk: "Bu nadir güzellik, muz hasadını artırmanın kesin bir yoludur.",
    },
    opensea: {
      description:
        "This rare beauty is a surefire way to boost your banana harvests.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Fruit",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Banana Growth Time",
          value: -10,
        },
      ],
      image: "../public/erc1155/images/487.png",
    },
  },
  "Time Warp Totem": {
    image: timeWarpTotem,
    description: {
      en: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      pt: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      "zh-CN":
        "庄稼、树木、水果、烹饪和基矿的速度加倍。仅持续2小时（请在开始计时/收获资源前放置）",
      fr: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      tk: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
    },
    opensea: {
      description:
        "The Time Warp Totem temporarily boosts your cooking, crops, trees & mineral time. Make the most of it!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Cooking, Crop, Tree and Mineral Time",
          value: -50,
        },
        {
          display_type: "boost_number",
          trait_type: "Boost Duration (hours)",
          value: 2,
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1297.png",
    },
  },
  "Community Coin": {
    image: communityCoin,
    description: {
      en: "A valued coin that can be exchanged for rewards",
      pt: "Uma moeda valiosa que pode ser trocada por recompensas",
      "zh-CN": "A valued coin that can be exchanged for rewards",
      fr: "Une pièce de valeur pouvant être échangée contre des récompenses",
      tk: "Ödüllerle takas edilebilecek değerli bir para",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/732.png",
    },
  },
  "Arcade Token": {
    image: communityCoin,
    description: {
      en: "A token earned from mini-games and adventures. Can be exchanged for rewards.",
      pt: "Um token ganho de minijogos e aventuras. Pode ser trocado por recompensas.",
      "zh-CN": "从小游戏与冒险挣来的代币。可以换取奖赏。",
      fr: "Un jeton gagné grâce à des mini-jeux et des aventures. Peut être échangé contre des récompenses.",
      tk: "Mini oyunlardan ve maceralardan kazanılan bir jeton. Ödüllerle takas edilebilir.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/question_mark.png",
    },
  },
  "Bumpkin Nutcracker": {
    image: nutcracker,
    description: {
      en: "A festive decoration from 2023.",
      pt: "Uma decoração festiva de 2023.",
      "zh-CN": "2023 年的节日装饰",
      fr: "Une décoration festive de 2023.",
      tk: "2023'ten kalma şenlikli bir dekorasyon.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1298.png",
    },
  },
  "Festive Tree": {
    image: festiveTree,
    description: {
      en: "A festive tree available each holiday season. I wonder if it is big enough for santa to see?",
      pt: "Uma árvore festiva disponível em cada temporada de festas. Eu me pergunto se é grande o suficiente para o Papai Noel ver?",
      "zh-CN": "每到佳节搬上台面的节庆树。好奇够不够大让圣诞老人看见呢？",
      fr: "Un arbre festif disponible chaque saison des fêtes. Je me demande s'il est assez grand pour que le Père Noël le voie?",
      tk: "Her tatil sezonunda şenlikli bir ağaç mevcuttur. Acaba Noel Baba'nın görebileceği kadar büyük mü?",
    },
    opensea: {
      description:
        "A festive tree that can be attained each festive season. I wonder if it is big enough for santa to see?",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/1299.png",
    },
  },
  "White Festive Fox": {
    image: whiteFestiveFox,
    description: {
      en: "The blessing of the White Fox inhabits the generous farms",
      pt: "A bênção da Raposa Branca habita as fazendas generosas",
      "zh-CN": "白狐的赐福安居在慷慨的农场",
      fr: "La bénédiction du Renard Blanc habite les fermes généreuses.",
      tk: "Beyaz Tilki'nin kutsaması cömert çiftliklerde yaşıyor",
    },
    opensea: {
      description: "The blessing of the White Fox inhabits the generous farms.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2001.png",
    },
  },
  "Grinx's Hammer": {
    image: grinxsHammer,
    description: {
      en: "The magical hammer from Grinx, the legendary Goblin Blacksmith.",
      pt: "O martelo mágico de Grinx, o lendário Ferreiro Goblin.",
      "zh-CN": "出自传奇哥布林铁匠 Grinx 之手的魔法锤子",
      fr: "Le marteau magique de Grinx, le légendaire forgeron gobelin.",
      tk: "Efsanevi Goblin Demircisi Grinx'in sihirli çekici.",
    },
    opensea: {
      description:
        "The magical hammer from Grinx, the legendary Goblin Blacksmith. Halves expansion natural resource requirements.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Other",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Expansion Cost Reduction",
          value: -50,
        },
      ],
      image: "../public/erc1155/images/489.png",
    },
  },
  Angelfish: {
    image: angelFish,
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "The aquatic celestial beauty, adorned in a palette of vibrant hues.",
      pt: "A beleza celestial aquática, adornada com uma paleta de cores vibrantes.",
      "zh-CN": "海洋的天蓝之美，点缀着缤纷跃动弧光",
      fr: "La beauté céleste aquatique, ornée d'une palette de couleurs vibrantes.",
      tk: "Canlı tonlardan oluşan bir paletle süslenmiş sudaki göksel güzellik.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1534.png",
    },
  },
  Halibut: {
    image: halibut,
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "The flat ocean floor dweller, a master of disguise in sandy camouflage.",
      pt: "O habitante plano do fundo do oceano, um mestre do disfarce em camuflagem arenosa.",
      "zh-CN": "海底平地的潜居者，披着沙色迷彩的伪装大师",
      fr: "Le habitant plat du fond de l'océan, un maître du déguisement en camouflage sableux.",
      tk: "Düz okyanus tabanı sakini, kumlu kamuflajda kılık değiştirme ustası.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1535.png",
    },
  },
  Parrotfish: {
    image: parrotFish,
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "A kaleidoscope of colors beneath the waves, this fish is nature's living artwork.",
      pt: "Um caleidoscópio de cores sob as ondas, este peixe é a obra de arte viva da natureza.",
      "zh-CN": "海浪下的七彩万花筒，这鱼就是大自然的鲜活艺术造物",
      fr: "Un kaléidoscope de couleurs sous les vagues, ce poisson est une œuvre d'art vivante de la nature.",
      tk: "Dalgaların altındaki renklerden oluşan bir kaleydoskop olan bu balık, doğanın yaşayan sanat eseridir.",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Fish",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/1536.png",
    },
  },
  Rug: {
    image: SUNNYSIDE.decorations.rug,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/2002.png",
    },
  },
  Wardrobe: {
    image: SUNNYSIDE.decorations.wardrobe,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/2003.png",
    },
  },
  "Farmhand Coupon": {
    image: budTicket,
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
    opensea: {
      description: "?",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/728.png",
    },
  },
  Farmhand: {
    image: SUNNYSIDE.icons.player,
    description: {
      en: "A helpful farmhand",
      pt: "Um ajudante de fazenda útil",
      "zh-CN": "热心的雇农",
      fr: "Un ouvrier agricole utile.",
      tk: "Yardımsever bir çiftçi",
    },
    opensea: {
      description: "A helpful farmhand to assist you with your farm.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/735.png",
    },
  },
  Beehive: {
    image: beehive,
    description: {
      en: "A bustling beehive, producing honey from actively growing flowers; 10% chance upon Honey harvest to summon a bee swarm which will pollinate all growing crops with a +0.2 boost!",
      pt: "Uma colmeia agitada, produzindo mel a partir de flores em crescimento ativo; 10% de chance ao colher Mel de invocar um enxame de abelhas que polinizará todas as plantações em crescimento com um impulso de +0.2!",
      "zh-CN":
        "熙熙攘攘的蜂巢，从生长的花卉采来产出蜂蜜；收获满溢的蜂蜜有 10 % 的概率召来蜂群，为生长的庄稼授粉增加 0.2 的产出！",
      fr: "Une ruche animée, produisant du Honey à partir de fleurs en croissance active ; 10 % de chance lors de la récolte du Honey d'invoquer un essaim d'abeilles qui pollinisera toutes les cultures en croissance avec un bonus de +0.2!",
      tk: "Aktif olarak büyüyen çiçeklerden bal üreten hareketli bir arı kovanı; Bal hasadında, büyüyen tüm mahsulleri +0,2 artışla tozlaştıracak bir arı sürüsü çağırma şansı %10!",
    },
    opensea: {
      description:
        "A bustling beehive, producing honey from actively growing flowers; 10% chance upon Honey harvest to summon a bee swarm which will pollinate all growing crops with a +0.2 boost!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Resource Node",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
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
      image: "../public/erc1155/images/633.png",
    },
  },
  "Red Pansy": {
    image: redPansy,
    description: {
      en: "A red pansy.",
      pt: "Uma pansy vermelha.",
      "zh-CN": "红三色堇。一朵红三色堇。",
      fr: "Une red pansy.",
      tk: "Kırmızı bir menekşe.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/218.png",
    },
  },
  "Yellow Pansy": {
    image: yellowPansy,
    description: {
      en: "A yellow pansy.",
      pt: "Uma pansy amarela.",
      "zh-CN": "黄三色堇。一朵黄三色堇。",
      fr: "Une yellow pansy.",
      tk: "Sarı bir menekşe.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/219.png",
    },
  },
  "Purple Pansy": {
    image: purplePansy,
    description: {
      en: "A purple pansy.",
      pt: "Uma pansy roxa.",
      "zh-CN": "紫三色堇。一朵紫三色堇。",
      fr: "Une purple pansy.",
      tk: "Mor bir menekşe.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/220.png",
    },
  },
  "White Pansy": {
    image: whitePansy,
    description: {
      en: "A white pansy.",
      pt: "Uma pansy branca.",
      "zh-CN": "白三色堇。一朵白三色堇。",
      fr: "Une white panssy.",
      tk: "Beyaz bir menekşe.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/221.png",
    },
  },
  "Blue Pansy": {
    image: bluePansy,
    description: {
      en: "A blue pansy.",
      pt: "Uma pansy azul.",
      "zh-CN": "蓝三色堇。一朵蓝三色堇。",
      fr: "Une blue pansy.",
      tk: "Mavi bir menekşe.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/222.png",
    },
  },
  "Red Cosmos": {
    image: redCosmos,
    description: {
      en: "A red cosmos.",
      pt: "Um cosmos vermelho.",
      "zh-CN": "红波斯菊。一朵红波斯菊。",
      fr: "Un red cosmos.",
      tk: "Kırmızı bir Cosmos.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/223.png",
    },
  },
  "Yellow Cosmos": {
    image: yellowCosmos,
    description: {
      en: "A yellow cosmos.",
      pt: "Um cosmos amarelo.",
      "zh-CN": "黄波斯菊。一朵黄色波斯菊。",
      fr: "Un yellow cosmos.",
      tk: "Sarı bir Cosmos.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/224.png",
    },
  },
  "Purple Cosmos": {
    image: purpleCosmos,
    description: {
      en: "A purple cosmos.",
      pt: "Um cosmos roxo.",
      "zh-CN": "紫波斯菊。一朵紫波斯菊。",
      fr: "Un purple cosmos.",
      tk: "Mor bir Cosmos.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/225.png",
    },
  },
  "White Cosmos": {
    image: whiteCosmos,
    description: {
      en: "A white cosmos.",
      pt: "Um cosmos branco.",
      "zh-CN": "白波斯菊。一朵白波斯菊。",
      fr: "Un white cosmos.",
      tk: "Beyaz bir Cosmos.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/226.png",
    },
  },
  "Blue Cosmos": {
    image: blueCosmos,
    description: {
      en: "A blue cosmos.",
      pt: "Um cosmos azul.",
      "zh-CN": "蓝波斯菊。一朵蓝波斯菊。",
      fr: "Un blue cosmos.",
      tk: "Mavi bir Cosmos.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/227.png",
    },
  },
  "Red Balloon Flower": {
    image: redBalloonFlower,
    description: {
      en: "A red balloon flower.",
      pt: "Uma flor de balão vermelho.",
      "zh-CN": "红桔梗。一朵红桔梗。",
      fr: "Une red balloon flower.",
      tk: "Kırmızı balon çiçeği.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/228.png",
    },
  },
  "Yellow Balloon Flower": {
    image: yellowBalloonFlower,
    description: {
      en: "A yellow balloon flower.",
      pt: "Uma flor de balão amarelo.",
      "zh-CN": "黄桔梗。一朵黄桔梗。",
      fr: "Une yellow balloon flower.",
      tk: "Sarı balon çiçeği.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/229.png",
    },
  },
  "Purple Balloon Flower": {
    image: purpleBalloonFlower,
    description: {
      en: "A purple balloon flower.",
      pt: "Uma flor de balão roxo.",
      "zh-CN": "紫桔梗。一朵紫桔梗。",
      fr: "Une purple balloon flower.",
      tk: "Mor bir balon çiçeği.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/230.png",
    },
  },
  "White Balloon Flower": {
    image: whiteBalloonFlower,
    description: {
      en: "A white balloon flower.",
      pt: "Uma flor de balão branca.",
      "zh-CN": "白桔梗。一朵白桔梗。",
      fr: "Une white balloon flower.",
      tk: "Beyaz bir balon çiçeği.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/231.png",
    },
  },
  "Blue Balloon Flower": {
    image: blueBalloonFlower,
    description: {
      en: "A blue balloon flower.",
      pt: "Uma flor de balão azul.",
      "zh-CN": "蓝桔梗。一朵蓝桔梗。",
      fr: "Une blue balloon flower.",
      tk: "Mavi balon çiçeği.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/232.png",
    },
  },
  "Red Carnation": {
    image: redCarnation,
    description: {
      en: "A red carnation.",
      pt: "Um cravo vermelho.",
      "zh-CN": "红康乃馨。一朵红康乃馨。",
      fr: "Une red carnation.",
      tk: "Kırmızı bir karanfil.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/233.png",
    },
  },
  "Yellow Carnation": {
    image: yellowCarnation,
    description: {
      en: "A yellow carnation.",
      pt: "Um cravo amarelo.",
      "zh-CN": "黄康乃馨。一朵黄康乃馨。",
      fr: "Une yellow carnation.",
      tk: "Sarı bir karanfil.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/234.png",
    },
  },
  "Purple Carnation": {
    image: purpleCarnation,
    description: {
      en: "A purple carnation.",
      pt: "Um cravo roxo.",
      "zh-CN": "紫康乃馨。一朵紫康乃馨。",
      fr: "Une purple carnation.",
      tk: "Mor bir karanfil.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/235.png",
    },
  },
  "White Carnation": {
    image: whiteCarnation,
    description: {
      en: "A white carnation.",
      pt: "Um cravo branco.",
      "zh-CN": "白康乃馨。一朵白康乃馨。",
      fr: "Unewhite carnation.",
      tk: "Beyaz bir karanfil.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/236.png",
    },
  },
  "Blue Carnation": {
    image: blueCarnation,
    description: {
      en: "A blue carnation.",
      pt: "Um cravo azul.",
      "zh-CN": "蓝康乃馨。一朵蓝康乃馨。",
      fr: "Une blue carnation.",
      tk: "Mavi bir karanfil.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/237.png",
    },
  },
  "Humming Bird": {
    image: hummingBird,
    description: {
      en: "A tiny jewel of the sky, the Humming Bird flits with colorful grace.",
      pt: "Um joia minúscula do céu, o Beija-flor flutua com graça colorida.",
      "zh-CN": "小小天上明珠，Humming Bird 捧七彩的优雅飞掠而过",
      fr: "Un joyau du ciel, le Colibri virevolte avec grâce et couleur.",
      tk: "Gökyüzünün minik bir mücevheri olan Sinek Kuşu, rengarenk bir zarafetle uçuyor.",
    },
    opensea: {
      description:
        "A tiny jewel of the sky, the Humming Bird flits with colorful grace.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Flower",
        },
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
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/490.png",
    },
  },
  "Queen Bee": {
    image: queenBee,
    description: {
      en: "Majestic ruler of the hive, the Queen Bee buzzes with regal authority.",
      pt: "Régia majestosa da colmeia, a Abelha Rainha zumbindo com autoridade régia.",
      "zh-CN": "蜂巢的威严统领，Queen Bee 以至高君权嗡嗡号令",
      fr: "Majestueuse reine de la ruche, l'Abeille Reine bourdonne avec autorité royale.",
      tk: "Kovanın görkemli hükümdarı Kraliçe Arı, kraliyet otoritesiyle vızıldıyor.",
    },
    opensea: {
      description:
        "Majestic ruler of the hive, the Queen Bee buzzes with regal authority.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Resource",
        },
        {
          display_type: "boost_number",
          trait_type: "Honey Production Speed",
          value: 1,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/491.png",
    },
  },
  "Flower Fox": {
    image: flowerFox,
    description: {
      en: "The Flower Fox, a playful creature adorned with petals, brings joy to the garden.",
      pt: "A Raposa Flor, uma criatura lúdica adornada com pétalas, traz alegria ao jardim.",
      "zh-CN": "Flower Fox，花瓣簇拥的欢欣生灵，为花园带来雀跃",
      fr: "Le Renard des Fleurs, une créature espiègle ornée de pétales, apporte de la joie au jardin.",
      tk: "Yapraklarla süslenmiş oyuncu bir yaratık olan Çiçek Tilki, bahçeye neşe katıyor.",
    },
    opensea: {
      description:
        "The Flower Fox, a playful creature adorned with petals, brings joy to the garden.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Flower",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Flower Growth Time",
          value: -10,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/492.png",
    },
  },
  "Hungry Caterpillar": {
    image: hungryCaterpillar,
    description: {
      en: "Munching through leaves, the Hungry Caterpillar is always ready for a tasty adventure.",
      pt: "Devorando folhas, a Lagarta Faminta está sempre pronta para uma aventura saborosa.",
      "zh-CN": "嚼着树叶，Hungry Caterpillar 总蓄势等待下一场美味冒险",
      fr: "Se régalant de feuilles, la Chenille Gourmande est toujours prête pour une aventure savoureuse.",
      tk: "Yaprakları yerken Aç Tırtıl her zaman lezzetli bir maceraya hazırdır.",
    },
    opensea: {
      description:
        "Munching through leaves, the Hungry Caterpillar is always ready for a tasty adventure.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Flower",
        },
        {
          display_type: "boost_number",
          trait_type: "Cost of Flower Seeds",
          value: 0,
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/493.png",
    },
  },
  "Sunrise Bloom Rug": {
    image: sunriseBloomRug,
    description: {
      en: "Step onto the Sunrise Bloom Rug, where petals dance around a floral sunrise.",
      pt: "Pise no Tapete de Flores do Amanhecer, onde pétalas dançam ao redor de um nascer do sol floral.",
      "zh-CN": "踏上 Sunrise Bloom Rug，花瓣在之上舞起花香晨光。",
      fr: "Marchez sur le Tapis de l'Éclosion du Soleil, où les pétales dansent autour d'un lever de soleil floral.",
      tk: "Yaprakların çiçekli gün doğumu etrafında dans ettiği Sunrise Bloom Rug'a adım atın.",
    },
    opensea: {
      description:
        "Step onto the Sunrise Bloom Rug, where petals dance around a floral sunrise.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2004.png",
    },
  },
  "Flower Rug": {
    image: flowerRug,
    description: {
      en: "Add a touch of nature's elegance to your home.",
      pt: "Add a touch of nature's elegance to your home.",
      "zh-CN": "Add a touch of nature's elegance to your home.",
      fr: "Add a touch of nature's elegance to your home.",
      tk: "Add a touch of nature's elegance to your home.",
    },
    opensea: {
      description: "Add a touch of nature's elegance to your home.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2011.png",
    },
  },
  "Tea Rug": {
    image: teaRug,
    description: {
      en: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      pt: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      "zh-CN":
        "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      fr: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      tk: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
    },
    opensea: {
      description:
        "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2012.png",
    },
  },
  "Green Field Rug": {
    image: greenFieldRug,
    description: {
      en: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      pt: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      "zh-CN":
        "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      fr: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      tk: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
    },
    opensea: {
      description:
        "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2013.png",
    },
  },
  "Blossom Royale": {
    image: blossomRoyale,
    description: {
      en: "The Blossom Royale, a giant flower in vibrant blue and pink, stands in majestic bloom.",
      pt: "O Royale da Flor, uma flor gigante em azul e rosa vibrantes, está em majestosa floração.",
      "zh-CN": "Blossom Royale，蓝与粉鲜活荡漾的巨大花朵，挺拔撑起俨然绽放。",
      fr: "Le Blossom Royale, une fleur géante aux couleurs bleues et roses vibrantes, se dresse en majesté.",
      tk: "Canlı mavi ve pembe renkte dev bir çiçek olan Blossom Royale, görkemli bir çiçek içinde duruyor.",
    },
    opensea: {
      description:
        "The Blossom Royale, a giant flower in vibrant blue and pink, stands in majestic bloom.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2005.png",
    },
  },
  Rainbow: {
    image: rainbow,
    description: {
      en: "A cheerful Rainbow, bridging sky and earth with its colorful arch.",
      pt: "Um Arco-íris alegre, unindo o céu e a terra com seu arco colorido.",
      "zh-CN": "欢乐彩虹，为天地搭起七彩拱桥。",
      fr: "Un arc-en-ciel joyeux, reliant le ciel et la terre avec son arc-en-ciel coloré.",
      tk: "Rengarenk kemeriyle gökyüzü ile yeryüzü arasında köprü oluşturan neşeli bir Gökkuşağı.",
    },
    opensea: {
      description:
        "A cheerful Rainbow, bridging sky and earth with its colorful arch.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2006.png",
    },
  },
  "Enchanted Rose": {
    image: enchantedRose,
    description: {
      en: "The Enchanted Rose, a symbol of eternal beauty, captivates with its magical allure.",
      pt: "A Rosa Encantada, um símbolo de beleza eterna, cativa com seu fascínio mágico.",
      "zh-CN": "Enchanted Rose，永生美丽的象征，沉迷在她的魔法魅力里吧。",
      fr: "La Rose Enchantée, symbole de beauté éternelle, captive par son charme magique.",
      tk: "Sonsuz güzelliğin sembolü olan Büyülü Gül, büyülü cazibesiyle büyülüyor.",
    },
    opensea: {
      description:
        "The Enchanted Rose, a symbol of eternal beauty, captivates with its magical allure.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2007.png",
    },
  },
  "Flower Cart": {
    image: flowerCart,
    description: {
      en: "The Flower Cart, brimming with blooms, is a mobile garden of floral delights.",
      pt: "O Carrinho de Flores, transbordante de flores, é um jardim móvel de delícias florais.",
      "zh-CN": "Flower Cart，满盛花开，移动花园推动鲜花喜悦。",
      fr: "Le Chariot de Fleurs, débordant de fleurs, est un jardin mobile de délices floraux.",
      tk: "Çiçeklerle dolu Çiçek Arabası, çiçek lezzetleriyle dolu hareketli bir bahçedir.",
    },
    opensea: {
      description:
        "The Flower Cart, brimming with blooms, is a mobile garden of floral delights.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2008.png",
    },
  },
  Capybara: {
    image: capybara,
    description: {
      en: "The Capybara, a laid-back friend, enjoys lazy days by the water's edge.",
      pt: "A Capivara, uma amiga tranquila, desfruta de dias preguiçosos à beira da água.",
      "zh-CN": "Capybara，悠闲伙伴，享受水边的慵懒时光。",
      fr: "Le Capybara, un ami décontracté, apprécie les journées paisibles au bord de l'eau.",
      tk: "Rahat bir arkadaş olan Kapibara, su kenarında tembel günlerin tadını çıkarır.",
    },
    opensea: {
      description:
        "The Capybara, a laid-back friend, enjoys lazy days by the water's edge.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2009.png",
    },
  },
  "Prism Petal": {
    image: prismPetal,
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
    opensea: {
      description:
        "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/238.png",
    },
  },
  "Celestial Frostbloom": {
    image: celestialFrostbloom,
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
    opensea: {
      description:
        "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/239.png",
    },
  },
  "Primula Enigma": {
    image: primulaEnigma,
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
    opensea: {
      description:
        "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/240.png",
    },
  },
  "Red Daffodil": {
    image: redDaffodil,
    description: {
      en: "A red daffodil.",
      pt: "Um narciso vermelho.",
      "zh-CN": "红水仙花。一朵红水仙花。",
      fr: "Une red daffodil.",
      tk: "Kırmızı bir nergis.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/241.png",
    },
  },
  "Yellow Daffodil": {
    image: yellowDaffodil,
    description: {
      en: "A yellow daffodil.",
      pt: "Um narciso amarelo.",
      "zh-CN": "黄水仙花。一朵黄水仙花。",
      fr: "Une yellow daffodil.",
      tk: "Sarı bir nergis.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/242.png",
    },
  },
  "Purple Daffodil": {
    image: purpleDaffodil,
    description: {
      en: "A purple daffodil.",
      pt: "Um narciso roxo.",
      "zh-CN": "紫水仙花。一朵紫水仙花l。",
      fr: "Une purple daffodil.",
      tk: "Mor bir nergis.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/243.png",
    },
  },
  "White Daffodil": {
    image: whiteDaffodil,
    description: {
      en: "A white daffodil.",
      pt: "Um narciso branco.",
      "zh-CN": "白水仙花。一朵白水仙花。",
      fr: "Une white daffodil.",
      tk: "Beyaz bir nergis.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/244.png",
    },
  },
  "Blue Daffodil": {
    image: blueDaffodil,
    description: {
      en: "A blue daffodil.",
      pt: "Um narciso azul.",
      "zh-CN": "蓝水仙花。一朵蓝水仙花。",
      fr: "Une blue daffodil.",
      tk: "Mavi bir nergis.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/245.png",
    },
  },
  "Red Lotus": {
    image: redLotus,
    description: {
      en: "A red lotus.",
      pt: "Um lótus vermelho.",
      "zh-CN": "红莲花。一朵红莲花。",
      fr: "Un red lotus.",
      tk: "Kırmızı bir nilüfer.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/246.png",
    },
  },
  "Yellow Lotus": {
    image: yellowLotus,
    description: {
      en: "A yellow lotus.",
      pt: "Um lótus amarelo.",
      "zh-CN": "黄莲花。一朵黄莲花。",
      fr: "Un yellow lotus.",
      tk: "Sarı bir nilüfer.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/247.png",
    },
  },
  "Purple Lotus": {
    image: purpleLotus,
    description: {
      en: "A purple lotus.",
      pt: "Um lótus roxo.",
      "zh-CN": "紫莲花。一朵紫莲花。",
      fr: "Un purple lotus.",
      tk: "Mor bir nilüfer.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/248.png",
    },
  },
  "White Lotus": {
    image: whiteLotus,
    description: {
      en: "A white lotus.",
      pt: "Um lótus branco.",
      "zh-CN": "白莲花。一朵白莲花。",
      fr: "Un white lotus.",
      tk: "Beyaz bir nilüfer.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/249.png",
    },
  },
  "Blue Lotus": {
    image: blueLotus,
    description: {
      en: "A blue lotus.",
      pt: "Um lótus azul.",
      "zh-CN": "蓝莲花。一朵蓝莲花。",
      fr: "Un blue lotus.",
      tk: "Mavi bir nilüfer.",
    },
    opensea: {
      description: "A flower",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Flower",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/250.png",
    },
  },
  "Earn Alliance Banner": {
    image: earnAllianceBanner,
    description: {
      en: "A special event banner",
      pt: "Um banner de evento especial",
      "zh-CN": "一杆特别活动的旗帜",
      fr: "A special event banner",
      tk: "Özel bir etkinlik bayrağı",
    },
    opensea: {
      description:
        "A special event banner. Gave a starter bonus of 2x XP in February 2024 for players on the beginner island.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Banner",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/930.png",
    },
  },
  "Luxury Key": {
    image: luxuryKey,
    description: {
      en: "Visit the plaza near woodlands to unlock your reward",
      pt: "Visite o Plaza perto de Woodlands para desbloquear sua recompensa",
      "zh-CN": "Visit the plaza near woodlands to unlock your reward",
      fr: "Visitez la place près des bois pour débloquer votre récompense",
      tk: "Plazanın Ağaç diyarına yakın olan kısmında sandığınızı açın",
    },
    opensea: {
      description: "A magic key that can unlock rewards in the plaza",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/932.png",
    },
  },
  "Rare Key": {
    image: rareKey,
    description: {
      en: "Visit the beach to unlock your reward",
      pt: "Visite a praia para desbloquear sua recompensa",
      "zh-CN": "Visit the beach to unlock your reward",
      fr: "Visitez la plage pour débloquer votre récompense",
      tk: "Sahili ziyaret edin ve sandığınızı açın",
    },
    opensea: {
      description: "A magic key that can unlock rewards in the plaza",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/933.png",
    },
  },
  "Prize Ticket": {
    image: prizeTicket,
    description: {
      en: "A prized ticket. You can use it to enter the monthly goblin raffle.",
      pt: "Um ticket para entrar nos sorteios de prêmios",
      "zh-CN":
        "A prized ticket. You can use it to enter the monthly goblin raffle.",
      fr: "Un ticket pour participer au concours de fin de saison",
      tk: "Ödül çekilişlerine katılmak için bir bilet",
    },
    opensea: {
      description: "A free entry into the end of season giveaway",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Coupon",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/934.png",
    },
  },
  "Baby Panda": {
    image: babyPanda,
    description: {
      en: "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      pt: "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      "zh-CN":
        "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      fr: "Un adorable panda de l'événement Gas Hero.",
      tk: "Gas Hero etkinliğinden sevimli bir panda. Mart ayında yeni başlayanlar için 2x XP.",
    },
    opensea: {
      description:
        "A baby panda earned during the Gas Hero collaboration event. Gives new players double XP during March 2024.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/935.png",
    },
  },
  Baozi: {
    image: baozi,
    description: {
      en: "A delicious treat from the Lunar New Year event.",
      pt: "A delicious treat from the Lunar New Year event.",
      "zh-CN": "A delicious treat from the Lunar New Year event.",
      fr: "Une délicieuse friandise de l'événement du Nouvel An lunaire.",
      tk: "Ay Yeni Yılı etkinliğinden lezzetli bir ikram.",
    },
    opensea: {
      description:
        "A delicious steamed bun. A special event item from Lunar New Year 2024.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/936.gif",
    },
  },
  "Community Egg": {
    image: communityEgg,
    description: {
      en: "Wow, you must really care about the community!",
      pt: "Wow, you must really care about the community!",
      "zh-CN": "哇，你一定非常关心社区！",
      fr: "Wow, vous devez vraiment vous soucier de la communauté !",
      tk: "Wow, you must really care about the community!",
    },
    opensea: {
      description: "Wow, you must really care about the community",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/937.png",
    },
  },
  "Hungry Hare": {
    image: hungryHare,
    description: {
      en: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
      pt: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
      "zh-CN": "这只贪吃的小兔子跳进了你的农场。2024年复活节的特别活动物品",
      fr: "Ce lapin vorace saute dans votre ferme. Un objet spécial de l'événement de Pâques 2024.",
      tk: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
    },
    opensea: {
      description:
        "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "XP",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Increase Fermented Carrots XP",
          value: 100,
        },
      ],
      image: "../public/erc1155/images/938.png",
    },
  },
  "Turbo Sprout": {
    image: turboSprout,
    description: {
      en: "An engine that reduces the Green House's growth time by 50%.",
      pt: "An engine that reduces the Green House's growth time by 50%.",
      "zh-CN": "一台为温室减少 50 % 生长时间的引擎。",
      fr: "An engine that reduces the Green House's growth time by 50%.",
      tk: "An engine that reduces the Green House's growth time by 50%.",
    },
    opensea: {
      description:
        "An engine that boosts the Green House's growth speed by 50%.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_percentage",
          trait_type: "Crop Growth Time in Greenhouse",
          value: -50,
        },
      ],
      image: "../public/erc1155/images/495.png",
    },
  },
  Soybliss: {
    image: soybliss,
    description: {
      en: "A unique soy creature that gives +1 Soybean yield.",
      pt: "A unique soy creature that gives +1 Soybean yield.",
      "zh-CN": "为大豆 +1 产出的奇特豆豆生物。",
      fr: "A unique soy creature that gives +1 Soybean yield.",
      tk: "A unique soy creature that gives +1 Soybean yield.",
    },
    opensea: {
      description: "A unique soy creature that gives +1 Soybean yield.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Soybean Yield",
          value: 1,
        },
      ],
      image: "../public/erc1155/images/496.png",
    },
  },
  "Grape Granny": {
    image: grapeGranny,
    description: {
      en: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      pt: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      "zh-CN": "女族长悉心睿智的照料助长葡萄 +1 产出。",
      fr: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      tk: "Wise matriarch nurturing grapes to flourish with +1 yield.",
    },
    opensea: {
      description: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      attributes: [
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Grape Yield",
          value: 1,
        },
      ],
      image: "../public/erc1155/images/497.png",
    },
  },
  "Royal Throne": {
    image: royalThrone,
    description: {
      en: "A throne fit for the highest ranking farmer.",
      pt: "A throne fit for the highest ranking farmer.",
      "zh-CN": "为至高阶农夫打造的王位。",
      fr: "A throne fit for the highest ranking farmer.",
      tk: "A throne fit for the highest ranking farmer.",
    },
    opensea: {
      description: "A throne fit for the highest ranking farmer.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/498.png",
    },
  },
  "Lily Egg": {
    image: lilyEgg,
    description: {
      en: "Tiny delight, grand beauty, endless wonder.",
      pt: "Tiny delight, grand beauty, endless wonder.",
      "zh-CN": "小小欣喜，大大美丽，久久惊奇。",
      fr: "Tiny delight, grand beauty, endless wonder.",
      tk: "Tiny delight, grand beauty, endless wonder.",
    },
    opensea: {
      description: "Tiny delight, grand beauty, endless wonder.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/499.png",
    },
  },
  Goblet: {
    image: goblet,
    description: {
      en: "A goblet that holds the finest of wines.",
      pt: "A goblet that holds the finest of wines.",
      "zh-CN": "至珍美酒高杯藏。",
      fr: "A goblet that holds the finest of wines.",
      tk: "A goblet that holds the finest of wines.",
    },
    opensea: {
      description: "A goblet that holds the finest of wines.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/482.png",
    },
  },
  "Fancy Rug": {
    image: fancyRug,
    description: {
      en: "A rug that brings a touch of elegance to any room.",
      pt: "A rug that brings a touch of elegance to any room.",
      "zh-CN": "叫任何房间都蓬荜生辉的地毯。",
      fr: "A rug that brings a touch of elegance to any room.",
      tk: "A rug that brings a touch of elegance to any room.",
    },
    opensea: {
      description: "A rug that adds a touch of elegance to any room.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2014.png",
    },
  },
  Clock: {
    image: clock,
    description: {
      en: "A Clock that keeps time with the gentle ticking of the seasons.",
      pt: "A Clock that keeps time with the gentle ticking of the seasons.",
      "zh-CN": "时钟的脚步轻响时季的滴答",
      fr: "A Clock that keeps time with the gentle ticking of the seasons.",
      tk: "A Clock that keeps time with the gentle ticking of the seasons.",
    },
    opensea: {
      description:
        "A Clock that keeps time with the gentle ticking of the seasons.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
      ],
      image: "../public/erc1155/images/2015.png",
    },
  },
  Vinny: {
    image: vinny,
    description: {
      en: "Vinny, a friendly grapevine, is always ready for a chat.",
      pt: "Vinny, a friendly grapevine, is always ready for a chat.",
      "zh-CN": "Vinny，友善葡萄藤，随时欢迎闲聊。",
      fr: "Vinny, a friendly grapevine, is always ready for a chat.",
      tk: "Vinny, a friendly grapevine, is always ready for a chat.",
    },
    opensea: {
      description: "Vinny, a friendly grapevine, is always ready for a chat.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Grape Yield",
          value: 0.25,
        },
      ],
      image: "../public/erc1155/images/2016.png",
    },
  },
  "Beetroot Blaze": {
    image: beetrootBlaze,
    description: {
      en: "A spicy beetroot-infused magic mushroom dish",
      pt: "A spicy beetroot-infused magic mushroom dish",
      "zh-CN": "A spicy beetroot-infused magic mushroom dish",
      fr: "A spicy beetroot-infused magic mushroom dish",
      tk: "A spicy beetroot-infused magic mushroom dish",
    },
    opensea: {
      description: "A spicy beetroot-infused magic mushroom dish",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/555.png",
    },
  },
  "Rapid Roast": {
    image: rapidRoast,
    description: {
      en: "For Bumpkins in a hurry...",
      pt: "For Bumpkins in a hurry...",
      "zh-CN": "对于急着赶路的乡巴佬来说……",
      fr: "For Bumpkins in a hurry...",
      tk: "For Bumpkins in a hurry...",
    },
    opensea: {
      description: "When you are in a hurry",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/556.png",
    },
  },
  "Shroom Syrup": {
    image: shroomSyrup,
    description: {
      en: "The essence of bees and enchanted fungi",
      pt: "The essence of bees and enchanted fungi",
      "zh-CN": "The essence of bees and enchanted fungi",
      fr: "The essence of bees and enchanted fungi",
      tk: "The essence of bees and enchanted fungi",
    },
    opensea: {
      description: "The essence of bees and enchanted fungi",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
        {
          trait_type: "Tradable",
          value: "No",
        },
      ],
      image: "../public/erc1155/images/557.png",
    },
  },
  "Gaucho Rug": {
    image: gauchoRug,
    description: {
      en: "A commerative rug to support South Brazil.",
      pt: "A commerative rug to support South Brazil.",
      "zh-CN": "纪念驰援南巴西的地毯。",
      fr: "A commerative rug to support South Brazil.",
      tk: "A commerative rug to support South Brazil.",
    },
    opensea: {
      description: "A commerative rug to support South Brazil.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2018.png",
    },
  },
  "Battlecry Drum": {
    image: battleCryDrum,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2033.png",
    },
  },
  "Bullseye Board": {
    image: bullseyBoard,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "Hit the mark every time.!",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2019.png",
    },
  },
  "Chess Rug": {
    image: chessRug,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "Checkmate.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2020.png",
    },
  },
  Cluckapult: {
    image: cluckapult,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2021.png",
    },
  },
  "Golden Gallant": {
    image: goldenGallant,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2022.png",
    },
  },
  "Golden Garrison": {
    image: goldenGarrison,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description:
        "Defend your territory in style with this shimmering garrison, a true fortress of flair.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2023.png",
    },
  },
  "Golden Guardian": {
    image: goldenGurdian,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2024.png",
    },
  },
  "Novice Knight": {
    image: noviceKnight,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "Every move is an adventure.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2025.png",
    },
  },
  "Regular Pawn": {
    image: regularPawn,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description:
        "Small but mighty! This pawn may just make a big move in your collection.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2026.png",
    },
  },
  "Rookie Rook": {
    image: rookieRook,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2027.png",
    },
  },
  "Silver Sentinel": {
    image: silverSentinel,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2028.png",
    },
  },
  "Silver Squire": {
    image: silverSquire,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "Add some shine to your collection.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2029.png",
    },
  },
  "Silver Stallion": {
    image: silverStallion,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description: "",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2030.png",
    },
  },
  "Trainee Target": {
    image: traineeTarget,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description:
        "Every champion starts somewhere! Perfect your aim with the Trainee Target.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2031.png",
    },
  },
  "Twister Rug": {
    image: twisterRug,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
    opensea: {
      description:
        "Twist, turn, and tie your decor together with this playful rug.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2032.png",
    },
  },
  "Grape Seed": {
    image: grapeSeed,
    description: {
      en: "A zesty and desired fruit.",
      pt: "A zesty and desired fruit.",
      "zh-CN": "一种甜美神往的水果",
      fr: "A zesty and desired fruit.",
      tk: "A zesty and desired fruit.",
    },
    opensea: {
      description: "A zesty and desired fruit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
      ],
      image: "../public/erc1155/images/125.png",
    },
  },
  "Olive Seed": {
    image: oliveSeed,
    description: {
      en: "A luxury for advanced farmers.",
      pt: "A luxury for advanced farmers.",
      "zh-CN": "高端农夫的奢品",
      fr: "A luxury for advanced farmers.",
      tk: "A luxury for advanced farmers.",
    },
    opensea: {
      description: "A luxury for advanced farmers.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
      ],
      image: "../public/erc1155/images/126.png",
    },
  },
  "Rice Seed": {
    image: riceSeed,
    description: {
      en: "Perfect for rations!",
      pt: "Perfect for rations!",
      "zh-CN": "完美口粮！",
      fr: "Perfect for rations!",
      tk: "Perfect for rations!",
    },
    opensea: {
      description: "Perfect for rations...",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
      ],
      image: "../public/erc1155/images/127.png",
    },
  },
  Grape: {
    image: grape,
    description: {
      en: "A zesty and desired fruit.",
      pt: "A zesty and desired fruit.",
      "zh-CN": "一种甜美神往的水果",
      fr: "A zesty and desired fruit.",
      tk: "A zesty and desired fruit.",
    },
    opensea: {
      description: "A zesty and desired fruit.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
      ],
      image: "../public/erc1155/images/252.png",
    },
  },
  Olive: {
    image: olive,
    description: {
      en: "A luxury for advanced farmers.",
      pt: "A luxury for advanced farmers.",
      "zh-CN": "高端农夫的奢品",
      fr: "A luxury for advanced farmers.",
      tk: "A luxury for advanced farmers.",
    },
    opensea: {
      description: "A luxury for advanced farmers.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Crop",
        },
      ],
      image: "../public/erc1155/images/253.png",
    },
  },
  Rice: {
    image: rice,
    description: {
      en: "Perfect for rations!",
      pt: "Perfect for rations!",
      "zh-CN": "完美口粮！",
      fr: "Perfect for rations!",
      tk: "Perfect for rations!",
    },
    opensea: {
      description: "Perfect for rations...",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Seed",
        },
      ],
      image: "../public/erc1155/images/254.png",
    },
  },
  Antipasto: {
    image: antipasto,
    description: {
      en: "Assorted bites, perfect for sharing.",
      pt: "Assorted bites, perfect for sharing.",
      "zh-CN": "Assorted bites, perfect for sharing.",
      fr: "Assorted bites, perfect for sharing.",
      tk: "Assorted bites, perfect for sharing.",
    },
    opensea: {
      description: "A selection of savory bites to start your meal",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/574.png",
    },
  },
  "Carrot Juice": {
    image: carrotJuice,
    description: {
      en: "Refreshing juice, pressed fresh by bumpkins.",
      pt: "Refreshing juice, pressed fresh by bumpkins.",
      "zh-CN": "Refreshing juice, pressed fresh by bumpkins.",
      fr: "Refreshing juice, pressed fresh by bumpkins.",
      tk: "Refreshing juice, pressed fresh by bumpkins.",
    },
    opensea: {
      description: "Refreshing drink from farm-fresh carrots",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/558.png",
    },
  },
  "Seafood Basket": {
    image: fishBasket,
    description: {
      en: "Oceanic flavors, sourced by goblins.",
      pt: "Oceanic flavors, sourced by goblins.",
      "zh-CN": "Oceanic flavors, sourced by goblins.",
      fr: "Oceanic flavors, sourced by goblins.",
      tk: "Oceanic flavors, sourced by goblins.",
    },
    opensea: {
      description: "A bountiful basket of fresh ocean delights",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/559.png",
    },
  },
  "Fish Burger": {
    image: fishBurger,
    description: {
      en: "Succulent burger, loved by seaside adventurers.",
      pt: "Succulent burger, loved by seaside adventurers.",
      "zh-CN": "Succulent burger, loved by seaside adventurers.",
      fr: "Succulent burger, loved by seaside adventurers.",
      tk: "Succulent burger, loved by seaside adventurers.",
    },
    opensea: {
      description: "Succulent burger made with freshly caught fish",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/560.png",
    },
  },
  "Fish n Chips": {
    image: fishnChips,
    description: {
      en: "Classic seaside meal, loved by all.",
      pt: "Classic seaside meal, loved by all.",
      "zh-CN": "Classic seaside meal, loved by all.",
      fr: "Classic seaside meal, loved by all.",
      tk: "Classic seaside meal, loved by all.",
    },
    opensea: {
      description: "Crispy chips paired with tender fish fillets",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/561.png",
    },
  },
  "Fish Omelette": {
    image: fishOmelette,
    description: {
      en: "Flavorful omelette, filled with oceanic treasures.",
      pt: "Flavorful omelette, filled with oceanic treasures.",
      "zh-CN": "Flavorful omelette, filled with oceanic treasures.",
      fr: "Flavorful omelette, filled with oceanic treasures.",
      tk: "Flavorful omelette, filled with oceanic treasures.",
    },
    opensea: {
      description: "Fluffy omelette with a flavorful fish filling",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/562.png",
    },
  },
  "Fried Calamari": {
    image: friedCalamari,
    description: {
      en: "Crispy calamari rings, a delicious indulgence.",
      pt: "Crispy calamari rings, a delicious indulgence.",
      "zh-CN": "Crispy calamari rings, a delicious indulgence.",
      fr: "Crispy calamari rings, a delicious indulgence.",
      tk: "Crispy calamari rings, a delicious indulgence.",
    },
    opensea: {
      description: "Crispy calamari rings, a seafood delight",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/563.png",
    },
  },
  "Fried Tofu": {
    image: friedTofu,
    description: {
      en: "Golden fried tofu, crafted with care.",
      pt: "Golden fried tofu, crafted with care.",
      "zh-CN": "Golden fried tofu, crafted with care.",
      fr: "Golden fried tofu, crafted with care.",
      tk: "Golden fried tofu, crafted with care.",
    },
    opensea: {
      description: "Crispy tofu bites, a vegetarian favorite",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/564.png",
    },
  },
  "Grape Juice": {
    image: grapeJuice,
    description: {
      en: "Sweet and tangy juice, freshly squeezed.",
      pt: "Sweet and tangy juice, freshly squeezed.",
      "zh-CN": "Sweet and tangy juice, freshly squeezed.",
      fr: "Sweet and tangy juice, freshly squeezed.",
      tk: "Sweet and tangy juice, freshly squeezed.",
    },
    opensea: {
      description: "Sweet and refreshing juice from sun-ripened grapes",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/565.png",
    },
  },
  "Ocean's Olive": {
    image: oceansOlive,
    description: {
      en: "Delightful oceanic dish, a true Sunflorian delicacy.",
      pt: "Delightful oceanic dish, a true Sunflorian delicacy.",
      "zh-CN": "Delightful oceanic dish, a true Sunflorian delicacy.",
      fr: "Delightful oceanic dish, a true Sunflorian delicacy.",
      tk: "Delightful oceanic dish, a true Sunflorian delicacy.",
    },
    opensea: {
      description: "Savor the taste of the sea with these ocean-infused olives",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/566.png",
    },
  },
  "Quick Juice": {
    image: quickJuice,
    description: {
      en: "Quick energy boost, a Goblin favourite.",
      pt: "Quick energy boost, a Goblin favourite.",
      "zh-CN": "Quick energy boost, a Goblin favourite.",
      fr: "Quick energy boost, a Goblin favourite.",
      tk: "Quick energy boost, a Goblin favourite.",
    },
    opensea: {
      description: "A swift and energizing juice for busy days",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/567.png",
    },
  },
  "Rice Bun": {
    image: riceBun,
    description: {
      en: "Soft and fluffy rice bun, a favorite.",
      pt: "Soft and fluffy rice bun, a favorite.",
      "zh-CN": "Soft and fluffy rice bun, a favorite.",
      fr: "Soft and fluffy rice bun, a favorite.",
      tk: "Soft and fluffy rice bun, a favorite.",
    },
    opensea: {
      description: "Soft buns made with rice flour, perfect for snacking",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/568.png",
    },
  },
  "Slow Juice": {
    image: slowJuice,
    description: {
      en: "Nutrient-rich juice, handcrafted by bumpkins.",
      pt: "Nutrient-rich juice, handcrafted by bumpkins.",
      "zh-CN": "Nutrient-rich juice, handcrafted by bumpkins.",
      fr: "Nutrient-rich juice, handcrafted by bumpkins.",
      tk: "Nutrient-rich juice, handcrafted by bumpkins.",
    },
    opensea: {
      description: "Slowly pressed juice for a burst of natural flavors",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/569.png",
    },
  },
  "Steamed Red Rice": {
    image: redRice,
    description: {
      en: "Perfectly steamed red rice, a bumpkin's delight.",
      pt: "Perfectly steamed red rice, a bumpkin's delight.",
      "zh-CN": "Perfectly steamed red rice, a bumpkin's delight.",
      fr: "Perfectly steamed red rice, a bumpkin's delight.",
      tk: "Perfectly steamed red rice, a bumpkin's delight.",
    },
    opensea: {
      description: "Nutritious red rice, steamed to perfection",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/570.png",
    },
  },
  "Sushi Roll": {
    image: sushiRoll,
    description: {
      en: "Delicious sushi roll, skillfully prepared.",
      pt: "Delicious sushi roll, skillfully prepared.",
      "zh-CN": "Delicious sushi roll, skillfully prepared.",
      fr: "Delicious sushi roll, skillfully prepared.",
      tk: "Delicious sushi roll, skillfully prepared.",
    },
    opensea: {
      description: "Delicious sushi rolls filled with fresh ingredients",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/571.png",
    },
  },
  "The Lot": {
    image: theLot,
    description: {
      en: "Flavorful fruit blend, refreshing and nutritious.",
      pt: "Flavorful fruit blend, refreshing and nutritious.",
      "zh-CN": "Flavorful fruit blend, refreshing and nutritious.",
      fr: "Flavorful fruit blend, refreshing and nutritious.",
      tk: "Flavorful fruit blend, refreshing and nutritious.",
    },
    opensea: {
      description: "A medley of fruits for the adventurous palate",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/572.png",
    },
  },
  "Tofu Scramble": {
    image: tofuScramble,
    description: {
      en: "Hearty scramble, packed with protein and flavor.",
      pt: "Hearty scramble, packed with protein and flavor.",
      "zh-CN": "Hearty scramble, packed with protein and flavor.",
      fr: "Hearty scramble, packed with protein and flavor.",
      tk: "Hearty scramble, packed with protein and flavor.",
    },
    opensea: {
      description:
        "Scrambled tofu with a mix of vegetables, a hearty breakfast",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Consumable",
        },
      ],
      image: "../public/erc1155/images/573.png",
    },
  },
  Greenhouse: {
    image: greenhouse,
    description: {
      en: "A sanctuary for sensitive crops",
      pt: "A sanctuary for sensitive crops",
      "zh-CN": "温室。娇弱庄稼的庇护所（消耗石油运转）",
      fr: "A sanctuary for sensitive crops",
      tk: "A sanctuary for sensitive crops",
    },
    opensea: {
      description: "A safehaven for sensitive crops",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Building",
        },
      ],
      image: "../public/erc1155/images/1019.png",
    },
  },
  "Rice Panda": {
    image: ricePanda,
    description: {
      en: "A smart panda never forgets to water the rice.",
      pt: "A smart panda never forgets to water the rice.",
      "zh-CN": "熊猫很聪明，从不忘记给稻米浇水。",
      fr: "A smart panda never forgets to water the rice.",
      tk: "A smart panda never forgets to water the rice.",
    },
    opensea: {
      description: "A smart panda never forgets to water the rice.",
      attributes: [
        {
          trait_type: "Boost",
          value: "Crop",
        },
        {
          trait_type: "Tradable",
          value: "Yes",
        },
        {
          display_type: "boost_number",
          trait_type: "Increase Rice Yield",
          value: 0.25,
        },
      ],
      image: "../public/erc1155/images/2034.png",
    },
  },
  "Benevolence Flag": {
    image: benevolenceFlag,
    description: {
      en: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      pt: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      "zh-CN":
        "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      fr: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      tk: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
    },
    opensea: {
      description:
        "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2035.png",
    },
  },
  "Devotion Flag": {
    image: devotionFlag,
    description: {
      en: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      pt: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      "zh-CN":
        "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      fr: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      tk: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
    },
    opensea: {
      description:
        "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2036.png",
    },
  },
  "Generosity Flag": {
    image: generosityFlag,
    description: {
      en: "For players who have donated substantial resources to the Goblins.",
      pt: "For players who have donated substantial resources to the Goblins.",
      "zh-CN":
        "For players who have donated substantial resources to the Goblins.",
      fr: "For players who have donated substantial resources to the Goblins.",
      tk: "For players who have donated substantial resources to the Goblins.",
    },
    opensea: {
      description:
        "For players who have donated substantial resources to the Goblins.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2037.png",
    },
  },
  "Splendor Flag": {
    image: splendorFlag,
    description: {
      en: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      pt: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      "zh-CN":
        "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      fr: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      tk: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
    },
    opensea: {
      description:
        "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2037.png",
    },
  },
  "Jelly Lamp": {
    image: jellyLamp,
    description: {
      en: "A lamp that brings a touch of luxury to any room.",
      pt: "A lamp that brings a touch of luxury to any room.",
      "zh-CN": "A lamp that brings a touch of luxury to any room.",
      fr: "A lamp that brings a touch of luxury to any room.",
      tk: "A lamp that brings a touch of luxury to any room.",
    },
    opensea: {
      description:
        "A decorative lamp that emits a light that emits a light that emits a light.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2039.png",
    },
  },
  "Paint Can": {
    image: paintCan,
    description: {
      en: "A paint can discovered in the festival of colors",
      pt: "A paint can discovered in the festival of colors",
      "zh-CN": "A paint can discovered in the festival of colors",
      fr: "A paint can discovered in the festival of colors",
      tk: "A paint can discovered in the festival of colors",
    },
    opensea: {
      description: "A can of paint found during the Festival of Colors.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2040.png",
    },
  },
  "Sunflorian Throne": {
    image: sunflorianThrone,
    description: {
      en: "A throne fit for a Sunflorian.",
      pt: "A throne fit for a Sunflorian.",
      "zh-CN": "A throne fit for a Sunflorian.",
      fr: "A throne fit for a Sunflorian.",
      tk: "A throne fit for a Sunflorian.",
    },
    opensea: {
      description: "A throne fit for a Sunflorian.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2041.png",
    },
  },
  "Nightshade Throne": {
    image: nightshadeThrone,
    description: {
      en: "A throne fit for a Nightshade.",
      pt: "A throne fit for a Nightshade.",
      "zh-CN": "A throne fit for a Nightshade.",
      fr: "A throne fit for a Nightshade.",
      tk: "A throne fit for a Nightshade.",
    },
    opensea: {
      description: "A throne fit for a Sunflorian.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2042.png",
    },
  },
  "Goblin Throne": {
    image: goblinThrone,
    description: {
      en: "A throne fit for a Goblin.",
      pt: "A throne fit for a Goblin.",
      "zh-CN": "A throne fit for a Goblin.",
      fr: "A throne fit for a Goblin.",
      tk: "A throne fit for a Goblin.",
    },
    opensea: {
      description: "A throne fit for a Sunflorian.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2043.png",
    },
  },
  "Bumpkin Throne": {
    image: bumpkinThrone,
    description: {
      en: "A throne fit for a Bumpkin.",
      pt: "A throne fit for a Bumpkin.",
      "zh-CN": "A throne fit for a Bumpkin.",
      fr: "A throne fit for a Bumpkin.",
      tk: "A throne fit for a Bumpkin.",
    },
    opensea: {
      description: "A throne fit for a Sunflorian.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2044.png",
    },
  },
  "Golden Sunflorian Egg": {
    image: goldenSunflorianEgg,
    description: {
      en: "A jewelled egg created by the House of Sunflorian.",
      pt: "A jewelled egg created by the House of Sunflorian.",
      "zh-CN": "A jewelled egg created by the House of Sunflorian.",
      fr: "A jewelled egg created by the House of Sunflorian.",
      tk: "A jewelled egg created by the House of Sunflorian.",
    },
    opensea: {
      description: "A jewelled egg created by the House of Sunflorian.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2045.png",
    },
  },
  "Goblin Mischief Egg": {
    image: goblinMischiefEgg,
    description: {
      en: "A jewelled egg created by the House of Goblin.",
      pt: "A jewelled egg created by the House of Goblin.",
      "zh-CN": "A jewelled egg created by the House of Goblin.",
      fr: "A jewelled egg created by the House of Goblin.",
      tk: "A jewelled egg created by the House of Goblin.",
    },
    opensea: {
      description: "A jewelled egg created by the House of Goblin.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2046.png",
    },
  },
  "Bumpkin Charm Egg": {
    image: bumpkinCharmEgg,
    description: {
      en: "A jewelled egg created by the House of Bumpkin.",
      pt: "A jewelled egg created by the House of Bumpkin.",
      "zh-CN": "A jewelled egg created by the House of Bumpkin.",
      fr: "A jewelled egg created by the House of Bumpkin.",
      tk: "A jewelled egg created by the House of Bumpkin.",
    },
    opensea: {
      description: "A jewelled egg created by the House of Bumpkin.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2047.png",
    },
  },
  "Nightshade Veil Egg": {
    image: nightshadeVeilEgg,
    description: {
      en: "A jewelled egg created by the House of Nightshade.",
      pt: "A jewelled egg created by the House of Nightshade.",
      "zh-CN": "A jewelled egg created by the House of Nightshade.",
      fr: "A jewelled egg created by the House of Nightshade.",
      tk: "A jewelled egg created by the House of Nightshade.",
    },
    opensea: {
      description: "A jewelled egg created by the House of Nightshade.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2048.png",
    },
  },
  "Emerald Goblin Goblet": {
    image: emeraldGoblinGoblet,
    description: {
      en: "An emerald encrusted goblet.",
      pt: "An emerald encrusted goblet.",
      "zh-CN": "An emerald encrusted goblet.",
      fr: "An emerald encrusted goblet.",
      tk: "An emerald encrusted goblet.",
    },
    opensea: {
      description: "An emerald encrusted goblet.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2049.png",
    },
  },
  "Opal Sunflorian Goblet": {
    image: opalSunflorianGoblet,
    description: {
      en: "An opal encrusted goblet.",
      pt: "An opal encrusted goblet.",
      "zh-CN": "An opal encrusted goblet.",
      fr: "An opal encrusted goblet.",
      tk: "An opal encrusted goblet.",
    },
    opensea: {
      description: "An opal encrusted goblet.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2050.png",
    },
  },
  "Sapphire Bumpkin Goblet": {
    image: sapphireBumpkinGoblet,
    description: {
      en: "A sapphire encrusted goblet.",
      pt: "A sapphire encrusted goblet.",
      "zh-CN": "A sapphire encrusted goblet.",
      fr: "A sapphire encrusted goblet.",
      tk: "A sapphire encrusted goblet.",
    },
    opensea: {
      description: "A sapphire encrusted goblet.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2051.png",
    },
  },
  "Amethyst Nightshade Goblet": {
    image: amethystNightshadeGoblet,
    description: {
      en: "An amethyst encrusted goblet.",
      pt: "An amethyst encrusted goblet.",
      "zh-CN": "An amethyst encrusted goblet.",
      fr: "An amethyst encrusted goblet.",
      tk: "An amethyst encrusted goblet.",
    },
    opensea: {
      description: "An amethyst encrusted goblet",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2052.png",
    },
  },
  "Golden Faction Goblet": {
    image: goldenFactionGoblet,
    description: {
      en: "A golden goblet.",
      pt: "A golden goblet.",
      "zh-CN": "A golden goblet.",
      fr: "A golden goblet.",
      tk: "A golden goblet.",
    },
    opensea: {
      description: "A golden goblet.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2053.png",
    },
  },
  "Ruby Faction Goblet": {
    image: rubyFactionGoblet,
    description: {
      en: "A ruby encrusted goblet.",
      pt: "A ruby encrusted goblet.",
      "zh-CN": "A ruby encrusted goblet.",
      fr: "A ruby encrusted goblet.",
      tk: "A ruby encrusted goblet.",
    },
    opensea: {
      description: "A ruby encrusted goblet.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2054.png",
    },
  },
  "Sunflorian Bunting": {
    image: sunflorianBunting,
    description: {
      en: "Colorful flags celebrating the Sunflorian Faction.",
      pt: "Colorful flags celebrating the Sunflorian Faction.",
      "zh-CN": "Colorful flags celebrating the Sunflorian Faction.",
      fr: "Colorful flags celebrating the Sunflorian Faction.",
      tk: "Colorful flags celebrating the Sunflorian Faction.",
    },
    opensea: {
      description: "Colorful flags celebrating the Sunflorian Faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2055.png",
    },
  },
  "Nightshade Bunting": {
    image: nightshadeBunting,
    description: {
      en: "Colorful flags celebrating the Nightshade faction.",
      pt: "Colorful flags celebrating the Nightshade faction.",
      "zh-CN": "Colorful flags celebrating the Nightshade faction.",
      fr: "Colorful flags celebrating the Nightshade faction.",
      tk: "Colorful flags celebrating the Nightshade faction.",
    },
    opensea: {
      description: "Colorful flags celebrating the Nightshade faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2056.png",
    },
  },
  "Goblin Bunting": {
    image: goblinBunting,
    description: {
      en: "Colorful flags celebrating the Goblin faction.",
      pt: "Colorful flags celebrating the Goblin faction.",
      "zh-CN": "Colorful flags celebrating the Goblin faction.",
      fr: "Colorful flags celebrating the Goblin faction.",
      tk: "Colorful flags celebrating the Goblin faction.",
    },
    opensea: {
      description: "Colorful flags celebrating the Goblin faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2057.png",
    },
  },
  "Bumpkin Bunting": {
    image: bumpkinBunting,
    description: {
      en: "Colorful flags celebrating the Bumpkin faction.",
      pt: "Colorful flags celebrating the Bumpkin faction.",
      "zh-CN": "Colorful flags celebrating the Bumpkin faction.",
      fr: "Colorful flags celebrating the Bumpkin faction.",
      tk: "Colorful flags celebrating the Bumpkin faction.",
    },
    opensea: {
      description: "Colorful flags celebrating the Bumpkin faction.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2058.png",
    },
  },
  "Sunflorian Candles": {
    image: sunflorianCandles,
    description: {
      en: "Sunflorian Faction decorative candles.",
      pt: "Sunflorian Faction decorative candles.",
      "zh-CN": "Sunflorian Faction decorative candles.",
      fr: "Sunflorian Faction decorative candles.",
      tk: "Sunflorian Faction decorative candles.",
    },
    opensea: {
      description: "Sunflorian Faction decorative candles.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2059.png",
    },
  },
  "Nightshade Candles": {
    image: nightshadeCandles,
    description: {
      en: "Nightshade Faction decorative candles.",
      pt: "Nightshade Faction decorative candles.",
      "zh-CN": "Nightshade Faction decorative candles.",
      fr: "Nightshade Faction decorative candles.",
      tk: "Nightshade Faction decorative candles.",
    },
    opensea: {
      description: "Nightshade Faction decorative candles.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2060.png",
    },
  },
  "Goblin Candles": {
    image: goblinCandles,
    description: {
      en: "Goblin Faction decorative candles.",
      pt: "Goblin Faction decorative candles.",
      "zh-CN": "Goblin Faction decorative candles.",
      fr: "Goblin Faction decorative candles.",
      tk: "Goblin Faction decorative candles.",
    },
    opensea: {
      description: "Goblin Faction decorative candles.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2061.png",
    },
  },
  "Bumpkin Candles": {
    image: bumpkinCandles,
    description: {
      en: "Bumpkin Faction decorative candles.",
      pt: "Bumpkin Faction decorative candles.",
      "zh-CN": "Bumpkin Faction decorative candles.",
      fr: "Bumpkin Faction decorative candles.",
      tk: "Bumpkin Faction decorative candles.",
    },
    opensea: {
      description: "Bumpkin Faction decorative candles.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2062.png",
    },
  },
  "Sunflorian Left Wall Sconce": {
    image: sunflorianLeftWall,
    description: {
      en: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      pt: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      fr: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      tk: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2063.png",
    },
  },
  "Nightshade Left Wall Sconce": {
    image: nightshadeLeftWall,
    description: {
      en: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      pt: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Nightshade Wall Sconce.",
      fr: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      tk: "Illuminate your living quarters with a Nightshade Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Nightshade Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2064.png",
    },
  },
  "Goblin Left Wall Sconce": {
    image: goblinLeftWall,
    description: {
      en: "Illuminate your living quarters with a Goblin Wall Sconce.",
      pt: "Illuminate your living quarters with a Goblin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Goblin Wall Sconce.",
      fr: "Illuminate your living quarters with a Goblin Wall Sconce.",
      tk: "Illuminate your living quarters with a Goblin Wall Sconce.",
    },
    opensea: {
      description: "Illuminate your living quarters with a Goblin Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2065.png",
    },
  },
  "Bumpkin Left Wall Sconce": {
    image: bumpkinLeftWall,
    description: {
      en: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      pt: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      fr: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      tk: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2066.png",
    },
  },
  "Sunflorian Right Wall Sconce": {
    image: sunflorianRightWall,
    description: {
      en: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      pt: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      fr: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      tk: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2067.png",
    },
  },
  "Nightshade Right Wall Sconce": {
    image: nightshadeRightWall,
    description: {
      en: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      pt: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Nightshade Wall Sconce.",
      fr: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      tk: "Illuminate your living quarters with a Nightshade Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Nightshade Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2068.png",
    },
  },
  "Goblin Right Wall Sconce": {
    image: goblinRightWall,
    description: {
      en: "Illuminate your living quarters with a Goblin Wall Sconce.",
      pt: "Illuminate your living quarters with a Goblin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Goblin Wall Sconce.",
      fr: "Illuminate your living quarters with a Goblin Wall Sconce.",
      tk: "Illuminate your living quarters with a Goblin Wall Sconce.",
    },
    opensea: {
      description: "Illuminate your living quarters with a Goblin Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2069.png",
    },
  },
  "Bumpkin Right Wall Sconce": {
    image: bumpkinRightWall,
    description: {
      en: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      pt: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      fr: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      tk: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    },
    opensea: {
      description:
        "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2070.png",
    },
  },
  "Gourmet Hourglass": {
    image: gourmetHourglass,
    description: {
      en: "Reduces cooking time by 50% for 4 hours.",
      pt: "Reduces cooking time by 50% for 4 hours.",
      "zh-CN": "Reduces cooking time by 50% for 4 hours.",
      fr: "Reduces cooking time by 50% for 4 hours.",
      tk: "Reduces cooking time by 50% for 4 hours.",
    },
    opensea: {
      description: "Reduces cooking time by 50% for 4 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2071.png",
    },
  },
  "Harvest Hourglass": {
    image: harvestHourglass,
    description: {
      en: "Reduces crop growth time by 25% for 6 hours.",
      pt: "Reduces crop growth time by 25% for 6 hours.",
      "zh-CN": "Reduces crop growth time by 25% for 6 hours.",
      fr: "Reduces crop growth time by 25% for 6 hours.",
      tk: "Reduces crop growth time by 25% for 6 hours.",
    },
    opensea: {
      description: "Reduces crop growth time by 25% for 6 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2072.png",
    },
  },
  "Timber Hourglass": {
    image: timberHourglass,
    description: {
      en: "Reduces tree recovery time by 25% for 4 hours.",
      pt: "Reduces tree recovery time by 25% for 4 hours.",
      "zh-CN": "Reduces tree recovery time by 25% for 4 hours.",
      fr: "Reduces tree recovery time by 25% for 4 hours.",
      tk: "Reduces tree recovery time by 25% for 4 hours.",
    },
    opensea: {
      description: "Currency of the Factions. Use this in the Marks Shop.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2073.png",
    },
  },
  "Ore Hourglass": {
    image: oreHourglass,
    description: {
      en: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      pt: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      "zh-CN": "Reduces mineral replenish cooldown by 50% for 3 hours.",
      fr: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      tk: "Reduces mineral replenish cooldown by 50% for 3 hours.",
    },
    opensea: {
      description: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2074.png",
    },
  },
  "Orchard Hourglass": {
    image: orchardHourglass,
    description: {
      en: "Reduces fruit growth time by 25% for 6 hours.",
      pt: "Reduces fruit growth time by 25% for 6 hours.",
      "zh-CN": "Reduces fruit growth time by 25% for 6 hours.",
      fr: "Reduces fruit growth time by 25% for 6 hours.",
      tk: "Reduces fruit growth time by 25% for 6 hours.",
    },
    opensea: {
      description: "Reduces fruit growth time by 25% for 6 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2075.png",
    },
  },
  "Blossom Hourglass": {
    image: blossomHourglass,
    description: {
      en: "Reduces flower growth time by 25% for 4 hours.",
      pt: "Reduces flower growth time by 25% for 4 hours.",
      "zh-CN": "Reduces flower growth time by 25% for 4 hours.",
      fr: "Reduces flower growth time by 25% for 4 hours.",
      tk: "Reduces flower growth time by 25% for 4 hours.",
    },
    opensea: {
      description: "Reduces flower growth time by 25% for 4 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2076.png",
    },
  },
  "Fisher's Hourglass": {
    image: fishersHourglass,
    description: {
      en: "Gives a 50% chance of +1 fish for 4 hours.",
      pt: "Gives a 50% chance of +1 fish for 4 hours.",
      "zh-CN": "Gives a 50% chance of +1 fish for 4 hours.",
      fr: "Gives a 50% chance of +1 fish for 4 hours.",
      tk: "Gives a 50% chance of +1 fish for 4 hours.",
    },
    opensea: {
      description: "Gives a 50% chance of +1 fish for 4 hours.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2077.png",
    },
  },
  "Sunflorian Faction Rug": {
    image: sunflorianFactionRug,
    description: {
      en: "A magnificent rug made by the talented Sunflorian faction artisans.",
      pt: "A magnificent rug made by the talented Sunflorian faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Sunflorian faction artisans.",
      fr: "A magnificent rug made by the talented Sunflorian faction artisans.",
      tk: "A magnificent rug made by the talented Sunflorian faction artisans.",
    },
    opensea: {
      description:
        "A magnificent rug made by the talented Sunflorian faction artisans.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2078.png",
    },
  },
  "Nightshade Faction Rug": {
    image: nightshadeFactionRug,
    description: {
      en: "A magnificent rug made by the talented Nightshade faction artisans.",
      pt: "A magnificent rug made by the talented Nightshade faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Nightshade faction artisans.",
      fr: "A magnificent rug made by the talented Nightshade faction artisans.",
      tk: "A magnificent rug made by the talented Nightshade faction artisans.",
    },
    opensea: {
      description:
        "A magnificent rug made by the talented Nightshade faction artisans.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2079.png",
    },
  },
  "Goblin Faction Rug": {
    image: goblinFactionRug,
    description: {
      en: "A magnificent rug made by the talented Goblin faction artisans.",
      pt: "A magnificent rug made by the talented Goblin faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Goblin faction artisans.",
      fr: "A magnificent rug made by the talented Goblin faction artisans.",
      tk: "A magnificent rug made by the talented Goblin faction artisans.",
    },
    opensea: {
      description:
        "A magnificent rug made by the talented Goblin faction artisans.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2080.png",
    },
  },
  "Bumpkin Faction Rug": {
    image: bumpkinFactionRug,
    description: {
      en: "A magnificent rug made by the talented Bumpkin faction artisans.",
      pt: "A magnificent rug made by the talented Bumpkin faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Bumpkin faction artisans.",
      fr: "A magnificent rug made by the talented Bumpkin faction artisans.",
      tk: "A magnificent rug made by the talented Bumpkin faction artisans.",
    },
    opensea: {
      description:
        "A magnificent rug made by the talented Bumpkin faction artisans.",
      attributes: [
        {
          trait_type: "Purpose",
          value: "Decoration",
        },
      ],
      image: "../public/erc1155/images/2081.png",
    },
  },
  "Goblin Gold Champion": {
    image: goblinGoldChampion,
    description: {
      en: "TODO",
      pt: "TODO",
      "zh-CN": "TODO",
      fr: "TODO",
      tk: "TODO",
    },
  },
  "Goblin Silver Champion": {
    image: goblinSilverChampion,
    description: {
      en: "TODO",
      pt: "TODO",
      "zh-CN": "TODO",
      fr: "TODO",
      tk: "TODO",
    },
  },
};
