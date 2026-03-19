import React, { useContext, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCPlaceable } from "../bumpkin/components/NPC";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { PlaceableLocation } from "features/game/types/collectibles";
import { FarmHandAnimation } from "features/game/types/farmhands";
import { FarmHandAnimationSelector } from "./FarmHandAnimationSelector";

type FarmHandTab = "equip" | "animations";

const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

export const FarmHand: React.FC<{
  id: string;
  location?: PlaceableLocation;
}> = ({ id, location = "farm" }) => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<FarmHandTab>("equip");
  const { gameService } = useContext(Context);
  const farmHands = useSelector(gameService, _farmHands);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const fh = farmHands[id];

  if (!fh) return null;

  const animation: FarmHandAnimation = fh.animation ?? "idle";

  if (!fh.coordinates) {
    return (
      <NPCPlaceable
        parts={fh.equipped}
        isManuallyPlaced={true}
        animation={animation}
      />
    );
  }

  if (!isLandscaping) {
    return (
      <>
        <NPCPlaceable
          parts={fh.equipped}
          onClick={() => setShowModal(true)}
          isManuallyPlaced={true}
          animation={animation}
        />
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <CloseButtonPanel
            onClose={() => setShowModal(false)}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={[
              {
                id: "equip" as const,
                icon: SUNNYSIDE.icons.wardrobe,
                name: t("equip"),
              },
              {
                id: "animations" as const,
                icon: SUNNYSIDE.icons.player,
                name: t("farmHand.animation"),
              },
            ]}
          >
            {currentTab === "equip" && (
              <BumpkinEquip
                farmHandId={id}
                equipment={fh.equipped}
                animation={animation}
                onEquip={(equipment) => {
                  gameService.send("farmHand.equipped", {
                    id,
                    equipment,
                  });
                }}
              />
            )}
            {currentTab === "animations" && (
              <FarmHandAnimationSelector
                id={id}
                animation={animation}
                parts={fh.equipped}
              />
            )}
          </CloseButtonPanel>
        </Modal>
      </>
    );
  }

  return (
    <MoveableComponent
      name="FarmHand"
      id={id}
      index={0}
      x={fh.coordinates.x}
      y={fh.coordinates.y}
      location={location}
    >
      <NPCPlaceable
        parts={fh.equipped}
        isManuallyPlaced={true}
        animation={animation}
      />
    </MoveableComponent>
  );
};
