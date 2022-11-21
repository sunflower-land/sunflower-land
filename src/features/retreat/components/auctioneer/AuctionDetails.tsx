import React from "react";

import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import wood from "assets/resources/wood.png";
import bg from "assets/ui/brown_background.png";

import prizedPotato from "assets/sfts/prized_potato.gif";
import { RedLabel } from "components/ui/RedLabel";

export const AuctionDetails: React.FC = () => {
  return (
    <div className="w-full p-2 flex flex-col items-center">
      <div
        className="w-full p-2 flex flex-col items-center mx-auto"
        style={{
          maxWidth: "350px",
        }}
      >
        <p className="text-base mb-2">Prized Potato</p>
        <p className="text-center text-sm mb-2">
          A precious potato that doubles potato yield
        </p>
        <div className="flex relative mb-2">
          <img src={bg} className="w-full object-contain rounded-md" />
          <div className="absolute inset-0 flex flex-col p-2 items-center justify-center">
            <img
              src={prizedPotato}
              className="h-[70%] z-20 object-cover mb-2"
            />

            <p className="text-lg z-10 text-center absolute w-full bottom-2">
              2 days 2 hours 5 minutes
            </p>
            {/* <div
                  className="w-full relative flex items-center justify-center rounded-md"
                  style={{
                    backgroundImage: `url(${bg})`,
                    imageRendering: "pixelated",
                    backgroundSize: "100%",
                  }}
                >
                </div> */}
          </div>
        </div>
      </div>

      <Button className="text-lg">Mint</Button>
      <p className="text-lg">997/5000 remaining</p>
      {/* <RedLabel>Sold out</RedLabel> */}

      <div className="mt-2">
        <div className="mt-4">
          <div className="flex justify-between items-start">
            <span className="text-sm line-through">
              22nd November 9:00am-930am
            </span>

            <RedLabel>Sold out</RedLabel>
          </div>
          <div className="flex items-center mb-1 flex-wrap">
            <img src={token} className="h-4 mr-1" />
            <span className="text-sm">50 SFL</span>
            <img src={wood} className="h-4 mr-1 ml-2" />
            <span className="text-sm">50 Wood</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-start">
            <span className="text-sm">22nd November 9:00am-930am</span>

            <span className="bg-blue-600 border text-xxs ml-2 p-1 rounded-md">
              {`Supply: 5000`}
            </span>
          </div>
          <div className="flex items-center mb-1 flex-wrap">
            <img src={token} className="h-4 mr-2" />
            <span className="text-xs">50 SFL</span>
            <img src={wood} className="h-4 mr-2 ml-2" />
            <span className="text-xs">50 Wood</span>
            <img src={wood} className="h-4 mr-2 ml-2" />
            <span className="text-xs">50 Wood</span>
          </div>
        </div>
      </div>
    </div>
  );
};
