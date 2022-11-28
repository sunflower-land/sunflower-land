import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import bg from "assets/ui/brown_background.png";

import { Label } from "components/ui/Label";
import { AuctioneerItem } from "./actions/auctioneerItems";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import classNames from "classnames";

type Props = {
  isMinting: boolean;
  item: AuctioneerItem;
  game: GoblinState;
  isUpcomingItem?: boolean;
  onMint: () => void;
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

  const isMintStarted =
    !start.days && !start.hours && !start.minutes && !start.seconds;

  const isMintComplete =
    !end.days && !end.hours && !end.minutes && !end.seconds;

  const hasIngredients =
    currentRelease?.ingredients.every((ingredient) =>
      (game.inventory[ingredient.item] ?? new Decimal(0)).gte(ingredient.amount)
    ) ?? false;

  const currentSupply = releases.reduce(
    (supply, release) =>
      release.releaseDate < Date.now() ? supply + release.supply : supply,
    0
  );

  const remainingSupply = currentSupply - (totalMinted ?? 0);

  const isSoldOut = remainingSupply <= 0;

  return (
    <div className="w-full p-2 flex flex-col items-center">
      <div
        className="w-full p-2 flex flex-col items-center mx-auto"
        style={{
          maxWidth: "350px",
        }}
      >
        <p className="text-base mb-2">{name}</p>
        <p className="text-center text-sm mb-2">
          {ITEM_DETAILS[name].description}
        </p>
        <div className="flex relative mb-2">
          <img src={bg} className="w-full object-contain rounded-md" />
          <div className="absolute inset-0 flex flex-col p-2 items-center justify-center">
            <img
              src={ITEM_DETAILS[name].image}
              className="h-[70%] z-20 object-cover mb-2"
            />

            {!isMintStarted && (
              <div className="flex w-full justify-around relative top-1">
                <div className="flex flex-col items-center mr-1">
                  <p className="text-lg">{`${start.days}`}</p>
                  <p className="text-xs font-thin">days</p>
                </div>
                <div className="flex flex-col items-center mr-1">
                  <p className="text-lg">{`${start.hours}`}</p>
                  <p className="text-xs font-thin">hours</p>
                </div>
                <div className="flex flex-col items-center mr-1">
                  <p className="text-lg">{`${start.minutes}`}</p>
                  <p className="text-xs font-thin">minutes</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-lg">{`${start.seconds}`}</p>
                  <p className="text-xs font-thin">seconds</p>
                </div>
              </div>
            )}

            {isMintStarted && (
              <div className="w-full bottom-2 text-center top-1">
                <span className="bg-[#ff8f0e] border text-xxs ml-2 p-1 rounded-md">
                  {`Closes in`}
                </span>
                <div className="flex w-full justify-around relative">
                  <div className="flex flex-col items-center mr-1">
                    <p className="text-lg">{`${end.days}`}</p>
                    <p className="text-xs font-thin">days</p>
                  </div>
                  <div className="flex flex-col items-center mr-1">
                    <p className="text-lg">{`${end.hours}`}</p>
                    <p className="text-xs font-thin">hours</p>
                  </div>
                  <div className="flex flex-col items-center mr-1">
                    <p className="text-lg">{`${end.minutes}`}</p>
                    <p className="text-xs font-thin">minutes</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-lg">{`${end.seconds}`}</p>
                    <p className="text-xs font-thin">seconds</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {remainingSupply > 0 ? (
        <p className="text-lg">{remainingSupply} left</p>
      ) : (
        <Label type="danger">Sold out</Label>
      )}
      {!isUpcomingItem && !isSoldOut && (
        <Button
          className="text-lg"
          disabled={
            !isMintStarted || isMintComplete || isMinting || !hasIngredients
          }
          onClick={onMint}
        >
          Mint
        </Button>
      )}

      {releases.map((release) => {
        // TODO Aggregate any previous leftovers :/
        const availableSupply = release?.supply ?? 0;

        const format = new Intl.DateTimeFormat("en", {
          year: "2-digit",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        const sfl = Number(release.price ?? 0);

        const date = format.formatRange(release.releaseDate, release.endDate);

        const isFinished = release.endDate < Date.now();

        return (
          <div className="mt-4 w-full" key={release.releaseDate}>
            <div className="flex justify-between items-start">
              <span
                className={classNames("text-sm", {
                  "line-through": isFinished,
                })}
              >
                {date}
              </span>

              {availableSupply <= 0 && <Label type="danger">Sold out</Label>}

              {availableSupply > 0 && (
                <span className="bg-blue-600 border text-xxs ml-2 p-1 rounded-md">
                  {`Supply: ${availableSupply}`}
                </span>
              )}
            </div>

            <div className="flex items-center mb-1 flex-wrap">
              {release.ingredients.map((ingredient) => {
                const inventoryItemAmount =
                  game.inventory[ingredient.item] ?? new Decimal(0);
                const hasIngredient = inventoryItemAmount.gte(
                  ingredient.amount
                );

                if (!hasIngredient) {
                  return (
                    <div className="flex mr-4" key={ingredient.item}>
                      <img
                        src={ITEM_DETAILS[ingredient.item].image}
                        className="h-6 mr-1"
                      />
                      <Label type="danger">{`${inventoryItemAmount}/${ingredient.amount}`}</Label>
                    </div>
                  );
                }

                return (
                  <div className="flex mr-4" key={ingredient.item}>
                    <img
                      src={ITEM_DETAILS[ingredient.item].image}
                      className="h-6 mr-1"
                    />
                    <span className="text-sm">{ingredient.amount}</span>
                  </div>
                );
              })}
              {sfl > 0 && game.balance.lt(sfl) && (
                <div className="flex mr-2">
                  <img src={token} className="h-6 mr-1" />
                  <Label type="danger">{`${game.balance.toString()}/${sfl}`}</Label>
                </div>
              )}
              {sfl > 0 && game.balance.gte(sfl) && (
                <div className="flex mr-2">
                  <img src={token} className="h-6 mr-1" />
                  <span className="text-sm">{sfl}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
