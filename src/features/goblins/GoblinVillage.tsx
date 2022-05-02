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
import { Tailor } from "features/goblins/tailor/Tailor";
import { WishingWell } from "features/goblins/wishingWell/WishingWell";
import { GoblinBlacksmith } from "features/goblins/goblin_blacksmith/GoblinBlacksmith";
import { Bank } from "features/goblins/bank/Bank";
import { Market } from "./market/Market";
import { Barn } from "./barn/Barn";

// const SHOW_MODAL: Record<StateValues, boolean> = {
const SHOW_MODAL: any = {
  loading: true,
  minting: true,
  withdrawing: true,
  playing: false,
};

export const GoblinVillage: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  console.log({ rareItems: goblinState.context.rareItems });

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
      <WishingWell />
      <Tailor />
      <GoblinBlacksmith />
      <Bank />
      <Market />
      <Barn />
    </div>
  );
};
