import React from "react";
import clouds from "assets/land/clouds.png";

export const Clouds: React.FC = () => {
  return (
    <img
      className="absolute w-full z-10 left-0 bottom-0"
      src={clouds}
      alt="cloud cover"
    />
  );
};
