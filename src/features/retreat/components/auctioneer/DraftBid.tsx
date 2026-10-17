import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { formatNumber } from "lib/utils/formatNumber";
import { getMaxAuctionTickets } from "./lib/getMaxAuctionTickets";
import { ITEM_DETAILS } from "features/game/types/images";

import { PIXEL_SCALE } from "features/game/lib/constants";
import type { Auction } from "features/game/lib/auctionMachine";

import sflIcon from "assets/icons/flower_token.webp";
import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import classNames from "classnames";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getAuctionItemType } from "./lib/getAuctionItemType";

interface Props {
  auction: Auction;
  onBid: (auctionTickers: number) => void;
  gameState: GameState;
  onBack: () => void;
}
export const DraftBid: React.FC<Props> = ({
  auction,
  onBid,
  gameState,
  onBack,
}) => {
  const { t } = useAppTranslation();

  const maxTickets = getMaxAuctionTickets(auction, gameState);
  const [tickets, setTickets] = useState(Math.min(5, maxTickets) || 1);
  const [showConfirm, setShowConfirm] = useState(false);
  const end = useCountdown(auction.endAt);

  const paidIngredients = getKeys(auction.ingredients).filter(
    (name) => (auction.ingredients[name] ?? 0) > 0,
  );
  const isMultiIngredientAuction =
    paidIngredients.length + Number(auction.sfl > 0) > 1;
  const isSFLAuction = auction.sfl > 0 && paidIngredients.length === 0;
  const ingredient = paidIngredients[0];

  // Validators for multi ingredient auctions. These auctions go up in multiples of tickets
  const missingSFL = gameState.balance.lt(auction.sfl * tickets);

  const getInputErrorMessage = () => {
    if (end.totalSeconds === 0) return t("auction.closed");
    if (!Number.isInteger(tickets) || tickets < 1) {
      return `${t("minimum")}: 1`;
    }
    if (tickets > maxTickets) return t("cave.notEnough");
    return null;
  };

  const countdown = (
    <Label
      type={end.totalSeconds < 60 ? "danger" : "info"}
      icon={SUNNYSIDE.icons.stopwatch}
      className="ml-auto whitespace-nowrap"
    >
      <TimerDisplay time={end} />
    </Label>
  );

  if (showConfirm) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex w-full p-2">{countdown}</div>
        <div className="p-2 flex-1 flex flex-col items-center justify-center">
          <p className="text-sm text-center mb-2">
            {t("getInputErrorMessage.place.bid")}
          </p>
          <div className="flex items-center flex-wrap justify-center mb-4">
            {auction.sfl > 0 && (
              <div className={classNames("flex items-center  mb-1 mr-3")}>
                <div>
                  <p className="mr-1 text-right text-sm">
                    {auction.sfl * tickets}
                  </p>
                </div>
                <img src={sflIcon} className="h-5" />
              </div>
            )}
            {paidIngredients.map((name) => (
              <div className="flex items-center mb-1 mr-3" key={name}>
                <div>
                  <p className={classNames("mr-1 text-right text-sm")}>
                    {(auction.ingredients[name] ?? 0) * tickets}
                  </p>
                </div>
                <img src={ITEM_DETAILS[name].image} className="h-5" />
              </div>
            ))}
          </div>

          <p className="text-xs mb-2">{t("getInputErrorMessage.cannot.bid")}</p>
        </div>
        <div className="flex w-full gap-1">
          <Button onClick={() => setShowConfirm(false)}>{t("back")}</Button>
          <Button
            disabled={!!getInputErrorMessage()}
            onClick={() => {
              onBid(tickets);
            }}
          >
            {t("confirm")}
          </Button>
        </div>
      </div>
    );
  }

  const item = getAuctionItemType(auction);

  return (
    <>
      <div className="p-2 relative">
        <div className="flex flex-wrap items-center gap-2 w-full border-b border-opacity-50 pb-2 mb-2">
          <img
            onClick={onBack}
            src={SUNNYSIDE.icons.arrow_left}
            className="h-6 cursor-pointer"
          />
          <p className="flex-1 text-sm">{t("place.bid")}</p>
          {countdown}
        </div>

        {/* If there are more than one ingredient inc FLOWER */}
        {isMultiIngredientAuction && (
          <div className="flex items-center justify-center mb-1">
            <Button
              className="w-10 h-10 mr-2 relative cursor-pointer"
              disabled={tickets <= 1}
              longPress
              onClick={() => setTickets((prev) => (prev > 1 ? prev - 1 : prev))}
              longPressInterval={10}
            >
              <img
                src={SUNNYSIDE.icons.minus}
                className="relative top-0.5"
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            </Button>

            <div className="flex items-center flex-wrap justify-center">
              {auction.sfl > 0 && (
                <div
                  className={classNames("flex items-center  mb-1 mr-3", {
                    ["text-red-500"]: missingSFL,
                  })}
                >
                  <div>
                    <p className="mr-1 text-right text-sm">
                      {auction.sfl * tickets}
                    </p>
                  </div>
                  <img src={sflIcon} className="h-5" />
                </div>
              )}
              {paidIngredients.map((name) => (
                <div className="flex items-center mb-1 mr-3" key={name}>
                  <div>
                    <p
                      className={classNames("mr-1 text-right text-sm", {
                        ["text-red-500"]: gameState.inventory[name]?.lt(
                          (auction.ingredients[name] ?? 0) * tickets,
                        ),
                      })}
                    >
                      {(auction.ingredients[name] ?? 0) * tickets}
                    </p>
                  </div>
                  <img src={ITEM_DETAILS[name].image} className="h-5" />
                </div>
              ))}
            </div>

            <Button
              className="w-10 h-10 mr-2 relative cursor-pointer"
              disabled={tickets >= maxTickets}
              onClick={() =>
                setTickets((prev) => (prev >= maxTickets ? prev : prev + 1))
              }
              longPress
              longPressInterval={10}
            >
              <img
                src={SUNNYSIDE.icons.plus}
                className="relative top-0.5"
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            </Button>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center gap-2">
            {!isMultiIngredientAuction && (
              <div className="flex-1 min-w-0">
                <NumberInput
                  value={tickets}
                  maxDecimalPlaces={0}
                  isOutOfRange={!!getInputErrorMessage()}
                  onValueChange={(value) => setTickets(value.toNumber())}
                  icon={
                    isSFLAuction ? sflIcon : ITEM_DETAILS[ingredient]?.image
                  }
                  className="!pr-8"
                />
              </div>
            )}
            <Button
              className="w-auto px-2 whitespace-nowrap"
              disabled={maxTickets < 1 || end.totalSeconds === 0}
              onClick={() => setTickets(maxTickets)}
            >
              {t("max")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mt-1">
            <span>{`${t("available")}:`}</span>
            {auction.sfl > 0 && (
              <span className="inline-flex items-center gap-1">
                {formatNumber(gameState.balance)}
                <img src={sflIcon} alt="FLOWER" className="h-4" />
              </span>
            )}
            {paidIngredients.map((name) => (
              <span key={name} className="inline-flex items-center gap-1">
                {formatNumber(gameState.inventory[name] ?? 0)}
                <img
                  src={ITEM_DETAILS[name].image}
                  alt={name}
                  className="h-4"
                />
              </span>
            ))}
          </div>
          {getInputErrorMessage() && (
            <p className="text-error text-xs mt-1">{getInputErrorMessage()}</p>
          )}
        </div>

        <div className="text-xxs text-center underline mb-3  hover:text-blue-500">
          <a
            href="https://docs.sunflower-land.com/support/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xxs text-center underline mb-3  hover:text-blue-500"
          >
            {t("draftBid.howAuctionWorks")}
          </a>
        </div>

        <div className="flex">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-6 mr-2" />
          <p className="text-sm mb-2">
            {`At the end of the auction, the top ${
              auction.supply
            } bids will mint the ${item}.`}
          </p>
        </div>

        <div className="flex mb-2">
          <img src={SUNNYSIDE.icons.neutral} className="h-6 mr-2" />
          <div>
            <p className="text-sm mb-1">
              {t("draftBid.unsuccessfulParticipants")}
            </p>
          </div>
        </div>
        <div>
          <a
            href="https://docs.sunflower-land.com/support/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xxs text-center underline mb-3  hover:text-blue-500"
          >
            {t("draftBid.termsAndConditions")}
          </a>
        </div>
      </div>
      <Button
        onClick={() => setShowConfirm(true)}
        disabled={!!getInputErrorMessage()}
      >
        {t("bid")}
      </Button>
    </>
  );
};
