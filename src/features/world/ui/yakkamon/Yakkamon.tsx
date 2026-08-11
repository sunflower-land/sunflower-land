import React, { useContext, useState } from "react";
import classNames from "classnames";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CopyField } from "components/ui/CopyField";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useGame } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { getYakkamonCode } from "features/game/actions/getYakkamonCode";
import { getTotalBumpkinLevel } from "features/game/lib/level";
import { hasFeatureAccess } from "lib/flags";
import { useNow } from "lib/utils/hooks/useNow";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/icons/lock.png";

import { YAKKAMON_TIERS, canClaimCode, getUnlockAt } from "./tiers";

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

/** Codes are issued once, so remember it locally to avoid a round trip on reopen. */
const codeStorageKey = (farmId: number) => `yakkamon.code.${farmId}`;

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

interface Props {
  onClose: () => void;
}

export const Yakkamon: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameState, gameService } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const token = useSelector(authService, _token);

  const farmId = gameService.getSnapshot().context.farmId;
  const state = gameState.context.state;

  const [code, setCode] = useState<string | null>(
    () => localStorage.getItem(codeStorageKey(farmId)) ?? null,
  );
  const [showTiers, setShowTiers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const now = useNow({ live: true, intervalMs: 60 * 1000 });

  const level = getTotalBumpkinLevel({
    experience: state.bumpkin?.experience ?? 0,
    ascensionLevel: state.island.ascensionLevel ?? 0,
  });

  const isBetaTester = hasFeatureAccess(state, "YAKKAMON_BETA_ACCESS");
  const canClaim = canClaimCode({ level, now, isBetaTester });
  const unlockAt = getUnlockAt(level);

  const claim = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const { code: claimedCode } = await getYakkamonCode({ token });

      if (!claimedCode) {
        setError(t("yakkamon.notClaimable"));
        return;
      }

      localStorage.setItem(codeStorageKey(farmId), claimedCode);
      setCode(claimedCode);
    } catch {
      setError(t("yakkamon.error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (code) {
    return (
      <CloseButtonPanel onClose={onClose} title={t("yakkamon.title")}>
        <div className="p-1">
          <Label type="success" className="mb-2">
            {t("yakkamon.yourCode")}
          </Label>
          <p className="text-xs mb-2">{t("yakkamon.codeDescription")}</p>
          <CopyField text={code} copyFieldMessage={t("yakkamon.copyCode")} />
        </div>
      </CloseButtonPanel>
    );
  }

  if (!showTiers) {
    return (
      <CloseButtonPanel onClose={onClose} title={t("yakkamon.title")}>
        <div className="p-1">
          <p className="text-xs mb-2">{t("yakkamon.intro.description")}</p>
          <NoticeboardItems
            items={[
              {
                text: t("yakkamon.intro.creators"),
                icon: SUNNYSIDE.icons.heart,
              },
              {
                text: t("yakkamon.intro.collect"),
                icon: SUNNYSIDE.icons.sword,
              },
              {
                text: t("yakkamon.intro.preRegister"),
                icon: SUNNYSIDE.icons.stopwatch,
              },
            ]}
          />
        </div>
        <Button onClick={() => setShowTiers(true)}>
          {t("yakkamon.getCode")}
        </Button>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      onBack={() => setShowTiers(false)}
      title={t("yakkamon.title")}
    >
      <div className="p-1">
        <Label type="default" className="mb-1">
          {t("yakkamon.tieredAccess")}
        </Label>
        <p className="text-xs mb-2">{t("yakkamon.tieredAccessDescription")}</p>

        <InnerPanel className="mb-2">
          <table className="w-full text-xs border-collapse">
            <tbody>
              {YAKKAMON_TIERS.map((tier) => {
                const isOpen = tier.unlocksAt <= now;
                const isPlayerTier = unlockAt === tier.unlocksAt;

                return (
                  <tr
                    key={tier.level}
                    className={classNames("border-b border-brown-300", {
                      "bg-brown-200": isPlayerTier,
                    })}
                  >
                    <td className="p-1 w-6">
                      <img
                        src={isOpen ? SUNNYSIDE.icons.confirm : lockIcon}
                        alt=""
                        className="h-4 mx-auto"
                      />
                    </td>
                    <td className="p-1">
                      {t("yakkamon.tierLevel", { level: tier.level })}
                    </td>
                    <td className="p-1 text-right">
                      {formatDate(tier.unlocksAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </InnerPanel>

        <div className="flex justify-between flex-wrap gap-1">
          <Label type="info">{t("yakkamon.yourLevel", { level })}</Label>
          {isBetaTester && (
            <Label type="warning">{t("yakkamon.betaAccess")}</Label>
          )}
        </div>

        {!canClaim && (
          <p className="text-xs mt-2">
            {unlockAt === null
              ? t("yakkamon.reachLevel", {
                  level: YAKKAMON_TIERS[YAKKAMON_TIERS.length - 1].level,
                })
              : t("yakkamon.unlocksOn", { date: formatDate(unlockAt) })}
          </p>
        )}

        {error && <p className="text-xs mt-2 text-error">{error}</p>}
      </div>

      <Button disabled={!canClaim || isLoading} onClick={claim}>
        {isLoading ? t("yakkamon.claiming") : t("yakkamon.claimCode")}
      </Button>
    </CloseButtonPanel>
  );
};
