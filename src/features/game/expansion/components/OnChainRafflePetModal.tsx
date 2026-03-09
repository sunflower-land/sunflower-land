import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { getPetImageForMarketplace } from "features/island/pets/lib/petShared";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "lib/object";
import { capitalize } from "lib/utils/capitalize";
import { getPetBuffs } from "features/game/types/getPetBuffs";
import { useImagePreload } from "lib/utils/hooks/useImagePreload";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { PetTraits } from "features/pets/data/types";
import petNFTEgg from "assets/icons/pet_nft_egg.png";
import powerup from "assets/icons/level_up.png";

import blankBearBackground from "assets/pets/backgrounds/blank-bear.webp";
import blankDragonBackground from "assets/pets/backgrounds/blank-dragon.webp";
import blankPhoenixBackground from "assets/pets/backgrounds/blank-phoenix.webp";
import blankGriffinBackground from "assets/pets/backgrounds/blank-griffin.webp";
import blankWarthogBackground from "assets/pets/backgrounds/blank-warthog.webp";
import blankWolfBackground from "assets/pets/backgrounds/blank-wolf.webp";
import blankRamBackground from "assets/pets/backgrounds/blank-ram.webp";

const BLANK_BACKGROUNDS: Record<PetTraits["type"], string> = {
  Bear: blankBearBackground,
  Dragon: blankDragonBackground,
  Phoenix: blankPhoenixBackground,
  Griffin: blankGriffinBackground,
  Warthog: blankWarthogBackground,
  Wolf: blankWolfBackground,
  Ram: blankRamBackground,
};

interface Props {
  petId: number;
}

export const OnChainRafflePetModal: React.FC<Props> = ({ petId }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const pet = gameService.getSnapshot().context.state.pets?.nfts?.[petId];
  const petImageUrl = getPetImageForMarketplace(petId);
  const {
    isLoaded: petImageLoaded,
    hasError: petImageFailed,
    src: preloadedPetImage,
  } = useImagePreload(petImageUrl);
  const petImageReady = petImageLoaded || petImageFailed;

  const onClose = () => gameService.send("CONTINUE");

  const onPlacePet = () => {
    gameService.send("CONTINUE");
    gameService.send("LANDSCAPE", {
      action: "nft.placed",
      placeable: {
        id: petId.toString(),
        name: "Pet",
      },
      location: "farm",
    });
  };

  const petName = `Pet #${petId}`;
  const petTraits = pet?.traits;
  const buffs = getPetBuffs(petId);

  return (
    <Modal show={true} onHide={onClose}>
      <OuterPanel className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <Label type="default">
            <span className="text-sm px-0.5 pb-0.5">{petName}</span>
          </Label>
          <div onClick={onClose} className="cursor-pointer">
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
              message={
                petTraits
                  ? t("pets.hatched", { type: petTraits.type })
                  : t("auction.raffle.win")
              }
            />
          </div>
        </InnerPanel>
        <div className="flex justify-center gap-1 sm:flex-row text-[24px] leading-5 sm:text-[28px] sm:leading-6">
          <InnerPanel
            className="flex justify-center relative w-[45%] sm:w-[60%]"
            style={{
              padding: "-1px",
              backgroundImage: petTraits
                ? `url(${BLANK_BACKGROUNDS[petTraits.type]})`
                : undefined,
              backgroundSize: "contain",
              backgroundRepeat: "round",
            }}
          >
            <img
              className="rounded-md object-contain"
              src={
                petImageReady && petImageLoaded
                  ? (preloadedPetImage ?? petImageUrl ?? petNFTEgg)
                  : petNFTEgg
              }
              alt={petName}
            />
          </InnerPanel>
          {petTraits && (
            <InnerPanel className="w-[55%] sm:w-full">
              <Label type="default">{t("pets.traits")}</Label>
              <div className="flex flex-col gap-1 p-1.5 -mt-1">
                {getKeys(petTraits).map((trait) => (
                  <div key={`${petTraits[trait]}-${petId}`}>
                    <div className="flex space-x-2 items-center">
                      <div className="gap-1">
                        <span>{`${capitalize(trait)}: `}</span>
                        <div className="inline-flex items-center gap-1">
                          <span className="whitespace-nowrap">{`${petTraits[trait]}`}</span>
                          {((trait === "aura" &&
                            petTraits[trait] !== "No Aura") ||
                            (trait === "bib" &&
                              petTraits[trait] !== "Baby Bib")) && (
                            <img src={powerup} alt="Powerup" className="w-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InnerPanel>
          )}
        </div>

        {buffs.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-1 w-full">
            <InnerPanel className="w-full gap-2">
              <div>
                <Label type="default">{t("boosts")}</Label>
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
        <div className="flex gap-1">
          <Button onClick={onClose}>{t("close")}</Button>
          <Button className="flex-1" onClick={onPlacePet}>
            {t("pets.place")}
          </Button>
        </div>
      </OuterPanel>
    </Modal>
  );
};
