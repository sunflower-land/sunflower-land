import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import page from "assets/decorations/page.png";

interface Props {
  onClose: () => void;
}
interface GuideItem {
  icon: string;
  content: string;
}

const CraftingBoxGuideItem: React.FC<{ icon: string; content: string }> = ({
  icon,
  content,
}) => {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0 w-5 h-5 pt-0.5">
        <img
          src={icon}
          className="w-full h-full object-contain object-center"
        />
      </div>
      <p className="text-xs">{content}</p>
    </div>
  );
};

export const CraftingBoxGuide: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const basicGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.ui.cursor,
      content: t("craftingBoxGuide.selectResource"),
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      content: t("craftingBoxGuide.craftItem"),
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.icons.cancel,
      content: t("craftingBoxGuide.failed"),
    },
    {
      icon: SUNNYSIDE.icons.confirm,
      content: t("craftingBoxGuide.success"),
    },
    {
      icon: page,
      content: t("craftingBoxGuide.viewRecipe"),
    },
  ];

  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        {basicGuide.map((item, i) => (
          <CraftingBoxGuideItem
            key={i}
            icon={item.icon}
            content={item.content}
          />
        ))}

        <img
          src={SUNNYSIDE.tutorial.craftingBox}
          className="w-full rounded-lg"
        />

        {advancedGuide.map((item, i) => (
          <CraftingBoxGuideItem
            key={i}
            icon={item.icon}
            content={item.content}
          />
        ))}

        <Button onClick={onClose} className="mt-2">
          {t("gotIt")}
        </Button>
      </div>
    </div>
  );
};
