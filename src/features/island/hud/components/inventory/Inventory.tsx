import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

import basket from "assets/icons/basket.png";
import roundButton from "assets/ui/button/round_button.png";

import { Box } from "components/ui/Box";

import { InventoryItems } from "./InventoryItems";

import { ITEM_DETAILS } from "features/game/types/images";
import {
  CombinedGameContext,
  CombinedGameService,
  InventoryItemName,
} from "features/game/types/game";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName } from "features/game/types/craftables";
import { useActor } from "@xstate/react";

interface Props {
  context: CombinedGameContext;
  isFarming?: boolean;
}

export const Inventory: React.FC<Props> = ({ context, isFarming }) => {
  const service = (context?.retreat?.goblinService ||
    context?.game?.gameService) as CombinedGameService;
  const shortcutItem =
    context?.retreat?.shortcutItem || context?.game?.shortcutItem;
  const [gameState] = useActor(service);
  const { state } = gameState.context;

  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = getShortcuts();

  const handleInventoryClick = () => {
    setIsOpen(true);
  };

  const handleItemClick = (item: InventoryItemName) => {
    if (!shortcutItem) return;

    shortcutItem(item);
  };

  return (
    <div
      className="flex flex-col items-center fixed z-50"
      style={{
        right: `${PIXEL_SCALE * 3}px`,
        top: `${PIXEL_SCALE * 50}px`,
      }}
    >
      <div
        onClick={handleInventoryClick}
        className="relative flex z-50 cursor-pointer hover:img-highlight"
        style={{
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginBottom: `${PIXEL_SCALE * 25}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <img
          src={roundButton}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={basket}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <InventoryItems context={context} onClose={() => setIsOpen(false)} />
      </Modal>

      {isFarming && (
        <div
          className="flex flex-col items-center"
          style={{
            marginRight: `${PIXEL_SCALE * -3}px`,
          }}
        >
          {shortcuts.map((item, index) => (
            <Box
              key={index}
              isSelected={index === 0}
              image={ITEM_DETAILS[item]?.image}
              secondaryImage={ITEM_DETAILS[item]?.secondaryImage}
              count={state.inventory[item]?.sub(
                state.collectibles[item as CollectibleName]?.length ?? 0
              )}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
