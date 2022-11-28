import React, { useContext, useState } from "react";
import classNames from "classnames";

import bakery from "assets/buildings/bakery.png";
import smoke from "assets/buildings/smoke.gif";
import goblinChef from "assets/npcs/goblin_chef.gif";
import goblinChefdoing from "assets/npcs/goblin_chef_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { BakeryModal } from "./BakeryModal";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Bakery: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  secondsLeft,
  craftingService,
  isBuilt,
  handleShowCraftingTimer,
  onRemove,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

  if (!craftingService?.initialized || !handleShowCraftingTimer) {
    return <img src={bakery} className="w-full" />;
  }

  const handleCook = (item: ConsumableName) => {
    craftingService.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
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
      // Add future on click actions here
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
      <BuildingImageWrapper
        onClick={handleClick}
        crafting={crafting}
        ready={ready}
        craftingSeconds={name ? CONSUMABLES[name].cookingSeconds : undefined}
        secondsTillReady={secondsLeft}
      >
        <img
          src={bakery}
          className={classNames("absolute bottom-0", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            left: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 62}px`,
            height: `${PIXEL_SCALE * 51}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute bottom-0 pointer-events-none"
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
              width: `${PIXEL_SCALE * 25}px`,
              left: `${PIXEL_SCALE * 27}px`,
              bottom: `${PIXEL_SCALE * 1}px`,
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
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              left: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 44}px`,
            }}
          />
        )}

        {(crafting || ready) && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30 pointer-events-none", {
              "img-highlight-heavy": ready,
            })}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (
                !img ||
                !img.complete ||
                !img.naturalWidth ||
                !img.naturalHeight
              ) {
                return;
              }

              const left = Math.floor(21 - img.naturalWidth / 2);
              img.style.left = `${PIXEL_SCALE * left}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 4}px`,
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
