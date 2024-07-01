import React, { useState } from "react";

import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Button } from "components/ui/Button";
import { GarbageSale } from "./GarbageSale";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InnerPanel } from "components/ui/Panel";

export const GarbageCollectorModal: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Garbage Collector"),
  );
  const { t } = useAppTranslation();

  if (showTutorial) {
    return (
      <InnerPanel>
        <div className="p-2">
          <p className="mb-3">{t("garbageCollector.welcome")}</p>
          <p className="mb-2">{t("garbageCollector.description")}</p>
        </div>
        <Button
          onClick={() => {
            acknowledgeTutorial("Garbage Collector");
            setShowTutorial(false);
          }}
        >
          {t("continue")}
        </Button>
      </InnerPanel>
    );
  }
  return <GarbageSale />;
};
