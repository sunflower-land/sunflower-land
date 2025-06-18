import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React from "react";

export const ActivityFeed: React.FC = () => {
  return (
    <InnerPanel className="flex flex-col w-2/5">
      <div>
        <Label type="default">{`Activity`}</Label>
        <div></div>
      </div>
    </InnerPanel>
  );
};
