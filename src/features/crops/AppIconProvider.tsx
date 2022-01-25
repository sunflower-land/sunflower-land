/**
 * A wrapper that provides crops favicon harvestable items management
 */

import React, {useContext} from "react";
import Tinycon from "tinycon";
import {CROPS} from "features/game/types/crops";
import {getTimeLeft} from "lib/utils/time";
import {Context} from "features/game/GameProvider";
import {useActor} from "@xstate/react";
import {FieldItem} from "features/game/types/game";


interface AppIconContext {
  updateHarvestable: () => void,
}

export const AppIconContext = React.createContext<AppIconContext>({} as AppIconContext);

const isHarvestable = (field: FieldItem) : boolean => {
  if (!field.crop) {
    return false;
  }
  const crop = CROPS[field.crop.name];
  const timeLeft = getTimeLeft(field.crop.plantedAt, crop.harvestSeconds);
  return timeLeft <= 0;
}

export const AppIconProvider: React.FC = ({ children }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const updateHarvestable = () : void => {
    const total = state.fields.filter(isHarvestable).length;
    Tinycon.setBubble(total || null);
  }

  return (
    <AppIconContext.Provider value={{ updateHarvestable }}>
      {children}
    </AppIconContext.Provider>
  );
};
