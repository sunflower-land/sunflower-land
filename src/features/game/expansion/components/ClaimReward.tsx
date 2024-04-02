import { Button } from "components/ui/Button";
import React, { useContext, useEffect } from "react";
import confetti from "canvas-confetti";

import token from "src/assets/icons/sfl.webp";
import coins from "src/assets/icons/coins.webp";
import powerup from "assets/icons/level_up.png";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Airdrop as IAirdrop } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { CONSUMABLES, ConsumableName } from "features/game/types/consumables";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { InlineDialogue } from "features/world/ui/TypingMessage";

interface ClaimRewardProps {
  reward: IAirdrop;
  onClaim?: () => void;
  onClose?: () => void;
}

export const ClaimReward: React.FC<ClaimRewardProps> = ({
  reward: airdrop,
  onClaim,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const itemNames = getKeys(airdrop.items);

  const { showAnimations } = useContext(Context);

  useEffect(() => {
    if (showAnimations) confetti();
  }, []);

  return (
    <>
      <div className="p-1">
        <Label
          className="ml-2 mb-2 mt-1"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          {t("reward.discovered")}
        </Label>
        {airdrop.message && (
          <div className="mb-2 ml-1">
            <InlineDialogue message={airdrop.message} />
          </div>
        )}
        <div className="flex flex-col">
          {!!airdrop.sfl && (
            <div className="flex items-center">
              <Box image={token} />
              <div>
                <Label type="warning">
                  {setPrecision(new Decimal(airdrop.sfl)).toString()} {"SFL"}
                </Label>
                <p className="text-xs">{t("reward.spendWisely")}</p>
              </div>
            </div>
          )}
          {!!airdrop.coins && (
            <div className="flex items-center">
              <Box image={coins} />
              <div>
                <Label type="warning">
                  {airdrop.coins} {airdrop.coins === 1 ? "Coin" : "Coins"}
                </Label>
                <p className="text-xs">{t("reward.spendWisely")}</p>
              </div>
            </div>
          )}

          {itemNames.length > 0 &&
            itemNames.map((name) => {
              const buff = COLLECTIBLE_BUFF_LABELS[name];
              return (
                <div className="flex items-start" key={name}>
                  <Box image={ITEM_DETAILS[name].image} className="-mt-2" />
                  <div>
                    <div className="flex items-center">
                      <Label type="default" className="mr-2">
                        {`${setPrecision(
                          new Decimal(airdrop.items[name] ?? 1)
                        ).toString()} x ${name}`}
                      </Label>
                      {name in CONSUMABLES && (
                        <Label
                          type="success"
                          icon={powerup}
                          className="mr-2"
                        >{`+${setPrecision(
                          new Decimal(
                            CONSUMABLES[name as ConsumableName].experience
                          )
                        ).toString()} EXP`}</Label>
                      )}
                    </div>
                    <p className="text-xs">{ITEM_DETAILS[name].description}</p>
                    {buff && (
                      <Label
                        type={buff.labelType}
                        icon={buff.boostTypeIcon}
                        secondaryIcon={buff.boostedItemIcon}
                        className="my-1"
                      >
                        {buff.shortDescription}
                      </Label>
                    )}
                  </div>
                </div>
              );
            })}

          {getKeys(airdrop.wearables ?? {}).length > 0 &&
            getKeys(airdrop.wearables).map((name) => (
              <div className="flex items-center mb-2" key={name}>
                <Box image={getImageUrl(ITEM_IDS[name])} />
                <div>
                  <Label type="default">{`${setPrecision(
                    new Decimal(airdrop.wearables[name] ?? 1)
                  ).toString()} x ${name}`}</Label>
                  <p className="text-xs">{t("reward.wearable")}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center mt-1">
        {onClose && <Button onClick={onClose}>{t("close")}</Button>}
        {onClaim && (
          <Button onClick={onClaim} className="ml-1">
            {t("claim")}
          </Button>
        )}
      </div>
    </>
  );
};
