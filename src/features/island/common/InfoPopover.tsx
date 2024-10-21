import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

interface Props {
  showPopover: boolean;
  className?: string;
}

export const InfoPopover: React.FC<Props> = ({
  showPopover,
  children,
  className,
}) => {
  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute w-fit z-50 pointer-events-none",
        className,
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        },
      )}
    >
      {children}
    </InnerPanel>
  );
};
