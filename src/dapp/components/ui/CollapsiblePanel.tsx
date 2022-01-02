import React from "react";

import chevronLeft from "../../images/ui/chevron_left.png";
import chevronRight from "../../images/ui/chevron_right.png";
import { ImageButton } from "./ImageButton";
import { Panel } from "./Panel";

export interface CollapsiblePanelProps {
  children: React.ReactNode;
  closedContent: React.ReactNode;
  hasInner?: boolean;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  children,
  hasInner,
  closedContent,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Panel {...{ hasInner }}>
      <span className="inner">
        {isOpen ? children : closedContent}
        <ImageButton
          src={isOpen ? chevronLeft : chevronRight}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
      </span>
    </Panel>
  );
};
