import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext, PortalProvider } from "../../lib/PortalProvider";
import { Ocean } from "features/world/ui/Ocean";
import { PortalHud } from "features/portal/components/PortalHud";
import { CropBoomPhaser } from "./CropBoomPhaser";

export const CropBoomApp: React.FC = () => {
  return (
    <PortalProvider>
      <Ocean>
        <CropBoom />
      </Ocean>
    </PortalProvider>
  );
};

export const CropBoom: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  return (
    <div>
      {portalState.matches("error") && (
        <Modal centered show>
          <Panel>
            <span>Something went wrong</span>
          </Panel>
        </Modal>
      )}

      {portalState.matches("loading") && (
        <Modal centered show>
          <Panel>
            <span className="loading">Loading</span>
          </Panel>
        </Modal>
      )}
      {portalState.matches("unauthorised") && (
        <Modal centered show>
          <Panel>
            <span>unauthorised</span>
          </Panel>
        </Modal>
      )}
      {portalState.matches("idle") && (
        <Modal centered show>
          <Panel>
            <Button onClick={() => portalService.send("START")}>Start</Button>
          </Panel>
        </Modal>
      )}
      {portalState.matches("ready") && (
        <>
          <PortalHud />
          <CropBoomPhaser />
        </>
      )}
    </div>
  );
};
