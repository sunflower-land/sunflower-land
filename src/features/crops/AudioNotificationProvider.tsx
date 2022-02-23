import React, { useState, useEffect, useContext } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

interface AudioNotifContext {
  cropReady: () => void;
  // cropHarvested: () => void;
}

export const AudioNotifContext = React.createContext<AudioNotifContext>(
  {} as AudioNotifContext
);

export const AudioNotifProvider: React.FC = ({ children }) => {
  const [counter, setCounter] = useState<number>(0);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement>();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const cropReady = () => {
    setCounter(prevCount => prevCount + 1);
  }

  const cropHarvested = () => {
    setCounter(counter => counter - 1);
  }

  // refactor to use enums
  const fireAudio = () => {
    if (state.inventory["Pumpkin Soup"]) {
      return 14;
    }
    if (state.inventory["Sauerkraut"]) {
      return 18;
    }
    if (state.inventory["Roasted Cauliflower"]) {
      return 22;
    }
    return 11;
  }

  useEffect(() => {
      console.log(counter)
    if (counter % fireAudio() === 0) {
      //play sound
      if (audioObj) {
        audioObj.volume = 0;
        audioObj.play().then(function (result) {
        }).catch(function (e) {
          console.log(
            "Cannot initiate audio playback for notification sound."
          )
        });
        audioObj.volume = 1;
      }
    }
  }, [counter]);

  useEffect(() => {
    if (!audioObj) {
      const a = new Audio("/alert.mp3");
      setAudioObj(a);
    }
  }, [audioObj]);

  return (
    <AudioNotifContext.Provider value={{ cropReady }}>
      {children}
    </AudioNotifContext.Provider>
  );
};

