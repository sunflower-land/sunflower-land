import React, { useContext, useState } from "react";

import goldRock from "assets/resources/gold_rock.png";
import ironRock from "assets/resources/iron_rock.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";

const POPOVER_TIME_MS = 1000;

interface Props {
  image: any;
}
export const Rock: React.FC<Props> = ({ image }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const mine = () => {
    try {
      gameService.send("rock.mined", {
        index: 0,
      });
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover(
        <span className="text-xs text-white text-shadow">{e.message}</span>
      );
    }
  };

  return (
    <div>
      <img
        src={image}
        className="w-full hover:img-highlight cursor-pointer"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
        }}
        onClick={mine}
      />
      <div
        className={classNames(
          "transition-opacity absolute -bottom-2 w-40 -left-16 z-20 pointer-events-none",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        {popover}
      </div>
    </div>
  );
};
