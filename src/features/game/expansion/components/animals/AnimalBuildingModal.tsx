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
import { getBoostedAnimalCapacity } from "features/game/events/landExpansion/buyAnimal";
import { Label } from "components/ui/Label";

import coinsIcon from "assets/icons/coins.webp";
import brush from "assets/animals/brush.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { AnimalBounties } from "features/barn/components/AnimalBounties";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";
import { SICK_ANIMAL_REWARD_MULTIPLIER } from "features/game/events/landExpansion/sellAnimal";
import { formatNumber } from "lib/utils/formatNumber";
import { SquareIcon } from "components/ui/SquareIcon";

function acknowledgeIntro() {
  localStorage.setItem(
    "animal.bounties.acknowledged",
    new Date().toISOString(),
  );
}

function hasReadIntro() {
  return !!localStorage.getItem("animal.bounties.acknowledged");
}

export function acknowledgeGuide() {
  localStorage.setItem("animal.guide.acknowledged", new Date().toISOString());
}

export function hasReadGuide() {
  return !!localStorage.getItem("animal.guide.acknowledged");
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
  const [currentTab, setCurrentTab] = useState(!hasReadGuide() ? 2 : 0);

  const state = useSelector(gameService, _state);
  const bumpkin = useSelector(gameService, _bumpkin);
  // camelCase buildingKey eg. henHouse
  const buildingKey = makeAnimalBuildingKey(buildingName);
  const building = useSelector(gameService, _building(buildingKey));

  const { t } = useAppTranslation();

  const animals = getKeys(ANIMALS).filter(
    (animal) => ANIMALS[animal].buildingRequired === buildingName,
  );

  const [selectedName, setSelectedName] = useState<AnimalType>(animals[0]);

  const handleBuyAnimal = () => {
    gameService.send({
      type: "animal.bought",
      animal: selectedName,
      id: uuidv4().slice(0, 8),
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
    getTotalAnimalsInBuilding() >= getBoostedAnimalCapacity(buildingKey, state);

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

  const guideItems = [
    { icon: SUNNYSIDE.building.feederMachine, text: t("animals.guide.feeder") },
    {
      icon: SUNNYSIDE.animalFoods.kernel_blend,
      text: t("animals.guide.food_preference"),
    },
    {
      icon: SUNNYSIDE.icons.expression_ready,
      text: t("animals.guide.progress"),
    },
    { icon: SUNNYSIDE.icons.sleeping, text: t("animals.guide.sleeping") },
    { icon: brush, text: t("animals.guide.affection") },
    {
      icon: SUNNYSIDE.animalFoods.barn_delight,
      text: t("animals.guide.sickness"),
    },
    {
      icon: SUNNYSIDE.icons.death,
      text: t("animals.guide.bounties", {
        percent: formatNumber(SICK_ANIMAL_REWARD_MULTIPLIER * 100),
      }),
    },
  ];

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        { name: t("buy"), icon: coinsIcon },
        { name: t("sell"), icon: SUNNYSIDE.icons.death },
        { name: t("guide"), icon: SUNNYSIDE.icons.expression_confused },
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
                className="absolute bottom-3 sm:bottom-2 left-2"
              >
                {`${getTotalAnimalsInBuilding()}/${getBoostedAnimalCapacity(
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

      {currentTab === 2 && (
        <>
          <InnerPanel className="p-1">
            <div className="flex flex-col p-1 space-y-1 mb-2">
              <img src={SUNNYSIDE.tutorial.animals} className="w-full" />
              <div className="flex flex-col space-y-2 text-xs">
                {guideItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="px-1">
                      <SquareIcon icon={item.icon} width={7} />
                    </div>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={() => {
                acknowledgeGuide();
                onClose();
              }}
            >
              {t("gotIt")}
            </Button>
          </InnerPanel>
        </>
      )}
    </CloseButtonPanel>
  );
};
