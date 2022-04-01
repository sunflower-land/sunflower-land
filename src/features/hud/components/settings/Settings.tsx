import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import token from "assets/icons/token.gif";
import close from "assets/icons/close.png";
import Volume from "./Volume";
import Session from "./Session";
import { Modal } from "react-bootstrap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<"volume" | "session" | "other">("volume");

  const handleSaveClick = () => {
    console.log("Settings Saved :)");
  };

  return (
    <>
      <Modal show={isOpen} onHide={onClose} centered>
        <Panel className="pt-5 relative max-w-5xl">
          <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
            <div className="flex">
              <Tab isActive={tab === "volume"} onClick={() => setTab("volume")}>
                <img src={token} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Volume</span>
              </Tab>
              <Tab
                isActive={tab === "session"}
                onClick={() => setTab("session")}
              >
                <img src={token} className="h-5 mr-2" />
                <span className="text-sm text-shadow">Session</span>
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
            {tab === "volume" && <Volume />}
            {tab === "session" && <Session />}
            {tab === "other" && (
              <div>
                Other Settings / Controls / Preferences are being developed by
                the team &amp;3 SFL
              </div>
            )}
          </div>
          <div className="justify-content-center">
            <Button className="text-s w-1/4 px-1" onClick={handleSaveClick}>
              Save
            </Button>
          </div>
        </Panel>
      </Modal>
      {/* OG Modal */}
      {/*
      <Modal show={isOpen} onHide={onClose} centered>
        <Panel>
          <Modal.Header className="justify-content-space-between">
            <h1 className="ml-2">Settings and Preferences</h1>
            <img
              src={close}
              className="h-6 cursor-pointer mr-2 mb-1 justify-content-end"
              onClick={onClose}
            />
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center align-items-center">
              <div className="flex d-none d-sm-block col-sm col justify-content-center align-items-center">
                <p className="text-sm whitespace-normal">
                  Settings for the game are not fully developed yet they are
                  still in beta.
                </p>
              </div>
              <div className="flex col-sm-12 col justify-content-center md-px-4 lg-px-4 align-items-center">
                <img
                  src={farmImg}
                  className="w-64 md-mt-2"
                  alt="Sunflower-Land Farm NFT Image"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className="text-s w-1/4 px-1" onClick={handleSaveClick}>
              Save
            </Button>
          </Modal.Footer>
        </Panel>
      </Modal>
    */}
    </>
  );
};
