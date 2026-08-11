import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  BED_FARMHAND_COUNT,
  getPlacedBedNames,
} from "features/game/types/beds";
import { BED_WIDTH } from "features/island/collectibles/components/Bed";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";

import { Modal } from "components/ui/Modal";
import { ButtonPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";

import type { BedName } from "features/game/types/game";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;
const _interiorCollectibles = (state: MachineState) =>
  state.context.state.interior.ground.collectibles;
const _levelOneCollectibles = (state: MachineState) =>
  state.context.state.interior.level_one?.collectibles;

interface Props {
  show: boolean;
  onHide: () => void;
}

type TabId = "beds" | "farmHands";

/** Who the equip modal is currently open for. The player's own Bumpkin has no
 *  id, hence the union rather than a nullable string. */
type Selected = { type: "bumpkin" } | { type: "farmHand"; id: string };

/**
 * "My Beds" modal, opened from the interior HUD (via InteriorBedsButton) and
 * from the Home page's farm hand row.
 *
 * Two tabs:
 *  - Beds — every bed type, which are placed, and who is sleeping in them.
 *  - Farm Hands — the player's Bumpkin and each farm hand on a button; picking
 *    one opens its equip screen. This replaced the floating farm hand row that
 *    used to sit in the interior HUD.
 */
export const BedsMigrationModal: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [tab, setTab] = useState<TabId>("beds");
  const [selected, setSelected] = useState<Selected>();

  const bumpkin = useSelector(gameService, _bumpkin);
  const farmHands = useSelector(gameService, _farmHands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);
  const interiorCollectibles = useSelector(gameService, _interiorCollectibles);
  const levelOneCollectibles = useSelector(gameService, _levelOneCollectibles);

  const count = getKeys(farmHands).length + 1;
  const max = Object.keys(BED_FARMHAND_COUNT).length;

  // Beds placed anywhere count — farm, home interior and both /interior floors.
  const uniqueBeds = getPlacedBedNames({
    collectibles,
    home: { collectibles: homeCollectibles },
    interior: {
      ground: { collectibles: interiorCollectibles },
      level_one: levelOneCollectibles
        ? { collectibles: levelOneCollectibles }
        : undefined,
    },
  });

  const beds = getKeys(BED_FARMHAND_COUNT)
    .sort((a, b) => BED_FARMHAND_COUNT[a] - BED_FARMHAND_COUNT[b])
    .filter((bedName) => uniqueBeds.has(bedName));

  const unplacedBeds = getKeys(BED_FARMHAND_COUNT).filter(
    (bed) => !beds.includes(bed),
  );

  // Occupants are handed out in order: the player first, then each farm hand,
  // filling placed beds before unplaced ones.
  const occupants = [bumpkin, ...Object.values(farmHands)].map(
    (f) => f.equipped,
  );

  const selectedEquipment =
    selected?.type === "farmHand"
      ? farmHands[selected.id]?.equipped
      : bumpkin?.equipped;

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <CloseButtonPanel
          onClose={onHide}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              id: "beds",
              icon: ITEM_DETAILS["Basic Bed"].image,
              name: t("beds"),
            },
            {
              id: "farmHands",
              icon: SUNNYSIDE.icons.player,
              name: t("farmHands"),
            },
          ]}
        >
          <div className="p-1 flex justify-end">
            <Label type="default" icon={SUNNYSIDE.icons.player}>
              {t("bedsMigration.farmHandCount", { count, max })}
            </Label>
          </div>

          {tab === "beds" && (
            <>
              <div className="flex p-2 flex-col space-y-1 mb-2 text-xs">
                <span>{t("bedsMigration.bedsNeededDescription")}</span>
                <span>{t("bedsMigration.bedsNeededDescription2")}</span>
              </div>
              <div className="grid grid-cols-4 mb-2 w-full">
                {beds.map((bed, i) => (
                  <BedCell
                    bed={bed}
                    equipment={occupants[i]}
                    isPlaced
                    key={bed}
                  />
                ))}
                {unplacedBeds.map((bed, i) => (
                  <BedCell
                    bed={bed}
                    equipment={occupants.slice(beds.length)[i]}
                    isPlaced={false}
                    key={bed}
                  />
                ))}
              </div>
            </>
          )}

          {tab === "farmHands" && (
            <div className="p-1 flex flex-col gap-2 mb-1">
              <p className="text-xs">
                {t("bedsMigration.bedsNeededDescription3")}
              </p>
              <div className="grid grid-cols-3 gap-1">
                <FarmHandCell
                  equipment={bumpkin?.equipped}
                  name={t("you")}
                  onClick={() => setSelected({ type: "bumpkin" })}
                />
                {getKeys(farmHands).map((id) => (
                  <FarmHandCell
                    key={id}
                    equipment={farmHands[id].equipped}
                    name={`${t("farmHand")} #${id}`}
                    onClick={() => setSelected({ type: "farmHand", id })}
                  />
                ))}
              </div>
            </div>
          )}
        </CloseButtonPanel>
      </Modal>

      <Modal show={!!selected} onHide={() => setSelected(undefined)} size="lg">
        <CloseButtonPanel
          bumpkinParts={selectedEquipment}
          onClose={() => setSelected(undefined)}
          onBack={() => setSelected(undefined)}
          tabs={[
            { id: "equip", icon: SUNNYSIDE.icons.wardrobe, name: t("equip") },
          ]}
        >
          <BumpkinEquip
            farmHandId={selected?.type === "farmHand" ? selected.id : undefined}
            equipment={selectedEquipment as BumpkinParts}
            onEquip={(equipment) => {
              if (selected?.type === "farmHand") {
                gameService.send("farmHand.equipped", {
                  id: selected.id,
                  equipment,
                });
              } else {
                gameService.send("bumpkin.equipped", { equipment });
              }
            }}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

/** One selectable Bumpkin / farm hand in the Farm Hands tab. */
const FarmHandCell: React.FC<{
  equipment?: BumpkinParts;
  name: string;
  onClick: () => void;
}> = ({ equipment, name, onClick }) => (
  <ButtonPanel
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 py-2"
  >
    {equipment && <NPCIcon key={JSON.stringify(equipment)} parts={equipment} />}
    <span className="text-xxs text-center">{name}</span>
  </ButtonPanel>
);

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
