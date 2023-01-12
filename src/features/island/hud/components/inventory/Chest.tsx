import React, { useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import {
  CollectibleName,
  getKeys,
  GOBLIN_RETREAT_ITEMS,
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
import { SplitScreenView } from "features/game/components/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";

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
        item in GOBLIN_RETREAT_ITEMS ||
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

  const handlePlace = () => {
    onPlace && onPlace(selected);

    closeModal();
  };

  const handleItemClick = (item: InventoryItemName) => {
    setSelected(item);
  };

  const chestIsEmpty = getKeys(collectibles).length === 0;

  if (chestIsEmpty) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img src={chest} className="h-12" alt="Empty Chest" />
        <span className="text-xs text-center mt-2 w-80">
          Your chest is empty, discover rare items today!
        </span>
      </div>
    );
  }

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showHeader={!chestIsEmpty && !!selected}
      header={
        selected && (
          <>
            <div className="flex flex-col justify-center p-2 pb-0">
              <div className="flex space-x-2 justify-start mb-1 items-center sm:flex-col-reverse md:space-x-0">
                <div className="sm:mt-2">
                  <SquareIcon icon={ITEM_DETAILS[selected].image} width={14} />
                </div>
                <span className="sm:text-center">{selected}</span>
              </div>
              <span className="text-xs sm:text-center">
                {ITEM_DETAILS[selected].description}
              </span>
              <div className="border-t border-white w-full my-2 pt-1 flex justify-between sm:flex-col sm:items-center">
                <a
                  href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${KNOWN_IDS[selected]}`}
                  className="underline text-xxs hover:text-blue-500 p-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenSea
                </a>
              </div>
            </div>
            {onPlace && (
              <Button onClick={handlePlace} disabled={isSaving}>
                {isSaving ? "Saving..." : "Place on map"}
              </Button>
            )}
          </>
        )
      }
      content={
        <>
          {Object.values(collectibles) && (
            <div className="flex flex-col pl-2" key={"Collectibles"}>
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
          )}
        </>
      }
    />
  );
};
