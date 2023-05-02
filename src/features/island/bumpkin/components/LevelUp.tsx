import { TwitterIcon, TwitterShareButton } from "react-share";

import React from "react";

interface Props {
  level: number;
}
export const LevelUp: React.FC<Props> = ({ level }) => {
  return (
    <div>
      Level up!
      <TwitterShareButton
        url={" "}
        title={`Just reached level ${level} in Sunflower Land! So proud of my progress in this game. 🌻🚀 \n\n https://www.sunflower-land.com \n\n #SunflowerLand #LevelUp`}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
    </div>
  );
};
