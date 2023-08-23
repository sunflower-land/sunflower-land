import React, { useRef } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import chest from "assets/npcs/synced.gif";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";

import marketIcon from "assets/buildings/market_icon.png";
import firePitIcon from "assets/buildings/fire_pit_icon.png";
import workbenchIcon from "assets/buildings/workbench_icon.png";
import kitchenIcon from "assets/buildings/kitchen_icon.png";
import henHouseIcon from "assets/buildings/hen_house_icon.png";
import bakeryIcon from "assets/buildings/bakery_icon.png";
import deliIcon from "assets/buildings/deli_icon.png";
import smoothieIcon from "assets/buildings/smoothie_shack_icon.png";
import toolshedIcon from "assets/buildings/toolshed_icon.png";
import warehouseIcon from "assets/buildings/warehouse_icon.png";

export const ITEM_ICONS: Partial<Record<InventoryItemName, string>> = {
  Market: marketIcon,
  "Fire Pit": firePitIcon,
  Workbench: workbenchIcon,
  Kitchen: kitchenIcon,
  "Hen House": henHouseIcon,
  Bakery: bakeryIcon,
  Deli: deliIcon,
  "Smoothie Shack": smoothieIcon,
  Toolshed: toolshedIcon,
  Warehouse: warehouseIcon,
};

interface Props {
  state: GameState;
  selected: InventoryItemName;
  onSelect: (name: InventoryItemName) => void;
  closeModal: () => void;
  onPlace?: (name: InventoryItemName) => void;
  onDepositClick?: () => void;
  isSaving?: boolean;
}

export const Chest: React.FC<Props> = ({
  state,
  selected,
  onSelect,
  closeModal,
  isSaving,
  onPlace,
  onDepositClick,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const chestMap = getChestItems(state);

  const collectibles = getKeys(chestMap)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, item) => {
      return { ...acc, [item]: chestMap[item] };
    }, {} as Record<CollectibleName, Decimal>);

  // select first item in collectibles if the original selection is not in collectibles when they are all placed by the player
  const selectedChestItem = collectibles[selected as CollectibleName]
    ? selected
    : getKeys(collectibles)[0];

  const handlePlace = () => {
    onPlace && onPlace(selectedChestItem);

    closeModal();
  };

  const handleItemClick = (item: InventoryItemName) => {
    onSelect(item);
  };

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
        {onDepositClick && (
          <p
            className="underline text-xxs text-center mt-2 cursor-pointer"
            onClick={() => {
              onDepositClick();
              closeModal();
            }}
          >
            Deposit items from your wallet
          </p>
        )}
      </div>
    );
  }

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showPanel={!!selectedChestItem}
      panel={
        selectedChestItem && (
          <InventoryItemDetails
            details={{
              item: selectedChestItem,
            }}
            properties={{
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
        <>
          {Object.values(collectibles) && (
            <div className="flex flex-col pl-2">
              <div className="flex mb-2 flex-wrap -ml-1.5 pt-1">
                {getKeys(collectibles).map((item) => (
                  <Box
                    count={chestMap[item]}
                    isSelected={selectedChestItem === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_ICONS[item] ?? ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
              </div>
            </div>
          )}
          {onDepositClick && (
            <div className="flex w-full ml-1 my-1">
              <p
                className="underline text-xxs cursor-pointer"
                onClick={() => {
                  onDepositClick();
                  closeModal();
                }}
              >
                Deposit items from your wallet
              </p>
            </div>
          )}
        </>
      }
    />
  );
};
