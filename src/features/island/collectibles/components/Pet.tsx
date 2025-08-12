import React, { useState } from "react";
import { CollectibleProps } from "../Collectible";
import { PetName, PetResource, PETS } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { useGame } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  DEFAULT_PET_CRAVINGS,
  getPetRequest,
  getPetRestLeft,
  isPetResting,
} from "features/game/events/landExpansion/feedPet";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const PetModal: React.FC<{ onClose: () => void; name: PetName }> = ({
  onClose,
  name,
}) => {
  const { gameState, gameService } = useGame();

  const { t } = useAppTranslation();

  const petConfig = PETS[name];

  const [resource, setResource] = useState<PetResource>(petConfig.fetches[0]);

  const pet = gameState.context.state.pets?.[name];
  const request = getPetRequest({ pet, game: gameState.context.state });

  const itemAmount =
    gameState.context.state.inventory[request] ?? new Decimal(0);

  const fetch = () => {
    gameService.send({
      type: "pet.fed",
      name,
      resource,
    });
  };

  const restLeft = getPetRestLeft({
    pet: gameState.context.state.pets?.[name],
    game: gameState.context.state,
  });
  const isResting = isPetResting({
    pet: gameState.context.state.pets?.[name],
    game: gameState.context.state,
  });

  const nextRequests = pet?.cravings ?? DEFAULT_PET_CRAVINGS.slice(1);

  if (isResting) {
    return (
      <>
        <InnerPanel className="mb-1">
          <Label type="default" className="mb-2">
            {t("pets.sleeping")}
          </Label>
          <p className="text-sm p-1">
            {secondsToString(restLeft / 1000, { length: "medium" })}
          </p>
        </InnerPanel>
        <InnerPanel className="mb-1">
          <Label type="default" className="mb-2">
            {t("pets.nextRequests")}
          </Label>
          {nextRequests.map((request) => (
            <div key={request} className="flex items-center">
              <Box image={ITEM_DETAILS[request].image} className="mr-2" />
              <div>
                <p className="text-sm">{`1 x ${request}`}</p>
              </div>
            </div>
          ))}
        </InnerPanel>
        <Button onClick={onClose}>{t("close")}</Button>
      </>
    );
  }

  return (
    <>
      <InnerPanel className="mb-1">
        <Label type="default">{name}</Label>
        <p className="text-sm p-1">{t("pets.description")}</p>
        <div className="flex items-center">
          <Box
            image={ITEM_DETAILS[request].image}
            count={itemAmount}
            className="mr-2"
          />
          <div>
            <p className="text-sm">{`1 x ${request}`}</p>
            {!itemAmount.gte(1) && <Label type="danger">{t("missing")}</Label>}
          </div>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <Label type="default">{t("fetch")}</Label>

        <div className="flex flex-col">
          {petConfig.fetches.map((fetch) => (
            <div key={fetch} className="flex items-center">
              <Box
                key={fetch}
                isSelected={resource === fetch}
                onClick={() => setResource(fetch)}
                image={ITEM_DETAILS[fetch].image}
                className="mr-2"
              />
              <div>
                <p className="text-sm">{fetch}</p>
                <p className="text-xs">{ITEM_DETAILS[fetch].description}</p>
              </div>
            </div>
          ))}
        </div>
      </InnerPanel>
      <Button onClick={fetch} disabled={!itemAmount.gte(1) || !request}>
        {t("fetch")}
      </Button>
    </>
  );
};

export const Pet: React.FC<CollectibleProps> = ({ name }) => {
  const { gameState } = useGame();
  const [showModal, setShowModal] = useState(false);

  const pet = gameState.context.state.pets?.[name as PetName];
  const request = getPetRequest({ pet, game: gameState.context.state });

  const isSleeping = isPetResting({
    pet: gameState.context.state.pets?.[name as PetName],
    game: gameState.context.state,
  });

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel container={OuterPanel}>
          <PetModal
            onClose={() => setShowModal(false)}
            name={name as PetName}
          />
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{ left: `${PIXEL_SCALE * 4}px`, width: `${PIXEL_SCALE * 22}px` }}
      >
        <img
          src={ITEM_DETAILS[name].image}
          className="absolute w-full cursor-pointer hover:img-highlight"
          alt={name}
          onClick={() => setShowModal(true)}
        />

        {isSleeping ? (
          <img
            src={SUNNYSIDE.icons.sleeping}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              left: `${PIXEL_SCALE * -2}px`,
              top: `${PIXEL_SCALE * -2}px`,
            }}
          />
        ) : (
          <div
            className={`absolute inline-flex justify-center items-center z-10 pointer-events-none`}
            style={{
              left: `${PIXEL_SCALE * -10}px`,
              top: `${PIXEL_SCALE * -2}px`,
              borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
              borderStyle: "solid",
              borderTopWidth: `${PIXEL_SCALE * 2}px`,
              borderRightWidth: `${PIXEL_SCALE * 2}px`,
              borderBottomWidth: `${PIXEL_SCALE * 4}px`,
              borderLeftWidth: `${PIXEL_SCALE * 5}px`,
              borderImageSlice: "2 2 4 5 fill",
              imageRendering: "pixelated",
              borderImageRepeat: "stretch",
              // Flip it
              transform: "scaleX(-1)",
            }}
          >
            <img
              style={{
                width: `${PIXEL_SCALE * 6}px`,
              }}
              src={ITEM_DETAILS[request]?.image}
            />
          </div>
        )}
      </div>
    </>
  );
};
