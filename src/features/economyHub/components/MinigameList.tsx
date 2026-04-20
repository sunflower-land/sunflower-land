import React from "react";
import { useLocation, useNavigate } from "react-router";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import type { EconomyListRow } from "features/game/types/marketplace";

import { MinigameCard } from "./MinigameCard";

type Props = {
  economies: EconomyListRow[];
  isLoading: boolean;
};

/**
 * Right-hand column of the Economy Hub.
 *
 * A vertical list of minigame cards. Clicking a card navigates to the
 * per-minigame dashboard at `/economy/:slug`. When the user closes the
 * minigame and returns, the parent Economy Hub refetches hub data.
 */
export const MinigameList: React.FC<Props> = ({ economies, isLoading }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const openMinigame = (slug: string) => {
    navigate(`/economy/${slug}`, {
      state: { route: `${location.pathname}${location.search}` },
    });
  };

  return (
    <InnerPanel className="mb-2">
      <div className="flex items-center justify-between mb-2 flex-wrap">
        <Label type="default">{t("economyHub.minigames")}</Label>
      </div>

      {isLoading ? (
        <p className="text-xs p-1 text-brown-700">
          {t("economyHub.loadingMinigames")}
        </p>
      ) : economies.length === 0 ? (
        <p className="text-xs p-1 text-brown-700">
          {t("economyHub.noMinigames")}
        </p>
      ) : (
        <div className="flex flex-wrap -m-1">
          {economies.map((economy) => (
            <div key={economy.slug} className="w-1/4 p-1 flex">
              <MinigameCard
                image={economy.image}
                name={economy.label}
                description={economy.description}
                activePlayers={economy.playerCount}
                trophies={economy.trophiesCollected ?? 0}
                trophyGoal={economy.trophyTotal ?? 0}
                onClick={() => openMinigame(economy.slug)}
              />
            </div>
          ))}
        </div>
      )}
    </InnerPanel>
  );
};
