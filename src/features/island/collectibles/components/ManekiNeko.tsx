import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import manekiNekoShaking from "assets/sfts/maneki_neko.gif";
import manekiNeko from "assets/sfts/maneki_neko_idle.gif";
import shadow from "assets/npcs/shadow16px.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "features/world/ui/chests/ChestRevealing";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverBuffs,
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
  SFTDetailPopoverTradeDetails,
} from "components/ui/SFTDetailPopover";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";

export const canShake = (shakenAt?: number) => {
  if (!shakenAt) return true;

  const today = new Date().toISOString().substring(0, 10);

  return new Date(shakenAt).toISOString().substring(0, 10) !== today;
};

interface Props {
  id: string;
  open: boolean;
}

const ManekiNekoLabel = () => {
  const { t } = useAppTranslation();
  useUiRefresher();

  const date = new Date();

  const nextRefreshInSeconds =
    24 * 60 * 60 -
    (date.getUTCHours() * 60 * 60 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds());

  return (
    <Label type="info" className="mt-2 mb-2 -ml-1">
      <span className="text-xs">
        {`${t("ready.in")}: ${secondsToString(nextRefreshInSeconds, {
          length: "medium",
        })}`}
      </span>
    </Label>
  );
};

export const ManekiNekoImage: React.FC<Props> = ({ id, open }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const manekiNekos =
    gameState.context.state.collectibles["Maneki Neko"] ??
    gameState.context.state.home.collectibles["Maneki Neko"] ??
    [];

  const hasShakenRecently = manekiNekos.some((maneki) => {
    const shakenAt = maneki.shakenAt || 0;

    return !canShake(shakenAt);
  });

  const [isRevealing, setIsRevealing] = useState(false);

  const shake = () => {
    setIsRevealing(true);

    // Can only shake a Maneki every 24 hours (even if you have multiple)
    if (hasShakenRecently) {
      return;
    }

    gameService.send("REVEAL", {
      event: {
        type: "maneki.shook",
        id,
        createdAt: new Date(),
      },
    });
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      shake();
    }
  }, [open]);

  return (
    <>
      <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute pointer-events-none"
        />
        <img
          src={open ? manekiNekoShaking : manekiNeko}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute pointer-events-none"
          alt="Maneki Neko"
        />
      </div>
      {gameState.matches("revealing") && isRevealing && (
        <Modal show>
          <Panel>
            <ChestRevealing type="Maneki Neko" />
          </Panel>
        </Modal>
      )}
      {gameState.matches("revealed") && isRevealing && (
        <Modal show>
          <Panel>
            <Revealed onAcknowledged={() => setIsRevealing(false)} />
          </Panel>
        </Modal>
      )}
    </>
  );
};

export const ManekiNeko: React.FC<{ id: string }> = ({ id }) => {
  return (
    <Popover>
      <PopoverButton as="div" className="cursor-pointer">
        {({ open }) => <ManekiNekoImage open={open} id={id} />}
      </PopoverButton>
      <PopoverPanel
        anchor={{ to: "left start" }}
        className="flex pointer-events-none"
      >
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={"Maneki Neko"} />
          <ManekiNekoLabel />
          <SFTDetailPopoverBuffs name={"Maneki Neko"} />
          <SFTDetailPopoverTradeDetails name={"Maneki Neko"} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
