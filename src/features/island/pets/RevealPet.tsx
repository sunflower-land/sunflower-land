import { Modal } from "components/ui/Modal";
import React, { useContext, useRef } from "react";
import petNFTEgg from "assets/icons/pet_nft_egg.png";
import classNames from "classnames";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isPetNFTRevealed, PetNFT } from "features/game/types/pets";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getPetImageForOpenSea } from "./lib/petShared";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/lib/crafting";
import { capitalize } from "lib/utils/capitalize";
import { getPetBuffs } from "features/game/types/getPetBuffs";
import { MachineState } from "features/game/lib/gameMachine";
import { useDeepEffect } from "lib/utils/hooks/useDeepEffect";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import confetti from "canvas-confetti";
import powerup from "assets/icons/level_up.png";
import { useImagePreload } from "lib/utils/hooks/useImagePreload";
import { InlineDialogue } from "features/world/ui/TypingMessage";

const _nftPets = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _playing = (state: MachineState) => state.matches("playing");
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _revealing = (state: MachineState) => state.matches("revealing");
const _revealed = (state: MachineState) => state.matches("revealed");

export const RevealPet: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const nftPets = useSelector(gameService, _nftPets);
  const playing = useSelector(gameService, _playing);
  const autosaving = useSelector(gameService, _autosaving);
  const revealing = useSelector(gameService, _revealing);
  const revealed = useSelector(gameService, _revealed);

  // Pet without traits but reveal date has passed
  const unrevealedPet = Object.values(nftPets).find(
    (pet) => isPetNFTRevealed(pet.id, Date.now()) && !pet.traits,
  );
  // Id of pet to be revealed
  const revealingPetId = useRef<number | undefined>(unrevealedPet?.id);

  useDeepEffect(() => {
    if (unrevealedPet) revealingPetId.current = unrevealedPet.id;
  }, [unrevealedPet]);

  useOnMachineTransition(gameService, "revealing", "revealed", confetti);

  const petToBeRevealed: PetNFT | undefined =
    revealingPetId.current !== undefined
      ? nftPets[revealingPetId.current]
      : undefined;

  const petImageUrl = getPetImageForOpenSea(102);
  const { isLoaded: petImageLoaded, src: preloadedPetImage } =
    useImagePreload(petImageUrl);

  const isActiveState = playing || autosaving || revealing || revealed;

  if (!isActiveState) return null;

  const onClose = () => gameService.send("CONTINUE");

  const onPlacePet = async () => {
    gameService.send("CONTINUE");
    gameService.send("LANDSCAPE", {
      action: "nft.placed",
      placeable: {
        id: petToBeRevealed?.id.toString(),
        name: "Pet",
      },
      location: "farm",
    });
  };

  if (petToBeRevealed && petToBeRevealed.traits && revealed && petImageLoaded) {
    const petName = `Pet #${petToBeRevealed.id}`;
    const petTraits = petToBeRevealed.traits;
    const buffs = getPetBuffs(petToBeRevealed.id);

    return (
      <Modal show={true} onHide={onClose}>
        <OuterPanel className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Label type="default">
              <span className="text-sm px-0.5 pb-0.5">{petName}</span>
            </Label>
            <div onClick={onClose}>
              <img
                src={SUNNYSIDE.icons.close}
                alt="Close"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                }}
              />
            </div>
          </div>
          <InnerPanel>
            <div className="p-1">
              <InlineDialogue
                message={t("pets.hatched", {
                  type: petToBeRevealed.traits.type,
                })}
              />
            </div>
          </InnerPanel>
          <div className="flex justify-center gap-1 sm:flex-row text-[24px] leading-5 sm:text-[28px] sm:leading-6">
            <InnerPanel
              className="flex justify-center relative w-full sm:w-[60%]"
              style={{
                padding: "-1px",
                backgroundColor: "#63c74c",
              }}
            >
              <img
                className="rounded-md object-contain"
                src={preloadedPetImage ?? petImageUrl}
                alt="Pet #1"
              />
            </InnerPanel>
            <InnerPanel className="w-full">
              <Label type="default">{"Traits"}</Label>
              <div className="flex flex-col gap-1 p-1.5 -mt-1">
                {getKeys(petTraits).map((trait) => (
                  <div key={`${petTraits[trait]}-${petToBeRevealed.id}`}>
                    <div className="flex space-x-2 items-center">
                      <div className="gap-1">
                        <span>{`${capitalize(trait)}: `}</span>
                        <span className="whitespace-nowrap">{`${petTraits[trait]}`}</span>
                      </div>
                      {(trait === "aura" || trait === "bib") && (
                        <img src={powerup} alt="Powerup" className="w-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </InnerPanel>
          </div>

          {buffs.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-1 w-full">
              <InnerPanel className="w-full gap-2">
                <div>
                  <Label type="default">{"Boosts"}</Label>
                  <div className="flex flex-col gap-1 p-1.5">
                    {buffs.map((buff) => (
                      <div
                        key={buff.shortDescription}
                        className="flex space-x-2 items-center gap-1"
                      >
                        <Label
                          key={buff.shortDescription}
                          type={buff.labelType}
                          icon={buff.boostTypeIcon}
                          secondaryIcon={buff.boostedItemIcon}
                        >
                          {buff.shortDescription}
                        </Label>
                        <div className="w-11 pb-1 text-[24px] leading-5 sm:text-[28px] sm:leading-6">{`(${capitalize(buff.trait)})`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </InnerPanel>
            </div>
          )}
          <Button className="w-full" onClick={onPlacePet}>
            {"Place your pet"}
          </Button>
        </OuterPanel>
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
        <RevealingEgg
          pet={unrevealedPet}
          revealing={revealing}
          revealPet={revealPet}
        />
      </Modal>
    );
  }

  return null;
};

const RevealingEgg: React.FC<{
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
        <Label type="warning" className="display-none p-0.5">
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
