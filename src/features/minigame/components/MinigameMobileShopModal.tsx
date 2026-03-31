import React from "react";
import { createPortal } from "react-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
import type { MinigameConfig } from "../lib/types";
import { MinigameShopListBody } from "./MinigameShopListBody";
import { canAffordShopItem } from "../lib/canAffordShopItem";
import { MinigameShopDetailBody } from "./MinigameShopDetailBody";

export type MinigameMobileShopPhase = "list" | "detail";

type ProductionPreview = {
  outputToken: string;
  amount: number;
  rateDenominatorMs: number;
};

type Props = {
  config: MinigameConfig;
  show: boolean;
  phase: MinigameMobileShopPhase;
  onClose: () => void;
  onBackToList: () => void;
  items: MinigameShopItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  highlightedId?: string | null;
  onListItemClick: (item: MinigameShopItemUi) => void;
  detailItem: MinigameShopItemUi | null;
  shopProductionPreview: ProductionPreview | null;
  shopActionError: string | null;
  onBuy: () => void;
};

export const MinigameMobileShopModal: React.FC<Props> = ({
  config,
  show,
  phase,
  onClose,
  onBackToList,
  items,
  balances,
  tokenImages,
  highlightedId,
  onListItemClick,
  detailItem,
  shopProductionPreview,
  shopActionError,
  onBuy,
}) => {
  const { t } = useAppTranslation();

  if (!show) return null;

  const view =
    phase === "detail" && detailItem ? ("detail" as const) : ("list" as const);

  const canBuy = detailItem != null && canAffordShopItem(detailItem, balances);

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
            <div className="flex min-h-0 max-h-[min(72dvh,26rem)] flex-col gap-1 p-1">
              <MinigameShopListBody
                items={items}
                balances={balances}
                tokenImages={tokenImages}
                highlightedId={highlightedId}
                onItemClick={onListItemClick}
                className="flex max-h-full min-h-0 flex-col gap-1 overflow-y-auto"
              />
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
            title={detailItem!.name}
            onClose={onClose}
            onBack={onBackToList}
          >
            <div className="flex flex-col gap-2 p-1">
              <MinigameShopDetailBody
                config={config}
                item={detailItem!}
                shopProductionPreview={shopProductionPreview}
                tokenImages={tokenImages}
                balances={balances}
                shopActionError={shopActionError}
              />
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
