import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

/**
 * Dev-build only: a small badge confirming the Phaser engine is live, with
 * the debug-grid toggle hint.
 */
export const DevPanel: React.FC = () => (
  <div className="absolute bottom-2 left-2 pointer-events-auto">
    <InnerPanel>
      <div className="p-1 text-xs">
        <Label type="info">{"Phaser farm (dev)"}</Label>
        <p className="mt-1">
          {`localStorage "phaserFarm.debug" toggles the grid`}
        </p>
      </div>
    </InnerPanel>
  </div>
);
