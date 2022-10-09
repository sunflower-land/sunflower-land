import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import disc from "assets/icons/disc.png";
import hammer from "assets/icons/hammer.png";
import close from "assets/icons/close.png";
import crown from "assets/tools/hammer.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { ModalContent } from "./components/ui/ModalContent";
import { Customise } from "./components/ui/Customise";

export const Buildings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [tab, setTab] = useState<"buildings" | "customise">("customise");

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[84px] right-2 z-50 flex flex-col items-end cursor-pointer hover:img-highlight"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          <img src={disc} className="w-full absolute inset-0" />
          <img src={hammer} className="w-9 mb-1 z-10" />
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel className="pt-5 relative">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab
                isActive={tab === "buildings"}
                onClick={() => setTab("buildings")}
              >
                <img src={crown} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Buildings</span>
              </Tab>
              <Tab
                isActive={tab === "customise"}
                onClick={() => setTab("customise")}
              >
                <img src={crown} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Customize</span>
              </Tab>
            </div>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div
            style={{
              minHeight: "200px",
            }}
          >
            {tab === "buildings" && (
              <ModalContent closeModal={() => setIsOpen(false)} />
            )}
            {tab === "customise" && (
              <Customise onClose={() => setIsOpen(false)} />
            )}
          </div>
        </Panel>
      </Modal>
    </>
  );
};
