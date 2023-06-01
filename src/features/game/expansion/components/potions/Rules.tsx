import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FeedbackIcons } from "./lib/types";
import { Button } from "components/ui/Button";

interface IntroProps {
  onComplete: () => void;
}

export const IntroPage: React.FC<IntroProps> = ({ onComplete }) => {
  return (
    <>
      <div className="p-2 pt-0 flex flex-col h-full">
        <div className="text-[18px] leading-5 space-y-2 mb-3 -mt-2">
          <ol></ol>
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
              src={FeedbackIcons["bombed"]}
              style={{
                width: `${PIXEL_SCALE * 7}px`,
                height: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <span>{`Beware the "chaos" potion, it shakes things up!`}</span>
          </div>
        </InnerPanel>
      </div>
      <Button onClick={onComplete}>Got it</Button>
    </>
  );
};
