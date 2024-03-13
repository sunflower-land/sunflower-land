import React, { useState } from "react";
import { Modal } from "components/ui/Modal";

import boatIcon from "assets/npcs/island_boat_pirate.png";
import lockIcon from "assets/skills/lock.png";
import worldIcon from "assets/icons/world_small.png";

import { IslandList } from "./IslandList";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { Bumpkin, GameState } from "features/game/types/game";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const CONTENT_HEIGHT = 380;

interface IslandTravelModalProps {
  isOpen: boolean;
  bumpkin: Bumpkin | undefined;
  gameState: GameState;
  isVisiting?: boolean;
  travelAllowed: boolean;
  onShow?: () => void;
  onClose: () => void;
}

export const IslandTravelModal: React.FC<IslandTravelModalProps> = ({
  bumpkin,
  gameState,
  isVisiting = false,
  travelAllowed,
  isOpen,
  onShow,
  onClose,
}) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Boat")
  );

  const { t } = useAppTranslation();

  const bumpkinParts: Partial<Equipped> = {
    body: "Goblin Potion",
    hair: "Sun Spots",
    pants: "Brown Suspenders",
    shirt: "SFL T-Shirt",
    tool: "Sword",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Boat");
    setShowTutorial(false);
  };

  if (getBumpkinLevel(bumpkin?.experience ?? 0) < 3) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="flex flex-col items-center">
          <Label className="mt-2" icon={lockIcon} type="danger">
            {t("warning.level.required", { lvl: 3 })}
          </Label>
          <img src={worldIcon} className="w-10 mx-auto my-2" />
          <p className="text-sm text-center mb-2">
            {t("statements.visit.firePit")}
          </p>
        </div>
      </CloseButtonPanel>
    );
  }

  if (showTutorial) {
    return (
      <Modal show={isOpen} onHide={acknowledge} onShow={onShow}>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />
      </Modal>
    );
  }

  const hasBetaAccess = !!gameState.inventory["Beta Pass"];

  return (
    <Modal show={isOpen} onHide={onClose} onShow={onShow}>
      <CloseButtonPanel
        tabs={[{ icon: boatIcon, name: "Travel To" }]}
        bumpkinParts={bumpkinParts}
        onClose={onClose}
      >
        <div
          style={{ maxHeight: CONTENT_HEIGHT }}
          className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
        >
          {!travelAllowed && <span className="loading">{t("saving")}</span>}
          <IslandList
            bumpkin={bumpkin}
            showVisitList={isVisiting}
            gameState={gameState}
            travelAllowed={travelAllowed}
            hasBetaAccess={hasBetaAccess}
            onClose={onClose}
          />
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
