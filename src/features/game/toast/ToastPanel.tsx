import React, { useContext, useEffect } from "react";
import { ToastContext, type ToastItem } from "./ToastProvider";
import { getToastState } from "./toastChanges";
import { Context } from "../GameProvider";
import { INITIAL_FARM, PIXEL_SCALE } from "../lib/constants";
import { InnerPanel } from "components/ui/Panel";
import type { FactionName, InventoryItemName } from "../types/game";
import { formatNumber } from "lib/utils/formatNumber";
import { HudContainer } from "components/ui/HudContainer";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import type { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { type BumpkinItem, ITEM_IDS } from "../types/bumpkin";
import { KNOWN_IDS } from "../types";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";

import token from "assets/icons/flower_token.webp";
import levelup from "assets/icons/level_up.png";
import coins from "assets/icons/coins.webp";
import { getPetImage } from "features/island/pets/lib/petShared";

const MAX_TOAST = 6;

const getToastIcon = (item: ToastItem, faction?: FactionName) => {
  if (item === "SFL") return token;

  if (item === "XP") return levelup;

  if (item === "coins") return coins;

  if (item === "faction_points") {
    if (!faction) return;

    return FACTION_POINT_ICONS[faction];
  }

  if (KNOWN_IDS[item as InventoryItemName]) {
    return getTradeableDisplay({
      id: KNOWN_IDS[item as InventoryItemName],
      type: "collectibles",
      state: INITIAL_FARM,
    }).image;
  }

  if (ITEM_IDS[item as BumpkinItem]) {
    return getTradeableDisplay({
      id: ITEM_IDS[item as BumpkinItem],
      type: "wearables",
      state: INITIAL_FARM,
    }).image;
  }

  if (item.startsWith("Bud #")) {
    return getTradeableDisplay({
      id: Number(item.split("#")[1]),
      type: "buds",
      state: INITIAL_FARM,
    }).image;
  }

  if (item.startsWith("Pet #")) {
    return getPetImage("happy", Number(item.split("#")[1]));
  }

  return "";
};

const _faction = (state: MachineState) => state.context.state.faction;

/**
 * The panel that shows temporary inventory/balance/experience state changes.
 */
export const ToastPanel: React.FC = () => {
  const { gameService } = useContext(Context);
  const { toastsList, setToastState } = useContext(ToastContext);

  const faction = useSelector(gameService, _faction);

  /**
   * Listens to game state transitions.
   */
  useEffect(() => {
    const subscription = gameService.subscribe((state) => {
      // does nothing if visiting or ending visit
      if (
        state.context.visitorId !== undefined ||
        state.event.type === "END_VISIT"
      ) {
        return;
      }

      setToastState(getToastState(state.context.state));
    });

    return () => subscription.unsubscribe();
  }, [gameService, setToastState]);

  // show toast only if there are toasts in the toast list
  const showToasts = toastsList.length >= 1;

  return (
    <>
      {showToasts && (
        <HudContainer zIndex="z-[99999]">
          <InnerPanel
            className="flex flex-col items-start absolute pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * 54}px`,
              left: `${PIXEL_SCALE * 3}px`,
            }}
          >
            {toastsList.slice(0, MAX_TOAST).map(({ item, difference, id }) => {
              return (
                <div className="flex items-center justify-center" key={id}>
                  <img
                    className="h-6"
                    src={getToastIcon(item, faction?.name)}
                  />
                  <span className="text-sm mx-1 mb-0.5 font-secondary">{`${difference.greaterThan(0) ? "+" : ""}${formatNumber(
                    difference,
                    {
                      decimalPlaces: item === "SFL" ? 4 : 2,
                    },
                  )}`}</span>
                </div>
              );
            })}
          </InnerPanel>
        </HudContainer>
      )}
    </>
  );
};
