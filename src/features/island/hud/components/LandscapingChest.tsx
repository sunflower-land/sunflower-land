import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { Chest } from "./inventory/Chest";
import { getChestBuds, getChestItems } from "./inventory/utils/inventory";
import { getKeys } from "features/game/types/craftables";
import { NPC_WEARABLES } from "lib/npcs";
import { BudName } from "features/game/types/buds";
import { translate } from "lib/i18n/translate";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  onPlace: (item: InventoryItemName) => void;
  onPlaceBud: (bud: BudName) => void;
}

export const LandscapingChest: React.FC<Props> = ({
  show,
  onHide,
  state,
  onPlace,
  onPlaceBud,
}) => {
  const buds = getKeys(getChestBuds(state)).map(
    (budId) => `Bud-${budId}` as BudName
  );

  const items = getChestItems(state);
  const [selected, setSelected] = useState(
    [...buds, ...getKeys(items).sort((a, b) => a.localeCompare(b))][0]
  );

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[{ icon: chest, name: translate("chest") }]}
        currentTab={0}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        <Chest
          state={state}
          selected={selected}
          onSelect={setSelected}
          closeModal={onHide}
          onPlace={onPlace}
          onPlaceBud={onPlaceBud}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
