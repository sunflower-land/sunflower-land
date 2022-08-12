import React, { useContext } from "react";
import { useActor, useMachine } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GoblinProvider";
import { frogMachine } from "./lib/frogMachine";
import { ErrorMessage } from "features/auth/ErrorMessage";

import { ErrorCode } from "lib/errors";

// images
import frog_unrevealed from "../../../assets/nfts/frogs/frog_unrevealed.gif";
import frog_revealed from "../../../assets/nfts/frogs/frog_revealed.gif";
import box from "../../../assets/nfts/frogs/box.gif";
import big_goblin_axe from "../../../assets/npcs/big_goblin_axe.gif";
import sfl_token from "../../../assets/icons/token.gif";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  // const child = (goblinState.children.frog || {}) as MachineInterpreter;

  const [machine, send] = useMachine(frogMachine);

  const { state, errorCode } = machine.context;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="relative">
        {(machine.matches("loading") || machine.matches("check_token")) && (
          <span className="loading mt-1">Loading</span>
        )}
        {machine.matches("approve") && (
          <>
            <div className="flex flex-col items-center">
              <h1 className="text-xl mb-2 text-center">
                {`This season's event: Frogs!`}
              </h1>
              <p className="text-xs mb-4\2 mt-2 text-center">
                {`Note: This is a Community Feature`}
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
              <h2 className="text-m m-2 text-center">
                {`Before minting, you will need to approve 100 SFL Spending from your wallet.`}
              </h2>
              <Button
                className="text-xs mt-2"
                onClick={() => {
                  send("APPROVE");
                }}
              >
                Approve SFL Spending
              </Button>
            </div>
          </>
        )}
        {machine.matches("approving") && (
          <span className="loading mt-1">Approving</span>
        )}
        {machine.matches("mint") && (
          <>
            <div className="flex flex-col items-center">
              <h1 className="text-xl mb-2 text-center">
                {`This season's event: Frogs!`}
              </h1>
              <img
                src={frog_revealed}
                alt="Random frog revealed"
                className="m-2"
                width="200px"
              />
              <Button
                className="text-xs mt-2 w-1/2"
                onClick={() => {
                  send("MINT");
                }}
              >
                Mint a frog
              </Button>
              <p className="text-xxs mb-4\2 mt-2 text-center">
                {`Note: This is a Community Feature`}
              </p>
              <p className="text-xxs mb-4\2 mt-2 text-center">
                initiated by{" "}
                <a href="https://www.project-dignity.tk/project-dignity/members">
                  Project Dignity
                </a>
              </p>
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
                width="200px"
              />
              <span className="loading mt-1">Minting frog</span>
            </div>
          </>
        )}
        {machine.matches("minted") && (
          <>
            <div className="flex flex-col items-center">
              <span className="mt-1">Your frog has been minted!</span>
              <img
                src={frog_unrevealed}
                alt="Goblin with Axe"
                className="m-2"
                width="200px"
              />
              <p className="text-xs text-center mb-2">
                What to do next? Wait for frog reveal!
              </p>
              <p className="text-xxs text-center">
                Note: When 500 frogs have been minted out, you get to see what
                kind of frog you got!
              </p>
              <Button
                className="text-xs mt-2"
                onClick={() => {
                  send("MINT");
                }}
              >
                Check Frog Collection
              </Button>
              <Button
                className="text-xs mt-2"
                onClick={() => {
                  send("MINT");
                }}
              >
                Go to Frog GitBooks
              </Button>
            </div>
          </>
        )}
        {machine.matches("finished") && (
          <span className="mt-1">All Frogs found their home.</span>
        )}
        {machine.matches("blacklisted") && (
          <>
            <div className="flex flex-col items-center">
              <span className="mt-1">You already minted your frog!</span>
              <img
                src={big_goblin_axe}
                alt="Goblin with Axe"
                className="m-2"
                width="75px"
              />
              <p className="text-xs text-center">
                We allow only 1 Frog Mint per farm.
              </p>
            </div>
          </>
        )}
        {machine.matches("not_whitelisted") && (
          <span className="mt-1">
            Sorry but you are not whitelisted for this event.
          </span>
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
