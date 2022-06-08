import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GoblinProvider";

import door from "assets/quest/door.png";
import collapsedDoor from "assets/quest/door_collapsed.png";
import firelighter from "assets/quest/firelighter.gif";
import ancientGoblinSword from "assets/nfts/quest/ancient_goblin_sword.png";
import ancientHumanWarmmer from "assets/nfts/quest/ancient_human_warhammer.png";

export const AncientDoor: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [{ context }] = useActor(goblinService);

  const [showCave, setShowCave] = useState(false);

  const selectItem = (
    item: "Ancient Goblin Sword" | "Ancient Human Warhammer"
  ) => {
    goblinService.send("MINT", { item, captcha: "0x" });
    setShowCave(false);
  };

  const canOpen =
    context.state.inventory["Goblin Key"] &&
    context.state.inventory["Sunflower Key"];

  const isCollapsed =
    context.state.inventory["Ancient Goblin Sword"] ||
    context.state.inventory["Ancient Human Warhammer"];

  return isCollapsed ? (
    <img
      src={collapsedDoor}
      className="absolute"
      style={{
        left: `${GRID_WIDTH_PX * 8.07}px`,
        width: `${GRID_WIDTH_PX * 2}px`,
        top: `${GRID_WIDTH_PX * -2.14}px`,
      }}
    />
  ) : (
    <>
      <img
        src={firelighter}
        className="absolute z-10"
        style={{
          left: `${GRID_WIDTH_PX * 7.57}px`,
          width: `${GRID_WIDTH_PX}px`,
          top: `${GRID_WIDTH_PX * -2.14}px`,
        }}
      />
      <img
        src={firelighter}
        className="absolute z-10"
        style={{
          left: `${GRID_WIDTH_PX * 9.55}px`,
          width: `${GRID_WIDTH_PX}px`,
          top: `${GRID_WIDTH_PX * -2.14}px`,
        }}
      />
      <img
        src={door}
        className={classNames("absolute", {
          ["hover:img-highlight cursor-pointer"]: canOpen,
        })}
        style={{
          left: `${GRID_WIDTH_PX * 8.07}px`,
          width: `${GRID_WIDTH_PX * 2}px`,
          top: `${GRID_WIDTH_PX * -2.14}px`,
        }}
        onClick={canOpen ? () => setShowCave(true) : undefined}
      />
      <div
        className={classNames(
          "fixed inset-0 z-50 opacity-0 transition-opacity pointer-events-none",
          { ["opacity-100 pointer-events-auto"]: showCave }
        )}
      >
        <div className="absolute inset-0 bg-black opacity-90" />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex flex-col max-w-3xl">
            <div className="flex justify-evenly">
              <img
                src={ancientGoblinSword}
                className="animate-float cursor-pointer"
                style={{
                  width: `${GRID_WIDTH_PX * 2}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255,249,78,0.69))",
                }}
                onClick={() => selectItem("Ancient Goblin Sword")}
              />
              <img
                src={ancientHumanWarmmer}
                className="animate-float cursor-pointer"
                style={{
                  width: `${GRID_WIDTH_PX * 2}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255 ,79,79,0.69))",
                }}
                onClick={() => selectItem("Ancient Human Warhammer")}
              />
            </div>
            <div className="flex justify-between">
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${GRID_WIDTH_PX * 2}px`,
                }}
              />
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${GRID_WIDTH_PX * 2}px`,
                }}
              />
            </div>
            <span className="text-xl text-shadow text-white text-center">
              The cave is collapsing!
            </span>
            <span className="text-xl text-shadow text-white text-center">
              Pick an artifact and
            </span>
            <span className="cave text-xl text-shadow text-white text-center">
              GET OUT!
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
