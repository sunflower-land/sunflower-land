/**
 * A wrapper that provides crops favicon harvestable items management
 */

import React from "react";
import { useState } from "react";
import Tinycon from "tinycon";


interface CropsIconContext {
  incrementHarvestable: (value: number) => void;
}

export const CropsIconContext = React.createContext<CropsIconContext>({} as CropsIconContext);

export const CropsIconProvider: React.FC = ({ children }) => {
  const [harvestable, setHarvestable] = useState<number>(0);

  const incrementHarvestable = (value: number) => {
    if (value != -1 && value !== 1) {
      throw new Error("This counter should increment or decrement by 1 only");
    }
    const incrementedHarvestable = harvestable + value;
    setHarvestable(incrementedHarvestable);
    debugger
    Tinycon.setBubble(incrementedHarvestable || null);
  }

  return (
    <CropsIconContext.Provider value={{ incrementHarvestable }}>
      {children}
    </CropsIconContext.Provider>
  );
};
