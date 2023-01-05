import React, { useContext, useState } from "react";
import classNames from "classnames";
import Modal from "react-bootstrap/Modal";

import { CollectibleName } from "features/game/types/craftables";
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
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Bar } from "components/ui/ProgressBar";
import { RemovePlaceableModal } from "../../game/expansion/placeable/RemovePlaceableModal";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bean, getBeanStates } from "./components/Bean";
import { PottedPumpkin } from "features/island/collectibles/components/PottedPumpkin";
import { Context } from "features/game/GameProvider";
import { PottedPotato } from "features/island/collectibles/components/PottedPotato";
import { isBean } from "features/game/types/beans";
import { ChristmasBear } from "./components/ChristmasBear";
import { RainbowArtistBear } from "./components/RainbowArtistBear";
import { SnowGlobe } from "./components/SnowGlobe";
import { ImmortalPear } from "./components/ImmortalPear";

export interface CollectibleProps {
  name: CollectibleName;
  id: string;
  readyAt: number;
  createdAt: number;
}

export const COLLECTIBLE_COMPONENTS: Record<
  CollectibleName,
  React.FC<CollectibleProps>
> = {
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
  "Carrot Sword": CarrotSword,

  // Flags
  ...flags,

  //Decorations
  "White Tulips": WhiteTulips,
  "Potted Sunflower": PottedSunflower,
  "Potted Pumpkin": PottedPumpkin,
  Cactus: Cactus,
  "Basic Bear": BasicBear,
  "Chef Bear": ChefBear,
  "Construction Bear": ConstructionBear,
  "Angel Bear": AngelBear,
  "Badass Bear": BadassBear,
  "Bear Trap": BearTrap,
  "Brilliant Bear": BrilliantBear,
  "Classy Bear": ClassyBear,
  "Farmer Bear": FarmerBear,
  "Rich Bear": RichBear,
  "Sunflower Bear": SunflowerBear,
  "Christmas Bear": ChristmasBear,
  "Rainbow Artist Bear": RainbowArtistBear,
  "Victoria Sisters": VictoriaSisters,
  "Devil Bear": DevilBear,

  "Golden Bean": Bean,
  "Magic Bean": Bean,
  "Shiny Bean": Bean,

  "Egg Basket": () => null,

  // TODO
  "Potted Potato": PottedPotato,
  "Colossal Crop": () => null,
  "Peaceful Potato": () => null,
  "Perky Pumpkin": () => null,
  "Stellar Sunflower": () => null,
  "Christmas Snow Globe": SnowGlobe,
  "Immortal Pear": ImmortalPear,
  "Lady Bug": () => null,
};

export const Collectible: React.FC<CollectibleProps> = ({
  name,
  id,
  readyAt,
  createdAt,
}) => {
  const CollectiblePlaced = COLLECTIBLE_COMPONENTS[name];
  const { showTimers } = useContext(Context);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const inProgress = readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  if (inProgress) {
    const totalSeconds = (readyAt - createdAt) / 1000;
    const secondsLeft = Math.floor((readyAt - Date.now()) / 1000);

    return (
      <>
        <div
          className="w-full h-full cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div
            className={classNames("w-full h-full pointer-events-none", {
              "opacity-50": inProgress,
            })}
          >
            <CollectiblePlaced
              key={id}
              createdAt={createdAt}
              id={id}
              name={name}
              readyAt={readyAt}
            />
          </div>
          {showTimers && (
            <div
              className="absolute bottom-0 left-1/2"
              style={{
                marginLeft: `${PIXEL_SCALE * -8}px`,
              }}
            >
              <Bar
                percentage={(1 - secondsLeft / totalSeconds) * 100}
                type="progress"
              />
            </div>
          )}
        </div>
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimeLeftPanel
            text="Ready in:"
            timeLeft={secondsLeft}
            showTimeLeft={showTooltip}
          />
        </div>
      </>
    );
  }

  const shortcuts = getShortcuts();
  const isBeanAndFullyGrown =
    isBean(name) && getBeanStates(name, createdAt).isReady;
  const canRemoveOnClick =
    shortcuts[0] === "Rusty Shovel" && !isBeanAndFullyGrown;

  const handleOnClick = () => {
    if (!canRemoveOnClick) return;

    setShowRemoveModal(true);
  };

  return (
    <>
      <div
        className={classNames("h-full", {
          "cursor-pointer hover:img-highlight": canRemoveOnClick,
        })}
        onClick={canRemoveOnClick ? handleOnClick : undefined}
      >
        <div
          className={classNames("h-full", {
            "pointer-events-none": canRemoveOnClick,
          })}
        >
          <CollectiblePlaced
            key={id}
            createdAt={createdAt}
            id={id}
            name={name}
            readyAt={readyAt}
          />
        </div>
      </div>
      <Modal
        show={showRemoveModal}
        centered
        onHide={() => setShowRemoveModal(false)}
      >
        {showRemoveModal && (
          <RemovePlaceableModal
            type="collectible"
            placeableId={id}
            name={name}
            onClose={() => setShowRemoveModal(false)}
          />
        )}
      </Modal>
    </>
  );
};
