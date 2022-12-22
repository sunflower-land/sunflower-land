import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "../lib/CommunityProvider";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { NorthPoleDonation } from "features/community/donation/NorthPoleDonation";

export const NorthPole: React.FC = () => {
  const { communityService } = useContext(Context);
  const [state] = useActor(communityService);
  const { bumpkin } = state.context;

  return (
    <>
      <NorthPoleDonation />

      <IslandTravel bumpkin={bumpkin} x={2} y={-9} />
    </>
  );
};
