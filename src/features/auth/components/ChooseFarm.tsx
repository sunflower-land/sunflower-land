import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { ButtonPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Loading } from ".";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getBumpkinLevel } from "features/game/lib/level";
import { IslandType } from "features/game/types/game";
import { LoginCandidate } from "features/auth/actions/login";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import basicIsland from "assets/icons/islands/basic.webp";
import springIsland from "assets/icons/islands/spring.webp";
import desertIsland from "assets/icons/islands/desert.webp";
import volcanoIsland from "assets/icons/islands/volcano.webp";
import flowerIcon from "assets/icons/flower_token.webp";

const ISLAND_ICON: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

const dayMs = 24 * 60 * 60 * 1000;

const formatBalance = (raw?: string) => {
  if (!raw) return "0";
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  if (n >= 1000) return `${Math.floor(n / 100) / 10}k`;
  return n.toFixed(2).replace(/\.?0+$/, "");
};

export const ChooseFarm: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);
  const { t } = useAppTranslation();
  // `shownAt` is captured at machine-transition time (see authMachine
  // `assignDisambiguation*` actions) so the picker stays pure across
  // re-renders and reads a stable timestamp from context.
  const now = authState.context.disambiguation?.shownAt ?? 0;

  // Sort defensively — the BE returns eligible-first + recent-first
  // already, but a local sort makes the UI ordering a frontend guarantee.
  const candidates = [
    ...(authState.context.disambiguation?.candidates ?? []),
  ].sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0);
  });

  // Click on a row stages the choice; the user confirms on the next
  // screen before we dispatch FARM_SELECTED (which is destructive —
  // detaches the identity from the rejected farms with no FE undo).
  const [pending, setPending] = useState<LoginCandidate | null>(null);

  const pickerError = authState.context.disambiguation?.pickerError;

  // If a mid-flight ban fired, drop the staged pick: the row the user
  // confirmed against is now ineligible. Showing them back at the list
  // (with the "no longer available" warning and the now-banned row
  // greyed out) is the recovery path.
  const effectivePending = pickerError ? null : pending;

  // Wrap setPending so staging a new pick also clears the
  // "farm unavailable" warning from the previous misclick.
  const stagePending = (c: LoginCandidate) => {
    if (!c.eligible) return;
    if (pickerError) send({ type: "CLEAR_PICKER_ERROR" });
    setPending(c);
  };

  if (authState.matches("loadingCandidates")) {
    return <Loading />;
  }

  if (authState.matches("resolvingFarm")) {
    return <Loading text={t("auth.chooseFarm.loggingIn")} />;
  }

  if (effectivePending) {
    return (
      <>
        <div className="p-1">
          <Label type="default" className="mb-2">
            {t("auth.chooseFarm.confirm.title")}
          </Label>
        </div>
        <CandidateRow candidate={effectivePending} now={now} />
        <Label type="danger" className="text-xs px-2 mt-1 mb-2">
          {t("auth.chooseFarm.confirm.warning")}
        </Label>
        <div className="flex gap-1 px-1">
          <Button onClick={() => setPending(null)}>
            {t("auth.chooseFarm.confirm.back")}
          </Button>
          <Button
            onClick={() =>
              send({
                type: "FARM_SELECTED",
                farmId: effectivePending.farmId,
              })
            }
          >
            {t("auth.chooseFarm.confirm.proceed")}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-1">
        <Label type="default" className="mb-2">
          {t("auth.chooseFarm.title")}
        </Label>
        <p className="text-xs mb-1">{t("auth.chooseFarm.description")}</p>
        {pickerError === "FARM_NO_LONGER_ELIGIBLE" && (
          <Label type="danger" className="mb-1">
            {t("auth.chooseFarm.farmUnavailable")}
          </Label>
        )}
        {candidates.length === 0 && (
          <p className="text-xs">{t("auth.chooseFarm.empty")}</p>
        )}
      </div>
      <div className="overflow-y-auto max-h-[60vh] scrollable">
        {candidates.map((c) => (
          <CandidateRow
            key={c.farmId}
            candidate={c}
            now={now}
            onSelect={() => stagePending(c)}
          />
        ))}
      </div>
    </>
  );
};

const CandidateRow: React.FC<{
  candidate: LoginCandidate;
  now: number;
  // When omitted, the ButtonPanel renders as a static preview — used
  // by the confirmation screen to reuse the same visual.
  onSelect?: () => void;
}> = ({ candidate, now, onSelect }) => {
  const { t } = useAppTranslation();
  const islandIcon = candidate.islandType
    ? ISLAND_ICON[candidate.islandType as IslandType]
    : undefined;
  const level = getBumpkinLevel(candidate.experience ?? 0);

  const ts = candidate.lastActivityAt;
  const diff = ts ? now - ts : Number.POSITIVE_INFINITY;
  const lastPlayed = !ts
    ? t("auth.chooseFarm.neverPlayed")
    : diff < dayMs
      ? t("auth.chooseFarm.today")
      : t("auth.chooseFarm.daysAgo", { days: Math.floor(diff / dayMs) });

  // Ineligible rows are visible but disabled: they still need to live
  // in the candidate list so the resolve step can detach their
  // identity, but the user can't pick one.
  const disabled = !candidate.eligible;
  const reasonKey =
    candidate.ineligibleReason === "banned"
      ? "auth.chooseFarm.banned"
      : candidate.ineligibleReason === "pendingTransfer"
        ? "auth.chooseFarm.pendingTransfer"
        : undefined;

  return (
    <ButtonPanel
      className={`flex flex-row items-center gap-2 mx-1 my-1 text-xs ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={disabled ? undefined : onSelect}
    >
      {candidate.equipped && (
        <NPCIcon parts={candidate.equipped as unknown as BumpkinParts} />
      )}
      <div className="flex flex-col flex-grow ml-1 min-w-0">
        <div className="truncate font-secondary">
          {candidate.username ??
            t("auth.chooseFarm.farmNumber", { id: candidate.farmId })}
        </div>
        <div className="text-xxs opacity-80">{`#${candidate.farmId}`}</div>
        <div className="text-xxs opacity-80">{lastPlayed}</div>
        {reasonKey && (
          <Label type="danger" className="mt-1">
            {t(reasonKey)}
          </Label>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1">
          <span>{t("level.number", { level })}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={flowerIcon} className="w-3 h-3" alt="FLOWER Token" />
          <span>{formatBalance(candidate.balance)}</span>
        </div>
        {islandIcon && (
          <img
            src={islandIcon}
            className="w-4 h-4"
            alt={candidate.islandType}
          />
        )}
      </div>
    </ButtonPanel>
  );
};
