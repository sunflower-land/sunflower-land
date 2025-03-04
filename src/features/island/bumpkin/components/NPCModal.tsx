/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";

import {
  COOKABLES,
  PIRATE_CAKE,
  FISH,
  Consumable,
  FACTION_FOOD,
  TRADE_FOOD,
} from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
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
import { useSelector } from "@xstate/react";

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

const _inventory = (state: MachineState) => state.context.state.inventory;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const NPCModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const bumpkin = useSelector(gameService, _bumpkin);

  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

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

  const bumpkinLevel = useRef(getBumpkinLevel(bumpkin?.experience ?? 0));

  useEffect(() => {
    const newLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

    if (newLevel !== bumpkinLevel.current) {
      setShowLevelUp(true);
      bumpkinLevel.current = newLevel;
    }
  }, [bumpkin?.experience]);

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        onClose();
        if (showLevelUp && bumpkinLevel.current === 2) {
          openModal("SECOND_LEVEL");
        }

        setTimeout(() => setShowLevelUp(false), 500);
      }}
    >
      {showLevelUp ? (
        <CloseButtonPanel
          onClose={() => {
            onClose();

            if (bumpkinLevel.current === 2) {
              openModal("SECOND_LEVEL");
            }

            setTimeout(() => setShowLevelUp(false), 500);
          }}
          title="Level up!"
          bumpkinParts={bumpkin?.equipped}
        >
          <LevelUp
            level={bumpkinLevel.current}
            onClose={() => {
              onClose();

              if (bumpkinLevel.current === 2) {
                openModal("SECOND_LEVEL");
              }

              setTimeout(() => setShowLevelUp(false), 500);
            }}
            wearables={bumpkin?.equipped as Equipped}
          />
        </CloseButtonPanel>
      ) : (
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: foodIcon, name: t("feed.bumpkin") }]}
          bumpkinParts={bumpkin?.equipped}
          container={OuterPanel}
        >
          <Feed food={availableFood} />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
