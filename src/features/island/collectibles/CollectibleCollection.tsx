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
import { PIXEL_SCALE } from "features/game/lib/constants";
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
import { SuperStar } from "./components/SuperStar";
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
import { Chicory } from "./components/Chicory";
import { LonghornCowfish } from "./components/LonghornCownfish";
import { AlienChicken } from "./components/AlienChicken";
import { ToxicTuft } from "./components/ToxicTuft";
import { Mootant } from "./components/Mootants";
import { SuperTotem } from "./components/SuperTotem";
import { GoldenCow } from "./components/GoldenCow";
import { VolcanoGnome } from "./components/VolcanoGnome";
import { WindsOfChangeBanner } from "./components/WindsOfChangeBanner";
import { FrozenCow } from "./components/FrozenCow";
import { FrozenSheep } from "./components/FrozenSheep";
import { SummerChicken } from "./components/SummerChicken";
import { Jellyfish } from "./components/Jellyfish";
import { Chamomile } from "./components/Chamomile";
import { BlackSheep } from "./components/BlackSheep";
import { GoldenFence } from "./components/GoldenFence";
import { GoldenStoneFence } from "./components/GoldenStoneFence";
import { Tiles } from "./components/Tiles";
import { GreatBloomBanner } from "./components/GreatBloomBanner";
import { LoveChicken } from "./components/LoveChicken";
import { DrCow } from "./components/DrCow";
import { NurseSheep } from "./components/NurseSheep";
import { PinkDolphin } from "./components/PinkDolphin";
import { Lunalist } from "./components/Lunalist";
import { Monument } from "./components/Monument";
import { BabyCow } from "./components/BabyCow";
import { BabySheep } from "./components/BabySheep";
import { JanitorChicken } from "./components/JanitorChicken";
import { VenusBumpkinTrap } from "./components/VenusBumpkinTrap";
import { BlackHoleFlower } from "./components/BlackHoleFlower";
import { SleepyChicken } from "./components/SleepyChicken";
import { AstronautCow } from "./components/AstronautCow";
import { AstronautSheep } from "./components/AstronautSheep";
import { MermaidCow } from "./components/MermaidCow";
import { MermaidSheep } from "./components/MermaidSheep";
import { SquidChicken } from "./components/SquidChicken";
import { AnemoneFlower } from "./components/AnemoneFlower";
import { Poseidon } from "./components/Poseidon";
import { Project } from "./components/Project";
import { PetShrine } from "./components/PetShrine";
import { ObsidianShrine } from "./components/ObsidianShrine";
import { Pet } from "../pets/Pet";
import { PetName, PET_TYPES } from "features/game/types/pets";
import { PetNFT } from "./components/petNFT/PetNFT";
import { Isopod } from "./components/Isopod";
import { Nautilus } from "./components/Nautilus";
import { Dollocaris } from "./components/Dollocaris";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { BedName } from "features/game/types/game";

export const COLLECTIBLE_COMPONENTS: Record<
  CollectibleName | "Bud" | "PetNFT",
  React.FC<CollectibleProps>
> = {
  ...getKeys(DECORATION_TEMPLATES).reduce(
    (previous, name) => ({
      ...previous,
      [name]: () => <TemplateCollectible name={name} />,
    }),
    {} as Record<TemplateDecorationName, React.FC<CollectibleProps>>,
  ),

  ...getKeys(PET_TYPES).reduce<Record<PetName, React.FC<CollectibleProps>>>(
    (previous, name) => ({
      ...previous,
      [name]: () => <Pet name={name} />,
    }),
    {} as Record<PetName, React.FC<CollectibleProps>>,
  ),

  "Baby Cow": BabyCow,
  "Baby Sheep": BabySheep,
  "Janitor Chicken": JanitorChicken,
  "Venus Bumpkin Trap": VenusBumpkinTrap,
  "Black Hole Flower": BlackHoleFlower,
  "Sleepy Chicken": SleepyChicken,
  "Astronaut Cow": AstronautCow,
  "Astronaut Sheep": AstronautSheep,
  "Mermaid Cow": MermaidCow,
  "Mermaid Sheep": MermaidSheep,
  "Squid Chicken": SquidChicken,
  "Anemone Flower": AnemoneFlower,
  "Love Chicken": LoveChicken,
  "Dr Cow": DrCow,
  "Nurse Sheep": NurseSheep,
  "Pink Dolphin": PinkDolphin,
  Lunalist: Lunalist,
  "Frozen Cow": FrozenCow,
  "Frozen Sheep": FrozenSheep,
  "Summer Chicken": SummerChicken,
  Jellyfish: Jellyfish,
  Chamomile: Chamomile,
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
  "Fox Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Fox Shrine" />
  ),
  "Sparrow Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Sparrow Shrine" />
  ),
  "Toucan Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Toucan Shrine" />
  ),
  "Collie Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Collie Shrine" />
  ),
  "Badger Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Badger Shrine" />
  ),
  "Boar Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Boar Shrine" />
  ),
  "Hound Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Hound Shrine" />
  ),
  "Stag Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Stag Shrine" />
  ),
  "Legendary Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Legendary Shrine" />
  ),
  "Obsidian Shrine": ObsidianShrine,
  "Mole Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Mole Shrine" />
  ),
  "Bear Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Bear Shrine" />
  ),
  "Tortoise Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Tortoise Shrine" />
  ),
  "Moth Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Moth Shrine" />
  ),
  "Bantam Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Bantam Shrine" />
  ),
  "Trading Shrine": (props: CollectibleProps) => (
    <PetShrine {...props} name="Trading Shrine" />
  ),

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
  "Winds of Change Banner": WindsOfChangeBanner,
  "Great Bloom Banner": GreatBloomBanner,

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
  "Volcano Gnome": VolcanoGnome,
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
  PetNFT: PetNFT,
  "Twilight Anglerfish": TwilightAnglerfish,
  "Starlight Tuna": StarlightTuna,
  "Radiant Ray": RadiantRay,
  "Phantom Barracuda": PhantomBarracuda,
  "Gilded Swordfish": GildedSwordfish,
  "Super Star": SuperStar,
  "Giant Isopod": Isopod,
  Nautilus: Nautilus,
  Dollocaris: Dollocaris,
  "Crimson Carp": CrimsonCarp,
  "Battle Fish": BattleFish,
  "Lemon Shark": LemonShark,
  "Longhorn Cowfish": LonghornCowfish,
  Poseidon: Poseidon,

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
  "Speckled Kissing Fish": () => (
    <TemplateCollectible name="Speckled Kissing Fish" />
  ),
  "Dark Eyed Kissing Fish": () => (
    <TemplateCollectible name="Dark Eyed Kissing Fish" />
  ),
  "Fisherman's Boat": () => <TemplateCollectible name="Fisherman's Boat" />,
  "Sea Arch": () => <TemplateCollectible name="Sea Arch" />,
  "Crabs and Fish Rug": () => <TemplateCollectible name="Crabs and Fish Rug" />,
  "Fish Flags": () => <TemplateCollectible name="Fish Flags" />,
  "Fish Drying Rack": () => <TemplateCollectible name="Fish Drying Rack" />,
  "Yellow Submarine Trophy": () => (
    <TemplateCollectible name="Yellow Submarine Trophy" />
  ),
  Oaken: () => <TemplateCollectible name="Oaken" />,
  Meerkat: () => <TemplateCollectible name="Meerkat" />,
  "Crimstone Clam": () => <TemplateCollectible name="Crimstone Clam" />,
  "Poseidon's Throne": (props: CollectibleProps) => (
    <Monument
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 49}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 49}px`,
      }}
      alt="Poseidon's Throne"
      project="Poseidon's Throne"
    />
  ),
  "Fish Kite": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Fish Kite"].image}
      alt="Fish Kite"
    />
  ),
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
  "Golden Cow": GoldenCow,
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
  "Crop Circle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 39}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 39}px`,
      }}
      image={ITEM_DETAILS["Crop Circle"].image}
      alt="Crop Circle"
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
  "Black Sheep": BlackSheep,
  "Halloween Scarecrow": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Halloween Scarecrow"].image}
      alt="Halloween Scarecrow"
    />
  ),
  "Vampire Bear": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Vampire Bear"].image}
      alt="Vampire Bear"
    />
  ),
  "Super Totem": SuperTotem,
  "Christmas Stocking": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 10}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 10}px`,
      }}
      image={ITEM_DETAILS["Christmas Stocking"].image}
      alt="Christmas Stocking"
    />
  ),
  "Golden Christmas Stocking": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 10}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 10}px`,
      }}
      image={ITEM_DETAILS["Golden Christmas Stocking"].image}
      alt="Golden Christmas Stocking"
    />
  ),
  "Cozy Fireplace": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Cozy Fireplace"].image}
      alt="Cozy Fireplace"
    />
  ),
  "Christmas Rug": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Christmas Rug"].image}
      alt="Christmas Rug"
    />
  ),
  "Christmas Candle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 13}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 13}px`,
      }}
      image={ITEM_DETAILS["Christmas Candle"].image}
      alt="Christmas Candle"
    />
  ),
  "Santa Penguin": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Santa Penguin"].image}
      alt="Santa Penguin"
    />
  ),
  "Penguin Pool": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Penguin Pool"].image}
      alt="Penguin Pool"
    />
  ),
  Snowman: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Snowman"].image}
      alt="Snowman"
    />
  ),
  "Festive Toy Train": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Festive Toy Train"].image}
      alt="Festive Toy Train"
    />
  ),
  Kite: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Kite"].image}
      alt="Kite"
    />
  ),
  "Acorn House": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 33}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 33}px`,
      }}
      image={ITEM_DETAILS["Acorn House"].image}
      alt="Acorn House"
    />
  ),
  "Spring Duckling": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 8}px`,
      }}
      image={ITEM_DETAILS["Spring Duckling"].image}
      alt="Spring Duckling"
    />
  ),
  Igloo: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Igloo"].image}
      alt="Igloo"
    />
  ),
  "Ugly Duckling": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Ugly Duckling"].image}
      alt="Ugly Duckling"
    />
  ),
  "Lake Rug": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Lake Rug"].image}
      alt="Lake Rug"
    />
  ),
  Hammock: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 54}px`,
        bottom: `${PIXEL_SCALE * -3}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 54}px`,
      }}
      image={ITEM_DETAILS["Hammock"].image}
      alt="Hammock"
    />
  ),
  Mammoth: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 49}px`,
        bottom: `${PIXEL_SCALE * -4}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 49}px`,
      }}
      image={ITEM_DETAILS["Mammoth"].image}
      alt="Mammoth"
    />
  ),
  "Cup of Chocolate": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Cup of Chocolate"].image}
      alt="Cup of Chocolate"
    />
  ),
  "Golden Sheep": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Golden Sheep"].image}
      alt="Golden Sheep"
    />
  ),
  "Barn Blueprint": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Barn Blueprint"].image}
      alt="Barn Blueprint"
    />
  ),
  "Mama Duck": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Mama Duck"].image}
      alt="Mama Duck"
    />
  ),
  "Summer Duckling": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 8}px`,
      }}
      image={ITEM_DETAILS["Summer Duckling"].image}
      alt="Summer Duckling"
    />
  ),
  "Autumn Duckling": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 8}px`,
      }}
      image={ITEM_DETAILS["Autumn Duckling"].image}
      alt="Autumn Duckling"
    />
  ),
  "Winter Duckling": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 8}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 8}px`,
      }}
      image={ITEM_DETAILS["Winter Duckling"].image}
      alt="Winter Duckling"
    />
  ),
  Jin: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 30}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 30}px`,
      }}
      image={ITEM_DETAILS["Jin"].image}
      alt="Jin"
    />
  ),
  "Floral Arch": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 44}px`,
        bottom: `${PIXEL_SCALE * -4}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 44}px`,
      }}
      image={ITEM_DETAILS["Floral Arch"].image}
      alt="Floral Arch"
    />
  ),
  "Flower Coin": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 34}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      image={ITEM_DETAILS["Flower Coin"].image}
      alt="Flower Coin"
    />
  ),
  "Flower Statue": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Flower Statue"].image}
      alt="Flower Statue"
    />
  ),
  "Heartstruck Tree": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 31}px`,
      }}
      image={ITEM_DETAILS["Heartstruck Tree"].image}
      alt="Heartstruck Tree"
    />
  ),
  "Mermaid Fountain": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 36}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 36}px`,
      }}
      image={ITEM_DETAILS["Mermaid Fountain"].image}
      alt="Mermaid Fountain"
    />
  ),
  "Mysterious Entrance": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 54}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 54}px`,
      }}
      image={ITEM_DETAILS["Mysterious Entrance"].image}
      alt="Mysterious Entrance"
    />
  ),
  "Streamer's Statue": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Streamer's Statue"].image}
      alt="Streamer's Statue"
    />
  ),
  Cetus: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 50}px`,
        bottom: `${PIXEL_SCALE * -1}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 50}px`,
      }}
      image={ITEM_DETAILS["Cetus"].image}
      alt="Cetus"
    />
  ),
  "Goldcrest Mosaic Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Goldcrest Mosaic Rug"].image}
      alt="Goldcrest Mosaic Rug"
    />
  ),
  "Sandy Mosaic Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Sandy Mosaic Rug"].image}
      alt="Sandy Mosaic Rug"
    />
  ),
  "Twilight Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Twilight Rug"].image}
      alt="Twilight Rug"
    />
  ),
  "Orchard Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Orchard Rug"].image}
      alt="Orchard Rug"
    />
  ),
  "Carrot Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Carrot Rug"].image}
      alt="Carrot Rug"
    />
  ),
  "Beetroot Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Beetroot Rug"].image}
      alt="Beetroot Rug"
    />
  ),
  "Harlequin Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Harlequin Rug"].image}
      alt="Harlequin Rug"
    />
  ),
  "Large Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Large Rug"].image}
      alt="Large Rug"
    />
  ),
  "Golden Fence": GoldenFence,
  "Golden Stone Fence": GoldenStoneFence,
  "Golden Pine Tree": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Golden Pine Tree"].image}
      alt="Golden Pine Tree"
    />
  ),
  "Golden Tree": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      image={ITEM_DETAILS["Golden Tree"].image}
      alt="Golden Tree"
    />
  ),
  "Golden Bush": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Golden Bush"].image}
      alt="Golden Bush"
    />
  ),
  "Black Tile": (props: CollectibleProps) => (
    <Tiles {...props} name="Black Tile" />
  ),
  "Blue Tile": (props: CollectibleProps) => (
    <Tiles {...props} name="Blue Tile" />
  ),
  "Green Tile": (props: CollectibleProps) => (
    <Tiles {...props} name="Green Tile" />
  ),
  "Purple Tile": (props: CollectibleProps) => (
    <Tiles {...props} name="Purple Tile" />
  ),
  "Red Tile": (props: CollectibleProps) => <Tiles {...props} name="Red Tile" />,
  "Yellow Tile": (props: CollectibleProps) => (
    <Tiles {...props} name="Yellow Tile" />
  ),
  "Carrot House": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Carrot House"].image}
      alt="Carrot House"
    />
  ),
  "Orange Bunny Lantern": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Orange Bunny Lantern"].image}
      alt="Orange Bunny Lantern"
    />
  ),
  "White Bunny Lantern": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["White Bunny Lantern"].image}
      alt="White Bunny Lantern"
    />
  ),
  "Orange Tunnel Bunny": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Orange Tunnel Bunny"].image}
      alt="Orange Tunnel Bunny"
    />
  ),
  "White Tunnel Bunny": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["White Tunnel Bunny"].image}
      alt="White Tunnel Bunny"
    />
  ),
  "Easter Basket": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Easter Basket"].image}
      alt="Easter Basket"
    />
  ),
  Quarry: (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Quarry"].image}
      alt="Quarry"
    />
  ),
  "Obsidian Turtle": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * -3}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 22}px`,
      }}
      image={ITEM_DETAILS["Obsidian Turtle"].image}
      alt="Obsidian Turtle"
    />
  ),
  "Winter Guardian": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Winter Guardian"].image}
      alt="Winter Guardian"
    />
  ),
  "Summer Guardian": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Summer Guardian"].image}
      alt="Summer Guardian"
    />
  ),
  "Spring Guardian": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Spring Guardian"].image}
      alt="Spring Guardian"
    />
  ),
  "Autumn Guardian": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 35}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 35}px`,
      }}
      image={ITEM_DETAILS["Autumn Guardian"].image}
      alt="Autumn Guardian"
    />
  ),
  "Sky Pillar": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 23}px`,
      }}
      image={ITEM_DETAILS["Sky Pillar"].image}
      alt="Sky Pillar"
    />
  ),
  "Flower-Scribed Statue": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 39}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 39}px`,
      }}
      image={ITEM_DETAILS["Flower-Scribed Statue"].image}
      alt="Flower-Scribed Statue"
    />
  ),
  "Balloon Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 23}px`,
      }}
      image={ITEM_DETAILS["Balloon Rug"].image}
      alt="Balloon Rug"
    />
  ),
  "Giant Yam": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 22}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 22}px`,
      }}
      image={ITEM_DETAILS["Giant Yam"].image}
      alt="Giant Yam"
    />
  ),
  "Giant Orange": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Orange"].image}
      alt="Giant Orange"
    />
  ),
  "Giant Apple": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Apple"].image}
      alt="Giant Apple"
    />
  ),
  "Giant Banana": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Banana"].image}
      alt="Giant Banana"
    />
  ),
  "Heart Air Balloon": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -8}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Heart Air Balloon"].image}
      alt="Heart Air Balloon"
    />
  ),
  "Giant Zucchini": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 23}px`,
      }}
      image={ITEM_DETAILS["Giant Zucchini"].image}
      alt="Giant Zucchini"
    />
  ),
  "Mini Floating Island": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 26}px`,
      }}
      image={ITEM_DETAILS["Mini Floating Island"].image}
      alt="Mini Floating Island"
    />
  ),
  "Giant Kale": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Kale"].image}
      alt="Giant Kale"
    />
  ),
  "Paint Buckets": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Paint Buckets"].image}
      alt="Paint Buckets"
    />
  ),
  "Rainbow Well": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Rainbow Well"].image}
      alt="Rainbow Well"
    />
  ),
  "Floating Toy": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Floating Toy"].image}
      alt="Floating Toy"
    />
  ),
  "Rainbow Flower": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Rainbow Flower"].image}
      alt="Rainbow Flower"
    />
  ),
  "Pony Toy": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Pony Toy"].image}
      alt="Pony Toy"
    />
  ),
  "Red Slime Balloon": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Red Slime Balloon"].image}
      alt="Red Slime Balloon"
    />
  ),
  "Blue Slime Balloon": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Blue Slime Balloon"].image}
      alt="Blue Slime Balloon"
    />
  ),
  "Better Together Banner": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -0.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Better Together Banner"].image}
      alt="Better Together Banner"
    />
  ),
  "Paw Prints Banner": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Paw Prints Banner"].image}
      alt="Paw Prints Banner"
    />
  ),
  "Crabs and Traps Banner": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Crabs and Traps Banner"].image}
      alt="Crabs and Traps Banner"
    />
  ),
  "Diving Helmet": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 18}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `50%`,
        transform: "translatex(-50%)",
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
      image={ITEM_DETAILS["Diving Helmet"].image}
      alt="Diving Helmet"
    />
  ),
  "Paw Prints Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Paw Prints Rug"].image}
      alt="Paw Prints Rug"
    />
  ),
  "Pet Bed": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Pet Bed"].image}
      alt="Pet Bed"
    />
  ),
  "Pet Bowls": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Pet Bowls"].image}
      alt="Pet Bowls"
    />
  ),
  "Giant Acorn": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Acorn"].image}
      alt="Giant Acorn"
    />
  ),
  "Moon Fox Statue": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 31}px`,
      }}
      image={ITEM_DETAILS["Moon Fox Statue"].image}
      alt="Moon Fox Statue"
    />
  ),
  "Big Apple": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      alt="Big Apple"
      project="Big Apple"
    />
  ),
  "Big Orange": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      alt="Big Orange"
      project="Big Orange"
    />
  ),
  "Big Banana": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
      alt="Big Banana"
      project="Big Banana"
    />
  ),
  "Farmer's Monument": (props: CollectibleProps) => (
    <Monument
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 46}px`,
      }}
      alt="Farmer's Monument"
      project="Farmer's Monument"
    />
  ),
  "Miner's Monument": (props: CollectibleProps) => (
    <Monument
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 42}px`,
      }}
      alt="Miner's Monument"
      project="Miner's Monument"
    />
  ),
  "Woodcutter's Monument": (props: CollectibleProps) => (
    <Monument
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 43}px`,
      }}
      alt="Woodcutter's Monument"
      project="Woodcutter's Monument"
    />
  ),
  "Teamwork Monument": (props: CollectibleProps) => (
    <Monument
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 47}px`,
      }}
      alt="Teamwork Monument"
      project="Teamwork Monument"
    />
  ),
  "Basic Cooking Pot": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 27}px`,
      }}
      alt="Basic Cooking Pot"
      project="Basic Cooking Pot"
    />
  ),
  "Expert Cooking Pot": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      alt="Expert Cooking Pot"
      project="Expert Cooking Pot"
    />
  ),
  "Advanced Cooking Pot": (props: CollectibleProps) => (
    <Project
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      alt="Advanced Cooking Pot"
      project="Advanced Cooking Pot"
    />
  ),
  "Floor Mirror": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Floor Mirror"].image}
      alt="Floor Mirror"
    />
  ),
  "Long Rug": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 64}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 64}px`,
      }}
      image={ITEM_DETAILS["Long Rug"].image}
      alt="Long Rug"
    />
  ),
  "Garbage Bin": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Garbage Bin"].image}
      alt="Garbage Bin"
    />
  ),
  Wheelbarrow: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 27}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 27}px`,
      }}
      image={ITEM_DETAILS["Wheelbarrow"].image}
      alt="Wheelbarrow"
    />
  ),
  "Snail King": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      image={ITEM_DETAILS["Snail King"].image}
      alt="Snail King"
    />
  ),
  "Reelmaster's Chair": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 17}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 17}px`,
      }}
      image={ITEM_DETAILS["Reelmaster's Chair"].image}
      alt="Reelmaster's Chair"
    />
  ),
  "Rat King": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 21}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 21}px`,
      }}
      image={ITEM_DETAILS["Rat King"].image}
      alt="Rat King"
    />
  ),
  "Fruit Tune Box": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 20}px`,
      }}
      image={ITEM_DETAILS["Fruit Tune Box"].image}
      alt="Fruit Tune Box"
    />
  ),
  "Giant Artichoke": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 27}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 27}px`,
      }}
      image={ITEM_DETAILS["Giant Artichoke"].image}
      alt="Giant Artichoke"
    />
  ),
  "Rocket Statue": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Rocket Statue"].image}
      alt="Rocket Statue"
    />
  ),
  "Ant Queen": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 20}px`,
      }}
      image={ITEM_DETAILS["Ant Queen"].image}
      alt="Ant Queen"
    />
  ),
  "Jurassic Droplet": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Jurassic Droplet"].image}
      alt="Jurassic Droplet"
    />
  ),
  "Giant Onion": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 20}px`,
      }}
      image={ITEM_DETAILS["Giant Onion"].image}
      alt="Giant Onion"
    />
  ),
  "Giant Turnip": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 5}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 31}px`,
      }}
      image={ITEM_DETAILS["Giant Turnip"].image}
      alt="Giant Turnip"
    />
  ),
  "Groovy Gramophone": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 25}px`,
      }}
      image={ITEM_DETAILS["Groovy Gramophone"].image}
      alt="Groovy Gramophone"
    />
  ),
  "Wheat Whiskers": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 17}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 17}px`,
      }}
      image={ITEM_DETAILS["Wheat Whiskers"].image}
      alt="Wheat Whiskers"
    />
  ),
  Cerberus: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 31}px`,
      }}
      image={ITEM_DETAILS["Cerberus"].image}
      alt="Cerberus"
    />
  ),
  "Witch's Cauldron": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 38}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 38}px`,
      }}
      image={ITEM_DETAILS["Witch's Cauldron"].image}
      alt="Witch's Cauldron"
    />
  ),
  Raveyard: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Raveyard"].image}
      alt="Raveyard"
    />
  ),
  "Haunted House": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 93}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 93}px`,
      }}
      image={ITEM_DETAILS["Haunted House"].image}
      alt="Haunted House"
    />
  ),
  "Mimic Egg": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 19}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 19}px`,
      }}
      image={ITEM_DETAILS["Mimic Egg"].image}
      alt="Mimic Egg"
    />
  ),
  "Haunted Tomb": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Haunted Tomb"].image}
      alt="Haunted Tomb"
    />
  ),
  Guillotine: (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Guillotine"].image}
      alt="Guillotine"
    />
  ),
  "Vampire Coffin": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 24}px`,
      }}
      image={ITEM_DETAILS["Vampire Coffin"].image}
      alt="Vampire Coffin"
    />
  ),
  "Petnip Plant": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Petnip Plant"].image}
      alt="Petnip Plant"
    />
  ),
  "Pet Kennel": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Pet Kennel"].image}
      alt="Pet Kennel"
    />
  ),
  "Pet Toys": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 25}px`,
      }}
      image={ITEM_DETAILS["Pet Toys"].image}
      alt="Pet Toys"
    />
  ),
  "Pet Playground": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 34}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -1}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 34}px`,
      }}
      image={ITEM_DETAILS["Pet Playground"].image}
      alt="Pet Playground"
    />
  ),
  "Fish Bowl": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Fish Bowl"].image}
      alt="Fish Bowl"
    />
  ),
  "Giant Gold Bone": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Giant Gold Bone"].image}
      alt="Giant Gold Bone"
    />
  ),
  "Lunar Temple": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 46}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 1.5}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 46}px`,
      }}
      image={ITEM_DETAILS["Lunar Temple"].image}
      alt="Lunar Temple"
    />
  ),
  "Magma Stone": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Magma Stone"].image}
      alt="Magma Stone"
    />
  ),
  Cornucopia: (props: CollectibleProps) => (
    <Monument
      {...props}
      project="Cornucopia"
      divStyle={{
        width: `${PIXEL_SCALE * 42}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 42}px`,
      }}
      alt="Cornucopia"
    />
  ),
  "Holiday Decorative Totem": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Holiday Decorative Totem"].image}
      alt="Holiday Decorative Totem"
    />
  ),
  "Red Holiday Ornament": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 31}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 31}px`,
      }}
      image={ITEM_DETAILS["Red Holiday Ornament"].image}
      alt="Red Holiday Ornament"
    />
  ),
  "Green Holiday Ornament": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Green Holiday Ornament"].image}
      alt="Green Holiday Ornament"
    />
  ),
  "Gift Turtle": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Gift Turtle"].image}
      alt="Gift Turtle"
    />
  ),
  "Red Nose Reindeer": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Red Nose Reindeer"].image}
      alt="Red Nose Reindeer"
    />
  ),
  "Tuxedo Claus": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 37}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 37}px`,
      }}
      image={ITEM_DETAILS["Tuxedo Claus"].image}
      alt="Tuxedo Claus"
    />
  ),
  "Winter Alpaca": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * -2}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 32}px`,
      }}
      image={ITEM_DETAILS["Winter Alpaca"].image}
      alt="Winter Alpaca"
    />
  ),
  "Penguin Surprise": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 51}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -2}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 51}px`,
      }}
      image={ITEM_DETAILS["Penguin Surprise"].image}
      alt="Penguin Surprise"
    />
  ),
  "Frozen Meat": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 0}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
      image={ITEM_DETAILS["Frozen Meat"].image}
      alt="Frozen Meat"
    />
  ),
  "Ho Ho oh oh…": (props: CollectibleProps) => (
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
      image={ITEM_DETAILS["Ho Ho oh oh…"].image}
      alt="Ho Ho oh oh…"
    />
  ),
  "Squeaky Chicken": (props: CollectibleProps) => (
    <ImageStyle
      {...props}
      divStyle={{
        width: `${PIXEL_SCALE * 23}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * -3}px`,
      }}
      imgStyle={{
        width: `${PIXEL_SCALE * 23}px`,
      }}
      image={ITEM_DETAILS["Squeaky Chicken"].image}
      alt="Squeaky Chicken"
    />
  ),
  ...getKeys(BED_FARMHAND_COUNT).reduce(
    (acc, bedName) => {
      acc[bedName] = (props: CollectibleProps) => (
        <Bed {...props} name={bedName} />
      );
      return acc;
    },
    {} as Record<BedName, React.FC<CollectibleProps>>,
  ),
};
// Need readonly versions for some troublesome components while in design mode

export const READONLY_COLLECTIBLES: Record<
  CollectibleName | "Bud" | "PetNFT",
  React.FC<CollectibleProps>
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
    const hasChonkyScarecrow = props.skills["Chonky Scarecrow"];
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
    const hasHorrorMike = props.skills["Horror Mike"];
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
    const hasLauriesGains = props.skills["Laurie's Gains"];
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
  "Nyon Statue": () => (
    <img
      src={ITEM_DETAILS["Nyon Statue"].image}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 32}px` }}
    />
  ),
  "Rock Golem": () => (
    <div
      className="absolute bottom-0"
      style={{ left: `${PIXEL_SCALE * -2}px`, width: `${PIXEL_SCALE * 34}px` }}
    >
      <img src={ITEM_DETAILS["Rock Golem"].image} className="w-full" />
    </div>
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
