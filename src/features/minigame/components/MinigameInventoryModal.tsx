import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
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
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const inventoryWasOpenRef = useRef(false);

  const ownedItems = useMemo(
    () =>
      inventoryItems.filter((item) => (balances[item.token] ?? 0) > 0),
    [inventoryItems, balances],
  );

  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.token === selectedToken) ?? null,
    [inventoryItems, selectedToken],
  );

  useEffect(() => {
    if (!show) {
      inventoryWasOpenRef.current = false;
      return;
    }

    const owned = inventoryItems.filter(
      (item) => (balances[item.token] ?? 0) > 0,
    );

    if (!inventoryWasOpenRef.current) {
      inventoryWasOpenRef.current = true;
      if (owned.length === 0) setSelectedToken(null);
      else if (focusToken && owned.some((i) => i.token === focusToken))
        setSelectedToken(focusToken);
      else setSelectedToken(owned[0].token);
      return;
    }

    setSelectedToken((prev) => {
      if (owned.length === 0) return null;
      if (prev && owned.some((i) => i.token === prev)) return prev;
      return owned[0].token;
    });
  }, [show, focusToken, inventoryItems, balances]);

  const balanceDecimal = (token: string) =>
    new Decimal(balances[token] ?? 0);

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
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-1">
          {ownedItems.length === 0 ? (
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
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden md:flex-row md:gap-0">
              <div className="flex max-h-[40vh] min-h-0 flex-col border-black/20 md:max-h-none md:max-w-[min(44%,220px)] md:shrink-0 md:border-r md:pr-2">
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.basket}
                  className="mb-1 shrink-0"
                >
                  {t("inventory")}
                </Label>
                <div className="scrollable flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">
                  {ownedItems.map((item) => (
                    <ButtonPanel
                      key={item.token}
                      className="flex shrink-0 flex-row items-center gap-2 text-left"
                      selected={item.token === selectedToken}
                      onClick={() => setSelectedToken(item.token)}
                    >
                      <div
                        className="flex shrink-0 items-center justify-center"
                        style={{
                          width: `${PIXEL_SCALE * 12}px`,
                          height: `${PIXEL_SCALE * 12}px`,
                        }}
                      >
                        <img
                          src={getMinigameTokenImage(
                            item.token,
                            tokenImages,
                          )}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{item.name}</div>
                        <div className="mt-0.5 text-xs tabular-nums text-[#555]">
                          ×{balanceDecimal(item.token).toString()}
                        </div>
                      </div>
                    </ButtonPanel>
                  ))}
                </div>
              </div>

              <div className="scrollable flex min-h-0 flex-1 flex-col overflow-y-auto px-0 pt-1 md:pl-3 md:pt-0">
                {selectedItem ? (
                  <>
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
                    <p className="mb-1 text-center text-sm font-medium">
                      {selectedItem.name}
                    </p>
                    <p className="mb-2 whitespace-pre-line text-xs text-[#3e2731]">
                      {selectedItem.description}
                    </p>
                    <p className="text-xs tabular-nums text-[#555]">
                      {t("balance")}:{" "}
                      <span className="font-medium text-[#181425]">
                        {balanceDecimal(selectedItem.token).toString()}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[#555]">
                    Select an item to view details.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CloseButtonPanel>
      </div>
    </div>,
    document.body,
  );
};
