import React, { useContext, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import { shortAddress } from "lib/utils/shortAddress";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import classNames from "classnames";
import {
  MachineInterpreter,
  wishingWellMachine,
} from "../../../../goblins/wishingWell/wishingWellMachine";
import { WishingWellTokens } from "../../../../goblins/wishingWell/actions/loadWishingWell";
import { formatNumber } from "lib/utils/formatNumber";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameWallet } from "features/wallet/Wallet";
import { Label } from "components/ui/Label";
import giftIcon from "assets/icons/gift.png";
import tokenIcon from "assets/icons/sfl.webp";
import { Context } from "features/game/GameProvider";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Loading } from "features/auth/components";
import { CloseButtonPanel } from "../../CloseablePanel";

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

const Granted = ({ lockedTime, onClose, reward }: GrantedArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">{t("congrats")}</h1>
          <img src={tokenIcon} alt="sunflower token" className="w-16 mb-2" />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.wish.granted")}</p>
        <p className="mb-4 text-sm">
          {t("wishingWell.sflRewardsReceived", { reward: reward })}
        </p>
        <p className="mb-4 text-sm">{t("wishingWell.newWish")}</p>
        {lockedTime && (
          <p className="mb-2 text-sm">
            {t("wishingWell.wish.timeTillNextWish", {
              nextWishTime: lockedTime,
            })}
          </p>
        )}
      </div>
      <Button className="mr-1" onClick={onClose}>
        {t("close")}
      </Button>
    </>
  );
};

const GrantWish = ({ totalTokensInWell, onClick }: GrantWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">
            {t("wishingWell.wish.grantTime")}
          </h1>
          <img
            src={SUNNYSIDE.building.wishingwell}
            alt="wishing well"
            className="w-16 mb-2"
          />
        </div>
        <p className="mb-4 text-sm">
          {t("statements.wishing.well.worthwell", {
            rewards: formatNumber(
              Number(fromWei(totalTokensInWell.toString())),
              { decimalPlaces: 4 },
            ),
          })}
        </p>
        <p className="mb-2 text-sm">{t("statements.wishing.well.lucky")}</p>
      </div>
      <div className="flex">
        <Button onClick={onClick}>{t("grant.wish")}</Button>
      </div>
    </>
  );
};

const ZeroTokens = ({ onClick }: ZeroTokensArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">{t("uhOh")}</h1>
          <img
            src={SUNNYSIDE.npcs.goblinHead}
            alt="skeleton death"
            className="w-16 mb-2"
          />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.noReward")}</p>
        <p className="mb-2 text-sm">{t("wishingWell.wish.lucky")}</p>
      </div>
      <div className="flex">
        <Button className="whitespace-nowrap" onClick={onClick}>
          {t("grant.wish")}
        </Button>
      </div>
    </>
  );
};

const WaitingForWish = ({ lockedTime }: WaitingForWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">
            {t("wishingWell.wish.made")}
          </h1>
          <img src={SUNNYSIDE.icons.timer} alt="timer" className="w-8 mb-2" />
        </div>
        <p className="mb-4 text-sm">
          {t("wishingWell.wish.comeBackAfter", {
            nextWishTime: lockedTime || "",
          })}
        </p>
        <p className="mb-4 text-sm">{t("wishingWell.wish.warning.one")}</p>
        <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-[#f77621]">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="alert"
            className="mr-2 w-6"
          />
          <span className="text-xs">{t("wishingWell.wish.warning.two")}</span>
        </div>
      </div>
    </>
  );
};

const NoWish = ({ totalTokensInWell, hasLPTokens, onClick }: NoWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-2 text-center">{t("wishing.well")}</h1>
          <img
            src={SUNNYSIDE.building.wishingwell}
            alt="wishing well"
            className="w-16"
          />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.info.one")}</p>
        <p className="mb-4 text-sm">{t("wishingWell.info.two")}</p>
        <p className="mb-4 text-sm">
          {t("statements.wishing.well.worthwell", {
            rewards: formatNumber(
              Number(fromWei(totalTokensInWell.toString())),
              { decimalPlaces: 4 },
            ),
          })}
        </p>
        <div className="flex justify-center items-center mb-4">
          <img
            src={SUNNYSIDE.icons.player}
            alt="player address"
            className="w-6"
          />
          <span className="ml-2 font-secondary">
            {shortAddress(wallet.getAccount() as string)}
          </span>
        </div>
        {hasLPTokens ? (
          <p className="mb-2 text-sm">{t("wishingWell.info.three")}</p>
        ) : (
          <p className="mb-2 text-sm">
            {t("statements.wishing.well.look.like")}
          </p>
        )}
      </div>
      <div className="flex">
        <Button
          className={classNames(!hasLPTokens && "text-xs")}
          onClick={onClick}
        >
          {hasLPTokens ? translate("make.wish") : translate("add.liquidity")}
        </Button>
      </div>
    </>
  );
};

interface Props {
  onClose?: () => void;
}
export const WishingWellModal: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [tab, setTab] = useState(0);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const { rawToken, token } = authState.context.user;
  const { bumpkin, balance, previousBalance } = gameState.context.state;

  const sfl = balance.gt(previousBalance) ? previousBalance : balance;

  const wishingWellService = useInterpret(wishingWellMachine, {
    context: {
      farmId: gameState.context.farmId,
      bumpkinTokenUri: tokenUriBuilder(bumpkin?.equipped as BumpkinParts),
      sessionId: gameState.context.sessionId as string,
      token: rawToken,
      balance: sfl,
    },
  }) as unknown as MachineInterpreter;

  const [machine, send] = useActor(wishingWellService);

  const { state: wishingWell, errorCode } = machine.context;

  useUiRefresher({
    active:
      machine.matches("granted") ||
      machine.matches("waiting") ||
      machine.matches("wished"),
  });

  const handleClose = () => {
    send("CLOSING");

    if (onClose) {
      onClose();
    }
  };

  const goToQuickSwap = () => {
    window.open(
      "https://quickswap.exchange/#/add/0xd1f9c58e33933a993a3891f8acfe05a68e1afc05/ETH/v2",
      "_blank",
    );
  };

  return (
    <Modal show={true} onHide={handleClose}>
      <CloseButtonPanel
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            icon: giftIcon,
            name: "Wishing Well",
          },
          {
            icon: tokenIcon,
            name: "Merkl",
            alert: true,
          },
        ]}
        className="relative"
      >
        {tab === 0 && (
          <>
            <Label type="default" icon={giftIcon} className="text-center m-1">
              {`Wishing well`}
            </Label>
            <GameWallet action="wishingWell">
              {machine.matches("loading") && <Loading />}
              {(machine.matches("granting") || machine.matches("signing")) && (
                <Loading text={t("granting.wish")} />
              )}
              {machine.matches("wishing") && (
                <Loading text={t("making.wish")} />
              )}
              {machine.matches("error") && (
                <div>
                  {errorCode === "NO_TOKENS" ? (
                    <span className="mt-2">{t("no.sfl")}</span>
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
                      ? formatNumber(machine.context.totalRewards, {
                          decimalPlaces: 4,
                        })
                      : "?"
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
            </GameWallet>
          </>
        )}

        {tab === 1 && <Merkl />}
      </CloseButtonPanel>
    </Modal>
  );
};

const Merkl: React.FC = () => {
  const [page, setPage] = useState(0);
  const { t } = useAppTranslation();

  if (page === 1) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="mb-2">
            {t("merkl.leaving")}
          </Label>
          <p className="text-sm mb-2">{t("merkl.3rdParty")}</p>
          <p className="text-sm">{t("merkl.dyor")}</p>
        </div>
        <Button
          onClick={() => {
            window
              .open(
                "https://merkl.angle.money/polygon/pool/2/0xe69e0100A7607c10c8B313b2E757dFA301F29bd3",
                "_blank",
              )
              ?.focus();
          }}
        >
          {t("open")}
        </Button>
      </>
    );
  }
  return (
    <>
      <div className="p-2">
        <Label type="default" className="mb-2">
          {t("merkl.quickswapPool")}
        </Label>
        <p className="text-sm mb-2">{t("merkl.introducing")}</p>
        <p className="text-sm">{t("merkl.introducing.two")}</p>
      </div>
      <Button onClick={() => setPage(1)}>{t("read.more")}</Button>
    </>
  );
};
