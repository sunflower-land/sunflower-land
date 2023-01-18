import React, { useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import {
  CollectibleName,
  getKeys,
  LIMITED_ITEMS,
} from "features/game/types/craftables";
import { getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import chest from "assets/npcs/synced.gif";
import { DECORATIONS } from "features/game/types/decorations";
import { KNOWN_IDS } from "features/game/types";
import { BEANS } from "features/game/types/beans";
import { setPrecision } from "lib/utils/formatNumber";
import {
  GOBLIN_BLACKSMITH_ITEMS,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { AUCTIONEER_ITEMS } from "features/game/types/auctioneer";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CraftingRequirementsView } from "components/ui/CraftingRequirementsView";

interface Props {
  state: GameState;
  closeModal: () => void;
  onPlace?: (name: InventoryItemName) => void;
  isSaving?: boolean;
}

export const Chest: React.FC<Props> = ({
  state,
  closeModal,
  isSaving,
  onPlace,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);

  const chestMap = getChestItems(state);
  const { inventory, collectibles: placedItems } = state;

  const getItemCount = (item: InventoryItemName) => {
    const count =
      inventory[item]?.sub(placedItems[item as CollectibleName]?.length ?? 0) ??
      new Decimal(0);

    return setPrecision(count);
  };

  const collectibles = getKeys(chestMap)
    .filter((item) => getItemCount(item).greaterThan(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b])
    .reduce((acc, item) => {
      if (
        item in LIMITED_ITEMS ||
        item in DECORATIONS() ||
        item in AUCTIONEER_ITEMS ||
        item in BEANS() ||
        item in HELIOS_BLACKSMITH_ITEMS ||
        item in GOBLIN_BLACKSMITH_ITEMS
      ) {
        return { ...acc, [item]: chestMap[item] };
      }
      return acc;
    }, {} as Record<CollectibleName, Decimal>);

  const [selected, setSelected] = useState<InventoryItemName>(
    getKeys(collectibles)[0]
  );

  const chestIsEmpty = getKeys(collectibles).length === 0;
  if (chestIsEmpty) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img
          src={chest}
          alt="Empty Chest"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          Your chest is empty, discover rare items today!
        </span>
      </div>
    );
  }

  const handlePlace = () => {
    onPlace && onPlace(selected);

    closeModal();
  };

  const handleItemClick = (item: InventoryItemName) => {
    setSelected(item);
  };

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showHeader={!!selected}
      header={
        selected && (
          <CraftingRequirementsView
            gameState={state}
            details={{
              type: "item",
              item: selected,
            }}
            requirements={{
              showOpenSeaLink: true,
            }}
            actionView={
              onPlace && (
                <Button onClick={handlePlace} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Place on map"}
                </Button>
              )
            }
          />
        )
      }
      content={
        Object.values(collectibles) && (
          <div className="flex flex-col pl-2">
            <div className="flex mb-2 flex-wrap -ml-1.5 pt-1">
              {getKeys(collectibles).map((item) => (
                <Box
                  count={getItemCount(item)}
                  isSelected={selected === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                  parentDivRef={divRef}
                />
              ))}
            </div>
          </div>
        )
      }
    />
  );
};
