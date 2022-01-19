import React from "react";
import { Panel } from "components/ui/Panel";

export const Loading: React.FC = () => {
  return (
    <Panel>
      <span className="text-shadow">Loading...</span>
    </Panel>
  );
};
