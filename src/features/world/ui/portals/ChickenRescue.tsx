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
import coins from "assets/icons/coins.webp";
import flagIcon from "assets/icons/faction_point.webp";

import { Portal } from "./Portal";
import { InlineDialogue } from "../TypingMessage";
import { SUNNYSIDE } from "assets/sunnyside";

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
    return (
      <div>
        <Portal portalName="chicken-rescue" onClose={onClose} />
      </div>
    );
  }

  return (
    <>
      <div className="mb-1">
        <Label type="default" className="mb-1">
          Minigame - Chicken Rescue
        </Label>
        <div className="h-6">
          <InlineDialogue message="Can you help me rescue the chickens?" />
        </div>

        <OuterPanel>
          <div className="px-1">
            <span className="text-xs mb-2">Mission: Rescue 50 chickens</span>
            <div className="flex justify-between mt-2 flex-wrap">
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                3 Hrs Left
              </Label>
              <div className="flex items-center space-x-2">
                <Label icon={flagIcon} type="warning">
                  10 Points
                </Label>
                <Label icon={coins} type="warning">
                  220
                </Label>
              </div>
            </div>
          </div>
        </OuterPanel>
      </div>
      <Button onClick={playNow}>Play now</Button>
    </>
  );
};
