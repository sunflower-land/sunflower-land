import { Panel } from "components/ui/Panel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { ChestCaptcha } from "features/island/common/chest-reward/ChestCaptcha";
import { Ocean } from "features/world/ui/Ocean";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const GoblinSwarm: React.FC = () => {
  const [state, setState] = useState<"idle" | "complete" | "fail">("idle");
  const { t } = useAppTranslation();

  if (state === "complete") {
    return (
      <Ocean>
        <Modal show centered>
          <SpeakingModal
            message={[{ text: t("congrats") }]}
            bumpkinParts={NPC_WEARABLES.grubnuk}
            onClose={() => setState("idle")}
          />
        </Modal>
      </Ocean>
    );
  }

  if (state === "fail") {
    return (
      <Ocean>
        <Modal show centered>
          <SpeakingModal
            message={[{ text: "On no, you failed the challenge!" }]}
            bumpkinParts={NPC_WEARABLES.grubnuk}
            onClose={() => setState("idle")}
          />
        </Modal>
      </Ocean>
    );
  }

  return (
    <Ocean>
      <Modal show centered>
        <Panel>
          <ChestCaptcha
            onOpen={() => setState("complete")}
            onFail={() => setState("fail")}
          />
        </Panel>
      </Modal>
    </Ocean>
  );
};
