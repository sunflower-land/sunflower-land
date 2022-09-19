import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Consumable, ConsumableName } from "features/game/types/consumables";

import staminaIcon from "assets/icons/lightning.png";
import heart from "assets/icons/heart.png";

interface Props {
  food: Consumable[];
  onClose: () => void;
  onFeed: (name: ConsumableName) => void;
}

export const Feed: React.FC<Props> = ({ food, onClose, onFeed }) => {
  const [selected, setSelected] = useState<Consumable>(food[0]);
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const feed = () => {
    onFeed(selected.name);

    setToast({
      icon: ITEM_DETAILS[selected.name].image,
      content: `-1`,
    });
    //   setToast({
    //     icon: ENERGY,
    //     content: `+1`,
    //   });
    //   setToast({
    //     icon: XP,
    //     content: `-1`,
    //   });

    shortcutItem(selected.name);

    onClose();
  };

  return (
    <div className="flex">
      <div className="w-1/2 flex flex-wrap h-fit">
        {food.map((item) => (
          <Box
            isSelected={selected.name === item.name}
            key={item.name}
            onClick={() => setSelected(item)}
            image={ITEM_DETAILS[item.name].image}
            count={inventory[item.name]}
          />
        ))}
      </div>
      <OuterPanel className="flex-1 w-1/2">
        <div className="flex flex-col justify-center items-center p-2 relative">
          <span className="text-shadow text-center">{selected.name}</span>
          <img
            src={ITEM_DETAILS[selected.name].image}
            className="h-16 img-highlight mt-1"
            alt={selected.name}
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {ITEM_DETAILS[selected.name].description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1">
            <div className="flex justify-center flex-wrap items-center">
              <img src={heart} className="me-2 w-6" />
              <span className="text-xs text-shadow text-center">
                {`${selected.experience}`}
              </span>
            </div>
            <div className="flex justify-center flex-wrap items-center">
              <img src={staminaIcon} className="me-2 w-6" />
              <span className="text-xs text-shadow text-center">
                {`${selected.stamina}`}
              </span>
            </div>
          </div>
          <Button
            disabled={!inventory[selected.name]?.gt(0)}
            className="text-xxs sm:text-xs mt-1 whitespace-nowrap"
            onClick={() => feed()}
          >
            Eat 1
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
