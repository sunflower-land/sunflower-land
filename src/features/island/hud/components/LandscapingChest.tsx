import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Chest } from "./inventory/Chest";
import { getChestItems } from "./inventory/utils/inventory";
import { getKeys } from "features/game/types/craftables";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  onPlace: (item: InventoryItemName) => void;
}

export const LandscapingChest: React.FC<Props> = ({
  show,
  onHide,
  state,
  onPlace,
}) => {
  const items = getChestItems(state);
  const [selected, setSelected] = useState(
    getKeys(items).sort((a, b) => (a - b ? -1 : 1))[0]
  );

  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: chest, name: "Chest" }]}
        currentTab={0}
        onClose={onHide}
      >
        <Chest
          state={state}
          selected={selected}
          onSelect={setSelected}
          closeModal={onHide}
          onPlace={onPlace}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
