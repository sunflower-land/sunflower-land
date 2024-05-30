import React, { ChangeEvent, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Auction } from "features/game/lib/auctionMachine";

import sflIcon from "assets/icons/sfl.webp";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import classNames from "classnames";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "./AuctionDetails";
import {
  INPUT_MAX_CHAR,
  VALID_NUMBER,
} from "features/island/hud/components/AddSFL";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * If they have enough resources, default the bid to 5 tickets
 */
function getInitialTickets(auction: Auction, gameState: GameState) {
  const defaultTickets = 5;

  if (gameState.balance.lt(auction.sfl * defaultTickets)) {
    return 1;
  }

  if (
    getKeys(auction.ingredients).some(
      (name) =>
        !gameState.inventory[name]?.gt(
          (auction.ingredients[name] ?? 0) * defaultTickets
        )
    )
  ) {
    return 1;
  }

  return defaultTickets;
}

interface Props {
  auction: Auction;
  maxTickets: number;
  onBid: (auctionTickers: number) => void;
  gameState: GameState;
  onBack: () => void;
}
export const DraftBid: React.FC<Props> = ({
  auction,
  onBid,
  maxTickets,
  gameState,
  onBack,
}) => {
  const { t } = useAppTranslation();

  const minTickets = getInitialTickets(auction, gameState);
  const [tickets, setTickets] = useState(minTickets);
  const [showConfirm, setShowConfirm] = useState(false);
  const end = useCountdown(auction.endAt);

  const isMultiIngredientAuction = getKeys(auction.ingredients).length > 1;
  const isSFLAuction =
    auction.sfl > 0 && getKeys(auction.ingredients).length === 0;
  const ingredient = getKeys(auction.ingredients)[0];

  // Validators for multi ingredient auctions. These auctions go up in multiples of tickets
  const missingSFL = gameState.balance.lt(auction.sfl * tickets);
  const missingIngredients = getKeys(auction.ingredients).some((name) =>
    gameState.inventory[name]?.lt((auction.ingredients[name] ?? 0) * tickets)
  );

  const getInputErrorMessage = () => {
    if (tickets < minTickets) {
      if (isSFLAuction) {
        return `Minimum bid is ${minTickets} SFL`;
      }

      return `Minimum bid is ${minTickets} ${ingredient}'s`;
    }

    if (isSFLAuction && gameState.balance.lt(tickets)) {
      return `You don't have enough SFL`;
    }

    if (gameState.inventory[ingredient]?.lt(tickets)) {
      return `You don't have enough ${ingredient}'s`;
    }

    if (Date.now() > auction.endAt) {
      return `Auction has ended`;
    }

    return null;
  };

  if (showConfirm) {
    return (
      <div
        className="flex flex-col justify-center items-center relative"
        style={{ height: "200px" }}
      >
        <div className="absolute -top-2 right-0">
          {TimerDisplay({
            time: end,
            fontSize: 32,
            color: end.minutes >= 1 ? "white" : "red",
          })}
        </div>
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
            {getKeys(auction.ingredients).map((name) => (
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
        <div className="flex w-full">
          <Button className="mr-1" onClick={() => setShowConfirm(false)}>
            {t("back")}
          </Button>
          <Button
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

  return (
    <>
      <div className="p-2 relative">
        <div className="flex items-center justify-between w-full border-b border-opacity-50 pb-1 mb-2">
          <img
            onClick={onBack}
            src={SUNNYSIDE.icons.arrow_left}
            className="h-8 cursor-pointer"
          />
          <p className="-ml-5">{t("place.bid")}</p>
          <div />
        </div>

        <div className="absolute -top-2 right-0">
          {TimerDisplay({
            time: end,
            fontSize: 32,
            color: end.minutes >= 1 ? "white" : "red",
          })}
        </div>

        {/* If there are more than one ingredient inc SFL */}
        {isMultiIngredientAuction && (
          <div className="flex items-center justify-center mb-1">
            <Button
              className="w-10 h-10 mr-2 relative cursor-pointer"
              disabled={tickets === 1}
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
              {getKeys(auction.ingredients).map((name) => (
                <div className="flex items-center mb-1 mr-3" key={name}>
                  <div>
                    <p
                      className={classNames("mr-1 text-right text-sm", {
                        ["text-red-500"]: gameState.inventory[name]?.lt(
                          (auction.ingredients[name] ?? 0) * tickets
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
              disabled={tickets === maxTickets}
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

        {/* If there is only one ingredient/SFL */}
        {!isMultiIngredientAuction && (
          <div className="relative flex flex-col items-center mb-[14px]">
            <div className="relative inline-block">
              <input
                style={{
                  boxShadow: "#b96e50 0px 1px 1px 1px inset",
                  border: "2px solid #ead4aa",
                }}
                type="number"
                value={tickets}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // Strip the leading zero from numbers
                  if (
                    /^0+(?!\.)/.test(e.target.value) &&
                    e.target.value.length > 1
                  ) {
                    e.target.value = e.target.value.replace(/^0/, "");
                  }

                  if (VALID_NUMBER.test(e.target.value)) {
                    const amount = Number(
                      e.target.value.slice(0, INPUT_MAX_CHAR)
                    );
                    setTickets(amount);
                  }
                }}
                className={classNames(
                  "my-1 text-shadow rounded-sm shadow-inner shadow-black bg-brown-200 p-2 h-10",
                  {
                    "text-error": !!getInputErrorMessage(),
                  }
                )}
              />
              <img
                src={isSFLAuction ? sflIcon : ITEM_DETAILS[ingredient].image}
                alt="Currency"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5"
              />
            </div>
            <p className="absolute -bottom-4 text-error text-[11px] font-error">
              {getInputErrorMessage()}
            </p>
          </div>
        )}

        <div className="text-xxs text-center underline mb-3  hover:text-blue-500">
          <a
            href="https://docs.sunflower-land.com/player-guides/auctions"
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
            } bids will mint the ${
              auction.type === "collectible"
                ? auction.collectible
                : auction.wearable
            }.`}
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
            href="https://docs.sunflower-land.com/player-guides/auctions"
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
        disabled={
          isMultiIngredientAuction
            ? missingSFL || missingIngredients || Date.now() > auction.endAt
            : !!getInputErrorMessage()
        }
      >
        {t("bid")}
      </Button>
    </>
  );
};
