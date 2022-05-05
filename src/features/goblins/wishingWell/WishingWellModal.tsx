import React, { useContext } from "react";
import { useActor, useMachine } from "@xstate/react";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

import { Panel } from "components/ui/Panel";
import wisingWell from "assets/buildings/wishing_well.png";
import icon from "assets/brand/icon.png";
import token from "assets/icons/token.gif";
import timer from "assets/icons/timer.png";

import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import * as Auth from "features/auth/lib/Provider";
import { wishingWellMachine } from "./wishingWellMachine";
import { fromWei } from "web3-utils";
import { secondsToLongString } from "lib/utils/time";
import { CONFIG } from "lib/config";

export const shortAddress = (address: string): string => {
  // check if there is an address
  if (address) {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  }
  return ``;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const [machine, send] = useMachine(wishingWellMachine(authState.context));

  const Content = () => {
    const wishingWell = machine.context.state;

    if (machine.matches("error")) {
      return <span>Something went wrong!</span>;
    }

    if (machine.matches("captcha")) {
      return (
        <ReCAPTCHA
          sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
          onChange={(captcha: string | null) => send("VERIFIED", { captcha })}
          className="w-full m-0 flex items-center justify-center"
        />
      );
    }

    if (machine.matches("loading")) {
      return <span className="loading text-sm mt-3">Loading</span>;
    }

    if (machine.matches("wishing")) {
      return <span className="loading text-sm mt-3">Making a wish</span>;
    }

    if (machine.matches("searching")) {
      return <span className="loading text-sm mt-3">Searching</span>;
    }

    if (machine.matches("wished")) {
      return (
        <span className="text-sm mt-4 text-center">
          Thanks for supporting the project and making a wish. Come back in{" "}
          {secondsToLongString(wishingWell?.lockedPeriod)}
          days to see how lucky you were.
        </span>
      );
    }

    if (machine.matches("searched")) {
      return (
        <span>
          {`WooHoo! You found some tokens in the well. They have been sent to your
          farm. Don't forget to sync on chain to see your updated balance!`}
        </span>
      );
    }

    if (Number(wishingWell.lpTokens) <= 0) {
      return (
        <div className="py-2 mt-4 border-white flex flex-col items-center">
          <span className="text-sm text-center">
            {`To make a wish you need the magic LP tokens in your personal wallet.`}
          </span>
          <a
            className="text-xxs underline cursor-pointer"
            href="https://docs.sunflower-land.com/fundamentals/wishing-well-locked-liquidity"
            target="_blank"
            rel="noreferrer"
          >
            How do I do get tokens?
          </a>
        </div>
      );
    }

    if (wishingWell.myTokensInWell === "0") {
      return (
        <div className="py-2 border-white flex flex-col items-center">
          <span className="text-xs">
            Looks like you have those magic LP tokens in your wallet!
          </span>
          <Button className="text-sm mt-1" onClick={() => send("WISH")}>
            Make a wish
          </Button>
        </div>
      );
    }

    if (wishingWell.lockedTime) {
      return (
        <div className="flex items-center mt-4">
          <img src={timer} className="w-6 mr-4 ml-2" />
          <span className="text-sm">{wishingWell.lockedTime} left</span>
        </div>
      );
    }

    return (
      <div>
        <div className="py-2 mt-2 border-t border-white flex flex-col items-center">
          <Button
            disabled={!!wishingWell.lockedTime}
            className="text-sm mt-1"
            onClick={() => send("SEARCH")}
          >
            Search well for SFL
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel className="relative">
        <div className="flex">
          <div className="w-2/3 p-2">
            <div className="flex items-start mb-2">
              <img src={token} alt="hat" className="h-8 mr-2" />
              <span className="text-sm">The well is filled with SFL.</span>
            </div>
            {Content()}
            {CONFIG.NETWORK === "mumbai" && (
              <div>
                <Button
                  className="text-sm"
                  onClick={() => metamask.getPair().mintTestnetTokens()}
                >
                  Mint testnet LP tokens
                </Button>
              </div>
            )}
          </div>
          <div className="flex-1 p-2 flex flex-col items-center">
            {
              <span className="text-xxs">
                {shortAddress(metamask.myAccount as string)}
              </span>
            }
            <img src={wisingWell} alt="wishing well" className="w-full" />
            {machine.context.state && (
              <div className="flex items-center justify-center mt-2">
                <img src={icon} className="w-4 img-highlight mr-2" />
                <span className="text-xxs">
                  {Number(
                    fromWei(machine.context.state.totalTokensInWell.toString())
                  ).toFixed(2)}{" "}
                  SFL
                </span>
              </div>
            )}

            <a
              className="text-xs underline cursor-pointer text-center mt-1"
              href="https://docs.sunflower-land.com/fundamentals/wishing-well-locked-liquidity"
              target="_blank"
              rel="noreferrer"
            >
              Read more
            </a>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
