import React, { useState } from "react";
import { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Biomes } from "./Biomes";
import { getKeys } from "features/game/types/decorations";
import { LAND_BIOMES } from "features/island/biomes/biomes";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import { NFTName } from "features/game/events/landExpansion/placeNFT";
import { PanelTabs } from "features/game/components/CloseablePanel";
import { PlaceableLocation } from "features/game/types/collectibles";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  selectedBasketItem?: InventoryItemName;
  onSelectBasketItem: (name: InventoryItemName) => void;
  selectedChestItem?: LandscapingPlaceableType;
  onSelectChestItem: (item: LandscapingPlaceableType) => void;
  onPlace?: (name: LandscapingPlaceable) => void;
  onPlaceNFT?: (id: string, nft: NFTName) => void;
  onPlaceFarmHand?: (id: string) => void;
  onDepositClick?: () => void;
  isSaving?: boolean;
  isFarming: boolean;
  isFullUser: boolean;
  location?: PlaceableLocation;
  /** When true, open with Chest tab selected (e.g. first-time place flow). */
  defaultToChest?: boolean;
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
  onPlaceNFT,
  onPlaceFarmHand,
  isSaving,
  isFarming,
  isFullUser,
  location,
  defaultToChest,
}) => {
  const { t } = useAppTranslation();
  const initialTab: "Basket" | "Chest" | "Biomes" =
    defaultToChest || location === "petHouse" ? "Chest" : "Basket";
  const [currentTab, setCurrentTab] = useState<"Basket" | "Chest" | "Biomes">(
    initialTab,
  );

  const hasBiomes = getKeys(LAND_BIOMES).some((item) =>
    (state.inventory[item] ?? new Decimal(0)).gt(0),
  );

  const basketTab: PanelTabs<"Basket" | "Chest" | "Biomes"> = {
    icon: SUNNYSIDE.icons.basket,
    name: t("basket"),
    id: "Basket",
  };

  const chestTab: PanelTabs<"Basket" | "Chest" | "Biomes"> = {
    icon: chest,
    name: t("chest"),
    id: "Chest",
  };

  const biomesTab: PanelTabs<"Basket" | "Chest" | "Biomes"> = {
    icon: ITEM_DETAILS["Basic Biome"].image,
    name: t("biomes"),
    id: "Biomes",
  };

  const tabs: PanelTabs<"Basket" | "Chest" | "Biomes">[] = [];
  if (location !== "petHouse") {
    tabs.push(basketTab);
  }
  tabs.push(chestTab);
  if (hasBiomes && location === "farm") {
    tabs.push(biomesTab);
  }

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={tabs as PanelTabs<"Basket" | "Chest">[]}
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
            onPlaceNFT={isFarming ? onPlaceNFT : undefined}
            onDepositClick={isFullUser ? onDepositClick : undefined}
            onPlaceFarmHand={isFarming ? onPlaceFarmHand : undefined}
            isSaving={isSaving}
            location={location}
          />
        )}
        {currentTab === "Biomes" && <Biomes state={state} />}
      </CloseButtonPanel>
    </Modal>
  );
};
