/**
 * A wrapper that provides crops favicon harvestable items management
 */

import React, { useState, useEffect } from "react";
import Tinycon from "tinycon";

interface AppIconContext {
  updateHarvestable: (op: "plus" | "minus") => void;
}

export const AppIconContext = React.createContext<AppIconContext>(
  {} as AppIconContext
);

export const AppIconProvider: React.FC = ({ children }) => {
  const [counter, setCounter] = useState<number>(0);

  const updateHarvestable = (op: "plus" | "minus"): void => {
    setCounter((prevCounter) => prevCounter + (op === "plus" ? 1 : -1));
  };

  // apply force update (reverts to title update and not bubble)
  useEffect(() => {
    Tinycon.setOptions({ fallback: "force" });
  }, []);

  // need to be in useEffect
  useEffect(() => {
    Tinycon.setBubble(counter);
  }, [counter]);

  return (
    <AppIconContext.Provider value={{ updateHarvestable }}>
      {children}
    </AppIconContext.Provider>
  );
};
