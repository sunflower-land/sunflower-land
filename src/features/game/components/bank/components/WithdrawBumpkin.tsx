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

interface Props {
  onWithdraw: () => void;
}
export const WithdrawBumpkin: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

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

  return (
    <>
      <div className="p-2">
        <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
          <span className="text-xs">{t("withdraw.bumpkin.play")}</span>
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
