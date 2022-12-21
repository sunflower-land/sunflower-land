import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor, useMachine } from "@xstate/react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { roundToOneDecimal } from "features/auth/components";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import bear from "assets/sfts/bears/christmas_bear.png";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";
import humanDeath from "assets/npcs/human_death.gif";
import { beggarAudio } from "lib/utils/sfx";
import { Context } from "../lib/CommunityProvider";
import { donationMachine } from "../merchant/lib/donationMachine";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import northpole from "assets/events/christmas/land/north_pole.gif";
import { Section } from "lib/utils/hooks/useScrollIntoView";

export const NorthPoleDonation: React.FC = () => {
  const [state, send] = useMachine(donationMachine);
  const { communityService } = useContext(Context);
  const [communityState] = useActor(communityService);
  const [donation, setDonation] = useState(1);

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

  const northPoleClick = () => {
    setDonation(1);
    send("NORTHPOLE_CLICK");
    //Checks if beggarAudio is playing, if false, plays the sound
    if (!beggarAudio.playing()) {
      beggarAudio.play();
    }
  };

  const donate = () => {
    send("DONATE", { donation });
  };

  return (
    <>
      <MapPlacement x={0} y={0} width={12}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={northPoleClick}
        >
          <img
            id={Section.NorthPole}
            src={northpole}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 144}px`,
            }}
          />
        </div>
      </MapPlacement>
      <Modal
        centered
        show={!state.matches("idle")}
        onHide={() => send("CLOSE")}
      >
        <Panel>
          {state.matches("northpolefloating") && (
            <div className="flex flex-col items-center mb-1">
              <img
                src={close}
                className="absolute cursor-pointer z-20"
                onClick={() => send("CLOSE")}
                style={{
                  top: `${PIXEL_SCALE * 6}px`,
                  right: `${PIXEL_SCALE * 6}px`,
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
              <div className="flex flex-col text-shadow items-center">
                <h2 className="text-sm sm:text-base mb-2 text-center pb-2">
                  Want to support more community events?
                </h2>
                <p className="sm:text-sm mb-3 text-center">
                  Happy holidays! The community designers & developers have yet
                  once again brought back another map update.
                </p>
                <p className="sm:text-sm mb-3 text-center">
                  If you wish to support them, donate some matic
                </p>
                <p className="sm:text-sm  mb-3 text-center">
                  Every little bit counts!
                </p>
              </div>
              <div className="relative">
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
                <img
                  src={upArrow}
                  alt="increment donation value"
                  className="cursor-pointer absolute -right-4 top-0"
                  onClick={incrementDonation}
                />
                <img
                  src={downArrow}
                  alt="decrement donation value"
                  className="cursor-pointer absolute -right-4 bottom-0"
                  onClick={decrementDonation}
                />
              </div>
              <span className="text-xxs text-shadow mt-2 mb-3">
                Amount in MATIC
              </span>
              <div className="flex w-full">
                <Button className="w-full ml-1" onClick={donate}>
                  <span className="text-xs whitespace-nowrap">Donate</span>
                </Button>
              </div>
            </div>
          )}
          {state.matches("northpoledonating") && (
            <div className="flex flex-col items-center">
              <img id="bottle" src={bear} className="w-20" />
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
              <img id="errorDonating" src={humanDeath} />
              <p className="my-4">Oh no! Something went wrong!</p>
            </div>
          )}
        </Panel>
      </Modal>
    </>
  );
};
