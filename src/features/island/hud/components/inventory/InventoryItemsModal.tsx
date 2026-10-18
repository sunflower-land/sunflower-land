import React, { useState } from "react";
import type { GameState, InventoryItemName } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import Decimal from "decimal.js-light";
import { Basket } from "./Basket";
import { Chest } from "./Chest";
import { Wardrobe } from "./Wardrobe";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Biomes } from "./Biomes";
import { getKeys } from "lib/object";
import { LAND_BIOMES } from "features/island/biomes/biomes";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import type { NFTName } from "features/game/events/landExpansion/placeNFT";
import type { PanelTabs } from "features/game/components/CloseablePanel";
import type { PlaceableLocation } from "features/game/types/collectibles";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  selectedBasketItem?: InventoryItemName;
  onSelectBasketItem: (name: InventoryItemName) => void;
  onOpenMarketplace?: (
    name: InventoryItemName,
    tab: "Basket" | "Chest",
  ) => void;
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

type TabId = "Basket" | "Chest" | "Wardrobe" | "Biomes";

export const InventoryItemsModal: React.FC<Props> = ({
  show,
  onHide,
  state,
  selectedBasketItem,
  onSelectBasketItem,
  onOpenMarketplace,
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
  const initialTab: TabId =
    defaultToChest || location === "petHouse" ? "Chest" : "Basket";
  const [currentTab, setCurrentTab] = useState<TabId>(initialTab);

  const hasBiomes = getKeys(LAND_BIOMES).some((item) =>
    (state.inventory[item] ?? new Decimal(0)).gt(0),
  );

  const basketTab: PanelTabs<TabId> = {
    icon: SUNNYSIDE.icons.basket,
    name: t("basket"),
    id: "Basket",
  };

  const chestTab: PanelTabs<TabId> = {
    icon: chest,
    name: t("chest"),
    id: "Chest",
  };

  const wardrobeTab: PanelTabs<TabId> = {
    icon: SUNNYSIDE.icons.wardrobe,
    name: t("wardrobe"),
    id: "Wardrobe",
  };

  const biomesTab: PanelTabs<TabId> = {
    icon: ITEM_DETAILS["Basic Biome"].image,
    name: t("biomes"),
    id: "Biomes",
  };

  const tabs: PanelTabs<TabId>[] = [basketTab, chestTab, wardrobeTab];

  if (hasBiomes && location === "farm") {
    tabs.push(biomesTab);
  }

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={tabs as PanelTabs<TabId>[]}
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
            onOpenMarketplace={
              onOpenMarketplace && ((item) => onOpenMarketplace(item, "Basket"))
            }
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
            onOpenMarketplace={
              onOpenMarketplace && ((item) => onOpenMarketplace(item, "Chest"))
            }
            isSaving={isSaving}
            location={location}
          />
        )}
        {currentTab === "Wardrobe" && <Wardrobe state={state} />}
        {currentTab === "Biomes" && <Biomes state={state} />}
      </CloseButtonPanel>
    </Modal>
  );
};
