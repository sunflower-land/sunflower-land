import React, { useContext, useState } from "react";

import tikiTotem from "src/assets/sfts/tiki_totem.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { CloseButton, Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

export const TimeWarpTotem: React.FC<CollectibleProps> = ({ createdAt }) => {
  const { gameService } = useContext(Context);

  const [_, setRender] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const expiresAt = createdAt + 2 * 1000;
  const hasExpired = Date.now() > expiresAt;

  console.log({ hasExpired, expiresAt, createdAt });
  const ModalContent = () => {
    if (hasExpired) {
      return (
        <div>
          Dig it up or buy another!
          <Button
            onClick={() => {
              gameService.send("collectible.burned", {
                name: "Time Warp Totem",
              });
            }}
          >
            Remove
          </Button>
        </div>
      );
    }

    return (
      <div>
        Magical powers are in effect. For more magical items, explore the Plaza
        and craft the rare items.
      </div>
    );
  };

  return (
    <>
      <Modal centered show={showModal}>
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
      <div className="absolute bottom-0 left-0">
        <LiveProgressBar
          startAt={createdAt}
          endAt={expiresAt}
          formatLength="medium"
          onComplete={() => setRender((r) => r + 1)}
        />
      </div>

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
    </>
  );
};
