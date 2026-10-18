import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getWeekKey, weekResetsAt } from "features/game/lib/factions";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import {
  CAVE_MERCHANT_OFFERS,
  getCaveMerchantOffers,
  getCaveMerchantOffersLeft,
  type CaveMerchantOfferId,
} from "features/game/types/caveMerchant";
import { getNextCaveTier } from "features/game/types/caveTiers";
import type { InventoryItemName } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Modal } from "components/ui/Modal";
import {
  CloseButtonPanel,
  type PanelTabs,
} from "features/game/components/CloseablePanel";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { CaveToolsShop } from "./CaveToolsShop";

const _game = (state: MachineState) => state.context.state;

type Tab = "tools" | "trades";

const OFFER_IDS = getKeys(CAVE_MERCHANT_OFFERS);

/** An item square in a trade: the item, its amount, and a lock when locked. */
const TradeBox: React.FC<{
  image: string;
  amount?: string;
  short?: boolean;
  locked?: boolean;
}> = ({ image, amount, short, locked }) => (
  <div
    className={classNames(
      "relative flex shrink-0 items-center justify-center",
      locked ? "bg-brown-700" : "bg-brown-600",
    )}
    style={{
      width: `${PIXEL_SCALE * 18}px`,
      height: `${PIXEL_SCALE * 18}px`,
      ...pixelDarkBorderStyle,
    }}
  >
    <SquareIcon
      icon={image}
      width={11}
      className={classNames({ "opacity-60": locked })}
    />
    {amount && (
      <Label
        type={short ? "danger" : "default"}
        className="absolute text-xxs px-0.5"
        style={{
          bottom: `${PIXEL_SCALE * -4}px`,
          right: `${PIXEL_SCALE * -4}px`,
        }}
      >
        {amount}
      </Label>
    )}
    {locked && (
      <img
        src={SUNNYSIDE.icons.lock}
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * -4}px`,
          right: `${PIXEL_SCALE * -4}px`,
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
    )}
  </div>
);

/** "2 Sand Drill" style text for an offer's reward. */
const rewardText = (offerId: CaveMerchantOfferId) => {
  const { reward } = CAVE_MERCHANT_OFFERS[offerId];
  return getKeys(reward)
    .map((item) => `${reward[item]?.toString()} ${getTranslatedItemName(item)}`)
    .join(", ");
};

/**
 * Gloomwick's menu: the same Sand Shovel / Sand Drill shelf Jafar sells, and
 * his Cave trades (one more offer per Cave tier), with the offers still to
 * come one button away.
 */
export const CaveMerchantModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const now = useNow({ live: true });
  const [tab, setTab] = useState<Tab>("tools");
  // The Trades tab swaps its list for the upcoming offers until Back.
  const [showUpcoming, setShowUpcoming] = useState(false);
  // The offer whose cost items are listed by name (click the cost to toggle).
  const [ingredientsFor, setIngredientsFor] = useState<CaveMerchantOfferId>();

  const tier = game.cave?.tier ?? 0;
  const nextTier = getNextCaveTier(tier);
  const offers = getCaveMerchantOffers(tier);
  const upcoming = OFFER_IDS.filter((id) => !offers.includes(id));
  const periodKey = getWeekKey({ date: new Date(now) });
  const resetsIn = Math.max(
    0,
    (weekResetsAt({ date: new Date(now) }) - now) / 1000,
  );

  const trade = (offerId: CaveMerchantOfferId) =>
    gameService.send({ type: "cave.merchantOfferBought", offerId });

  const owned = (item: InventoryItemName) =>
    game.inventory[item] ?? new Decimal(0);

  const tabs: PanelTabs<Tab>[] = [
    {
      id: "tools",
      icon: ITEM_DETAILS["Sand Shovel"].image,
      name: t("tools"),
    },
    {
      id: "trades",
      icon: ITEM_DETAILS["Green Beetle"].image,
      name: t("cave.merchant.trades"),
    },
  ];

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.gloomwick}
        tabs={tabs}
        currentTab={tab}
        setCurrentTab={(next: React.SetStateAction<Tab>) => {
          setTab(next);
          setShowUpcoming(false);
        }}
        container={OuterPanel}
      >
        {tab === "tools" && <CaveToolsShop />}

        {tab === "trades" && !showUpcoming && (
          <div className="flex flex-col gap-1">
            <InnerPanel className="flex flex-col gap-1 p-1">
              <span className="text-xs">{t("cave.merchant.description")}</span>
              <div className="flex flex-wrap gap-1">
                <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                  {t("cave.merchant.resets", {
                    time: secondsToString(resetsIn, { length: "medium" }),
                  })}
                </Label>
                <Label type="default">
                  {t("cave.merchant.tierProgress", {
                    tier,
                    count: offers.length,
                    total: OFFER_IDS.length,
                  })}
                </Label>
              </div>
            </InnerPanel>

            {offers.map((offerId) => {
              const { cost, reward, limit } = CAVE_MERCHANT_OFFERS[offerId];
              const left = getCaveMerchantOffersLeft({
                merchant: game.cave?.merchant,
                offerId,
                periodKey,
              });
              const coins = cost.coins ?? 0;
              const canAfford =
                game.coins >= coins &&
                getKeys(cost.items).every((item) =>
                  owned(item).gte(cost.items[item] ?? 0),
                );
              const soldOut = left <= 0;

              return (
                <InnerPanel
                  key={offerId}
                  className={classNames(
                    "flex flex-col sm:flex-row sm:items-center gap-2 p-2",
                    { "opacity-70": soldOut },
                  )}
                >
                  <div className="flex items-center gap-2 sm:flex-1 min-w-0">
                    <div
                      className="relative flex items-center gap-1 cursor-pointer"
                      onClick={() =>
                        setIngredientsFor(
                          ingredientsFor === offerId ? undefined : offerId,
                        )
                      }
                    >
                      <IngredientsPopover
                        show={ingredientsFor === offerId}
                        ingredients={getKeys(cost.items)}
                        onClick={() => setIngredientsFor(undefined)}
                      />
                      {getKeys(cost.items).map((item) => {
                        const required = cost.items[item] ?? new Decimal(0);
                        const short = owned(item).lt(required);
                        return (
                          <TradeBox
                            key={item}
                            image={ITEM_DETAILS[item].image}
                            amount={
                              short
                                ? `${owned(item).toString()}/${required.toString()}`
                                : required.toString()
                            }
                            short={short}
                          />
                        );
                      })}
                      {coins > 0 && (
                        <TradeBox
                          image={SUNNYSIDE.ui.coinsImg}
                          amount={coins.toString()}
                          short={game.coins < coins}
                        />
                      )}
                    </div>
                    <img
                      src={SUNNYSIDE.icons.arrow_right}
                      className="shrink-0"
                      style={{ width: `${PIXEL_SCALE * 7}px` }}
                    />
                    {getKeys(reward).map((item) => (
                      <TradeBox
                        key={item}
                        image={ITEM_DETAILS[item].image}
                        amount={reward[item]?.toString()}
                      />
                    ))}
                    <span className="text-sm ml-1 truncate">
                      {rewardText(offerId)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <Label type={soldOut ? "danger" : "formula"}>
                      {soldOut
                        ? t("cave.merchant.soldOut")
                        : t("cave.merchant.left", { left, limit })}
                    </Label>
                    <Button
                      className="w-28"
                      disabled={soldOut || !canAfford}
                      onClick={() => trade(offerId)}
                    >
                      {t("cave.merchant.trade")}
                    </Button>
                  </div>
                </InnerPanel>
              );
            })}

            {/* Each Cave tier adds one more offer: see what is still to come. */}
            {nextTier && (
              <Button onClick={() => setShowUpcoming(true)}>
                <div className="flex items-center justify-center gap-2">
                  <img
                    src={SUNNYSIDE.icons.lock}
                    style={{ width: `${PIXEL_SCALE * 7}px` }}
                  />
                  <span>
                    {t("cave.merchant.moreOffers", { tier: nextTier })}
                  </span>
                </div>
              </Button>
            )}
          </div>
        )}

        {tab === "trades" && showUpcoming && (
          <div className="flex flex-col gap-1">
            <InnerPanel className="flex flex-col gap-1 p-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={t("back")}
                  className="flex shrink-0 cursor-pointer"
                  onClick={() => setShowUpcoming(false)}
                >
                  <img src={SUNNYSIDE.icons.arrow_left} className="h-6" />
                </button>
                <Label type="default">{t("cave.merchant.upcoming")}</Label>
              </div>
              <span className="text-xs">
                {t("cave.merchant.upcomingDescription")}
              </span>
            </InnerPanel>

            {upcoming.map((offerId) => {
              const { cost, reward, requiresTier } =
                CAVE_MERCHANT_OFFERS[offerId];
              return (
                <InnerPanel
                  key={offerId}
                  className="flex items-center gap-2 p-2"
                >
                  {getKeys(reward).map((item) => (
                    <TradeBox
                      key={item}
                      image={ITEM_DETAILS[item].image}
                      locked
                    />
                  ))}
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-sm truncate">
                      {rewardText(offerId)}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {getKeys(cost.items).map((item) => (
                        <Label
                          key={item}
                          type="default"
                          icon={ITEM_DETAILS[item].image}
                        >
                          {cost.items[item]?.toString()}
                        </Label>
                      ))}
                      {!!cost.coins && (
                        <Label type="default" icon={SUNNYSIDE.ui.coinsImg}>
                          {cost.coins.toString()}
                        </Label>
                      )}
                    </div>
                  </div>
                  <Label type="formula">
                    {t("cave.merchant.tier", { tier: requiresTier })}
                  </Label>
                </InnerPanel>
              );
            })}
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
