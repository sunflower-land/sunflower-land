import React, { useContext, useRef, useState } from "react";
import Spritesheet from "react-responsive-spritesheet";

import shakeSheet from "assets/resources/tree/shake_sheet.png";
import choppedSheet from "assets/resources/tree/chopped_sheet.png";
import stump from "assets/resources/tree/stump.png";
import wood from "assets/resources/wood.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";

const POPOVER_TIME_MS = 1000;

export const Tree: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);

  const [showPopover, setShowPopover] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();

  const gif = useRef<Spritesheet>();

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
    const isPlaying = gif.current?.getInfo("isPlaying");
    if (isPlaying) {
      return;
    }

    gif.current?.goToAndPlay(0);

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

  return (
    <div className="relative" style={{ height: "106px" }}>
      {!chopped && (
        <div className="group cursor-pointer  w-full h-full" onClick={shake}>
          <Spritesheet
            className="group-hover:img-highlight pointer-events-none transform"
            style={{
              width: `${GRID_WIDTH_PX * 4}px`,
              // Line it up with the click area
              transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
            }}
            getInstance={(spritesheet) => {
              gif.current = spritesheet;
            }}
            image={shakeSheet}
            widthFrame={266}
            heightFrame={168}
            fps={18}
            steps={11}
            direction={`forward`}
            autoplay={false}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
            }}
          />
        </div>
      )}

      {chopped && (
        <>
          <Spritesheet
            style={{
              width: `${GRID_WIDTH_PX * 4}px`,
              // Line it up with the click area
              transform: `translateX(-${GRID_WIDTH_PX * 2.5}px)`,
              opacity: collected ? 0 : 1,
              transition: "opacity 0.2s ease-in",
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
          <img
            src={stump}
            className="absolute"
            style={{
              width: `${GRID_WIDTH_PX}px`,
              bottom: "9px",
              left: "5px",
            }}
          />
        </>
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
