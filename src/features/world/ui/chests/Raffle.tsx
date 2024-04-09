import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import React, { useContext } from "react";

import chestIcon from "assets/icons/gift.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
}

export const Raffle: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const enterRaffle = async () => {
    gameService.send("raffle.entered");
  };

  const monthKey = new Date().toISOString().slice(0, 7);

  let entries =
    gameState.context.state.pumpkinPlaza?.raffle?.entries[monthKey] ?? 0;

  // If it is April, show the entries from March as well
  if (monthKey === "2024-04") {
    entries +=
      gameState.context.state.pumpkinPlaza?.raffle?.entries["2024-03"] ?? 0;
  }
  const tickets =
    gameState.context.state.inventory["Prize Ticket"] ?? new Decimal(0);

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex flex-wrap mr-12">
          <Label
            icon={chestIcon}
            type="default"
            className="mb-2 mr-3 capitalize"
          >
            {t("raffle.title")}
          </Label>
        </div>
        <p className="text-xs mb-1">{t("raffle.description")}</p>
        <p className="text-xs mb-1">{`- 5 x 1000 SFL winners`}</p>
        <p className="text-xs mb-2">{`- 2 Bud NFTs`}</p>
        <div className="flex justify-between items-center">
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="info"
            className="mb-2 mr-3 capitalize"
          >
            {monthName}
          </Label>
          {entries > 0 && (
            <Label icon={ITEM_DETAILS["Prize Ticket"].image} type="success">
              {entries} {t("raffle.entries")}
            </Label>
          )}
        </div>

        <div className="flex items-center">
          <Box image={ITEM_DETAILS["Prize Ticket"].image} count={tickets} />
          <div>
            {!tickets.gte(1) && (
              <Label type="danger">{t("raffle.noTicket")}</Label>
            )}
            <p className="text-xs mb-2">{t("raffle.how")}</p>
          </div>
        </div>
      </div>
      <Button onClick={enterRaffle} disabled={!tickets.gte(1)} className="mt-2">
        {t("raffle.enter")}
      </Button>
    </CloseButtonPanel>
  );
};
