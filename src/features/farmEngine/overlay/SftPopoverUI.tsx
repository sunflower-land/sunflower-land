import React, { useEffect, useRef, useState } from "react";
import { useNow } from "lib/utils/hooks/useNow";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import {
  SFTDetailPopoverBuffs,
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
  SFTDetailPopoverTradeDetails,
} from "components/ui/SFTDetailPopover";
import {
  BudDetailPopoverBuffs,
  BudDetailPopoverTradeDetails,
} from "features/island/collectibles/components/Bud";
import { getBudImage } from "lib/buds/types";
import type { InventoryItemName } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useWorldAnchor } from "../bridge/useWorldAnchor";
import type { GameBridge, SftPopoverRequest } from "../bridge/GameBridge";

/**
 * The clicked-SFT detail popover [SFTDetailPopover.tsx / Bud.tsx /
 * PetShrine.tsx active state]: name, buffs, trade details, and (for
 * expiring boosts) the time remaining. Anchored beside the clicked node;
 * closes on any outside click.
 */
export const SftPopoverUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { t } = useAppTranslation();
  const [request, setRequest] = useState<SftPopoverRequest>(
    bridge.sftPopover.get(),
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => bridge.sftPopover.subscribe(setRequest), [bridge]);

  useEffect(() => {
    if (!request) return;
    // pointerdown, NOT mousedown: touch pans on the canvas never synthesise
    // mouse events, so on mobile the popover was surviving pans and dragging
    // around with its anchor. Any touch outside — a tap elsewhere or the
    // start of a pan — dismisses it, like native tooltips.
    const close = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        bridge.sftPopover.set(null);
      }
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [request, bridge]);

  const rect = useWorldAnchor(request?.anchorId ?? "sft-popover");
  const now = useNow({ live: !!request?.expiresAt });
  if (!request || !rect || !rect.visible) return null;

  const secondsToExpire = request.expiresAt
    ? (request.expiresAt - now) / 1000
    : undefined;

  return (
    <div
      ref={ref}
      className="absolute pointer-events-auto"
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        transform: "translateX(-100%)",
        zIndex: 40,
      }}
    >
      <SFTDetailPopoverInnerPanel>
        {request.budId !== undefined ? (
          <>
            <div className="flex space-x-1 relative">
              <img
                src={getBudImage(request.budId)}
                className="absolute"
                style={{ width: `48px`, bottom: "-4px", left: "-15px" }}
              />
              <span
                className="text-xs whitespace-nowrap underline"
                style={{ paddingLeft: "20px" }}
              >{`Bud ${request.budId}`}</span>
            </div>
            <BudDetailPopoverBuffs id={request.budId} />
            <BudDetailPopoverTradeDetails id={request.budId} />
          </>
        ) : request.name ? (
          <>
            <SFTDetailPopoverLabel name={request.name as InventoryItemName} />
            {secondsToExpire !== undefined && secondsToExpire > 0 && (
              <Label
                type="info"
                icon={SUNNYSIDE.icons.stopwatch}
                className="mt-2 mb-2"
              >
                <span className="text-xs">
                  {t("time.remaining", {
                    time: secondsToString(secondsToExpire, {
                      length: "medium",
                      isShortFormat: true,
                      removeTrailingZeros: true,
                    }),
                  })}
                </span>
              </Label>
            )}
            <SFTDetailPopoverBuffs name={request.name as InventoryItemName} />
            <SFTDetailPopoverTradeDetails
              name={request.name as InventoryItemName}
            />
          </>
        ) : null}
      </SFTDetailPopoverInnerPanel>
    </div>
  );
};
