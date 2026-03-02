import React from "react";
import { useSelector } from "@xstate/react";
import {
  isPetNeglected,
  isPetNapping,
  isPetNFTRevealed,
  getPetType,
  isPetOfTypeFed,
} from "features/game/types/pets";
import { PetModal } from "features/island/pets/PetModal";
import { PetSprite } from "features/island/pets/PetSprite";
import { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Transition } from "@headlessui/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";

const _petNFTData = (id: string) => (state: MachineState) => {
  return state.context.state.pets?.nfts?.[Number(id)];
};

const _isTypeFed = (id: string, now: number) => (state: MachineState) => {
  const petData = state.context.state.pets?.nfts?.[Number(id)];
  if (!petData) return false;
  if (!petData.traits) return false;

  const isTypeFed = isPetOfTypeFed({
    nftPets: state.context.state.pets?.nfts ?? {},
    petType: petData.traits.type,
    id: Number(id),
    now,
  });

  return isTypeFed;
};

export const LandPetNFT: React.FC<{ id: string }> = ({ id }) => {
  const { gameService } = useContext(Context);
  const petNFTData = useSelector(gameService, _petNFTData(id));
  const [showPetModal, setShowPetModal] = useState(false);
  const [showPositiveXpPopup, setShowPositiveXpPopup] = useState(false);
  const [showNegativeXpPopup, setShowNegativeXpPopup] = useState(false);
  const now = useNow({ live: true });

  const isNeglected = isPetNeglected(petNFTData, now);
  const isNapping = isPetNapping(petNFTData, now);
  const isTypeFed = useSelector(gameService, _isTypeFed(id, now));

  const isRevealed = isPetNFTRevealed(Number(id), now);

  const petType = getPetType(petNFTData);

  const handlePetClick = () => {
    if (isNeglected && !isTypeFed) {
      gameService.send({ type: "pet.neglected", petId: Number(id) });
      setShowNegativeXpPopup(true);
      window.setTimeout(() => setShowNegativeXpPopup(false), 1000);
    } else if (isNapping && !isTypeFed) {
      gameService.send({ type: "pet.pet", petId: Number(id) });
      setShowPositiveXpPopup(true);
      window.setTimeout(() => setShowPositiveXpPopup(false), 1000);
    } else {
      setShowPetModal(true);
    }
  };

  if (!petNFTData || !petNFTData.traits) return null;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        height: `${PIXEL_SCALE * 32}px`,
      }}
    >
      <PetSprite
        id={Number(id)}
        petType={petNFTData.traits.type}
        isNeglected={isNeglected}
        isNapping={isNapping}
        isTypeFed={isTypeFed}
        clickable
        onClick={handlePetClick}
      />
      <Transition
        appear={true}
        show={showPositiveXpPopup || showNegativeXpPopup}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 -translate-y-0"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex -top-2 left-1/2 -translate-x-1/2 absolute z-40 pointer-events-none"
        as="div"
      >
        <span
          className="text-sm yield-text"
          style={{
            color: showPositiveXpPopup
              ? "#71e358"
              : showNegativeXpPopup
                ? "#ff0000"
                : undefined,
          }}
        >
          {showPositiveXpPopup ? "+10XP" : showNegativeXpPopup ? "-500XP" : ""}
        </span>
      </Transition>
      {isRevealed && petType && (
        <PetModal
          show={showPetModal}
          onClose={() => setShowPetModal(false)}
          data={petNFTData}
          isNeglected={isNeglected}
          petType={petType}
          isTypeFed={isTypeFed}
        />
      )}
    </div>
  );
};
