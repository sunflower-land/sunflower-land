import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Bumpkin, Airdrop as IAirdrop } from "features/game/types/game";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { PetName } from "features/game/types/pets";
import { isPetNeglected, isPetOfTypeFed } from "features/game/types/pets";
import { BumpkinModal } from "features/bumpkins/components/BumpkinModal";
import { BumpkinEquip } from "features/bumpkins/components/BumpkinEquip";
import { PetModal } from "features/island/pets/PetModal";
import { AirdropModal } from "features/game/expansion/components/Airdrop";
import { FarmHelped } from "features/island/hud/components/FarmHelped";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import type { FarmModalRequest } from "../bridge/GameBridge";

/**
 * The React halves of character clicks [PlayerRenderer/PetRenderer/
 * AirdropRenderer]: the same modals the DOM components mount locally
 * [PlayerNPC.tsx / FarmHand.tsx / LandPetNFT.tsx / Airdrop.tsx].
 */

const _state = (state: MachineState) => state.context.state;

export const CharacterModals: React.FC<{
  open: FarmModalRequest | undefined;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const data = (open?.data ?? {}) as Record<string, unknown>;

  return (
    <>
      {/* [PlayerNPC.tsx] own-bumpkin modal */}
      {open?.name === "bumpkinPlayer" && (
        <Modal show onHide={onClose} size="lg">
          <BumpkinModal
            initialTab="feed"
            forceTab
            onClose={onClose}
            bumpkin={state.bumpkin as Bumpkin}
            inventory={state.inventory}
            readonly={false}
            gameState={state}
          />
        </Modal>
      )}

      {/* [FarmHand.tsx] equip modal */}
      {open?.name === "farmHandEquip" && (
        <FarmHandEquipHost id={data.id as string} onClose={onClose} />
      )}

      {/* [LandPetNFT.tsx / LandPet.tsx] */}
      {open?.name === "pet" && (
        <PetModalHost
          nftId={data.nftId as number | undefined}
          commonName={data.commonName as PetName | undefined}
          onClose={onClose}
        />
      )}

      {/* [Airdrop.tsx] */}
      {open?.name === "airdrop" && (
        <AirdropModalHost id={data.id as string} onClose={onClose} />
      )}

      {/* [Clutter.tsx / VisitingPet.tsx onComplete] */}
      {open?.name === "farmHelped" && (
        <Modal show onHide={onClose}>
          <CloseButtonPanel
            onClose={onClose}
            bumpkinParts={state.bumpkin?.equipped}
          >
            <FarmHelped onClose={onClose} />
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};

const FarmHandEquipHost: React.FC<{ id: string; onClose: () => void }> = ({
  id,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const farmHand = state.farmHands.bumpkins?.[id];
  if (!farmHand) return null;

  return (
    <Modal show onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            id: "equip",
            icon: SUNNYSIDE.icons.wardrobe,
            name: t("equip"),
          },
        ]}
      >
        <BumpkinEquip
          farmHandId={id}
          equipment={farmHand.equipped as BumpkinParts}
          onEquip={(equipment) =>
            gameService.send("farmHand.equipped", { id, equipment })
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const PetModalHost: React.FC<{
  nftId?: number;
  commonName?: PetName;
  onClose: () => void;
}> = ({ nftId, commonName, onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow();

  if (nftId !== undefined) {
    const pet = state.pets?.nfts?.[nftId];
    if (!pet?.traits) return null;
    return (
      <PetModal
        show
        onClose={onClose}
        data={pet}
        isNeglected={isPetNeglected(pet, now)}
        isTypeFed={isPetOfTypeFed({
          nftPets: state.pets?.nfts ?? {},
          petType: pet.traits.type,
          id: nftId,
          now,
        })}
        petType={pet.traits.type}
      />
    );
  }

  if (commonName) {
    const pet = state.pets?.common?.[commonName];
    if (!pet) return null;
    return (
      <PetModal
        show
        onClose={onClose}
        data={pet}
        isNeglected={isPetNeglected(pet, now)}
      />
    );
  }

  return null;
};

const AirdropModalHost: React.FC<{ id: string; onClose: () => void }> = ({
  id,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const airdrop = state.airdrops?.find((candidate) => candidate.id === id) as
    | IAirdrop
    | undefined;
  if (!airdrop) return null;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        <AirdropModal airdrop={airdrop} onClose={onClose} onClaimed={onClose} />
      </CloseButtonPanel>
    </Modal>
  );
};
