import React from "react";

import scaffoldingLeft from "assets/mom/scaffolding_left.png";
import scaffoldingRight from "assets/mom/scaffolding_right.png";
import support from "assets/mom/launch-pad-material-2.png";
import platform from "assets/mom/launch-pad-material-3.png";
import woodPile from "assets/mom/launch-pad-material-4.png";
import goblinHammering from "assets/mom/goblin_mechanic_1.gif";
import goblinWelding from "assets/mom/goblin_mechanic_2.gif";
import goblinForeman from "assets/mom/goblin_mechanic_3.gif";
import metalSheetsPileFew from "assets/mom/metal-sheets-pile-few.png";
import metalSheetsPileMany from "assets/mom/metal-sheets-pile-many.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Launchpad: React.FC = () => {
  return (
    <>
      <img
        src={scaffoldingLeft}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 2.62}px`,
          top: `${GRID_WIDTH_PX * 0.83}px`,
          left: `${GRID_WIDTH_PX * -0.48}px`,
          zIndex: 1,
        }}
      />
      <img
        src={scaffoldingRight}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 2.5}px`,
          top: `${GRID_WIDTH_PX * 0.78}px`,
          right: `${GRID_WIDTH_PX * -1.26}px`,
          zIndex: 1,
        }}
      />
      <img
        src={support}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 5}px`,
          top: `${GRID_WIDTH_PX * 1.38}px`,
          left: `${GRID_WIDTH_PX * 0.31}px`,
        }}
      />
      <img
        src={platform}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 2.14}px`,
          top: `${GRID_WIDTH_PX * 1.69}px`,
          right: `${GRID_WIDTH_PX * -4.5}px`,
        }}
      />
      <img
        src={woodPile}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 1.1}px`,
          top: `${GRID_WIDTH_PX * 4.25}px`,
          right: `${GRID_WIDTH_PX * -3}px`,
        }}
      />
      <img
        src={goblinForeman}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 0.95}px`,
          left: `${GRID_WIDTH_PX * 5}px`,
          bottom: `${GRID_WIDTH_PX * -0.01}px`,
        }}
      />
      <img
        src={goblinWelding}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 1.55}px`,
          right: `${GRID_WIDTH_PX * 3.6}px`,
          bottom: `${GRID_WIDTH_PX * -1}px`,
        }}
      />
      <img
        src={goblinHammering}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 1.55}px`,
          left: `${GRID_WIDTH_PX * 3.7}px`,
          bottom: `${GRID_WIDTH_PX * -2.25}px`,
        }}
      />
      <img
        src={metalSheetsPileMany}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 1}px`,
          right: `${GRID_WIDTH_PX * 2.7}px`,
          bottom: `${GRID_WIDTH_PX * -3}px`,
        }}
      />
      <img
        src={metalSheetsPileFew}
        style={{
          position: "absolute",
          width: `${GRID_WIDTH_PX * 1}px`,
          right: `${GRID_WIDTH_PX * 2.1}px`,
          bottom: `${GRID_WIDTH_PX * -3.5}px`,
        }}
      />
    </>
  );
};
