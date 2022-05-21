import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

import wisingWell from "assets/buildings/wishing_well.png";
import player from "assets/icons/player.png";
import timer from "assets/icons/timer.png";
import alert from "assets/icons/expression_alerted.png";
import token from "assets/icons/token.gif";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";
import { Context } from "features/game/GoblinProvider";
import { shortAddress } from "features/farming/hud/components/Address";
import { WishingWellTokens } from "./actions/loadWishingWell";
import { CONFIG } from "lib/config";
import { secondsToLongString } from "lib/utils/time";
import { ConnectingError } from "features/auth/components/ConnectingError";
import classNames from "classnames";

const Granted = ({
  lockedPeriod,
  onClose,
}: {
  lockedPeriod: string;
  onClose: () => void;
}) => {
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-base text-xl mb-4 text-center">
            Congratulations!
          </h1>
          <img src={token} alt="sunflower token" className="w-16 mb-2" />
        </div>
        <p className="mb-4 text-sm">You have been granted 200 SFL.</p>
        <p className="mb-4 text-sm">
          This amount has been transferred to your farm.
        </p>
        <p className="mb-4 text-sm">
          You will need to sync on chain to see your updated balance!
        </p>
        <p className="mb-4 text-sm">
          A new wish has been made for you based on you current balance of LP
          tokens!
        </p>
        <p className="mb-4 text-sm">
          {`Your new wish will be ready in ${lockedPeriod}.`}
        </p>
      </div>
      <Button className="mr-1" onClick={onClose}>
        Close
      </Button>
    </>
  );
};

const GrantWish = ({
  totalTokensInWell,
  onGrantWish,
  onClose,
}: {
  totalTokensInWell: Pick<WishingWellTokens, "totalTokensInWell">;
  onGrantWish: () => void;
  onClose: () => void;
}) => {
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-base text-xl mb-4 text-center">
            {`It's time to grant your wish!`}
          </h1>
          <img src={wisingWell} alt="wishing well" className="w-16 mb-2" />
        </div>
        <p className="mb-4 text-sm">
          {`There is currently ${Number(
            fromWei(totalTokensInWell.toString())
          ).toFixed(2)} SFL worth of rewards in the well!`}
        </p>
        <p className="mb-2 text-sm">
          {`Click the "Grant Wish" button to see how lucky you are!`}
        </p>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Close
        </Button>
        <Button className="ml-1" onClick={onGrantWish}>
          Grant Wish
        </Button>
      </div>
    </>
  );
};

const WaitingForWish = ({
  lockedPeriod,
  onClose,
}: {
  lockedPeriod: string;
  onClose: () => void;
}) => {
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-base text-xl mb-4 text-center">
            You have made a wish!
          </h1>
          <img src={timer} alt="timer" className="w-8 mb-2" />
        </div>
        <p className="mb-4 text-sm">
          Thanks for supporting the project and making a wish.
        </p>
        <p className="mb-4 text-sm">
          {`Come back in ${lockedPeriod} and see just how lucky you have been.`}
        </p>
        <p className="mb-4 text-sm">
          Only the LP tokens you held at the time the wish was made will be
          considered when the wish is granted.
        </p>
        <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-error">
          <img src={alert} alt="alert" className="mr-2 w-6" />
          <span className="text-xxs text-xs">
            {`If you remove your liquidity during this time you won't receive any
            rewards.`}
          </span>
        </div>
      </div>
      <Button onClick={onClose}>Close</Button>
    </>
  );
};

const NoWish = ({
  totalTokensInWell,
  hasLPTokens,
  onClick,
  onClose,
}: {
  totalTokensInWell: Pick<WishingWellTokens, "totalTokensInWell">;
  hasLPTokens: boolean;
  onClick: () => void;
  onClose: () => void;
}) => {
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-base text-xl mb-2 text-center">Wishing Well</h1>
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
        <div className="flex items-center mb-4">
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
          className={classNames(
            "ml-1",
            hasLPTokens ? "text-xs" : "test-[10px]"
          )}
          onClick={onClick}
        >
          {hasLPTokens ? `Make Wish` : `Add Liquidity`}
        </Button>
      </div>
      {CONFIG.NETWORK === "mumbai" && (
        <div>
          <Button
            className="text-xxs mt-2"
            onClick={() => metamask.getPair().mintTestnetTokens()}
          >
            Mint testnet LP tokens
          </Button>
        </div>
      )}
    </>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WishingWellModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.wishingWell;

  const [machine, send] = useActor(child);

  const { state: wishingWell, errorCode } = machine.context;

  const handleClose = () => {
    send("CLOSING");
    onClose();
  };

  const goToQuickSwap = () => {
    window.open(
      "https://quickswap.exchange/#/add/ETH/0xD1f9c58e33933a993A3891F8acFe05a68E1afC05",
      "_blank"
    );
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="relative">
        {machine.matches("loading") && (
          <span className="loading text-sm mt-2">Loading</span>
        )}
        {machine.matches("granting") && (
          <span className="loading text-sm mt-2">Granting your wish</span>
        )}
        {machine.matches("wishing") && (
          <span className="loading text-sm mt-2">Making a wish</span>
        )}
        {machine.matches("error") && (
          <div>
            {errorCode === "NO_TOKENS" ? (
              <span className="text-sm mt-2">No SFL tokens found</span>
            ) : (
              <ConnectingError />
            )}
          </div>
        )}
        {machine.matches("noLiquidity") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            hasLPTokens={!!wishingWell.lpTokens}
            onClick={goToQuickSwap}
            onClose={handleClose}
          />
        )}
        {machine.matches("canWish") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClick={() => send("WISH")}
            hasLPTokens={!!wishingWell.lpTokens}
            onClose={handleClose}
          />
        )}
        {machine.matches("waiting") && (
          <WaitingForWish
            lockedPeriod={secondsToLongString(wishingWell?.lockedPeriod)}
            onClose={handleClose}
          />
        )}
        {machine.matches("readyToGrant") && (
          <GrantWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClose={handleClose}
            onGrantWish={() => send("GRANT_WISH")}
          />
        )}
        {machine.matches("granted") && (
          <Granted
            lockedPeriod={secondsToLongString(wishingWell?.lockedPeriod)}
            onClose={handleClose}
          />
        )}
        {machine.matches("captcha") && (
          <div className="p-1">
            <ReCAPTCHA
              sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
              onChange={(captcha: string | null) =>
                send({ type: "VERIFIED", captcha })
              }
              className="w-full m-0 flex items-center justify-center"
            />
          </div>
        )}
      </Panel>
    </Modal>
  );
};
