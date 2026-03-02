import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin, GameState, IslandType } from "features/game/types/game";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { PlayerNPC } from "features/island/bumpkin/components/PlayerNPC";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import classNames from "classnames";
import { useVisiting } from "lib/utils/visitUtils";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

interface Props {
  game: GameState;
}

const BACKYARD_CAPACITY: Record<IslandType, number> = {
  basic: 2,
  spring: 2,
  desert: 3,
  volcano: 4,
};

const _isLandscaping = (state: MachineState) => state.matches("landscaping");
const _gameState = (state: MachineState) => state.context.state;

export const HomeBumpkins: React.FC<Props> = ({ game }) => {
  const { gameService } = useContext(Context);
  const { isVisiting } = useVisiting();
  const { t } = useAppTranslation();

  const [selectedFarmHandId, setSelectedFarmHandId] = useState<string>();

  const isLandscaping = useSelector(gameService, _isLandscaping);
  const gameState = useSelector(gameService, _gameState);

  const hasFarmHandPlacement =
    isLandscaping && hasFeatureAccess(gameState, "PLACE_FARM_HAND");

  const bumpkin = game.bumpkin as Bumpkin;
  const farmHands = game.farmHands.bumpkins;

  const unplacedFarmHandIds = getKeys(farmHands)
    .filter((id) => !farmHands[id].coordinates)
    .slice(0, BACKYARD_CAPACITY[game.island.type]);

  const handlePlaceFarmHand = (id: string) => {
    const landscaping = gameService.getSnapshot().children
      .landscaping as MachineInterpreter;
    landscaping.send("SELECT", {
      placeable: { name: "FarmHand", id },
      action: "farmHand.placed",
      requirements: { coins: 0, ingredients: {} },
    });
  };

  return (
    <>
      <div className="flex w-full">
        <div
          className={classNames("mr-1 relative", {
            "pointer-events-none": isLandscaping,
          })}
          style={{ width: `${GRID_WIDTH_PX}px` }}
        >
          <PlayerNPC parts={bumpkin.equipped} />
        </div>

        {unplacedFarmHandIds.map((id) => (
          <div
            key={id}
            className={classNames("mr-1 cursor-pointer relative", {
              "pointer-events-none": isVisiting,
              "hover:img-highlight": !isVisiting && !isLandscaping,
            })}
            onClick={() => {
              if (hasFarmHandPlacement) {
                handlePlaceFarmHand(id);
              } else if (!isLandscaping) {
                setSelectedFarmHandId(id);
              }
            }}
            style={{ width: `${GRID_WIDTH_PX}px` }}
          >
            <NPCPlaceable
              key={JSON.stringify(farmHands[id].equipped)}
              parts={farmHands[id].equipped}
            />

            {hasFarmHandPlacement && (
              <img
                src={SUNNYSIDE.icons.click_icon}
                className="absolute z-10 animate-float"
                style={{
                  width: `${10 * PIXEL_SCALE}px`,
                  top: `${-6 * PIXEL_SCALE}px`,
                  left: `${4 * PIXEL_SCALE}px`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <Modal
        show={!!selectedFarmHandId}
        onHide={() => setSelectedFarmHandId(undefined)}
        size="lg"
      >
        <CloseButtonPanel
          bumpkinParts={farmHands[selectedFarmHandId as string]?.equipped}
          onClose={() => setSelectedFarmHandId(undefined)}
          tabs={[
            {
              id: "equip",
              icon: SUNNYSIDE.icons.wardrobe,
              name: t("equip"),
            },
          ]}
        >
          <BumpkinEquip
            equipment={farmHands[selectedFarmHandId as string]?.equipped}
            onEquip={(equipment) => {
              gameService.send({
                type: "farmHand.equipped",
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
