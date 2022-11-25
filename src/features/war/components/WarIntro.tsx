import React, { useEffect, useState } from "react";

import femaleGoblin from "assets/npcs/goblin_female.gif";
import femaleHuman from "assets/npcs/human_female.gif";
import warCollection from "assets/announcements/warCollection.png";
import warBond from "assets/icons/warBond.png";
import chest from "assets/npcs/synced.gif";
import firelighter from "assets/quest/firelighter.gif";
import humanBanner from "assets/sfts/human_banner.png";
import goblinBanner from "assets/sfts/goblin_banner.png";

import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { WarSide } from "features/game/events/pickSide";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { warChant } from "lib/utils/sfx";

interface Props {
  onPickSide: (side: WarSide) => void;
}

export const WarIntro: React.FC<Props> = ({ onPickSide }) => {
  const [scrollIntoView] = useScrollIntoView();
  const [state, setState] = useState<
    | "intro"
    | "collectResources"
    | "warBonds"
    | "rewards"
    | "getReady"
    | "chooseSide"
  >("intro");

  useEffect(() => {
    if (!warChant.playing()) {
      warChant.play();
    }
    return () => {
      scrollIntoView(Section["War Recruiter"]);
    };
  }, []);

  const pickSide = (side: WarSide) => {
    warChant.fade(0.2, 0, 2000);
    onPickSide(side);
  };
  const Content = () => {
    if (state === "intro") {
      return (
        <div className="flex flex-col items-center px-1">
          <span>A war is brewing</span>
          <div className="flex items-end">
            <img src={femaleGoblin} className="w-12 mr-1" />
            <img
              src={femaleHuman}
              className="w-11"
              style={{
                transform: "scaleX(-1)",
              }}
            />
          </div>
          <span className="text-sm mt-2">
            Tensions are rising in Sunflower Land.
          </span>
          <span className="text-sm mt-2 mb-2">
            The goblins and humans are recruiting players to help the war
            effort.
          </span>
          <Button onClick={() => setState("collectResources")}>Continue</Button>
        </div>
      );
    }

    if (state === "collectResources") {
      return (
        <div className="flex flex-col items-center px-1">
          <span>Collect resources</span>
          <img src={warCollection} className="w-36 mt-2" />
          <span className="text-sm mt-2">
            Each week the war collectors will need different resources for the
            war.
          </span>
          <span className="text-sm mt-3 mb-1">
            In exchange for your resources, you will be rewarded with war bonds.
          </span>
          <Button onClick={() => setState("warBonds")}>Continue</Button>
        </div>
      );
    }

    if (state === "warBonds") {
      return (
        <div className="flex flex-col items-center px-1">
          <span>War Bonds</span>
          <img src={warBond} className="w-36 mt-2" />
          <span className="text-sm mt-2">
            War bonds can be exchanged for rare items at Goblin Village.
          </span>
          <span className="text-sm mt-3 mb-2">
            {`The players with the most war bonds will get access to limited
            items. Don't miss out!`}
          </span>
          <Button onClick={() => setState("rewards")}>Continue</Button>
        </div>
      );
    }

    if (state === "rewards") {
      return (
        <div className="flex flex-col items-center px-1">
          <span>Rewards</span>
          <img src={chest} className="w-16 mt-2" />
          <span className="text-sm mt-2">
            At the end of each week, the top warriors will be airdropped items.
          </span>
          <span className="text-sm mt-3 mb-2">
            Over the course of the war, the winning side will be rewarded with
            bounty. Make sure you follow the latest war news on Discord and
            Twitter.
          </span>
          <Button onClick={() => setState("getReady")}>Continue</Button>
        </div>
      );
    }

    if (state === "getReady") {
      return (
        <div className="flex flex-col items-center px-1">
          <span>Pick a side</span>
          <div className="flex items-end">
            <img src={femaleGoblin} className="w-12 mr-1" />
            <img
              src={femaleHuman}
              className="w-11"
              style={{
                transform: "scaleX(-1)",
              }}
            />
          </div>
          <span className="text-sm mt-2">
            Get ready, the war begins on the 5th of September.
          </span>
          <span className="text-sm mt-3 mb-2">
            It is time to choose a side. You cannot change sides.
          </span>
          <Button onClick={() => setState("chooseSide")}>Continue</Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Modal show={state !== "chooseSide"} centered>
        <Panel>{Content()}</Panel>
      </Modal>
      <div
        className={classNames(
          "fixed inset-0 z-50 opacity-0 transition-opacity pointer-events-none",
          { ["opacity-100 pointer-events-auto"]: state === "chooseSide" }
        )}
      >
        <div className="absolute inset-0 bg-black opacity-90" />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex flex-col max-w-3xl">
            <span className="cave text-lg sm:text-[30px] text-white text-center mb-10">
              GET READY FOR WAR
            </span>
            <div className="flex justify-evenly">
              <img
                src={humanBanner}
                className="animate-float cursor-pointer"
                style={{
                  width: `${14 * PIXEL_SCALE * 2}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255,249,78,0.69))",
                }}
                onClick={() => pickSide(WarSide.Human)}
              />
              <img
                src={goblinBanner}
                className="animate-float cursor-pointer"
                style={{
                  width: `${14 * PIXEL_SCALE * 2}px`,
                  filter: "drop-shadow(0px 0px 8px rgba(255 ,79,79,0.69))",
                }}
                onClick={() => pickSide(WarSide.Goblin)}
              />
            </div>
            <div className="flex justify-between">
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
              <img
                src={firelighter}
                className="cave"
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
            </div>
            <span className="text-lg text-shadow text-white text-center">
              Choose a side
            </span>
            <span className="text-lg text-shadow text-white text-center">
              Team Sunflower or Team Goblin?
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
