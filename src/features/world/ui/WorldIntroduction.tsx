import React, { useContext, useState } from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { hasOrderRequirements } from "features/island/delivery/components/Orders";
import { InlineDialogue } from "./TypingMessage";
import { Button } from "components/ui/Button";
import { NPCIcon } from "features/island/bumpkin/components/NPC";

interface Props {
  onClose: () => void;
}

export const WorldIntroduction: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showNPCFind, setShowNPCFind] = useState(false);

  const { t } = useAppTranslation();

  const { balance, coins, inventory } = gameState.context.state;

  // Find a delivery that is ready
  const delivery = gameState.context.state.delivery.orders.find((order) =>
    hasOrderRequirements({ order, sfl: balance, coins, inventory })
  );

  if (showNPCFind && delivery) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
        <div className="h-40 flex flex-col justify-between">
          <div className="p-1">
            <Label type={"default"} className="capitalize mb-1">{`${t(
              "world.intro.find"
            )} ${delivery.from}`}</Label>
            <InlineDialogue
              message={t("world.intro.findNPC", { name: delivery.from })}
            />
            <div className="relative mt-3 mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES[delivery.from]} />
            </div>
          </div>
          <Button onClick={onClose}>{t("ok")}</Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
      <div className="h-40 flex flex-col ">
        <Label type={"default"}>{`Pumpkin' Pete`}</Label>
        <SpeakingText
          onClose={delivery ? () => setShowNPCFind(true) : () => onClose()}
          message={[
            {
              text: t("world.intro.one"),
            },
            {
              text: delivery
                ? t("world.intro.delivery")
                : t("world.intro.missingDelivery"),
            },
          ]}
        />
      </div>
    </Panel>
  );
};
