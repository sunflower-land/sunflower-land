import React from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { PLOT_CROP_LIFECYCLE } from "../plots/lib/plant";
import { ITEM_DETAILS } from "features/game/types/images";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
interface GuideItem {
  icon: string;
  content: string;
}

const FishingGuideItem: React.FC<{ icon: string; content: string }> = ({
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

export const FishingGuide: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const basicGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.tools.fishing_rod,
      content: translate("fishingGuide.catch.rod"),
    },
    {
      icon: ITEM_DETAILS["Red Wiggler"].image,
      content: translate("fishingGuide.bait.earn"),
    },
    {
      icon: powerup,
      content: translate("fishingGuide.eat.fish"),
    },
  ];

  const advancedGuide: GuideItem[] = [
    {
      icon: SUNNYSIDE.icons.search,
      content: translate("fishingGuide.discover.fish"),
    },
    {
      icon: SUNNYSIDE.icons.stopwatch,
      content: translate("fishingGuide.condition"),
    },
    {
      icon: PLOT_CROP_LIFECYCLE.Carrot.crop,
      content: translate("fishingGuide.bait.chum"),
    },
    {
      icon: SUNNYSIDE.icons.stressed,
      content: translate("fishingGuide.legendery.fish"),
    },
  ];
  return (
    <div
      style={{ maxHeight: "320px" }}
      className="overflow-y-auto scrollable flex flex-wrap pt-1.5 pr-0.5"
    >
      <div className="flex flex-col gap-y-3 p-2">
        <img
          src={SUNNYSIDE.tutorial.fishingTutorial}
          className="w-full rounded-lg"
        />

        {basicGuide.map((item, i) => (
          <FishingGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <img
          src={SUNNYSIDE.tutorial.fishingCodex}
          className="w-full rounded-lg"
        />

        {advancedGuide.map((item, i) => (
          <FishingGuideItem key={i} icon={item.icon} content={item.content} />
        ))}

        <Button onClick={onClose} className="mt-2">
          {t("gotIt")}
        </Button>
      </div>
    </div>
  );
};
