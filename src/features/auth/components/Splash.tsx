import React from "react";

import logo from "assets/brand/logo.png";
import clouds from "assets/brand/clouds.png";
import sunflowers from "assets/brand/sunflower_border.png";

export const Splash: React.FC = () => {
  return (
    <div className="bg-blue-600 w-full h-full flex items-center justify-center">
      <img src={logo} className="mb-96 animate-float z-10" />
      <div
        className="bg-repeat w-full h-full absolute inset-0"
        style={{ backgroundImage: `url(${clouds})` }}
      />
      <img src={sunflowers} className="absolute w-full bottom-0" />
    </div>
  );
};
