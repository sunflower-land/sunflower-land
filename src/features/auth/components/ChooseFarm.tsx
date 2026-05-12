import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";
import { ButtonPanel } from "components/ui/Panel";
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
import sflIcon from "assets/icons/sfl.webp";

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
  // Snapshot "now" once at mount. The picker is shown for a few seconds
  // and per-row "last played" labels do not need to tick. Avoids calling
  // `Date.now()` during render (project rule via React Compiler).
  const [now] = useState(() => Date.now());

  const candidates = authState.context.disambiguation?.candidates ?? [];

  if (authState.matches("loadingCandidates")) {
    return <Loading />;
  }

  if (authState.matches("resolvingFarm")) {
    return <Loading text={t("auth.chooseFarm.loggingIn")} />;
  }

  return (
    <div className="p-1">
      <Label type="default" className="mb-2">
        {t("auth.chooseFarm.title")}
      </Label>
      <p className="text-xs mb-2">{t("auth.chooseFarm.description")}</p>
      {candidates.length === 0 && (
        <p className="text-xs">{t("auth.chooseFarm.empty")}</p>
      )}
      <div className="overflow-y-auto max-h-[60vh] scrollable">
        {candidates.map((c) => (
          <CandidateRow
            key={c.farmId}
            candidate={c}
            now={now}
            onSelect={() => send({ type: "FARM_SELECTED", farmId: c.farmId })}
          />
        ))}
      </div>
    </div>
  );
};

const CandidateRow: React.FC<{
  candidate: LoginCandidate;
  now: number;
  onSelect: () => void;
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

  return (
    <ButtonPanel
      className="flex flex-row items-center gap-2 mx-1 my-1 text-xs"
      onClick={onSelect}
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
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <div className="flex items-center gap-1">
          <span>{t("level.number", { level })}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src={sflIcon} className="w-3 h-3" />
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
