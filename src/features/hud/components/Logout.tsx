import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import close from "assets/icons/close.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Logout: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);

  // {Todo: Modify gameState and authMachine for Logout event}

  const handleLogoutConf = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onClose();
    authService.send("ACCOUNT_CHANGED"); // hack used to avoid redundancy
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel className="p-0">
        <div className="p-2">
          <img
            src={close}
            className="h-6 top-3 right-4 absolute cursor-pointer"
            alt="Close Logout Confirmation Modal"
            onClick={onClose}
          />
          <div className="p-3 text-center">
            <span className="text-sm">
              Are you sure that you want to &quot;logout&quot;?
            </span>
            <form
              onSubmit={handleLogoutConf}
              className="row justify-between mt-3"
            >
              <Button className="col w-1/3 p-1" type="submit">
                Yes
              </Button>
              <Button
                className="col w-1/3 p-1"
                onClick={(evt) => {
                  evt.preventDefault();
                  onClose();
                }}
              >
                No
              </Button>
            </form>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
