import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GameState } from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { Modal } from "components/ui/Modal";
import { Digby } from "features/world/ui/beach/Digby";
import { useTranslation } from "react-i18next";

export const getMaxDigs = (game: GameState) => {
  let maxDigs = 25;
  const extraDigs = game.desert.digging.extraDigs ?? 0;

  if (isCollectibleBuilt({ name: "Heart of Davy Jones", game })) {
    maxDigs += 20;
  }

  if (
    isCollectibleBuilt({
      name: "Pharaoh Chicken",
      game,
    })
  ) {
    maxDigs += 1;
  }

  return maxDigs + extraDigs;
};

export const DesertDiggingDisplay = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [show, setShow] = useState(false);

  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setShow(!show);
  };

  const dugCount = gameState.context.state.desert.digging.grid.length;

  const maxDigs = getMaxDigs(gameState.context.state);
  const digsLeft = maxDigs - dugCount;

  return (
    <>
      <div
        className="absolute top-36 left-4 cursor-pointer z-50 hover:img-highlight"
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
            type="default"
            icon={SUNNYSIDE.icons.sad}
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
      <Modal show={show}>
        <Digby onClose={() => setShow(false)} />
      </Modal>
    </>
  );
};
