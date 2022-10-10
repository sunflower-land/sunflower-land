import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Context } from "features/game/VisitingProvider";

import { frogAudio } from "lib/utils/sfx";
import { Frog, loadFrogs } from "features/community/merchant/actions/loadFrogs";

export const FrogNft: React.FC = () => {
  const [frogData, setFrogData] = useState<Frog[]>([]);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const open = () => {
    //Checks if frogAudio is playing, if false, plays the sound
    if (!frogAudio.playing()) {
      frogAudio.play();
    }
  };

  useEffect(() => {
    const fetchFrogs = async () => {
      const data = await loadFrogs(gameState.context.owner);
      setFrogData(data as Frog[]);
    };

    if (gameState.context.owner) {
      fetchFrogs();
    }
  }, [gameState.context.owner]);

  return (
    <>
      <div
        style={{
          width: `${GRID_WIDTH_PX * 12}px`,
          left: `${GRID_WIDTH_PX * 14}px`,
          top: `${GRID_WIDTH_PX * 2.2}px`,
        }}
        className="flex absolute justify-center"
      >
        {frogData &&
          frogData.map((frog, index) => (
            <div id={`frog-${index}`} key={index}>
              <img
                src={frog.pixel_image}
                className="hover:img-highlight cursor-pointer z-10"
                onClick={open}
                style={{
                  width: `${GRID_WIDTH_PX * 2}px`,
                }}
              />
            </div>
          ))}
      </div>
    </>
  );
};
