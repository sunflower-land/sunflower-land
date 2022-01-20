/**
 * A wrapper that provides crops favicon harvestable items management
 */

import React from "react";
import { useState } from "react";
import Tinycon from "tinycon";


interface AppIconContext {
  incrementHarvestable: (value: number) => void;
}

export const AppIconContext = React.createContext<AppIconContext>({} as AppIconContext);

export const AppIconProvider: React.FC = ({ children }) => {
  const [harvestable, setHarvestable] = useState<number>(0);

  const incrementHarvestable = (value: number) => {
    if (value != -1 && value !== 1) {
      throw new Error("This counter should increment or decrement by 1 only");
    }
    const incrementedHarvestable = harvestable + value;
    setHarvestable(incrementedHarvestable);
    Tinycon.setBubble(incrementedHarvestable || null);
  }

  return (
    <AppIconContext.Provider value={{ incrementHarvestable }}>
      {children}
    </AppIconContext.Provider>
  );
};
