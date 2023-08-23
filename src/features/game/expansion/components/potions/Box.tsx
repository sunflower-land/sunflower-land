import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import React from "react";
import { POTIONS } from "./lib/potions";
import { FeedbackIcons } from "./lib/types";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { PotionName, PotionStatus } from "features/game/types/game";

const INNER_CANVAS_WIDTH = 14;

interface Props {
  potionName: PotionName | null;
  potionStatus?: PotionStatus;
  selected?: boolean;
  onClick?: () => void;
}

export const Box: React.FC<Props> = ({
  potionName,
  selected = false,
  potionStatus,
  onClick,
}) => {
  return (
    <>
      <div className="relative">
        {potionStatus && potionStatus !== "pending" && (
          <img
            src={FeedbackIcons[potionStatus]}
            alt={potionStatus}
            style={{
              position: "absolute",
              width: `${PIXEL_SCALE * 7}px`,
            }}
            className="-top-[2px] left-7"
          />
        )}
        <div
          className="bg-brown-600 cursor-pointer m-1"
          style={{
            width: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
            height: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
            ...pixelDarkBorderStyle,
          }}
          onClick={onClick}
        >
          {potionName && (
            <img
              src={POTIONS[potionName].image}
              className="object-contain w-full h-full"
            />
          )}
        </div>
      </div>
      {selected && <SelectBox />}
    </>
  );
};

const SelectBox = () => {
  return (
    <>
      <img
        className="absolute pointer-events-none"
        src={selectBoxBL}
        style={{
          top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          left: 0,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxBR}
        style={{
          top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxTL}
        style={{
          top: 0,
          left: 0,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
      <img
        className="absolute pointer-events-none"
        src={selectBoxTR}
        style={{
          top: 0,
          left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH - 8}px`,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      />
    </>
  );
};
