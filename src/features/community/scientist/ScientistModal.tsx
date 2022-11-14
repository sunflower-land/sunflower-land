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
import { PIXEL_SCALE } from "features/game/lib/constants";

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
      <Panel className="relative" hasTabs>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab
            isActive={tab === "inventory"}
            onClick={() => setTab("inventory")}
          >
            <img src={tadpole_icon} className="h-5 mr-3 ml-2" />
            <span className="text-xsm">Inventory</span>
          </Tab>
          <Tab
            isActive={tab === "incubator"}
            onClick={() => setTab("incubator")}
          >
            <img src={incubator} className="h-5 mr-2" />
            <span className="text-xsm">Incubator</span>
          </Tab>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
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
