import React, { useState } from "react";

import brownDisc from "assets/icons/empty_disc.png";
import stamina from "assets/icons/stamina.png";
import close from "assets/icons/close.png";
import head from "assets/bumpkins/example.png";

import { Bar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Wardrobe } from "./bumpkin/Wardrobe";

export const BumpkinHUD: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [tab, setTab] = useState<"wardrobe" | "skill">("wardrobe");

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Panel className="pt-5 relative">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab
                isActive={tab === "wardrobe"}
                onClick={() => setTab("wardrobe")}
              >
                <img src={stamina} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Wardrobe</span>
              </Tab>
              <Tab isActive={tab === "skill"} onClick={() => setTab("skill")}>
                <img src={stamina} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Skills</span>
              </Tab>
            </div>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1"
              onClick={() => setShowModal(false)}
            />
          </div>

          <div
            style={{
              minHeight: "200px",
            }}
          >
            {tab === "wardrobe" && <Wardrobe />}
          </div>
        </Panel>
      </Modal>

      <div className="fixed top-2 left-2 z-50 flex">
        <div
          className="w-16 h-16 relative cursor-pointer hover:img-highlight"
          onClick={() => setShowModal(true)}
        >
          <img
            src={brownDisc}
            className="absolute inset-0 w-full h-full z-10"
          />
          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: "#bfcbda",
              width: "90%",
              height: "90%",
              position: "relative",
              top: "5%",
              left: "5%",
              borderRadius: "40%",
            }}
          >
            <img
              src={head}
              style={{
                width: "200%",
                left: "13%",
                position: "relative",
                top: "10%",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex ml-1 mb-0.5 items-center">
            <Label>
              <span className="text-xs text-white px-1">Lvl 1</span>
            </Label>
          </div>
          <div className="flex  ml-1 items-center">
            <img src={stamina} className="w-4 mr-1" />
            <Bar percentage={60} />
          </div>
        </div>
      </div>
    </>
  );
};
