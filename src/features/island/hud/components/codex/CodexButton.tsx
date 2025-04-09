import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import codex from "assets/icons/codex.webp";

import { Codex } from "./Codex";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { RoundButton } from "components/ui/RoundButton";

const _delivery = (state: MachineState) => state.context.state.delivery;
const _level = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

export const CodexButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { gameService } = useContext(Context);

  const deliveries = useSelector(gameService, _delivery);
  const level = useSelector(gameService, _level);

  const hasDeliveries =
    // Show if any new orders has popped up (but not for new players)
    (hasNewOrders(deliveries) && level >= 2) ||
    // For new players, always show until they fulfill a delivery
    (level >= 2 && deliveries.fulfilledCount === 0);

  const { t } = useAppTranslation();

  return (
    <div
      className="absolute"
      style={{
        top: `${PIXEL_SCALE * 29}px`,
        left: `${PIXEL_SCALE * 28}px`,
      }}
    >
      <RoundButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(true);
        }}
        buttonSize={18}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        >
          <img
            src={codex}
            className="group-active:translate-y-[2px]"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        </div>

        {hasDeliveries && (
          <>
            <div
              className="absolute hidden sm:block"
              style={{
                width: `${PIXEL_SCALE * 68}px`,
                left: `${PIXEL_SCALE * 10}px`,
                top: `${PIXEL_SCALE * 5}px`,
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

                  borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
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
                    src={SUNNYSIDE.ui.coins}
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
            <img
              src={SUNNYSIDE.ui.coins}
              className="absolute animate-pulsate sm:hidden"
              style={{
                width: "30px",
                top: "-2px",
                right: "-10px",
              }}
            />
          </>
        )}
      </RoundButton>
      <Codex show={isOpen} onHide={() => setIsOpen(false)} />
    </div>
  );
};
