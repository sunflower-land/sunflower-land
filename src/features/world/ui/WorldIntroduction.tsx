import React from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

interface Props {
  onClose: () => void;
}

export const WorldIntroduction: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
      <div className="h-40 flex flex-col ">
        <Label type={"default"}>{`Pumpkin' Pete`}</Label>
        <SpeakingText
          onClose={onClose}
          message={[
            {
              text: t("world.intro.one"),
            },
            {
              text: t("world.intro.two"),
            },
          ]}
        />
      </div>
    </Panel>
  );
};
