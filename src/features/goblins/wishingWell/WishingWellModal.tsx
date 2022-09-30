import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

import wisingWell from "assets/buildings/wishing_well.png";
import goblinHead from "assets/icons/goblin_head.png";
import player from "assets/icons/player.png";
import timer from "assets/icons/timer.png";
import alert from "assets/icons/expression_alerted.png";
import token from "assets/icons/token_2.png";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";
import { Context } from "features/game/GoblinProvider";
import { shortAddress } from "lib/utils/shortAddress";
import { CONFIG } from "lib/config";
import { ConnectingError } from "features/auth/components/ConnectingError";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { MachineInterpreter } from "./wishingWellMachine";
import { WishingWellTokens } from "./actions/loadWishingWell";

type GrantedArgs = Pick<WishingWellTokens, "lockedTime"> & {
  onClose: () => void;
  reward: string;
};

type GrantWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClose: () => void;
  onClick?: () => void;
};

type ZeroTokensArgs = {
  onClose: () => void;
  onClick?: () => void;
};

type WaitingForWishArgs = Pick<WishingWellTokens, "lockedTime"> & {
  onClose: () => void;
};

type NoWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClose: () => void;
  onClick: () => void;
  hasLPTokens: boolean;
};

const Granted = ({ lockedTime, onClose, reward }: GrantedArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-xl mb-4 text-center">Congratulations!</h1>
        <img src={token} alt="sunflower token" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">Your wish has been granted.</p>
      <p className="mb-4 text-sm">{`You have received ${reward} SFL!`}</p>
      <p className="mb-4 text-sm">
        A new wish has been made for you based on your current balance of LP
        tokens!
      </p>
      {lockedTime && (
        <p className="mb-2 text-sm">
          {`Your new wish will be ready in ${lockedTime}.`}
        </p>
      )}
    </div>
    <Button className="mr-1" onClick={onClose}>
      Close
    </Button>
  </>
);

const GrantWish = ({ totalTokensInWell, onClick, onClose }: GrantWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-xl mb-4 text-center">
          {`It's time to grant your wish!`}
        </h1>
        <img src={wisingWell} alt="wishing well" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">
        {`There is currently ${Number(
          fromWei(totalTokensInWell.toString())
        ).toFixed(2)} SFL worth of rewards in the well!`}
      </p>
      <p className="mb-2 text-sm">{`Let's see how lucky you are!`}</p>
    </div>
    <div className="flex">
      <Button className="mr-1" onClick={onClose}>
        Close
      </Button>
      <Button className="ml-1" onClick={onClick}>
        Grant Wish
      </Button>
    </div>
  </>
);

const ZeroTokens = ({ onClick, onClose }: ZeroTokensArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-xl mb-4 text-center">{`Uh oh!`}</h1>
        <img src={goblinHead} alt="skeleton death" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">
        You have no reward available! Liquidity needs to be held for 3 days to
        get a reward!
      </p>
      <p className="mb-2 text-sm">{`Grant a new wish and see how lucky you are!`}</p>
    </div>
    <div className="flex">
      <Button className="mr-1 whitespace-nowrap" onClick={onClose}>
        Close
      </Button>
      <Button className="ml-1 whitespace-nowrap" onClick={onClick}>
        Grant New Wish
      </Button>
    </div>
  </>
);

const WaitingForWish = ({ lockedTime, onClose }: WaitingForWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-xl mb-4 text-center">You have made a wish!</h1>
        <img src={timer} alt="timer" className="w-8 mb-2" />
      </div>
      <p className="mb-4 text-sm">
        Thanks for supporting the project and making a wish.
      </p>
      <p className="mb-4 text-sm">
        {`Come back in ${lockedTime} to see just how lucky you have been.`}
      </p>
      <p className="mb-4 text-sm">
        Be aware that only the LP tokens you held at the time the wish was made
        will be considered when the wish is granted.
      </p>
      <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-[#f77621]">
        <img src={alert} alt="alert" className="mr-2 w-6" />
        <span className="text-xs">
          {`If you remove your liquidity during this time you won't receive any
            rewards.`}
        </span>
      </div>
    </div>
    <Button onClick={onClose}>Close</Button>
  </>
);

const NoWish = ({
  totalTokensInWell,
  hasLPTokens,
  onClick,
  onClose,
}: NoWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-xl mb-2 text-center">Wishing Well</h1>
        <img src={wisingWell} alt="wishing well" className="w-16" />
      </div>
      <p className="mb-4 text-sm">
        The wishing well is a magical place where SFL rewards can be made just
        by making a wish!
      </p>
      <p className="mb-4 text-sm">
        Wishes are granted to farmers who{" "}
        <a
          className="underline"
          href="https://docs.sunflower-land.com/fundamentals/wishing-well#what-is-in-the-wishing-well"
          target="_blank"
          rel="noreferrer"
        >
          provide liquidity
        </a>
        {` in the game.`}
      </p>
      <p className="mb-4 text-sm">
        {`There is currently ${Number(
          fromWei(totalTokensInWell.toString())
        ).toFixed(2)} SFL worth of rewards in the well!`}
      </p>
      <div className="flex justify-center items-center mb-4">
        <img src={player} alt="player address" className="w-6" />
        <span className="ml-2">
          {shortAddress(metamask.myAccount as string)}
        </span>
      </div>
      {hasLPTokens ? (
        <p className="mb-2 text-sm">
          Looks like you have those magic LP tokens in your wallet!
        </p>
      ) : (
        <p className="mb-2 text-sm">
          {`It doesn't look like you are `}
          <a
            className="underline"
            href="https://docs.sunflower-land.com/fundamentals/wishing-well#what-is-in-the-wishing-well"
            target="_blank"
            rel="noreferrer"
          >
            providing liquidity
          </a>
          {` yet.`}
        </p>
      )}
    </div>
    <div className="flex">
      <Button className="mr-1" onClick={onClose}>
        Close
      </Button>
      <Button
        className={classNames("ml-1", !hasLPTokens && "text-xs")}
        onClick={onClick}
      >
        {hasLPTokens ? `Make Wish` : `Add Liquidity`}
      </Button>
    </div>
    {CONFIG.NETWORK === "mumbai" && (
      <div>
        <Button
          className="text-xs mt-2"
          onClick={() => metamask.getPair().mintTestnetTokens()}
        >
          Mint testnet LP tokens
        </Button>
      </div>
    )}
  </>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = (goblinState.children.wishingWell || {}) as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { state: wishingWell, errorCode } = machine.context;

  const handleClose = () => {
    onClose();
    send("CLOSING");
  };

  const goToQuickSwap = () => {
    window.open(
      "https://quickswap.exchange/#/analytics/pair/0x6f9e92dd4734c168a734b873dc3db77e39552eb6",
      "_blank"
    );
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="relative">
        {machine.matches("loading") && (
          <span className="loading mt-1">Loading</span>
        )}
        {(machine.matches("granting") || machine.matches("signing")) && (
          <span className="loading mt-1">Granting your wish</span>
        )}
        {machine.matches("wishing") && (
          <span className="loading mt-1">Making a wish</span>
        )}
        {machine.matches("error") && (
          <div>
            {errorCode === "NO_TOKENS" ? (
              <span className="mt-2">No SFL tokens found</span>
            ) : (
              <ConnectingError />
            )}
          </div>
        )}
        {machine.matches("noLiquidity") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            hasLPTokens={Number(wishingWell.lpTokens) > 0}
            onClick={goToQuickSwap}
            onClose={handleClose}
          />
        )}
        {machine.matches("zeroTokens") && (
          <ZeroTokens onClick={() => send("WISH")} onClose={handleClose} />
        )}
        {machine.matches("canWish") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClick={() => send("WISH")}
            hasLPTokens={Number(wishingWell.lpTokens) > 0}
            onClose={handleClose}
          />
        )}
        {(machine.matches("waiting") || machine.matches("wished")) && (
          <WaitingForWish
            lockedTime={wishingWell.lockedTime as string}
            onClose={handleClose}
          />
        )}
        {machine.matches("readyToGrant") && (
          <GrantWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClose={handleClose}
            onClick={() => send("GRANT_WISH")}
          />
        )}
        {machine.matches("granted") && (
          <Granted
            reward={
              machine.context.totalRewards
                ? machine.context.totalRewards
                    .toDecimalPlaces(4, Decimal.ROUND_DOWN)
                    .toString()
                : new Decimal(0).toString()
            }
            lockedTime={wishingWell.lockedTime}
            onClose={handleClose}
          />
        )}
        {machine.matches("captcha") && (
          <div className="p-1">
            <ReCAPTCHA
              sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
              onChange={(captcha: string | null) => {
                if (captcha) {
                  send({ type: "VERIFIED", captcha });
                }
              }}
              className="w-full m-0 flex items-center justify-center"
            />
          </div>
        )}
      </Panel>
    </Modal>
  );
};
