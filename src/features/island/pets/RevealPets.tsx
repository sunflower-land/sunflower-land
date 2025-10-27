import { Modal } from "components/ui/Modal";
import React, { useContext, useEffect, useRef } from "react";
import petNFTEgg from "assets/icons/pet_nft_egg.png";
import classNames from "classnames";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isPetNFTRevealed, PetNFT } from "features/game/types/pets";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { getPetImage } from "./lib/petShared";

export const RevealPets: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const nftPets = gameState.context.state.pets?.nfts ?? {};

  const unrevealedPet = Object.values(nftPets).find(
    (pet) => isPetNFTRevealed(pet.id, Date.now()) && !pet.traits,
  );

  const lastRevealedPetId = useRef<number | undefined>(unrevealedPet?.id);

  useEffect(() => {
    if (unrevealedPet) {
      lastRevealedPetId.current = unrevealedPet.id;
    }
  }, [unrevealedPet?.id]);

  const justRevealedPet =
    lastRevealedPetId.current !== undefined
      ? nftPets[lastRevealedPetId.current]
      : undefined;

  const isActiveState =
    gameState.matches("playing") ||
    gameState.matches("autosaving") ||
    gameState.matches("revealing") ||
    gameState.matches("revealed");

  if (!isActiveState) {
    return null;
  }

  const onClose = () => gameService.send("CONTINUE");

  if (
    justRevealedPet &&
    justRevealedPet.traits &&
    gameState.matches("revealed")
  ) {
    return (
      <Modal show={true} onHide={onClose}>
        <Panel>
          <div className="p-0.5">
            <Label
              className="ml-1.5 mb-2 mt-1"
              type="warning"
              icon={SUNNYSIDE.decorations.treasure_chest}
            >
              {`Pet Hatched`}
            </Label>
            <div className="mb-2 ml-1 text-xxs sm:text-xs">
              <InlineDialogue
                message={`Your Pet Egg hatched into ${justRevealedPet.traits.type}!`}
              />
            </div>
            <div className="flex flex-col space-y-0.5">
              <ButtonPanel className="flex items-start cursor-context-menu hover:brightness-100">
                <Box
                  image={getPetImage("happy", justRevealedPet.id)}
                  className="-mt-2 -ml-1 -mb-1"
                />
                <div className="flex flex-wrap items-start">
                  <Label type="default" className="mr-1 mb-1">
                    {`${justRevealedPet.name}`}
                  </Label>
                </div>
              </ButtonPanel>
            </div>
          </div>
          <Button onClick={onClose}>{t("close")}</Button>
        </Panel>
      </Modal>
    );
  }

  if (unrevealedPet) {
    return (
      <Modal show={true}>
        <RevealPetModal pet={unrevealedPet} />
      </Modal>
    );
  }

  return null;
};

const _revealing = (state: MachineState) => state.matches("revealing");

export const RevealPetModal: React.FC<{ pet: PetNFT }> = ({ pet }) => {
  const { gameService } = useContext(Context);
  const isRevealingState = useSelector(gameService, _revealing);

  const revealPet = () => {
    gameService.send("REVEAL", {
      event: {
        type: "reveal.nftPet",
        petId: pet.id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <div
      className="absolute inset-0 h-full flex flex-col items-center justify-center cursor-pointer gap-2"
      onClick={revealPet}
    >
      <div className="h-24">
        <Label type="warning" className="display-none">
          {isRevealingState ? "?" : `Your Pet Egg #${pet.id} is hatching...`}
        </Label>
      </div>
      <div className="w-32 h-32 relative">
        <img
          src={petNFTEgg}
          className={classNames("w-full ", {
            "animate-pulsate": isRevealingState,
          })}
        />
      </div>
    </div>
  );
};
