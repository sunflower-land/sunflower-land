import { Label } from "components/ui/Label";
import { FactionEmblem } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React from "react";

import exchangeIcon from "assets/icons/exchange.png";

type Rank = {
  name: string;
  icon: string;
  emblemsRequired: number;
  boost?: string;
};

const RANKS: Rank[] = [
  {
    name: "Peasant",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 0,
    boost: "?",
  },
  {
    name: "Serf",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 10,
    boost: "+0.2 ?",
  },
  {
    name: "King",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 5000,
    boost: "+0.5 ?",
  },
];
interface Props {
  emblem: FactionEmblem;
}

export const EmblemCountdown: React.FC<Props> = ({ emblem }) => {
  const { t } = useAppTranslation();
  const end = useCountdown(new Date("2024-06-14T01:00:00Z").getTime());

  return (
    <div className="p-2">
      <Label
        icon={ITEM_DETAILS[emblem].image}
        type="default"
        className="-ml-1 mb-2"
      >
        {emblem}
      </Label>
      <p className="mb-2">{t("faction.tradeEmblems")}</p>

      <Label icon={exchangeIcon} type="info" className="-ml-1 mb-2">
        {`Emblem trading opening soon`}
      </Label>

      <TimerDisplay time={end} />
    </div>
  );
};
