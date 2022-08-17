import React, { useEffect, useState } from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { frogAudio } from "lib/utils/sfx";
import { loadFrogs } from "features/game/actions/loadFrogs";

export const FrogNft: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [frogData, setFrogData] = useState([{ pixel_image: "" }]);

  const open = () => {
    setShowModal(true);
    //Checks if frogAudio is playing, if false, plays the sound
    if (!frogAudio.playing()) {
      frogAudio.play();
    }
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
