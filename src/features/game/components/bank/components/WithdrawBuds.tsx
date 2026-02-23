import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";

import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { InfoPopover } from "features/island/common/InfoPopover";
import { secondsToString } from "lib/utils/time";
import { BoostName } from "features/game/types/game";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

interface Props {
  onWithdraw: (ids: number[]) => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawBuds: React.FC<Props> = ({
  onWithdraw,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const buds = state.buds ?? {};

  const [unselected, setUnselected] = useState<number[]>(
    getKeys(buds)
      .filter((budId) => !buds[budId].coordinates)
      .map(Number),
  );
  const [selected, setSelected] = useState<number[]>([]);

  const [showInfo, setShowInfo] = useState("");

  const onAdd = (budId: number) => {
    setUnselected((prev) => prev.filter((bud) => bud !== budId));
    setSelected((prev) => [...prev, budId]);
  };

  const onRemove = (budId: number) => {
    setUnselected((prev) => [...prev, budId]);
    setSelected((prev) => prev.filter((bud) => bud !== budId));
  };

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const getBudName = (budId: number) => {
    return `Bud #${budId}`;
  };

  const sortWithdrawableItems = (a: number, b: number) => {
    const itemA = getBudName(a) as BoostName;
    const itemB = getBudName(b) as BoostName;
    const aCooldownMs = getRestrictionStatus(itemA).cooldownTimeLeft;
    const bCooldownMs = getRestrictionStatus(itemB).cooldownTimeLeft;

    const aIsOnCooldown = aCooldownMs > 0;
    const bIsOnCooldown = bCooldownMs > 0;

    // 1. Buds on cooldown come first
    if (aIsOnCooldown && bIsOnCooldown) {
      // 2. Among those, sort by most cooldown time left
      return bCooldownMs - aCooldownMs;
    }
    if (aIsOnCooldown !== bIsOnCooldown) {
      return aIsOnCooldown ? -1 : 1;
    }
    // 3. Otherwise, sort by bud IDs
    return a - b;
  };

  return (
    <>
      <div className="p-2 mb-2">
        <Label type="warning" className="mb-2">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </Label>
        <Label type="default" className="mb-2">
          {t("withdraw.buds")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {unselected
            .slice()
            .sort((a, b) => sortWithdrawableItems(a, b))
            .map((budId) => {
              const budName = getBudName(budId);
              const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(
                budName as BoostName,
              );
              const RestrictionCooldown = cooldownTimeLeft / 1000;

              const handleBoxClick = () => {
                if (isRestricted) {
                  setShowInfo((prev) => (prev === budName ? "" : budName));
                }
              };

              return (
                <div
                  key={budName}
                  onClick={handleBoxClick}
                  className="flex relative"
                >
                  <InfoPopover
                    className="absolute top-14 text-xxs sm:text-xs"
                    showPopover={showInfo === `Bud #${budId}`}
                  >
                    {t("withdraw.boostedItem.timeLeft", {
                      time: secondsToString(RestrictionCooldown, {
                        length: "medium",
                        isShortFormat: true,
                        removeTrailingZeros: true,
                      }),
                    })}
                  </InfoPopover>

                  <Box
                    key={`bud-${budId}`}
                    onClick={() => onAdd(budId)}
                    image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                    iconClassName="scale-[1.8] origin-bottom absolute"
                    disabled={isRestricted}
                    secondaryImage={
                      isRestricted ? SUNNYSIDE.icons.lock : undefined
                    }
                  />
                </div>
              );
            })}
          {/* Pad with empty boxes */}
          {unselected.length < 4 &&
            new Array(4 - unselected.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selected.map((budId) => (
              <Box
                key={`bud-${budId}`}
                onClick={() => onRemove(budId)}
                image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                iconClassName="scale-[1.8] origin-bottom absolute"
              />
            ))}
            {/* Pad with empty boxes */}
            {selected.length < 4 &&
              new Array(4 - selected.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="w-full my-3 border-t border-white" />
        <div className="flex items-center mb-2 text-xs">
          <img
            src={SUNNYSIDE.icons.player}
            className="mr-3"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <div className="flex flex-col gap-1">
            <p>{t("withdraw.send.wallet")}</p>
            <WalletAddressLabel
              walletAddress={wallet.getConnection() || "XXXX"}
            />
          </div>
        </div>

        <p className="text-xs">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </p>
      </div>

      <Button
        onClick={() => onWithdraw(selected)}
        disabled={selected.length <= 0 || withdrawDisabled}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
