import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";
import { loadFrogs } from "features/community/merchant/actions/loadFrogs";
import { Frog } from "features/community/project-dignity/models/frog";
import { FrogContainer } from "features/community/project-dignity/components/FrogContainer";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const ProjectDignityFrogs: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [frogData, setFrogData] = useState<Frog[]>([]);

  useEffect(() => {
    const fetchFrogs = async () => {
      const data = await loadFrogs({ loadIncubatedFrogs: true });
      setFrogData(data);
    };

    fetchFrogs();
  }, []);

  return (
    <FrogContainer
      frogs={frogData}
      farmId={authState.context.farmId}
      position={{
        left: `${GRID_WIDTH_PX * 22}px`,
        top: `${GRID_WIDTH_PX * 23}px`,
      }}
    />
  );
};
