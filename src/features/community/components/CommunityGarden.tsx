import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Context } from "../lib/CommunityProvider";
import { Panel } from "components/ui/Panel";
import { Merchant } from "../merchant/Merchant";
import { Seal } from "../aquatics/Seal";
import { BottleDonation } from "../donation/BottleDonation";
import { Scientist } from "../scientist/Scientist";

export const CommunityGarden: React.FC = () => {
  const { communityService } = useContext(Context);
  const [state] = useActor(communityService);
  return (
    <>
      <Modal show={state.matches("loading")} centered>
        <Panel className="text-shadow">
          <span className="loading">Loading</span>
        </Panel>
      </Modal>
      <Modal show={state.matches("error")} centered>
        <Panel className="text-shadow">
          <span className="loading">Loading</span>
        </Panel>
      </Modal>

      <Merchant />
      <Seal />
      <BottleDonation />
      <Scientist />
    </>
  );
};
