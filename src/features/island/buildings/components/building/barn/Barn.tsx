import React, { useEffect } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { barnAudio, loadAudio } from "lib/utils/sfx";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { useNavigate } from "react-router-dom";

export const Barn: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  island,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    loadAudio([barnAudio]);
  }, []);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio.play();
      navigate("/barn");
    }
  };

  return (
    <>
      <BuildingImageWrapper name="Hen House" onClick={handleClick}>
        <img
          src={HEN_HOUSE_VARIANTS[island]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 61}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
    </>
  );
};
