import React, { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { getKeys } from "lib/object";
import {
  type AnimalBuildingType,
  ANIMALS,
  type AnimalType,
} from "features/game/types/animals";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import type { AnimalBounty, AnimalBuildingKey } from "features/game/types/game";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { getBoostedAnimalCapacity } from "features/game/events/landExpansion/buyAnimal";
import { Label } from "components/ui/Label";

import coinsIcon from "assets/icons/coins.webp";
import brush from "assets/animals/brush.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getAnimalMaturityTimeForDisplay,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SICK_ANIMAL_REWARD_MULTIPLIER } from "features/game/events/landExpansion/sellAnimal";
import { formatNumber } from "lib/utils/formatNumber";
import { SquareIcon } from "components/ui/SquareIcon";
import { AnimalBounties } from "features/barn/components/AnimalBounties";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { secondsToString } from "lib/utils/time";

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
  sellContent?: React.ReactNode;
  onTabChange?: (tab: "buy" | "sell" | "guide") => void;
};

const _state = (state: MachineState) => state.context.state;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _building = (buildingKey: AnimalBuildingKey) => (state: MachineState) =>
  state.context.state[buildingKey];

export const AnimalBuildingModal: React.FC<Props> = ({
  buildingName,
  onClose,
  onExchanging,
  sellContent,
  onTabChange,
}) => {
  const { gameService } = useContext(Context);
  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  type Tab = "buy" | "sell" | "guide";
  const [currentTab, setCurrentTab] = useState<Tab>(
    !hasReadGuide() ? "guide" : "buy",
  );
  const state = useSelector(gameService, _state);
  const bumpkin = useSelector(gameService, _bumpkin);
  // camelCase buildingKey eg. henHouse
  const buildingKey = makeAnimalBuildingKey(buildingName);
  const building = useSelector(gameService, _building(buildingKey));

  const { t } = useAppTranslation();

  const animals = getKeys(ANIMALS).filter(
    (animal) => ANIMALS[animal].buildingRequired === buildingName,
  );

  const handleBuyAnimal = (animal: AnimalType) => {
    gameService.send({
      type: "animal.bought",
      animal,
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

  const ascension = getAscensionLevel({
    experience: bumpkin.experience,
    ascensionLevel: state.island.ascensionLevel ?? 0,
  });

  const capacity = getBoostedAnimalCapacity(buildingKey, state).capacity;
  const atMaxCapacity = getTotalAnimalsInBuilding() >= capacity;

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
        { id: "buy", name: t("buy"), icon: coinsIcon },
        { id: "sell", name: t("sell"), icon: SUNNYSIDE.icons.death },
        {
          id: "guide",
          name: t("guide"),
          icon: SUNNYSIDE.icons.expression_confused,
        },
      ]}
      currentTab={currentTab}
      setCurrentTab={(tab) => {
        if (typeof tab === "function") return;
        setCurrentTab(tab);
        onTabChange?.(tab);
      }}
      className="relative max-h-[50vh]"
      container={OuterPanel}
    >
      {currentTab === "buy" && (
        <InnerPanel className="p-1">
          <div className="flex items-center justify-between mb-1">
            <Label type={atMaxCapacity ? "danger" : "info"}>
              {`${getTotalAnimalsInBuilding()}/${capacity} ${t("capacity")}`}
            </Label>
            {atMaxCapacity && (
              <Label type="danger">
                {t("animals.buildingIsFull", { buildingName })}
              </Label>
            )}
          </div>

          <div
            className={classNames("grid gap-1", {
              "grid-cols-1": animals.length === 1,
              "grid-cols-1 sm:grid-cols-2": animals.length > 1,
            })}
          >
            {animals.map((name) => {
              const details = ANIMALS[name];
              const hasRequiredLevel = meetsLevelRequirement(
                ascension,
                details.levelRequired,
              );
              const maturityTime = getAnimalMaturityTimeForDisplay({
                animalType: name,
                game: state,
              });

              return (
                <InnerPanel key={name} className="p-1 flex flex-col">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-none px-2">
                      <img src={ITEM_DETAILS[name].image} className="w-12" />
                      <Label
                        type="default"
                        className="absolute -top-1 -right-1"
                      >
                        {getAnimalCount(name)}
                      </Label>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm mb-1">{name}</p>
                      <p className="text-xxs mb-2">
                        {ITEM_DETAILS[name].description}
                      </p>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-2 pl-2">
                        <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                          {details.coins}
                        </Label>
                        <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                          {secondsToString(
                            Math.ceil(maturityTime.maturityTimeMs / 1000),
                            { length: "short" },
                          )}
                        </Label>
                        <RequirementLabel
                          type="level"
                          currentLevel={ascension}
                          requirement={details.levelRequired}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    disabled={!hasRequiredLevel || atMaxCapacity}
                    onClick={() => handleBuyAnimal(name)}
                    className="w-full mt-2"
                  >
                    {t("animals.buy", { animal: name })}
                  </Button>
                </InnerPanel>
              );
            })}
          </div>
        </InnerPanel>
      )}

      {currentTab === "sell" &&
        (sellContent ?? (
          <AnimalBounties
            type={buildingName === "Barn" ? ["Cow", "Sheep"] : ["Chicken"]}
            onExchanging={onExchanging}
          />
        ))}

      {currentTab === "guide" && (
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
