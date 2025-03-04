import React, { useContext } from "react";

import { Balances } from "components/Balances";
import { useSelector } from "@xstate/react";
import { Context, useGame } from "features/game/GameProvider";

import { Inventory } from "./components/inventory/Inventory";
import { InnerPanel } from "components/ui/Panel";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { InventoryItemName } from "features/game/types/game";
import { Settings } from "./components/Settings";
import { createPortal } from "react-dom";
import { TravelButton } from "./components/deliveries/TravelButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */

const _landToVisitNotFound = (state: MachineState) =>
  state.matches("landToVisitNotFound");
const _farmId = (state: MachineState) => state.context.farmId;
export const VisitingHud: React.FC = () => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const { state } = useGame();
  const landToVisitNotFound = useSelector(gameService, _landToVisitNotFound);
  const farmId = useSelector(gameService, _farmId);
  const { t } = useAppTranslation();

  return createPortal(
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      {!landToVisitNotFound && (
        <InnerPanel className="fixed px-2 pt-1 pb-2 bottom-2 left-1/2 -translate-x-1/2 z-50">
          <span className="text-white">{t("visiting.farmId", { farmId })}</span>
        </InnerPanel>
      )}
      <Balances
        sfl={state.balance}
        coins={state.coins}
        gems={state.inventory["Gem"] ?? new Decimal(0)}
      />
      <Inventory
        state={state}
        shortcutItem={shortcutItem}
        selectedItem={selectedItem as InventoryItemName}
        isFarming={false}
        isFullUser={false}
        hideActions
      />
      <BumpkinProfile />
      <div
        className="fixed z-50"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 23}px`,
        }}
      >
        <Settings isFarming={false} />
      </div>
      <div
        className="fixed z-50"
        style={{
          left: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 23}px`,
        }}
      >
        <TravelButton isVisiting={true} />
      </div>
    </div>,
    document.body,
  );
};
