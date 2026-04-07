import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";
import {
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
} from "features/game/types/salt";
import { SaltNodeModalPanel } from "./SaltNodeModalPanel";

interface Props {
  id: string;
  visiting: boolean;
}

const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];

const _gameState = (state: MachineState) => state.context.state;

export const SaltNode: React.FC<Props> = ({ id, visiting }) => {
  const { gameService, showAnimations } = useContext(Context);
  const node = useSelector(gameService, _node(id));
  const gameState = useSelector(gameService, _gameState);
  const now = useNow({ live: true });
  const [showModal, setShowModal] = useState(false);

  const hasUnstartedStoredCharges = useMemo(() => {
    if (!node) return false;
    const chargeIntervalMs = getSaltChargeGenerationTime({ gameState });
    return getStoredSaltCharges(node, now, { chargeIntervalMs }) > 0;
  }, [node, now, gameState]);

  if (!node) return null;

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => !visiting && setShowModal(true)}
      >
        {hasUnstartedStoredCharges && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className={showAnimations ? "ready" : ""}
              style={{ width: `${PIXEL_SCALE * 4}px` }}
            />
          </div>
        )}
        <img src={ITEM_DETAILS.Salt.image} width={PIXEL_SCALE * 16} />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <SaltNodeModalPanel onClose={() => setShowModal(false)} id={id} />
      </Modal>
    </div>
  );
};
