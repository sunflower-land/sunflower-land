import React, { useContext, useState } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

import { SUNNYSIDE } from "assets/sunnyside";
import buildingIcon from "assets/icons/building_icon.png";
import scarecrow from "assets/icons/scarecrow.png";
import bush from "assets/icons/decoration.png";
import chest from "assets/icons/chest.png";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import {
  MachineInterpreter,
  RESOURCE_PLACE_EVENTS,
} from "features/game/expansion/placeable/landscapingMachine";
import { Label } from "components/ui/Label";
import { PlaceableController } from "features/farming/hud/components/PlaceableController";
import { LandscapingChest } from "./components/LandscapingChest";

const LandscapingHudComponent: React.FC<{ isFarming: boolean }> = () => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showChest, setShowChest] = useState(false);

  const child = gameService.state.children.landscaping as MachineInterpreter;

  const [state, send] = useActor(child);

  return (
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      <Balance
        farmAddress={gameState.context.state.farmAddress as string}
        balance={gameState.context.state.balance}
      />
      <BlockBucks
        blockBucks={
          gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
        }
      />

      {state.matches({ editing: "idle" }) && (
        <>
          <div
            onClick={() => send("CANCEL")}
            className="fixed flex z-50 cursor-pointer hover:img-highlight"
            style={{
              marginLeft: `${PIXEL_SCALE * 2}px`,
              marginBottom: `${PIXEL_SCALE * 25}px`,
              width: `${PIXEL_SCALE * 22}px`,
              right: `${PIXEL_SCALE * 3}px`,
              top: `${PIXEL_SCALE * 38}px`,
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
            className="flex flex-col items-center fixed z-50"
            style={{
              right: `${PIXEL_SCALE * 1}px`,
              top: `${PIXEL_SCALE * 64}px`,
            }}
          >
            <Box isSelected image={SUNNYSIDE.icons.drag} />
          </div>
          <div className="fixed  bottom-2 w-full flex justify-center">
            <OuterPanel
              style={{
                bottom: `${PIXEL_SCALE * 2}px`,
              }}
            >
              <div
                className="flex justify-center"
                style={{
                  height: `${PIXEL_SCALE * 24}px`,
                }}
              >
                <InnerPanel
                  className="relative p-2 flex items-center justify-center mr-2  cursor-pointer hover:bg-brown-200"
                  style={{
                    width: `${PIXEL_SCALE * 24}px`,
                  }}
                >
                  <img src={buildingIcon} className="object-fit" />
                </InnerPanel>
                <InnerPanel
                  className="relative p-2 flex items-center justify-center mr-2  cursor-pointer hover:bg-brown-200"
                  style={{
                    width: `${PIXEL_SCALE * 24}px`,
                  }}
                >
                  <img
                    src={scarecrow}
                    style={{
                      height: `${PIXEL_SCALE * 16}px`,
                    }}
                  />
                </InnerPanel>
                <InnerPanel
                  className="relative p-2 flex items-center justify-center mr-2 cursor-pointer hover:bg-brown-200"
                  style={{
                    width: `${PIXEL_SCALE * 24}px`,
                  }}
                >
                  <img src={bush} className="h-full" />
                </InnerPanel>
                <InnerPanel
                  className="relative p-2 flex items-center justify-center mr-2 cursor-pointer hover:bg-brown-200"
                  style={{
                    width: `${PIXEL_SCALE * 24}px`,
                  }}
                  onClick={() => setShowChest(true)}
                >
                  <Label
                    type="default"
                    className="px-0.5 text-xxs absolute -top-2 -right-2"
                  >
                    X
                  </Label>
                  <img src={chest} className="h-full  " />
                </InnerPanel>
              </div>
            </OuterPanel>
          </div>
        </>
      )}

      <LandscapingChest
        state={gameState.context.state}
        onHide={() => setShowChest(false)}
        show={showChest}
        onPlace={(selected) => {
          console.log({ selected });
          child.send("SELECT", {
            action: RESOURCE_PLACE_EVENTS[selected] ?? "collectible.placed",
            placeable: selected,
          });
        }}
      />

      <PlaceableController />
    </div>
  );
};

export const LandscapingHud = React.memo(LandscapingHudComponent);
