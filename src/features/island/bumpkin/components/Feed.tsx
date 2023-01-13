import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  Consumable,
  ConsumableName,
  isJuice,
} from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";

import heart from "assets/icons/level_up.png";
import firePit from "src/assets/buildings/fire_pit.png";
import { Bumpkin } from "features/game/types/game";
import { RequirementLabel } from "components/ui/RequirementLabel";
import Decimal from "decimal.js-light";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  food: Consumable[];
  onFeed: (name: ConsumableName) => void;
}

export const Feed: React.FC<Props> = ({ food, onFeed }) => {
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
      content: `+${getFoodExpBoost(
        food,
        state.bumpkin as Bumpkin,
        state.collectibles
      )}`,
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
        style={{ maxHeight: 250 }}
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
        {selected !== undefined && (
          <>
            <div className="flex flex-col justify-center p-2 pb-0">
              <div className="flex space-x-2 justify-start mb-1 items-center sm:flex-col-reverse md:space-x-0">
                <div className="sm:mt-2">
                  <SquareIcon
                    icon={ITEM_DETAILS[selected.name].image}
                    width={14}
                  />
                </div>
                <span className="sm:text-center">{selected.name}</span>
              </div>
              <span className="text-xs sm:text-center">
                {ITEM_DETAILS[selected.name].description}
              </span>

              <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
                <RequirementLabel
                  type="xp"
                  xp={
                    new Decimal(
                      getFoodExpBoost(
                        selected,
                        state.bumpkin as Bumpkin,
                        state.collectibles
                      )
                    )
                  }
                />
              </div>
            </div>
            <Button
              disabled={!inventory[selected.name]?.gt(0)}
              className="whitespace-nowrap"
              onClick={() => feed(selected)}
            >
              {isJuice(selected.name) ? "Drink 1" : "Eat 1"}
            </Button>
          </>
        )}
        {selected === undefined && (
          <div className="flex flex-col justify-center items-center p-2 relative">
            <span className="text-center">Hungry?</span>
            <img
              src={firePit}
              className="h-16 img-highlight mt-3"
              alt={"Fire Pit"}
            />
            <span className="text-center mt-2 text-xs">
              You will need to cook food in order to feed your bumpkin
            </span>
          </div>
        )}
      </OuterPanel>
    </div>
  );
};
