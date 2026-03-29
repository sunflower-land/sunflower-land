import React, { useMemo } from "react";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Box } from "components/ui/Box";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { useSound } from "lib/utils/hooks/useSound";
import type { MinigameInventoryItemUi } from "../lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";

type Props = {
  shortcutTokens: string[];
  /** Full inventory list order; used to fill HUD slots after shortcuts (owned only). */
  inventoryItems: MinigameInventoryItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  onOpenInventory: () => void;
  /** Shop disc (heart on disc) above the basket; opens the shop modal. */
  onOpenShop?: () => void;
};

export const MinigameInventoryHud: React.FC<Props> = ({
  shortcutTokens,
  inventoryItems,
  balances,
  tokenImages,
  onOpenInventory,
  onOpenShop,
}) => {
  const inventory = useSound("inventory");
  const button = useSound("button");

  const displayTokens = useMemo(() => {
    const own = (t: string) => (balances[t] ?? 0) > 0;
    const fromShortcuts = shortcutTokens.filter(own);
    const rest = inventoryItems
      .map((i) => i.token)
      .filter(own)
      .filter((t) => !fromShortcuts.includes(t));
    return [...fromShortcuts, ...rest].slice(0, 3);
  }, [shortcutTokens, inventoryItems, balances]);

  return (
    <div
      className="flex flex-col items-end"
      style={{ right: `${PIXEL_SCALE * 3}px` }}
    >
      {onOpenShop && (
        <RoundButton
          buttonSize={20}
          className="mb-2"
          onClick={() => {
            button.play();
            onOpenShop();
          }}
        >
          <img src={SUNNYSIDE.icons.disc} className="w-full" alt="" />
          <img
            src={SUNNYSIDE.icons.heart}
            alt=""
            className="absolute group-active:translate-y-[2px]"
            style={{
              top: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 5}px`,
              width: `${PIXEL_SCALE * 10}px`,
              imageRendering: "pixelated",
            }}
          />
        </RoundButton>
      )}

      <RoundButton
        className={classNames("mb-2", onOpenShop && "mt-1")}
        onClick={() => {
          inventory.play();
          onOpenInventory();
        }}
      >
        <img
          src={SUNNYSIDE.icons.basket}
          className={classNames("absolute group-active:translate-y-[2px]")}
          style={{
            top: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 12}px`,
          }}
          alt=""
        />
      </RoundButton>

      <div
        className="flex flex-col items-center"
        style={{ marginRight: `${PIXEL_SCALE * -3}px` }}
      >
        {displayTokens.map((token) => (
          <Box
            key={token}
            image={getMinigameTokenImage(token, tokenImages)}
            count={new Decimal(balances[token] ?? 0)}
            hideCount={false}
            onClick={onOpenInventory}
          />
        ))}
      </div>
    </div>
  );
};
