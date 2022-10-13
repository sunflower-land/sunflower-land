import React, { useContext, useState } from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import {
  getKeys,
  LimitedItemName,
  LIMITED_ITEMS,
} from "features/game/types/craftables";
import { getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import chest from "assets/npcs/synced.gif";
import { Context } from "features/game/GameProvider";

const ITEM_CARD_MIN_HEIGHT = "148px";

interface Props {
  state: GameState;
  closeModal: () => void;
}

const TAB_CONTENT_HEIGHT = 400;

export const Chest: React.FC<Props> = ({ state, closeModal }: Props) => {
  const { gameService } = useContext(Context);
  const [scrollIntoView] = useScrollIntoView();

  const chestMap = getChestItems(state);

  console.log({ chestMap });
  const collectibles = getKeys(chestMap).reduce((acc, item) => {
    if (item in LIMITED_ITEMS) {
      return { ...acc, [item]: chestMap[item] };
    }
    return acc;
  }, {} as Record<LimitedItemName, Decimal>);

  const [selected, setSelected] = useState<InventoryItemName>(
    getKeys(collectibles)[0]
  );

  const handlePlace = () => {
    gameService.send("EDIT", {
      placeable: selected,
      action: "collectible.placed",
    });
    closeModal();
    scrollIntoView(Section.GenesisBlock);
  };

  const handleItemClick = (item: InventoryItemName) => {
    setSelected(item);

    if (item && ITEM_DETAILS[item].section) {
      scrollIntoView(ITEM_DETAILS[item].section);
    }
  };

  const basketIsEmpty = Object.values(chestMap).length === 0;

  if (basketIsEmpty) {
    return (
      <div
        style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
        className="flex flex-col justify-evenly items-center p-2"
      >
        <img src={chest} className="h-12" alt="Empty Chest" />
        <span className="text-xs text-shadow text-center mt-2 w-80">
          Your chest is empty, discover rare items today!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {
        <OuterPanel className="flex-1 mb-3">
          {selected && (
            <>
              <div
                style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
                className="flex flex-col justify-evenly items-center p-2"
              >
                <span className="text-center text-shadow">{selected}</span>
                <img
                  src={ITEM_DETAILS[selected].image}
                  className="h-12"
                  alt={selected}
                />
                <span className="text-xs text-shadow text-center mt-2 w-80">
                  {ITEM_DETAILS[selected].description}
                </span>
              </div>
              <Button className="text-xs w-full mb-1" onClick={handlePlace}>
                Place on map
              </Button>
            </>
          )}
        </OuterPanel>
      }
      <div
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className="overflow-y-auto scrollable"
      >
        {Object.values(collectibles) && (
          <div className="flex flex-col pl-2" key={"Collectibles"}>
            <div className="flex mb-2 flex-wrap -ml-1.5 pt-1">
              {getKeys(collectibles).map((item) => (
                <Box
                  count={state.inventory[item]}
                  isSelected={selected === item}
                  key={item}
                  onClick={() => handleItemClick(item)}
                  image={ITEM_DETAILS[item].image}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
