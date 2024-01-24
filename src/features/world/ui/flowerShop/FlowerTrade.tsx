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

// TODO move to backend
const ALREADY_COMPLETE = false;
const REWARD = 1;

interface CompleteProps {
  flowerCount: number;
}

const Complete: React.FC<CompleteProps> = ({ flowerCount }) => {
  const { gameService } = useContext(Context);

  if (ALREADY_COMPLETE) {
    return <Label type="info">Already completed</Label>;
  }

  return (
    <>
      <Button
        disabled={flowerCount < 1}
        onClick={() => gameService.send("bertObsession.completed")}
      >
        {`Trade for ${REWARD} ${getSeasonalTicket()}${REWARD > 0 ? "s" : ""}`}
      </Button>
    </>
  );
};

interface Props {
  desiredFlower: FlowerName;
  flowerCount: number;
}

export const FlowerTrade: React.FC<Props> = ({
  desiredFlower,
  flowerCount,
}) => {
  const desiredFlowerImage = ITEM_DETAILS[desiredFlower].image;

  // TODO if in codex let the player get it immediately

  // TODO update reset seconds
  const resetSeconds = 1;

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
              {secondsToString(resetSeconds, {
                length: "medium",
                removeTrailingZeros: true,
              })}
            </span>
          </div>
        </Label>
      </div>
      <Complete flowerCount={flowerCount} />
    </div>
  );
};
