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
import { isWearableActive } from "features/game/lib/wearables";
import { getCurrentSeason } from "features/game/types/seasons";

export const getRegularMaxDigs = (game: GameState) => {
  let maxDigs = 25;

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

  if (isWearableActive({ name: "Bionic Drill", game })) {
    maxDigs += 5;
  }

  return maxDigs;
};

export const getRemainingDigs = (game: GameState) => {
  const { desert } = game;
  const dugCount = desert.digging.grid.length;
  const extraDigs = desert.digging.extraDigs ?? 0;
  const regularMaxDigs = getRegularMaxDigs(game);
  let digsLeft = regularMaxDigs - dugCount;

  // This is the case where a player has bought and used extra digs
  // The dug count is higher than the regular max digs
  if (digsLeft < 0) {
    digsLeft = 0;
  }

  digsLeft += extraDigs;

  return digsLeft;
};

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
