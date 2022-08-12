import React from "react";

import brownDisc from "assets/icons/empty_disc.png";
import stamina from "assets/icons/stamina.png";
import head from "assets/bumpkins/example.png";
import { Bar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";

export const BumpkinHUD: React.FC = () => {
  return (
    <div className="fixed top-2 left-2 z-50 flex">
      <div className="w-16 h-16 relative cursor-pointer hover:img-highlight">
        <img src={brownDisc} className="absolute inset-0 w-full h-full z-10" />
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "#bfcbda",
            width: "90%",
            height: "90%",
            position: "relative",
            top: "5%",
            left: "5%",
            borderRadius: "40%",
          }}
        >
          <img
            src={head}
            style={{
              width: "200%",
              left: "13%",
              position: "relative",
              top: "10%",
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex ml-1 mb-0.5 items-center">
          <Label>
            <span className="text-xs text-white px-1">Lvl 1</span>
          </Label>
        </div>
        <div className="flex  ml-1 items-center">
          <img src={stamina} className="w-4 mr-1" />
          <Bar percentage={60} />
        </div>
      </div>
    </div>
  );
};
