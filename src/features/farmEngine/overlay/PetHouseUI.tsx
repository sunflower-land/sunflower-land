import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import followIcon from "assets/icons/follow.webp";
import sleepIcon from "assets/icons/sleep.webp";
import unfollowIcon from "assets/icons/unfollow.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { PetName } from "features/game/types/pets";
import { isPetNapping, isPetNeglected } from "features/game/types/pets";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { PetHouseModal } from "features/island/buildings/components/building/petHouse/PetHouseModal";
import { useVisiting } from "lib/utils/visitUtils";
import { useNow } from "lib/utils/hooks/useNow";
import type { GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * Pet house chrome that stays React [petHouse/PetHouseInside.tsx]: the pet
 * guide disc, the quick pet-all button (when pets are napping) and the
 * upgrade disc, all floating above the room, plus their modals.
 */

const ROOM_ANCHOR = "interior-room";

const _petHouse = (state: MachineState) => state.context.state.petHouse;
const _commonPets = (state: MachineState) =>
  state.context.state.pets?.common ?? {};
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _landscaping = (state: MachineState) => state.matches("landscaping");

export const PetHouseUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const { gameService } = useContext(Context);
  const { isVisiting } = useVisiting();

  const petHouse = useSelector(gameService, _petHouse);
  const commonPets = useSelector(gameService, _commonPets);
  const petNFTs = useSelector(gameService, _petNFTs);
  const landscaping = useSelector(gameService, _landscaping);

  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);

  const rect = useWorldAnchor(ROOM_ANCHOR);

  // [PetHouseInside.tsx] common-pet PLACEMENT lives in petHouse.pets; the
  // behaviour record (naps) lives in pets.common.
  const now = useNow({ live: true });
  const placedCommonIds = (
    Object.keys(petHouse?.pets ?? {}) as PetName[]
  ).filter((name) => petHouse?.pets?.[name]?.some((pet) => !!pet.coordinates));
  const nappingPetIds: Array<PetName | number> = [
    ...placedCommonIds.filter(
      (name) =>
        isPetNapping(commonPets[name], now) &&
        !isPetNeglected(commonPets[name], now),
    ),
    ...Object.entries(petNFTs)
      .filter(([, pet]) => !!pet.coordinates && pet.location === "petHouse")
      .map(([id]) => Number(id))
      .filter(
        (id) =>
          isPetNapping(petNFTs[id], now) && !isPetNeglected(petNFTs[id], now),
      ),
  ];

  const handlePetAll = () => {
    nappingPetIds.forEach((petId) => {
      bridge.dispatch("pet.pet", { petId });
    });
  };

  const level = Math.min(petHouse?.level ?? 1, 3);
  const nextLevel = Math.min(level + 1, 3);

  // Null-safe: the anchor can vanish between subscription pushes (scene
  // rebuild), and a stale closure reading it then crashes the overlay tree.
  const box = rect?.visible
    ? { left: rect.left, top: rect.top, width: rect.width }
    : undefined;

  const disc = (right: number) =>
    box && {
      width: `${PIXEL_SCALE * 18}px`,
      height: `${PIXEL_SCALE * 19}px`,
      left: `${box.left + box.width - right - PIXEL_SCALE * 18}px`,
      top: `${box.top - 20 * PIXEL_SCALE}px`,
    };

  return (
    <>
      {box && !landscaping && !isVisiting && (
        <>
          {/* Pet guide disc [PetHouseInside.tsx right -5, top -20] */}
          <div
            className="absolute cursor-pointer z-10 hover:img-highlight pointer-events-auto"
            style={disc(-5 * PIXEL_SCALE)!}
            onClick={() => setShowPetModal(true)}
          >
            <img className="w-full" src={SUNNYSIDE.icons.disc} />
            <img
              className="absolute"
              src={followIcon}
              style={{
                width: `${PIXEL_SCALE * 10}px`,
                right: `${PIXEL_SCALE * 4}px`,
                top: `${PIXEL_SCALE * 4}px`,
              }}
            />
          </div>

          {/* Quick pet-all [PetHouseInside.tsx right 15, top -20] */}
          {nappingPetIds.length > 0 && (
            <button
              type="button"
              className="absolute cursor-pointer z-10 hover:img-highlight p-0 border-0 bg-transparent pointer-events-auto"
              style={disc(15 * PIXEL_SCALE)!}
              onClick={handlePetAll}
            >
              <img className="w-full" src={SUNNYSIDE.icons.disc} alt="" />
              <img
                className="absolute"
                src={unfollowIcon}
                alt=""
                style={{
                  width: `${PIXEL_SCALE * 10}px`,
                  right: `${PIXEL_SCALE * 4}px`,
                  top: `${PIXEL_SCALE * 4}px`,
                }}
              />
              <img
                className="absolute"
                src={sleepIcon}
                alt=""
                style={{
                  width: `${PIXEL_SCALE * 6}px`,
                  right: `${PIXEL_SCALE * 4}px`,
                  top: `${PIXEL_SCALE * 4}px`,
                }}
              />
            </button>
          )}

          {/* Upgrade disc [PetHouseInside.tsx left 9, top -20] */}
          <img
            src={SUNNYSIDE.icons.upgrade_disc}
            alt="Upgrade Building"
            className="absolute cursor-pointer z-10 pointer-events-auto"
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              left: `${box.left + 9 * PIXEL_SCALE}px`,
              top: `${box.top - 20 * PIXEL_SCALE}px`,
            }}
            onClick={() => setShowUpgrade(true)}
          />
        </>
      )}

      <UpgradeBuildingModal
        buildingName="Pet House"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgrade}
        onClose={() => setShowUpgrade(false)}
      />

      <PetHouseModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
      />
    </>
  );
};
