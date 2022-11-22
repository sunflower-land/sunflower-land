import React, { useContext, useState } from "react";
import classNames from "classnames";

import kitchen from "assets/buildings/kitchen.png";
import npc from "assets/npcs/chef.gif";
import doing from "assets/npcs/chef_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { InventoryItemName } from "features/game/types/game";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { KitchenModal } from "./KitchenModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Kitchen: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  isBuilt,
  handleShowCraftingTimer,
  onRemove,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

  const handleCook = (item: ConsumableName) => {
    craftingService?.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    const context = craftingService?.state.context;
    const name = context?.name;
    if (!name) return;

    craftingService?.send({
      type: "COLLECT",
      item: name,
      event: "recipe.collected",
    });

    setToast({
      icon: ITEM_DETAILS[name as InventoryItemName].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      if (idle) {
        setShowModal(true);
        return;
      }

      if (crafting) {
        handleShowCraftingTimer && handleShowCraftingTimer();
        return;
      }

      if (ready) {
        handleCollect();
        return;
      }
    }
  };

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={kitchen}
          className={classNames("absolute bottom-0", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 63}px`,
            height: `${PIXEL_SCALE * 50}px`,
          }}
        />
        {(crafting || ready) && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30 pointer-events-none", {
              "img-highlight-heavy": ready,
            })}
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 10}px`,
              right: `${PIXEL_SCALE * 2}px`,
            }}
          />
        )}
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 15}px`,
          }}
        />
        {crafting ? (
          <img
            src={doing}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        ) : (
          <img
            src={npc}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,

              bottom: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <KitchenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
