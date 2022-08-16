import React from "react";
import { CONFIG } from "lib/config";
import { WarIntro } from "./components/WarIntro";

import { WarCollection } from "./components/WarCollection";

export const GoblinWar: React.FC = () => {
  if (CONFIG.NETWORK !== "mumbai") {
    return null;
  }

  // TODO
  const hasPickedSide = true;

  if (!hasPickedSide) {
    return <WarIntro />;
  }

  return (
    <>
      <WarCollection />
    </>
  );
};
