import React, { useContext } from "react";
import { useActor, useMachine } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/community/lib/CommunityProvider";
import { frogMachine } from "./lib/frogMachine";
import { ErrorMessage } from "features/auth/ErrorMessage";

import { ErrorCode } from "lib/errors";

// images
import frog_unrevealed from "assets/nfts/frogs/frog_unrevealed.gif";
import frog_revealed from "assets/nfts/frogs/frog_revealed.gif";
import box from "assets/nfts/frogs/box.gif";
import big_goblin_axe from "assets/npcs/big_goblin_axe.gif";
import sfl_token from "assets/icons/token_2.png";
import alert from "assets/icons/expression_alerted.png";
import close from "assets/icons/close.png";
import heart from "assets/icons/heart.png";
import cancel from "assets/icons/cancel.png";

import { CONFIG } from "lib/config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { communityService } = useContext(Context);
  const [communityState] = useActor(communityService);
  const [machine, send] = useMachine(frogMachine);
  const { state, errorCode } = machine.context;

  // links
  const openseaLink =
    CONFIG.NETWORK == "mainnet"
      ? "https://opensea.io/collection/sunflower-land-frogs-collection"
      : "https://testnets.opensea.io/collection/sunflower-land-frogs-collection-testnet";
  const projectDignity = "https://www.project-dignity.tk";

  const handleClose = () => onClose();

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="relative">
        {(machine.matches("loading") || machine.matches("check_token")) && (
          <span className="loading mt-1">Loading</span>
        )}
        {machine.matches("approve") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-1">
              <h1 className="text-xl mb-2 text-center">
                {`This season's event: Frogs!`}
              </h1>
              <p className="text-xs mb-4\2 mt-2 text-center">
                {`Note: This is a Community Feature`}
              </p>
              <p className="text-xxs mb-4\2 mt-2 text-center">
                initiated by{" "}
                <a
                  href={`${projectDignity}/project-dignity/members`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Project Dignity
                </a>
              </p>
              <img
                src={frog_unrevealed}
                alt="Random frog unrevealed"
                className="m-2"
                width="200px"
              />
              <div className="flex justify-center items-end">
                <img src={sfl_token} className="h-5 me-2" />
                <span className="text-xs text-shadow text-center mt-2">
                  {100} SFL
                </span>
              </div>
              <div className="flex items-center border-2 m-2 rounded-md border-black p-2 bg-[#ffa214]">
                <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
                <span className="text-xs">
                  Before minting, you will need to Approve 100 SFL Spending from
                  your <u>METAMASK WALLET</u>.
                </span>
              </div>
              <Button className="text-xs mt-2" onClick={() => send("APPROVE")}>
                Approve SFL Spending
              </Button>
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
            </div>
          </>
        )}
        {machine.matches("approving") && (
          <span className="loading mt-1">Approving</span>
        )}
        {machine.matches("mint") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-1">
              <h1 className="text-xl mb-2 text-center">
                {`This season's event: Frogs!`}
              </h1>
              <p className="text-xs mb-4\2 mt-2 text-center">
                {`Note: This is a Community Feature`}
              </p>
              <p className="text-xxs mb-4\2 mt-2 text-center">
                initiated by{" "}
                <a
                  href={`${projectDignity}/project-dignity/members`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Project Dignity
                </a>
              </p>
              <img
                src={frog_revealed}
                alt="Random frog revealed"
                className="m-2"
                width="200px"
              />
              <div className="flex items-center border-2 m-2 rounded-md border-black p-2 bg-[#ffa214]">
                <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
                <span className="text-xs">
                  THIS WILL DEDUCT 100 SFL TOKENS FROM YOUR{" "}
                  <u>METAMASK WALLET</u>.
                </span>
              </div>
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
              <Button className="text-xs mt-2" onClick={() => send("MINT")}>
                Mint a frog
              </Button>
            </div>
          </>
        )}
        {machine.matches("check_whitelist") && (
          <span className="loading mt-1">Checking whitelist</span>
        )}
        {machine.matches("minting") && (
          <>
            <div className="flex flex-col items-center">
              <img
                src={box}
                alt="Sunflower Box"
                className="m-2"
                width="100px"
              />
              <span className="loading mt-1">Minting frog</span>
            </div>
          </>
        )}
        {machine.matches("minted") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-1">
              <span className="mt-1">Your frog has been minted!</span>
              <img
                src={frog_unrevealed}
                alt="Goblin with Axe"
                className="m-2 pt-4 pb-4"
                width="200px"
              />
              <p className="text-xs text-center mb-2">
                What to do next? Wait for frog reveal!
              </p>
              <p className="text-xxs text-center">
                {`When all frogs are minted, you'll see what kind of frog you got!`}
              </p>
              <Button
                className="text-xs mt-2"
                onClick={() => window.open(openseaLink, "_blank")}
              >
                Check Frog Collection
              </Button>
              <Button
                className="text-xs mt-2"
                onClick={() =>
                  window.open(
                    `${projectDignity}/community-projects/frogs`,
                    "_blank"
                  )
                }
              >
                Go to Frog GitBooks
              </Button>
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
            </div>
          </>
        )}
        {machine.matches("finished") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-2">
              <img src={heart} width="50px" />
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
              <span className="mt-2 text-center">
                All Frogs found their home.
              </span>
            </div>
          </>
        )}
        {machine.matches("blacklisted") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-1">
              <span className="mt-1">You already minted a frog!</span>
              <p className="text-xs mb-4\2 mt-2 text-center">
                {`Note: This is a Community Feature`}
              </p>
              <p className="text-xxs mb-4\2 mt-2 text-center">
                initiated by{" "}
                <a
                  href={`${projectDignity}/project-dignity/members`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Project Dignity
                </a>
              </p>
              <img
                src={big_goblin_axe}
                alt="Goblin with Axe"
                className="m-2 pt-4 pb-4"
                width="75px"
              />
              <p className="text-xs text-center">
                We allow only 1 Frog Mint per farm.
              </p>
              <p className="text-xxs text-center">
                {`When all frogs are minted, you'll see what kind of frog you got!`}
              </p>
              <Button
                className="text-xs mt-2"
                onClick={() => window.open(openseaLink, "_blank")}
              >
                Check Frog Collection
              </Button>
              <Button
                className="text-xs mt-2"
                onClick={() =>
                  window.open(
                    `${projectDignity}/community-projects/frogs`,
                    "_blank"
                  )
                }
              >
                Go to Frog GitBooks
              </Button>
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
            </div>
          </>
        )}
        {machine.matches("not_whitelisted") && (
          <>
            <div className="flex flex-col items-center mt-1 mb-2">
              <img src={cancel} width="50px" className="mt-1" />
              <img
                src={close}
                className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
                onClick={onClose}
              />
              <span className="mt-2 text-center">
                Sorry, you are not whitelisted for this event.
              </span>
            </div>
          </>
        )}
        {machine.matches("error") && (
          <div>
            <ErrorMessage errorCode={errorCode as ErrorCode} />
          </div>
        )}
      </Panel>
    </Modal>
  );
};
