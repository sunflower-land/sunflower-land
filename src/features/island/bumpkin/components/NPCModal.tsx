/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";

import {
  COOKABLES,
  PIRATE_CAKE,
  FISH,
  Consumable,
} from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "components/ui/Modal";
import foodIcon from "src/assets/food/chicken_drumstick.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBumpkinLevel } from "features/game/lib/level";
import { LevelUp } from "./LevelUp";
import { Equipped } from "features/game/types/bumpkin";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuildingName } from "features/game/types/buildings";
import { OuterPanel } from "components/ui/Panel";

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

export const NPCModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  const allFoods: Consumable[] = [
    ...Object.values(COOKABLES)
      .sort((a, b) => a.cookingSeconds - b.cookingSeconds)
      .sort(
        (a, b) =>
          BUILDING_ORDER.indexOf(a.building) -
          BUILDING_ORDER.indexOf(b.building)
      ),
    ...Object.values(PIRATE_CAKE),
    ...Object.values(FISH).sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const availableFood: Consumable[] = allFoods
    .filter((consumable) => !!state.inventory[consumable.name]?.gt(0))
    .map((consumable) => consumable);

  const [showLevelUp, setShowLevelUp] = useState(false);

  const bumpkinLevel = useRef(getBumpkinLevel(state.bumpkin?.experience ?? 0));

  useEffect(() => {
    const newLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

    if (newLevel !== bumpkinLevel.current) {
      setShowLevelUp(true);
      bumpkinLevel.current = newLevel;
    }
  }, [state.bumpkin?.experience]);

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
          bumpkinParts={state.bumpkin?.equipped}
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
            wearables={state.bumpkin?.equipped as Equipped}
          />
        </CloseButtonPanel>
      ) : (
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: foodIcon, name: t("feed.bumpkin") }]}
          bumpkinParts={state.bumpkin?.equipped}
          container={OuterPanel}
        >
          <Feed food={availableFood} />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
