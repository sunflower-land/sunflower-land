import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getCaveBatchDuration } from "features/game/lib/cave";
import { CAVE_TIERS } from "features/game/types/caveTiers";
import {
  SpeakingModal,
  type Message,
} from "features/game/components/SpeakingModal";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import type { CaveTutorialStep } from "../lib/onboarding";

/** What Gloomwick's speech bubble sums each step up as. */
export const CAVE_TUTORIAL_BUBBLES: Record<CaveTutorialStep, TranslationKeys> =
  {
    "start-batch": "cave.tutorial.bubble.startBatch",
    wait: "cave.tutorial.bubble.wait",
    dig: "cave.tutorial.bubble.dig",
    "buy-shovels": "cave.tutorial.bubble.buyShovels",
    clue: "cave.tutorial.bubble.clue",
    expand: "cave.tutorial.bubble.expand",
  };

const _batchSeconds = (state: MachineState) =>
  getCaveBatchDuration(state.context.state).duration / 1000;

/** Gloomwick telling the player what this step is about, shown once. */
export const CaveTutorialPopup: React.FC<{
  step: CaveTutorialStep;
  onClose: () => void;
}> = ({ step, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const batchSeconds = useSelector(gameService, _batchSeconds);

  const messages: Record<CaveTutorialStep, Message[]> = {
    "start-batch": [
      { text: t("cave.tutorial.startBatch.one") },
      { text: t("cave.tutorial.startBatch.two") },
      { text: t("cave.tutorial.startBatch.three") },
    ],
    wait: [
      {
        text: t("cave.tutorial.wait.one", {
          time: secondsToString(batchSeconds, { length: "medium" }),
        }),
      },
      { text: t("cave.tutorial.wait.two") },
    ],
    dig: [
      { text: t("cave.tutorial.dig.one") },
      { text: t("cave.tutorial.dig.two") },
    ],
    "buy-shovels": [{ text: t("cave.tutorial.buyShovels.one") }],
    clue: [
      { text: t("cave.tutorial.clue.one") },
      { text: t("cave.tutorial.clue.two") },
    ],
    expand: [
      { text: t("cave.tutorial.expand.one") },
      {
        text: t("cave.tutorial.expand.two", {
          mud: CAVE_TIERS[2].ingredients.Mud?.toString() ?? "0",
        }),
      },
      { text: t("cave.tutorial.expand.three") },
    ],
  };

  return (
    <Modal show>
      <SpeakingModal
        key={step}
        bumpkinParts={NPC_WEARABLES.gloomwick}
        message={messages[step]}
        onClose={onClose}
      />
    </Modal>
  );
};

/** The pulsing tutorial hand, placed over the thing to touch. */
export const CaveTutorialHand: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <img
    src={SUNNYSIDE.icons.click_icon}
    className="absolute pointer-events-none z-30 animate-pulsate"
    style={{
      width: `${PIXEL_SCALE * 18}px`,
      right: `${PIXEL_SCALE * -8}px`,
      top: `${PIXEL_SCALE * 6}px`,
      ...style,
    }}
  />
);
