import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { TabContent } from "./TabContent";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export type Tab = "upcoming-drops" | "collection";

export const ItemsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<Tab>("upcoming-drops");

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab
              isActive={tab === "upcoming-drops"}
              onClick={() => setTab("upcoming-drops")}
            >
              <span className="text-sm text-shadow ml-1">Upcoming</span>
            </Tab>
            <Tab
              isActive={tab === "collection"}
              onClick={() => setTab("collection")}
            >
              <span className="text-sm text-shadow">Collection</span>
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
          <TabContent tab={tab} />
        </div>
      </Panel>
    </Modal>
  );
};
