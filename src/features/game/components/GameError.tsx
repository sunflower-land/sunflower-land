import React, { useEffect } from "react";
import deathAnimation from "assets/npcs/human_death.gif";
import { ErrorCode } from "lib/errors";

interface Props {
  errorCode: ErrorCode;
}
export const GameError: React.FC<Props> = ({ errorCode }) => {
  console.log({ errorCode });
  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.style.pointerEvents = "none";
    }
  }, []);

  if (errorCode === "NETWORK_CONGESTED") {
    return (
      <div id="gameerror" className="flex flex-col items-center p-2">
        <span className="text-shadow text-center">Polygon is congested!</span>
        <img src={deathAnimation} className="w-1/2 -mt-4 ml-8" />
        <span className="text-shadow text-xs text-center">
          We are trying our best but looks like Polygon is getting a lot of
          traffic.
        </span>
        <span className="text-shadow text-xs text-center">
          If this error continues please try changing your Metamask RPC
        </span>
      </div>
    );
  }

  return (
    <div id="gameerror" className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Something went wrong!</span>
      <img src={deathAnimation} className="w-1/2 -mt-4 ml-8" />
      <span className="text-shadow text-xs text-center">
        Looks like we were unable to connect with our servers. Please refresh
        and try again.
      </span>
    </div>
  );
};
