import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/VisitingProvider";
import { loadFrogs } from "features/community/merchant/actions/loadFrogs";
import { Frog } from "features/community/project-dignity/models/frog";
import { FrogContainer } from "features/community/project-dignity/components/FrogContainer";

export const ProjectDignityFrogs: React.FC = () => {
  const [frogData, setFrogData] = useState<Frog[]>([]);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  useEffect(() => {
    const fetchFrogs = async () => {
      const data = await loadFrogs({
        owner: gameState.context.owner,
        loadIncubatedFrogs: true,
      });
      setFrogData(data as Frog[]);
    };

    if (gameState.context.owner) {
      fetchFrogs();
    }
  }, [gameState.context.owner]);

  return <FrogContainer frogs={frogData} farmId={gameState.context.farmId} />;
};
