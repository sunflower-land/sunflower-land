import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import { InlineDialogue } from "../TypingMessage";
import { NPC_WEARABLES } from "lib/npcs";
import { SpecialEventModalContent } from "../SpecialEventModalContent";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SpecialEvent } from "features/game/types/specialEvents";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}

export const RABBITS = 6;

// Store per session
let RABBITS_FOUND = 0;

const lastFoundAt = localStorage.getItem("easter.rabbitsFound");

// every 24 hours the rabbits go missing
if (lastFoundAt && Number(lastFoundAt) > Date.now() - 24 * 60 * 60 * 1000) {
  RABBITS_FOUND = RABBITS;
}

export function rabbitsCaught() {
  return RABBITS_FOUND;
}

export const Hopper: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  if (RABBITS_FOUND < RABBITS) {
    return (
      <CloseButtonPanel bumpkinParts={NPC_WEARABLES.hopper}>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col justify-center p-2">
            <div className="flex justify-between items-center">
              <Label
                type="default"
                icon={SUNNYSIDE.icons.player}
                className="capitalize mb-2"
              >
                {`Hopper`}
              </Label>
              <Label type="info">
                {`${t("special.event.rabbitsMissing")}: ${
                  RABBITS - RABBITS_FOUND
                }`}
              </Label>
            </div>
            <div
              style={{
                minHeight: "50px",
              }}
              className="mb-2"
            >
              <InlineDialogue
                trail={25}
                message={t("special.event.easterIntro")}
              />
            </div>
          </div>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.hopper}>
      <SpecialEventModalContent
        eventName="Easter"
        onClose={onClose}
        event={
          gameState.context.state.specialEvents.current.Easter as SpecialEvent
        }
      />
    </CloseButtonPanel>
  );
};
