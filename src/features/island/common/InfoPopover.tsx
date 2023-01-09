import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  showPopover: boolean;
  position?: {
    top: number;
    left: number;
  };
}

export const InfoPopover: React.FC<Props> = ({
  showPopover,
  children,
  position = { top: -16, left: 16 },
}) => {
  return (
    <InnerPanel
      id="hello"
      className={classNames(
        "transition-opacity absolute sm:opacity-0 w-fit z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        }
      )}
      style={{
        top: `${PIXEL_SCALE * position.top}px`,
        left: `${PIXEL_SCALE * position.left}px`,
      }}
    >
      {children}
    </InnerPanel>
  );
};
