import React, { useState } from "react";

import flowerBed from "assets/ui/flower_bed.png";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { PIXEL_SCALE } from "../lib/constants";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "../types/images";

export const FlowerBed: React.FC = () => {
  const [seed, setSeed] = useState();
  const [crossbreed, setCrossBreed] = useState();

  return (
    <>
      <div className="p-2">
        {crossbreed && (
          <div className="flex items-center justify-center">
            <img src={ITEM_DETAILS["Warty Goblin Pumpkin"].image} />
            <span className="text-xs">Red Tulip</span>
          </div>
        )}
        {!crossbreed && <p className="text-xs text-center">?</p>}
        <div
          className="relative mx-auto w-full mt-2"
          style={{
            width: `${PIXEL_SCALE * 80}px`,
          }}
        >
          <img src={flowerBed} className="w-full" />

          <div
            className={classNames(
              "absolute z-40 cursor-pointer bg-green-800 border-t-4 border-green-900 rounded-md",
              {}
            )}
            style={{
              height: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 6}px`,
              left: `${PIXEL_SCALE * 12}px`,
            }}
          >
            {!seed && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full absolute inset-0 -top-1"
              />
            )}
            {seed && (
              <img
                src={ITEM_DETAILS["Sunflower Seed"].image}
                className="w-full absolute inset-0 -top-1"
              />
            )}
          </div>

          <div
            className={classNames(
              "absolute  z-40 cursor-pointer bg-green-800 border-t-4 border-green-900 rounded-md",
              {}
            )}
            style={{
              height: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 12}px`,
            }}
          >
            {seed && !crossbreed && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full  absolute inset-0 -top-1"
              />
            )}
            {crossbreed && (
              <img
                src={ITEM_DETAILS["Radish"].image}
                className="h-full absolute inset-0 -top-1 mx-auto"
              />
            )}
          </div>
        </div>

        {!seed && (
          <>
            <Label type="default">Pick a seed</Label>
            <div className="flex">
              <Box />
              <Box />
              <Box />
              <Box />
            </div>
          </>
        )}

        {seed && (
          <>
            <Label type="default">Crossbreed with</Label>
            <div className="flex">
              <Box />
              <Box />
              <Box />
              <Box />
            </div>
          </>
        )}
      </div>

      {!seed && <Button onClick={() => setSeed("Sunflower Seed")}>Next</Button>}

      {seed && <Button onClick={() => setCrossBreed("Pumpkin")}>Plant</Button>}
    </>
  );
};
