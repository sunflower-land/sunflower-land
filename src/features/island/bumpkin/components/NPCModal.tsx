import React, { useContext, useEffect, useRef, useState } from "react";

import { getEntries } from "features/game/types/craftables";

import { CONSUMABLES } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Feed } from "./Feed";
import { Modal } from "react-bootstrap";
import foodIcon from "src/assets/food/chicken_drumstick.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBumpkinLevel } from "features/game/lib/level";
import { LevelUp } from "./LevelUp";
import { Equipped } from "features/game/types/bumpkin";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export const NPCModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const availableFood = getEntries(CONSUMABLES)
    .filter(([name, _]) => !!state.inventory[name]?.gt(0))
    .map(([_, consumable]) => consumable);

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
    <Modal show={isOpen} onHide={onClose} centered>
      {showLevelUp ? (
        <CloseButtonPanel
          onClose={() => setShowLevelUp(false)}
          title="Level up!"
          bumpkinParts={state.bumpkin?.equipped}
        >
          <LevelUp
            level={bumpkinLevel.current}
            onClose={() => setShowLevelUp(false)}
            wearables={state.bumpkin?.equipped as Equipped}
          />
        </CloseButtonPanel>
      ) : (
        <CloseButtonPanel
          onClose={onClose}
          tabs={[{ icon: foodIcon, name: "Feed Bumpkin" }]}
          bumpkinParts={state.bumpkin?.equipped}
        >
          <Feed food={availableFood} />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
