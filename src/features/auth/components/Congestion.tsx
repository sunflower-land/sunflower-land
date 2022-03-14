import React from "react";

import deathAnimation from "assets/npcs/human_death.gif";

export const Congestion: React.FC = () => {
  return (
    <div id="gameerror" className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">{`Can't connect to Polygon`}</span>
      <img src={deathAnimation} className="w-1/2 -mt-4 ml-8" />
      <span className="text-shadow text-xs text-center">
        We are trying our best but looks like Polygon is getting a lot of
        traffic or you have lost your connection.
      </span>
      <span className="text-shadow text-xs text-center">
        If this error continues please try changing your Metamask RPC
      </span>
    </div>
  );
};
