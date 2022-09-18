import React, { useContext } from "react";

import { Balance } from "components/Balance";
import { BackButton } from "./BackButton";
import { Context } from "../lib/CommunityProvider";
import { useActor } from "@xstate/react";

export const CommunityHud: React.FC = () => {
  const { communityService } = useContext(Context);
  const [state] = useActor(communityService);

  return (
    <div aria-label="Hud">
      <Balance balance={state.context.balance} />
      <BackButton />
    </div>
  );
};
