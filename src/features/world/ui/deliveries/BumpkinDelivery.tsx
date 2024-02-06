import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { OrderCards } from "./DeliveryPanelContent";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Bumpkin, GameState, Inventory, Order } from "features/game/types/game";
import { Button } from "components/ui/Button";

import giftIcon from "assets/icons/gift.png";
import chatDisc from "assets/icons/chat_disc.png";
import box from "assets/icons/box.png";
import flowerGift from "assets/icons/flower_gift.png";
import sfl from "assets/icons/token_2.png";
import chest from "assets/icons/chest.png";

import { SpeakingText } from "features/game/components/SpeakingModal";
import { TypingMessage } from "../TypingMessage";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getOrderSellPrice } from "features/game/events/landExpansion/deliver";
import { getSeasonalTicket } from "features/game/types/seasons";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { Box } from "components/ui/Box";

export const Dialogue: React.FC<{
  message: string;
  trail?: number;
}> = ({ message, trail = 30 }) => {
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        const newDisplayedMessage = message.substring(0, currentIndex + 1);
        setDisplayedMessage(newDisplayedMessage);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, trail);

    return () => {
      clearInterval(interval);
    };
  }, [message, trail, currentIndex]);

  return <div className="leading-[1] text-[16px]">{displayedMessage}</div>;
};

export const OrderCard: React.FC<{
  order: Order;
  balance: Decimal;
  inventory: Inventory;
  onDeliver: () => void;
  hasRequirementsCheck: (order: Order) => boolean;
}> = ({ order, inventory, balance, onDeliver, hasRequirementsCheck }) => {
  const canDeliver = hasRequirementsCheck(order);
  return (
    <>
      <div className="">
        <div
          key={order.id}
          className={classNames("flex flex-1 flex-col space-y-1 relative", {
            "opacity-50 cursor-default": !canDeliver,
          })}
        >
          <OuterPanel className="-ml-2 -mr-2 relative flex flex-col space-y-0.5">
            {getKeys(order.items).map((itemName) => {
              if (itemName === "sfl") {
                return (
                  <RequirementLabel
                    type="sfl"
                    balance={balance}
                    requirement={new Decimal(order?.items[itemName] ?? 0)}
                    showLabel
                  />
                );
              }

              return (
                <RequirementLabel
                  key={itemName}
                  type="item"
                  item={itemName}
                  balance={inventory[itemName] ?? new Decimal(0)}
                  showLabel
                  requirement={new Decimal(order?.items[itemName] ?? 0)}
                />
              );
            })}
            <div className="flex items-center justify-between mt-2 mb-0.5">
              {/* <div className="flex items-center">
                <img src={chest} className="w-5 h-auto mr-1" />
                <span className="text-xs">Reward</span>

              </div> */}

              <Label icon={chest} type="warning" className="ml-1.5">
                Reward
              </Label>
              <div className="flex items-center">
                <img src={sfl} className="w-5 h-auto mr-1" />
                <span className="text-xs">5 SFL</span>
              </div>
              {/* <div>
                <Button className="h-7" onClick={onDeliver}>
                  <div className="flex items-center">
                    <span className="text-xs">Deliver</span>
                  </div>
                </Button>
              </div> */}
            </div>
          </OuterPanel>
        </div>
      </div>
    </>
  );
};

export const Gifts: React.FC<{ game: GameState; onClose: () => void }> = ({
  game,
  onClose,
}) => {
  const [selected, setSelected] = useState<FlowerName>();
  const flowers = getKeys(game.inventory).filter((item) => item in FLOWERS);

  const [showGifting, setShowGifting] = useState(false);
  const [showFriendshipBonus, setShowFriendshipBonus] = useState(false);

  const name: NPCName = "pumpkin' pete";

  const onGift = async () => {
    setShowGifting(true);

    setShowFriendshipBonus(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowFriendshipBonus(false);
    // Fire event
  };

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <Label type="default" icon={SUNNYSIDE.icons.player}>
            {name}
          </Label>

          <div
            className="flex relative items-center mr-10"
            style={{ width: "fit-content" }}
          >
            <ResizableBar
              percentage={20 + (showFriendshipBonus ? 50 : 0)}
              type="progress"
              outerDimensions={{
                width: 30,
                height: 7,
              }}
            />

            <img
              src={giftIcon}
              className={classNames("h-6 ml-1 mb-0.5")}
              style={{}}
            />

            <div
              className={classNames(
                "flex ml-2 transition-opacity opacity-0 absolute left-10 -top-4",
                {
                  "opacity-100": showFriendshipBonus,
                }
              )}
            >
              <img src={SUNNYSIDE.icons.happy} className="h-5" />
              <span className="text-xs">+2</span>
            </div>
          </div>
          {/* 
          <img
            src={chatDisc}
            className="h-10 absolute top-3 right-3 cursor-pointer"
            onClick={onClose}
          /> */}
        </div>
        <div className="h-12">
          <Dialogue
            trail={25}
            key={showGifting ? "gift-result" : "gift"}
            message={
              showGifting
                ? "Hmmm, that is exactly what I wanted!!!"
                : "Have you got a flower for me? Make sure it is something I like."
            }
          />
        </div>

        <Label
          type="default"
          className="mb-2"
          icon={ITEM_DETAILS["White Pansy"].image}
        >
          Select a flower
        </Label>
        {flowers.length === 0 && (
          <p className="text-xs mb-2">
            Oh no, you don't have any flowers to gift!
          </p>
        )}
        {flowers.length > 0 && (
          <div className="flex">
            {flowers.map((flower) => (
              <Box
                key={flower}
                onClick={() => setSelected(flower as FlowerName)}
                image={ITEM_DETAILS[flower].image}
                isSelected={selected === flower}
                count={game.inventory[flower]}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Back
        </Button>
        <Button disabled={!selected} onClick={onGift}>
          Gift
        </Button>
      </div>
    </>
  );
};

export const BumpkinDelivery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showGifts, setShowGifts] = useState(false);

  const [showFriendshipBonus, setShowFriendshipBonus] = useState(false);

  const name: NPCName = "pumpkin' pete";

  const delivery = gameState.context.state.delivery.orders.find(
    (order) => order.from === name
  );

  const deliver = async () => {
    await setShowFriendshipBonus(true);

    await new Promise((res) => setTimeout(res, 1000));

    await setShowFriendshipBonus(false);
  };

  return (
    <CloseButtonPanel
      onClose={console.log}
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
    >
      {showGifts && (
        <Gifts
          onClose={() => setShowGifts(false)}
          game={gameState.context.state}
        />
      )}
      {!showGifts && (
        <>
          <div className="p-2">
            <div className="flex justify-between items-center mb-3">
              <Label type="default" icon={SUNNYSIDE.icons.player}>
                {name}
              </Label>
              {/* <div
                className="flex relative items-center mr-10"
                style={{ width: "fit-content" }}
              >
                <ResizableBar
                  percentage={20 + (showFriendshipBonus ? 50 : 0)}
                  type="progress"
                  outerDimensions={{
                    width: 30,
                    height: 7,
                  }}
                />

                <img
                  src={giftIcon}
                  className={classNames("h-6 ml-1 mb-0.5")}
                  style={{}}
                />

                <div
                  className={classNames(
                    "flex ml-2 transition-opacity opacity-0 absolute left-8 -top-4",
                    {
                      "opacity-100": showFriendshipBonus,
                    }
                  )}
                >
                  <img src={SUNNYSIDE.icons.happy} className="h-5" />
                  <span className="text-xs">+2</span>
                </div>
              </div> */}
              {/* <img
                src={flowerGift}
                className="h-10 absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowGifts(true)}
              /> */}
            </div>
            <div className="h-16">
              <Dialogue
                trail={25}
                message={
                  showFriendshipBonus
                    ? "Thanks!"
                    : "Howdy Bumpkin, how about dem taters and pumpkins today? Great day for it."
                }
              />
            </div>

            <div className="flex justify-between">
              <Label
                type="default"
                className="mb-2"
                icon={SUNNYSIDE.icons.heart}
              >
                Friendship
              </Label>
              <div
                className="flex relative items-center"
                style={{ width: "fit-content" }}
              >
                <ResizableBar
                  percentage={20 + (showFriendshipBonus ? 50 : 0)}
                  type="progress"
                  outerDimensions={{
                    width: 30,
                    height: 7,
                  }}
                />

                <img
                  src={giftIcon}
                  className={classNames("h-6 ml-1 mb-0.5")}
                  style={{}}
                />

                <div
                  className={classNames(
                    "flex ml-2 transition-opacity opacity-0 absolute left-10 -top-4",
                    {
                      "opacity-100": showFriendshipBonus,
                    }
                  )}
                >
                  <img src={SUNNYSIDE.icons.happy} className="h-5" />
                  <span className="text-xs">+2</span>
                </div>
              </div>
            </div>

            <p className="text-xs mb-2">
              Complete deliveries and provide gifts to earn bonus rewards
            </p>

            <div className="flex justify-between items-center mb-2">
              <Label type="default" icon={SUNNYSIDE.icons.expression_chat}>
                Delivery
              </Label>
              {/* <div>
                <Button className="h-7" onClick={deliver}>
                  <div className="flex items-center">
                    <span className="text-xs">Complete</span>
                  </div>
                </Button>
              </div> */}
              {/* <Label type="warning" icon={sfl} className="">
                0.15 SFL
              </Label> */}
              {/* <div className="flex items-center">
              <img src={SUNNYSIDE.icons.happy} className="h-4 mr-1" />
              <p className="text-xs">112</p>
            </div> */}

              {/* <div>
              <Button className="h-6">
                <div className="flex">
                  <img
                    src={ITEM_DETAILS["White Pansy"].image}
                    className="h-4 mr-1"
                  />
                  <p className="text-xs">Gift</p>
                </div>
              </Button>
            </div> */}
            </div>

            <div></div>

            {!delivery && <p className="text-xs">No deliveries available</p>}

            {delivery && (
              <OrderCard
                balance={gameState.context.state.balance}
                inventory={gameState.context.state.inventory}
                order={delivery as Order}
                hasRequirementsCheck={() => true}
                onDeliver={deliver}
              />
            )}
          </div>

          <div className="flex mt-1">
            {/* <Button className="mr-1" onClick={() => setShowGifts(true)}>
              <div className="flex items-center">Offer gift</div>
            </Button> */}
            <Button className="mr-1" onClick={() => setShowGifts(true)}>
              Gift
            </Button>
            <Button onClick={deliver}>Deliver</Button>
          </div>
        </>
      )}
    </CloseButtonPanel>
  );
};
