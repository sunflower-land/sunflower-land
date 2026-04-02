import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import classNames from "classnames";
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
import { fallbackDisplayNameForMinigameCurrencyKey } from "../lib/minigameMarketplaceCopy";

const _sflUsd = (state: MachineState) => state.context.prices.sfl?.usd ?? 0;

type Row = Tradeable & { collection: "economies" };

export const MinigamesLeaderboard: React.FC<{
  items: Row[];
  onNavigated?: () => void;
  /** When set, this economy + item row is visually highlighted (e.g. on detail page). */
  highlightEconomy?: string;
  highlightItemId?: number;
  /** Merges into the outer panel; default fills parent height. */
  panelClassName?: string;
  /** Optional heading above the table (e.g. on detail page). */
  title?: React.ReactNode;
}> = ({
  items,
  onNavigated,
  highlightEconomy,
  highlightItemId,
  panelClassName,
  title,
}) => {
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

  const panelBase = classNames(
    "flex flex-col overflow-hidden min-h-0",
    panelClassName ?? "h-full",
  );

  if (sorted.length === 0) {
    return (
      <InnerPanel className={classNames(panelBase, "justify-center p-4")}>
        <p className="text-sm text-center">
          {t("marketplace.minigames.empty")}
        </p>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className={panelBase}>
      {title ? (
        <div className="shrink-0 border-b border-brown-400 bg-brown-200 px-2 py-1.5 text-xs font-medium text-brown-800">
          {title}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto scrollable">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brown-400 bg-brown-300">
              <th className="text-left p-2 w-10">{"#"}</th>
              <th className="p-2 w-10" aria-hidden />
              <th className="text-left p-2">
                {t("marketplace.minigames.game")}
              </th>
              <th className="text-left p-2">
                {t("marketplace.minigames.currency")}
              </th>
              <th className="text-right p-2">
                {t("marketplace.minigames.flower")}
              </th>
              <th className="text-right p-2">
                {t("marketplace.minigames.usd")}
              </th>
              <th className="w-8 p-1" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => {
              const rank = index + 1;
              const usd = sflUsd > 0 ? item.floor * sflUsd : 0;
              const currencyLabel =
                item.currencyDisplayName?.trim() ||
                fallbackDisplayNameForMinigameCurrencyKey(item.currencyName);
              const isCurrent =
                highlightEconomy != null &&
                highlightItemId != null &&
                item.economy === highlightEconomy &&
                item.id === highlightItemId;

              return (
                <tr
                  key={`${item.economy}-${item.id}`}
                  className={classNames(
                    "border-b border-brown-300 hover:bg-brown-200 cursor-pointer",
                    isCurrent && "bg-amber-200/80",
                  )}
                  onClick={() => {
                    if (isCurrent) return;
                    navigate(
                      marketplaceMinigameItemPath(base, item.economy, item.id),
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
                  <td className="p-2 font-medium">{item.economyLabel}</td>
                  <td className="p-2">{currencyLabel}</td>
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
