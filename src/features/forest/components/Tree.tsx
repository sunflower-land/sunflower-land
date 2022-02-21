import React, { useContext, useRef, useState } from "react";
import Spritesheet from "react-responsive-spritesheet";
import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";

const POPOVER_TIME_MS = 1000;

export const Tree: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);

  const lastTouchedAt = useRef(0);

  const [touchCount, setTouchCount] = useState(0);
  const [chopped, setChopped] = useState(false);
  const [collected, setCollected] = useState(false);

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const shake = async () => {
    lastTouchedAt.current = new Date().getTime();
    setTouchCount((count) => count + 1);

    if (touchCount === 2) {
      try {
        gameService.send("tree.chopped", {
          index: 0,
          item: selectedItem,
        });

        setChopped(true);
        displayPopover(
          <span className="text-xs text-white text-shadow">Testing only!</span>
        );
        await new Promise((res) => setTimeout(res, 2000));
        setCollected(true);
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover(
          <span className="text-xs text-white text-shadow">{e.message}</span>
        );

        setTouchCount(0);
      }
    }
  };

  const collectWood = async () => {
    setCollected(true);
    // try {
    //   gameService.send("rock.mined", {
    //     index: 0,
    //   });
    // } catch (e: any) {
    //   // TODO - catch more elaborate errors
    //   displayPopover(
    //     <span className="text-xs text-white text-shadow">{e.message}</span>
    //   );
    // }
  };

  return (
    <div>
      {!chopped && (
        <Spritesheet
          className="hover:img-highlight cursor-pointer"
          style={{
            width: `${GRID_WIDTH_PX * 4}px`,
          }}
          image={shakeSheet}
          widthFrame={266}
          heightFrame={168}
          fps={18}
          steps={11}
          direction={`forward`}
          autoplay={false}
          loop={true}
          onClick={(spritesheet) => {
            //spritesheet.play();
            const isPlaying = spritesheet.getInfo("isPlaying");
            console.log({ isPlaying });
            if (isPlaying) {
              return;
            }

            spritesheet.goToAndPlay(0);
            shake();
          }}
          onLoopComplete={(spritesheet) => {
            console.log("onLoopComplete");
            spritesheet.pause();
          }}
        />
      )}

      {chopped && !collected && (
        <Spritesheet
          className="hover:img-highlight cursor-pointer"
          style={{
            width: `${GRID_WIDTH_PX * 4}px`,
          }}
          image={choppedSheet}
          widthFrame={266}
          heightFrame={168}
          fps={18}
          steps={11}
          direction={`forward`}
          autoplay={true}
          loop={false}
        />
      )}

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
