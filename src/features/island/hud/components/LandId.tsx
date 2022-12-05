import { InnerPanel } from "components/ui/Panel";
import React from "react";

export const LandId: React.FC<{ landId: number }> = ({ landId }) => (
  <InnerPanel className="fixed bottom-2 left-2 z-50 py-1 px-2">
    <p className="text-white mb-1 text-sm">{`Land #${landId}`}</p>
  </InnerPanel>
);
