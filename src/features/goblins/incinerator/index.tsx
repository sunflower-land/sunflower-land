import React, { useState } from "react";

import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";
import { Incinerator } from "./Incinerator";

export const IncineratorModal: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Incinerator"),
  );
  const { t } = useAppTranslation();

  if (showTutorial) {
    return (
      <InnerPanel>
        <div className="p-2">
          <p className="mb-3">{t("incinerator.welcome")}</p>
          <p className="mb-2">{t("incinerator.description")}</p>
        </div>
        <Button
          onClick={() => {
            acknowledgeTutorial("Incinerator");
            setShowTutorial(false);
          }}
        >
          {t("continue")}
        </Button>
      </InnerPanel>
    );
  }
  return <Incinerator />;
};
