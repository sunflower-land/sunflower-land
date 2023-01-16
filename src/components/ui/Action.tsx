import React from "react";

import { InnerPanel } from "./Panel";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  text: string;
  icon: any;
  onClick?: () => void;
  className: string;
}

export const Action: React.FC<Props> = ({ text, icon, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={classNames("relative cursor-pointer z-20", className)}
    >
      <InnerPanel
        className="relative text-white text-xs w-fit"
        style={{
          height: `${PIXEL_SCALE * 13}px`,
          left: `${PIXEL_SCALE * 5}px`,
        }}
      >
        <span className="pl-4 pr-1">{text}</span>
      </InnerPanel>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          height: `${PIXEL_SCALE * 19}px`,
          top: `${PIXEL_SCALE * -3}px`,
          left: `${PIXEL_SCALE * -6}px`,
        }}
      >
        <img
          src={SUNNYSIDE.icons.disc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            height: `${PIXEL_SCALE * 19}px`,
          }}
        />
        <img
          src={icon}
          className="absolute"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (
              !img ||
              !img.complete ||
              !img.naturalWidth ||
              !img.naturalHeight
            ) {
              return;
            }

            const left = Math.floor((18 - img.naturalWidth) / 2);
            const top = Math.floor((18 - img.naturalHeight) / 2);
            img.style.left = `${PIXEL_SCALE * left}px`;
            img.style.top = `${PIXEL_SCALE * top}px`;
            setImageWidth(img);
          }}
          style={{
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
};
