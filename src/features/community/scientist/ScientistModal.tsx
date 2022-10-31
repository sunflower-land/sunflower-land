import React, { useContext, useState } from "react";
import { useActor, useMachine } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/community/lib/CommunityProvider";
import { incubateMachine } from "./lib/incubateMachine";

// images
import tadpole_icon from "../assets/icons/tadpole.png";
import incubator from "../assets/incubator/algae-small.gif";
import close from "assets/icons/close.png";

import { InventoryItems } from "./components/InventoryItems";
import { Incubator } from "./components/Incubator";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientistModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { communityService } = useContext(Context);
  const [communityState] = useActor(communityService);
  const [machine, send] = useMachine(incubateMachine);
  const { state, errorCode } = machine.context;

  const handleClose = () => onClose();

  const [tab, setTab] = useState<"inventory" | "incubator">("inventory");

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="relative max-w-5xl">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab
              isActive={tab === "inventory"}
              onClick={() => setTab("inventory")}
            >
              <img src={tadpole_icon} className="h-5 mr-2" />
              <span className="text-xsm text-shadow">Inventory</span>
            </Tab>
            <Tab
              isActive={tab === "incubator"}
              onClick={() => setTab("incubator")}
            >
              <img src={incubator} className="h-5 mr-2" />
              <span className="text-xsm text-shadow">Incubator</span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={onClose}
          />
        </div>
        <div>
          {tab === "inventory" && <InventoryItems />}
          {tab === "incubator" && <Incubator />}
        </div>
      </Panel>
    </Modal>
  );
};
