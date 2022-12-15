import React, { useContext } from "react";

import goldenCrop from "assets/events/golden_crop/golden_crop.gif";
import { Button } from "components/ui/Button";

import { Context } from "../GameProvider";

export const GoldenCrop: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge(answer: string) {
    localStorage.setItem("goldenCrop.acknowledged", JSON.stringify({ answer }));

    gameService.send("ACKNOWLEDGE", { answer });
  }

  return (
    <div className=" p-2">
      <p className="text-lg text-center">Golden Crop Challenge!</p>
      <div className="flex flex-col mt-4">
        <img src={goldenCrop} className="m-auto w-1/3" />
        <p className="text-sm mb-3 text-center">
          Harvest crops for your chance to find a Golden Crop. $1500 USDC in
          prizes to be given away.
        </p>

        <p className="text-sm text-center">Would you like to participate?</p>
        <div className="flex -mt-4 mb-1">
          <Button onClick={() => onAcknowledge("no")} className="mt-4 mr-2">
            No
          </Button>
          <Button onClick={() => onAcknowledge("yes")} className="mt-4">
            Yes
          </Button>
        </div>
        <p className="text-xxs text-center">
          By participating, you agree to the{" "}
          <a
            href="https://docs.sunflower-land.com/support/terms-of-service#golden-crop"
            target="_blank"
            rel="noreferrer"
            className="text-center underline"
          >
            Terms and conditions
          </a>
        </p>
      </div>
    </div>
  );
};
