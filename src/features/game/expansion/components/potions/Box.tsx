import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import React from "react";
import { BASIC_POTIONS } from "./lib/potions";
import { PotionName, GuessFeedback, FeedbackIcons } from "./lib/types";

const INNER_CANVAS_WIDTH = 14;

interface Props {
  guess?: PotionName;
  feedback?: GuessFeedback;
}

export const Box: React.FC<Props> = ({ guess, feedback }) => {
  return (
    <div className="relative">
      {feedback && (
        <img
          src={FeedbackIcons[feedback]}
          alt={feedback}
          style={{
            position: "absolute",
            width: `${PIXEL_SCALE * 7}px`,
          }}
          className={classNames("-top-[2px] left-7", {
            "bombed-potion-guess": feedback === "bombed",
          })}
        />
      )}
      <div
        className="bg-brown-600 cursor-pointer m-1"
        style={{
          width: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          height: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {guess && (
          <img
            src={BASIC_POTIONS.find((potion) => potion.name === guess)?.image}
            className={classNames("object-contain w-full h-full", {
              poof: feedback === "bombed",
            })}
          />
        )}
      </div>
    </div>
  );
};
