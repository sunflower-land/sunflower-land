import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import wheelHolder from "assets/ui/lunar_wheel_holder.png";
import wheel from "assets/ui/lunar_wheel.png";
import { Revealing } from "features/game/components/Revealing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  location: "plaza" | "lunar_island";
}

export const BasicTreasureChest: React.FC<Props> = ({ onClose, location }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [isRevealing, setIsRevealing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const hasKey = !!gameState.context.state.inventory["Treasure Key"]?.gte(1);

  const open = () => {
    // TEMP - spin the wheel animation
    if (location === "lunar_island") {
      setIsOpening(true);
      return;
    }

    gameService.send("REVEAL", {
      event: {
        key: "Treasure Key",
        location,
        type: "treasureChest.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
  };

  const spin = async () => {
    setIsSpinning(true);

    await new Promise((res) => setTimeout(res, 3000));

    setIsOpening(false);
    setIsSpinning(false);
    setIsRevealing(true);

    gameService.send("REVEAL", {
      event: {
        key: "Treasure Key",
        location: "lunar_island",
        type: "treasureChest.opened",
        createdAt: new Date(),
      },
    });
  };

  if (isSpinning || (gameState.matches("revealing") && isRevealing)) {
    // TEMP Lunar island
    if (location === "lunar_island") {
      return (
        <Panel>
          <div className="w-48 mx-auto my-2 relative">
            <img
              src={wheelHolder}
              alt="Wheel Holder"
              className="w-full z-10  absolute top-0 left-0"
            />
            <img
              src={wheel}
              alt="Wheel"
              className="w-full animate-spin"
              style={{
                transformOrigin: "calc(50%) calc(50% + 9px)",
                animation: "spin 6s linear infinite",
              }}
            />
          </div>
          <Button disabled={true}>
            {t("basic.treasure.goodLuck")}
            {"?"}
          </Button>
        </Panel>
      );
    }

    return (
      <Panel>
        <Revealing icon={SUNNYSIDE.icons.treasure} />
      </Panel>
    );
  }

  if (isOpening) {
    return (
      <Panel>
        <div className="w-48 mx-auto my-2 relative">
          <img
            src={wheelHolder}
            alt="Wheel Holder"
            className="w-full z-10  absolute top-0 left-0"
          />
          <img
            src={wheel}
            alt="Wheel"
            className="w-full"
            style={{
              transformOrigin: "calc(50%) calc(50% + 9px)",
              animation: isSpinning ? "spin 6s linear infinite" : "none",
            }}
          />
        </div>
        <Button onClick={() => spin()}>{t("spin")}</Button>
      </Panel>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Panel>
        <Revealed
          onAcknowledged={() => {
            setIsRevealing(false);
            onClose();
          }}
        />
      </Panel>
    );
  }

  if (!hasKey) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="p-2">
          <Label
            type="danger"
            className="mb-2"
            icon={ITEM_DETAILS["Treasure Key"].image}
          >
            {t("basic.treasure.missingKey")}
          </Label>
          <p className="text-xs mb-2">
            {t("basic.treasure.needKey")}
            {"."}
          </p>
          <p className="text-xs">
            {t("basic.treasure.getKey")}
            {"."}
          </p>
        </div>
      </CloseButtonPanel>
    );
  }

  const isValentinesDayUTC =
    new Date().getUTCMonth() === 1 && new Date().getUTCDate() <= 17;

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex flex-wrap mr-12">
          <Label
            type="default"
            icon={ITEM_DETAILS["Treasure Key"].image}
            className="mb-2 mr-3"
            secondaryIcon={SUNNYSIDE.icons.confirm}
          >
            {t("basic.treasure.key")}
          </Label>
          {isValentinesDayUTC && (
            <Label
              className="mb-2"
              type="vibrant"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              Valentine Rewards
            </Label>
          )}
        </div>
        <p className="text-xs mb-2">{t("basic.treasure.congratsKey")}</p>
        <p className="text-xs mb-2">{t("basic.treasure.openChest")}</p>
      </div>
      <Button onClick={open}>{t("open")}</Button>
    </CloseButtonPanel>
  );
};
