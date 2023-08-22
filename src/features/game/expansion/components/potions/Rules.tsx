import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FeedbackIcons } from "./lib/types";
import { Button } from "components/ui/Button";

interface Props {
  onDone: () => void;
}

export const Rules: React.FC<Props> = ({ onDone }) => {
  return (
    <>
      <div className="p-2 pt-0 flex flex-col h-full mt-2">
        <div className="text-[16px] leading-4 space-y-2 mb-3 -mt-2">
          <p>
            {`At the beginning of the game, the plant will randomly pick a
            combination of 4 potions and 1 "chaos" potion. The combination can be all different or all the
            same.`}
          </p>
          <p>
            Objective: Figure out the combination. You have 3 tries to get it
            right. The game will end if you have a perfect potion or if you run
            out of tries.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Choose a combination of potions and attempt to mix them.</li>
            <li>Adjust your next combination based on the feedback given.</li>
            <li>{`If you add the "chaos" potion your score for that attempt will be 0.`}</li>
            <li>
              When the game is complete, the score for your last attempt will
              determine help to determine your reward.
            </li>
          </ol>
        </div>
        <InnerPanel className="text-xxs space-y-1 p-1 mt-1">
          <p className="mb-2">{`Pay attention to the feedback icons:`}</p>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["correct"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>A perfect potion in the perfect position</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["almost"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>Correct potion but wrong position</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["incorrect"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>Oops, wrong potion</span>
          </div>
          <div className="flex items-center space-x-1">
            <img
              src={FeedbackIcons["bomb"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{`Beware the "chaos" potion, it shakes things up!`}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onDone}>Got it</Button>
    </>
  );
};
