import React, { useContext, useState } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import scarecrow from "assets/icons/scarecrow.png";
import bush from "assets/icons/decoration.png";
import chest from "assets/icons/chest.png";
import lightning from "assets/icons/lightning.png";

import { OuterPanel } from "components/ui/Panel";
import {
  MachineInterpreter,
  placeEvent,
} from "features/game/expansion/placeable/landscapingMachine";
import { Label } from "components/ui/Label";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { LandscapingChest } from "./components/LandscapingChest";
import { getChestItems } from "./components/inventory/utils/inventory";
import { getKeys } from "features/game/types/craftables";
import { CraftDecorationsModal } from "./components/decorations/CraftDecorationsModal";
import { CraftEquipmentModal } from "./components/equipment/CraftEquipmentModal";
import { CraftBuildingModal } from "./components/buildings/CraftBuildingModal";
import { ITEM_DETAILS } from "features/game/types/images";

const LandscapingHudComponent: React.FC<{ isFarming: boolean }> = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showChest, setShowChest] = useState(false);
  const [showDecorations, setShowDecorations] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showBuildings, setShowBuildings] = useState(false);

  const child = gameService.state.children.landscaping as MachineInterpreter;

  const [state, send] = useActor(child);

  const chestItems = getChestItems(gameState.context.state);
  return (
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      <Balance balance={gameState.context.state.balance} />
      <BlockBucks
        blockBucks={
          gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
        }
        isFullUser={false}
      />

      <>
        {state.matches({ editing: "idle" }) && (
          <>
            <div
              className="fixed flex z-50 flex-col"
              style={{
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginBottom: `${PIXEL_SCALE * 25}px`,
                width: `${PIXEL_SCALE * 22}px`,
                right: `${PIXEL_SCALE * 3}px`,
                top: `${PIXEL_SCALE * 38}px`,
              }}
            >
              <div
                onClick={() => send("CANCEL")}
                className="w-full z-10 cursor-pointer hover:img-highlight relative"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                  height: `${PIXEL_SCALE * 22}px`,
                  marginBottom: `${PIXEL_SCALE * 4}px`,
                }}
              >
                <img
                  src={SUNNYSIDE.ui.round_button}
                  className="absolute"
                  style={{
                    width: `${PIXEL_SCALE * 22}px`,
                  }}
                />
                <img
                  src={SUNNYSIDE.icons.cancel}
                  className="absolute"
                  style={{
                    top: `${PIXEL_SCALE * 5}px`,
                    left: `${PIXEL_SCALE * 5}px`,
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
              </div>
              <div
                onClick={() => setShowEquipment(true)}
                className="w-full z-10 cursor-pointer hover:img-highlight relative"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                  height: `${PIXEL_SCALE * 22}px`,
                  marginBottom: `${PIXEL_SCALE * 4}px`,
                }}
              >
                <img
                  src={SUNNYSIDE.ui.round_button}
                  className="absolute"
                  style={{
                    width: `${PIXEL_SCALE * 22}px`,
                  }}
                />
                <img
                  src={scarecrow}
                  className="absolute"
                  style={{
                    top: `${PIXEL_SCALE * 3}px`,
                    left: `${PIXEL_SCALE * 5}px`,
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
                <img
                  src={lightning}
                  className="absolute"
                  style={{
                    top: `${PIXEL_SCALE * 2}px`,
                    right: `${PIXEL_SCALE * 3}px`,
                    width: `${PIXEL_SCALE * 6}px`,
                  }}
                />
              </div>
              <div
                onClick={() => setShowBuildings(true)}
                className="w-full z-10 cursor-pointer hover:img-highlight relative"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                  height: `${PIXEL_SCALE * 22}px`,
                  marginBottom: `${PIXEL_SCALE * 4}px`,
                }}
              >
                <img
                  src={SUNNYSIDE.ui.round_button}
                  className="absolute"
                  style={{
                    width: `${PIXEL_SCALE * 22}px`,
                  }}
                />
                <img
                  src={ITEM_DETAILS["Water Well"].image}
                  className="absolute"
                  style={{
                    top: `${PIXEL_SCALE * 4}px`,
                    left: `${PIXEL_SCALE * 5}px`,
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
              </div>
              <div
                onClick={() => setShowDecorations(true)}
                className="w-full z-10 cursor-pointer hover:img-highlight relative"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                  height: `${PIXEL_SCALE * 22}px`,
                  marginBottom: `${PIXEL_SCALE * 4}px`,
                }}
              >
                <img
                  src={SUNNYSIDE.ui.round_button}
                  className="absolute"
                  style={{
                    width: `${PIXEL_SCALE * 22}px`,
                  }}
                />
                <img
                  src={bush}
                  className="absolute"
                  style={{
                    top: `${PIXEL_SCALE * 5}px`,
                    left: `${PIXEL_SCALE * 5}px`,
                    width: `${PIXEL_SCALE * 12}px`,
                  }}
                />
              </div>
            </div>
            <div
              onClick={() => setShowChest(true)}
              className="fixed flex z-50 cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 22}px`,
                height: `${PIXEL_SCALE * 22}px`,
                marginBottom: `${PIXEL_SCALE * 4}px`,
                bottom: `${PIXEL_SCALE * 3}px`,
                right: `${PIXEL_SCALE * 3}px`,
              }}
            >
              <img
                src={SUNNYSIDE.ui.round_button}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                }}
              />
              <img
                src={chest}
                className="absolute"
                style={{
                  top: `${PIXEL_SCALE * 5}px`,
                  left: `${PIXEL_SCALE * 5}px`,
                  width: `${PIXEL_SCALE * 12}px`,
                }}
              />
              <Label
                type="default"
                className="px-0.5 text-xxs absolute -top-2 -right-2"
              >
                {getKeys(chestItems).reduce(
                  (acc, key) => acc + (chestItems[key]?.toNumber() ?? 0),
                  0
                )}
              </Label>
            </div>
          </>
        )}

        {state.matches({ editing: "moving" }) && (
          <div className="fixed  bottom-2 w-full flex justify-center">
            <OuterPanel
              style={{
                bottom: `${PIXEL_SCALE * 2}px`,
              }}
              className="relative flex justify-center items-center p-1"
            >
              <img src={SUNNYSIDE.icons.drag} className="h-6 mr-1" />
              <p className="text-sm">Click & Drag Objects</p>
            </OuterPanel>
          </div>
        )}
      </>

      <LandscapingChest
        state={gameState.context.state}
        onHide={() => setShowChest(false)}
        show={showChest}
        onPlace={(selected) => {
          child.send("SELECT", {
            action: placeEvent(selected),
            placeable: selected,
            multiple: true,
          });
        }}
      />

      <CraftDecorationsModal
        onHide={() => setShowDecorations(false)}
        show={showDecorations}
        state={gameState.context.state}
      />

      <CraftEquipmentModal
        onHide={() => setShowEquipment(false)}
        show={showEquipment}
        state={gameState.context.state}
      />

      <CraftBuildingModal
        onHide={() => setShowBuildings(false)}
        show={showBuildings}
        state={gameState.context.state}
      />

      <PlaceableController />
    </div>
  );
};

export const LandscapingHud = React.memo(LandscapingHudComponent);
