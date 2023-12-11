import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext, PortalProvider } from "./lib/PortalProvider";
import { Ocean } from "features/world/ui/Ocean";
import { CropBoomHud } from "features/portal/examples/cropBoom/components/CropBoomHud";
import { CropBoomPhaser } from "./CropBoomPhaser";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { secondsToString } from "lib/utils/time";
import {
  authorisePortal,
  goHome,
} from "features/portal/examples/cropBoom/lib/portalUtil";
import { CropBoomRules } from "./components/CropBoomRules";

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
            <div className="p-2">
              <Label type="danger">Error</Label>
              <span className="text-sm my-2">Something went wrong</span>
            </div>
            <Button onClick={() => portalService.send("RETRY")}>Retry</Button>
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
            <div className="p-2">
              <Label type="danger">Error</Label>
              <span className="text-sm my-2">Your session has expired</span>
            </div>
            <Button onClick={authorisePortal}>Login</Button>
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

      {portalState.matches("rules") && (
        <Modal centered show>
          <Panel bumpkinParts={NPC_WEARABLES.wizard}>
            <CropBoomRules
              onAcknowledged={() => portalService.send("CONTINUE")}
            />
          </Panel>
        </Modal>
      )}

      {portalState.matches("claiming") && (
        <Modal centered show>
          <Panel>
            <p className="loading">Loading</p>
          </Panel>
        </Modal>
      )}

      {portalState.matches("completed") && (
        <Modal centered show>
          <Panel bumpkinParts={NPC_WEARABLES.wizard}>
            <div className="p-2">
              <p className="mb-2">
                {`Congratulations, you have completed today's challenge.`}
              </p>
              <p className="text-sm mb-1">
                Come back later for a brand new puzzle!
              </p>
              <Label type="info" icon={SUNNYSIDE.icons.timer}>
                {secondsToString(secondsTillReset(), { length: "medium" })}
              </Label>
            </div>
            <div className="flex">
              <Button onClick={goHome} className="mr-1">
                Go home
              </Button>
              <Button onClick={() => portalService.send("CONTINUE")}>
                Play again
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.context.state && (
        <>
          <CropBoomHud />
          <CropBoomPhaser />
        </>
      )}
    </div>
  );
};
