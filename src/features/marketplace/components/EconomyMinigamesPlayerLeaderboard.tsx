import React from "react";
import { useNavigate } from "react-router";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { EconomyMinigameRank } from "features/game/types/marketplace";
import { MINIGAME_TOKEN_IMAGE_FALLBACK } from "features/minigame/lib/minigameTokenIcons";
import { resolveMarketplaceMinigameItemImage } from "../lib/resolveMinigameMarketplaceImage";

export const EconomyMinigamesPlayerLeaderboard: React.FC<{
  ranks: EconomyMinigameRank[];
  panelClassName?: string;
}> = ({ ranks, panelClassName }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const panelBase = classNames(
    "flex flex-col overflow-hidden min-h-0",
    panelClassName ?? "h-full",
  );

  if (ranks.length === 0) {
    return (
      <InnerPanel className={classNames(panelBase, "justify-center p-4")}>
        <p className="text-sm text-center">
          {t("marketplace.economies.minigamesPlayableEmpty")}
        </p>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className={panelBase}>
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto scrollable">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brown-400 bg-brown-300">
              <th className="text-left p-2 w-10">{"#"}</th>
              <th className="p-2 w-10" aria-hidden />
              <th className="text-left p-2">
                {t("marketplace.minigames.game")}
              </th>
              <th className="text-right p-2">
                {t("marketplace.economies.players")}
              </th>
              <th className="text-right p-2 w-[88px] sm:w-[100px]">
                {t("marketplace.economies.playNow")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((row, index) => {
              const rank = index + 1;
              const dashboardPath = `/economy/${encodeURIComponent(row.economy)}`;

              return (
                <tr
                  key={row.economy}
                  className="border-b border-brown-300 hover:bg-brown-200/60"
                >
                  <td className="p-2 text-brown-600">{rank}</td>
                  <td className="p-1 w-10">
                    <img
                      src={resolveMarketplaceMinigameItemImage(
                        row.image,
                        "token",
                      )}
                      alt=""
                      className="h-6 w-6 object-contain mx-auto"
                      style={{ imageRendering: "pixelated" }}
                      onError={(e) => {
                        e.currentTarget.src = MINIGAME_TOKEN_IMAGE_FALLBACK;
                      }}
                    />
                  </td>
                  <td className="p-2 font-medium">{row.economyLabel}</td>
                  <td className="p-2 text-right tabular-nums">
                    {row.playerCount.toLocaleString()}
                  </td>
                  <td className="p-1 align-middle text-right">
                    <Button
                      className="h-7 rounded-sm px-2 py-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(dashboardPath);
                      }}
                    >
                      <span className="text-xxs whitespace-nowrap">
                        {t("marketplace.economies.playNow")}
                      </span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
