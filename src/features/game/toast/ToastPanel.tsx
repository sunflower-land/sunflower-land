import React, { useContext, useState, useEffect, useRef } from "react";
import { Toast, ToastContext, ToastItem } from "./ToastProvider";
import { Context } from "../GameProvider";
import { INITIAL_FARM, PIXEL_SCALE } from "../lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { FactionName, InventoryItemName } from "../types/game";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import token from "assets/icons/flower_token.webp";
import levelup from "assets/icons/level_up.png";
import { HudContainer } from "components/ui/HudContainer";
import coins from "assets/icons/coins.webp";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BumpkinItem, ITEM_IDS } from "../types/bumpkin";
import { Bud } from "../types/buds";
import { KNOWN_IDS } from "../types";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";

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

  return "";
};

const _faction = (state: MachineState) => state.context.state.faction;

/**
 * The panel that shows temporary inventory/balance/experience state changes.
 */
export const ToastPanel: React.FC = () => {
  const { gameService } = useContext(Context);
  const {
    toastsList,
    setInventory,
    setSflBalance,
    setCoinBalance,
    setExperience,
    setFactionPoints,
    setWardrobe,
    setBuds,
  } = useContext(ToastContext);
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([]);
  const [showToasts, setShowToasts] = useState<boolean>(false);

  const faction = useSelector(gameService, _faction);

  const oldInventory = useRef<Partial<Record<InventoryItemName, Decimal>>>();
  const newInventory = useRef<Partial<Record<InventoryItemName, Decimal>>>();
  const oldSflBalance = useRef<Decimal>();
  const newSflBalance = useRef<Decimal>();
  const oldExperience = useRef<Decimal>();
  const newExperience = useRef<Decimal>();
  const oldCoinBalance = useRef<number>();
  const newCoinBalance = useRef<number>();
  const oldFactionPoints = useRef<number>();
  const newFactionPoints = useRef<number>();
  const oldWardrobe = useRef<Partial<Record<BumpkinItem, number>>>();
  const newWardrobe = useRef<Partial<Record<BumpkinItem, number>>>();
  const oldBuds = useRef<Partial<Record<number, Bud>>>();
  const newBuds = useRef<Partial<Record<number, Bud>>>();

  /**
   * Listens to game state transitions.
   */
  gameService.onTransition((state) => {
    // does nothing if no state changes
    if (!state.changed) return;

    // set old and new states
    oldInventory.current = newInventory.current;
    newInventory.current = state.context?.state?.inventory;
    oldSflBalance.current = newSflBalance.current;
    newSflBalance.current = state.context?.state?.balance;
    oldExperience.current = newExperience.current;
    const experience = state.context.state.bumpkin?.experience;
    newExperience.current = experience ? new Decimal(experience) : undefined;
    oldCoinBalance.current = newCoinBalance.current;
    newCoinBalance.current = state.context.state.coins;
    oldFactionPoints.current = newFactionPoints.current;
    newFactionPoints.current = faction?.points;
    oldWardrobe.current = newWardrobe.current;
    newWardrobe.current = state.context.state.wardrobe;
    oldBuds.current = newBuds.current;
    newBuds.current = state.context.state.buds;

    // inventory is set and changed
    if (
      !!newInventory.current &&
      oldInventory.current !== newInventory.current
    ) {
      setInventory(newInventory.current);
    }

    // sfl balance is set and changed
    if (
      !!newSflBalance.current &&
      oldSflBalance.current?.equals(newSflBalance.current) !== true
    ) {
      setSflBalance(newSflBalance.current);
    }

    // coin balance is set and changed
    if (
      !!newCoinBalance.current &&
      oldCoinBalance.current !== newCoinBalance.current
    ) {
      setCoinBalance(newCoinBalance.current);
    }

    // experience is set and changed
    if (
      !!newExperience.current &&
      oldExperience.current?.equals(newExperience.current) !== true
    ) {
      setExperience(newExperience.current);
    }

    // faction points is set and changed
    if (
      !!newFactionPoints.current &&
      oldFactionPoints.current !== newFactionPoints.current
    ) {
      setFactionPoints(newFactionPoints.current);
    }

    // wardrobe is set and changed
    if (!!newWardrobe.current && oldWardrobe.current !== newWardrobe.current) {
      setWardrobe(newWardrobe.current);
    }

    // buds is set and changed
    if (!!newBuds.current && oldBuds.current !== newBuds.current) {
      setBuds(newBuds.current);
    }
  });

  // show toast only if there are toasts in the toast list
  useEffect(() => {
    const visibleToasts = toastsList.filter((toast) => !toast.hidden);
    setVisibleToasts(visibleToasts);

    setShowToasts(visibleToasts.length >= 1);
  }, [toastsList]);

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
            {/* show visible toasts only */}
            {visibleToasts
              .slice(0, MAX_TOAST)
              .map(({ item, difference, id }) => {
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
