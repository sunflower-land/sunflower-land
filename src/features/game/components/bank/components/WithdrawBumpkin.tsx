import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Equipped, ITEM_IDS } from "features/game/types/bumpkin";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";

import wallet from "assets/icons/wallet.png";
import { BUMPKIN_WITHDRAWABLES } from "features/game/types/withdrawables";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { Box } from "components/ui/Box";
import { getKeys } from "features/game/types/craftables";
import { BASIC_WEARABLES } from "features/game/types/stylist";
import { isCurrentObsession } from "./WithdrawWearables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { formatDateTime } from "lib/utils/time";

const WITHDRAWAL_CLOSE_DATE = new Date("2024-05-01T00:00:00Z");
interface Props {
  onWithdraw: () => void;
}
export const WithdrawBumpkin: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const isClosed = new Date() > WITHDRAWAL_CLOSE_DATE;

  const bumpkin = gameState.context.state.bumpkin!;
  const { equipped } = bumpkin;
  const basicWearables = getKeys(BASIC_WEARABLES);

  const nonWithdrawableItems = Object.values(equipped).filter((item) => {
    const isWithdrawable = BUMPKIN_WITHDRAWABLES[item](gameState.context.state);
    const isBasicWearables = basicWearables.includes(item);
    const isObsession = isCurrentObsession(item, gameState.context.state);

    return (!isWithdrawable && !isBasicWearables) || isObsession;
  });
  const { t } = useAppTranslation();
  const getText = () => {
    if (nonWithdrawableItems.length > 0)
      return (
        <div className="text-sm space-y-2">
          <p>{t("withdraw.bumpkin.wearing")}</p>
          <div className="flex items-center flex-wrap">
            {nonWithdrawableItems.map((itemName) => (
              <Box
                key={itemName}
                onClick={undefined}
                disabled
                image={getImageUrl(ITEM_IDS[itemName])}
              />
            ))}
          </div>
        </div>
      );

    return (
      <p className="text-sm mb-2">{t("withdraw.bumpkin.sure.withdraw")}</p>
    );
  };

  if (isClosed) {
    return (
      <div className="p-2">
        <div className="flex flex-col border-2 rounded-md border-black p-2 bg-red-background mb-3 text-xs">
          <span>{t("withdraw.bumpkin.closed")}</span>
          <a
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.sunflower-land.com/player-guides/island-upgrade#bumpkin-migration"
          >
            {t("read.more")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col border-2 rounded-md border-black p-2 bg-red-background mb-3 text-xs">
          <span>
            {t("withdraw.bumpkin.closing", {
              timeRemaining: formatDateTime(
                WITHDRAWAL_CLOSE_DATE.toISOString()
              ),
            })}
          </span>
          <a
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.sunflower-land.com/player-guides/island-upgrade#bumpkin-migration"
          >
            {t("read.more")}
          </a>
        </div>
        {getText()}
        <div className="flex justify-center items-center mb-4">
          <div className="h-10 w-10 relative bottom-[22px] mr-2">
            <NPC
              parts={gameState.context.state.bumpkin?.equipped as Equipped}
            />
          </div>
          <img src={SUNNYSIDE.icons.arrow_right} className="h-10 mr-2" />
          <img src={wallet} className="h-10" />
        </div>
      </div>
      <Button disabled={nonWithdrawableItems.length > 0} onClick={onWithdraw}>
        {t("withdraw")}
      </Button>
    </>
  );
};
