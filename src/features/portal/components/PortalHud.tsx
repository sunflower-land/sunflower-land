import React, { useContext } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { createPortal } from "react-dom";
import { BlockBucks } from "features/island/hud/components/BlockBucks";
import { PortalContext } from "../PortalProvider";

export const PortalHud: React.FC = () => {
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
          <Balance balance={portalState.context.state.balance} />
          <BlockBucks
            blockBucks={
              portalState.context.state.inventory["Block Buck"] ??
              new Decimal(0)
            }
          />
        </div>,
        document.body
      )}
    </>
  );
};
