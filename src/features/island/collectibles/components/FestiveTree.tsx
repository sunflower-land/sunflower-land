import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import festiveTreeImage from "assets/sfts/festive_tree.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import Modal from "react-bootstrap/esm/Modal";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  id: string;
}

export const FestiveTree: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);
  const trees = gameState.context.state.collectibles["Festive Tree"] ?? [];

  useUiRefresher();

  const date = new Date();

  const hasShakenRecently = trees.some((tree) => !!tree.shakenAt);

  const [isRevealing, setIsRevealing] = useState(false);

  const shake = () => {
    setIsRevealing(true);

    if (hasShakenRecently) {
      setShowModal(true);
      return;
    }

    gameService.send("REVEAL", {
      event: {
        type: "festiveTree.shook",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <>
      <Modal centered show={showModal}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.santa}
          onClose={() => setShowModal(false)}
        >
          <div className="p-2">
            <Label type="danger">Greedy Bumpkin Detected</Label>
            <p className="text-sm">
              Wait until next Christmas for more festivities.
            </p>
          </div>
        </CloseButtonPanel>
      </Modal>
      <div
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": true,
        })}
        onClick={shake}
      >
        <img
          src={festiveTreeImage}
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute pointer-events-none"
          alt="Festive Tree"
        />
      </div>

      {gameState.matches("revealing") && isRevealing && (
        <Modal show centered>
          <Panel bumpkinParts={NPC_WEARABLES.santa}>
            <Revealing icon={festiveTreeImage} />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show centered>
          <Panel bumpkinParts={NPC_WEARABLES.santa}>
            <Revealed onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </>
  );
};
