import React from "react";

import goblinHead from "assets/npcs/goblin_head.png";
import wood from "assets/resources/wood.png";
import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { StorageItems } from "./StorageItems";

interface Props {
  onClose: () => void;
}
export const StorageModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Panel className="pt-5 relative max-w-5xl">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive>
            <img src={wood} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Storage House</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>
      <div>
        <span className="text-sm">
          Box and deliver goods from your farm to your personal wallet
        </span>
        <StorageItems onWithdraw={() => {}} />
      </div>
    </Panel>
  );
};
