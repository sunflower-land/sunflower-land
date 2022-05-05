import React, { useContext, useEffect } from "react";
import Modal from "react-bootstrap/esm/Modal";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GoblinProvider";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Village } from "./village/Village";
import { StateValues } from "features/game/lib/goblinMachine";
import { Loading } from "features/auth/components";
import { Panel } from "components/ui/Panel";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ErrorCode } from "lib/errors";
import { Minting } from "features/game/components/Minting";
import { Withdrawing } from "features/game/components/Withdrawing";

// const SHOW_MODAL: Record<StateValues, boolean> = {
const SHOW_MODAL: any = {
  loading: true,
  minting: true,
  withdrawing: true,
  playing: false,
};

export const GoblinLand: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();

  console.log({ goblinState });

  useEffect(() => {
    scrollIntoView(Section.GoblinVillage, "auto");
  }, [scrollIntoView]);

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
          {goblinState.matches("withdrawing") && <Withdrawing />}
        </Panel>
      </Modal>
      <Village />
    </div>
  );
};
