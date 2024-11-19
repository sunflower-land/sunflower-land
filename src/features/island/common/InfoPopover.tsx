import React, { useEffect, useState } from "react";

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
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (showPopover) {
      setContent(children);
    } else {
      const timer = setTimeout(() => {
        setContent(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showPopover, children]);

  return (
    <InnerPanel
      className={classNames(
        "transition-opacity duration-200 absolute w-fit z-50 pointer-events-none",
        className,
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        },
      )}
    >
      {content}
    </InnerPanel>
  );
};
