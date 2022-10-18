import React from "react";

import seeds from "assets/icons/plant.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ExoticSeeds } from "./ExoticSeeds";

interface Props {
  onClose: () => void;
}

export const ExoticShopItems: React.FC<Props> = ({ onClose }) => {
  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive>
            <img src={seeds} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Exotic</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      <ExoticSeeds onClose={onClose} />
    </Panel>
  );
};
