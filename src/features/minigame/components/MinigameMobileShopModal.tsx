import React from "react";
import { createPortal } from "react-dom";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import type { MinigameShopItemUi } from "../lib/minigameDashboardTypes";
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
  if (!show) return null;

  const view =
    phase === "detail" && detailItem ? ("detail" as const) : ("list" as const);

  const canBuy =
    detailItem != null && canAffordShopItem(detailItem, balances);

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[68] flex items-center justify-center p-2"
      style={{ background: "rgb(0 0 0 / 56%)" }}
    >
      {view === "list" ? (
        <CloseButtonPanel
          className="flex max-h-[min(88dvh,32rem)] w-[min(96vw,24rem)] flex-col"
          title="Shop"
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
      ) : (
        <CloseButtonPanel
          className="flex w-[min(96vw,24rem)] flex-col"
          title={detailItem!.name}
          onClose={onClose}
          onBack={onBackToList}
        >
          <div className="flex flex-col gap-2 p-1">
            <InnerPanel className="p-2">
              <MinigameShopDetailBody
                item={detailItem!}
                shopProductionPreview={shopProductionPreview}
                tokenImages={tokenImages}
                balances={balances}
                shopActionError={shopActionError}
              />
            </InnerPanel>
            <Button className="w-full" disabled={!canBuy} onClick={onBuy}>
              Buy
            </Button>
          </div>
        </CloseButtonPanel>
      )}
    </div>,
    document.body,
  );
};
