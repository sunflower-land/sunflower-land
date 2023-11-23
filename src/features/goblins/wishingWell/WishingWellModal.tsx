import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";

import wisingWell from "assets/buildings/wishing_well.png";
import goblinHead from "assets/npcs/goblin_head.png";
import token from "assets/icons/token_2.png";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import { shortAddress } from "lib/utils/shortAddress";
import { CONFIG } from "lib/config";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { MachineInterpreter } from "./wishingWellMachine";
import { WishingWellTokens } from "./actions/loadWishingWell";
import { Context } from "features/game/GoblinProvider";
import { setPrecision } from "lib/utils/formatNumber";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { mintTestnetTokens } from "lib/blockchain/Pair";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

type GrantedArgs = Pick<WishingWellTokens, "lockedTime"> & {
  onClose: () => void;
  reward: string;
};

type GrantWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClick?: () => void;
};

type ZeroTokensArgs = {
  onClick?: () => void;
};

type WaitingForWishArgs = Pick<WishingWellTokens, "lockedTime">;

type NoWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClick: () => void;
  hasLPTokens: boolean;
};

const Granted = ({ lockedTime, onClose, reward }: GrantedArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-lg mb-4 text-center">{translate("congrats")}</h1>
        <img src={token} alt="sunflower token" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">{translate("statements.wish.granted")}</p>
      <p className="mb-4 text-sm">
        {translate("statements.sfl.rewards.received")}
        {`${reward}`}
      </p>
      <p className="mb-4 text-sm">{translate("statements.new.wish")}</p>
      {lockedTime && (
        <p className="mb-2 text-sm">
          {translate("statements.wish.ready.in")}
          {`${lockedTime}.`}
        </p>
      )}
    </div>
    <Button className="mr-1" onClick={onClose}>
      {translate("close")}
    </Button>
  </>
);

const GrantWish = ({ totalTokensInWell, onClick }: GrantWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-lg mb-4 text-center">
          {translate("statements.wish.granted.time")}
        </h1>
        <img src={wisingWell} alt="wishing well" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">
        {translate("statements.wishing.well.amount")}
        {`${Number(fromWei(totalTokensInWell.toString())).toFixed(2)}`}
      </p>
      <p className="mb-2 text-sm">
        {translate("statements.wishing.well.luck")}
      </p>
    </div>
    <div className="flex">
      <Button onClick={onClick}>{translate("grant.wish")}</Button>
    </div>
  </>
);

const ZeroTokens = ({ onClick }: ZeroTokensArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-lg mb-4 text-center">{translate("uhOh")}</h1>
        <img src={goblinHead} alt="skeleton death" className="w-16 mb-2" />
      </div>
      <p className="mb-4 text-sm">{translate("statements.no.reward")}</p>
      <p className="mb-2 text-sm">{translate("statements.make.a.wish")}</p>
    </div>
    <div className="flex">
      <Button className="whitespace-nowrap" onClick={onClick}>
        {translate("grant.wish")}
      </Button>
    </div>
  </>
);

const WaitingForWish = ({ lockedTime }: WaitingForWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-lg mb-4 text-center">
          {translate("statements.wish.made")}
        </h1>
        <img src={SUNNYSIDE.icons.timer} alt="timer" className="w-8 mb-2" />
      </div>
      <p className="mb-4 text-sm">{translate("statements.wish.thanks")}</p>
      <p className="mb-4 text-sm">
        {translate("statements.wish.granted.time")}
        {`${lockedTime}`}
      </p>
      <p className="mb-4 text-sm">{translate("statements.wish.warning.one")}</p>
      <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-[#f77621]">
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          alt="alert"
          className="mr-2 w-6"
        />
        <span className="text-xs">
          {translate("statements.wish.warning.two")}
        </span>
      </div>
    </div>
  </>
);

const NoWish = ({ totalTokensInWell, hasLPTokens, onClick }: NoWishArgs) => (
  <>
    <div className="p-2">
      <div className="flex flex-col items-center mb-3">
        <h1 className="text-lg mb-2 text-center">
          {translate("wishing.well")}
        </h1>
        <img src={wisingWell} alt="wishing well" className="w-16" />
      </div>
      <p className="mb-4 text-sm">
        The wishing well is a magical place where SFL rewards can be made just
        by making a wish!
      </p>
      <p className="mb-4 text-sm">
        Wishes are granted to farmers who provided liquidity in the game. More
        info:
      </p>
      <p className="mb-4 text-sm">
        <a
          className="underline"
          href="https://docs.sunflower-land.com/fundamentals/wishing-well#what-is-in-the-wishing-well"
          target="_blank"
          rel="noopener noreferrer"
        >
          Providing Liquidity
        </a>
      </p>
      <p className="mb-4 text-sm">
        {translate("statements.wishing.well.amount")}
        {`${Number(fromWei(totalTokensInWell.toString())).toFixed(2)}`}
      </p>
      <div className="flex justify-center items-center mb-4">
        <img
          src={SUNNYSIDE.icons.player}
          alt="player address"
          className="w-6"
        />
        <span className="ml-2">{shortAddress(wallet.myAccount as string)}</span>
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
            rel="noopener noreferrer"
          >
            providing liquidity
          </a>
          {` yet.`}
        </p>
      )}
    </div>
    <div className="flex">
      <Button
        className={classNames(!hasLPTokens && "text-xs")}
        onClick={onClick}
      >
        {hasLPTokens ? `Make Wish` : `Add Liquidity`}
      </Button>
    </div>
    {CONFIG.NETWORK === "mumbai" && (
      <div>
        <Button
          className="text-xs mt-2"
          onClick={() =>
            mintTestnetTokens(wallet.web3Provider, wallet.myAccount as string)
          }
        >
          Mint testnet LP tokens
        </Button>
      </div>
    )}
  </>
);

export const WishingWellModal: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = (goblinState.children.wishingWell || {}) as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { state: wishingWell, errorCode } = machine.context;

  useUiRefresher({
    active:
      machine.matches("granted") ||
      machine.matches("waiting") ||
      machine.matches("wished"),
  });

  const handleClose = () => {
    send("CLOSING");
  };

  const goToQuickSwap = () => {
    window.open(
      "https://quickswap.exchange/#/add/0xd1f9c58e33933a993a3891f8acfe05a68e1afc05/ETH/v2",
      "_blank"
    );
  };

  return (
    <Modal centered show={true} onHide={handleClose}>
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
              <SomethingWentWrong />
            )}
          </div>
        )}
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer m-2 z-20"
          onClick={handleClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        {machine.matches("noLiquidity") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            hasLPTokens={Number(wishingWell.lpTokens) > 0}
            onClick={goToQuickSwap}
          />
        )}
        {machine.matches("zeroTokens") && (
          <ZeroTokens onClick={() => send("WISH")} />
        )}
        {machine.matches("canWish") && (
          <NoWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClick={() => send("WISH")}
            hasLPTokens={Number(wishingWell.lpTokens) > 0}
          />
        )}
        {(machine.matches("waiting") || machine.matches("wished")) && (
          <WaitingForWish lockedTime={wishingWell.lockedTime as string} />
        )}
        {machine.matches("readyToGrant") && (
          <GrantWish
            totalTokensInWell={wishingWell.totalTokensInWell}
            onClick={() => send("GRANT_WISH")}
          />
        )}
        {machine.matches("granted") && (
          <Granted
            reward={
              machine.context.totalRewards
                ? setPrecision(machine.context.totalRewards).toString()
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
