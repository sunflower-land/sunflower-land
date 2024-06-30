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
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  selectedBasketItem?: InventoryItemName;
  onSelectBasketItem: (name: InventoryItemName) => void;
  selectedChestItem: InventoryItemName | BudName;
  onSelectChestItem: (name: InventoryItemName | BudName) => void;
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
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { t } = useAppTranslation();
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.icons.basket, name: t("basket") },
          { icon: chest, name: t("chest") },
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
        container={OuterPanel}
      >
        {currentTab === 0 && (
          <Basket
            gameState={state}
            selected={selectedBasketItem}
            onSelect={onSelectBasketItem}
          />
        )}
        {currentTab === 1 && (
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
      </CloseButtonPanel>
    </Modal>
  );
};
