import React, { useContext, useState } from "react";
import {
  isPetNeglected,
  isPetNapping,
  PetName,
} from "features/game/types/pets";
import { _petData } from "./lib/petShared";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { isHelpComplete } from "features/game/types/monuments";
import { hasFeatureAccess } from "lib/flags";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FarmHelped } from "features/island/hud/components/FarmHelped";
import { PetSprite } from "./PetSprite";
import { SUNNYSIDE } from "assets/sunnyside";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

const _hasHelpedPet = (name: PetName) => (state: MachineState) => {
  if (state.context.visitorState) {
    const hasAccess = hasFeatureAccess(state.context.visitorState, "PETS");
    if (!hasAccess) {
      return true;
    }

    const hasHelpedToday = state.context.hasHelpedPlayerToday ?? false;

    const hasHelpedPet = !!state.context.state.pets?.common?.[name]?.visitedAt;

    return hasHelpedPet || hasHelpedToday;
  }
};

export const VisitingPet: React.FC<{ name: PetName }> = ({ name }) => {
  const { gameService } = useContext(Context);
  const petData = useSelector(gameService, _petData(name));

  // Visiting variables
  const visitorGameState = useSelector(
    gameService,
    (state) => state.context.visitorState,
  );
  const state = useSelector(gameService, (state) => state.context.state);
  const totalHelpedToday = useSelector(
    gameService,
    (state) => state.context.totalHelpedToday ?? 0,
  );
  const hasHelpedPet = useSelector(gameService, _hasHelpedPet(name));

  const [showHelped, setShowHelped] = useState(false);

  const isNeglected = isPetNeglected(petData);
  const isNapping = isPetNapping(petData);

  const handlePetClick = () => {
    if (
      petData &&
      visitorGameState &&
      hasFeatureAccess(visitorGameState, "PETS") &&
      !hasHelpedPet
    ) {
      gameService.send("pet.visitingPets", { pet: name, totalHelpedToday });

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
  useUiRefresher();

  return (
    <PetSprite
      id={name}
      isNeglected={isNeglected}
      isNapping={isNapping}
      onClick={handlePetClick}
      clickable={!hasHelpedPet}
    >
      {!hasHelpedPet && petData && (
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
    </PetSprite>
  );
};
