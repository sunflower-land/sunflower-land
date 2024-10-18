import React, { useContext, useState, useEffect } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineState } from "features/game/lib/gameMachine";
import { useTranslation } from "react-i18next";
import { CraftTab } from "./components/CraftTab";
import { RecipesTab } from "./components/RecipesTab";
import { hasFeatureAccess } from "lib/flags";

const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [currentTab, setCurrentTab] = useState(1);

  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);

  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const processRemainingTime = () => {
    const now = Date.now();
    const remaining = Math.max(0, craftingReadyAt - now);
    setRemainingTime(remaining);

    return remaining;
  };

  useEffect(() => {
    if (craftingStatus === "crafting" && craftingReadyAt) {
      processRemainingTime();

      const interval = setInterval(() => {
        const remaining = processRemainingTime();
        if (remaining <= 0) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [craftingStatus, craftingReadyAt]);

  const isPending = craftingStatus === "pending";

  const handleOpen = () => {
    gameService.send("SAVE");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const hasAccess = hasFeatureAccess(
    gameService.getSnapshot().context.state,
    "CRAFTING_BOX",
  );
  return (
    <>
      <div className="absolute bottom-0">
        <img
          src={ITEM_DETAILS["Crafting Box"].image}
          alt={t("crafting.craftingBox")}
          className={`cursor-pointer hover:img-highlight`}
          style={{
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
          }}
          onClick={isPending ? undefined : handleOpen}
        />
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <CloseButtonPanel
          onClose={handleClose}
          tabs={[
            { name: t("craft"), icon: SUNNYSIDE.icons.hammer },
            { name: t("recipes"), icon: SUNNYSIDE.icons.basket },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          {!hasAccess ? (
            <p className="text-sm">{t("coming.soon")}</p>
          ) : (
            <>
              {currentTab === 0 && (
                <CraftTab
                  gameService={gameService}
                  remainingTime={remainingTime}
                />
              )}
              {currentTab === 1 && (
                <RecipesTab
                  gameService={gameService}
                  setCurrentTab={setCurrentTab}
                />
              )}
            </>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
