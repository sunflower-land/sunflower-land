import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Button } from "components/ui/Button";
import { getKeys } from "features/game/types/decorations";
import {
  AnimalBuildingType,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { AnimalBounty, AnimalBuildingKey } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getAnimalCapacity } from "features/game/events/landExpansion/buyAnimal";
import { Label } from "components/ui/Label";
import { pickRandomPositionInAnimalHouse } from "features/game/expansion/placeable/lib/collisionDetection";

import coinsIcon from "assets/icons/coins.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { AnimalBounties } from "features/barn/components/AnimalBounties";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";

function acknowledgeIntro() {
  localStorage.setItem(
    "animal.bounties.acknowledged",
    new Date().toISOString(),
  );
}

function hasReadIntro() {
  return !!localStorage.getItem("animal.bounties.acknowledged");
}

type Props = {
  buildingName: AnimalBuildingType;
  onClose: () => void;
  onExchanging: (deal: AnimalBounty) => void;
};

const _state = (state: MachineState) => state.context.state;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _building = (buildingKey: AnimalBuildingKey) => (state: MachineState) =>
  state.context.state[buildingKey];

export const AnimalBuildingModal: React.FC<Props> = ({
  buildingName,
  onClose,
  onExchanging,
}) => {
  const { gameService } = useContext(Context);
  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  const state = useSelector(gameService, _state);
  const bumpkin = useSelector(gameService, _bumpkin);
  // camelCase buildingKey eg. henHouse
  const buildingKey = makeAnimalBuildingKey(buildingName);
  const building = useSelector(gameService, _building(buildingKey));

  const { t } = useAppTranslation();

  const animals = getKeys(ANIMALS).filter(
    (animal) => ANIMALS[animal].buildingRequired === buildingName,
  );

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedName, setSelectedName] = useState<AnimalType>(animals[0]);

  const handleBuyAnimal = () => {
    const position = pickRandomPositionInAnimalHouse(
      state,
      buildingKey,
      selectedName,
    );

    gameService.send({
      type: "animal.bought",
      animal: selectedName,
      id: uuidv4().slice(0, 8),
      coordinates: {
        x: position.x,
        y: position.y,
      },
    });
  };

  const getAnimalCount = (animalType: AnimalType) =>
    Object.values(building.animals).filter(
      (animal) => animal.type === animalType,
    ).length;

  const getTotalAnimalsInBuilding = () =>
    Object.values(building.animals).filter(
      (animal) => ANIMALS[animal.type].buildingRequired === buildingName,
    ).length;

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);

  const hasRequiredLevel = () =>
    bumpkinLevel >= ANIMALS[selectedName].levelRequired;

  const atMaxCapacity =
    getTotalAnimalsInBuilding() >= getAnimalCapacity(buildingKey, state);

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("bounties.animal.intro.one"),
          },
          {
            text: t("bounties.animal.intro.two"),
          },
          {
            text: t("bounties.animal.intro.three"),
          },
        ]}
        bumpkinParts={NPC_WEARABLES.grabnab}
        onClose={() => {
          acknowledgeIntro();
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        { name: t("buy"), icon: coinsIcon },
        { name: t("sell"), icon: SUNNYSIDE.icons.death },
      ]}
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      className="relative"
      container={OuterPanel}
    >
      {currentTab === 0 && (
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              details={{
                item: selectedName,
              }}
              requirements={{
                coins: ANIMALS[selectedName].coins,
                showCoinsIfFree: true,
                level: ANIMALS[selectedName].levelRequired,
              }}
              label={
                atMaxCapacity ? (
                  <Label type="danger">
                    {t("animals.buildingIsFull", { buildingName })}
                  </Label>
                ) : undefined
              }
              actionView={
                <Button
                  disabled={!hasRequiredLevel || atMaxCapacity}
                  onClick={handleBuyAnimal}
                  className="w-full"
                >
                  {t("animals.buy", { animal: selectedName })}
                </Button>
              }
            />
          }
          content={
            <div className="pl-1">
              <div
                className={classNames("flex flex-wrap", {
                  "mb-8": isMobile,
                })}
              >
                {animals.map((name: AnimalType) => (
                  <Box
                    isSelected={selectedName === name}
                    key={name}
                    onClick={() => setSelectedName(name)}
                    image={ITEM_DETAILS[name].image}
                    showOverlay={!hasRequiredLevel()}
                    secondaryImage={
                      !hasRequiredLevel() ? SUNNYSIDE.icons.lock : undefined
                    }
                    count={new Decimal(getAnimalCount(name))}
                  />
                ))}
              </div>
              <Label
                type={atMaxCapacity ? "danger" : "info"}
                className="absolute bottom-3 left-2"
              >
                {`${getTotalAnimalsInBuilding()}/${getAnimalCapacity(
                  buildingKey,
                  state,
                )} ${t("capacity")}`}
              </Label>
            </div>
          }
        />
      )}

      {currentTab === 1 && (
        <AnimalBounties
          type={buildingName === "Barn" ? ["Cow", "Sheep"] : ["Chicken"]}
          onExchanging={onExchanging}
        />
      )}
    </CloseButtonPanel>
  );
};
