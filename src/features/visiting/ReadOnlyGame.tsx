import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { Panel } from "components/ui/Panel";

import { Context } from "features/game/VisitingProvider";
import { Loading } from "features/auth/components";
import { StateValues } from "features/game/lib/visitingMachine";
import { Hud } from "./hud/Hud";
import { Crops } from "./crops/Crops";
import { Water } from "./water/Water";
import { Animals } from "./animals/Animals";
import { Decorations } from "features/game/components/Decorations";
import { Forest } from "./forest/Forest";
import { Quarry } from "./quarry/Quarry";
import { Lore } from "features/game/components/Lore";
import { Town } from "./town/Town";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ErrorCode } from "lib/errors";
import { TeamDonation } from "./teamDonation/TeamDonation";
import { House } from "features/farming/house/House";
import { Blacklisted } from "./Blacklisted";

const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  error: true,
  blacklisted: true,
  visiting: false,
};

export const ReadOnlyGame: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel className="text-shadow">
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("blacklisted") && <Blacklisted />}
          {gameState.matches("error") && (
            <ErrorMessage
              errorCode={gameState.context.errorCode as ErrorCode}
            />
          )}
        </Panel>
      </Modal>

      <Hud />
      <Crops />
      <TeamDonation />
      <Water />
      <Animals />
      <Decorations state={gameState.context.state} />
      <Forest />
      <Quarry />
      <Lore />
      <Town />
      <House state={gameState.context.state} />
    </>
  );
};
