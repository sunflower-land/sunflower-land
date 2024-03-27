import React, { useContext } from "react";
import { Balances } from "components/Balances";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { createPortal } from "react-dom";
import { PortalContext } from "../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";
import { goHome } from "../lib/portalUtil";

export const CropBoomHud: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const travelHome = () => {
    goHome();
  };

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="absolute z-40"
        >
          <Balances
            sfl={portalState.context.state.balance}
            coins={portalState.context.state.coins}
            blockBucks={
              portalState.context.state.inventory["Block Buck"] ??
              new Decimal(0)
            }
          />
          <div
            className="fixed z-50 flex flex-col justify-between"
            style={{
              left: `${PIXEL_SCALE * 3}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              width: `${PIXEL_SCALE * 22}px`,
            }}
          >
            <div
              id="deliveries"
              className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
              style={{
                width: `${PIXEL_SCALE * 22}px`,
                height: `${PIXEL_SCALE * 23}px`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                travelHome();
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
                src={worldIcon}
                style={{
                  width: `${PIXEL_SCALE * 12}px`,
                  left: `${PIXEL_SCALE * 5}px`,
                  top: `${PIXEL_SCALE * 4}px`,
                }}
                className="absolute"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
