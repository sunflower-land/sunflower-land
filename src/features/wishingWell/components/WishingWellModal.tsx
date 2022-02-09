import React, { useState } from "react";

import { Panel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Panel className="relative">
      <span>Coming soon...</span>
    </Panel>
  );
};
