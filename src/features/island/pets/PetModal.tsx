import React, { useContext, useState } from "react";
import {
  isPetNFT,
  Pet,
  PetNFT,
  PetType,
  getPetType,
  PET_CATEGORIES,
  getPetLevel,
  PetResourceName,
} from "features/game/types/pets";
import { Modal } from "components/ui/Modal";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { CookableName } from "features/game/types/consumables";
import { ResetFoodRequests } from "./ResetFoodRequests";
import { PetFeed } from "./PetFeed";
import { PetFetch } from "./PetFetch";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PetTypeFed } from "./PetTypeFed";
import { getPetImage } from "./lib/petShared";
import classNames from "classnames";

import levelUp from "assets/icons/level_up.png";
import xpIcon from "assets/icons/xp.png";
import { Checkbox } from "components/ui/Checkbox";

interface Props {
  show: boolean;
  onClose: () => void;
  data: Pet | PetNFT;
  isNeglected: boolean;
  isTypeFed?: boolean;
  petType?: PetType;
}

const _game = (state: MachineState) => state.context.state;

export const PetModal: React.FC<Props> = ({
  show,
  onClose,
  data,
  isTypeFed,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [display, setDisplay] = useState<
    "feeding" | "fetching" | "resetting" | "typeFed"
  >(isTypeFed ? "typeFed" : "feeding");
  const [showRewards, setShowRewards] = useState(false);
  const game = useSelector(gameService, _game);
  const isNFTPet = isPetNFT(data);
  const petId = isNFTPet ? data.id : data?.name;

  const handleFeed = (food: CookableName) => {
    gameService.send("pet.fed", {
      petId,
      food,
    });
  };

  const handlePetFetch = (fetch: PetResourceName) => {
    gameService.send("pet.fetched", {
      petId,
      fetch,
    });
  };

  const handleResetRequests = () => {
    gameService.send("REVEAL", {
      event: {
        type: "reset.petRequests",
        petId,
        createdAt: new Date(),
      },
    });
  };

  const image = getPetImage("happy", petId);
  const type = getPetType(data) as PetType;
  const petCategory = PET_CATEGORIES[type];
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getPetLevel(data.experience);
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <Modal show={show} onHide={onClose}>
      <OuterPanel className="flex flex-col gap-1">
        <div className="flex items-center p-1 justify-between">
          <div className="flex flex-row gap-2 items-center">
            <Label type="default">
              <span className="text-sm px-0.5 pb-0.5">{data.name}</span>
            </Label>
            {isNFTPet && (
              <div className="flex flex-row gap-2 items-center">
                <Checkbox
                  checked={!!data.walking}
                  onChange={() => gameService.send("pet.walked", { petId })}
                />
                <p className="text-xs">{t("pets.follow")}</p>
              </div>
            )}
          </div>
          <img
            onClick={onClose}
            src={SUNNYSIDE.icons.close}
            alt={data.name}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        {/* Pet Information Panel */}
        <InnerPanel>
          <div className="flex px-4 py-3 gap-4 w-full items-center">
            <div className="flex flex-col justify-center w-1/4 items-center gap-2">
              <img
                src={image}
                alt={data.name}
                className={classNames("object-contain", {
                  "w-16": !isNFTPet,
                  "w-24": isNFTPet,
                })}
              />
            </div>
            <div className="flex flex-col">
              {/* Pet Type and Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                <Label type="info" className="text-xs">
                  {getPetType(data)}
                </Label>
                <Label type="chill" className="text-xs">
                  {petCategory.primary}
                </Label>
                {petCategory.secondary && (
                  <Label type="formula" className="text-xs">
                    {petCategory.secondary}
                  </Label>
                )}
                {petCategory.tertiary && (
                  <Label type="vibrant" className="text-xs">
                    {petCategory.tertiary}
                  </Label>
                )}
              </div>

              {/* Level and Experience */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <img src={levelUp} className="w-4" />
                  <span className="ml-1 text-xs">
                    {t("pets.level", { level })}
                  </span>
                </div>
                {/* Energy */}
                <div className="flex items-center gap-2 text-xs mb-1">
                  <img src={SUNNYSIDE.icons.lightning} className="h-5" />
                  <span>{t("pets.energy", { energy: data.energy })}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <img src={xpIcon} className="w-5" />
                <ResizableBar
                  percentage={percentage}
                  type="progress"
                  outerDimensions={{ width: 30, height: 7 }}
                />
                <span className="text-xs mb-1">
                  {t("pets.xp", {
                    currentProgress,
                    experienceBetweenLevels: experienceBetweenLevels,
                  })}
                </span>
              </div>
            </div>
          </div>
        </InnerPanel>

        {/* Feeding & Fetching UI */}
        {(display === "feeding" || display === "fetching") && (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1.5 my-1">
              <Button
                className="h-10"
                disabled={display === "feeding"}
                onClick={() => setDisplay("feeding")}
              >
                {t("pets.feed")}
              </Button>
              <Button
                className="h-10"
                disabled={display === "fetching"}
                onClick={() => setDisplay("fetching")}
              >
                {t("pets.fetch")}
              </Button>
            </div>
            {display === "feeding" && (
              <PetFeed
                data={data}
                onFeed={handleFeed}
                onResetClick={() => setDisplay("resetting")}
              />
            )}
            {display === "fetching" && (
              <PetFetch
                data={data}
                onShowRewards={() => setShowRewards(true)}
                onFetch={handlePetFetch}
              />
            )}
          </div>
        )}
        {/* Resetting Food Requests UI */}
        {display === "resetting" && (
          <ResetFoodRequests
            petData={data}
            inventory={game.inventory}
            todayDate={todayDate}
            handleResetRequests={handleResetRequests}
            onAcknowledged={() => {
              gameService.send("CONTINUE");
            }}
            onBack={() => setDisplay("feeding")}
          />
        )}
        {/* Type Fed UI */}
        {display === "typeFed" && <PetTypeFed type={type} onClose={onClose} />}
      </OuterPanel>
      <ModalOverlay
        show={showRewards}
        onBackdropClick={() => setShowRewards(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowRewards(false)}
          title={t("pets.rewardsList")}
        >
          <ChestRewardsList
            type="Fossil Shell"
            chestDescription={[
              {
                text: t("pets.rewardsListDescription"),
                icon: ITEM_DETAILS["Fossil Shell"].image,
              },
              {
                text: t("pets.rewardsListDescriptionTwo"),
                icon: SUNNYSIDE.icons.lightning,
              },
            ]}
          />
        </CloseButtonPanel>
      </ModalOverlay>
    </Modal>
  );
};
