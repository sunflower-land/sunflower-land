import React from "react";

import { FruitName } from "features/game/types/fruits";
import { FruitLifecycle } from "./fruits";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";

interface Props {
  showFruitDetails: boolean | undefined;
  lifecycle: FruitLifecycle;
  plantedFruitName: FruitName;
  timeLeft: number;
}

export const Popover = ({
  showFruitDetails,
  lifecycle,
  plantedFruitName,
  timeLeft,
}: Props) => {
  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-12 w-fit left-7 z-50 pointer-events-none",
        {
          "opacity-100": showFruitDetails,
          "opacity-0": !showFruitDetails,
        }
      )}
    >
      <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={lifecycle.ready} className="w-4 mr-1" />
          <span>{plantedFruitName}</span>
        </div>
        <span className="flex-1">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
