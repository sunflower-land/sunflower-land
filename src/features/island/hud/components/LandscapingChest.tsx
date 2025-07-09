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
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Biomes } from "./inventory/Biomes";
import { LAND_BIOMES } from "features/island/biomes/biomes";
import Decimal from "decimal.js-light";

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
    (budId) => `Bud-${budId}` as BudName,
  );

  const items = getChestItems(state);
  const [selected, setSelected] = useState(
    [...buds, ...getKeys(items).sort((a, b) => a.localeCompare(b))][0],
  );
  const [currentTab, setCurrentTab] = useState<"Chest" | "Biomes">("Chest");
  const hasBiomes = getKeys(LAND_BIOMES).some((item) =>
    (state.inventory[item] ?? new Decimal(0)).gt(0),
  );
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: chest, name: "Chest" },
          ...(hasBiomes
            ? [{ icon: ITEM_DETAILS["Basic Biome"].image, name: "Biomes" }]
            : []),
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        {currentTab === "Chest" && (
          <Chest
            state={state}
            selected={selected}
            onSelect={setSelected}
            closeModal={onHide}
            onPlace={onPlace}
            onPlaceBud={onPlaceBud}
          />
        )}
        {currentTab === "Biomes" && <Biomes state={state} />}
      </CloseButtonPanel>
    </Modal>
  );
};
