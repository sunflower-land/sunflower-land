import React, { useState } from "react";

import { useGame } from "features/game/GameProvider";

import genieLamp from "assets/sfts/genie_lamp.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Modal } from "components/ui/Modal";
import classNames from "classnames";

import genieImg from "assets/npcs/genie.png";
import { setImageWidth } from "lib/images";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

interface Props {
  id: string;
}

const _genieRevealing = (state: MachineState) => state.matches("revealing");
const _genieRevealed = (state: MachineState) => state.matches("revealed");

export const GenieLamp: React.FC<Props> = ({ id }) => {
  const { gameService, state } = useGame();
  const genieRevealing = useSelector(gameService, _genieRevealing);
  const genieRevealed = useSelector(gameService, _genieRevealed);

  const lamps = state.collectibles["Genie Lamp"];
  const lamp = lamps?.find((lamp) => lamp.id === id);
  const rubbedCount = lamp?.rubbedCount ?? 0;
  const wishesRemaining = 3 - rubbedCount;
  const hasBeenRubbed = rubbedCount > 0;

  const [isConfirming, setIsConfirming] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const { t } = useAppTranslation();

  const rub = () => {
    setIsConfirming(false);
    setIsRevealing(true);

    gameService.send("REVEAL", {
      event: {
        type: "genieLamp.rubbed",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <div
      className="absolute"
      style={{ left: `${PIXEL_SCALE * 4}px`, width: `${PIXEL_SCALE * 22}px` }}
    >
      <img
        onClick={() => setIsConfirming(true)}
        src={genieLamp}
        className={classNames(
          "absolute w-full cursor-pointer hover:img-highlight",
          {
            "saturate-50": hasBeenRubbed,
          },
        )}
        alt="Genie Lamp"
      />
      <Modal show={isConfirming} onHide={() => setIsConfirming(false)}>
        <img
          src={genieImg}
          className="absolute z-0"
          style={{
            width: `${PIXEL_SCALE * 100}px`,
            top: `${PIXEL_SCALE * -55}px`,
            left: `${PIXEL_SCALE * -10}px`,
          }}
        />
        <CloseButtonPanel
          className="z-10"
          onClose={() => setIsConfirming(false)}
          title={t("genieLamp.ready.wish")}
        >
          <div className="flex flex-col items-center p-2">
            <img
              src={genieLamp}
              alt="genieLamp"
              className="mb-2"
              onLoad={(e) => setImageWidth(e.currentTarget)}
            />
            <span
              className="text-center text-xs mb-1"
              style={{
                height: "24px",
              }}
            >
              {wishesRemaining} {t("wish")}
              {wishesRemaining > 1 && "es"} {t("remaining")}
              {"!"}
            </span>
            {!hasBeenRubbed && (
              <span className="text-center text-xs mb-1">
                {t("genieLamp.cannotWithdraw")}
                {"."}
                <a
                  className="underline"
                  href="https://docs.sunflower-land.com/player-guides/islands/treasure-island#genie-lamp"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("read.more")}
                </a>
              </span>
            )}
          </div>
          <Button onClick={rub}>{t("make.wish")}</Button>
        </CloseButtonPanel>
      </Modal>

      {genieRevealing && isRevealing && (
        <Modal show backdrop="static">
          <Panel className="z-10">
            <Revealing icon={genieLamp} />
          </Panel>
        </Modal>
      )}
      {genieRevealed && isRevealing && (
        <Modal show backdrop="static">
          <img
            src={genieImg}
            className="absolute z-0"
            style={{
              width: `${PIXEL_SCALE * 100}px`,
              top: `${PIXEL_SCALE * -55}px`,
              left: `${PIXEL_SCALE * -10}px`,
            }}
          />
          <Panel className="z-10">
            <Revealed id={id} onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </div>
  );
};
