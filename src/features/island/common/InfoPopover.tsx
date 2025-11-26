import React, { useEffect, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

interface Props {
  showPopover: boolean;
  className?: string;
  onHide?: () => void;
}

export const InfoPopover: React.FC<React.PropsWithChildren<Props>> = ({
  showPopover,
  children,
  className,
  onHide,
}) => {
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (showPopover) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onHide?.();
      }}
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
