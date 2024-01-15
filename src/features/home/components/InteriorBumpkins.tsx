import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin, GameState } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ISLAND_BUMPKIN_CAPACITY } from "features/game/events/landExpansion/buyFarmHand";
import { BuyFarmHand } from "./BuyFarmHand";

interface Props {
  game: GameState;
}
export const InteriorBumpkins: React.FC<Props> = ({ game }) => {
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = React.useState(false);
  const [showBuyFarmHand, setShowBuyFarmHandModal] = React.useState(false);
  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = game.bumpkin as Bumpkin;

  const farmHands = game.farmHands.bumpkins;

  return (
    <>
      <div className="flex justify-between">
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
        </div>
        <div>
          <Label type="chill" icon={SUNNYSIDE.icons.player}>
            {`${getKeys(farmHands).length + 1}/${
              ISLAND_BUMPKIN_CAPACITY[game.island.type]
            } Bumpkins`}
          </Label>
          <Button onClick={() => setShowBuyFarmHandModal(true)} className="h-8">
            <span>Add</span>
          </Button>
        </div>
      </div>

      <Modal
        centered
        show={showBuyFarmHand}
        onHide={() => setShowBuyFarmHandModal(false)}
      >
        <BuyFarmHand
          gameState={game}
          onClose={() => setShowBuyFarmHandModal(false)}
        />
      </Modal>

      <Modal
        centered
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
      >
        <CloseButtonPanel bumpkinParts={game.bumpkin?.equipped}>
          <BumpkinEquip
            game={game}
            equipment={game.bumpkin?.equipped as BumpkinParts}
            onEquip={(equipment) => {
              gameService.send("bumpkin.equipped", {
                equipment,
              });
            }}
          />
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
