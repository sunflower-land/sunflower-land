import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
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
import { MachineState } from "features/game/lib/gameMachine";
import { NumberInput } from "components/ui/NumberInput";
import { Label } from "components/ui/Label";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasFeatureAccess } from "lib/flags";

function getWithdrawalThreshold(createdAt: number = Date.now()) {
  // Set constants
  const currentDate = new Date(createdAt);
  const initialThreshold = 0.25;

  if (currentDate < new Date("2025-05-13T00:00:00.000Z")) {
    return initialThreshold;
  }

  const startDate = new Date("2025-05-09T00:00:00.000Z");
  const endDate = new Date("2025-06-20T00:00:00.000Z");
  const finalThreshold = 1;
  const dynamicThresholdRange = finalThreshold - initialThreshold; // 1 - 0.25 = 0.75

  // Calculate the difference in time between the current date and the start date
  const timeDiff = currentDate.getTime() - startDate.getTime();
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Calculate the total time between the start and end dates
  const totalTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(totalTime / (1000 * 60 * 60 * 24));

  // Calculate the progress as a fraction of the total days
  const progress = dayDiff / totalDays;

  // Calculate the additional threshold based on the progress
  const additionalThreshold = progress * dynamicThresholdRange;

  // Calculate the final threshold by adding the initial threshold and the additional threshold
  const threshold = Math.min(
    1,
    Number(new Decimal(initialThreshold).add(additionalThreshold)),
  );

  return threshold;
}

interface Props {
  onWithdraw: (sfl: string) => void;
}

const _state = (state: MachineState) => state.context.state;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const WithdrawFlower: React.FC<Props> = ({ onWithdraw }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const autosaving = useSelector(gameService, _autosaving);

  const [amount, setAmount] = useState<Decimal>(new Decimal(0));
  const [tax, setTax] = useState(0);

  const {
    balance: flowerBalance,
    bank: { withdrawnAmount },
  } = state;
  const totalCurrentBalance = flowerBalance.add(withdrawnAmount);
  const threshold = getWithdrawalThreshold();
  const thresholdAmount = totalCurrentBalance.mul(threshold);

  const balance = new Decimal(
    Math.max(0, thresholdAmount.sub(withdrawnAmount).toNumber()),
  );

  useEffect(() => {
    const _tax = getTax({
      amount: typeof amount !== "string" ? amount : new Decimal(0),
      game: state,
    });

    setTax(_tax);
  }, [amount]);

  const withdraw = () => {
    if (amount > new Decimal(0)) {
      onWithdraw(toWei(amount.toString()));
    } else {
      setAmount(new Decimal(0));
    }
  };

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Grower,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Grower} />;
  }

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  const disableWithdraw = amount.greaterThan(balance) || amount.lessThan(0);

  return (
    <>
      <div className="p-2 mb-2">
        <div className="flex flex-col items-start gap-2">
          {hasFeatureAccess(state, "WITHDRAWAL_THRESHOLD") && (
            <Label type="warning">{t("withdraw.flower.limited")}</Label>
          )}
          <p className="text-xs">
            {t("withdraw.sfl.available", {
              flower: formatNumber(balance, { decimalPlaces: 4 }),
            })}
          </p>
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
              onClick={() => setAmount(setPrecision(balance.mul(0.5), 4))}
              className="ml-2 px-1 py-1 w-auto h-9"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setAmount(setPrecision(balance, 4))}
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
              href="https://docs.sunflower-land.com/fundamentals/withdrawing"
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
            <WalletAddressLabel walletAddress={wallet.getAccount() || "XXXX"} />
          </div>
        </div>
      </div>

      <Button onClick={withdraw} disabled={disableWithdraw || autosaving}>
        {t("withdraw")}
      </Button>
    </>
  );
};
