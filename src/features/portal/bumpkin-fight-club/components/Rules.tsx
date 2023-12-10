import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { acknowledgeRules } from "../lib/utils";

interface Props {
  onAcknowledged: () => void;
}

export const Rules: React.FC<Props> = ({ onAcknowledged }) => {
  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2">Welcome to Bumpkin Fight Club!</p>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={ITEM_DETAILS["Arcade Token"].image}
              className="h-6 mr-2 object-contain"
            />
          </div>
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
          acknowledgeRules();
          onAcknowledged();
        }}
      >
        Ok
      </Button>
    </>
  );
};
