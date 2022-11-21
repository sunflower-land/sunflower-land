import React, { useContext, useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import {
  CollectibleName,
  getKeys,
  GOBLIN_RETREAT_ITEMS,
  LimitedItemName,
  LIMITED_ITEMS,
} from "features/game/types/craftables";
import { getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import chest from "assets/npcs/synced.gif";
import { Context } from "features/game/GameProvider";
import { DECORATIONS } from "features/game/types/decorations";
import { KNOWN_IDS } from "features/game/types";
import { useActor } from "@xstate/react";
import { BEANS } from "features/game/types/beans";

const ITEM_CARD_MIN_HEIGHT = "148px";

interface Props {
  state: GameState;
  closeModal: () => void;
}

const TAB_CONTENT_HEIGHT = 400;

export const Chest: React.FC<Props> = ({ state, closeModal }: Props) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const divRef = useRef<HTMLDivElement>(null);

  const chestMap = getChestItems(state);
  const { inventory, collectibles: placedItems } = state;
  const isVisiting = gameState.matches("visiting");

  const collectibles = getKeys(chestMap).reduce((acc, item) => {
    if (
      item in LIMITED_ITEMS ||
      item in DECORATIONS() ||
      item in GOBLIN_RETREAT_ITEMS ||
      item in BEANS()
    ) {
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
        <span className="text-xs text-center mt-2 w-80">
          Your chest is empty, discover rare items today!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <OuterPanel className="flex-1 mb-3">
        {selected && (
          <>
            <div
              style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
              className="flex flex-col justify-evenly text-center items-center p-2"
            >
              <span>{selected}</span>
              <img
                src={ITEM_DETAILS[selected].image}
                className="h-12 mt-2"
                alt={selected}
              />
              <span className="text-xs mt-2 w-80">
                {ITEM_DETAILS[selected].description}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <a
                href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${KNOWN_IDS[selected]}`}
                className="underline text-xxs hover:text-blue-500 p-2 mb-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenSea
              </a>
            </div>

            {!isVisiting && (
              <Button className="text-xs w-full mb-1" onClick={handlePlace}>
                Place on map
              </Button>
            )}
          </>
        )}
      </OuterPanel>
      <div
        ref={divRef}
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className="overflow-y-auto scrollable overflow-x-hidden"
      >
        {Object.values(collectibles) && (
          <div className="flex flex-col pl-2" key={"Collectibles"}>
            <div className="flex mb-2 flex-wrap -ml-1.5 pt-1">
              {getKeys(collectibles)
                .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b])
                .map((item) => (
                  <Box
                    count={inventory[item]?.sub(
                      placedItems[item as CollectibleName]?.length ?? 0
                    )}
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
      </div>
    </div>
  );
};
