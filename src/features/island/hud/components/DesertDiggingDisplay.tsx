import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { Digby } from "features/world/ui/beach/Digby";
import { useTranslation } from "react-i18next";
import { getRemainingDigs } from "features/game/types/desert";

export const DesertDiggingDisplay = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [show, setShow] = useState(false);
  const { desert } = gameState.context.state;

  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setShow(!show);
  };

  const dugCount = desert.digging.grid.length;
  const digsLeft = getRemainingDigs(gameState.context.state);

  return (
    <>
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer z-50 hover:img-highlight"
        onClick={handleClick}
      >
        {!!digsLeft && dugCount > 0 && (
          <Label
            type="default"
            icon={SUNNYSIDE.tools.sand_shovel}
            secondaryIcon={SUNNYSIDE.icons.expression_confused}
          >
            <span className="text">
              {t("desert.hud.digsLeft", { digsLeft })}
            </span>
          </Label>
        )}
        {digsLeft === 0 && (
          <Label
            type="warning"
            icon={SUNNYSIDE.tools.sand_shovel}
            secondaryIcon={SUNNYSIDE.icons.expression_confused}
          >
            <span className="text">{t("desert.hud.noDigsLeft")}</span>
          </Label>
        )}
        {dugCount === 0 && (
          <Label
            type="default"
            icon={SUNNYSIDE.tools.sand_shovel}
            secondaryIcon={SUNNYSIDE.icons.expression_confused}
          >
            <span className="text">{t("desert.hud.newSite")}</span>
          </Label>
        )}
      </div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Digby onClose={() => setShow(false)} />
      </Modal>
    </>
  );
};
