import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";
import { selectGameState } from "features/game/lib/gameMachine";
import { isTradeResource } from "features/game/actions/tradeLimits";
import type { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";

import type { TradeableDisplay } from "../lib/tradeables";

import vipIcon from "assets/icons/vip.webp";

/**
 * Whether buying this item as a non-VIP starts the 90-day withdrawal
 * cooldown. It applies to everything that can be withdrawn as an SFT -
 * collectibles, wearables, buds and pets - but not to bulk resources or
 * minigame currencies.
 */
export const hasMarketplaceWithdrawCooldown = (
  display: Pick<TradeableDisplay, "name" | "type">,
): boolean => {
  if (display.type === "economies") return false;
  // A collectible's display name is its inventory name.
  if (
    display.type === "collectibles" &&
    isTradeResource(display.name as InventoryItemName)
  ) {
    return false;
  }

  return true;
};

/**
 * One-line reminder on the confirm-purchase step: a non-VIP buyer can't
 * withdraw this item for 90 days. Renders nothing for VIP players (paid or
 * Lifetime Farmer Banner - the trial doesn't exempt them) or for items the
 * rule doesn't cover.
 */
export const WithdrawCooldownNotice: React.FC<{
  display: Pick<TradeableDisplay, "name" | "type">;
  className?: string;
}> = ({ display, className }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, selectGameState);
  const isVip = useVipAccess({ game, type: "full" });

  if (isVip || !hasMarketplaceWithdrawCooldown(display)) return null;

  return (
    <div className={classNames("flex items-start", className)}>
      <img src={vipIcon} className="h-6 mr-2" alt="" />
      <p className="text-xs">{t("marketplace.withdrawCooldown.notice")}</p>
    </div>
  );
};
