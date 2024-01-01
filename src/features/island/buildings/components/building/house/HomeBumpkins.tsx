import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin, GameState } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { PlayerNPC } from "features/island/bumpkin/components/PlayerNPC";

interface Props {
  game: GameState;
}
export const HomeBumpkins: React.FC<Props> = ({ game }) => {
  const { gameService } = useContext(Context);

  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = game.bumpkin as Bumpkin;
  return (
    <>
      <div className="flex w-full">
        <div className="mr-2 relative" style={{ width: `${GRID_WIDTH_PX}px` }}>
          <PlayerNPC parts={bumpkin.equipped} />
        </div>

        {getKeys(game.farmHands).map((id) => (
          <div
            key={id}
            className="mr-2 cursor-pointer relative"
            onClick={() => setSelectedFarmHandId(id)}
            style={{ width: `${GRID_WIDTH_PX}px` }}
          >
            <NPC
              key={JSON.stringify(game.farmHands[id].equipped)}
              parts={game.farmHands[id].equipped}
            />
          </div>
        ))}
      </div>

      <Modal
        centered
        show={!!selectedFarmHandId}
        onHide={() => setSelectedFarmHandId(undefined)}
      >
        <CloseButtonPanel
          bumpkinParts={game.farmHands[selectedFarmHandId as string]?.equipped}
        >
          <BumpkinEquip
            game={game}
            equipment={game.farmHands[selectedFarmHandId as string]?.equipped}
            onEquip={(equipment) => {
              gameService.send("farmHand.equipped", {
                id: selectedFarmHandId,
                equipment,
              });
            }}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
