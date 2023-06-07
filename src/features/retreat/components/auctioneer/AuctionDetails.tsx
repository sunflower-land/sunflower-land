import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import bg from "assets/ui/brown_background.png";
import calendar from "assets/icons/calendar.png";

import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { getKeys } from "features/game/types/craftables";
import { setImageWidth } from "lib/images";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { AuctioneerItem } from "./actions/auctioneerItems";
import { Auction } from "features/game/lib/auctionMachine";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";

type Props = {
  item: Auction;
  game: GoblinState;
  isUpcomingItem?: boolean;
  onDraftBid: () => void;
};

type TimeObject = {
  time: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
};

const TimerDisplay = ({ time }: TimeObject) => {
  const timeKeys = getKeys(time);

  return (
    <div className="flex w-full justify-evenly">
      {timeKeys.map((key) => {
        const value = time[key];
        const label = value === 1 ? `${key.slice(0, -1)}` : key;

        return (
          <div className="flex flex-col w-1/4 items-center mr-1" key={key}>
            <p className="text-sm">{`${value}`}</p>
            <p className="text-xxs font-thin">{label}</p>
          </div>
        );
      })}
    </div>
  );
};

export const AuctionDetails: React.FC<Props> = ({
  game,
  isUpcomingItem,
  item,
  onDraftBid,
}) => {
  const releaseDate = item?.startAt as number;
  const releaseEndDate = item?.endAt as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);

  const makeSFLRequiredLabel = (sfl: number) => {
    if (game.balance.lt(sfl)) {
      <div className="flex items-center space-x-1">
        <img src={token} className="h-5 mr-1" />
        <Label type="danger">{`${game.balance.toString()}/${sfl}`}</Label>
      </div>;
    }

    return (
      <div className="flex items-center space-x-1">
        <img src={token} className="h-5 mr-1" />
        <span className="text-xxs">{sfl}</span>
      </div>
    );
  };

  const makeIngredients = (ingredients?: AuctioneerItem["ingredients"]) => {
    if (!ingredients) return null;

    return getKeys(ingredients).map((name) => {
      const ingredientAmount = ingredients[name] ?? 0;
      const inventoryItemAmount = game.inventory[name] ?? new Decimal(0);
      const hasIngredient = inventoryItemAmount.gte(ingredientAmount);

      if (!hasIngredient) {
        return (
          <div className="flex items-center space-x-1" key={name}>
            <img src={ITEM_DETAILS[name].image} className="h-5" />
            <Label type="danger">{`${inventoryItemAmount}/${ingredientAmount}`}</Label>
          </div>
        );
      }

      return (
        <div className="flex items-center space-x-1" key={name}>
          <img src={ITEM_DETAILS[name].image} className="h-5" />
          <span className="text-xxs">{ingredientAmount}</span>
        </div>
      );
    });
  };

  const isMintStarted =
    !start.days && !start.hours && !start.minutes && !start.seconds;

  const isMintComplete =
    !end.days && !end.hours && !end.minutes && !end.seconds;

  const hasIngredients =
    getKeys(item.ingredients).every((name) =>
      (game.inventory[name] ?? new Decimal(0)).gte(item.ingredients[name] ?? 0)
    ) ?? false;

  const currentSupply = item.supply;

  const SupplyLabel = () => {
    if (isUpcomingItem) return null;

    return (
      <Label type="info" className="mb-2">
        {`Supply: ${item.supply}`}
      </Label>
    );
  };

  const MintButton = () => {
    if (isUpcomingItem) {
      return null;
    }

    const hasMinted =
      item.type === "collectible"
        ? game.inventory[item.collectible]
        : game.wardrobe[item.wearable];
    if (CONFIG.NETWORK !== "mumbai" && hasMinted) {
      return <span className="text-sm">Already minted</span>;
    }

    return (
      <Button
        disabled={!isMintStarted || isMintComplete || !hasIngredients}
        onClick={onDraftBid}
      >
        Bid
      </Button>
    );
  };

  const AvailableForLabel = (releaseDate: number, endDate: number) => {
    const diff = endDate - releaseDate;
    const time = secondsToString(diff / 1000, { length: "full" });

    return (
      <div className="flex items-center space-x-2 mb-2">
        <img src={SUNNYSIDE.icons.stopwatch} className="w-4" alt="timer" />
        <span className="text-xxs">{`Auction for ${time}`}</span>
      </div>
    );
  };

  const ReleaseDateLabel = (releaseDate: number) => {
    return (
      <div className="flex items-center space-x-2 mb-2">
        <img src={calendar} className="w-4" alt="calendar" />
        <span className="text-xxs">
          {formatDateTime(new Date(releaseDate).toISOString())}
        </span>
      </div>
    );
  };

  const currentSflPrice = Number(item?.sfl || new Decimal(0));

  const image =
    item.type === "collectible"
      ? ITEM_DETAILS[item.collectible].image
      : getImageUrl(ITEM_IDS[item.wearable]);

  return (
    <div className="w-full p-2 mt-2 flex flex-col items-center">
      <div className="w-full p-2 flex flex-col items-center mx-auto">
        <p className="mb-3">
          {item.type === "collectible" ? item.collectible : item.wearable}
        </p>
        <p className="text-center text-sm mb-3">
          {item.type === "collectible"
            ? ITEM_DETAILS[item.collectible].description
            : ""}
        </p>
        {/* {boost && (
          <Label className="mb-2 md:text-center" type="info">
            {`Boost: ${boost}`}
          </Label>
        )} */}
        {SupplyLabel()}
        {!isUpcomingItem && ReleaseDateLabel(releaseDate)}
        {!isUpcomingItem && AvailableForLabel(releaseDate, releaseEndDate)}
        <div className="relative mb-2">
          <img src={bg} className="w-64 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={image}
              className="absolute z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              onLoad={(e) => setImageWidth(e.currentTarget)}
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full">
              <div className="flex flex-col items-center w-full">
                {isMintStarted && (
                  <Label type="warning" className="mb-2">
                    Closes in
                  </Label>
                )}
                {(!isMintStarted || isUpcomingItem) && (
                  <Label type="warning" className="mb-2">
                    Opens in
                  </Label>
                )}

                <TimerDisplay time={isMintStarted ? end : start} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isUpcomingItem && (
        <div className="flex items-center space-x-3 mb-3">
          {currentSflPrice > 0 && makeSFLRequiredLabel(currentSflPrice)}
          {makeIngredients(item?.ingredients)}
        </div>
      )}

      {MintButton()}
    </div>
  );
};
