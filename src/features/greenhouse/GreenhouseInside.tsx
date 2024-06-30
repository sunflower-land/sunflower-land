import React, { useContext, useLayoutEffect } from "react";

import background from "assets/land/greenhouse_inside.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router-dom";
import { GreenhousePot } from "./GreenhousePot";
import { Hud } from "features/island/hud/Hud";
import { GreenhouseOil } from "./GreenhouseOil";

const selectOil = (state: MachineState) => state.context.state.greenhouse.oil;

export const GreenhouseInside: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  return (
    <>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={classNames("relative w-full h-full")}>
              <img
                src={background}
                id={Section.GenesisBlock}
                className="relative z-0"
                style={{
                  width: `${176 * PIXEL_SCALE}px`,
                  height: `${192 * PIXEL_SCALE}px`,
                }}
              />

              <div
                className="absolute"
                style={{
                  left: `${60.5 * PIXEL_SCALE}px`,
                  top: `${52 * PIXEL_SCALE}px`,
                  width: `${55 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhouseOil />
              </div>

              <div
                className="absolute"
                style={{
                  left: `${26 * PIXEL_SCALE}px`,
                  bottom: `${95 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={1} />
              </div>
              <div
                className="absolute"
                style={{
                  left: `${26 * PIXEL_SCALE}px`,
                  bottom: `${46 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={2} />
              </div>
              <div
                className="absolute"
                style={{
                  right: `${26 * PIXEL_SCALE}px`,
                  bottom: `${95 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={3} />
              </div>
              <div
                className="absolute"
                style={{
                  right: `${26 * PIXEL_SCALE}px`,
                  bottom: `${46 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={4} />
              </div>

              <Button
                className="absolute -bottom-16"
                onClick={() => navigate("/")}
              >
                {t("exit")}
              </Button>
            </div>
          </div>
        </div>
      </>

      <Hud isFarming={false} location="home" />
    </>
  );
};
