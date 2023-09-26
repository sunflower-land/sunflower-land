import React, { useState } from "react";
import {
  Bumpkin,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import chest from "assets/icons/chest.png";
import bud from "assets/animals/plaza_bud.gif";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { BumpkinBuffsList } from "./BumpkinBuffsList";
import { BumpkinEquipBuffsList } from "./BumpkinEquipBuffsList";
import { CollectionBuffsList } from "./CollectionBuffsList";
import { BudBuffsList } from "./BudBuffsList";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
}
export type TabItems = Record<string, { items: object }>;
export type Inventory = Partial<Record<InventoryItemName, Decimal>>;
export const BuffsModal: React.FC<Props> = ({ show, onHide, state }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const { bumpkin, collectibles } = state;

  return (
    <Modal size="lg" centered show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.icons.player, name: "Bumpkin" },
          { icon: SUNNYSIDE.icons.wardrobe, name: "Equips" },
          { icon: chest, name: "Collectibles" },
          { icon: bud, name: "Buds" },
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
      >
        {currentTab === 0 && <BumpkinBuffsList bumpkin={bumpkin as Bumpkin} />}

        {currentTab === 1 && (
          <BumpkinEquipBuffsList bumpkin={bumpkin as Bumpkin} />
        )}

        {currentTab === 2 && (
          <CollectionBuffsList collectibles={collectibles} />
        )}

        {currentTab === 3 && <BudBuffsList />}
      </CloseButtonPanel>
    </Modal>
  );
};
