import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import * as AuthProvider from "features/auth/lib/Provider";
import { portal } from "../community/actions/portal";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  MinigameName,
  SUPPORTED_MINIGAMES,
} from "features/game/types/minigames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { OuterPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import chickenRescueBanner from "assets/portals/chicken_rescue_preview.png";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";

interface Props {
  onClose: () => void;
}
export const ChickenRescue: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { t } = useAppTranslation();

  const playNow = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return <Portal portalName="chicken-rescue" onClose={onClose} />;
  }

  return (
    <>
      <div className="mb-1">
        <Label type="default" className="mb-1">
          Chicken Rescue
        </Label>
        <div className="h-6">
          <InlineDialogue message="Can you help me rescue the chickens?" />
        </div>
        <img
          src={chickenRescueBanner}
          className="w-full rounded-md my-1"
          alt=""
        />

        <OuterPanel>
          <span className="text-xs mb-1">Mission: Rescue 50 chickens</span>
          <div className="flex justify-between">
            <Label type="info">3 Hrs Left</Label>
            <Label type="warning">2.2</Label>
          </div>
        </OuterPanel>
      </div>
      <Button onClick={playNow}>Play now</Button>
    </>
  );
};
