import React, { useContext, useState } from "react";
import classNames from "classnames";

import bakery from "assets/buildings/bakery.png";
import smoke from "assets/buildings/smoke.gif";
import goblinChef from "assets/npcs/goblin_chef.gif";
import goblinChefdoing from "assets/npcs/goblin_chef_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { BakeryModal } from "./BakeryModal";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Bakery: React.FC<Props> = ({
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

  if (!craftingService || !handleShowCraftingTimer)
    return <img src={bakery} className="w-full" />;

  const handleCook = (item: ConsumableName) => {
    craftingService.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    const { name } = craftingService.state.context;

    if (!name) return;

    craftingService.send({
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
      if (idle) {
        setShowModal(true);
        return;
      }

      if (crafting) {
        handleShowCraftingTimer();
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
        {ready && name && (
          <div className="flex justify-center absolute -top-7 w-full">
            <img src={ITEM_DETAILS[name].image} className="w-5 ready" />
          </div>
        )}
        <img
          src={bakery}
          className={classNames("absolute bottom-0", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            height: `${PIXEL_SCALE * 51}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 28}px`,
          }}
        />
        {crafting ? (
          <img
            src={goblinChefdoing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              left: `${PIXEL_SCALE * 27}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={goblinChef}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              left: `${PIXEL_SCALE * 27}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}
        {crafting && (
          <img
            src={smoke}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              left: `${PIXEL_SCALE * 11.5}px`,
              bottom: `${PIXEL_SCALE * 45}px`,
            }}
          />
        )}

        {name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30", {
              "img-highlight-heavy": ready,
            })}
            style={{
              // TODO - dynamically get correct width
              width: `${PIXEL_SCALE * 12}px`,
              bottom: `${PIXEL_SCALE * 4.5}px`,
              left: `${PIXEL_SCALE * 13.7}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <BakeryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
