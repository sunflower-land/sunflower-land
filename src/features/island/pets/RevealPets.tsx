import { Modal } from "components/ui/Modal";
import React, { useContext, useEffect, useRef } from "react";
import petNFTEgg from "assets/icons/pet_nft_egg.png";
import classNames from "classnames";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isPetNFTRevealed, PetNFT } from "features/game/types/pets";
import { SUNNYSIDE } from "assets/sunnyside";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { getPetImage } from "./lib/petShared";

export const RevealPets: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const nftPets = useSelector(
    gameService,
    (state) => state.context.state.pets?.nfts ?? {},
  );
  const playing = useSelector(gameService, (state) => state.matches("playing"));
  const autosaving = useSelector(gameService, (state) =>
    state.matches("autosaving"),
  );
  const revealing = useSelector(gameService, (state) =>
    state.matches("revealing"),
  );
  const revealed = useSelector(gameService, (state) =>
    state.matches("revealed"),
  );

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

  const isActiveState = playing || autosaving || revealing || revealed;

  if (!isActiveState) {
    return null;
  }

  const onClose = () => gameService.send("CONTINUE");

  if (justRevealedPet && justRevealedPet.traits && revealed) {
    return (
      <Modal show={true} onHide={onClose}>
        <Panel>
          <div className="p-0.5">
            <Label
              className="ml-1.5 mb-2 mt-1"
              type="warning"
              icon={SUNNYSIDE.decorations.treasure_chest}
            >
              {t("pets.petHatched")}
            </Label>
            <div className="mb-2 ml-1 text-xxs sm:text-xs">
              <InlineDialogue
                message={t("pets.hatched", {
                  type: justRevealedPet.traits.type,
                })}
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
    const revealPet = () => {
      gameService.send("REVEAL", {
        event: {
          type: "reveal.nftPet",
          petId: unrevealedPet.id,
          createdAt: new Date(),
        },
      });
    };

    return (
      <Modal show={true}>
        <RevealPetModal
          pet={unrevealedPet}
          revealing={revealing}
          revealPet={revealPet}
        />
      </Modal>
    );
  }

  return null;
};

const RevealPetModal: React.FC<{
  pet: PetNFT;
  revealing: boolean;
  revealPet: () => void;
}> = ({ pet, revealing, revealPet }) => {
  const { t } = useAppTranslation();
  return (
    <div
      className="absolute inset-0 h-full flex flex-col items-center justify-center cursor-pointer gap-2"
      onClick={revealPet}
    >
      <div className="h-24">
        <Label type="warning" className="display-none">
          {revealing ? "?" : t("pets.hatching", { id: pet.id })}
        </Label>
      </div>
      <div className="w-32 h-32 relative">
        <img
          src={petNFTEgg}
          className={classNames("w-full ", {
            "animate-pulsate": revealing,
          })}
        />
      </div>
    </div>
  );
};
