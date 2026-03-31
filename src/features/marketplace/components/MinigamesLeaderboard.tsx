import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Tradeable } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { marketplaceMinigameItemPath } from "../lib/minigameTradePath";
import { getMinigameTokenImage } from "features/minigame/lib/minigameTokenIcons";
import { resolveMarketplaceMinigameItemImage } from "../lib/resolveMinigameMarketplaceImage";

const _sflUsd = (state: MachineState) => state.context.prices.sfl?.usd ?? 0;

type Row = Tradeable & { collection: "minigames" };

export const MinigamesLeaderboard: React.FC<{
  items: Row[];
  onNavigated?: () => void;
}> = ({ items, onNavigated }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { gameService } = useContext(Context);
  const sflUsd = useSelector(gameService, _sflUsd);

  const isWorldRoute = location.pathname.includes("/world");
  const base = `${isWorldRoute ? "/world" : ""}/marketplace`;

  const sorted = [...items].sort((a, b) => {
    if (a.floor === b.floor) return a.id - b.id;
    if (a.floor === 0) return 1;
    if (b.floor === 0) return -1;
    return a.floor - b.floor;
  });

  const backRoute =
    typeof location.state?.route === "string"
      ? location.state.route
      : `${location.pathname}${location.search}`;

  if (sorted.length === 0) {
    return (
      <InnerPanel className="h-full flex items-center justify-center p-4">
        <p className="text-sm text-center">{t("marketplace.minigames.empty")}</p>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="h-full flex flex-col overflow-hidden">
      <div className="overflow-x-auto scrollable flex-1">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brown-400 bg-brown-300">
              <th className="text-left p-2 w-10">#</th>
              <th className="text-left p-2">{t("marketplace.minigames.game")}</th>
              <th className="text-left p-2">{t("marketplace.minigames.currency")}</th>
              <th className="text-right p-2">{t("marketplace.minigames.flower")}</th>
              <th className="text-right p-2">{t("marketplace.minigames.usd")}</th>
              <th className="w-8 p-1" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => {
              const rank = index + 1;
              const usd = sflUsd > 0 ? item.floor * sflUsd : 0;

              return (
                <tr
                  key={`${item.minigameSlug}-${item.id}`}
                  className="border-b border-brown-300 hover:bg-brown-200 cursor-pointer"
                  onClick={() => {
                    navigate(
                      marketplaceMinigameItemPath(
                        base,
                        item.minigameSlug,
                        item.id,
                      ),
                      {
                        state: { route: backRoute },
                      },
                    );
                    onNavigated?.();
                  }}
                >
                  <td className="p-2 text-brown-600">{rank}</td>
                  <td className="p-1 w-10">
                    <img
                      src={resolveMarketplaceMinigameItemImage(
                        item.image,
                        item.currencyName,
                      )}
                      alt=""
                      className="h-6 w-6 object-contain mx-auto"
                      style={{ imageRendering: "pixelated" }}
                      onError={(e) => {
                        e.currentTarget.src = getMinigameTokenImage(
                          item.currencyName,
                        );
                      }}
                    />
                  </td>
                  <td className="p-2 font-medium">{item.minigameLabel}</td>
                  <td className="p-2">{item.currencyName}</td>
                  <td className="p-2 text-right tabular-nums">
                    {new Decimal(item.floor).toFixed(2)}
                  </td>
                  <td className="p-2 text-right tabular-nums text-brown-700">
                    {usd > 0 ? `$${new Decimal(usd).toFixed(2)}` : "—"}
                  </td>
                  <td className="p-1">
                    <img
                      src={SUNNYSIDE.icons.chevron_right}
                      className="h-4 w-4 mx-auto opacity-70"
                      alt=""
                    />
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
