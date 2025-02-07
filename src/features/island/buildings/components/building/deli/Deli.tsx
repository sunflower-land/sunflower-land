import React, { useContext, useState } from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DeliModal } from "./DeliModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { DELI_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { useSound } from "lib/utils/hooks/useSound";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useCookingState } from "features/island/buildings/lib/useCookingState";
import { ReadyRecipes } from "../ReadyRecipes";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

const _deli = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Deli"]?.find((b) => b.id === id);

export const Deli: React.FC<Props> = ({
  buildingId,
  isBuilt,
  onRemove,
  season,
}) => {
  const { gameService } = useContext(Context);

  const deli = useSelector(gameService, _deli(buildingId));
  const [showModal, setShowModal] = useState(false);
  const { cooking, queuedRecipes, readyRecipes } = useCookingState(deli ?? {});

  const { play: bakeryAudio } = useSound("bakery");

  const handleCook = (item: CookableName) => {
    gameService?.send({
      type: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    gameService?.send({
      type: "recipes.collected",
      building: "Deli",
      buildingId,
    });
  };

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (!isBuilt) return;

    if (!cooking && readyRecipes.length > 0) {
      handleCollect();
    } else {
      bakeryAudio();
      setShowModal(true);
    }
  };

  return (
    <>
      <BuildingImageWrapper
        name="Deli"
        onClick={handleClick}
        ready={readyRecipes?.length > 0}
      >
        <img
          src={DELI_VARIANTS[season]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            width: `${PIXEL_SCALE * 64}px`,
            height: `${PIXEL_SCALE * 54}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            right: `${PIXEL_SCALE * 2.5}px`,
            bottom: `${PIXEL_SCALE * 15}px`,
          }}
        />
        {cooking ? (
          <img
            src={SUNNYSIDE.npcs.artisianDoing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 17}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 17}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.artisian}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 17}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}

        {cooking && (
          <img
            src={ITEM_DETAILS[cooking.name].image}
            className="absolute pointer-events-none z-30"
            onLoad={(e) => {
              const img = e.currentTarget;
              if (
                !img ||
                !img.complete ||
                !img.naturalWidth ||
                !img.naturalHeight
              ) {
                return;
              }

              const right = Math.floor(8 - img.naturalWidth / 2);
              img.style.right = `${PIXEL_SCALE * right}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 8}px`,
            }}
          />
        )}
        <ReadyRecipes readyRecipes={readyRecipes} leftOffset={90} />
      </BuildingImageWrapper>

      <DeliModal
        queue={queuedRecipes ?? []}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
        cooking={cooking}
        itemInProgress={cooking?.name}
        buildingId={buildingId}
      />
    </>
  );
};
