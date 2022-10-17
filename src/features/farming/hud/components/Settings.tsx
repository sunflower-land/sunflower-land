import React, { useContext, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import questionMark from "assets/icons/expression_confused.png";
import { Context } from "features/game/GameProvider";
import { TransferAccount } from "./TransferAccount";
import close from "assets/icons/close.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);

  const { gameService } = useContext(Context);

  const [view, setView] = useState<"settings" | "transfer">("settings");

  const onLogout = () => {
    onClose();
    authService.send("LOGOUT"); // hack used to avoid redundancy
  };

  const refreshSession = () => {
    onClose();
    gameService.send("RESET");
  };

  const Content = () => {
    if (view === "transfer") {
      return (
        <TransferAccount
          isOpen={true}
          onClose={() => {
            onClose();
            setView("settings");
          }}
        />
      );
    }

    return (
      <div className="flex flex-col">
        <div className="p-2">
          <p>Settings</p>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer z-10"
            onClick={onClose}
          />
        </div>
        <Button className="col p-1" onClick={onLogout}>
          Logout
        </Button>
        <Button className="col p-1 mt-2" onClick={() => setView("transfer")}>
          Transfer Ownership
        </Button>
        <Button className="col p-1 mt-2" onClick={refreshSession}>
          Refresh
        </Button>

        <div className="flex items-start">
          <img src={questionMark} className="w-12 pt-2 pr-2" />
          <span className="text-xs mt-2">
            Refresh your session to grab the latest changes from the Blockchain.
            This is useful if you deposited items to your farm.
          </span>
        </div>
      </div>
    );
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel className="p-0">{Content()}</Panel>
    </Modal>
  );
};
