/**
 * A wrapper that provides crops favicon harvestable items management
 */

import React, { useContext } from "react";
import Tinycon from "tinycon";
import { useActor } from "@xstate/react";
import { CROPS } from "features/game/types/crops";
import { Context } from "features/game/GameProvider";
import { FieldItem } from "features/game/types/game";
import { getTimeLeft } from "lib/utils/time";

interface AppIconContext {
  updateHarvestable: () => void;
}

export const AppIconContext = React.createContext<AppIconContext>(
  {} as AppIconContext
);

/**
 * Checks if Field is harvestable
 *
 * @param field
 */
const isHarvestable = (field: FieldItem): boolean => {
  if (!field) {
    return false;
  }
  const crop = CROPS[field.name];
  const timeLeft = getTimeLeft(field.plantedAt, crop.harvestSeconds);
  return timeLeft <= 0;
};
/**
 * Apply debounce to function
 *
 * @param func
 * @param timeout
 */
const debounce = (func: Function, timeout: number = 500) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const AppIconProvider: React.FC = ({ children }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const updateHarvestable = debounce((): void => {
    const total = Object.values(state.fields).filter(isHarvestable).length;
    Tinycon.setBubble(total || null);
  });

  return (
    <AppIconContext.Provider value={{ updateHarvestable }}>
      {children}
    </AppIconContext.Provider>
  );
};
