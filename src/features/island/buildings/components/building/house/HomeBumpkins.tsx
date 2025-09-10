import { GRID_WIDTH_PX } from "features/game/lib/constants";
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

interface Props {
  game: GameState;
}

const FARM_HANDS_PER_BUILDING: Record<IslandType, number> = {
  basic: 1,
  spring: 2,
  desert: 3,
  volcano: 4,
};

export const HomeBumpkins: React.FC<Props> = ({ game }) => {
  const { gameService } = useContext(Context);

  const [selectedFarmHandId, setSelectedFarmHandId] = useState<string>();
  const { isVisiting } = useVisiting();

  const bumpkin = game.bumpkin as Bumpkin;

  const farmHands = game.farmHands.bumpkins;

  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex w-full">
        <div className="mr-1 relative" style={{ width: `${GRID_WIDTH_PX}px` }}>
          <PlayerNPC parts={bumpkin.equipped} />
        </div>

        {getKeys(farmHands)
          .slice(0, FARM_HANDS_PER_BUILDING[game.island.type])
          .map((id) => (
            <div
              key={id}
              className={classNames("mr-1 cursor-pointer relative", {
                "pointer-events-none": isVisiting,
                "hover:img-highlight": !isVisiting,
              })}
              onClick={() => setSelectedFarmHandId(id)}
              style={{ width: `${GRID_WIDTH_PX}px` }}
            >
              <NPCPlaceable
                key={JSON.stringify(farmHands[id].equipped)}
                parts={farmHands[id].equipped}
              />
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
              icon: SUNNYSIDE.icons.wardrobe,
              name: t("equip"),
            },
          ]}
        >
          <BumpkinEquip
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
