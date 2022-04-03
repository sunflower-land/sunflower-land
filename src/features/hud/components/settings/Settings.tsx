import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Modal } from "react-bootstrap";

import token from "assets/icons/token.gif";
import close from "assets/icons/close.png";

import Volume from "./Volume";
import ResetSession from "./ResetSession";

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
    <Modal
      show={isOpen}
      onHide={() => {
        onClose();
        setTab("volume");
      }}
      centered
    >
      <Panel className="pt-5 relative max-w-5xl">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab isActive={tab === "volume"} onClick={() => setTab("volume")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs text-shadow sm:text-sm">Volume</span>
            </Tab>
            <Tab isActive={tab === "session"} onClick={() => setTab("session")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs text-shadow sm:text-sm">Session</span>
            </Tab>
            <Tab isActive={tab === "other"} onClick={() => setTab("other")}>
              <img src={token} className="h-5 mr-2" />
              <span className="text-xs text-shadow sm:text-sm">Other</span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={() => {
              onClose();
              setTab("volume");
            }}
          />
        </div>

        <div
          style={{
            minHeight: "200px",
          }}
        >
          {tab === "volume" && <Volume />}
          {tab === "session" && <ResetSession />}
          {tab === "other" && (
            <div>
              <p>
                Other Settings/ Controls/ Preferences are being developed by the
                SFL team and community developers.
              </p>
              <p>Please request/ suggest other settings TBA, on discord :)</p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button className="text-s w-1/4 px-1" onClick={handleSaveClick}>
            Save
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
