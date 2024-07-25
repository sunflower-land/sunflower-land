import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GameState } from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { Modal } from "components/ui/Modal";
import { DailyPuzzle } from "features/world/ui/beach/Digby";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";

const getMaxDigs = (game: GameState) => {
  let maxDigs = 25;

  if (isCollectibleBuilt({ name: "Heart of Davy Jones", game })) {
    maxDigs += 20;
  }

  return maxDigs;
};

export const DesertDiggingDisplay = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [show, setShow] = useState(false);
  const dugItems = gameState.context.state.desert.digging.grid.flat();
  const dugCount = gameState.context.state.desert.digging.grid.length;
  const newDigSite = dugCount === 0;

  const maxDigs = getMaxDigs(gameState.context.state);

  return (
    <>
      <div
        id="blahh"
        className="absolute top-36 left-4 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <Label
          type="default"
          icon={SUNNYSIDE.tools.sand_shovel}
          secondaryIcon={SUNNYSIDE.icons.expression_confused}
        >
          <span className="text">{`4 digs left`}</span>
        </Label>
        {/* <Label
          type="default"
          icon={SUNNYSIDE.icons.sad}
          secondaryIcon={SUNNYSIDE.icons.expression_confused}
        >
          <span className="text">{`No digs left...`}</span>
        </Label> */}
      </div>
      <Modal show={show}>
        <CloseButtonPanel bumpkinParts={NPC_WEARABLES.digby}>
          <DailyPuzzle />
        </CloseButtonPanel>
        {/* <CloseButtonPanel>
          <div className="p-1"></div>
        </CloseButtonPanel> */}
      </Modal>
    </>
  );
};
