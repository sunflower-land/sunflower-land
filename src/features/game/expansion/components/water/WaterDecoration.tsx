import React from "react";
import water1 from "assets/decorations/water-decorations/water1.png";
import water2 from "assets/decorations/water-decorations/water2.png";
import water3 from "assets/decorations/water-decorations/water3.png";
import water4 from "assets/decorations/water-decorations/water4.png";
import { randomBetweenMaxInclusive } from "../../lib/randomBetweenMaxInclusive";

interface Props {
  show?: [string];
}

const getWaterElements = () => {
  const waterModels = [water1, water2, water3, water4];
  const waterTemplate = (source: string) => (
    <img
      src={source}
      alt=""
      className={"w-11 absolute transform translate-x-0"}
      style={{
        top: `${randomBetweenMaxInclusive(60, 0)}%`,
        left: `${randomBetweenMaxInclusive(75, 0)}%`,
        animation: `waterMovement ${randomBetweenMaxInclusive(1, 0.5)}s 
        ${randomBetweenMaxInclusive(2, 0.8)}s infinite alternate ease-in-out`,
      }}
    />
  );

  const elementsList = [];

  for (let i = 0; i < randomBetweenMaxInclusive(20, 10); i++) {
    elementsList.push(
      waterTemplate(waterModels[randomBetweenMaxInclusive(3, 0)])
    );
  }
  return elementsList;
};

export const WaterDecoration: React.FC<Props> = ({ show }) => {
  const elementsToShow = {
    left: show?.includes("all") || show?.includes("left"),
    right: show?.includes("all") || show?.includes("right"),
    top: show?.includes("all") || show?.includes("top"),
    bottom: show?.includes("all") || show?.includes("bottom"),
  };

  return (
    <>
      {/*TOP*/}
      {elementsToShow.top && (
        <div
          className={"absolute"}
          style={{
            width: "100%",
            height: "10%",
            top: "0",
            left: "0",
            zIndex: "-1",
          }}
        >
          {getWaterElements().map((item) => item)}
        </div>
      )}

      {/*LEFT*/}
      {elementsToShow.left && (
        <div
          className={"absolute"}
          style={{
            width: "10%",
            height: "80%",
            top: "10%",
            left: "0",
            zIndex: "-1",
          }}
        >
          {getWaterElements().map((item) => item)}
        </div>
      )}

      {/*RIGHT*/}
      {elementsToShow.right && (
        <div
          className={"absolute"}
          style={{
            width: "10%",
            height: "80%",
            top: "10%",
            right: "0",
            zIndex: "-1",
          }}
        >
          {getWaterElements().map((item) => item)}
        </div>
      )}

      {/* BOTTOM */}
      {elementsToShow.bottom && (
        <div
          className={"absolute"}
          style={{
            width: "100%",
            height: "10%",
            bottom: "0",
            left: "0",
            zIndex: "-1",
          }}
        >
          {getWaterElements().map((item) => item)}
        </div>
      )}
    </>
  );
};
