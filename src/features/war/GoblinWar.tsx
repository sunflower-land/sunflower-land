import { CONFIG } from "lib/config";
import React from "react";

import { Recruiter } from "./components/Recruiter";

export const GoblinWar: React.FC = () => {
  if (CONFIG.NETWORK !== "mumbai") {
    return null;
  }

  return (
    <>
      <Recruiter />
    </>
  );
};
