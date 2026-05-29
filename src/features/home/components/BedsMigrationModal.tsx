import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { BED_WIDTH } from "features/island/collectibles/components/Bed";
import { NPCIcon } from "features/island/bumpkin/components/NPC";

import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

import type { BedName } from "features/game/types/game";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;

interface Props {
  show: boolean;
  onHide: () => void;
}

/**
 * Beds-migration modal listing every bed type the player needs to craft to
 * unlock more farm hands, along with the current occupancy. Lives in
 * features/home for historical reasons but is rendered from both the Home
 * page (via InteriorBumpkins) and the Interior HUD (via InteriorBedsButton).
 */
export const BedsMigrationModal: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const bumpkin = useSelector(gameService, _bumpkin);
  const farmHands = useSelector(gameService, _farmHands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);

  const count = getKeys(farmHands).length + 1;
  const max = Object.keys(BED_FARMHAND_COUNT).length;

  const uniqueBeds = new Set<BedName>([
    ...(getKeys(collectibles).filter(
      (n) => n in BED_FARMHAND_COUNT,
    ) as BedName[]),
    ...(getKeys(homeCollectibles).filter(
      (n) => n in BED_FARMHAND_COUNT,
    ) as BedName[]),
  ]);

  const beds = getKeys(BED_FARMHAND_COUNT)
    .sort((a, b) => BED_FARMHAND_COUNT[a] - BED_FARMHAND_COUNT[b])
    .filter((bedName) => uniqueBeds.has(bedName));

  return (
    <Modal show={show} onHide={onHide}>
      <Panel>
        <div className="p-1 flex justify-between">
          <Label type="default" icon={ITEM_DETAILS["Basic Bed"].image}>
            {t("bedsMigration.label")}
          </Label>
          <Label type="default" icon={SUNNYSIDE.icons.player}>
            {t("bedsMigration.farmHandCount", { count, max })}
          </Label>
        </div>
        <div className="flex p-2 flex-col space-y-1 mb-2 text-xs">
          <span>{t("bedsMigration.bedsNeededDescription")}</span>
          <span>{t("bedsMigration.bedsNeededDescription2")}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-4 mb-2 w-full">
            {beds.map((bed, i) => {
              const equipment = [bumpkin, ...Object.values(farmHands)].map(
                (f) => f.equipped,
              )[i];
              return (
                <BedCell
                  bed={bed}
                  equipment={equipment}
                  isPlaced
                  key={bed}
                />
              );
            })}
            {getKeys(BED_FARMHAND_COUNT)
              .filter((bed) => !beds.includes(bed))
              .map((bed, i) => {
                const equipment = [bumpkin, ...Object.values(farmHands)]
                  .map((f) => f.equipped)
                  .slice(beds.length)[i];
                return (
                  <BedCell
                    bed={bed}
                    equipment={equipment}
                    isPlaced={false}
                    key={bed}
                  />
                );
              })}
          </div>
        </div>

        <Button onClick={onHide}>{t("close")}</Button>
      </Panel>
    </Modal>
  );
};

const BedCell: React.FC<{
  bed: BedName;
  equipment?: BumpkinParts;
  isPlaced: boolean;
}> = ({ bed, equipment, isPlaced }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col items-center w-full" key={bed}>
      <Label type={isPlaced ? (equipment ? "warning" : "success") : "default"}>
        <span className="text-xxs">
          {isPlaced
            ? equipment
              ? t("bedsMigration.status.occupied")
              : t("bedsMigration.status.unoccupied")
            : t("bedsMigration.status.notPlaced")}
        </span>
      </Label>
      <span className="text-xxs text-center">{bed.split(" ")[0]}</span>
      <span className="text-xxs text-center mb-1">{bed.split(" ")[1]}</span>

      <div
        className="flex justify-center relative"
        style={{ width: `${22 * PIXEL_SCALE}px` }}
      >
        <img
          src={ITEM_DETAILS[bed].image}
          style={{ width: `${BED_WIDTH[bed] * PIXEL_SCALE}px` }}
          className={isPlaced ? "opacity-100" : "opacity-50"}
        />
        {equipment && (
          <div className="absolute">
            <NPCIcon key={JSON.stringify(equipment)} parts={equipment} />
          </div>
        )}
      </div>
    </div>
  );
};
