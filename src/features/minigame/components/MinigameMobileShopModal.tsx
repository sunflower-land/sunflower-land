import React from "react";
import { createPortal } from "react-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import type {
  MinigameFlowerPurchaseItemUi,
  MinigameShopItemUi,
} from "../lib/minigameDashboardTypes";
import type { PlayerEconomyConfig } from "../lib/types";
import { MinigameShopListBody } from "./MinigameShopListBody";
import { MinigameFlowerShopListBody } from "./MinigameFlowerShopListBody";
import { canAttemptShopPurchase } from "../lib/minigameShopAvailability";
import { canAttemptFlowerPurchase } from "../lib/minigameShopAvailability";
import { MinigameShopDetailBody } from "./MinigameShopDetailBody";
import { MinigameFlowerPurchaseDetailBody } from "./MinigameFlowerPurchaseDetailBody";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";

export type MinigameMobileShopPhase = "list" | "detail";

type Props = {
  config: PlayerEconomyConfig;
  show: boolean;
  phase: MinigameMobileShopPhase;
  onClose: () => void;
  onBackToList: () => void;
  flowerPurchaseItems: MinigameFlowerPurchaseItemUi[];
  farmFlowerBalance: Decimal;
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedFlowerId?: string | null;
  highlightedShopId?: string | null;
  onFlowerListClick: (item: MinigameFlowerPurchaseItemUi) => void;
  onShopListClick: (item: MinigameShopItemUi) => void;
  detailFlowerItem: MinigameFlowerPurchaseItemUi | null;
  detailShopItem: MinigameShopItemUi | null;
  shopActionError: string | null;
  onBuy: () => void;
};

export const MinigameMobileShopModal: React.FC<Props> = ({
  config,
  show,
  phase,
  onClose,
  onBackToList,
  flowerPurchaseItems,
  farmFlowerBalance,
  items,
  balances,
  tokenImages,
  highlightedFlowerId,
  highlightedShopId,
  onFlowerListClick,
  onShopListClick,
  detailFlowerItem,
  detailShopItem,
  shopActionError,
  onBuy,
}) => {
  const { t } = useAppTranslation();

  if (!show) return null;

  const view =
    phase === "detail" && (detailFlowerItem || detailShopItem)
      ? ("detail" as const)
      : ("list" as const);

  const canBuyFlower =
    detailFlowerItem != null &&
    canAttemptFlowerPurchase(detailFlowerItem.flower, farmFlowerBalance);

  const canBuyShop =
    detailShopItem != null && canAttemptShopPurchase(detailShopItem, balances);

  const canBuy = canBuyFlower || canBuyShop;

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[68] flex items-center justify-center p-2"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={onClose}
      role="presentation"
    >
      {view === "list" ? (
        <div
          className="max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <CloseButtonPanel
            className="flex max-h-[min(88dvh,32rem)] w-[min(96vw,24rem)] flex-col"
            title={t("minigame.dashboard.shop")}
            onClose={onClose}
          >
            <div className="flex min-h-0 max-h-[min(72dvh,26rem)] flex-col gap-2 overflow-y-auto p-1">
              {flowerPurchaseItems.length > 0 && (
                <div className="flex shrink-0 flex-col gap-1">
                  <Label type="default">
                    {t("minigame.dashboard.flowerPurchases")}
                  </Label>
                  <MinigameFlowerShopListBody
                    items={flowerPurchaseItems}
                    farmBalance={farmFlowerBalance}
                    highlightedId={highlightedFlowerId}
                    onItemClick={onFlowerListClick}
                    className="flex max-h-[40vh] min-h-0 flex-col gap-1 overflow-y-auto"
                  />
                </div>
              )}
              {items.length > 0 && (
                <div className="flex min-h-0 flex-1 flex-col gap-1">
                  <Label type="default">{t("minigame.dashboard.shop")}</Label>
                  <MinigameShopListBody
                    items={items}
                    balances={balances}
                    tokenImages={tokenImages}
                    highlightedId={highlightedShopId}
                    onItemClick={onShopListClick}
                    className="flex max-h-full min-h-0 flex-col gap-1 overflow-y-auto"
                  />
                </div>
              )}
            </div>
          </CloseButtonPanel>
        </div>
      ) : (
        <div
          className="max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
          role="presentation"
        >
          <CloseButtonPanel
            className="flex w-[min(96vw,24rem)] flex-col"
            title={
              detailFlowerItem?.name ??
              detailShopItem?.name ??
              t("minigame.dashboard.shop")
            }
            onClose={onClose}
            onBack={onBackToList}
          >
            <div className="flex flex-col gap-2 p-1">
              {detailFlowerItem ? (
                <MinigameFlowerPurchaseDetailBody
                  config={config}
                  item={detailFlowerItem}
                  farmBalance={farmFlowerBalance}
                  shopActionError={shopActionError}
                />
              ) : detailShopItem ? (
                <MinigameShopDetailBody
                  config={config}
                  item={detailShopItem}
                  tokenImages={tokenImages}
                  balances={balances}
                  shopActionError={shopActionError}
                />
              ) : null}
              <Button className="w-full" disabled={!canBuy} onClick={onBuy}>
                {t("buy")}
              </Button>
            </div>
          </CloseButtonPanel>
        </div>
      )}
    </div>,
    document.body,
  );
};
