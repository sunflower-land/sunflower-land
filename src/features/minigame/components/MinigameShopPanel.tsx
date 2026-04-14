import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type {
  MinigameFlowerPurchaseItemUi,
  MinigameShopItemUi,
} from "../lib/minigameDashboardTypes";
import { MinigameShopListBody } from "./MinigameShopListBody";
import { MinigameFlowerShopListBody } from "./MinigameFlowerShopListBody";
import Decimal from "decimal.js-light";

type Props = {
  flowerPurchaseItems: MinigameFlowerPurchaseItemUi[];
  farmFlowerBalance: Decimal;
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedFlowerId?: string | null;
  highlightedShopId?: string | null;
  onFlowerItemClick: (item: MinigameFlowerPurchaseItemUi) => void;
  onShopItemClick: (item: MinigameShopItemUi) => void;
};

export const MinigameShopPanel: React.FC<Props> = ({
  flowerPurchaseItems,
  farmFlowerBalance,
  items,
  balances,
  tokenImages,
  highlightedFlowerId,
  highlightedShopId,
  onFlowerItemClick,
  onShopItemClick,
}) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
      {flowerPurchaseItems.length > 0 && (
        <div className="flex min-h-0 shrink-0 flex-col gap-1">
          <div className="shrink-0">
            <Label type="default">
              {t("minigame.dashboard.flowerPurchases")}
            </Label>
          </div>
          <MinigameFlowerShopListBody
            items={flowerPurchaseItems}
            farmBalance={farmFlowerBalance}
            highlightedId={highlightedFlowerId}
            onItemClick={onFlowerItemClick}
          />
        </div>
      )}
      {items.length > 0 && (
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
          <div className="shrink-0">
            <Label type="default">{t("minigame.dashboard.shop")}</Label>
          </div>
          <MinigameShopListBody
            items={items}
            balances={balances}
            tokenImages={tokenImages}
            highlightedId={highlightedShopId}
            onItemClick={onShopItemClick}
          />
        </div>
      )}
    </InnerPanel>
  );
};
