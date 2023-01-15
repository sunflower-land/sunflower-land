import React from "react";

import { Button } from "components/ui/Button";
import bg from "assets/ui/brown_background.png";
import calendar from "assets/icons/calendar.png";
import stopwatch from "assets/icons/stopwatch.png";

import { Label } from "components/ui/Label";
import { AuctioneerItem } from "./actions/auctioneerItems";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { getKeys } from "features/game/types/craftables";
import { setImageWidth } from "lib/images";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { InventoryItemName } from "features/game/types/game";
import classNames from "classnames";
import { AUCTIONEER_ITEMS } from "features/game/types/auctioneer";
import { RequirementLabel } from "components/ui/RequirementLabel";
import {
  getUnplacedAmount,
  hasIngredient,
} from "features/island/hud/components/inventory/utils/inventory";

type Props = {
  isMinting: boolean;
  item: AuctioneerItem;
  game: GoblinState;
  isUpcomingItem?: boolean;
  onMint: () => void;
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
  item: { name, releases, totalMinted, currentRelease },
  isMinting,
  game,
  isUpcomingItem,
  onMint,
}) => {
  const releaseDate = currentRelease?.releaseDate as number;
  const releaseEndDate = currentRelease?.endDate as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);

  const makeSFLRequiredLabel = (sfl: Decimal) => (
    <RequirementLabel type="sfl" balance={game.balance} requirement={sfl} />
  );

  const makeIngredients = (
    ingredients?: {
      item: InventoryItemName;
      amount: number;
    }[]
  ) => {
    if (!ingredients) return null;

    return ingredients.map((ingredient, index) => {
      return (
        <RequirementLabel
          key={index}
          type="item"
          item={ingredient.item}
          balance={getUnplacedAmount(game, ingredient.item)}
          requirement={new Decimal(ingredient.amount)}
        />
      );
    });
  };

  const isMintStarted =
    !start.days && !start.hours && !start.minutes && !start.seconds;

  const isMintComplete =
    !end.days && !end.hours && !end.minutes && !end.seconds;

  const hasIngredients =
    currentRelease?.ingredients.every((ingredient) =>
      hasIngredient(game, ingredient.item, ingredient.amount)
    ) ?? false;

  const focussedRelease = releases.find(
    (release) => release.endDate > Date.now()
  );

  const currentSupply = focussedRelease?.supply ?? 0;

  const remainingSupply = currentSupply - (totalMinted ?? 0);
  const isSoldOut = remainingSupply <= 0;

  const SupplyLabel = () => {
    if (isUpcomingItem) return null;

    if (isMintStarted && remainingSupply > 0) {
      return (
        <Label type="info" className="mb-2">
          {`${totalMinted ?? 0}/${currentSupply} Minted`}
        </Label>
      );
    }

    if (isMintStarted && isSoldOut) {
      return (
        <Label type="danger" className="mb-2">
          Sold out
        </Label>
      );
    }

    return (
      <Label type="info" className="mb-2">
        {`Supply: ${remainingSupply}`}
      </Label>
    );
  };

  const MintButton = () => {
    if (isUpcomingItem || isSoldOut) {
      return null;
    }

    if (game.inventory[name]) {
      return <span className="text-sm">Already minted</span>;
    }

    return (
      <Button
        disabled={
          !isMintStarted || isMintComplete || isMinting || !hasIngredients
        }
        onClick={onMint}
      >
        Mint
      </Button>
    );
  };

  const AvailableForLabel = (releaseDate: number, endDate: number) => {
    return (
      <div className="flex items-center space-x-2 mb-2">
        <img src={stopwatch} className="w-4" alt="timer" />
        <span className="text-xxs">{`Available for ${secondsToString(
          (endDate - releaseDate) / 1000,
          { length: "short" }
        )}`}</span>
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

  const releasesList = isUpcomingItem ? releases : releases.slice(1);
  const currentSflPrice = new Decimal(currentRelease?.price || 0);
  const boost = AUCTIONEER_ITEMS[name].boost;

  return (
    <div className="w-full p-2 mt-2 flex flex-col items-center">
      <div className="w-full p-2 flex flex-col items-center mx-auto">
        <p className="mb-3">{name}</p>
        <p className="text-center text-sm mb-3">
          {ITEM_DETAILS[name].description}
        </p>
        {boost && (
          <Label className="mb-2 md:text-center" type="info">
            {`Boost: ${boost}`}
          </Label>
        )}
        {SupplyLabel()}
        {!isUpcomingItem && ReleaseDateLabel(releaseDate)}
        {!isUpcomingItem && AvailableForLabel(releaseDate, releaseEndDate)}
        <div className="relative mb-2">
          <img src={bg} className="w-64 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={ITEM_DETAILS[name].image}
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
          {currentSflPrice.greaterThan(0) &&
            makeSFLRequiredLabel(currentSflPrice)}
          {makeIngredients(currentRelease?.ingredients)}
        </div>
      )}

      {MintButton()}
      {/* More Releases */}
      {releasesList.length > 0 && (
        <div
          className={classNames("flex flex-col items-start w-full", {
            "mt-4": !isUpcomingItem,
          })}
        >
          <p className="mb-2">
            {isUpcomingItem ? "Releases" : "More Releases"}
          </p>
          {releasesList.map((release, index) => {
            // Upcoming items use full release list - current item slices it so be careful
            let availableSupplyForRelease = 0;

            if (isUpcomingItem) {
              const previousSupply = index > 0 ? releases[index - 1].supply : 0;
              availableSupplyForRelease =
                (release?.supply ?? 0) - previousSupply;
            } else {
              const previousSupply = releases[index].supply;
              availableSupplyForRelease =
                (release?.supply ?? 0) - previousSupply;
            }
            const sfl = new Decimal(release.price ?? 0);

            return (
              <div
                className="border-b last:border-b-0 border-white w-full py-3"
                key={index}
              >
                <div className="flex flex-col items-start w-full">
                  <Label
                    type="info"
                    className="mb-2"
                  >{`Supply: ${availableSupplyForRelease}`}</Label>
                  {ReleaseDateLabel(release.releaseDate)}
                  {AvailableForLabel(release.releaseDate, release.endDate)}
                </div>

                <div className="flex items-center space-x-3 mb-1">
                  {sfl.greaterThan(0) && makeSFLRequiredLabel(sfl)}
                  {makeIngredients(release.ingredients)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
