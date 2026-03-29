import React, { useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MinigameInventoryItemUi } from "../lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";

type Props = {
  show: boolean;
  onClose: () => void;
  inventoryItems: MinigameInventoryItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
};

export const MinigameInventoryModal: React.FC<Props> = ({
  show,
  onClose,
  inventoryItems,
  balances,
  tokenImages,
}) => {
  const { t } = useAppTranslation();
  const divRef = useRef<HTMLDivElement>(null);

  const ownedItems = useMemo(
    () =>
      inventoryItems.filter((item) => (balances[item.token] ?? 0) > 0),
    [inventoryItems, balances],
  );

  const balanceDecimal = (token: string) =>
    new Decimal(balances[token] ?? 0);

  if (!show) return null;

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[65] flex items-center justify-center p-2"
      style={{ background: "rgb(0 0 0 / 56%)" }}
    >
      <CloseButtonPanel
        className="w-[min(96vw,42rem)] max-h-[min(88dvh,36rem)] flex flex-col"
        onClose={onClose}
      >
        <div className="p-1 min-h-0 flex-1 flex flex-col overflow-hidden">
          {ownedItems.length === 0 ? (
            <div className="flex flex-col justify-evenly items-center p-2">
              <img
                src={SUNNYSIDE.icons.basket}
                alt=""
                style={{ width: `${PIXEL_SCALE * 12}px` }}
              />
              <span className="text-xs text-center mt-2">
                {t("detail.basket.empty")}
              </span>
            </div>
          ) : (
            <InnerPanel
              className="w-full max-h-[min(80dvh,28rem)] p-1 flex flex-wrap overflow-y-auto scrollable overflow-x-hidden"
              divRef={divRef}
            >
              <div className="flex flex-col pl-2 mb-2 w-full min-w-0">
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.basket}
                  className="mb-2"
                >
                  {t("inventory")}
                </Label>
                <div className="flex mb-2 flex-wrap -ml-1.5">
                  {ownedItems.map((item) => (
                    <Box
                      key={item.token}
                      count={balanceDecimal(item.token)}
                      image={getMinigameTokenImage(item.token, tokenImages)}
                      parentDivRef={divRef}
                    />
                  ))}
                </div>
              </div>
            </InnerPanel>
          )}
        </div>
      </CloseButtonPanel>
    </div>,
    document.body,
  );
};
