import React from "react";
import Decimal from "decimal.js-light";

// TODO - dynamically load in their bumpkin
import nft from "assets/bumpkins/example.png";

import stopwatch from "assets/icons/stopwatch.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";

import { GameState } from "features/game/types/game";
import { Button } from "components/ui/Button";
import { Ingredients } from "./Ingredients";
import { LandRequirements } from "../lib/constants";
import { secondsToLongString } from "lib/utils/time";

// TODO - load from API
const LAND_REQUIREMENTS: LandRequirements = {
  resources: [
    {
      item: "Wood",
      amount: new Decimal(50),
    },
    {
      item: "Stone",
      amount: new Decimal(10),
    },
  ],
  sfl: new Decimal(5),
  seconds: 60,
  bumpkinLevel: 2,
};

interface Props {
  gameState: GameState;
  onClose: () => void;
  onExpand: () => void;
}

export const UpcomingExpansionModal: React.FC<Props> = ({
  gameState,
  onClose,
  onExpand,
}) => {
  return (
    <div>
      <img src={nft} className="absolute w-1/3 left-2 -top-28 -z-10" />
      <div className="flex items-start">
        <span>Want to expand your land and discover new resources?</span>
        <img
          src={close}
          className="h-6 ml-2 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="my-2 flex justify-between items-end">
        <Ingredients
          resources={LAND_REQUIREMENTS.resources}
          sfl={LAND_REQUIREMENTS.sfl}
          gameState={gameState}
        />
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-1">
            <img src={hammer} className="w-4 mr-2" />
            <img src={stopwatch} className="w-4 mr-2" />
            <span className="text-sm">
              {secondsToLongString(LAND_REQUIREMENTS.seconds)}
            </span>
          </div>
          <Button className="w-40" onClick={onExpand}>
            Expand
          </Button>
        </div>
      </div>
    </div>
  );
};
