import React from "react";
import { BuildingProduct } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";

interface QueueSlotProps {
  item?: BuildingProduct;
  isLocked?: boolean;
  readyRecipes: BuildingProduct[];
}

export const QueueSlot: React.FC<QueueSlotProps> = ({
  item,
  isLocked,
  readyRecipes,
}) => {
  if (isLocked) {
    return (
      <Box
        showOverlay={true}
        overlayIcon={
          <div className="flex justify-center items-center">
            <img src={SUNNYSIDE.icons.lock} alt="locked slot" className="w-5" />
          </div>
        }
      />
    );
  }

  if (!item) return <Box />;

  const isReady = readyRecipes.some(
    (recipe) => recipe.name === item.name && recipe.readyAt === item.readyAt,
  );

  return (
    <div className="relative">
      {isReady && (
        <img
          className="absolute top-1 right-1 w-4 z-10"
          src={SUNNYSIDE.icons.confirm}
        />
      )}
      <Box image={ITEM_DETAILS[item.name].image} />
    </div>
  );
};
