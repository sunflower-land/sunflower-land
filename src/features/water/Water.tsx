import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { Section } from "lib/utils/useScrollIntoView";

import chick from "assets/animals/chick.gif";

interface Props {}

export const Water: React.FC<Props> = () => {
  const { state } = useContext(Context);

  return (
    // Container
    <div
      style={{
        height: "650px",
        width: "1650px",
        left: "calc(50% - 1100px)",
        top: "calc(50% - 320px)",
      }}
      className="absolute"
    >
      <div className="h-full w-full relative">
        {/* Navigation Center Point */}
        <span
          id={Section.Water}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />

        <img src={chick} className="absolute right-0 w-5 top-8" />
      </div>
    </div>
  );
};
