import React from "react";

import type { ExpansionNodePreviewItem } from "features/game/types/expansions";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Label } from "../Label";
import { InnerPanel } from "../Panel";

export const ExpansionNodePreview: React.FC<{
  nodes: ExpansionNodePreviewItem[];
}> = ({ nodes }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="mb-1 p-1">
      <Label type="info" className="mb-1">
        {t("expansion.resourceNodes.title")}
      </Label>

      {nodes.length === 0 && (
        <p className="text-xs">{t("expansion.resourceNodes.none")}</p>
      )}

      {nodes.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-3">
          {nodes.map(({ name, count }) => (
            <Label
              key={name}
              type="transparent"
              icon={ITEM_DETAILS[name].image}
              className="whitespace-nowrap"
            >
              {`+${count} ${ITEM_DETAILS[name].translatedName ?? name}`}
            </Label>
          ))}
        </div>
      )}
    </InnerPanel>
  );
};
