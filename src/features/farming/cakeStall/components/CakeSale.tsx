import React, { useState } from "react";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Cakes } from "features/farming/cakeStall/components/Cakes";

interface Props {
  onClose: () => void;
}

export const CakeSale: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"cook" | "sell">("cook");

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "cook"}>
            <span className="text-sm text-shadow">Cake Collection</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <div
        style={{
          minHeight: "200px",
        }}
      >
        <Cakes />
      </div>
    </Panel>
  );
};
