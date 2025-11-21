import React, { useContext, useState } from "react";

import {
  COOKABLES,
  PIRATE_CAKE,
  FISH,
  Consumable,
  FACTION_FOOD,
  TRADE_FOOD,
} from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "components/ui/Modal";
import foodIcon from "assets/food/chicken_drumstick.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBumpkinLevel } from "features/game/lib/level";
import { LevelUp } from "./LevelUp";
import { Equipped } from "features/game/types/bumpkin";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuildingName } from "features/game/types/buildings";
import { OuterPanel } from "components/ui/Panel";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BUILDING_ORDER: BuildingName[] = [
  "Fire Pit",
  "Kitchen",
  "Deli",
  "Smoothie Shack",
  "Bakery",
];

const _currentBumpkinLevel = (state: MachineState) => {
  return getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);
};
const _inventory = (state: MachineState) => {
  return state.context.state.inventory;
};
const _equipped = (state: MachineState) => {
  return state.context.state.bumpkin?.equipped;
};

function useLevelUp(currentLevel: number) {
  // The highest level the player has already "seen" / acknowledged
  const [acknowledgedLevel, setAcknowledgedLevel] = useState(currentLevel);

  const hasLeveledUp = currentLevel > acknowledgedLevel;

  const acknowledgeLevelUp = () => {
    // Move the baseline up to the current level
    setAcknowledgedLevel(currentLevel);
  };

  return { hasLeveledUp, acknowledgeLevelUp };
}

export const NPCModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  const currentBumpkinLevel = useSelector(gameService, _currentBumpkinLevel);
  const inventory = useSelector(gameService, _inventory);
  const equipped = useSelector(gameService, _equipped);

  const { hasLeveledUp, acknowledgeLevelUp } = useLevelUp(currentBumpkinLevel);

  const allFoods: Consumable[] = [
    ...Object.values(COOKABLES)
      .sort((a, b) => a.cookingSeconds - b.cookingSeconds)
      .sort(
        (a, b) =>
          BUILDING_ORDER.indexOf(a.building) -
          BUILDING_ORDER.indexOf(b.building),
      ),
    ...Object.values(PIRATE_CAKE),
    ...Object.values(FACTION_FOOD),
    ...Object.values(TRADE_FOOD),
    ...Object.values(FISH).sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const availableFood: Consumable[] = allFoods
    .filter((consumable) => !!inventory[consumable.name]?.gt(0))
    .map((consumable) => consumable);

  const [showLevelUp, setShowLevelUp] = useState(false);

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        onClose();
        if (showLevelUp && currentBumpkinLevel === 2) {
          openModal("SECOND_LEVEL");
        }

        setTimeout(() => setShowLevelUp(false), 500);
      }}
    >
      {hasLeveledUp ? (
        <CloseButtonPanel
          onClose={() => {
            onClose();

            if (currentBumpkinLevel === 2) {
              openModal("SECOND_LEVEL");
            }

            setTimeout(() => acknowledgeLevelUp(), 500);
          }}
          title="Level up!"
          bumpkinParts={equipped}
        >
          <LevelUp
            level={currentBumpkinLevel}
            onClose={() => {
              onClose();

              if (currentBumpkinLevel === 2) {
                openModal("SECOND_LEVEL");
              }

              setTimeout(() => acknowledgeLevelUp(), 500);
            }}
            wearables={equipped as Equipped}
          />
        </CloseButtonPanel>
      ) : (
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: foodIcon, name: t("feed.bumpkin") }]}
          bumpkinParts={equipped}
          container={OuterPanel}
        >
          <Feed food={availableFood} />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
