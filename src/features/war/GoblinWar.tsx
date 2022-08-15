import { CONFIG } from "lib/config";
import React from "react";

import { WarCollection } from "./components/WarCollection";

export const GoblinWar: React.FC = () => {
  if (CONFIG.NETWORK !== "mumbai") {
    return null;
  }

  return (
    <>
      <WarCollection />
    </>
  );
};
