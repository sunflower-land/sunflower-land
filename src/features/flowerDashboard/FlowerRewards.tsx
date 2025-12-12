import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import useSWR from "swr";
import { Loading } from "features/auth/components/Loading";
import { getPlayerLiquidity } from "./actions/getPlayerLiquidity";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { useGame } from "features/game/GameProvider";
import { Panel } from "components/ui/Panel";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string | undefined;
const _farmId = (state: AuthMachineState) => state.context.user.token?.farmId;
export const FlowerRewards: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const token = useSelector(authService, _token);
  const farmId = useSelector(authService, _farmId);
  const address = gameState.context.linkedWallet;
  const { t } = useAppTranslation();

  const [registering, setRegistering] = useState(false);
  const [status, setStatus] = useState<
    | {
        type: "error" | "success";
        message: string;
      }
    | undefined
  >();

  const shouldFetchLiquidity = !!address;

  const {
    data: liquidity,
    isLoading,
    error,
    mutate,
  } = useSWR(
    shouldFetchLiquidity ? ["player-liquidity", address, token] : null,
    () => getPlayerLiquidity({ farmId: farmId as number, token }),
  );

  const amount = Number(liquidity?.amount ?? 0);
  const isRegistered = amount > 0;
  const canRegister = Boolean(farmId && token && address);

  const handleRegister = async () => {
    if (!canRegister || registering) {
      return;
    }

    try {
      setRegistering(true);
      setStatus(undefined);

      await postEffect({
        farmId: farmId as number,
        token: token as string,
        transactionId: randomID(),
        effect: {
          type: "liquidity.registered",
        },
      });

      setStatus({
        type: "success",
        message: t("success"),
      });

      await mutate();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : t("transaction.somethingWentWrong"),
      });
    } finally {
      setRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

  if (isRegistered || status?.type === "success") {
    return (
      <Panel>
        <Label type="success" className="mb-1">
          {" "}
          {t("success")}
        </Label>
        <p className="text-xs mx-1 mb-2">{t("flowerRewards.thanks")}</p>
        <p className="text-xs mx-1 mb-2">{t("flowerRewards.dailyReview")}</p>

        {/* <p className="text-xxs italic mb-2 mx-1">{`Last updated: ${new Date(liquidity?.lastUpdatedAt ?? 0).toLocaleString()}`}</p> */}
        <Button className="w-full" onClick={onClose}>
          {t("close")}
        </Button>
      </Panel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="">
        <Label type="default" className="mb-1">
          {t("liquidity")}
        </Label>

        <p className="text-xs mx-1 mb-2">
          {t("flowerRewards.participationDescription")}
        </p>
        <p className="text-xs mx-1 mb-2">
          {t("flowerRewards.howToParticipate")}{" "}
          <a
            href="https://app.uniswap.org/positions/create/v3?currencyA=0x3e12b9d6a4d12cd9b4a6d613872d0eb32f68b380&currencyB=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&chain=base&fee={%22feeAmount%22:3000,%22tickSpacing%22:60,%22isDynamic%22:false}&hook=undefined&priceRangeState={%22priceInverted%22:false,%22fullRange%22:true,%22minPrice%22:%22%22,%22maxPrice%22:%22%22,%22initialPrice%22:%22%22,%22inputMode%22:%22price%22}&depositState={%22exactField%22:%22TOKEN1%22,%22exactAmounts%22:{%22TOKEN1%22:%220.05%22}}&step=1"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t("flowerRewards.uniswap")}
          </a>
        </p>
        <p className="text-xs mx-1 italic mb-2">
          {t("flowerRewards.uniswapDisclaimer")}
        </p>
        {!address && <p className="text-xxs">{t("wishingWell.info.two")}</p>}
        {address && (
          <>
            {isLoading && (
              <div className="py-2">
                <Loading />
              </div>
            )}
            <>
              <Button
                className="w-full"
                disabled={!canRegister || registering}
                onClick={handleRegister}
              >
                {registering ? t("loading") : t("add.liquidity")}
              </Button>

              {error && (
                <Label type="danger" className="mt-1">
                  {error.message}
                </Label>
              )}
              {status?.type === "error" && (
                <Label type="danger" className="mt-1">
                  {status.message}
                </Label>
              )}
            </>
          </>
        )}
      </div>
    </CloseButtonPanel>
  );
};
