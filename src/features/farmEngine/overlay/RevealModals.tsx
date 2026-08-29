import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import genieLamp from "assets/sfts/genie_lamp.png";
import genieImg from "assets/npcs/genie.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { ChestRevealing } from "features/world/ui/chests/ChestRevealing";
import { NPC_WEARABLES } from "lib/npcs";
import { setImageWidth } from "lib/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { GameBridge, FarmModalRequest } from "../bridge/GameBridge";

/**
 * Reveal-flow collectibles [GenieLamp.tsx / ManekiNeko.tsx /
 * FestiveTree.tsx]: Phaser renders the art and detects the click, these
 * hosts run the DOM's confirm/revealing/revealed modal flows against the
 * UNCHANGED game machine's REVEAL states.
 */

const _revealing = (state: MachineState) => state.matches("revealing");
const _revealed = (state: MachineState) => state.matches("revealed");
const _genieRevealed = (state: MachineState) => state.matches("genieRevealed");

/** [GenieLamp.tsx] confirm -> REVEAL -> genieRevealed. */
const GenieLampHost: React.FC<{ id: string; onClose: () => void }> = ({
  id,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const revealing = useSelector(gameService, _revealing);
  const genieRevealed = useSelector(gameService, _genieRevealed);
  const [isRevealing, setIsRevealing] = useState(false);

  const lamps = useSelector(
    gameService,
    (state: MachineState) => state.context.state.collectibles["Genie Lamp"],
  );
  const lamp = lamps?.find((placed) => placed.id === id);
  const rubbedCount = lamp?.rubbedCount ?? 0;
  const wishesRemaining = 3 - rubbedCount;
  const hasBeenRubbed = rubbedCount > 0;

  const rub = () => {
    setIsRevealing(true);
    gameService.send("REVEAL", {
      event: {
        type: "genieLamp.rubbed",
        id,
        createdAt: new Date(),
      },
    });
  };

  if (revealing && isRevealing) {
    return (
      <Modal show backdrop="static">
        <Panel className="z-10">
          <Revealing icon={genieLamp} />
        </Panel>
      </Modal>
    );
  }

  if (genieRevealed && isRevealing) {
    return (
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
          <Revealed
            id={id}
            onAcknowledged={() => {
              setIsRevealing(false);
              onClose();
            }}
          />
        </Panel>
      </Modal>
    );
  }

  return (
    <Modal show={!isRevealing} onHide={onClose}>
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
        onClose={onClose}
        title={t("genieLamp.ready.wish")}
      >
        <div className="flex flex-col items-center p-2">
          <img
            src={genieLamp}
            alt="genieLamp"
            className="mb-2"
            onLoad={(e) => setImageWidth(e.currentTarget)}
          />
          <span className="text-center text-xs mb-1" style={{ height: "24px" }}>
            {wishesRemaining} {t("wish")}
            {wishesRemaining > 1 && "es"} {t("remaining")}
            {"!"}
          </span>
          {!hasBeenRubbed && (
            <span className="text-center text-xs mb-1">
              {t("genieLamp.cannotWithdraw")}
              {"."}
            </span>
          )}
        </div>
        <Button onClick={rub}>{t("make.wish")}</Button>
      </CloseButtonPanel>
    </Modal>
  );
};

/** [ManekiNeko.tsx] REVEAL already dispatched by the renderer. */
const ManekiNekoRevealHost: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const revealing = useSelector(gameService, _revealing);
  const revealed = useSelector(gameService, _revealed);

  if (revealing) {
    return (
      <Modal show>
        <Panel>
          <ChestRevealing type="Maneki Neko" />
        </Panel>
      </Modal>
    );
  }
  if (revealed) {
    return (
      <Modal show>
        <Panel>
          <Revealed onAcknowledged={onClose} />
        </Panel>
      </Modal>
    );
  }
  return null;
};

/** [FestiveTree.tsx] REVEAL already dispatched by the renderer. */
const FestiveTreeRevealHost: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const revealing = useSelector(gameService, _revealing);
  const revealed = useSelector(gameService, _revealed);

  if (revealing) {
    return (
      <Modal show>
        <Panel>
          <ChestRevealing type="Festive Tree Rewards" />
        </Panel>
      </Modal>
    );
  }
  if (revealed) {
    return (
      <Modal show>
        <Panel bumpkinParts={NPC_WEARABLES.santa}>
          <Revealed onAcknowledged={onClose} />
        </Panel>
      </Modal>
    );
  }
  return null;
};

/** [FestiveTree.tsx] already shaken this festive season. */
const FestiveTreeGiftedHost: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel bumpkinParts={NPC_WEARABLES.santa} onClose={onClose}>
        <div className="p-2">
          <Label type="danger">{t("festivetree.greedyBumpkin")}</Label>
          <p className="text-sm mt-2">{t("festivetree.alreadyGifted")}</p>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};

export const RevealModals: React.FC<{
  bridge: GameBridge;
  open: FarmModalRequest | undefined;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const data = (open?.data ?? {}) as { id?: string };
  return (
    <>
      {open?.name === "genieLamp" && data.id && (
        <GenieLampHost id={data.id} onClose={onClose} />
      )}
      {open?.name === "manekiNekoReveal" && (
        <ManekiNekoRevealHost onClose={onClose} />
      )}
      {open?.name === "festiveTreeReveal" && (
        <FestiveTreeRevealHost onClose={onClose} />
      )}
      {open?.name === "festiveTreeGifted" && (
        <FestiveTreeGiftedHost onClose={onClose} />
      )}
    </>
  );
};
