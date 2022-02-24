/**
 * A wrapper that provides crops favicon harvestable items management
 */

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import React, { useState, useEffect, useContext } from "react";
import Tinycon from "tinycon";

interface AppIconContext {
  updateHarvestable: (op: "plus" | "minus") => void;
}

export const AppIconContext = React.createContext<AppIconContext>(
  {} as AppIconContext
);

enum FarmLevel {
  One = 11,
  Two = 14,
  Three = 18,
  Four = 22,
}

export const AppIconProvider: React.FC = ({ children }) => {
  const [counter, setCounter] = useState<number>(0);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement>();
  const { gameService } = useContext(Context);
  const [{ context: { state }}] = useActor(gameService);

  const updateHarvestable = (op: "plus" | "minus"): void => {
    setCounter((prevCounter) => prevCounter + (op === "plus" ? 1 : -1));
  };

  const currentLevel = () => {
    if (state.inventory["Roasted Cauliflower"]) {
      return FarmLevel.Four;
    }
    if (state.inventory["Sauerkraut"]) {
      return FarmLevel.Three;
    }
    if (state.inventory["Pumpkin Soup"]) {
      return FarmLevel.Two;
    }
    return FarmLevel.One;
  }

  // apply force update (reverts to title update and not bubble)
  useEffect(() => {
    Tinycon.setOptions({ fallback: "force" });
  }, []);

  // need to be in useEffect
  useEffect(() => {
    Tinycon.setBubble(counter);

    if (state.farmAddress && counter === currentLevel()) {
      //play sound
      const playSound = async () => {
        if (audioObj) {
          audioObj.volume = 0;
          await audioObj.play().catch(() => {
            console.log("Cannot initiate audio playback for notification sound.")
          });
          audioObj.volume = 1;
        }
      }

      playSound()
    }
  }, [counter]);

  useEffect(() => {
    if (!audioObj) {
      const a = new Audio("/alert.mp3");
      setAudioObj(a);
    }
  }, [audioObj]);

  return (
    <AppIconContext.Provider value={{ updateHarvestable }}>
      {children}
    </AppIconContext.Provider>
  );
};
