import React, { useContext, useEffect } from "react";
import Modal from "react-bootstrap/esm/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GoblinProvider";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Village } from "./village/Village";
import { Loading } from "features/auth/components";
import { Panel } from "components/ui/Panel";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ErrorCode } from "lib/errors";
import { Minting } from "features/game/components/Minting";
import { Minted } from "features/game/components/Minted";
import { Withdrawing } from "features/game/components/Withdrawing";
import { Withdrawn } from "features/game/components/Withdrawn";
import {
  GoblinMachineState,
  StateValues,
} from "features/game/lib/goblinMachine";
import { screenTracker } from "lib/utils/screen";
import * as AuthProvider from "features/auth/lib/Provider";

// const SHOW_MODAL: Record<StateValues, boolean> = {
const SHOW_MODAL: Partial<Record<StateValues, boolean>> = {
  loading: true,
  minting: true,
  minted: true,
  withdrawing: true,
  withdrawn: true,
  playing: false,
  error: true,
};

export const GoblinLand: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    scrollIntoView(Section.GoblinVillage, "auto");
  }, [scrollIntoView]);

  useEffect(() => {
    screenTracker.start(authService);

    // cleanup on every gameState update
    return () => {
      screenTracker.pause();
    };
  }, [authService]);

  return (
    <div>
      <Modal show={SHOW_MODAL[goblinState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {goblinState.matches("loading") && <Loading />}
          {goblinState.matches("error") && (
            <ErrorMessage
              errorCode={goblinState.context.errorCode as ErrorCode}
            />
          )}
          {goblinState.matches("minting") && <Minting />}
          {goblinState.matches("minted") && <Minted />}
          {goblinState.matches("withdrawing") && <Withdrawing />}
          {goblinState.matches("withdrawn") && <Withdrawn />}
        </Panel>
      </Modal>
      <Village state={goblinState.value as GoblinMachineState["value"]} />
    </div>
  );
};
