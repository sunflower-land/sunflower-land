import React from "react";

import { OuterPanel } from "components/ui/Panel";

export const VisitBanner = ({ id }: { id?: number }) => {
  if (!id) return null;

  return (
    <div className="fixed bottom-2 left-2 z-50 shadow-lg">
      <OuterPanel>
        <div className="flex justify-center p-1">
          <span className="text-sm">{`Land #${id}`}</span>
        </div>
      </OuterPanel>
    </div>
  );
};
