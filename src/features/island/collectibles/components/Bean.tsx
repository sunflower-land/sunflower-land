import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { BeanName, BEANS } from "features/game/types/beans";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { useActor } from "@xstate/react";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

export const getBeanStates = (name: InventoryItemName, createdAt: number) => {
  const plantSeconds = BEANS()[name as BeanName].plantSeconds;

  const secondsPassed = (Date.now() - createdAt) / 1000;

  const timeLeft = plantSeconds - secondsPassed;
  const isReady = timeLeft <= 0;
  return { isReady, timeLeft, plantSeconds };
};

export const Bean: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  name = "Magic Bean",
}) => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isRevealing, setIsRevealing] = useState(false);

  useUiRefresher();

  const { isReady, timeLeft, plantSeconds } = getBeanStates(name, createdAt);

  const harvest = () => {
    setIsRevealing(true);
    gameService.send("REVEAL", {
      event: {
        type: "bean.harvested",
        id,
        name,
        createdAt: new Date(),
      },
    });
  };

  if (isReady) {
    return (
      <>
        <div
          className="absolute w-full h-full hover:img-highlight cursor-pointer"
          onClick={harvest}
        >
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={
              "z-10 absolute" + (showAnimations ? " animate-float" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              left: `${PIXEL_SCALE * 14}px`,
              bottom: `${PIXEL_SCALE * 26}px`,
            }}
          />
          <img
            src={SUNNYSIDE.crops.magicBeanready}
            style={{
              width: `${PIXEL_SCALE * 30}px`,
              left: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
            }}
            className="absolute pointer-events-none"
            alt="Bean"
          />
        </div>

        {gameState.matches("revealing") && isRevealing && (
          <Modal show backdrop="static">
            <Panel className="z-10">
              <Revealing icon={SUNNYSIDE.crops.magicBean} />
            </Panel>
          </Modal>
        )}

        {gameState.matches("beanRevealed") && isRevealing && (
          <Modal show backdrop="static">
            <Panel className="z-10">
              <Revealed id={id} onAcknowledged={() => setIsRevealing(false)} />
            </Panel>
          </Modal>
        )}
      </>
    );
  }

  const image =
    timeLeft <= plantSeconds / 2
      ? SUNNYSIDE.crops.magicBeangrowing
      : SUNNYSIDE.crops.magicBeanplanted;

  return (
    <Popover>
      <PopoverButton as="div">
        <div className="absolute w-full h-full hover:img-highlight cursor-pointer">
          <img
            src={image}
            style={{
              width: `${PIXEL_SCALE * 30}px`,
              left: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
            }}
            className="absolute pointer-events-none"
            alt="Bean"
          />
        </div>
      </PopoverButton>

      <PopoverPanel anchor={{ to: "left start" }} className="flex">
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={"Magic Bean"} />
          <Label type="info" className="mt-2 mb-2 -ml-1">
            <span className="text-xs">
              {`${t("ready.in")}: ${secondsToString(timeLeft, {
                length: "medium",
              })}`}
            </span>
          </Label>
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
