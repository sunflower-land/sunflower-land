import React, { useEffect, useState } from "react";
import { LanternName } from "features/game/types/game";
import { Panel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import twoBumpkins from "assets/npcs/two_bumpkins.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { progressBarBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { TimeRemaining } from "./TimeRemaining";

export const WEEKLY_GOAL = 20000;

interface Props {
  lanternName: LanternName;
  endAt: number;
  loaded: boolean;
  totalCrafted: number;
}

export const WeeklyLanternCount: React.FC<Props> = ({
  lanternName,
  endAt,
  loaded,
  totalCrafted,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (loaded && !animate) {
      // Allow for smooth animations
      setTimeout(() => setAnimate(true), 200);
    }
  }, [loaded]);

  const goalReached = totalCrafted >= WEEKLY_GOAL;
  const percentage = (totalCrafted / WEEKLY_GOAL) * 100;

  return createPortal(
    <>
      <div
        onClick={() => setShowModal(true)}
        className="fixed w-[96%] sm:w-96 bottom-4 cursor-pointer z-30"
        style={{
          transform: `translateY(${
            animate ? "9px" : "120px"
          }) translateX(-50%)`,
          transition: "all .5s ease-in-out",
          left: "50%",
        }}
      >
        <Panel>
          <TimeRemaining endAt={endAt} />
          <div className="flex items-center px-1">
            <img
              src={twoBumpkins}
              alt="Community"
              style={{ width: PIXEL_SCALE * 20 }}
            />
            <div
              className="relative flex flex-col w-full mx-1"
              style={{ ...progressBarBorderStyle }}
            >
              <div
                className="relative h-6 w-1/2 dawn-breaker-gradient flex items-center justify-center"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 -right-2"
                  style={{
                    width: PIXEL_SCALE * 10,
                    height: PIXEL_SCALE * 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={ITEM_DETAILS[lanternName].image}
                    alt={lanternName}
                    style={{
                      width: PIXEL_SCALE * 10,
                    }}
                  />
                </div>
              </div>
              <p
                className={classNames(
                  "absolute text-xxs mb-1 top-1/2 -translate-y-1/2",
                  { "left-2": percentage > 50, "right-2": percentage <= 50 }
                )}
              >
                {goalReached
                  ? `Mint goal reached`
                  : `${totalCrafted.toLocaleString()}/${WEEKLY_GOAL.toLocaleString()}`}
              </p>
            </div>
            <img
              src={
                goalReached
                  ? SUNNYSIDE.decorations.treasure_chest_opened
                  : SUNNYSIDE.decorations.treasure_chest
              }
              alt="Reward"
              className="flex justify-end"
              style={{ height: `${PIXEL_SCALE * (goalReached ? 16 : 12)}px` }}
            />
          </div>
        </Panel>
      </div>
      <Modal show={showModal} centered>
        <CloseButtonPanel
          title="Weekly Lantern Challenge"
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Rancher Hair",
            pants: "Farmer Overalls",
            shirt: "Red Farmer Shirt",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <TimeRemaining endAt={endAt} />
          <div className="text-sm p-2 mb-2 space-y-2">
            <p>
              {`Each week, we'll be giving away prizes to those who help us bring
              light back to the island. The more lanterns we craft as a community, the brighter
              our chances of success.`}
            </p>
            <p>
              {`Crafting lanterns gives your the chance to win weekly prizes worth up to 2500 SFL or one of 10 Hoot SFT's (Total Supply 100). But if we come together
            and collectively reach our weekly craft goal, we'll double the prize pool
            to 10,000 SFL.`}
            </p>
            <p>
              {`The top 10 crafters will be guaranteed either a Hoot SFT (1-5) or 5000 SFL (6-10). The remaining prizes will be raffled off to all participants. Each lantern crafted gives you one entry into the raffle.`}
            </p>
          </div>
          <Button onClick={() => setShowModal(false)}>Got it</Button>
        </CloseButtonPanel>
      </Modal>
    </>,
    document.body
  );
};
