import React from "react";
import { PortalProvider } from "./PortalProvider";
import { Portal } from "./Portal";
import { Ocean } from "features/world/ui/Ocean";

export const PortalApp: React.FC = () => {
  return (
    <PortalProvider>
      <Ocean>
        <Portal />
      </Ocean>
    </PortalProvider>
  );
};
