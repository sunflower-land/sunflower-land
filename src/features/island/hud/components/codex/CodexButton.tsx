import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import coins from "assets/ui/coins.png";
import speechBubble from "assets/ui/speech_border.png";

import { Codex } from "./Codex";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";

const _delivery = (state: MachineState) => state.context.state.delivery;
const _level = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

export const CodexButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { gameService } = useContext(Context);

  const deliveries = useSelector(gameService, _delivery);
  const level = useSelector(gameService, _level);

  const hasDeliveries = hasNewOrders(deliveries) && level >= 2;

  const { t } = useAppTranslation();

  return (
    <div className="relative">
      <div
        className="relative flex cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 22}px`,
          height: `${PIXEL_SCALE * 22}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <img
          src={SUNNYSIDE.ui.round_button}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.search}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />

        {hasDeliveries && (
          <div
            className="absolute "
            style={{
              width: `${PIXEL_SCALE * 68}px`,
              left: `${PIXEL_SCALE * 11}px`,
              top: `${PIXEL_SCALE * 3}px`,
            }}
          >
            <div
              className={"absolute uppercase"}
              style={{
                fontFamily: "Teeny",
                color: "black",
                textShadow: "none",
                top: `${PIXEL_SCALE * -8}px`,
                left: `${PIXEL_SCALE * 6}px`,

                borderImage: `url(${speechBubble})`,
                borderStyle: "solid",
                borderTopWidth: `${PIXEL_SCALE * 2}px`,
                borderRightWidth: `${PIXEL_SCALE * 2}px`,
                borderBottomWidth: `${PIXEL_SCALE * 4}px`,
                borderLeftWidth: `${PIXEL_SCALE * 5}px`,

                borderImageSlice: "2 2 4 5 fill",
                imageRendering: "pixelated",
                borderImageRepeat: "stretch",
                fontSize: "8px",
              }}
            >
              <div
                style={{
                  height: "12px",
                  minWidth: "50px",
                  paddingRight: "14px",
                }}
              >
                <span
                  className="whitespace-nowrap"
                  style={{
                    fontSize: "10px",
                    position: "relative",
                    bottom: "4px",
                    left: "4px",
                    wordSpacing: "-4px",
                    color: "#262b45",
                  }}
                >
                  {t("deliveries.new")}
                </span>
                <img
                  src={coins}
                  className="absolute animate-pulsate"
                  style={{
                    width: "30px",
                    top: "-12px",
                    right: "-22px",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Codex show={isOpen} onHide={() => setIsOpen(false)} />
    </div>
  );
};
