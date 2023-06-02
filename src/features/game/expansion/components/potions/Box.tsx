import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  pixelDarkBorderStyle,
  pixelLightBorderStyle,
} from "features/game/lib/style";
import React from "react";
import { POTIONS } from "./lib/potions";
import { PotionName, GuessFeedback, FeedbackIcons } from "./lib/types";
import classNames from "classnames";

const INNER_CANVAS_WIDTH = 14;

interface Props {
  potionName: PotionName | null;
  feedback?: GuessFeedback;
  onClick?: () => void;
}

export const Box: React.FC<Props> = ({ potionName, feedback, onClick }) => {
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
          className="-top-[2px] left-7"
        />
      )}
      <div
        className={classNames("bg-brown-600 cursor-pointer m-1", {
          "bg-brown-600": !onClick,
          "bg-brown-200": !!onClick,
        })}
        style={{
          width: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          height: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          ...(onClick ? pixelLightBorderStyle : pixelDarkBorderStyle),
        }}
        onClick={onClick}
      >
        {potionName && (
          <img
            src={POTIONS.find((potion) => potion.name === potionName)?.image}
            className="object-contain w-full h-full"
          />
        )}
      </div>
    </div>
  );
};
