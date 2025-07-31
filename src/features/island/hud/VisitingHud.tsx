import React, { useContext } from "react";

import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { Inventory } from "./components/inventory/Inventory";
import { InnerPanel } from "components/ui/Panel";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { InventoryItemName } from "features/game/types/game";
import { Settings } from "./components/Settings";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { useNavigate } from "react-router";
import { MachineState } from "features/game/lib/gameMachine";
import { NPCIcon } from "../bumpkin/components/NPC";
import cheer from "assets/icons/cheer.webp";

const _cheers = (state: MachineState) => {
  return state.context.visitorState?.inventory["Cheer"] ?? new Decimal(0);
};

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const VisitingHud: React.FC = () => {
  const { gameService, shortcutItem, selectedItem, fromRoute } =
    useContext(Context);
  const [gameState] = useActor(gameService);
  const cheers = useSelector(gameService, _cheers);

  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const handleEndVisit = () => {
    navigate(fromRoute ?? "/");
    gameService.send("END_VISIT");
  };

  const displayId =
    gameState.context.state.username ?? gameState.context.farmId;

  // const cheersCount = gameS;

  return (
    <HudContainer>
      {!gameState.matches("landToVisitNotFound") && (
        <InnerPanel className="fixed px-2 pt-1 pb-2 bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-col">
          <div className="flex flex-col p-0.5">
            <div className="flex items-center space-x-1">
              <NPCIcon
                parts={gameState.context.state.bumpkin?.equipped}
                width={20}
              />
              <span className="text-xs whitespace-nowrap">
                {t("visiting.farmId", { farmId: displayId })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <img src={cheer} style={{ width: `16px`, margin: `2px` }} />
              <span className="text-xxs">{`${cheers.toString()} Cheers Available`}</span>
            </div>
          </div>
        </InnerPanel>
      )}
      <div className="absolute right-0 top-0 p-2.5">
        <Balances
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
        />
      </div>
      <div className="absolute right-0 top-16 p-2.5">
        <Inventory
          state={gameState.context.state}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem as InventoryItemName}
          isFarming={false}
          isFullUser={false}
          hideActions
        />
      </div>
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
        <RoundButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleEndVisit();
          }}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            alt="End visit"
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </RoundButton>
      </div>
    </HudContainer>
  );
};
