import { SUNNYSIDE } from "assets/sunnyside";
import plusIcon from "assets/icons/plus.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin, GameState } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";

interface Props {
  game: GameState;
  onAdd: () => void;
}
export const InteriorBumpkins: React.FC<Props> = ({ game, onAdd }) => {
  const { gameService } = useContext(Context);

  console.log({ game });

  const [showBumpkinModal, setShowBumpkinModal] = React.useState(false);
  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = game.bumpkin as Bumpkin;

  const farmHands = game.farmHands.bumpkins;

  return (
    <>
      <div className="flex">
        <div
          className="mr-2 cursor-pointer"
          onClick={() => setShowBumpkinModal(true)}
        >
          <div
            className="absolute"
            style={{
              top: `${-12 * PIXEL_SCALE}px`,
            }}
          >
            <NPC
              key={JSON.stringify(bumpkin.equipped)}
              parts={bumpkin.equipped}
            />
          </div>

          <img
            src={SUNNYSIDE.icons.disc}
            style={{
              width: `${18 * PIXEL_SCALE}px`,
              bottom: 0,
            }}
          />
        </div>

        {getKeys(farmHands).map((id) => (
          <div
            key={id}
            className="mr-2 cursor-pointer"
            onClick={() => setSelectedFarmHandId(id)}
          >
            <div
              className="absolute"
              style={{
                top: `${-12 * PIXEL_SCALE}px`,
              }}
            >
              <NPC
                key={JSON.stringify(farmHands[id].equipped)}
                parts={farmHands[id].equipped}
              />
            </div>

            <img
              src={SUNNYSIDE.icons.disc}
              style={{
                width: `${18 * PIXEL_SCALE}px`,
                bottom: 0,
              }}
            />
          </div>
        ))}

        <div className="cursor-pointer relative" onClick={onAdd}>
          <img
            src={plusIcon}
            className="absolute"
            style={{
              width: `${10 * PIXEL_SCALE}px`,
              left: `${4 * PIXEL_SCALE}px`,
              bottom: `${5 * PIXEL_SCALE}px`,
            }}
          />

          <img
            src={SUNNYSIDE.icons.disc}
            style={{
              width: `${18 * PIXEL_SCALE}px`,
              bottom: 0,
            }}
          />
        </div>
      </div>
      <Modal
        centered
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
      >
        <CloseButtonPanel bumpkinParts={game.bumpkin?.equipped}>
          Bumpkin
        </CloseButtonPanel>
      </Modal>

      <Modal
        centered
        show={!!selectedFarmHandId}
        onHide={() => setSelectedFarmHandId(undefined)}
      >
        <CloseButtonPanel
          bumpkinParts={farmHands[selectedFarmHandId as string]?.equipped}
        >
          <BumpkinEquip
            game={game}
            equipment={farmHands[selectedFarmHandId as string]?.equipped}
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
