import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor, useMachine } from "@xstate/react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { roundToOneDecimal } from "features/auth/components";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import bottle from "../assets/bottle.gif";
import seal from "../assets/seal.png";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";
import team from "assets/npcs/project_dignity.png";
import humanDeath from "assets/npcs/human_death.gif";
import { beggarAudio } from "lib/utils/sfx";
import { Context } from "../lib/CommunityProvider";
import { donationMachine } from "../merchant/lib/donationMachine";

export const BottleDonation: React.FC = () => {
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

  const bottleClick = () => {
    setDonation(1);
    send("BOTTLE_CLICK");
    //Checks if beggarAudio is playing, if false, plays the sound
    if (!beggarAudio.playing()) {
      beggarAudio.play();
    }
  };

  const donate = () => {
    send("DONATE", { donation });
  };

  return (
    <div
      className="z-5 relative align-items-center"
      style={{
        left: `${GRID_WIDTH_PX * 15}px`,
        top: `${GRID_WIDTH_PX * 32}px`,
        width: `${GRID_WIDTH_PX * 1}px`,
        height: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <img
        id="bottle"
        src={bottle}
        className="relative hover:cursor-pointer hover:img-highlight z-20"
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
        onClick={bottleClick}
      />
      <Modal
        centered
        show={!state.matches("idle")}
        onHide={() => send("CLOSE")}
      >
        <Panel>
          {state.matches("floating") && (
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
              <img src={team} alt="team members" className="w-full m-3 px-3" />
              <div className="flex flex-col text-shadow items-center">
                <h2 className="text-sm sm:text-base mb-2 text-center pb-2">
                  Want more Aquatics?
                </h2>
                <p className="sm:text-sm mb-3 text-center">
                  Help Project Dignity team build new unique aquatic creatures
                  for your farm.
                </p>
                <p className="sm:text-sm mb-3 text-center">
                  {`Seals, otters, dolphins, you name it, we'll make it! 
                  Your donation means a lot to us and would make us motivated to create more features in the future.`}
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
          {state.matches("donating") && (
            <div className="flex flex-col items-center">
              <img id="bottle" src={bottle} className="w-20" />
              <p className="loading mb-4">Donating</p>
            </div>
          )}
          {state.matches("donated") && (
            <div className="flex flex-col items-center">
              <img id="seal" src={seal} className="w-20" />
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
    </div>
  );
};
