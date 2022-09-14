import React, { useContext, useState } from "react";

import firePit from "assets/buildings/fire_pit.png";
import { MachineInterpreter } from "../../lib/craftingMachine";
import classNames from "classnames";
import { FirePitModal } from "./firePit/FirePitModal";
import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

export interface FirePitProps {
  id: string;
  crafting: boolean;
  ready: boolean;
  idle: boolean;
  name?: ConsumableName;
  craftingService: MachineInterpreter;
  handleShowCraftingTimer: () => void;
}

export const FirePit: React.FC<FirePitProps> = ({
  id: buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  handleShowCraftingTimer,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

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
      icon: ITEM_DETAILS[name].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (idle) {
      return setShowModal(true);
    }

    if (crafting) {
      console.log("isCrafting");
      console.log(handleShowCraftingTimer);
      handleShowCraftingTimer();
    }

    if (ready) {
      handleCollect();
    }
  };

  return (
    <>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        {ready && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames(
              "w-5 absolute -top-7 left-1/2 -translate-x-1/2",
              {
                "opacity-100": !crafting,
                "opacity-80": crafting,
              }
            )}
          />
        )}
        <img
          src={firePit}
          className={classNames("w-full", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
        />
      </div>

      <FirePitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
      />
    </>
  );
};
