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

const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

export const FarmHand: React.FC<{
  id: string;
  location?: PlaceableLocation;
}> = ({ id, location = "farm" }) => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  const farmHands = useSelector(gameService, _farmHands);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const fh = farmHands[id];

  if (!fh) return null;

  if (!fh.coordinates) {
    return <NPCPlaceable parts={fh.equipped} isFarmHand={true} />;
  }

  if (!isLandscaping) {
    return (
      <>
        <NPCPlaceable
          parts={fh.equipped}
          onClick={() => setShowModal(true)}
          isFarmHand={true}
        />
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <CloseButtonPanel
            bumpkinParts={fh?.equipped}
            onClose={() => setShowModal(false)}
            tabs={[
              {
                id: "equip",
                icon: SUNNYSIDE.icons.wardrobe,
                name: t("equip"),
              },
            ]}
          >
            <BumpkinEquip
              equipment={fh.equipped}
              onEquip={(equipment) => {
                gameService.send({ type: "farmHand.equipped", id, equipment });
              }}
            />
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
      <NPCPlaceable parts={fh.equipped} isFarmHand={true} />
    </MoveableComponent>
  );
};
