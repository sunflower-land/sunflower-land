import React, { useContext } from "react";
import { NetworkOption } from "./DepositFlower";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useTranslation } from "react-i18next";
import { MachineState } from "features/game/lib/gameMachine";
import { shortAddress } from "lib/utils/shortAddress";
import { Button } from "components/ui/Button";
import flowerIcon from "assets/icons/flower_token.webp";

type ProcessedDeposit = {
  from: string | null;
  value: string;
  transactionHash: string;
  createdAt: number;
  chainId: number;
};

const _pending = (state: MachineState) => state.matches("depositingFlower");
const _deposits = (state: MachineState): ProcessedDeposit[] =>
  state.context.data["depositingFlower"]?.deposits ?? [];

export const DepositHistory: React.FC<{
  selectedNetwork: NetworkOption;
  refreshDeposits: () => void;
  firstLoadComplete: boolean;
}> = ({ selectedNetwork, firstLoadComplete, refreshDeposits }) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();

  const deposits = useSelector(gameService, _deposits);
  const pending = useSelector(gameService, _pending);

  const depositsForChain = deposits.filter(
    (deposit) => deposit.chainId === selectedNetwork.chainId,
  );

  return (
    <>
      {/* Deposits history */}
      {selectedNetwork.value && (
        <div className="flex flex-col mt-2">
          <div className="h-[120px] scrollable overflow-y-auto">
            <div className="text-sm pb-2 border-b border-white -px-2">
              <span className="text-sm ml-1">
                {t("deposit.flower.processedDeposits")}
              </span>
            </div>
            {firstLoadComplete && depositsForChain.length === 0 && (
              <div className="flex items-center gap-1 border-b border-white -px-2 py-1.5">
                <span className="text-xxs ml-1">
                  {pending
                    ? t("deposit.flower.refreshing")
                    : t("deposit.flower.noDeposits")}
                </span>
              </div>
            )}
            {depositsForChain.map((deposit) => (
              <div
                key={deposit.transactionHash}
                className="flex items-center gap-1 border-b border-white -px-2 py-1.5"
              >
                <div>
                  <img
                    src={selectedNetwork.icon}
                    alt="chain logo"
                    className="w-6"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xxs">
                    {new Date(deposit.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xxs">
                    {shortAddress(deposit.from ?? "")}
                  </span>
                </div>
                <div className="flex gap-1 mr-2">
                  <span className="text-xxs">{deposit.value}</span>
                  <img src={flowerIcon} alt="flower icon" className="w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        disabled={pending || !selectedNetwork}
        className="w-full text-center mt-2"
        onClick={refreshDeposits}
      >
        {pending
          ? t("deposit.flower.refreshing")
          : t("deposit.flower.refreshDeposit")}
      </Button>
    </>
  );
};
