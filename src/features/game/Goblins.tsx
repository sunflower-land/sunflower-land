import { GoblinVillage } from "features/goblins/GoblinVillage";
import React, { useRef, useEffect } from "react";

import { GoblinProvider } from "./GoblinProvider";

export const Goblins: React.FC = () => {
  // Load data
  return (
    <GoblinProvider>
      <GoblinVillage />
    </GoblinProvider>
  );
};
