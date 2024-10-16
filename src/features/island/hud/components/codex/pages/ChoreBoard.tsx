import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import React from "react";

export const ChoreBoard: React.FC = () => {
  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-y-auto scrollable pr-1",
      )}
    >
      <InnerPanel className="space-y-2 mt-1 mb-1"></InnerPanel>
    </div>
  );
};
