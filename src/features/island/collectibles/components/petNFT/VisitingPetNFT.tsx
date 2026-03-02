import React, { useState } from "react";
import { useSelector } from "@xstate/react";
import {
  isPetNeglected,
  isPetNapping,
  isPetOfTypeFed,
} from "features/game/types/pets";
import { PetSprite } from "features/island/pets/PetSprite";
import { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { FarmHelped } from "features/island/hud/components/FarmHelped";
import { isHelpComplete } from "features/game/types/monuments";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useNow } from "lib/utils/hooks/useNow";

const _petNFTData = (id: string) => (state: MachineState) => {
  return state.context.state.pets?.nfts?.[Number(id)];
};

const _isTypeFed = (id: string) => (state: MachineState) => {
  const petData = state.context.state.pets?.nfts?.[Number(id)];
  if (!petData) return false;
  if (!petData.traits) return false;

  const isTypeFed = isPetOfTypeFed({
    nftPets: state.context.state.pets?.nfts ?? {},
    petType: petData.traits.type,
    id: Number(id),
    now: Date.now(),
  });

  return isTypeFed;
};

const _hasHelpedPet = (id: number) => (state: MachineState) => {
  if (state.context.visitorState) {
    const hasHelpedToday = state.context.hasHelpedPlayerToday ?? false;

    const hasHelpedPet = !!state.context.state.pets?.nfts?.[id]?.visitedAt;

    return hasHelpedPet || hasHelpedToday;
  }
};

export const VisitingPetNFT: React.FC<{
  id: string;
}> = ({ id }) => {
  const { gameService } = useContext(Context);
  const petNFTData = useSelector(gameService, _petNFTData(id));
  const isTypeFed = useSelector(gameService, _isTypeFed(id));
  const hasHelpedPet = useSelector(gameService, _hasHelpedPet(Number(id)));
  const [showHelped, setShowHelped] = useState(false);
  const now = useNow({ live: true });

  const visitorGameState = useSelector(
    gameService,
    (state) => state.context.visitorState,
  );
  const state = useSelector(gameService, (state) => state.context.state);
  const totalHelpedToday = useSelector(
    gameService,
    (state) => state.context.totalHelpedToday ?? 0,
  );

  const isNeglected = isPetNeglected(petNFTData, now);
  const isNapping = isPetNapping(petNFTData, now);

  const handlePetClick = () => {
    if (petNFTData && visitorGameState && !hasHelpedPet) {
      gameService.send({
        type: "pet.visitingPets",
        pet: Number(id),
        totalHelpedToday,
      });

      if (
        isHelpComplete({
          game: gameService.getSnapshot().context.state,
        })
      ) {
        setShowHelped(true);
      }
    }
  };

  // Used to move the pet through different states (neglected, napping)
  useUiRefresher({ active: !!petNFTData?.traits });

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
        onClick={handlePetClick}
        clickable={!hasHelpedPet}
      />

      {!hasHelpedPet && petNFTData && (
        <div
          className="absolute -top-4 -right-4 pointer-events-auto cursor-pointer hover:img-highlight"
          onClick={(e) => {
            e.stopPropagation();
            handlePetClick();
          }}
        >
          <div
            className="relative mr-2"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              top: `${PIXEL_SCALE * -4}px`,
              right: `${PIXEL_SCALE * -4}px`,
            }}
          >
            <img className="w-full" src={SUNNYSIDE.icons.disc} />
            <img
              className="absolute"
              src={SUNNYSIDE.icons.drag}
              style={{
                width: `${PIXEL_SCALE * 14}px`,
                right: `${PIXEL_SCALE * 3}px`,
                top: `${PIXEL_SCALE * 2}px`,
                zIndex: 1000,
              }}
            />
          </div>
        </div>
      )}
      <Modal show={showHelped}>
        <CloseButtonPanel bumpkinParts={state.bumpkin.equipped}>
          <FarmHelped onClose={() => setShowHelped(false)} />
        </CloseButtonPanel>
      </Modal>
    </div>
  );
};
