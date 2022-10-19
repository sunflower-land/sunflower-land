import React, { useEffect, useState } from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { frogSounds } from "lib/utils/sfx";
import { Frog, loadFrogs } from "features/community/merchant/actions/loadFrogs";

export const FrogNft: React.FC = () => {
  const [frogData, setFrogData] = useState<Frog[]>([]);

  const playSound = () => {
    const rndIndex = Math.floor(Math.random() * frogSounds.length);
    frogSounds[rndIndex].play();
  };

  useEffect(() => {
    const fetchFrogs = async () => {
      const data = await loadFrogs();
      setFrogData(data);
    };

    fetchFrogs();
  }, []);

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
                onClick={playSound}
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
