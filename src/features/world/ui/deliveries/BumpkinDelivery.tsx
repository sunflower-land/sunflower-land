import { NPCName } from "lib/npcs";
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
import lockIcon from "assets/skills/lock.png";

import { InlineDialogue } from "../TypingMessage";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { FLOWERS, FlowerName } from "features/game/types/flowers";
import { Box } from "components/ui/Box";
import { getNextGift } from "features/game/events/landExpansion/claimBumpkinGift";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { defaultDialogue, npcDialogues } from "./dialogues";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { getTotalExpansions } from "./DeliveryPanelContent";
import { DELIVERY_LEVELS } from "features/island/delivery/lib/delivery";

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
  name: NPCName;
}> = ({ game, onClose, onOpen, name }) => {
  const { gameService } = useContext(Context);

  const [selected, setSelected] = useState<FlowerName>();

  const [message, setMessage] = useState(
    "Have you got a flower for me? Make sure it is something I like."
  );

  const flowers = getKeys(game.inventory).filter(
    (item) => item in FLOWERS && game.inventory[item]?.gte(1)
  );

  const onGift = async () => {
    const previous = game.npcs?.[name]?.friendship?.points ?? 0;
    const state = gameService.send("flowers.gifted", {
      bumpkin: name,
      flower: selected,
    });

    const difference =
      (state.context.state.npcs?.[name]?.friendship?.points ?? 0) - previous;

    // TODO - custom Bumpkin messages
    if (difference < 3) {
      setMessage(
        "Hmmmm, this isn't my favorite flower. But I guess it's the thought that counts."
      );
    } else if (difference < 6) {
      setMessage("Wow, thanks! I love this flower!");
    } else {
      setMessage("This is my favorite flower! Thanks a bunch!");
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <Label type="default" icon={SUNNYSIDE.icons.player}>
            {name}
          </Label>

          <div className="flex">
            <BumpkinGiftBar onOpen={onOpen} game={game} npc={name} />
            <img
              src={SUNNYSIDE.icons.close}
              className="h-7 ml-2 cursor-pointer"
              onClick={onClose}
            />
          </div>
        </div>
        <div
          style={{
            minHeight: "65px",
          }}
          className="mb-2"
        >
          <InlineDialogue
            trail={25}
            key={(game.npcs?.[name]?.friendship?.points ?? 0).toString()}
            message={message}
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
    await new Promise((res) => setTimeout(res, 3000));
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

  if (!nextGift) {
    return null;
  }

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

  const deliver = () => {
    gameService.send("order.delivered", {
      id: delivery?.id,
      friendship: true,
    });
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

  const dialogue = npcDialogues[npc] || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const positive = useRandomItem(dialogue.positiveDelivery);
  const noOrder = useRandomItem(dialogue.noOrder);

  let message = intro;

  if (delivery && !delivery.completedAt && hasDelivery) {
    message = positive;
  }

  if (delivery?.completedAt) {
    message =
      "I've been waiting for this. Thanks a bunch! Come back soon for more deliveries.";
  }

  if (!delivery) {
    message = noOrder;
  }

  const missingExpansions =
    (DELIVERY_LEVELS[npc] ?? 0) - getTotalExpansions({ game }).toNumber();
  const isLocked = missingExpansions >= 1;

  const acceptGifts = !!getNextGift({ game, npc });

  if (gift) {
    return (
      <ClaimReward
        reward={gift}
        onClose={() => setGift(undefined)}
        onClaim={() => {
          gameService.send("gift.claimed", { bumpkin: npc });
          onClose();
        }}
      />
    );
  }

  return (
    <>
      {showFlowers && (
        <Gifts
          onClose={() => setShowFlowers(false)}
          game={gameState.context.state}
          onOpen={openReward}
          name={npc}
        />
      )}
      {!showFlowers && (
        <>
          <div className="p-2">
            <div className="flex justify-between items-center mb-3">
              <Label type="default" icon={SUNNYSIDE.icons.player}>
                {npc}
              </Label>
              <div className="flex">
                <BumpkinGiftBar onOpen={openReward} game={game} npc={npc} />
                <img
                  src={SUNNYSIDE.icons.close}
                  className="h-7 ml-2 cursor-pointer"
                  onClick={onClose}
                />
              </div>
            </div>
            <div
              style={{
                minHeight: "65px",
              }}
              className="mb-2"
            >
              <InlineDialogue
                trail={25}
                key={delivery?.completedAt ? "1" : "2"}
                message={message}
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
              {isLocked && (
                <Label className="my-2" type="danger" icon={lockIcon}>
                  Locked
                </Label>
              )}
            </div>

            {!delivery && !isLocked && (
              <p className="text-xs">No deliveries available</p>
            )}

            {isLocked && (
              <>
                <p className="text-xs">
                  Prove yourself worthy. Expand your island {missingExpansions}{" "}
                  more times.
                </p>
              </>
            )}

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
            {acceptGifts && (
              <Button className="mr-1" onClick={() => setShowFlowers(true)}>
                Gift
              </Button>
            )}

            <Button
              disabled={!delivery || !hasDelivery || !!delivery?.completedAt}
              onClick={deliver}
            >
              Deliver
            </Button>
          </div>
        </>
      )}
    </>
  );
};
