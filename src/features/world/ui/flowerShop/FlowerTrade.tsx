import { Label } from "components/ui/Label";
import bg from "assets/ui/brown_background.png";
import React, { useContext } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { FlowerName } from "features/game/types/flowers";
import { getSeasonalTicket } from "features/game/types/seasons";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { TICKETS_REWARDED } from "features/game/events/landExpansion/tradeFlowerShop";

interface CompleteProps {
  desiredFlower: FlowerName;
  flowerCount: number;
  alreadyComplete: boolean;
}

const Complete: React.FC<CompleteProps> = ({
  desiredFlower,
  flowerCount,
  alreadyComplete,
}) => {
  const { gameService } = useContext(Context);

  if (alreadyComplete) {
    return <Label type="info">Already completed</Label>;
  }

  return (
    <>
      <Button
        disabled={flowerCount < 1}
        onClick={() =>
          gameService.send("flowerShop.traded", { flower: desiredFlower })
        }
      >
        {`Trade for ${TICKETS_REWARDED} ${getSeasonalTicket()}${
          TICKETS_REWARDED > 0 ? "s" : ""
        }`}
      </Button>
    </>
  );
};

interface Props {
  desiredFlower: FlowerName;
  flowerCount: number;
  alreadyComplete: boolean;
}

export const FlowerTrade: React.FC<Props> = ({
  desiredFlower,
  flowerCount,
  alreadyComplete,
}) => {
  const desiredFlowerImage = ITEM_DETAILS[desiredFlower].image;

  // Get the current date and time in UTC
  const currentDate = new Date();
  const currentUTCDate = new Date(currentDate.toUTCString());

  // Calculate the number of seconds passed in the current week
  const secondsInCurrentWeek =
    currentUTCDate.getDay() * 24 * 60 * 60 +
    currentUTCDate.getUTCHours() * 60 * 60 +
    currentUTCDate.getUTCMinutes() * 60 +
    currentUTCDate.getUTCSeconds();

  // Calculate the total number of seconds in a week
  const totalSecondsInWeek = 7 * 24 * 60 * 60;

  // Calculate the remaining seconds in the week
  const remainingSecondsInWeek = totalSecondsInWeek - secondsInCurrentWeek;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center mx-auto">
        <p className="text-center text-sm mb-3">
          Do you have a {desiredFlower} you would be willing to trade?
        </p>
        <div className="relative mb-2">
          <img src={bg} className="w-48 object-contain rounded-md" />
          <div className="absolute inset-0">
            <img
              src={desiredFlowerImage}
              className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <Label type="warning" className="my-1 mx-auto">
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
            <span>
              {"Offer ends in "}
              {secondsToString(remainingSecondsInWeek, {
                length: "medium",
                removeTrailingZeros: true,
              })}
            </span>
          </div>
        </Label>
      </div>
      <Complete flowerCount={flowerCount} alreadyComplete={!!alreadyComplete} />
    </div>
  );
};
