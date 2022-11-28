import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Consumable, ConsumableName } from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import heart from "assets/icons/level_up.png";
import firePit from "src/assets/buildings/fire_pit.png";
import { Bumpkin } from "features/game/types/game";
import { TAB_CONTENT_HEIGHT } from "features/island/hud/components/inventory/Basket";

interface Props {
  food: Consumable[];
  onClose: () => void;
  onFeed: (name: ConsumableName) => void;
}

export const Feed: React.FC<Props> = ({ food, onClose, onFeed }) => {
  const [selected, setSelected] = useState<Consumable | undefined>(food[0]);
  const { setToast } = useContext(ToastContext);
  const { gameService, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  useEffect(() => {
    if (food.length) {
      setSelected(food[0]);
    } else {
      setSelected(undefined);
    }
  }, [food.length]);

  const feed = (food: Consumable) => {
    onFeed(food.name);

    setToast({
      icon: heart,
      content: `+${getFoodExpBoost(food, state.bumpkin as Bumpkin)}`,
    });
    setToast({
      icon: ITEM_DETAILS[food.name].image,
      content: `-1`,
    });

    shortcutItem(food.name);
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row">
      <div
        className="w-full sm:w-3/5 h-fit overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1 flex flex-wrap"
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
      >
        {selected !== undefined &&
          food.map((item) => (
            <Box
              isSelected={selected.name === item.name}
              key={item.name}
              onClick={() => setSelected(item)}
              image={ITEM_DETAILS[item.name].image}
              count={inventory[item.name]}
            />
          ))}
        {selected === undefined && (
          <span className="p-1">No food in inventory</span>
        )}
      </div>
      <OuterPanel className="w-full flex-1">
        <div className="flex flex-col justify-center items-center p-2 relative">
          {selected !== undefined && (
            <>
              <span className="text-center mb-1">{selected.name}</span>
              <img
                src={ITEM_DETAILS[selected.name].image}
                className="h-16 img-highlight mt-2"
                alt={selected.name}
              />
              <span className="text-center mt-2 text-sm">
                {ITEM_DETAILS[selected.name].description}
              </span>

              <div className="border-t border-white w-full mt-2 pt-1">
                <div className="flex justify-center flex-wrap items-center">
                  <img src={heart} className="me-2 w-6" />
                  <span className="text-xs text-center">
                    {`${getFoodExpBoost(
                      selected,
                      state.bumpkin as Bumpkin
                    )} EXP`}
                  </span>
                </div>
              </div>
              <Button
                disabled={!inventory[selected.name]?.gt(0)}
                className="text-sm mt-1 whitespace-nowrap"
                onClick={() => feed(selected)}
              >
                Eat 1
              </Button>
            </>
          )}
          {selected === undefined && (
            <>
              <span className="text-center">Hungry?</span>
              <img
                src={firePit}
                className="h-16 img-highlight mt-3"
                alt={"Fire Pit"}
              />
              <span className="text-center mt-2 text-sm">
                You will need to cook food in order to feed your bumpkin
              </span>
            </>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
