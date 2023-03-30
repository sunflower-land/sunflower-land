import React, { useRef } from "react";
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
import { KNOWN_IDS } from "features/game/types";
import { BEANS } from "features/game/types/beans";
import {
  GOBLIN_BLACKSMITH_ITEMS,
  GOBLIN_PIRATE_ITEMS,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { AUCTIONEER_ITEMS } from "features/game/types/auctioneer";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";
import { DECORATION_DIMENSIONS } from "features/game/types/decorations";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

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
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b])
    .reduce((acc, item) => {
      if (
        item in LIMITED_ITEMS ||
        item in AUCTIONEER_ITEMS ||
        item in BEANS() ||
        item in HELIOS_BLACKSMITH_ITEMS ||
        item in GOBLIN_BLACKSMITH_ITEMS ||
        item in GOBLIN_PIRATE_ITEMS ||
        item in DECORATION_DIMENSIONS ||
        item in RESOURCE_DIMENSIONS
      ) {
        return { ...acc, [item]: chestMap[item] };
      }
      return acc;
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
        <p className="underline text-xxs mt-2 cursor-pointer">
          Deposit item from your wallet
        </p>
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
                    image={ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
              </div>
            </div>
          )}
          {onDepositClick && (
            <p
              className="underline text-xxs ml-2 my-1 cursor-pointer"
              onClick={() => {
                onDepositClick();
                closeModal();
              }}
            >
              Deposit item from your wallet
            </p>
          )}
        </>
      }
    />
  );
};
