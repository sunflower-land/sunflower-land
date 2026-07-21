import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "lib/object";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { BedsMigrationModal } from "./BedsMigrationModal";
import { Button } from "components/ui/Button";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import type { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import type { PlaceableLocation } from "features/game/types/collectibles";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _farmHands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

type Props = {
  location?: Extract<PlaceableLocation, "home" | "interior" | "level_one">;
};

export const InteriorBumpkins: React.FC<Props> = ({ location = "home" }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = React.useState(false);
  const [showBuyFarmHand, setShowBuyFarmHandModal] = React.useState(false);
  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = useSelector(gameService, _bumpkin);
  const farmHands = useSelector(gameService, _farmHands);
  const isLandscaping = useSelector(gameService, _isLandscaping);

  const unplacedFarmHandIds = getKeys(farmHands).filter(
    (id) => !farmHands[id].coordinates,
  );

  const handlePlaceFarmHand = (id: string) => {
    const landscaping = gameService.getSnapshot().children
      .landscaping as MachineInterpreter;
    landscaping.send("SELECT", {
      placeable: { name: "FarmHand", id },
      action: "farmHand.placed",
      requirements: { coins: 0, ingredients: {} },
    });
  };

  const handlePlaceBumpkin = () => {
    const landscaping = gameService.getSnapshot().children
      .landscaping as MachineInterpreter;
    landscaping.send("SELECT", {
      placeable: { name: "Bumpkin" },
      action: "bumpkin.placed",
      requirements: { coins: 0, ingredients: {} },
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-end gap-2 max-w-[70vw]">
        <div
          className="flex flex-wrap"
          style={{ rowGap: `${32 * PIXEL_SCALE}px` }}
        >
          {(!isLandscaping ||
            !bumpkin.coordinates ||
            bumpkin.location !== location) && (
            <div
              className={classNames(
                "mr-2",
                isLandscaping && bumpkin.coordinates
                  ? "cursor-not-allowed opacity-75"
                  : "cursor-pointer",
              )}
              onClick={() => {
                if (isLandscaping && !bumpkin.coordinates) {
                  handlePlaceBumpkin();
                } else if (!isLandscaping) {
                  setShowBumpkinModal(true);
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
              {isLandscaping && !bumpkin.coordinates && (
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
          )}

          {unplacedFarmHandIds.map((id) => (
            <div
              key={id}
              className="mr-2 cursor-pointer relative"
              onClick={() => {
                if (isLandscaping) {
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

              {isLandscaping && (
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

      {/* Shared with the interior HUD's beds button — see BedsMigrationModal. */}
      <BedsMigrationModal
        show={showBuyFarmHand}
        onHide={() => setShowBuyFarmHandModal(false)}
      />

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
            farmHandId={undefined}
            equipment={bumpkin?.equipped as BumpkinParts}
            onEquip={(equipment) => {
              gameService.send("bumpkin.equipped", {
                equipment,
              });
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
            farmHandId={selectedFarmHandId as string}
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
