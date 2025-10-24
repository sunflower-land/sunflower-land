import React, { useContext, useState } from "react";
import {
  getPetType,
  isPetNapping,
  isPetNeglected,
  PetName,
} from "features/game/types/pets";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { Transition } from "@headlessui/react";
import { PetSprite } from "./PetSprite";
import { _petData } from "./lib/petShared";
import { PetModal } from "./PetModal";

export const LandPet: React.FC<{ name: PetName }> = ({ name }) => {
  const [showPetModal, setShowPetModal] = useState(false);
  const [showPositiveXpPopup, setShowPositiveXpPopup] = useState(false);
  const [showNegativeXpPopup, setShowNegativeXpPopup] = useState(false);
  const { gameService } = useContext(Context);

  const petData = useSelector(gameService, _petData(name));

  const isNeglected = isPetNeglected(petData);
  const isNapping = isPetNapping(petData);
  const petType = getPetType(petData);

  const handlePetClick = () => {
    if (isNeglected) {
      gameService.send("pet.neglected", {
        petId: name,
      });
      setShowNegativeXpPopup(true);
      window.setTimeout(() => setShowNegativeXpPopup(false), 1000);
    } else if (isNapping) {
      gameService.send("pet.pet", {
        petId: name,
      });
      setShowPositiveXpPopup(true);
      window.setTimeout(() => setShowPositiveXpPopup(false), 1000);
    } else {
      setShowPetModal(true);
    }
  };

  if (!petData) return null;

  return (
    <PetSprite
      id={name}
      isNeglected={isNeglected}
      isNapping={isNapping}
      onClick={handlePetClick}
      clickable
    >
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

      <PetModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
        isNeglected={isNeglected}
        petType={petType}
        data={petData}
      />
    </PetSprite>
  );
};
