import React, { useContext, useState } from "react";
import { BuildingProduct } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useTranslation } from "react-i18next";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { BuildingName } from "features/game/types/buildings";
import { Panel } from "components/ui/Panel";

interface QueueSlotProps {
  buildingName: BuildingName;
  buildingId: string;
  item?: BuildingProduct;
  isLocked?: boolean;
  readyRecipes: BuildingProduct[];
}

export const QueueSlot: React.FC<QueueSlotProps> = ({
  buildingName,
  buildingId,
  item,
  readyRecipes,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!item) return <Box />;

  const isReady = readyRecipes.some(
    (recipe) => recipe.name === item.name && recipe.readyAt === item.readyAt,
  );

  const handleCancel = () => {
    gameService.send("recipe.cancelled", {
      buildingName,
      buildingId,
      queueItem: item,
    });
  };

  return (
    <>
      <div className="relative">
        {isReady && (
          <img
            className="absolute top-1 right-1 w-4 z-10"
            src={SUNNYSIDE.icons.confirm}
          />
        )}
        {!isReady && (
          <img
            className="absolute top-1 right-1 w-4 z-10"
            src={SUNNYSIDE.icons.cancel}
          />
        )}
        <div
          className={!isReady ? "cursor-pointer" : ""}
          onClick={!isReady ? () => setShowConfirm(true) : undefined}
        >
          <Box image={ITEM_DETAILS[item.name].image} />
        </div>
      </div>
      <ModalOverlay
        show={showConfirm}
        onBackdropClick={() => setShowConfirm(false)}
      >
        <Panel>
          <p className="p-1.5 mb-1.5">
            {t("recipes.confirmCancel", { recipe: item.name })}
          </p>
          <div className="flex space-x-1 justify-end">
            <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
            <Button
              onClick={() => {
                setShowConfirm(false);
                handleCancel();
              }}
            >
              {t("confirm")}
            </Button>
          </div>
        </Panel>
      </ModalOverlay>
    </>
  );
};
