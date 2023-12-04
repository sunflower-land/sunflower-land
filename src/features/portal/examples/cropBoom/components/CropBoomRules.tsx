import React from "react";

import tutorial from "features/portal/examples/cropBoom/assets/crop_boom-tutorial.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { acknowledgeCropBoomRules } from "../lib/portalMachine";

interface Props {
  onAcknowledged: () => void;
}
export const CropBoomRules: React.FC<Props> = ({ onAcknowledged }) => {
  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2">Welcome to Crop Boom!</p>
        <img src={tutorial} className="w-full mx-auto rounded-lg mb-2" />
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={ITEM_DETAILS["Arcade Token"].image}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs  flex-1">
            Reach the other side of the dangerous crop field to claim an Arcade
            Token.
          </p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.death}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs  flex-1">
            Beware of exploding crops. If you step on these, you will start from
            the beginning.
          </p>
        </div>

        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.stopwatch}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">Each day a new puzzle will appear.</p>
        </div>
      </div>
      <Button
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={() => {
          acknowledgeCropBoomRules();
          onAcknowledged();
        }}
      >
        Ok
      </Button>
    </>
  );
};
