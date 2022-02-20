import React, { useContext, useState } from "react";
import { useSprite } from "react-sprite-animator";
import Spritesheet from "react-responsive-spritesheet";
import tree from "assets/resources/tree/tree.png";
import sheet from "assets/resources/tree/chopped_cut.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import { TreeAnimation } from "./Animation";

const POPOVER_TIME_MS = 1000;

interface Props {}
export const Tree: React.FC<Props> = ({ image }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(true);
  const [popover, setPopover] = useState<JSX.Element | null>(null);

  const [shouldAnimate, setShouldAnimate] = useState(false);

  const styles = useSprite({
    sprite: sheet,
    width: 266,
    height: 168,
    fps: 20,
    stopLastFrame: true,
    frameCount: 11,
    shouldAnimate,
    onEnd: () => {
      console.log("done");
      setShouldAnimate(false);
    },
  });

  const displayPopover = async (element: JSX.Element) => {
    setPopover(element);
    setShowPopover(true);

    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const mine = async () => {
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
      <Spritesheet
        className="w-full hover:img-highlight cursor-pointer"
        image={sheet}
        widthFrame={266}
        heightFrame={168}
        fps={18}
        steps={11}
        direction={`forward`}
        autoplay={false}
        loop={true}
        // getInstance={(spritesheet) => {
        //   this.spriteInstance = spritesheet;
        // }}
        onClick={(spritesheet) => {
          //spritesheet.play();
          spritesheet.goToAndPlay(0);
          //mine();
        }}
        onLoopComplete={(spritesheet) => {
          console.log("onLoopComplete");
          spritesheet.pause();
        }}
      />
      <img
        src={tree}
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
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
