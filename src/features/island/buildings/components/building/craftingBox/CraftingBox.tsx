import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useTranslation } from "react-i18next";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { CraftingBoxModalContent } from "./components/CraftingBoxModalContent";

import craftingBoxAnimation from "assets/buildings/crafting_box_animation.webp";
import { useNow } from "lib/utils/hooks/useNow";

const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const { gameService } = useContext(Context);

  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);
  const now = useNow({ live: true, autoEndAt: craftingReadyAt });

  const isReady = craftingStatus === "crafting" && craftingReadyAt <= now;

  const handleOpen = () => {
    gameService.send("SAVE");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  return (
    <>
      <BuildingImageWrapper name="Crafting Box" onClick={handleOpen}>
        <img
          src={
            craftingStatus === "crafting" && !isReady
              ? craftingBoxAnimation
              : ITEM_DETAILS["Crafting Box"].image
          }
          alt={t("crafting.craftingBox")}
          className={`cursor-pointer hover:img-highlight absolute`}
          style={{
            left: `${PIXEL_SCALE * -1}px`,
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
        />
        {isReady && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute -top-8 ready -ml-[5px] left-1/2 transform -translate-x-1/2 z-20"
            style={{ width: `${PIXEL_SCALE * 4}px` }}
          />
        )}
      </BuildingImageWrapper>

      <Modal show={showModal} onHide={handleClose}>
        <CraftingBoxModalContent onClose={handleClose} />
      </Modal>
    </>
  );
};
