import React from "react";
import tradeIcon from "assets/icons/trade.png";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

export const PriceHistory: React.FC = () => {
  return (
    <InnerPanel className="mb-1">
      <div className="p-2">
        <Label icon={tradeIcon} type="default">
          Price History
        </Label>
        <div className="h-32" />
      </div>
    </InnerPanel>
  );
};
