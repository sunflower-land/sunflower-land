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
import { StateValues } from "features/game/lib/goblinMachine";
import { Forbidden } from "features/auth/components/Forbidden";

// const SHOW_MODAL: Record<StateValues, boolean> = {
const SHOW_MODAL: any = {
  readonly: true,
  loading: true,
  minting: true,
  minted: true,
  withdrawing: true,
  withdrawn: true,
  playing: false,
};

export const GoblinLand: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    scrollIntoView(Section.GoblinVillage, "auto");
  }, [scrollIntoView]);

  return (
    <div>
      <Modal show={SHOW_MODAL[goblinState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {/* Show Forbidden when in readonly state
              TODO: refactor readonly state and respective transitions in goblinMachine
          */}
          {goblinState.matches("readonly") && <Forbidden />}

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
      <Village />
    </div>
  );
};
