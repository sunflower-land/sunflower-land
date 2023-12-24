import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Balance } from "components/Balance";
import { BlockBucks } from "features/island/hud/components/BlockBucks";
import { BumpkinAvatar } from "features/island/hud/components/BumpkinProfile";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { PortalContext } from "../lib/Provider";
import { HomeButton } from "./HomeButton";
import { Power } from "./Power";
import { Leaderboard } from "./Leaderboard";

export const Hud: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  return (
    <>
      {createPortal(
        <div
          data-html2canvas-ignore="true"
          aria-label="Hud"
          className="absolute z-40"
        >
          <Power power={portalState.context.bumpkinPower} />
          <BumpkinAvatar bumpkin={portalState.context.state.bumpkin} />
          <Balance balance={portalState.context.state.balance} />
          <BlockBucks
            blockBucks={
              portalState.context.state.inventory["Block Buck"] ??
              new Decimal(0)
            }
          />
          <div
            className="fixed z-50 flex flex-col justify-between gap-2"
            style={{
              left: `${PIXEL_SCALE * 3}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              width: `${PIXEL_SCALE * 22}px`,
            }}
          >
            <Leaderboard farmId={portalState.context.id} />
            <HomeButton />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
