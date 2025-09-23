import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { BudName } from "features/game/types/buds";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Biomes } from "./Biomes";
import { getKeys } from "features/game/types/decorations";
import { LAND_BIOMES } from "features/island/biomes/biomes";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  selectedBasketItem?: InventoryItemName;
  onSelectBasketItem: (name: InventoryItemName) => void;
  selectedChestItem?: LandscapingPlaceable;
  onSelectChestItem: (name: LandscapingPlaceable) => void;
  onPlace?: (name: InventoryItemName) => void;
  onPlaceBud?: (bud: BudName) => void;
  onDepositClick?: () => void;
  isSaving?: boolean;
  isFarming: boolean;
  isFullUser: boolean;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const InventoryItemsModal: React.FC<Props> = ({
  show,
  onHide,
  state,
  selectedBasketItem,
  onSelectBasketItem,
  selectedChestItem,
  onSelectChestItem,
  onDepositClick,
  onPlace,
  onPlaceBud,
  isSaving,
  isFarming,
  isFullUser,
}) => {
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<"Basket" | "Chest" | "Biomes">(
    "Basket",
  );
  const hasBiomes = getKeys(LAND_BIOMES).some((item) =>
    (state.inventory[item] ?? new Decimal(0)).gt(0),
  );
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.icons.basket, name: t("basket"), id: "Basket" },
          { icon: chest, name: t("chest"), id: "Chest" },
          ...(hasBiomes
            ? [
                {
                  icon: ITEM_DETAILS["Basic Biome"].image,
                  name: t("biomes"),
                  id: "Biomes",
                },
              ]
            : []),
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
        container={OuterPanel}
      >
        {currentTab === "Basket" && (
          <Basket
            gameState={state}
            selected={selectedBasketItem}
            onSelect={onSelectBasketItem}
          />
        )}
        {currentTab === "Chest" && (
          <Chest
            state={state}
            selected={selectedChestItem}
            onSelect={onSelectChestItem}
            closeModal={onHide}
            onPlace={isFarming ? onPlace : undefined}
            onPlaceBud={isFarming ? onPlaceBud : undefined}
            onDepositClick={isFullUser ? onDepositClick : undefined}
            isSaving={isSaving}
          />
        )}
        {currentTab === "Biomes" && <Biomes state={state} />}
      </CloseButtonPanel>
    </Modal>
  );
};
