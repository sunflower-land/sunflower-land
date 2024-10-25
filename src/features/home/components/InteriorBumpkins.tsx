import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Bumpkin, GameState } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ISLAND_BUMPKIN_CAPACITY } from "features/game/events/landExpansion/buyFarmHand";
import { BuyFarmHand } from "./BuyFarmHand";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  game: GameState;
}
export const InteriorBumpkins: React.FC<Props> = ({ game }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = React.useState(false);
  const [showBuyFarmHand, setShowBuyFarmHandModal] = React.useState(false);
  const [selectedFarmHandId, setSelectedFarmHandId] = React.useState<string>();

  const bumpkin = game.bumpkin as Bumpkin;

  const farmHands = game.farmHands.bumpkins;

  const hasBedsAccess = hasFeatureAccess(game, "BEDS");

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
        <div className="space-y-1">
          <Label type="chill" icon={SUNNYSIDE.icons.player}>
            {`${getKeys(farmHands).length + 1}/${
              ISLAND_BUMPKIN_CAPACITY[game.island.type]
            } Bumpkins`}
          </Label>
          <Button onClick={() => setShowBuyFarmHandModal(true)} className="h-8">
            <span>{t("add")}</span>
          </Button>
        </div>
      </div>

      <Modal
        show={showBuyFarmHand}
        onHide={() => setShowBuyFarmHandModal(false)}
      >
        {hasBedsAccess ? (
          <CloseButtonPanel
            onClose={() => setShowBuyFarmHandModal(false)}
            title={"Beds Needed!"}
          >
            <div className="flex flex-col items-center">
              <div className="p-2">
                <div className="flex justify-center mb-2">
                  <img
                    src={ITEM_DETAILS["Basic Bed"].image}
                    className="w-12 mx-1"
                  />
                  <img
                    src={ITEM_DETAILS["Sturdy Bed"].image}
                    className="w-12 mx-1"
                  />
                  <img
                    src={ITEM_DETAILS["Floral Bed"].image}
                    className="w-12 mx-1"
                  />
                </div>
                <p className="text-sm mb-2">
                  {t("bedsMigration.bedsNeededDescription")}
                </p>
                <p className="text-sm mb-2">
                  {t("bedsMigration.bedsNeededDescription2")}
                </p>
              </div>
              <Button onClick={() => setShowBuyFarmHandModal(false)}>
                {t("close")}
              </Button>
            </div>
          </CloseButtonPanel>
        ) : (
          <BuyFarmHand
            gameState={game}
            onClose={() => setShowBuyFarmHandModal(false)}
          />
        )}
      </Modal>

      <Modal
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
        size="lg"
      >
        <CloseButtonPanel
          bumpkinParts={game.bumpkin?.equipped}
          onClose={() => setShowBumpkinModal(false)}
          tabs={[
            {
              icon: SUNNYSIDE.icons.wardrobe,
              name: t("equip"),
            },
          ]}
        >
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
