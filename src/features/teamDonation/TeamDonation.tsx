import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { roundToOneDecimal } from "features/auth/components";
import { metamask } from "lib/blockchain/metamask";

import begger from "assets/npcs/begger.gif";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";
import token from "assets/icons/token.png";
import { Button } from "components/ui/Button";
import { toHex, toWei } from "web3-utils";

export const TeamDonation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [donation, setDonation] = useState(0.1);

  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(roundToOneDecimal(Number(e.target.value)));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.1) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const onDonate = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    try {
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: metamask.myAccount,
            to: "0x4Ff17fE136e936B0201fBa097F4c7a0F606bA770",
            value: toHex(toWei(donation.toString(), "ether")),
          },
        ],
      });

      setIsOpen(false);
    } catch (error) {
      console.log("error");
      setIsOpen(false);
    }
  };

  return (
    <div
      className="z-5 absolute align-items-center w-[72px]"
      style={{
        left: `calc(50% - ${GRID_WIDTH_PX * -11.3}px)`,
        // trial and error
        top: `calc(50% - ${GRID_WIDTH_PX * 18.1}px)`,
      }}
    >
      <img
        id="begger"
        src={begger}
        className="absolute hover:cursor-pointer hover:img-highlight"
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel>
          <div className="flex flex-col items-center mb-1">
            <img src={token} alt="sunflower token" className="w-12 mb-3" />
            <div className="flex flex-col text-shadow items-center">
              <h2 className="text-sm sm:text-base mb-2 text-center pb-2">
                Buy the team a coffee!
              </h2>
              <p className="sm:text-sm mb-3 text-center">
                Sunflower Land is run by a small group of passionate developers
                who are 100% sleep deprived.
              </p>
              <p className="sm:text-sm mb-3 text-center">
                {`You can send us a donation of Matic with which we can drink
                more coffee and stay awake longer pumping out awesome new
                features`}
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
            <span className="text-[10px] text-shadow mt-2 mb-3">
              Amount in MATIC
            </span>
            <div className="flex w-full">
              <Button className="w-full mr-1" onClick={() => setIsOpen(false)}>
                <span className="text-xs whitespace-nowrap">Close</span>
              </Button>
              <Button className="w-full ml-1" onClick={onDonate}>
                <span className="text-xs whitespace-nowrap">Donate</span>
              </Button>
            </div>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
