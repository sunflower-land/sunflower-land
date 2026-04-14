import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MinigameInventoryItemUi } from "../lib/minigameDashboardTypes";
import { getMinigameTokenImage } from "../lib/minigameTokenIcons";
import { OuterPanel } from "components/ui/Panel";

type Props = {
  show: boolean;
  onClose: () => void;
  inventoryItems: MinigameInventoryItemUi[];
  balances: Record<string, number>;
  tokenImages: Record<string, string>;
  /** When opening the modal, select this token if the player owns it. */
  focusToken?: string | null;
};

export const MinigameInventoryModal: React.FC<Props> = ({
  show,
  onClose,
  inventoryItems,
  balances,
  tokenImages,
  focusToken = null,
}) => {
  const { t } = useAppTranslation();
  const [userPick, setUserPick] = useState<string | null>(null);
  const splitRef = useRef<HTMLDivElement>(null);

  /** All economy items; tokens you own (positive balance) are listed first. */
  const sortedInventoryRows = useMemo(() => {
    const bal = (t: string) => balances[t] ?? 0;
    return [...inventoryItems].sort((a, b) => {
      const ownedDiff = (bal(b.token) > 0 ? 1 : 0) - (bal(a.token) > 0 ? 1 : 0);
      if (ownedDiff !== 0) return ownedDiff;
      return a.token.localeCompare(b.token);
    });
  }, [inventoryItems, balances]);

  const canonicalSelection = useMemo(() => {
    if (sortedInventoryRows.length === 0) return null;
    if (focusToken && sortedInventoryRows.some((i) => i.token === focusToken)) {
      return focusToken;
    }
    const firstOwned = sortedInventoryRows.find(
      (i) => (balances[i.token] ?? 0) > 0,
    );
    return firstOwned?.token ?? sortedInventoryRows[0].token;
  }, [sortedInventoryRows, focusToken, balances]);

  const selectedToken = useMemo(() => {
    if (sortedInventoryRows.length === 0) return null;
    if (userPick && sortedInventoryRows.some((i) => i.token === userPick)) {
      return userPick;
    }
    return canonicalSelection;
  }, [sortedInventoryRows, userPick, canonicalSelection]);

  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.token === selectedToken) ?? null,
    [inventoryItems, selectedToken],
  );

  const balanceDecimal = (token: string) => new Decimal(balances[token] ?? 0);

  if (!show) return null;

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      className="fixed inset-safe-area z-[65] flex items-center justify-center p-2"
      style={{ background: "rgb(0 0 0 / 56%)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-full max-w-full"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <CloseButtonPanel
          className="flex w-[min(96vw,42rem)] max-h-[min(88dvh,36rem)] flex-col"
          onClose={onClose}
          container={OuterPanel}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-1">
            {inventoryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-evenly p-2">
                <img
                  src={SUNNYSIDE.icons.basket}
                  alt=""
                  style={{ width: `${PIXEL_SCALE * 12}px` }}
                />
                <span className="mt-2 text-center text-xs">
                  {t("detail.basket.empty")}
                </span>
              </div>
            ) : (
              <SplitScreenView
                divRef={splitRef}
                tallMobileContent
                tallDesktopContent
                wideModal
                showPanel={!!selectedItem}
                panel={
                  selectedItem ? (
                    <div className="flex flex-col p-1">
                      <div
                        className="mx-auto mb-2 flex items-center justify-center"
                        style={{
                          width: `${PIXEL_SCALE * 22}px`,
                          maxHeight: `${PIXEL_SCALE * 28}px`,
                        }}
                      >
                        <img
                          src={getMinigameTokenImage(
                            selectedItem.token,
                            tokenImages,
                          )}
                          alt=""
                          className="max-h-full w-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <p className="mb-1 text-center text-sm font-medium text-[#181425]">
                        {selectedItem.name}
                      </p>
                      {selectedItem.description ? (
                        <p className="mb-2 whitespace-pre-line text-xs leading-snug text-center text-[#3e2731]">
                          {selectedItem.description}
                        </p>
                      ) : null}
                      <Label
                        type="default"
                        className="text-xs tabular-nums text-[#555] text-center mx-auto"
                      >
                        {t("balance")}
                        {":"}
                        {"  "}
                        <span className="font-medium text-[#181425] ml-1">
                          {balanceDecimal(selectedItem.token).toString()}
                        </span>
                      </Label>
                    </div>
                  ) : (
                    <></>
                  )
                }
                content={
                  <div className="flex w-full flex-col pl-2">
                    <Label
                      type="default"
                      icon={SUNNYSIDE.icons.basket}
                      className="mb-2 shrink-0"
                    >
                      {t("inventory")}
                    </Label>
                    <div className="flex flex-wrap -ml-1.5">
                      {sortedInventoryRows.map((item) => (
                        <Box
                          key={item.token}
                          image={getMinigameTokenImage(item.token, tokenImages)}
                          count={balanceDecimal(item.token)}
                          isSelected={item.token === selectedToken}
                          onClick={() => setUserPick(item.token)}
                          parentDivRef={splitRef}
                        />
                      ))}
                    </div>
                  </div>
                }
              />
            )}
          </div>
        </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
