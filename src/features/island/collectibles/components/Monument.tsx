import React, { useContext, useState } from "react";
import { ImageStyle } from "./template/ImageStyle";
import { useVisiting } from "lib/utils/visitUtils";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import cheer from "assets/icons/cheer.webp";
import { postEffect } from "features/game/actions/effect";
import { Context } from "features/game/GameProvider";
import { randomID } from "lib/utils/random";

export const Monument: React.FC<React.ComponentProps<typeof ImageStyle>> = (
  input,
) => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);

  const [isCheering, setIsCheering] = useState(false);

  const handleCheer = async () => {
    try {
      setIsCheering(true);
      await postEffect({
        effect: { type: "monument.cheered" },
        token: gameService.getSnapshot().context.rawToken as string,
        farmId: gameService.getSnapshot().context.farmId,
        transactionId: randomID(),
      });
      setIsCheering(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ImageStyle {...input} />
      {isVisiting && (
        <div
          className="absolute -top-4 -right-4 pointer-events-auto cursor-pointer hover:img-highlight"
          onClick={handleCheer}
        >
          <div
            className="relative mr-2"
            style={{ width: `${PIXEL_SCALE * 20}px` }}
          >
            <img className="w-full" src={SUNNYSIDE.icons.disc} />
            <img
              className="absolute"
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
    </>
  );
};
