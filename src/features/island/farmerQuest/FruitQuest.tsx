import React, { useContext, useState } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import island from "assets/land/islands/farmer_island.webp";
import { Modal } from "components/ui/Modal";
import { Quest } from "features/game/expansion/components/Quest";
import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import { NPC } from "../bumpkin/components/NPC";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _farmAddress = (state: MachineState) => state.context.farmAddress;
interface Props {
  offset: number;
}

export const FruitQuest: React.FC<Props> = ({ offset }) => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);
  // useSelector to select farmAddress
  const farmAddress = useSelector(gameService, _farmAddress);

  const ModalDescription = () => {
    return (
      <>
        <p className="mb-4">{t("modalDescription.limited.abilities")}</p>
        <p className="mb-4">{t("modalDescription.trail")}</p>
        <div className="flex justify-center mb-4">
          <img
            src={appleTree}
            className="mr-2 img-highlight"
            style={{
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <img
            src={orangeTree}
            className="img-highlight mr-2"
            style={{
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
          <img
            src={blueberryBush}
            className="img-highlight self-end"
            style={{
              height: `${PIXEL_SCALE * 15}px`,
            }}
          />
        </div>
      </>
    );
  };

  const QuestCompletion = () => {
    return (
      <div className="pr-4 pl-2 py-2">
        <p className="mb-3">{t("modalDescription.love.fruit")}</p>
        <p>{t("modalDescription.gift")}</p>
      </div>
    );
  };
  return (
    <>
      <MapPlacement width={6} height={6} x={-8 - offset} y={9 + offset}>
        <img
          src={island}
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 0}px`,
            top: `${GRID_WIDTH_PX * 0}px`,
            width: `${PIXEL_SCALE * 94}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: `${GRID_WIDTH_PX * 2.5}px`,
            top: `${GRID_WIDTH_PX * 0.75}px`,
          }}
        >
          <NPC
            parts={{
              pants: "Blue Suspenders",
              body: "Beige Farmer Potion",
              hair: "Sun Spots",
              shirt: "Fruit Picker Shirt",
              hat: "Fruit Bowl",
            }}
            onClick={farmAddress ? () => setShowModal(true) : undefined}
          />
        </div>
      </MapPlacement>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Quest
          quests={["Fruit Quest 1", "Fruit Quest 2", "Fruit Quest 3"]}
          questTitle={t("modalDescription.friend")}
          onClose={() => setShowModal(false)}
          questDescription={ModalDescription()}
          bumpkinParts={{
            pants: "Farmer Pants",
            body: "Beige Farmer Potion",
            coat: "Fruit Picker Apron",
            tool: "Farmer Pitchfork",
            hair: "Parlour Hair",
            shirt: "Fruit Picker Shirt",
            hat: "Fruit Bowl",
          }}
          questCompletionScreen={QuestCompletion()}
        />
      </Modal>
    </>
  );
};
