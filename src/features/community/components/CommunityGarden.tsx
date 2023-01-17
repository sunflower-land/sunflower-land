import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Context } from "../lib/CommunityProvider";
import { Panel } from "components/ui/Panel";
import { Merchant } from "../merchant/Merchant";
import { BottleDonation } from "../donation/BottleDonation";
import { Scientist } from "../scientist/Scientist";
import { ProjectDignityFrogs } from "./ProjectDignityFrogs";
import { ProjectDignitySeals } from "./ProjectDignitySeals";
import { Arcade } from "../arcade/Arcade";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";

export const CommunityGarden: React.FC = () => {
  const { communityService } = useContext(Context);
  const [state] = useActor(communityService);
  const { bumpkin } = state.context;

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
      <BottleDonation />
      <Scientist />
      <ProjectDignityFrogs left={22} top={23} />
      <ProjectDignitySeals isGarden={true} />
      <Arcade left={31} top={27} />

      <IslandTravel bumpkin={bumpkin} x={-4} y={-9} />
    </>
  );
};
