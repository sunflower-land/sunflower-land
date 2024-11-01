import React from "react";

import { CollectibleProps } from "./Collectible";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { MysteriousHead } from "./components/MysteriousHead";
import { WarSkulls } from "./components/WarSkulls";
import { WarTombstone } from "./components/WarTombstone";
import { ChristmasTree } from "./components/ChristmasTree";
import { ApprenticeBeaver } from "./components/ApprenticeBeaver";
import { WoodyTheBeaver } from "./components/WoodyTheBeaver";
import { ForemanBeaver } from "./components/ForemanBeaver";
import { ChickenCoop } from "./components/ChickenCoop";
import { EasterBunny } from "./components/EasterBunny";
import { FarmCat } from "./components/FarmCat";
import { FarmDog } from "./components/FarmDog";
import { FarmerBath } from "./components/FarmerBath";
import { FatChicken } from "./components/FatChicken";
import { SpeedChicken } from "./components/SpeedChicken";
import { RichChicken } from "./components/RichChicken";
import { Rooster } from "./components/Rooster";
import { GoblinCrown } from "./components/GoblinCrown";
import { GoldEgg } from "./components/GoldEgg";
import { GoldenBonsai } from "./components/GoldenBonsai";
import { UndeadRooster } from "./components/UndeadRooster";
import { GoldenCauliflower } from "./components/GoldenCauliflower";
import { HomelessTent } from "./components/HomelessTent";
import { MysteriousParsnip } from "./components/MysteriousParsnip";
import { PotatoStatue } from "./components/PotatoStatue";
import { NyonStatue } from "./components/NyonStatue";
import { RockGolem } from "./components/RockGolem";
import { RockyTheMole } from "./components/RockyTheMole";
import { TunnelMole } from "./components/TunnelMole";
import { Nugget } from "./components/Nugget";
import { SunflowerRock } from "./components/SunflowerRock";
import { SunflowerStatue } from "./components/SunflowerStatue";
import { SunflowerTombstone } from "./components/SunflowerTombstone";
import { WickerMan } from "./components/WickerMan";
import { Fountain } from "./components/Fountain";
import { Gnome } from "./components/Gnome";
import { Nancy } from "./components/Nancy";
import { Scarecrow } from "./components/Scarecrow";
import { Kuebiko } from "./components/Kuebiko";
import { flags } from "./components/Flags";
import { CarrotSword } from "./components/CarrotSword";
import { WhiteTulips } from "./components/WhiteTulips";
import { PottedSunflower } from "./components/PottedSunflower";
import { Cactus } from "./components/Cactus";
import { BasicBear } from "./components/BasicBear";
import { CabbageBoy } from "./components/CabbageBoy";
import { CabbageGirl } from "./components/CabbageGirl";
import { PeeledPotato } from "./components/PeeledPotato";
import { WoodNymphWendy } from "./components/WoodNymphWendy";
import { ChefBear } from "./components/ChefBear";
import { ConstructionBear } from "./components/ConstructionBear";
import { AngelBear } from "./components/AngelBear";
import { DevilBear } from "./components/DevilBear";
import { BearTrap } from "./components/BearTrap";
import { BrilliantBear } from "./components/BrilliantBear";
import { ClassyBear } from "./components/ClassyBear";
import { FarmerBear } from "./components/FarmerBear";
import { RichBear } from "./components/RichBear";
import { SunflowerBear } from "./components/SunflowerBear";
import { BadassBear } from "./components/BadassBear";
import { VictoriaSisters } from "./components/VictoriaSisters";
import { INITIAL_FARM, PIXEL_SCALE } from "features/game/lib/constants";
import { Bean } from "./components/Bean";
import { PottedPumpkin } from "features/island/collectibles/components/PottedPumpkin";
import { PottedPotato } from "features/island/collectibles/components/PottedPotato";
import { ChristmasBear } from "./components/ChristmasBear";
import { RainbowArtistBear } from "./components/RainbowArtistBear";
import { Observatory } from "./components/Observatory";
import { SnowGlobe } from "./components/SnowGlobe";
import { ImmortalPear } from "./components/ImmortalPear";
import { AyamCemani } from "./components/AyamCemani";
import { CollectibleBear } from "./components/CollectibleBear";
import { CyborgBear } from "./components/CyborgBear";
import { ManekiNeko } from "./components/ManekiNeko";
import { LadyBug } from "./components/LadyBug";
import { BlackBearry } from "./components/BlackBearry";
import { SquirrelMonkey } from "./components/SquirrelMonkey";
import { TikiTotem } from "./components/TikiTotem";
import { LunarCalendar } from "./components/LunarCalendar";
import { AbandonedBear } from "./components/AbandonedBear";
import { TurtleBear } from "./components/TurtleBear";
import { TRexSkull } from "./components/TRexSkull";
import { LifeguardBear } from "./components/LifeguardBear";
import { SnorkelBear } from "./components/SnorkelBear";
import { ParasaurSkull } from "./components/ParasaurSkull";
import { GoblinBear } from "./components/GoblinBear";
import { GoldenBearHead } from "./components/GoldenBearHead";
import { HumanBear } from "./components/HumanBear";
import { PirateBear } from "./components/PirateBear";
import { SunflowerCoin } from "./components/SunflowerCoin";
import { Galleon } from "./components/Galleon";
import { SkeletonKingStaff } from "./components/SkeletonKingStaff";
import { Foliant } from "./components/Foliant";
import { DinosaurBone } from "./components/DinosaurBone";
import { HeartOfDavyJones } from "./components/HeartOfDavyJones";
import { TreasureMap } from "./components/TreasureMap";
import { WhaleBear } from "./components/WhaleBear";
import { HeartBalloons } from "./components/HeartBalloons";
import { Flamingo } from "./components/Flamingo";
import { BlossomTree } from "./components/BlossomTree";
import { IronIdol } from "./components/IronIdol";
import { ValentineBear } from "./components/ValentineBear";
import { BeachBall } from "./components/BeachBall";
import { PalmTree } from "./components/PalmTree";
import { Karkinos } from "./components/Karkinos";
import { PabloBunny } from "features/island/collectibles/components/PabloBunny";
import { EasterBear } from "features/island/collectibles/components/EasterBear";
import { EasterBush } from "features/island/collectibles/components/EasterBush";
import { GiantCarrot } from "features/island/collectibles/components/GiantCarrot";
import { MushroomHouse } from "./components/MushroomHouse";
import { Bush } from "./components/Bush";
import { Shrub } from "./components/Shrub";
import { PineTree } from "./components/PineTree";
import { Fence } from "./components/Fence";
import { DawnBreakerBanner } from "./components/DawnBreakerBanner";
import { SolarFlareBanner } from "./components/SolarFlareBanner";
import { HumanBanner } from "./components/HumanBanner";
import { GoblinBanner } from "./components/GoblinBanner";
import { ITEM_DETAILS } from "features/game/types/images";
import { BonniesTombstone } from "./components/BonniesTombstone";
import { ChestnutFungiStool } from "./components/ChestnutFungiStool";
import { CrimsonCap } from "./components/CrimsonCap";
import { DawnUmbreallSeat } from "./components/DawnUmbrellaSeat";
import { EggplantGrill } from "./components/EggplantGrill";
import { GiantDawnMushroom } from "./components/GiantDawnMushroom";
import { GrubnashTombstone } from "./components/GrubnashTombstone";
import { MahoganyCap } from "./components/MahoganyCap";
import { ShroomGlow } from "./components/ShroomGlow";
import { ToadstoolSeat } from "./components/ToadstoolSeat";
import { Clementine } from "./components/Clementine";
import { Cobalt } from "./components/Cobalt";
import { PurpleTrail } from "./components/PurpleTrail";
import { Obie } from "./components/Obie";
import { Maximus } from "./components/Maximus";
import { GenieLamp } from "./components/GenieLamp";
import { LuminousLantern } from "./components/LuminousLantern";
import { AuroraLantern } from "./components/AuroraLantern";
import { RadianceLantern } from "./components/RadianceLantern";
import { Hoot } from "./components/Hoot";
import { GenieBear } from "./components/GenieBear";
import { BasicScarecrow } from "./components/BasicScarecrow";
import lightning from "assets/icons/lightning.png";
import { EmeraldTurtle } from "./components/EmeraldTurtle";
import { TinTurtle } from "./components/TinTurtle";
import { StoneFence } from "./components/StoneFence";
import { FieldMaple } from "./components/FieldMaple";
import { GoldenMaple } from "./components/GoldenMaple";
import { RedMaple } from "./components/RedMaple";
import { OceanLantern } from "./components/OceanLantern";
import { BetaBear } from "./components/BetaBear";
import { SirGoldenSnout } from "./components/SirGoldenSnout";
import { Bale } from "./components/Bale";
import { SolarLantern } from "./components/SolarLantern";
import { ScaryMike } from "./components/ScaryMike";
import { BettyLantern } from "./components/BettyLantern";
import { BumpkinLantern } from "./components/BumpkinLantern";
import { EggplantBear } from "./components/EggplantBear";
import { GoblinLantern } from "./components/GoblinLantern";
import { DawnFlower } from "./components/DawnFlower";
import { LaurieTheChuckleCrow } from "./components/LaurieTheChuckelCrow";
import { FreyaFox } from "./components/FreyaFox";
import { WitchesEveBanner } from "./components/WitchesEveBanner";
import { ElPolloVeloz } from "./components/ElPolloVeloz";
import { Poppy } from "./components/Poppy";
import { GrainGrinder } from "./components/GrainGrinder";
import { Kernaldo } from "./components/Kernaldo";
import { QueenCornelia } from "./components/QueenCornelia";
import { SpookyTree } from "./components/SpookyTree";
import { Candles } from "./components/Candles";
import { HauntedStump } from "./components/HauntedStump";
import { GiantPotato } from "./components/GiantPotato";
import { GiantCabbage } from "./components/GiantCabbage";
import { GiantPumpkin } from "./components/GiantPumpkin";
import { LabGrownCarrot } from "./components/LabGrownCarrot";
import { LabGrownPumpkin } from "./components/LabGrownPumpkin";
import { LabGrownRadish } from "./components/LabGrownRadish";
import { RadicalRadish } from "./components/RadicalRadish";
import { PotentPotato } from "./components/PotentPotato";
import { StellarSunflower } from "./components/StellarSunflower";
import { Sign } from "./components/Sign";
import { Bud } from "./components/Bud";
import { CrowRock } from "./components/CrowRock";
import { MiniCornMaze } from "./components/MiniCornMaze";
import { Observer } from "./components/Observer";
import { WhiteCrow } from "./components/WhiteCrow";
import { CatchTheKrakenBanner } from "./components/CatchTheKrakenBanner";
import { TwilightAnglerfish } from "./components/TwilightAnglerfish";
import { StarlightTuna } from "./components/StartlightTuna";
import { RadiantRay } from "./components/RadiantRay";
import { PhantomBarracuda } from "./components/PhantomBarracuda";
import { GildedSwordfish } from "./components/GildedSwordfish";
import { CrimsonCarp } from "./components/CrimsonCarp";
import { SapoDocuras } from "./components/SapoDocuras";
import { SapoTravessuras } from "./components/SapoTravessuras";
import { LifeguardRing } from "./components/LifeguardRing";
import { Surfboard } from "./components/Sunfboard";
import { HideawayHerman } from "./components/HideawayHerman";
import { ShiftySheldon } from "./components/ShiftySheldon";
import { TikiTorch } from "./components/TikiTorch";
import { BeachUmbrella } from "./components/BeachUmbrella";
import { Walrus } from "./components/Walrus";
import { Alba } from "./components/Alba";
import { KnowledgeCrab } from "./components/KnowledgeCrab";
import { Anchor } from "./components/Anchor";
import { RubberDucky } from "./components/RubberDucky";
import { KrakenTentacle } from "./components/KrakenTentacle";
import { BananaChicken } from "./components/BananaChicken";
import { SkillShrimpy } from "./components/SkillShrimpy";
import { SoilKrabby } from "./components/SoilKrabby";
import { Nana } from "./components/Nana";
import { TimeWarpTotem } from "./components/TimeWarpTotem";
import { KrakenHead } from "./components/KrakenHead";
import { Nutcracker } from "./components/Nutcracker";
import { FestiveTree } from "./components/FestiveTree";
import { GrinxsHammer } from "./components/GrinxsHammer";
import { WhiteFestiveFox } from "./components/WhiteFestiveFox";
import { Rug } from "./components/Rug";
import { Wardrobe } from "./components/Wardrobe";
import { SpringBlossomBanner } from "./components/SpringBlossomBanner";
import { HummingBird } from "./components/HummingBird";
import { QueenBee } from "./components/QueenBee";
import { FlowerFox } from "./components/FlowerFox";
import { HungryCaterpillar } from "./components/HungryCaterpillar";
import { SunriseBloomRug } from "./components/SunriseBloomRug";
import { BlossomRoyale } from "./components/BlossomRoyale";
import { Rainbow } from "./components/Rainbow";
import { EnchantedRose } from "./components/EnchantedRose";
import { FlowerCart } from "./components/FlowerCart";
import { Capybara } from "./components/Capybara";
import { PrismPetal } from "./components/PrismPetal";
import { CelestialFrostbloom } from "./components/CelestialFrostbloom";
import { PrimulaEnigma } from "./components/PrimulaEnigma";
import { Blossombeard } from "./components/Blossombeard";
import { CrimPeckster } from "./components/CrimPeckster";
import { FlowerRug } from "./components/FlowerRug";
import { EarnAllianceBanner } from "./components/EarnAllianceBanner";
import { GreenFieldRug } from "./components/GreenFieldRug";
import { TeaRug } from "./components/TeaRug";
import { BabyPanda } from "./components/BabyPanda";
import { Baozi } from "./components/Baozi";
import { CommunityEgg } from "./components/CommunityEgg";
import { HungryHare } from "./components/HungryHare";
import { SunflorianFactionBanner } from "./components/SunflorianFactionBanner";
import { GoblinFactionBanner } from "./components/GoblinFactionBanner";
import { NightshadeFactionBanner } from "./components/NightshadeFactionBanner";
import { BumpkinFactionBanner } from "./components/BumpkinFactionBanner";
import { ClashOfFactionsBanner } from "./components/ClashOfFactionsBanner";
import { LifetimeFarmerBanner } from "./components/LifetimeFarmerBanner";
import { TurboSprout } from "./components/TurboSprout";
import { Soybliss } from "./components/Soybliss";
import { GrapeGranny } from "./components/GrapeGranny";
import { RoyalThrone } from "./components/RoyalThrone";
import { LilyEgg } from "./components/LilyEgg";
import { Goblet } from "./components/Goblet";
import { FancyRug } from "./components/FancyRug";
import { Clock } from "./components/Clock";
import { Vinny } from "./components/Vinny";
import { KnightChicken } from "./components/KnightChicken";
import { GauchoRug } from "./components/GauchoRug";
import { BattlecryDrum } from "./components/BattleCryDrum";
import { BullseyeBoard } from "./components/BullseyeBoard";
import { ChessRug } from "./components/ChessRug";
import { GoldenGallant } from "./components/GoldenGallant";
import { GoldenGarrison } from "./components/GoldenGarrison";
import { GoldenGuardian } from "./components/GoldenGuardian";
import { NoviceKnight } from "./components/NoviceKnight";
import { RegularPawn } from "./components/RegularPawn";
import { RookieRook } from "./components/RookieRook";
import { SilverSentinel } from "./components/SilverSentinel";
import { SilverSquire } from "./components/SilverSquire";
import { SilverStallion } from "./components/SilverStallion";
import { TraineeTarget } from "./components/TraineeTarget";
import { TwisterRug } from "./components/TwisterRug";
import { Cluckapult } from "./components/Cluckapult";
import { DesertGnome } from "./components/DesertGnome";

// TODO: Remove partial once all placeable treasures have been added (waiting on artwork)
import { RicePanda } from "./components/RicePanda";
import { BenevolenceFlag } from "./components/BenevolenceFlag";
import { DevotionFlag } from "./components/DevotionFlag";
import { GenerosityFlag } from "./components/GenerosityFlag";
import { SplendorFlag } from "./components/SplendorFlag";
import { PaintCan } from "./components/PaintCan";
import { JellyLamp } from "./components/JellyLamp";
import { SunflorianThrone } from "./components/SunflorianThrone";
import { NightshadeThrone } from "./components/NightshadeThrone";
import { GoblinThrone } from "./components/GoblinThrone";
import { BumpkinThrone } from "./components/BumpkinThrone";
import { GoldenSunflorianEgg } from "./components/GoldenSunflorianEgg";
import { GoblinMischiefEgg } from "./GoblinMischiefEgg";
import { BumpkinCharmEgg } from "./BumpkinCharmEgg";
import { NightshadeVeilEgg } from "./NightshadeVeilEgg";
import { EmeraldGoblinGoblet } from "./components/EmeralGoblinGoblet";
import { OpalSunflorianGoblet } from "./OpalSunflorianGoblet";
import { SapphireBumpkinGoblet } from "./SapphireBumpkinGoblet";
import { AmethystNightshadeGoblet } from "./components/AmethystNightshadeGoblet";
import { GoldenFactionGoblet } from "./components/GoldenFactionGoblet";
import { RubyFactionGoblet } from "./components/RubyFactionGoblet";
import { SunflorianBunting } from "./components/SunflorianBunting";
import { NightshadeBunting } from "./components/NightshadeBunting";
import { GoblinBunting } from "./components/GoblilnBunting";
import { BumpkinBunting } from "./components/BumpkinBunting";
import { SunflorianCandles } from "./components/SunflorianCandles";
import { NightshadeCandles } from "./components/NightshadeCandles";
import { GoblinCandles } from "./components/GoblinCandles";
import { BumpkinCandles } from "./components/BumpkinCandles";
import { SunflorianRightWallSconce } from "./components/SunflorianRightWallSconce";
import { SunflorianLeftWallSconce } from "./components/SunflorianLeftWallSconce";
import { NightshadeLeftWallSconce } from "./components/NightshadeLeftWallSconce";
import { GoblinLeftWallSconce } from "./components/GoblinLeftWallSconce";
import { BumpkinLeftWallSconce } from "./components/BumpkinLeftWallSconce";
import { NightshadeRightWallSconce } from "./components/NightshadeRightWallSconce";
import { GoblinRightWallSconce } from "./components/GoblinRightWallSconce";
import { Hourglass } from "./components/Hourglass";
import { NightshadeFactionRug } from "./components/NightshadeFactionRug";
import { SunflorianFactionRug } from "./components/SunflorianFactionRug";
import { GoblinFactionRug } from "./components/GoblinFactionRug";
import { BumpkinFactionRug } from "./components/BumpkinFactionRug";
import { BumpkinRightWallSconce } from "./components/BumpkinRightWallSconce";
import { TemplateCollectible } from "./TemplateCollectible";
import {
  DECORATION_TEMPLATES,
  TemplateDecorationName,
} from "features/game/types/decorations";
import { PharaohsTreasureBanner } from "./components/PharaohsTreasureBanner";
import { DesertRose } from "./components/DesertRose";
// import { Template } from "./components/template/Template";
import { PharaohChicken } from "./components/PharaohChicken";
import { ImageStyle } from "./components/template/ImageStyle";
import { LemonShark } from "./components/LemonShark";
import { BattleFish } from "./components/BattleFish";
import { TomatoBombard } from "./components/TomatoBombard";
import { BullRunBanner } from "./components/BullRunBanner";
import { Bed } from "./components/Bed";
import { Wagon } from "./components/Wagon";
import { hasFeatureAccess } from "lib/flags";
import { Chicory } from "./components/Chicory";
import { LonghornCowfish } from "./components/LonghornCownfish";
import { AlienChicken } from "./components/AlienChicken";
import { ToxicTuft } from "./components/ToxicTuft";
import { Mootant } from "./components/Mootants";

export const COLLECTIBLE_COMPONENTS: Record<
  CollectibleName | "Bud",
  React.FC<CollectibleProps>
> = {
  ...getKeys(DECORATION_TEMPLATES).reduce(
    (previous, name) => ({
      ...previous,
      [name]: () => (
        <TemplateCollectible
          name={name}
          dimensions={DECORATION_TEMPLATES[name].dimensions}
        />
      ),
    }),
    {} as Record<TemplateDecorationName, React.FC<CollectibleProps>>,
  ),
  "Jelly Lamp": JellyLamp,
  "Paint Can": PaintCan,
  "Benevolence Flag": BenevolenceFlag,
  "Devotion Flag": DevotionFlag,
  "Generosity Flag": GenerosityFlag,
  "Splendor Flag": SplendorFlag,
  "Gaucho Rug": GauchoRug,

  "Hungry Hare": HungryHare,
  "Community Egg": CommunityEgg,
  Baozi: Baozi,
  "Baby Panda": BabyPanda,
  "Earn Alliance Banner": EarnAllianceBanner,
  Wardrobe: Wardrobe,
  "White Festive Fox": WhiteFestiveFox,
  Rug: Rug,
  "Grinx's Hammer": GrinxsHammer,
  "Time Warp Totem": TimeWarpTotem,
  "Sapo Docuras": SapoDocuras,
  "Sapo Travessuras": SapoTravessuras,

  "Mysterious Head": MysteriousHead,
  "War Skull": WarSkulls,
  "War Tombstone": WarTombstone,
  "Christmas Tree": ChristmasTree,

  // Beavers
  "Woody the Beaver": WoodyTheBeaver,
  "Apprentice Beaver": ApprenticeBeaver,
  "Foreman Beaver": ForemanBeaver,

  "Chicken Coop": ChickenCoop,
  "Easter Bunny": EasterBunny,

  // Animals
  "Farm Cat": FarmCat,
  "Farm Dog": FarmDog,
  "Farmer Bath": FarmerBath,
  // Chickens
  "Fat Chicken": FatChicken,
  "Rich Chicken": RichChicken,
  "Speed Chicken": SpeedChicken,
  Rooster,
  "Undead Rooster": UndeadRooster,

  "Dirt Path": () => null,
  Fence: Fence,
  Bush: Bush,
  Shrub: Shrub,
  "Pine Tree": PineTree,
  "Field Maple": FieldMaple,
  "Red Maple": RedMaple,
  "Golden Maple": GoldenMaple,
  "Stone Fence": StoneFence,
  "Goblin Crown": GoblinCrown,
  "Gold Egg": GoldEgg,
  "Golden Bonsai": GoldenBonsai,
  "Golden Cauliflower": GoldenCauliflower,
  "Homeless Tent": HomelessTent,
  "Mysterious Parsnip": MysteriousParsnip,
  "Potato Statue": PotatoStatue,
  "Nyon Statue": NyonStatue,
  "Rock Golem": RockGolem,
  "Cabbage Boy": CabbageBoy,
  "Cabbage Girl": CabbageGirl,
  "Peeled Potato": PeeledPotato,
  "Wood Nymph Wendy": WoodNymphWendy,
  "Freya Fox": FreyaFox,

  // Moles
  "Rocky the Mole": RockyTheMole,
  "Tunnel Mole": TunnelMole,
  Nugget,

  "Sunflower Rock": SunflowerRock,
  "Sunflower Statue": SunflowerStatue,
  "Sunflower Tombstone": SunflowerTombstone,
  "Wicker Man": WickerMan,
  Fountain,
  Gnome,

  // Scarecrows
  Nancy,
  Scarecrow,
  Kuebiko,

  // AoE
  "Basic Scarecrow": BasicScarecrow,
  "Emerald Turtle": EmeraldTurtle,
  "Tin Turtle": TinTurtle,
  Bale: Bale,
  "Scary Mike": ScaryMike,
  "Laurie the Chuckle Crow": LaurieTheChuckleCrow,
  "Queen Cornelia": QueenCornelia,

  "Carrot Sword": CarrotSword,

  // Flags
  ...flags,

  //Decorations
  "White Tulips": WhiteTulips,
  "Potted Sunflower": PottedSunflower,
  "Potted Pumpkin": PottedPumpkin,
  Cactus,
  "Basic Bear": BasicBear,
  "Chef Bear": ChefBear,
  "Construction Bear": ConstructionBear,
  "Angel Bear": AngelBear,
  "Badass Bear": BadassBear,
  "Bear Trap": BearTrap,
  "Beta Bear": BetaBear,
  "Brilliant Bear": BrilliantBear,
  "Classy Bear": ClassyBear,
  "Farmer Bear": FarmerBear,
  "Rich Bear": RichBear,
  "Sunflower Bear": SunflowerBear,
  "Christmas Bear": ChristmasBear,
  "Rainbow Artist Bear": RainbowArtistBear,
  "Victoria Sisters": VictoriaSisters,
  "Devil Bear": DevilBear,
  "Valentine Bear": ValentineBear,
  "Easter Bear": EasterBear,
  "Easter Bush": EasterBush,
  "Giant Carrot": GiantCarrot,
  Observatory,
  "Luminous Lantern": LuminousLantern,
  "Aurora Lantern": AuroraLantern,
  "Radiance Lantern": RadianceLantern,
  "Ocean Lantern": OceanLantern,
  "Solar Lantern": SolarLantern,
  Wagon: Wagon,

  "Magic Bean": Bean,

  "Egg Basket": () => null,

  // TODO
  "Potted Potato": PottedPotato,
  "Potent Potato": PotentPotato,
  "Radical Radish": RadicalRadish,
  "Stellar Sunflower": StellarSunflower,
  "Christmas Snow Globe": SnowGlobe,
  "Immortal Pear": ImmortalPear,
  "Lady Bug": LadyBug,
  "Squirrel Monkey": SquirrelMonkey,
  "Black Bearry": BlackBearry,
  "Ayam Cemani": AyamCemani,
  "El Pollo Veloz": ElPolloVeloz,
  "Collectible Bear": CollectibleBear,
  "Cyborg Bear": CyborgBear,
  "Maneki Neko": ManekiNeko,
  "Pablo The Bunny": PabloBunny,

  // Treasure
  "Abandoned Bear": AbandonedBear,
  "Tiki Totem": TikiTotem,
  "Lunar Calendar": LunarCalendar,
  "Goblin Bear": GoblinBear,
  "Turtle Bear": TurtleBear,
  "T-Rex Skull": TRexSkull,
  "Lifeguard Bear": LifeguardBear,
  "Snorkel Bear": SnorkelBear,
  "Whale Bear": WhaleBear,
  "Parasaur Skull": ParasaurSkull,
  "Golden Bear Head": GoldenBearHead,
  "Human Bear": HumanBear,
  "Pirate Bear": PirateBear,
  "Sunflower Coin": SunflowerCoin,
  Galleon: Galleon,
  "Skeleton King Staff": SkeletonKingStaff,
  Foliant: Foliant,
  "Dinosaur Bone": DinosaurBone,
  "Treasure Map": TreasureMap,
  "Heart of Davy Jones": HeartOfDavyJones,
  "Heart Balloons": HeartBalloons,
  Flamingo: Flamingo,
  "Blossom Tree": BlossomTree,
  "Iron Idol": IronIdol,

  // Solar Flare Items
  "Beach Ball": BeachBall,
  "Palm Tree": PalmTree,
  Karkinos: Karkinos,
  "Witches' Eve Banner": WitchesEveBanner,
  "Dawn Breaker Banner": DawnBreakerBanner,
  "Solar Flare Banner": SolarFlareBanner,
  "Human War Banner": HumanBanner,
  "Goblin War Banner": GoblinBanner,
  "Catch the Kraken Banner": CatchTheKrakenBanner,
  "Spring Blossom Banner": SpringBlossomBanner,
  "Clash of Factions Banner": ClashOfFactionsBanner,
  "Lifetime Farmer Banner": LifetimeFarmerBanner,
  "Pharaoh's Treasure Banner": PharaohsTreasureBanner,
  "Bull Run Banner": BullRunBanner,

  "Bonnie's Tombstone": BonniesTombstone,
  "Chestnut Fungi Stool": ChestnutFungiStool,
  "Crimson Cap": CrimsonCap,
  "Dawn Umbrella Seat": DawnUmbreallSeat,
  "Eggplant Grill": EggplantGrill,
  "Giant Dawn Mushroom": GiantDawnMushroom,
  "Grubnash's Tombstone": GrubnashTombstone,
  "Mahogany Cap": MahoganyCap,
  "Shroom Glow": ShroomGlow,
  "Toadstool Seat": ToadstoolSeat,
  Clementine: Clementine,
  Cobalt: Cobalt,
  Blossombeard: Blossombeard,
  "Desert Gnome": DesertGnome,

  // Dawn Breaker items
  "Mushroom House": MushroomHouse,
  "Purple Trail": PurpleTrail,
  Obie: Obie,
  Maximus: Maximus,
  "Genie Lamp": GenieLamp,
  Hoot: Hoot,
  "Genie Bear": GenieBear,
  "Sir Goldensnout": SirGoldenSnout,
  "Betty Lantern": BettyLantern,
  "Bumpkin Lantern": BumpkinLantern,
  "Eggplant Bear": EggplantBear,
  "Goblin Lantern": GoblinLantern,
  "Dawn Flower": DawnFlower,

  // Witches' Eve Items
  Poppy: Poppy,
  "Grain Grinder": GrainGrinder,
  Kernaldo: Kernaldo,
  "Spooky Tree": SpookyTree,
  Candles: Candles,
  "Haunted Stump": HauntedStump,
  Observer: Observer,
  "Crow Rock": CrowRock,
  "Mini Corn Maze": MiniCornMaze,

  "Giant Cabbage": GiantCabbage,
  "Giant Potato": GiantPotato,
  "Giant Pumpkin": GiantPumpkin,
  "Lab Grown Carrot": LabGrownCarrot,
  "Lab Grown Pumpkin": LabGrownPumpkin,
  "Lab Grown Radish": LabGrownRadish,

  "Town Sign": Sign,
  "White Crow": WhiteCrow,
  Bud: Bud,
  "Twilight Anglerfish": TwilightAnglerfish,
  "Starlight Tuna": StarlightTuna,
  "Radiant Ray": RadiantRay,
  "Phantom Barracuda": PhantomBarracuda,
  "Gilded Swordfish": GildedSwordfish,
  "Crimson Carp": CrimsonCarp,
  "Battle Fish": BattleFish,
  "Lemon Shark": LemonShark,
  "Longhorn Cowfish": LonghornCowfish,

  "Kraken Tentacle": KrakenTentacle,

  // Catch the Kraken
  "Lifeguard Ring": LifeguardRing,
  Surfboard: Surfboard,
  "Hideaway Herman": HideawayHerman,
  "Shifty Sheldon": ShiftySheldon,
  "Tiki Torch": TikiTorch,
  "Beach Umbrella": BeachUmbrella,
  Walrus: Walrus,
  Alba: Alba,
  "Knowledge Crab": KnowledgeCrab,
  Anchor: Anchor,
  "Rubber Ducky": RubberDucky,
  "Kraken Head": KrakenHead,
  "Banana Chicken": BananaChicken,
  "Skill Shrimpy": SkillShrimpy,
  "Soil Krabby": SoilKrabby,
  Nana: Nana,
  "Crim Peckster": CrimPeckster,
  "Knight Chicken": KnightChicken,
  "Pharaoh Chicken": PharaohChicken,

  "Bumpkin Nutcracker": Nutcracker,
  "Festive Tree": FestiveTree,

  // Spring Blossom
  "Humming Bird": HummingBird,
  "Queen Bee": QueenBee,
  "Flower Fox": FlowerFox,
  "Hungry Caterpillar": HungryCaterpillar,
  "Sunrise Bloom Rug": SunriseBloomRug,
  "Blossom Royale": BlossomRoyale,
  Rainbow: Rainbow,
  "Enchanted Rose": EnchantedRose,
  "Flower Cart": FlowerCart,
  Capybara: Capybara,
  "Flower Rug": FlowerRug,
  "Tea Rug": TeaRug,
  "Green Field Rug": GreenFieldRug,
  // Flowers
  "Prism Petal": PrismPetal,
  "Celestial Frostbloom": CelestialFrostbloom,
  "Primula Enigma": PrimulaEnigma,

  "Sunflorian Faction Banner": SunflorianFactionBanner,
  "Goblin Faction Banner": GoblinFactionBanner,
  "Nightshade Faction Banner": NightshadeFactionBanner,
  "Bumpkin Faction Banner": BumpkinFactionBanner,

  // Clash of Factions
  "Turbo Sprout": TurboSprout,
  Soybliss: Soybliss,
  "Grape Granny": GrapeGranny,
  "Royal Throne": RoyalThrone,
  "Lily Egg": LilyEgg,
  Goblet: Goblet,
  "Fancy Rug": FancyRug,
  Clock: Clock,
  Vinny: Vinny,
  "Battlecry Drum": BattlecryDrum,
  "Bullseye Board": BullseyeBoard,
  "Chess Rug": ChessRug,
  "Golden Gallant": GoldenGallant,
  "Golden Garrison": GoldenGarrison,
  "Golden Guardian": GoldenGuardian,
  "Novice Knight": NoviceKnight,
  "Regular Pawn": RegularPawn,
  "Rookie Rook": RookieRook,
  "Silver Sentinel": SilverSentinel,
  "Silver Squire": SilverSquire,
  "Silver Stallion": SilverStallion,
  "Trainee Target": TraineeTarget,
  "Twister Rug": TwisterRug,
  Cluckapult: Cluckapult,
  "Rice Panda": RicePanda,
  "Sunflorian Throne": SunflorianThrone,
  "Nightshade Throne": NightshadeThrone,
  "Goblin Throne": GoblinThrone,
  "Bumpkin Throne": BumpkinThrone,
  "Golden Sunflorian Egg": GoldenSunflorianEgg,
  "Goblin Mischief Egg": GoblinMischiefEgg,
  "Bumpkin Charm Egg": BumpkinCharmEgg,
  "Nightshade Veil Egg": NightshadeVeilEgg,
  "Emerald Goblin Goblet": EmeraldGoblinGoblet,
  "Opal Sunflorian Goblet": OpalSunflorianGoblet,
  "Sapphire Bumpkin Goblet": SapphireBumpkinGoblet,
  "Amethyst Nightshade Goblet": AmethystNightshadeGoblet,
  "Golden Faction Goblet": GoldenFactionGoblet,
  "Ruby Faction Goblet": RubyFactionGoblet,
  "Sunflorian Bunting": SunflorianBunting,
  "Nightshade Bunting": NightshadeBunting,
  "Goblin Bunting": GoblinBunting,
  "Bumpkin Bunting": BumpkinBunting,
  "Sunflorian Candles": SunflorianCandles,
  "Nightshade Candles": NightshadeCandles,
  "Goblin Candles": GoblinCandles,
  "Bumpkin Candles": BumpkinCandles,
  "Sunflorian Left Wall Sconce": SunflorianLeftWallSconce,
  "Nightshade Left Wall Sconce": NightshadeLeftWallSconce,
  "Goblin Left Wall Sconce": GoblinLeftWallSconce,
  "Bumpkin Left Wall Sconce": BumpkinLeftWallSconce,
  "Sunflorian Right Wall Sconce": SunflorianRightWallSconce,
  "Nightshade Right Wall Sconce": NightshadeRightWallSconce,
  "Goblin Right Wall Sconce": GoblinRightWallSconce,
  "Bumpkin Right Wall Sconce": BumpkinRightWallSconce,
  "Gourmet Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Gourmet Hourglass" {...props} />
  ),
  "Harvest Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Harvest Hourglass" {...props} />
  ),
  "Timber Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Timber Hourglass" {...props} />
  ),
  "Orchard Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Orchard Hourglass" {...props} />
  ),
  "Blossom Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Blossom Hourglass" {...props} />
  ),
  "Fisher's Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Fisher's Hourglass" {...props} />
  ),
  "Ore Hourglass": (props: CollectibleProps) => (
    <Hourglass hourglass="Ore Hourglass" {...props} />
  ),
  "Sunflorian Faction Rug": SunflorianFactionRug,
  "Nightshade Faction Rug": NightshadeFactionRug,
  "Goblin Faction Rug": GoblinFactionRug,
  "Bumpkin Faction Rug": BumpkinFactionRug,
  "Desert Rose": DesertRose,
  "Alien Chicken": AlienChicken,
  "Toxic Tuft": ToxicTuft,
  Mootant: Mootant,
  Chicory: Chicory,
  "Adrift Ark": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 29}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 29}px`,
      }}
      image={ITEM_DETAILS["Adrift Ark"].image}
      alt="Adrift Ark"
    />
  ),
  Castellan: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      image={ITEM_DETAILS.Castellan.image}
      alt="Castellan"
    />
  ),
  "Sunlit Citadel": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      image={ITEM_DETAILS["Sunlit Citadel"].image}
      alt="Sunlit Citadel"
    />
  ),
  "Pharaoh Gnome": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 11}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 2.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 11}px`,
      }}
      image={ITEM_DETAILS["Pharaoh Gnome"].image}
      alt="Pharaoh Gnome"
    />
  ),
  "Lemon Tea Bath": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 38}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 38}px`,
      }}
      image={ITEM_DETAILS["Lemon Tea Bath"].image}
      alt="Lemon Tea Bath"
    />
  ),
  "Tomato Clown": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      image={ITEM_DETAILS["Tomato Clown"].image}
      alt="Tomato Clown"
    />
  ),
  Pyramid: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 30}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 30}px`,
      }}
      image={ITEM_DETAILS.Pyramid.image}
      alt="Pyramid"
    />
  ),
  Sarcophagus: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Sarcophagus"].image}
      alt="Sarcophagus"
    />
  ),
  "Hapy Jar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Hapy Jar"].image}
      alt="Hapy Jar"
    />
  ),
  "Imsety Jar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Imsety Jar"].image}
      alt="Imsety Jar"
    />
  ),
  "Duamutef Jar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 14}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 14}px`,
      }}
      image={ITEM_DETAILS["Duamutef Jar"].image}
      alt="Duamutef Jar"
    />
  ),
  "Qebehsenuef Jar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Qebehsenuef Jar"].image}
      alt="Qebehsenuef Jar"
    />
  ),
  "Snake in Jar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Snake in Jar"].image}
      alt="Snake in Jar"
    />
  ),
  "Anubis Jackal": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2.25}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      image={ITEM_DETAILS["Anubis Jackal"].image}
      alt="Anubis Jackal"
    />
  ),
  Oasis: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 48}px`,
      }}
      image={ITEM_DETAILS.Oasis.image}
      alt="Oasis"
    />
  ),
  Cannonball: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS.Cannonball.image}
      alt="Baobab Tree"
    />
  ),
  "Baobab Tree": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 51}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 51}px`,
      }}
      image={ITEM_DETAILS["Baobab Tree"].image}
      alt="Baobab Tree"
    />
  ),
  "Tomato Bombard": TomatoBombard,
  Camel: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 33}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 33}px`,
      }}
      image={ITEM_DETAILS["Camel"].image}
      alt="Camel"
    />
  ),

  "Cactus King": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      image={ITEM_DETAILS["Cactus King"].image}
      alt="Cactus King"
    />
  ),
  "Reveling Lemon": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 23}px`,
      }}
      image={ITEM_DETAILS["Reveling Lemon"].image}
      alt="Reveling Lemon"
    />
  ),
  "Paper Reed": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 22}px`,
      }}
      image={ITEM_DETAILS["Paper Reed"].image}
      alt="Paper Reed"
    />
  ),
  "Clay Tablet": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Clay Tablet"].image}
      alt="Clay Tablet"
    />
  ),
  "Stone Beetle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Stone Beetle"].image}
      alt="Stone Beetle"
    />
  ),
  "Iron Beetle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Iron Beetle"].image}
      alt="Iron Beetle"
    />
  ),
  "Gold Beetle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 15}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 15}px`,
      }}
      image={ITEM_DETAILS["Gold Beetle"].image}
      alt="Gold Beetle"
    />
  ),
  "Fairy Circle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -1.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Fairy Circle"].image}
      alt="Fairy Circle"
    />
  ),
  Squirrel: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      image={ITEM_DETAILS.Squirrel.image}
      alt="Squirrel"
    />
  ),
  Macaw: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 14}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 14}px`,
      }}
      image={ITEM_DETAILS.Macaw.image}
      alt="Macaw"
    />
  ),
  Butterfly: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 13}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 2.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 13}px`,
      }}
      image={ITEM_DETAILS.Butterfly.image}
      alt="Butterfly"
    />
  ),

  // To Update
  Sundial: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      image={ITEM_DETAILS.Sundial.image}
      alt="Sundial"
    />
  ),
  "Sand Golem": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 28}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      image={ITEM_DETAILS["Sand Golem"].image}
      alt="Sand Golem"
    />
  ),
  "Lemon Frog": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      image={ITEM_DETAILS["Lemon Frog"].image}
      alt="Lemon Frog"
    />
  ),
  "Scarab Beetle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      image={ITEM_DETAILS["Scarab Beetle"].image}
      alt="Scarab Beetle"
    />
  ),
  "Basic Bed": (props: CollectibleProps) => <Bed name="Basic Bed" />,
  "Sturdy Bed": (props: CollectibleProps) => <Bed name="Sturdy Bed" />,
  "Floral Bed": (props: CollectibleProps) => <Bed name="Floral Bed" />,
  "Fisher Bed": (props: CollectibleProps) => <Bed name="Fisher Bed" />,
  "Pirate Bed": (props: CollectibleProps) => <Bed name="Pirate Bed" />,
  "Cow Bed": (props: CollectibleProps) => <Bed name="Cow Bed" />,
  "Desert Bed": (props: CollectibleProps) => <Bed name="Desert Bed" />,
  "Royal Bed": (props: CollectibleProps) => <Bed name="Royal Bed" />,
  "Cow Scratcher": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 17}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 17}px`,
      }}
      image={ITEM_DETAILS["Cow Scratcher"].image}
      alt="Cow Scratcher"
    />
  ),
  "Spinning Wheel": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 30}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 30}px`,
      }}
      image={ITEM_DETAILS["Spinning Wheel"].image}
      alt="Spinning Wheel"
    />
  ),
  "Sleepy Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 48}px`,
      }}
      image={ITEM_DETAILS["Sleepy Rug"].image}
      alt="Sleepy Rug"
    />
  ),
  Meteorite: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 33}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 33}px`,
      }}
      image={ITEM_DETAILS["Meteorite"].image}
      alt="Meteorite"
    />
  ),
  "Sheaf of Plenty": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 22}px`,
      }}
      image={ITEM_DETAILS["Sheaf of Plenty"].image}
      alt="Sheaf of Plenty"
    />
  ),
  "Mechanical Bull": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Mechanical Bull"].image}
      alt="Mechanical Bull"
    />
  ),
  "Moo-ver": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 36}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 36}px`,
      }}
      image={ITEM_DETAILS["Moo-ver"].image}
      alt="Moo-ver"
    />
  ),
  "Swiss Whiskers": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 21}px`,
      }}
      image={ITEM_DETAILS["Swiss Whiskers"].image}
      alt="Swiss Whiskers"
    />
  ),
  Cluckulator: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 21}px`,
      }}
      image={ITEM_DETAILS["Cluckulator"].image}
      alt="Cluckulator"
    />
  ),
  UFO: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 36}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 36}px`,
      }}
      image={ITEM_DETAILS["UFO"].image}
      alt="UFO"
    />
  ),
  "Black Sheep": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 25}px`,
      }}
      image={ITEM_DETAILS["Black Sheep"].image}
      alt="UFO"
    />
  ),
};
// Need readonly versions for some troublesome components while in design mode

export const READONLY_COLLECTIBLES: Record<
  CollectibleName | "Bud",
  React.FC<any>
> = {
  ...COLLECTIBLE_COMPONENTS,
  Observatory: () => (
    <img
      src={ITEM_DETAILS["Observatory"].image}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 31}px` }}
    />
  ),
  "Maneki Neko": () => (
    <img
      src={ITEM_DETAILS["Maneki Neko"].image}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 16}px` }}
    />
  ),

  "Basic Scarecrow": (props: CollectibleProps) => {
    const hasChonkyScarecrow = props.game.bumpkin.skills["Chonky Scarecrow"];
    const chonkyOffset = hasChonkyScarecrow ? 4 : 0;

    return (
      <div
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img src={ITEM_DETAILS["Basic Scarecrow"].image} className="w-full " />
        <div
          className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16 * (3 + chonkyOffset)}px`,
            height: `${PIXEL_SCALE * 16 * (3 + chonkyOffset)}px`,
            left: `${PIXEL_SCALE * -13 - (chonkyOffset / 2) * PIXEL_SCALE * 16}px`,
            top: `${PIXEL_SCALE * 31}px`,
          }}
        >
          <img
            src={lightning}
            className="absolute bottom-0 opacity-50 animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * 19 + (chonkyOffset / 2) * PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 17 + (chonkyOffset / 2) * PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      </div>
    );
  },

  "Scary Mike": (props: CollectibleProps) => {
    const hasHorrorMike = props.game.bumpkin.skills["Horror Mike"];
    const offset = hasHorrorMike ? 4 : 0;

    return (
      <div
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          right: `${PIXEL_SCALE * -3}px`,
        }}
      >
        <img src={ITEM_DETAILS["Scary Mike"].image} className="w-full" />
        <div
          className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16 * (3 + offset)}px`,
            height: `${PIXEL_SCALE * 16 * (3 + offset)}px`,
            left: `${PIXEL_SCALE * -13 - (offset / 2) * PIXEL_SCALE * 16}px`,
            top: `${PIXEL_SCALE * 29}px`,
          }}
        >
          <img
            src={lightning}
            className="absolute bottom-0 opacity-50 animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * 19 + (offset / 2) * PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 17 + (offset / 2) * PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      </div>
    );
  },

  "Laurie the Chuckle Crow": (props: CollectibleProps) => {
    const hasLauriesGains = props.game.bumpkin.skills["Laurie's Gains"];
    const offset = hasLauriesGains ? 4 : 0;

    return (
      <div
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          right: `${PIXEL_SCALE * -5}px`,
        }}
      >
        <img
          src={ITEM_DETAILS["Laurie the Chuckle Crow"].image}
          className="w-full"
        />
        <div
          className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16 * (3 + offset)}px`,
            height: `${PIXEL_SCALE * 16 * (3 + offset)}px`,
            left: `${PIXEL_SCALE * -13 - (offset / 2) * PIXEL_SCALE * 16}px`,
            top: `${PIXEL_SCALE * 27}px`,
          }}
        >
          <img
            src={lightning}
            className="absolute bottom-0 opacity-50 animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * 19 + (offset / 2) * PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 17 + (offset / 2) * PIXEL_SCALE * 16}px`,
            }}
          />
        </div>
      </div>
    );
  },
  "Queen Cornelia": () => (
    <div
      id="cornelia"
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 16}px` }}
    >
      <img src={ITEM_DETAILS["Queen Cornelia"].image} className="w-full" />
      <div
        className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16 * 3}px`,
          height: `${PIXEL_SCALE * 16 * 4}px`,
          left: `${PIXEL_SCALE * -16}px`,
          top: `${PIXEL_SCALE * -16}px`,
        }}
      >
        <img
          src={lightning}
          className="absolute bottom-0 opacity-50 animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 19}px`,
            top: `${PIXEL_SCALE * 24}px`,
          }}
        />
      </div>
    </div>
  ),
  "Emerald Turtle": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        top: `${PIXEL_SCALE * -5}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Emerald Turtle"].image}
        className="w-full"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      />
      <div
        className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16 * 3}px`,
          height: `${PIXEL_SCALE * 16 * 3}px`,
          left: `${PIXEL_SCALE * -13}px`,
          top: `${PIXEL_SCALE * -11}px`,
        }}
      >
        <img
          src={lightning}
          className="absolute bottom-0 opacity-50 animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 19}px`,
            top: `${PIXEL_SCALE * 17}px`,
          }}
        />
      </div>
    </div>
  ),
  "Sir Goldensnout": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 24}px`,
        top: `${PIXEL_SCALE * -5}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Sir Goldensnout"].image}
        className="w-full absolute"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
          left: `${PIXEL_SCALE * 7}px`,
        }}
      />
      <div
        className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16 * 4}px`,
          height: `${PIXEL_SCALE * 16 * 4}px`,
          left: `${PIXEL_SCALE * -13}px`,
          top: `${PIXEL_SCALE * -11}px`,
        }}
      >
        <img
          src={lightning}
          className="absolute bottom-0 opacity-50 animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 27}px`,
            top: `${PIXEL_SCALE * 24}px`,
          }}
        />
      </div>
    </div>
  ),
  "Tin Turtle": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 22}px`,
        top: `${PIXEL_SCALE * -4}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Tin Turtle"].image}
        className="w-full"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      />
      <div
        className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16 * 3}px`,
          height: `${PIXEL_SCALE * 16 * 3}px`,
          left: `${PIXEL_SCALE * -13}px`,
          top: `${PIXEL_SCALE * -12}px`,
        }}
      >
        <img
          src={lightning}
          className="absolute bottom-0 opacity-50 animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 19}px`,
            top: `${PIXEL_SCALE * 17}px`,
          }}
        />
      </div>
    </div>
  ),
  Bale: () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 28}px`,
        top: `${PIXEL_SCALE * -5}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Bale"].image}
        className=" absolute w-full"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
          left: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * 5}px`,
        }}
      />
      {!hasFeatureAccess(INITIAL_FARM, "BALE_AOE_END") && (
        <div
          className="absolute bottom-0 bg-blue-300 bg-opacity-50 animate-pulse z-50 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16 * 4}px`,
            height: `${PIXEL_SCALE * 16 * 4}px`,
            left: `${PIXEL_SCALE * -13}px`,
            top: `${PIXEL_SCALE * -11}px`,
          }}
        >
          <img
            src={lightning}
            className="absolute bottom-0 opacity-50 animate-pulsate"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * 27}px`,
              top: `${PIXEL_SCALE * 25}px`,
            }}
          />
        </div>
      )}
    </div>
  ),
  "Nyon Statue": () => (
    <img
      src={ITEM_DETAILS["Nyon Statue"].image}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 32}px` }}
    />
  ),
  "Rock Golem": () => (
    <img
      src={ITEM_DETAILS["Rock Golem"].image}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 34}px` }}
    />
  ),
  "Wicker Man": () => (
    <div
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 19}px` }}
    >
      <img src={ITEM_DETAILS["Wicker Man"].image} className="w-full" />
    </div>
  ),
  "Genie Lamp": () => (
    <div
      className="absolute"
      style={{ left: `${PIXEL_SCALE * 4}px`, width: `${PIXEL_SCALE * 22}px` }}
    >
      <img
        src={ITEM_DETAILS["Genie Lamp"].image}
        className="absolute w-full cursor-pointer hover:img-highlight"
        alt="Genie Lamp"
      />
    </div>
  ),
};
