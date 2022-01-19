import { Panel } from "components/ui/Panel";
import React from "react";

export const Beta: React.FC = () => {
  return (
    <Panel>
      <span className="text-shadow">
        Beta is only accessible to our OG farmers.
      </span>
      <span className="text-shadow text-xs block mt-4">
        Stay tuned for updates. We will be going live soon!
      </span>
    </Panel>
  );
};
