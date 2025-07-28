import React, { useContext, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import cheer from "assets/icons/cheer.webp";
import { postEffect } from "features/game/actions/effect";
import { Context } from "features/game/GameProvider";
import { randomID } from "lib/utils/random";
import { ProgressBar } from "components/ui/ProgressBar";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";

const CheerModal: React.FC<{ onClose: () => void; onCheer: () => void }> = ({
  onClose,
  onCheer,
}) => {
  return (
    <Panel>
      <div className="flex flex-col items-center">
        <div className="text-2xl font-bold">
          Cheer the Woodcutter's Monument
        </div>
        <div className="text-sm text-gray-500">
          Cheer the Woodcutter's Monument to earn rewards!
        </div>
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCheer}>Cheer</Button>
      </div>
    </Panel>
  );
};

export const Monument: React.FC<React.ComponentProps<typeof ImageStyle>> = (
  input,
) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);

  const [isCheering, setIsCheering] = useState(false);

  const handleCheer = async () => {
    try {
      gameService.send("villageProject.cheered", {
        effect: {
          type: "villageProject.cheered",
          project: "Woodcutter's Monument",
          // In the context of visiting, this is the farmId of the land being visited
          farmId: gameService.getSnapshot().context.farmId,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheering(false);
    }
  };

  return (
    <>
      <ImageStyle {...input} />
      {isVisiting && (
        <div
          className="absolute -top-4 -right-4 pointer-events-auto cursor-pointer hover:img-highlight"
          onClick={() => setIsCheering(true)}
        >
          <div
            className="relative mr-2"
            style={{ width: `${PIXEL_SCALE * 20}px` }}
          >
            <img className="w-full" src={SUNNYSIDE.icons.disc} />
            <img
              className={`absolute`}
              src={cheer}
              style={{
                width: `${PIXEL_SCALE * 17}px`,
                right: `${PIXEL_SCALE * 2}px`,
                top: `${PIXEL_SCALE * 2}px`,
              }}
            />
          </div>
        </div>
      )}
      <div
        className="absolute bottom-2 left-1/2"
        style={{
          width: `${PIXEL_SCALE * 20}px`,
        }}
      >
        <ProgressBar
          type="quantity"
          percentage={50}
          formatLength="full"
          className="ml-1 -translate-x-1/2"
        />
      </div>
      <Modal show={isCheering} onHide={() => setIsCheering(false)}>
        <CheerModal
          onClose={() => setIsCheering(false)}
          onCheer={handleCheer}
        />
      </Modal>
    </>
  );
};
