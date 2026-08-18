import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import lightning from "assets/icons/lightning.png";
import { getTax } from "lib/utils/tax";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { useConnection } from "wagmi";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel } from "components/ui/Panel";
import { shortAddress } from "lib/utils/shortAddress";
import withdrawIcon from "assets/icons/withdraw.png";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  onWithdraw: (sfl: string, chainId: number) => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;
const _autosaving = (state: MachineState) => state.matches("autosaving");

const MIN_FLOWER_WITHDRAW_AMOUNT = new Decimal(5);

/**
 * Breakdown of the player's balance shown to players who have not reached the
 * reputation required to withdraw FLOWER earned in-game.
 */
const FlowerBreakdown: React.FC<{
  balance: Decimal;
  unlockedFlower: Decimal;
  /** Highlights the available row when the player has asked for too much */
  exceeded?: boolean;
}> = ({ balance, unlockedFlower, exceeded }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs">{t("withdraw.flower.total")}</span>
        <span className="text-xs font-secondary">
          {formatNumber(balance, { decimalPlaces: 4 })}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs">{t("withdraw.flower.available")}</span>
        {exceeded ? (
          <Label type="danger">
            {formatNumber(unlockedFlower, { decimalPlaces: 4 })}
          </Label>
        ) : (
          <span className="text-xs font-secondary">
            {formatNumber(unlockedFlower, { decimalPlaces: 4 })}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Shown when a player has no (or not enough) deposited FLOWER to withdraw and
 * has not reached the reputation required to withdraw FLOWER earned in-game.
 */
const LockedFlower: React.FC<{
  balance: Decimal;
  unlockedFlower: Decimal;
}> = ({ balance, unlockedFlower }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-2 p-1">
      <Label type="default" icon={withdrawIcon}>
        {t("withdraw.flower.locked")}
      </Label>
      <FlowerBreakdown balance={balance} unlockedFlower={unlockedFlower} />
      <p className="text-xs">{t("withdraw.flower.unlocked.explanation")}</p>
      {unlockedFlower.gt(0) && (
        <p className="text-xs">{t("withdraw.flower.minimumWithdrawal")}</p>
      )}
      <RequiredReputation
        reputation={Reputation.GrandHarvester}
        text={t("withdraw.flower.upgrade")}
      />
    </div>
  );
};

export const WithdrawFlower: React.FC<Props> = ({
  onWithdraw,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const autosaving = useSelector(gameService, _autosaving);
  const { chain } = useConnection();
  const address = wallet.getConnection() || "XXXX";

  const [amount, setAmount] = useState<Decimal>(new Decimal(0));
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { balance } = state;
  const now = useNow();

  const tax = getTax({
    amount: typeof amount !== "string" ? amount : new Decimal(0),
    game: state,
  });

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.GrandHarvester,
    now,
  });

  // FLOWER that was deposited and never spent is never locked in the game - it
  // can be withdrawn without the reputation requirement.
  const deposited = new Decimal(state.bank.unlockedFlower ?? 0);
  const unlockedFlower = setPrecision(
    deposited.greaterThan(balance) ? balance : deposited,
    4,
  );

  const available = hasAccess ? balance : unlockedFlower;

  if (!hasAccess && available.lessThan(MIN_FLOWER_WITHDRAW_AMOUNT)) {
    return <LockedFlower balance={balance} unlockedFlower={unlockedFlower} />;
  }

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  const disableWithdraw =
    amount.greaterThan(available) ||
    amount.lessThan(MIN_FLOWER_WITHDRAW_AMOUNT) ||
    !!withdrawDisabled;

  const withdraw = () => {
    if (disableWithdraw || autosaving || !chain) return;

    onWithdraw(toWei(amount.toString()), chain!.id);
  };

  return (
    <>
      <ModalOverlay
        show={showConfirmation}
        onBackdropClick={() => setShowConfirmation(false)}
      >
        <InnerPanel>
          <div className="p-1 mb-1">
            <div className="flex flex-col gap-1 mb-3">
              <Label type="default" icon={withdrawIcon}>
                {t("withdraw.flower.confirm")}
              </Label>
              <Label type="transparent">
                {t("withdraw.flower.chain", {
                  chain: chain?.name || "",
                })}
              </Label>
              <Label type="transparent">
                {t("withdraw.flower.amount", {
                  amount: formatNumber(amount, { decimalPlaces: 4 }),
                })}
              </Label>
              <Label type="transparent" className="text-nowrap">
                {t("withdraw.flower.recipient", {
                  address: shortAddress(address),
                })}
              </Label>
            </div>

            <Label type="danger">{t("withdraw.flower.cannotCancel")}</Label>
            <Label type="transparent">
              <span className="text-xxs">
                {t("withdraw.flower.transaction", {
                  chain: chain?.name || "",
                })}
              </span>
            </Label>
          </div>

          <div className="flex  gap-1">
            <Button onClick={() => setShowConfirmation(false)}>
              {t("back")}
            </Button>
            <Button
              disabled={disableWithdraw || autosaving || !chain}
              onClick={withdraw}
            >
              {t("confirm")}
            </Button>
          </div>
        </InnerPanel>
      </ModalOverlay>
      <div className="p-2 mb-2">
        <div className="flex flex-col items-stretch gap-2">
          {hasAccess ? (
            <p className="text-xs">
              {t("withdraw.sfl.available", {
                flower: formatNumber(balance, { decimalPlaces: 4 }),
              })}
            </p>
          ) : (
            <>
              <FlowerBreakdown
                balance={balance}
                unlockedFlower={unlockedFlower}
                exceeded={amount.greaterThan(available)}
              />
              <p className="text-xs">
                {t("withdraw.flower.unlocked.explanation")}
              </p>
            </>
          )}
          <p className="text-xs">{t("withdraw.flower.minimumWithdrawal")}</p>
        </div>

        <div>
          <div className="flex items-center mt-2 -ml-1">
            <NumberInput
              value={amount}
              maxDecimalPlaces={4}
              isOutOfRange={disableWithdraw}
              onValueChange={setAmount}
            />
            <Button
              onClick={() => setAmount(setPrecision(available.mul(0.5), 4))}
              className="ml-2 px-1 py-1 w-auto h-9"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setAmount(setPrecision(available, 4))}
              className="ml-2 px-1 py-1 w-auto h-9"
            >
              {t("max")}
            </Button>
          </div>

          <p className="text-xs flex items-center gap-2">
            {state.inventory["Liquidity Provider"] && (
              <img
                src={lightning}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            )}
            {`${tax} ${t("fee")} `}
            <a
              className="underline hover:text-blue-500"
              href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("read.more")}
            </a>
          </p>
          <p className="text-xs mt-2">{t("withdraw.taxFree")}</p>
        </div>

        <Label type="warning" className="my-4">
          {t("withdraw.receive", {
            sflReceived: formatNumber(amount.sub(tax), {
              decimalPlaces: 4,
            }),
          })}
        </Label>

        <div className="w-full my-3 border-t border-white" />
        <div className="flex items-center text-xs">
          <img
            src={SUNNYSIDE.icons.player}
            className="mr-3"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <div className="flex flex-col gap-1">
            <p>{t("withdraw.send.wallet")}</p>
            <WalletAddressLabel walletAddress={address} />
          </div>
        </div>

        <p className="text-xxs mt-3">{t("withdraw.flower.dailyLimit")}</p>

        {!hasAccess && balance.greaterThan(available) && (
          <div className="mt-2">
            <RequiredReputation
              reputation={Reputation.GrandHarvester}
              text={t("withdraw.flower.upgrade")}
            />
          </div>
        )}
      </div>

      <Button
        onClick={() => setShowConfirmation(true)}
        disabled={disableWithdraw || autosaving || withdrawDisabled}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
