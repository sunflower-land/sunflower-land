import React from "react";
import { useMachine } from "@xstate/react";

import { Panel } from "components/ui/Panel";
import wisingWell from "assets/buildings/wishing_well.png";
import icon from "assets/brand/icon.png";
import head from "assets/npcs/hat_head.png";
import timer from "assets/icons/timer.png";

import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import { wishingWellMachine, MachineInterpreter } from "../wishingWellMachine";
import { fromWei } from "web3-utils";

export const shortAddress = (address: string): string => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};

interface Props {
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = () => {
  // TODO - Typescript error
  const [machine, send] = useMachine(wishingWellMachine as any) as any;

  const Content = () => {
    if (machine.matches("error")) {
      return <span>Something went wrong!</span>;
    }

    if (machine.matches("loading")) {
      return <span>Loading...</span>;
    }

    if (machine.matches("withdrawing")) {
      return <span>Withdrawing...</span>;
    }

    if (machine.matches("depositing")) {
      return <span>Throwing in tokens...</span>;
    }

    if (machine.matches("searching")) {
      return <span>Searching...</span>;
    }

    if (machine.matches("approving")) {
      return <span>Approving...</span>;
    }

    if (machine.matches("throwing")) {
      return (
        <div>
          <span className="text-sm">
            First, you will need to approve your tokens to send into the well.
          </span>
          <Button onClick={() => send("APPROVE")}>Approve</Button>
          <span className="text-xxs leading-tight">
            This feature is experimental, proceed at your own risk.
          </span>
          <a
            className="text-xxs underline cursor-pointer text-center mt-1"
            href="https://docs.sunflower-land.com/fundamentals/wishing-well-locked-liquidity"
            target="_blank"
            rel="noreferrer"
          >
            Read more
          </a>
        </div>
      );
    }

    if (machine.matches("approved")) {
      return (
        <div className="text-sm">
          <span>Congratulations! Now you can throw your tokens in.</span>
          <Button onClick={() => send("SEND")}>Throw</Button>
          <span className="text-xxs">Tokens be locked for 3 days.</span>
        </div>
      );
    }

    if (machine.matches("thrown")) {
      return (
        <span>
          WooHoo! Your tokens are now in the well. Come back in 3 days and check
          for rewards.
        </span>
      );
    }

    if (machine.matches("withdrawn")) {
      return (
        <span>
          WooHoo! Your tokens have been sent back to:{" "}
          {shortAddress(metamask.myAccount as string)}
        </span>
      );
    }

    if (machine.matches("searched")) {
      return (
        <span>
          WooHoo! You found some tokens in the well. They have been sent to:{" "}
          {shortAddress(metamask.myAccount as string)}
        </span>
      );
    }

    const wishingWell = machine.context.state;

    console.log({ wishingWell });

    // machine.matches('ready')
    return (
      <div>
        {/* Intro text if they have not thrown any in */}
        {wishingWell.myTokensInWell === "0" && (
          <div className="flex items-start">
            <img src={head} alt="hat" className="h-8 mr-2" />
            <span className="text-sm">
              Throw tokens into the well and make a wish!
            </span>
          </div>
        )}

        {/* Throw in tokens */}
        {Number(wishingWell.lpTokens) > 0 ? (
          <div className="py-2 border-white flex flex-col items-center">
            <span className="text-xs">
              You have {fromWei(wishingWell.lpTokens.toString())} LP tokens in
              your wallet.
            </span>
            <Button className="text-sm mt-1" onClick={() => send("THROW")}>
              Throw in well
            </Button>
          </div>
        ) : (
          <div className="py-2 mt-2 border-white flex flex-col items-center">
            <span className="text-xs text-center">
              {`You don't have any LP in your wallet.`}
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
        )}

        {Number(wishingWell.myTokensInWell) > 0 && (
          <div className="py-2 mt-2 border-t border-white flex flex-col items-center">
            <div className="flex items-center">
              <img src={timer} className="w-2 mr-2" />
              <span className="text-xxs">{wishingWell.lockedTime} left</span>
            </div>
            <Button
              disabled={!!wishingWell.lockedTime}
              className="text-sm mt-1"
              onClick={() => send("WITHDRAW")}
            >
              Withdraw {fromWei(wishingWell.myTokensInWell.toString())} LP
            </Button>
            <span className="text-xxs pt-1">OR</span>

            <Button
              disabled={!!wishingWell.lockedTime}
              className="text-sm mt-1"
              onClick={() => send("SEARCH")}
            >
              Search well for SFL
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Panel className="relative">
      <div className="flex">
        <div className="w-2/3 p-2">{Content()}</div>
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
  );
};
