import { useSelector } from "@xstate/react";
import foodIcon from "assets/food/chicken_drumstick.png";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  Pet,
  PetName,
  PetNFT,
  PetResourceName,
  PetType,
} from "features/game/types/pets";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useCallback, useContext, useState } from "react";
import { NeglectPet } from "./NeglectPet";
import { PetFeed } from "./PetFeed";
import { PetFetch } from "./PetFetch";
import { PetInfo } from "./PetInfo";
import { getPetImage, isPetNFT } from "./lib/petShared";

interface Props {
  show: boolean;
  onClose: () => void;
  petId: PetName | number;
  data: Pet | PetNFT;
  isNeglected: boolean;
  petType: PetType;
}

export const PetModal: React.FC<Props> = ({
  show,
  onClose,
  petId,
  data,
  isNeglected,
  petType,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const isNFTPet = isPetNFT(petId);

  const [tab, setTab] = useState<"Info" | "Feed" | "Fetch" | "Neglected">(
    isNeglected ? "Neglected" : "Info",
  );
  const hasPetHouse = useSelector(
    gameService,
    (state) =>
      state.context.state.inventory["Pet House"]?.greaterThan(0) ?? false,
  );
  const hasPetsAccess = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "PETS"),
  );
  const isRevealingState = useSelector(gameService, (state) =>
    state.matches("revealing"),
  );
  const isRevealedState = useSelector(gameService, (state) =>
    state.matches("revealed"),
  );
  const hasThreeOrMorePets = useSelector(gameService, (state) => {
    return (
      Object.values({
        ...(state.context.state.pets?.common ?? {}),
      }).length >= 3
    );
  });
  const state = useSelector(gameService, (state) => state.context.state);

  const showBuildPetHouse = !hasPetHouse && hasThreeOrMorePets;

  const handleFeed = useCallback(
    (food: CookableName) => {
      gameService.send("pet.fed", { petId, food });
    },
    [gameService, petId],
  );

  const handleResetRequests = (petId: PetName | number) => {
    gameService.send("REVEAL", {
      event: {
        type: "reset.petRequests",
        petId,
        createdAt: new Date(),
      },
    });
  };

  const handleNeglectPet = (petId: PetName | number) => {
    gameService.send("pet.neglected", { petId });
    setTab("Info");
  };

  const handlePetFetch = (petId: PetName | number, fetch: PetResourceName) =>
    gameService.send("pet.fetched", { petId, fetch });

  if (!hasPetsAccess) {
    return null;
  }

  return (
    <Modal
      show={show}
      onHide={isRevealingState || isRevealedState ? undefined : onClose}
      // Ensures that the player clicks on continue to go back to playing state after resetting requests
    >
      {showBuildPetHouse && (
        <div className="absolute top-[-4rem] right-0 flex flex-col gap-1 items-end justify-end">
          <Label type="info">{t("pets.tiredOfManaging")}</Label>
          <Label type="vibrant" secondaryIcon={ITEM_DETAILS["Pet House"].image}>
            {t("pets.buildPetHouse")}
          </Label>
        </div>
      )}
      <CloseButtonPanel
        onClose={isRevealingState || isRevealedState ? undefined : onClose}
        tabs={[
          ...(isNeglected
            ? [
                {
                  name: t("pets.neglected"),
                  icon: getPetImage(petId, "asleep", data),
                  id: "Neglected",
                },
              ]
            : isRevealingState || isRevealedState
              ? [{ name: t("pets.feed"), icon: foodIcon, id: "Feed" }]
              : [
                  {
                    name: t("pets.info"),
                    icon: getPetImage(petId, "happy", data),
                    id: "Info",
                  },
                  { name: t("pets.feed"), icon: foodIcon, id: "Feed" },
                  {
                    name: t("pets.fetch"),
                    icon: ITEM_DETAILS["Acorn"].image,
                    id: "Fetch",
                  },
                ]),
        ]}
        currentTab={tab}
        setCurrentTab={setTab}
        container={["Feed", "Fetch"].includes(tab) ? OuterPanel : undefined}
      >
        {tab === "Info" && (
          <PetInfo
            data={data}
            type={petType}
            image={ITEM_DETAILS[isNFTPet ? "Ramsey" : petId].image}
          />
        )}
        {tab === "Feed" && (
          <PetFeed
            petId={petId}
            petData={data}
            handleFeed={handleFeed}
            handleResetRequests={handleResetRequests}
            isRevealingState={isRevealingState}
            isRevealedState={isRevealedState}
            onAcknowledged={() => gameService.send("CONTINUE")}
            state={state}
          />
        )}
        {tab === "Fetch" && (
          <PetFetch
            petId={petId}
            petData={data}
            handlePetFetch={handlePetFetch}
          />
        )}
        {tab === "Neglected" && (
          <NeglectPet
            handleNeglectPet={handleNeglectPet}
            petId={petId}
            petName={data.name}
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
