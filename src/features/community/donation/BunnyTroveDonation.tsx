import React, { useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";

import { Button } from "components/ui/Button";

import { roundToOneDecimal } from "features/auth/components";
import { useMachine } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import bunny from "assets/sfts/bears/easter_bunny.png";
import { CONFIG } from "lib/config";

export const BunnyTroveEventDonation: React.FC = () => {
  const [state, send] = useMachine(donationMachine);
  const [donation, setDonation] = useState(1);
  const BUNNY_TROVE_EVENT_DONATION_ADDRESS = CONFIG.BUNNY_TROVE_EVENT_DONATION;
  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(roundToOneDecimal(Number(e.target.value)));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.2) {
      setDonation(0.2);
    } else if (donation < 0.2) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const donate = () => {
    console.log(BUNNY_TROVE_EVENT_DONATION_ADDRESS);
    send("DONATE", {
      donation,
      to: BUNNY_TROVE_EVENT_DONATION_ADDRESS,
    });
  };
  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col mb-1 p-2 text-sm">
          <p className="my-2">
            Happy Easter, Bumpkin! I managed to flee those Moon Seekers and
            ended up on this island full of bunnies! Say, I found something cool
            a few days back, wanna trade?
          </p>
          <div className="flex flex-col items-center">
            <img id="bottle" src={bunny} className="w-20" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex">
              <input
                type="number"
                className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-1 text-center"
                step="0.1"
                min={0.1}
                value={donation}
                required
                onChange={onDonationChange}
                onBlur={() => {
                  if (donation < 0.1) setDonation(0.1);
                }}
              />
              <div className="flex flex-col justify-between">
                <img
                  src={SUNNYSIDE.icons.arrow_up}
                  alt="increment donation value"
                  className="cursor-pointer"
                  onClick={incrementDonation}
                />
                <img
                  src={SUNNYSIDE.icons.arrow_down}
                  alt="decrement donation value"
                  className="cursor-pointer"
                  onClick={decrementDonation}
                />
              </div>
            </div>
            <span className="text-xs text-shadow my-2">Amount in MATIC</span>
          </div>
          <Button
            className="w-full ml-1"
            onClick={donate}
            disabled={donation < 0.1}
          >
            <span className="text-xs whitespace-nowrap">Donate</span>
          </Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <p className="loading mb-4">Donating</p>
        </div>
      )}
      {state.matches("donated") && (
        <div className="flex flex-col items-center">
          <p className="mb-4">Thank you!</p>
        </div>
      )}
      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-4">Oh no! Something went wrong!</p>
        </div>
      )}
    </>
  );
};
