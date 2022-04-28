import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GoblinProvider";
import { StateValues } from "../game/lib/goblinMachine";
import { Panel } from "components/ui/Panel";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Loading } from "features/auth/components";
import { Minting } from "features/game/components/Minting";
import { Withdrawing } from "features/game/components/Withdrawing";

const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  minting: true,
  withdrawing: true,
  playing: false,
};

export const GoblinVillage: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  return (
    <div>
      <span>{JSON.stringify(goblinState.context.state)}</span>;
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
    </div>
  );
};
