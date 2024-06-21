import React, { useContext, useState } from "react";

import tikiTotem from "src/assets/sfts/time_warp_totem.webp";
import fastForward from "src/assets/icons/fast_forward.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const TimeWarpTotem: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers } = useContext(Context);

  const [_, setRender] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const expiresAt = createdAt + 2 * 60 * 60 * 1000;

  const hasExpired = Date.now() > expiresAt;

  const ModalContent = () => {
    if (hasExpired) {
      return (
        <>
          <div className="p-2">
            <img
              src={ITEM_DETAILS["Time Warp Totem"].image}
              className="w-10 mx-auto my-2"
            />
            <p className="text-xs mb-2 text-center">
              {t("description.time.warp.totem.expired")}
            </p>
          </div>
          <Button
            onClick={() => {
              gameService.send("collectible.burned", {
                name: "Time Warp Totem",
                location,
                id,
              });
            }}
          >
            {t("remove")}
          </Button>
        </>
      );
    }

    return (
      <>
        <div className="p-2">
          <img
            src={ITEM_DETAILS["Time Warp Totem"].image}
            className="w-10 mx-auto my-2"
          />
          <p className="text-xs mb-2 text-center">
            {t("description.time.warp.totem.temporarily")}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowModal(false);
          }}
        >
          {t("gotIt")}
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal show={showModal}>
        <CloseButtonPanel>
          <ModalContent />
        </CloseButtonPanel>
      </Modal>
      {hasExpired && (
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30"
          src={SUNNYSIDE.icons.dig_icon}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            right: `${PIXEL_SCALE * -8}px`,
            top: `${PIXEL_SCALE * -8}px`,
          }}
          onClick={() => setShowModal(true)}
        />
      )}
      {showTimers && (
        <div className="absolute bottom-0 left-0">
          <LiveProgressBar
            startAt={createdAt}
            endAt={expiresAt}
            formatLength="medium"
            type={"buff"}
            onComplete={() => setRender((r) => r + 1)}
          />
        </div>
      )}

      <img
        src={tikiTotem}
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute cursor-pointer"
        alt="Time Warp Totem"
        onClick={() => setShowModal(true)}
      />
      <img
        src={fastForward}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          top: `${PIXEL_SCALE * -5}px`,
          left: `${PIXEL_SCALE * 3}px`,
        }}
        className="absolute pointer-events-none animate-pulse"
      />
    </>
  );
};
