import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import confirm from "assets/icons/confirm.png";
import token from "assets/icons/token_2.png";
import questionMark from "assets/icons/expression_confused.png";
import grubShopIcon from "assets/bumpkins/small/hats/chef_hat.png";
import stopwatch from "assets/icons/stopwatch.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { secondsToString } from "lib/utils/time";
import { GrubShop } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

interface Props {
  onClose: () => void;
}

export const GrubShopModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const grubShop = state.grubShop as GrubShop;
  const [selectedId, setSelectedId] = useState<string>(
    grubShop.orders[0].id || ""
  );

  const selected = grubShop.orders.find((order) => order.id === selectedId);

  const secondsLeft = (grubShop.closesAt - Date.now()) / 1000;

  const handleSell = () => {
    gameService.send("grubOrder.fulfilled", {
      id: selectedId,
    });

    // Show the SFL they gained in a toast
  };

  const selectedFulFilled = !!state.grubOrdersFulfilled?.find(
    (order) => order.id === selectedId
  );

  const fulFilledOrders = grubShop.orders.filter((order) =>
    state.grubOrdersFulfilled?.find((fulfilled) => fulfilled.id === order.id)
  );

  const hiddenPositionStart = 3 + fulFilledOrders.length;

  const Content = () => {
    const isClosed = grubShop.closesAt < Date.now();
    if (isClosed) {
      return (
        <div className="p-2">
          <p>The Grub Shop is closed on Tuesdays.</p>
          <p className="mt-4 text-sm">
            Come back tomorrow to view the Grublin Orders.
          </p>
        </div>
      );
    }

    return (
      <>
        <div
          style={{
            minHeight: "200px",
          }}
        >
          <div className="flex">
            <div className="w-3/5 flex flex-wrap h-fit">
              {Object.values(grubShop.orders).map((item, index) => {
                const isFulfilled = !!state.grubOrdersFulfilled?.find(
                  (order) => order.id === item.id
                );
                return (
                  <Box
                    isSelected={selectedId === item.id}
                    key={item.name}
                    onClick={() => setSelectedId(item.id)}
                    image={
                      index <= hiddenPositionStart
                        ? ITEM_DETAILS[item.name].image
                        : questionMark
                    }
                    showOverlay={isFulfilled}
                    overlayIcon={
                      <img
                        src={confirm}
                        id="confirm"
                        alt="confirm"
                        className="relative object-contain"
                        style={{
                          width: `${PIXEL_SCALE * 12}px`,
                        }}
                      />
                    }
                    disabled={index > hiddenPositionStart}
                    count={
                      index <= hiddenPositionStart
                        ? state.inventory[item.name]
                        : undefined
                    }
                  />
                );
              })}
            </div>
            {selected && (
              <OuterPanel className="flex flex-col items-center relative">
                <Label
                  type={selectedFulFilled ? "success" : "info"}
                  className="flex justify-center items-center"
                >
                  {selectedFulFilled ? (
                    <span className="text-center text-xxs">
                      Order fulfilled
                    </span>
                  ) : (
                    <>
                      <img src={stopwatch} className="w-3 left-0 mr-1" />
                      <span className="mt-0.5">{`${secondsToString(
                        secondsLeft as number,
                        { length: "medium" }
                      )} left`}</span>
                    </>
                  )}
                </Label>
                <div className="flex flex-col justify-center items-center p-2 ">
                  <span className="text-center">{selected.name}</span>
                  <img
                    src={ITEM_DETAILS[selected.name].image}
                    className="h-16 img-highlight mt-1"
                    alt={selected.name}
                  />
                  <span className="text-center mt-2 sm:text-sm">
                    {ITEM_DETAILS[selected.name].description}
                  </span>

                  <div className="border-t border-white w-full mt-2 pt-1">
                    <div className="flex justify-center items-end">
                      <img src={token} className="h-5 mr-1" />
                      <span className="text-xs text-center mt-2 ">
                        {`$${selected.sfl.toNumber()}`}
                      </span>
                    </div>
                  </div>
                  {!selectedFulFilled && (
                    <Button
                      disabled={
                        !state.inventory[selected.name] ||
                        state.inventory[selected.name]?.lt(1)
                      }
                      className="text-xs mt-1"
                      onClick={handleSell}
                    >
                      Sell
                    </Button>
                  )}
                </div>
              </OuterPanel>
            )}
          </div>
        </div>
      </>
    );
  };
  return (
    <Panel
      className="relative"
      hasTabs
      bumpkinParts={{
        body: "Goblin Potion",
        hair: "Sun Spots",
        pants: "Lumberjack Overalls",
        tool: "Golden Spatula",
        background: "Farm Background",
        hat: "Chef Hat",
        shoes: "Black Farmer Boots",
      }}
    >
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 1}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive>
          <img src={grubShopIcon} className="h-5 mr-2" />
          <span className="text-sm">Grub Shop</span>
        </Tab>
        <img
          src={close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      {Content()}
    </Panel>
  );
};
