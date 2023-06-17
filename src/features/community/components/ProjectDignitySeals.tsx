import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";
import { loadSeals } from "features/community/merchant/actions/loadSeals";
import { Seal } from "features/community/project-dignity/models/seal";
import { SealContainer } from "features/community/project-dignity/components/SealContainer";

interface Props {
  isGarden: boolean;
  offset?: number;
}

export const ProjectDignitySeals: React.FC<Props> = ({ isGarden, offset }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [sealData, setSealData] = useState<Seal[]>([]);

  useEffect(() => {
    const fetchSeals = async () => {
      const data = await loadSeals();
      setSealData(data);
    };

    fetchSeals();
  }, []);

  return <SealContainer seals={sealData} isGarden={isGarden} offset={offset} />;
};
