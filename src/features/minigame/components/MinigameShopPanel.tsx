import React from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import { MinigameShopListBody } from "./MinigameShopListBody";

type Props = {
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedId?: string | null;
  onItemClick: (item: MinigameShopItemUi) => void;
};

export const MinigameShopPanel: React.FC<Props> = ({
  items,
  balances,
  tokenImages,
  highlightedId,
  onItemClick,
}) => {
  return (
    <OuterPanel className="flex h-full min-h-0 flex-col overflow-hidden">
      <InnerPanel className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
        <div className="shrink-0">
          <Label type="default">Shop</Label>
        </div>
        <MinigameShopListBody
          items={items}
          balances={balances}
          tokenImages={tokenImages}
          highlightedId={highlightedId}
          onItemClick={onItemClick}
        />
      </InnerPanel>
    </OuterPanel>
  );
};
