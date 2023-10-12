import React from "react";

import { pixelDarkBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import classNames from "classnames";

const INNER_CANVAS_WIDTH = 14;

export interface BoxProps {
  image: string;
  hasItem: boolean;
  onClick: () => void;
}

export const SimpleBox: React.FC<BoxProps> = ({ image, hasItem, onClick }) => {
  return (
    <div onClick={onClick}>
      <div
        className={classNames("bg-brown-600 cursor-pointer relative", {
          "opacity-75": !hasItem,
        })}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        <div className="absolute flex justify-center items-center w-full h-full">
          <SquareIcon icon={image} width={INNER_CANVAS_WIDTH} />
        </div>

        {/* Count label */}
        {hasItem && (
          <div className="absolute -top-2 -right-2 w-4">
            <img src={SUNNYSIDE.icons.confirm} className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};
