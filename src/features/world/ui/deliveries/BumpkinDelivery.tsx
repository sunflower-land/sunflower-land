import { NPCName } from "lib/npcs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Airdrop, GameState, Order } from "features/game/types/game";
import { Button } from "components/ui/Button";

import coinsImg from "assets/icons/coins.webp";
import gift from "assets/icons/gift.png";
import token from "assets/icons/sfl.webp";
import chest from "assets/icons/chest.png";

import { InlineDialogue } from "../TypingMessage";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
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
import {
  NPC_DELIVERY_LEVELS,
  DeliveryNpcName,
} from "features/island/delivery/lib/delivery";
import {
  getSeasonalBanner,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { NpcDialogues } from "lib/i18n/dictionaries/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BUMPKIN_FLOWER_BONUSES } from "features/game/types/gifts";
import {
  generateDeliveryTickets,
  getOrderSellPrice,
} from "features/game/events/landExpansion/deliver";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { SquareIcon } from "components/ui/SquareIcon";
import { formatNumber } from "lib/utils/formatNumber";
import { getBumpkinLevel } from "features/game/lib/level";

export const OrderCard: React.FC<{
  order: Order;
  game: GameState;
  onDeliver: () => void;
  hasRequirementsCheck: (order: Order) => boolean;
}> = ({ order, game, hasRequirementsCheck }) => {
  const { balance, inventory, coins } = game;

  const makeRewardAmountForLabel = (order: Order) => {
    if (order.reward.sfl !== undefined) {
      const sfl = getOrderSellPrice<Decimal>(game, order);

      return formatNumber(sfl, {
        decimalPlaces: 4,
      });
    }

    const coins = getOrderSellPrice<number>(game, order);

    return formatNumber(coins);
  };

  const canDeliver = hasRequirementsCheck(order);
  const { t } = useAppTranslation();

  const tickets = generateDeliveryTickets({ game, npc: order.from });

  return (
    <>
      <div className="">
        <div
          key={order.id}
          className={classNames("flex flex-1 flex-col space-y-1 relative", {
            "opacity-50 cursor-default": !canDeliver,
          })}
        >
          <div className="-ml-2 -mr-2 relative flex flex-col space-y-0.5 ">
            {getKeys(order.items).map((itemName) => {
              if (itemName === "coins") {
                return (
                  <RequirementLabel
                    key={itemName}
                    type="coins"
                    balance={coins}
                    requirement={order?.items[itemName] ?? 0}
                    showLabel
                  />
                );
              }

              if (itemName === "sfl") {
                return (
                  <RequirementLabel
                    key={itemName}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center mr-1">
                <SquareIcon icon={chest} width={7} />
                <span className="text-xs ml-1">{t("reward")}</span>
              </div>
              <Label type="warning" style={{ height: "25px" }}>
                {order.reward.sfl !== undefined && (
                  <div className="flex items-center mr-1">
                    <span className="text-xs">
                      {makeRewardAmountForLabel(order)}
                    </span>
                    <img src={token} className="h-4 w-auto ml-1" />
                  </div>
                )}
                {order.reward.coins !== undefined && (
                  <div className="flex items-center mr-1">
                    <span className="text-xs">
                      {makeRewardAmountForLabel(order)}
                    </span>
                    <img src={coinsImg} className="h-4 w-auto ml-1" />
                  </div>
                )}
                {!!tickets && (
                  <div className="flex items-center space-x-3 mr-1">
                    <div className="flex items-center">
                      <span className="text-xs mx-1">{tickets}</span>
                      <img
                        src={ITEM_DETAILS[getSeasonalTicket()].image}
                        className="h-4 w-auto"
                      />
                    </div>
                  </div>
                )}
                {getKeys(order.reward.items ?? {}).map((item) => (
                  <div className="flex items-center" key={item}>
                    <span className="text-xs">{item}</span>
                    <img
                      src={ITEM_DETAILS[item].image}
                      className="h-4 w-auto ml-1"
                    />
                  </div>
                ))}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

type GiftResponse = {
  flowerIntro: NpcDialogues;
  flowerPositive: NpcDialogues;
  flowerNegative: NpcDialogues;
  flowerAverage: NpcDialogues;
  reward: NpcDialogues;
};

const GIFT_RESPONSES: Partial<Record<NPCName, GiftResponse>> = {
  "pumpkin' pete": {
    flowerIntro: "npcDialogues.pumpkinPete.flowerIntro",
    flowerAverage: "npcDialogues.pumpkinPete.averageFlower",
    flowerNegative: "npcDialogues.pumpkinPete.badFlower",
    flowerPositive: "npcDialogues.pumpkinPete.goodFlower",
    reward: "npcDialogues.pumpkinPete.reward",
  },
  betty: {
    flowerIntro: "npcDialogues.betty.flowerIntro",
    flowerAverage: "npcDialogues.betty.averageFlower",
    flowerNegative: "npcDialogues.betty.badFlower",
    flowerPositive: "npcDialogues.betty.goodFlower",
    reward: "npcDialogues.betty.reward",
  },
  blacksmith: {
    flowerIntro: "npcDialogues.blacksmith.flowerIntro",
    flowerAverage: "npcDialogues.blacksmith.averageFlower",
    flowerNegative: "npcDialogues.blacksmith.badFlower",
    flowerPositive: "npcDialogues.blacksmith.goodFlower",
    reward: "npcDialogues.blacksmith.reward",
  },
  bert: {
    flowerIntro: "npcDialogues.bert.flowerIntro",
    flowerAverage: "npcDialogues.bert.averageFlower",
    flowerNegative: "npcDialogues.bert.badFlower",
    flowerPositive: "npcDialogues.bert.goodFlower",
    reward: "npcDialogues.bert.reward",
  },
  finn: {
    flowerIntro: "npcDialogues.finn.flowerIntro",
    flowerAverage: "npcDialogues.finn.averageFlower",
    flowerNegative: "npcDialogues.finn.badFlower",
    flowerPositive: "npcDialogues.finn.goodFlower",
    reward: "npcDialogues.finn.reward",
  },
  finley: {
    flowerIntro: "npcDialogues.finley.flowerIntro",
    flowerAverage: "npcDialogues.finley.averageFlower",
    flowerNegative: "npcDialogues.finley.badFlower",
    flowerPositive: "npcDialogues.finley.goodFlower",
    reward: "npcDialogues.finley.reward",
  },
  corale: {
    flowerIntro: "npcDialogues.corale.flowerIntro",
    flowerAverage: "npcDialogues.corale.averageFlower",
    flowerNegative: "npcDialogues.corale.badFlower",
    flowerPositive: "npcDialogues.corale.goodFlower",
    reward: "npcDialogues.corale.reward",
  },
  raven: {
    flowerIntro: "npcDialogues.raven.flowerIntro",
    flowerAverage: "npcDialogues.raven.averageFlower",
    flowerNegative: "npcDialogues.raven.badFlower",
    flowerPositive: "npcDialogues.raven.goodFlower",
    reward: "npcDialogues.raven.reward",
  },
  "old salty": {
    flowerIntro: "npcDialogues.salty.flowerIntro",
    flowerAverage: "npcDialogues.salty.averageFlower",
    flowerNegative: "npcDialogues.salty.badFlower",
    flowerPositive: "npcDialogues.salty.goodFlower",
    reward: "npcDialogues.salty.reward",
  },
  miranda: {
    flowerIntro: "npcDialogues.miranda.flowerIntro",
    flowerAverage: "npcDialogues.miranda.averageFlower",
    flowerNegative: "npcDialogues.miranda.badFlower",
    flowerPositive: "npcDialogues.miranda.goodFlower",
    reward: "npcDialogues.miranda.reward",
  },
  cornwell: {
    flowerIntro: "npcDialogues.cornwell.flowerIntro",
    flowerAverage: "npcDialogues.cornwell.averageFlower",
    flowerNegative: "npcDialogues.cornwell.badFlower",
    flowerPositive: "npcDialogues.cornwell.goodFlower",
    reward: "npcDialogues.cornwell.reward",
  },
  tywin: {
    flowerIntro: "npcDialogues.tywin.flowerIntro",
    flowerAverage: "npcDialogues.tywin.averageFlower",
    flowerNegative: "npcDialogues.tywin.badFlower",
    flowerPositive: "npcDialogues.tywin.goodFlower",
    reward: "npcDialogues.tywin.reward",
  },
  jester: {
    flowerIntro: "npcDialogues.jester.flowerIntro",
    flowerAverage: "npcDialogues.jester.averageFlower",
    flowerNegative: "npcDialogues.jester.badFlower",
    flowerPositive: "npcDialogues.jester.goodFlower",
    reward: "npcDialogues.jester.reward",
  },
  victoria: {
    flowerIntro: "npcDialogues.queenVictoria.flowerIntro",
    flowerAverage: "npcDialogues.queenVictoria.averageFlower",
    flowerNegative: "npcDialogues.queenVictoria.badFlower",
    flowerPositive: "npcDialogues.queenVictoria.goodFlower",
    reward: "npcDialogues.queenVictoria.reward",
  },
};

const DEFAULT_DIALOGUE: GiftResponse = {
  flowerIntro: "npcDialogues.default.flowerIntro",
  flowerAverage: "npcDialogues.default.averageFlower",
  flowerNegative: "npcDialogues.default.badFlower",
  flowerPositive: "npcDialogues.default.goodFlower",
  reward: "npcDialogues.default.reward",
};

export const Gifts: React.FC<{
  game: GameState;
  onClose: () => void;
  onOpen: () => void;
  name: NPCName;
}> = ({ game, onClose, onOpen, name }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [selected, setSelected] = useState<FlowerName>();
  const [message, setMessage] = useState<NpcDialogues>(
    GIFT_RESPONSES[name]?.flowerIntro ?? DEFAULT_DIALOGUE.flowerIntro,
  );

  const flowers = getKeys(game.inventory).filter(
    (item) => item in FLOWERS && game.inventory[item]?.gte(1),
  );

  const onGift = async () => {
    const previous = game.npcs?.[name]?.friendship?.points ?? 0;
    const state = gameService.send("flowers.gifted", {
      bumpkin: name,
      flower: selected,
    });

    const difference =
      (state.context.state.npcs?.[name]?.friendship?.points ?? 0) - previous;

    if (
      difference >= 6 ||
      !!BUMPKIN_FLOWER_BONUSES[name]?.[selected as FlowerName]
    ) {
      setMessage(
        GIFT_RESPONSES[name]?.flowerPositive ?? DEFAULT_DIALOGUE.flowerPositive,
      );
    } else if (difference >= 3) {
      setMessage(
        GIFT_RESPONSES[name]?.flowerAverage ?? DEFAULT_DIALOGUE.flowerAverage,
      );
    } else {
      setMessage(
        GIFT_RESPONSES[name]?.flowerNegative ?? DEFAULT_DIALOGUE.flowerNegative,
      );
    }
  };

  let translated: string = t(message);

  const giftedAt = game.npcs?.[name]?.friendship?.giftedAt ?? 0;
  // GiftedAt is the same UTC day as right now
  const isLocked =
    giftedAt > 0 &&
    new Date(giftedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  if (isLocked) {
    translated = `${translated} ${t("npcDialogues.default.locked")}`;
  }

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <Label
              type="default"
              icon={SUNNYSIDE.icons.player}
              className="capitalize"
            >
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
          <div className="mb-2">
            <InlineDialogue
              trail={25}
              key={(game.npcs?.[name]?.friendship?.points ?? 0).toString()}
              message={translated}
            />
          </div>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="flex justify-between">
          <Label
            type="default"
            className="mb-2 ml-1"
            icon={ITEM_DETAILS["White Pansy"].image}
          >
            {t("bumpkin.delivery.selectFlower")}
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
          <p className="text-xs mb-2">{`${t("bumpkin.delivery.noFlowers")}`}</p>
        )}
        {flowers.length > 0 && (
          <div className="flex w-full flex-wrap">
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
      </InnerPanel>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("back")}
        </Button>
        <Button
          disabled={isLocked || !selected || !game.inventory[selected]?.gte(1)}
          onClick={onGift}
        >
          <div className="flex items-center">
            {isLocked && (
              <>
                <img src={SUNNYSIDE.icons.lock} className="w-4 h-auto mr-1" />
                <img
                  src={SUNNYSIDE.icons.stopwatch}
                  className="w-4 h-auto mr-1"
                />
              </>
            )}
            {t("gift")}
          </div>
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
    await new Promise((res) => setTimeout(res, 5000));
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
          src={gift}
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
            },
          )}
        >
          <img src={SUNNYSIDE.icons.happy} className="w-4 h-auto mr-1" />
          <span className="text-xs yield-text">{`+${bonus}`}</span>
        </div>
      </div>
    </>
  );
};

interface Props {
  onClose?: () => void;
  npc: NPCName;
}

const GOBLINS_REQUIRING_SEASON_PASS: Partial<NPCName[]> = [
  "grimtooth",
  "grubnuk",
  "gordo",
  "guria",
];

export const BumpkinDelivery: React.FC<Props> = ({ onClose, npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { openModal } = useContext(ModalContext);

  const game = gameState.context.state;
  const [showFlowers, setShowFlowers] = useState(false);
  const [gift, setGift] = useState<Airdrop>();

  const delivery = game.delivery.orders.find((order) => order.from === npc);

  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: gameService.state.context.farmId,
  });

  const deliver = () => {
    gameService.send("order.delivered", {
      id: delivery?.id,
      friendship: true,
    });
  };

  const hasDelivery = getKeys(delivery?.items ?? {}).every((name) => {
    if (name === "coins") {
      return game.coins > (delivery?.items.coins ?? 0);
    }

    if (name === "sfl") {
      return game.balance?.gte(delivery?.items.sfl ?? 0);
    }

    return game.inventory[name]?.gte(delivery?.items[name] ?? 0);
  });

  const openReward = () => {
    const nextGift = getNextGift({ game, npc });

    setGift({
      id: "delivery-gift",
      createdAt: Date.now(),
      items: nextGift?.items ?? {},
      sfl: 0,
      coins: nextGift?.coins ?? 0,
      wearables: nextGift?.wearables ?? {},
      message: t(GIFT_RESPONSES[npc]?.reward ?? DEFAULT_DIALOGUE.reward),
    });
  };

  const requiresSeasonPass = GOBLINS_REQUIRING_SEASON_PASS.includes(npc);
  const hasSeasonPass =
    (game.inventory[getSeasonalBanner()] ?? new Decimal(0))?.gte(1) ||
    (game.inventory["Lifetime Farmer Banner"] ?? new Decimal(0))?.gte(1);

  const dialogue = npcDialogues[npc] || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const positive = useRandomItem(dialogue.positiveDelivery);
  const noOrder = useRandomItem(dialogue.noOrder);

  const tickets = generateDeliveryTickets({ game, npc });

  let message = intro;

  if (delivery && !delivery.completedAt && hasDelivery) {
    message = positive;
  }

  if (delivery?.completedAt) {
    message = t("bumpkin.delivery.waiting");
  }

  if (!delivery || (!!tickets && ticketTasksAreFrozen)) {
    message = noOrder;
  }

  const hasVIP = hasVipAccess(game.inventory);

  if (requiresSeasonPass && !hasVIP) {
    message = t("goblinTrade.vipDelivery");
  }

  const missingLevels =
    (NPC_DELIVERY_LEVELS[npc as DeliveryNpcName] ?? 0) -
    getBumpkinLevel(game.bumpkin?.experience ?? 0);
  const missingVIPAccess = requiresSeasonPass && !hasSeasonPass && !hasVIP;
  const isLocked = missingLevels >= 1;
  const isTicketOrder = tickets > 0;
  const deliveryFrozen = ticketTasksAreFrozen && isTicketOrder;
  const acceptGifts = !!getNextGift({ game, npc });

  if (gift) {
    return (
      <InnerPanel>
        <ClaimReward
          reward={gift}
          onClose={() => setGift(undefined)}
          onClaim={() => {
            gameService.send("gift.claimed", { bumpkin: npc });
            onClose && onClose();
          }}
        />
      </InnerPanel>
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
          <InnerPanel className="mb-1">
            <div className="p-2 pb-1">
              <div className="flex justify-between items-center mb-3">
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.player}
                  className="capitalize"
                >
                  {npc}
                </Label>
                <div className="flex">
                  <BumpkinGiftBar onOpen={openReward} game={game} npc={npc} />
                  {onClose && (
                    <img
                      src={SUNNYSIDE.icons.close}
                      className="h-7 ml-2 cursor-pointer"
                      onClick={onClose}
                    />
                  )}
                </div>
              </div>
              <div className="mb-2">
                <InlineDialogue
                  trail={25}
                  key={delivery?.completedAt ? "1" : "2"}
                  message={message}
                />
              </div>
            </div>
          </InnerPanel>

          <InnerPanel>
            <div className="px-2 ">
              <div className="flex justify-between items-center mb-2">
                <Label type="default" icon={SUNNYSIDE.icons.expression_chat}>
                  {t("delivery")}
                </Label>

                {delivery?.completedAt && (
                  <Label type="success" secondaryIcon={SUNNYSIDE.icons.confirm}>
                    {t("completed")}
                  </Label>
                )}
                {isLocked && (
                  <Label type="danger" icon={SUNNYSIDE.icons.lock}>
                    {`Lvl ${NPC_DELIVERY_LEVELS[npc as DeliveryNpcName]} required`}
                  </Label>
                )}
                {missingVIPAccess && (
                  <Label type="danger" icon={SUNNYSIDE.icons.lock}>
                    {t("goblinTrade.vipRequired")}
                  </Label>
                )}
                {!delivery?.completedAt && requiresSeasonPass && (
                  <VIPAccess
                    isVIP={hasVIP}
                    onUpgrade={() => {
                      onClose && onClose();
                      openModal("BUY_BANNER");
                    }}
                  />
                )}
              </div>

              {!delivery && !isLocked && (
                <p className="text-xs mb-1">{t("no.delivery.avl")}</p>
              )}

              {isLocked && (
                <>
                  <p className="text-xs mb-2">
                    {t("bumpkin.delivery.proveYourself", {
                      missingLevels: missingLevels,
                    })}
                  </p>
                </>
              )}

              {delivery && !deliveryFrozen && (
                <>
                  <OrderCard
                    game={gameState.context.state}
                    order={delivery as Order}
                    hasRequirementsCheck={() => true}
                    onDeliver={deliver}
                  />
                </>
              )}
              {isTicketOrder && ticketTasksAreFrozen && (
                <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                  {t("orderhelp.ticket.deliveries.closed")}
                </Label>
              )}
            </div>
          </InnerPanel>

          <div className="flex mt-1">
            {acceptGifts && (
              <Button className="mr-1" onClick={() => setShowFlowers(true)}>
                {t("gift")}
              </Button>
            )}

            <Button
              disabled={
                !delivery ||
                !hasDelivery ||
                !!delivery?.completedAt ||
                isLocked ||
                missingVIPAccess ||
                (isTicketOrder && ticketTasksAreFrozen)
              }
              onClick={deliver}
            >
              {t("deliver")}
            </Button>
          </div>
        </>
      )}
    </>
  );
};
