import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BedName } from "features/game/types/game";
import { NPCIcon, NPCPlaceable } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { BED_WIDTH } from "features/island/collectibles/components/Bed";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { hasFeatureAccess } from "lib/flags";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");
const _gameState = (state: MachineState) => state.context.state;

export const InteriorBumpkins: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = React.useState(false);
  const [showBuyFarmHand, setShowBuyFarmHandModal] = React.useState(false);
  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = useSelector(gameService, _bumpkin);
  const farmHands = useSelector(gameService, _farmHands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const gameState = useSelector(gameService, _gameState);

  const hasFarmHandPlacement =
    isLandscaping && hasFeatureAccess(gameState, "PLACE_FARM_HAND");

  const unplacedFarmHandIds = getKeys(farmHands).filter(
    (id) => !farmHands[id].coordinates,
  );

  const count = getKeys(farmHands).length + 1;
  const max = Object.keys(BED_FARMHAND_COUNT).length;

  const uniqueBedCollectibles = getKeys(collectibles).filter(
    (collectible) => collectible in BED_FARMHAND_COUNT,
  );
  const uniqueHomeBedCollectibles = getKeys(homeCollectibles).filter(
    (collectible) => collectible in BED_FARMHAND_COUNT,
  );
  const uniqueBeds = new Set([
    ...uniqueBedCollectibles,
    ...uniqueHomeBedCollectibles,
  ]);

  const beds = getKeys(BED_FARMHAND_COUNT)
    .sort((a, b) => BED_FARMHAND_COUNT[a] - BED_FARMHAND_COUNT[b])
    .filter((bedName) => uniqueBeds.has(bedName));

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
      <div className="flex justify-between items-end">
        <div className="flex">
          {!isLandscaping && (
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
                <NPCPlaceable
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
          )}

          {unplacedFarmHandIds.map((id) => (
            <div
              key={id}
              className="mr-2 cursor-pointer relative"
              onClick={() => {
                if (hasFarmHandPlacement) {
                  handlePlaceFarmHand(id);
                } else if (!isLandscaping) {
                  setSelectedFarmHandId(id);
                }
              }}
            >
              <div
                className="absolute"
                style={{
                  top: `${-12 * PIXEL_SCALE}px`,
                }}
              >
                <NPCPlaceable
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

              {hasFarmHandPlacement && (
                <img
                  src={SUNNYSIDE.icons.click_icon}
                  className="absolute z-10 animate-float"
                  style={{
                    width: `${10 * PIXEL_SCALE}px`,
                    top: `${-13 * PIXEL_SCALE}px`,
                    left: `${4 * PIXEL_SCALE}px`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {!isLandscaping && (
          <div>
            <Button
              onClick={() => setShowBuyFarmHandModal(true)}
              className="h-8"
            >
              <span>{`${t("add")} ${t("farmHand")}`}</span>
            </Button>
          </div>
        )}
      </div>

      <Modal
        show={showBuyFarmHand}
        onHide={() => setShowBuyFarmHandModal(false)}
      >
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
            <span className="">{t("bedsMigration.bedsNeededDescription")}</span>
            <span className="">
              {t("bedsMigration.bedsNeededDescription2")}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex start"></div>

            <div className="grid grid-cols-4 mb-2 w-full">
              {beds.map((bed, i) => {
                const equipments = [bumpkin, ...Object.values(farmHands)].map(
                  (f) => f.equipped,
                );

                const equipment = equipments[i];

                return (
                  <InteriorBed
                    bed={bed}
                    equipment={equipment}
                    isPlaced={true}
                    key={bed}
                  />
                );
              })}
              {getKeys(BED_FARMHAND_COUNT)
                .filter((bed) => !beds.includes(bed))
                .map((bed, i) => {
                  const equipments = [bumpkin, ...Object.values(farmHands)]
                    .map((f) => f.equipped)
                    .slice(beds.length);

                  const equipment = equipments[i];

                  return (
                    <InteriorBed
                      bed={bed}
                      equipment={equipment}
                      isPlaced={false}
                      key={bed}
                    />
                  );
                })}
            </div>
          </div>

          <Button onClick={() => setShowBuyFarmHandModal(false)}>
            {t("close")}
          </Button>
        </Panel>
      </Modal>

      <Modal
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
        size="lg"
      >
        <CloseButtonPanel
          bumpkinParts={bumpkin?.equipped}
          onClose={() => setShowBumpkinModal(false)}
          tabs={[
            {
              id: "equip",
              icon: SUNNYSIDE.icons.wardrobe,
              name: t("equip"),
            },
          ]}
        >
          <BumpkinEquip
            equipment={bumpkin?.equipped as BumpkinParts}
            onEquip={(equipment) => {
              gameService.send({ type: "bumpkin.equipped", equipment });
            }}
          />
        </CloseButtonPanel>
      </Modal>

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

const InteriorBed: React.FC<{
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
      <span className={`text-xxs text-center`}>{bed.split(" ")[0]}</span>
      <span className={`text-xxs text-center mb-1`}>{bed.split(" ")[1]}</span>

      <div
        className="flex justify-center relative"
        key={bed}
        style={{
          width: `${22 * PIXEL_SCALE}px`,
        }}
      >
        <div>
          <img
            src={ITEM_DETAILS[bed as BedName].image}
            style={{
              width: `${BED_WIDTH[bed as BedName] * PIXEL_SCALE}px`,
            }}
            className={`${isPlaced ? "opacity-100" : "opacity-50"}`}
          />
        </div>
        {equipment && (
          <div className="absolute">
            <NPCIcon key={JSON.stringify(equipment)} parts={equipment} />
          </div>
        )}
      </div>
    </div>
  );
};
