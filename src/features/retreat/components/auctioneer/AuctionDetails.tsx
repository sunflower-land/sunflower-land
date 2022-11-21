import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import wood from "assets/resources/wood.png";
import bg from "assets/ui/brown_background.png";

import { RedLabel } from "components/ui/RedLabel";
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
  onMint: () => void;
};

export const AuctionDetails: React.FC<Props> = ({
  item: { name, releases, totalMinted, currentRelease },
  isMinting,
  game,
  onMint,
}) => {
  console.log({ currentRelease });
  const releaseDate = currentRelease?.releaseDate as number;
  const releaseEndDate = currentRelease?.endDate as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);

  console.log({ start, end });

  const isMintStarted =
    !start.days && !start.hours && !start.minutes && !start.seconds;

  const isMintComplete =
    !end.days && !end.hours && !end.minutes && !end.seconds;

  // TODO - aggregate previous supplies as well
  const availableSupply = currentRelease?.supply ?? 0;

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

            <div>
              {!isMintStarted && (
                <p className="text-lg z-10 text-center w-full bottom-2">
                  {`${start.days} days ${start.hours} hours ${start.minutes} minutes ${start.seconds} seconds`}
                </p>
              )}

              {isMintStarted && (
                <div className="w-full bottom-2 text-center">
                  <span className="bg-[#ff8f0e] border text-xxs ml-2 p-1 rounded-md">
                    {`Closes in`}
                  </span>
                  <p className="text-lg z-10 text-center w-full bottom-2 mt-1">
                    {`${end.days} days ${end.hours} hours ${end.minutes} minutes ${end.seconds} seconds`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-lg">{availableSupply - (totalMinted ?? 0)} left</p>

      <Button
        className="text-lg"
        disabled={!isMintStarted || isMintComplete || isMinting}
        onClick={onMint}
      >
        Mint
      </Button>

      {releases.map((release) => {
        // TODO Aggregate any previous leftovers :/
        const availableSupply = currentRelease?.supply ?? 0;

        const format = new Intl.DateTimeFormat("en", {
          year: "2-digit",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });

        const sfl = Number(release.price ?? 0);

        const date = format.formatRange(release.releaseDate, release.endDate);
        return (
          <div className="mt-4 w-full">
            <div className="flex justify-between items-start">
              <span
                className={classNames("text-sm", {
                  "line-through": isMintComplete,
                })}
              >
                {date}
              </span>

              {availableSupply <= 0 && <RedLabel>Sold out</RedLabel>}

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
                    <div className="flex mr-4">
                      <img
                        src={ITEM_DETAILS[ingredient.item].image}
                        className="h-6 mr-1"
                      />
                      <RedLabel>{`${inventoryItemAmount}/${ingredient.amount}`}</RedLabel>
                    </div>
                  );
                }

                return (
                  <div className="flex mr-4">
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
                  <RedLabel>{`${game.balance.toString()}/${sfl}`}</RedLabel>
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
