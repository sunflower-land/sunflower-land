import React from "react";

import logo from "assets/brand/logo.png";
import clouds from "assets/brand/clouds.png";
import sunflowers from "assets/brand/sunflower_border.png";
import goblin from "assets/npcs/goblin.gif";
import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import pumpkin from "assets/crops/pumpkin/crop.png";
import curly from "assets/npcs/curly_hair.png";

export const Splash: React.FC = () => {
  return (
    <div className="bg-blue-600 w-full h-full flex relative items-center justify-center">
      <div className="relative mb-96 animate-float z-10">
        <img
          src={pumpkin}
          className="absolute w-8 -rotate-12 z-10 -top-7 sm:w-12"
        />

        <img src={logo} />
      </div>
      <div
        className="bg-repeat w-full h-full absolute inset-0"
        style={{ backgroundImage: `url(${clouds})` }}
      >
        <div className="relative w-full h-full">
          <img
            id="curly"
            src={curly}
            className="absolute w-54 bottom-16 left-8 sm:-top-16 sm:left-12"
          />
        </div>
      </div>
      <img src={sunflowers} className="absolute w-full bottom-0" />
    </div>
  );
};
