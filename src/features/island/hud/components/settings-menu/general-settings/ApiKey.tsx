import React, { useContext } from "react";

import { CopyField } from "components/ui/CopyField";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";

export const ApiKey: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);

  const apiKey = gameService.getSnapshot()?.context?.apiKey;

  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2">{t("share.apiKeyDescription")}</p>
        <p className="text-xs truncate">{`x-api-key: ${apiKey}`}</p>
        <CopyField text={apiKey} copyFieldMessage={t("share.CopyFarmURL")} />
      </div>
    </>
  );
};
