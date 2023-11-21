import React, { useContext, useState } from "react";

import token from "assets/icons/token_2.png";
import grubShopIcon from "assets/icons/chef_hat.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Bumpkin, GrubShop } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "../Tutorial";
import { getOrderSellPrice } from "features/game/expansion/lib/boosts";
import { SUNNYSIDE } from "assets/sunnyside";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const GrubShopModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Grub Shop")
  );
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
  };

  const selectedFulFilled = !!state.grubOrdersFulfilled?.find(
    (order) => order.id === selectedId
  );

  const fulFilledOrders = grubShop.orders.filter((order) =>
    state.grubOrdersFulfilled?.find((fulfilled) => fulfilled.id === order.id)
  );

  const isAllFullFilled = fulFilledOrders.length === grubShop.orders.length;

  const hiddenPositionStart = 3 + fulFilledOrders.length;

  const bumpkinParts: Partial<Equipped> = {
    body: "Goblin Potion",
    hair: "Sun Spots",
    pants: "Lumberjack Overalls",
    tool: "Golden Spatula",
    background: "Farm Background",
    hat: "Chef Hat",
    shoes: "Black Farmer Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Grub Shop");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />;
  }

  const labelState = () => {
    if (selectedFulFilled) {
      return (
        <Label type="success" className="-mt-2 mb-1">
          Order fulfilled
        </Label>
      );
    }

    return <CountdownLabel timeLeft={secondsLeft} endText="left" />;
  };

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
          <div className="flex flex-col-reverse sm:flex-row">
            <div className="flex md:flex-row flex-wrap w-full sm:w-3/5 h-fit max-h-48 sm:max-h-96 overflow-y-auto scrollable overflow-x-hidden p-1 mt-1 sm:mt-0 sm:mr-1">
              {isAllFullFilled && (
                <div className="flex items-center mb-2">
                  <p className="text-xs mr-2">More orders in</p>
                  <CountdownLabel timeLeft={secondsLeft} />
                </div>
              )}
              <div className="flex flex-wrap">
                {Object.values(grubShop.orders).map((item, index) => {
                  const isFulfilled = !!state.grubOrdersFulfilled?.find(
                    (order) => order.id === item.id
                  );
                  return (
                    <Box
                      isSelected={selectedId === item.id}
                      key={`${item.name}-${index}`}
                      onClick={() => setSelectedId(item.id)}
                      image={
                        index <= hiddenPositionStart
                          ? ITEM_DETAILS[item.name].image
                          : SUNNYSIDE.icons.expression_confused
                      }
                      showOverlay={isFulfilled}
                      overlayIcon={
                        <img
                          src={SUNNYSIDE.icons.confirm}
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
              <div className="px-1 mt-1">
                <div className="flex">
                  <a
                    href="https://docs.sunflower-land.com/player-guides/seasons#seasonal-tickets"
                    target="_blank"
                    className="text-xxs underline hover:text-blue-500"
                    rel="noreferrer"
                  >
                    Bonus Offer
                  </a>
                  <img src={SUNNYSIDE.icons.timer} className="h-4 ml-2" />
                  {/* TEMP */}
                  {Date.now() < new Date("2023-05-03T00:00:00").getTime() && (
                    <img
                      src={ITEM_DETAILS[getSeasonalTicket()].image}
                      className="h-4 ml-1"
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <p className="text-xxs">
                    Earn 10 Seasonal Tickets for each meal.
                  </p>
                </div>

                {/* TEMP */}
                {Date.now() < new Date("2023-05-03T00:00:00").getTime() && (
                  <>
                    <div className="flex mt-2">
                      <a
                        href="https://docs.sunflower-land.com/player-guides/seasons#seasonal-tickets"
                        target="_blank"
                        className="text-xxs underline hover:text-blue-500"
                        rel="noreferrer"
                      >
                        Dawn Breaker
                      </a>
                      <img
                        src={ITEM_DETAILS["Dawn Breaker Ticket"].image}
                        className="h-4 ml-1"
                      />
                    </div>
                    <div className="flex items-center">
                      <p className="text-xxs">
                        Dawn Breaker Tickets will become available on the next
                        set of orders.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {selected && (
              <OuterPanel className="w-full flex-1">
                <div className="flex flex-col justify-center items-start sm:items-center p-2 pb-0 relative">
                  {labelState()}
                  <div className="flex space-x-2 justify-start my-1 sm:items-center sm:flex-col-reverse md:space-x-0">
                    <img
                      src={ITEM_DETAILS[selected.name].image}
                      className="w-5 object-contain sm:w-8 sm:my-1"
                      alt={selected.name}
                    />
                    <span className="text-center">{selected.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm sm:text-center">
                    {ITEM_DETAILS[selected.name].description}
                  </span>
                  <div className="border-t border-white w-full my-2" />
                  <div className="flex justify-between px-1 mb-2 max-h-14 sm:max-h-full sm:flex-col sm:items-center">
                    <div className="flex justify-center space-x-1 items-center sm:justify-center">
                      <img src={token} className="h-4 sm:h-5" />
                      <span className="text-xs text-center">
                        {`${getOrderSellPrice(
                          state.bumpkin as Bumpkin,
                          selected
                        )}`}
                      </span>
                    </div>
                  </div>
                </div>
                {!selectedFulFilled && (
                  <Button
                    disabled={
                      !state.inventory[selected.name] ||
                      state.inventory[selected.name]?.lt(1)
                    }
                    className="text-xxs sm:text-xs"
                    onClick={handleSell}
                  >
                    {t("sell")} 1
                  </Button>
                )}
              </OuterPanel>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <Panel className="relative" hasTabs bumpkinParts={bumpkinParts}>
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
          <span className="text-sm whitespace-nowrap">Grub Shop</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
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
