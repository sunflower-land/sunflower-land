import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Airdrop, GameState, Inventory, Order } from "features/game/types/game";
import { Button } from "components/ui/Button";

import giftIcon from "assets/icons/gift.png";
import sfl from "assets/icons/token_2.png";
import chest from "assets/icons/chest.png";

import { InlineDialogue } from "../TypingMessage";
import Decimal from "decimal.js-light";
import { OuterPanel, Panel } from "components/ui/Panel";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { Box } from "components/ui/Box";
import { getNextGift } from "features/game/events/landExpansion/claimBumpkinGift";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";

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

export const Gifts: React.FC<{
  game: GameState;
  onClose: () => void;
  onOpen: () => void;
}> = ({ game, onClose, onOpen }) => {
  const { gameService } = useContext(Context);

  const [selected, setSelected] = useState<FlowerName>();
  const flowers = getKeys(game.inventory).filter(
    (item) => item in FLOWERS && game.inventory[item]?.gte(1)
  );

  const [showGifting, setShowGifting] = useState(false);
  const [showFriendshipBonus, setShowFriendshipBonus] = useState(false);

  const name: NPCName = "pumpkin' pete";

  const onGift = async () => {
    setShowGifting(true);

    gameService.send("flowers.gifted", {
      bumpkin: name,
      flower: selected,
    });

    setShowFriendshipBonus(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowFriendshipBonus(false);
    // Fire event
  };

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-2 mr-10">
          <Label type="default" icon={SUNNYSIDE.icons.player}>
            {name}
          </Label>

          <BumpkinGiftBar game={game} npc={name} onOpen={onOpen} />
        </div>
        <div className="h-12">
          <InlineDialogue
            trail={25}
            key={showGifting ? "gift-result" : "gift"}
            message={
              showGifting
                ? "Hmmm, that is exactly what I wanted!!!"
                : "Have you got a flower for me? Make sure it is something I like."
            }
          />
        </div>

        <div className="flex justify-between">
          <Label
            type="default"
            className="mb-2"
            icon={ITEM_DETAILS["White Pansy"].image}
          >
            Select a flower
          </Label>
          {selected && (
            <Label
              type="default"
              className="mb-2"
              icon={ITEM_DETAILS[selected].image}
            >
              {selected}
            </Label>
          )}
        </div>

        {flowers.length === 0 && (
          <p className="text-xs mb-2">
            {`Oh no, you don't have any flowers to gift!`}
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
        <Button
          disabled={!selected || !game.inventory[selected]?.gte(1)}
          onClick={onGift}
        >
          Gift
        </Button>
      </div>
    </>
  );
};

const BumpkinGiftBar: React.FC<{
  game: GameState;
  npc: NPCName;
  onOpen: () => void;
}> = ({ game, npc, onOpen }) => {
  const [bonus, setBonus] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const friendship = game.npcs?.[npc]?.friendship ?? {
    points: 0,
    giftClaimedAtPoints: 0,
  };

  const previousPoints = useRef(friendship.points);

  const showFriendshipIncrease = async (amount: number) => {
    setBonus(amount);
    setShowBonus(true);
    await new Promise((res) => setTimeout(res, 1000));
    setShowBonus(false);
  };

  useEffect(() => {
    if (previousPoints.current !== friendship.points) {
      const difference = friendship.points - previousPoints.current;
      showFriendshipIncrease(difference);
      previousPoints.current = friendship.points;
    }
  }, [friendship.points]);

  const nextGift = getNextGift({ game, npc });
  let percentage = 0;

  const progress = friendship.points - (friendship.giftClaimedAtPoints ?? 0);
  if (nextGift) {
    const endGoal =
      nextGift.friendshipPoints - (friendship.giftClaimedAtPoints ?? 0);
    percentage = (progress / endGoal) * 100;
  }

  const giftIsReady = percentage >= 100;

  const openReward = () => {
    if (!giftIsReady) return;

    onOpen();
  };

  return (
    <>
      <div
        className="flex relative items-center"
        style={{ width: "fit-content" }}
      >
        <ResizableBar
          percentage={percentage}
          type="progress"
          outerDimensions={{
            width: 30,
            height: 7,
          }}
        />

        <img
          src={giftIcon}
          onClick={openReward}
          className={classNames("h-6 ml-1 mb-0.5", {
            "animate-pulsate img-shadow cursor-pointer": giftIsReady,
          })}
        />

        <div
          className={classNames(
            "absolute left-10 -top-4 flex opacity-0 transition-opacity w-full",
            {
              "opacity-100": showBonus,
            }
          )}
        >
          <img src={SUNNYSIDE.icons.happy} className="w-4 h-auto mr-1" />
          <span className="text-xs">{`+${bonus}`}</span>
        </div>
      </div>
    </>
  );
};

interface Props {
  onClose: () => void;
  npc: NPCName;
}

export const BumpkinDelivery: React.FC<Props> = ({ onClose, npc }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const game = gameState.context.state;
  const [showFlowers, setShowFlowers] = useState(false);

  const [gift, setGift] = useState<Airdrop>();

  const delivery = game.delivery.orders.find((order) => order.from === npc);
  const friendship = game.npcs?.[npc]?.friendship ?? {
    points: 0,
    giftClaimedAtPoints: 0,
  };

  const deliver = async () => {
    const previous = friendship.points;

    const state = gameService.send("order.delivered", {
      id: delivery?.id,
    });

    const difference =
      (state.context.state.npcs?.[npc]?.friendship?.points ?? 0) - previous;

    await new Promise((res) => setTimeout(res, 500));
  };

  const hasDelivery = getKeys(delivery?.items ?? {}).every((name) => {
    if (name === "sfl") {
      return game.balance.gte(delivery?.items.sfl ?? 0);
    }
    return game.inventory[name]?.gte(delivery?.items[name] ?? 0);
  });

  const openReward = () => {
    const nextGift = getNextGift({ game, npc });

    setGift({
      id: "delivery-gift",
      createdAt: Date.now(),
      items: nextGift?.items ?? {},
      sfl: nextGift?.sfl ?? 0,
      wearables: nextGift?.wearables ?? {},
      message: "Gee Wizz thanks Bumpkin!!!",
    });
  };

  if (gift) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES[npc]}>
        <ClaimReward
          reward={gift}
          onClose={() => setGift(undefined)}
          onClaim={() => {
            gameService.send("gift.claimed", { bumpkin: npc });
            onClose();
          }}
        />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
    >
      {showFlowers && (
        <Gifts
          onClose={() => setShowFlowers(false)}
          game={gameState.context.state}
          onOpen={openReward}
        />
      )}
      {!showFlowers && (
        <>
          <div className="p-2">
            <div className="flex justify-between items-center mb-3 mr-10">
              <Label type="default" icon={SUNNYSIDE.icons.player}>
                {npc}
              </Label>
              <BumpkinGiftBar onOpen={openReward} game={game} npc={npc} />
            </div>
            <div className="h-16">
              <InlineDialogue
                trail={25}
                key={delivery?.completedAt ? "1" : "2"}
                message={
                  delivery?.completedAt
                    ? "Thanks!"
                    : "Howdy Bumpkin, how about dem taters and pumpkins today? Great day for it."
                }
              />
            </div>

            <div className="flex justify-between items-center mb-2">
              <Label type="default" icon={SUNNYSIDE.icons.expression_chat}>
                Delivery
              </Label>
              {delivery?.completedAt && (
                <Label type="success" secondaryIcon={SUNNYSIDE.icons.confirm}>
                  Completed
                </Label>
              )}
            </div>

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
            <Button className="mr-1" onClick={() => setShowFlowers(true)}>
              Gift
            </Button>
            <Button disabled={!hasDelivery} onClick={deliver}>
              Deliver
            </Button>
          </div>
        </>
      )}
    </CloseButtonPanel>
  );
};
