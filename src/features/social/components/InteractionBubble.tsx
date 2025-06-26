import React from "react";
import { pixelInteractionBorderStyle } from "features/game/lib/style";

import bubbleBottomLeft from "assets/ui/feed_bubble_btm_left.webp";
import bubbleBottomRight from "assets/ui/feed_bubble_btm_right.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { LABEL_STYLES } from "components/ui/Label";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  direction: "left" | "right";
  type: "comment" | "action" | "milestone" | "announcement";
};

export const InteractionBubble: React.FC<Props> = ({
  children,
  direction,
  type,
}) => {
  if (type === "action") {
    return (
      <div className="relative">
        <div
          className="flex flex-col gap-1 p-1"
          style={{
            ...LABEL_STYLES.default.borderStyle,
            background: LABEL_STYLES.default.background,
            color: LABEL_STYLES.default.textColour,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  if (type === "milestone" || type === "announcement") {
    return (
      <div className="relative">
        <div
          className="flex flex-col gap-1 p-1"
          style={{
            ...LABEL_STYLES.vibrant.borderStyle,
            background: LABEL_STYLES.vibrant.background,
            color: LABEL_STYLES.vibrant.textColour,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="flex flex-col gap-1 p-1"
        style={{
          ...pixelInteractionBorderStyle,
          background: "white",
        }}
      >
        {children}
      </div>
      <img
        id="feed-bubble-bottom"
        src={direction === "left" ? bubbleBottomLeft : bubbleBottomRight}
        className={classNames("absolute -bottom-[2px]", {
          "-left-[2px]": direction === "left",
          "-right-[2px]": direction === "right",
        })}
        style={{ width: PIXEL_SCALE * 2, height: PIXEL_SCALE * 2 }}
      />
    </div>
  );
};
