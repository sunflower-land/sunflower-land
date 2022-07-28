import React, { useState } from "react";

import close from "assets/icons/close.png";
import player from "assets/icons/player.png";
import hammer from "assets/icons/hammer.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { BumpkinBuilder } from "./BumpkinBuilder";

interface Props {
  onClose: () => void;
}

export const BumpkinModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"build" | "bumpkin">("build");

  return (
    <Panel className="pt-5 relative max-w-5xl">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "build"} onClick={() => setTab("build")}>
            <img src={hammer} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Build</span>
          </Tab>
          <Tab isActive={tab === "bumpkin"} onClick={() => setTab("bumpkin")}>
            <img src={player} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Bumpkin</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      {tab === "build" && <span>Coming Soon...</span>}
      {tab === "bumpkin" && <BumpkinBuilder />}
    </Panel>
  );
};
