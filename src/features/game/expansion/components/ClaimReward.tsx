import { Button } from "components/ui/Button";
import React from "react";

import token from "src/assets/icons/token_2.png";
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
  const itemNames = getKeys(airdrop.items);

  return (
    <>
      <div className="p-1">
        <Label
          className="ml-2 mb-2 mt-1"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          Reward Discovered
        </Label>
        {airdrop.message && (
          <p className="text-xs mb-2 ml-1">{airdrop.message}</p>
        )}
        <div className="flex flex-col">
          {!!airdrop.sfl && (
            <div className="flex items-center">
              <Box image={token} />
              <div>
                <Label type="warning">
                  {setPrecision(new Decimal(airdrop.sfl)).toString()} SFL
                </Label>
                <p className="text-xs">Spend it wisely.</p>
              </div>
            </div>
          )}

          {itemNames.length > 0 &&
            itemNames.map((name) => (
              <div className="flex items-center" key={name}>
                <Box image={ITEM_DETAILS[name].image} />
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
                </div>
              </div>
            ))}

          {getKeys(airdrop.wearables ?? {}).length > 0 &&
            getKeys(airdrop.wearables).map((name) => (
              <div className="flex items-center mb-2" key={name}>
                <Box image={getImageUrl(ITEM_IDS[name])} />
                <div>
                  <Label type="default">{`${setPrecision(
                    new Decimal(airdrop.wearables[name] ?? 1)
                  ).toString()} x ${name}`}</Label>
                  <p className="text-xs">A wearable for your Bumpkin</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center mt-1">
        {onClose && <Button onClick={onClose}>Close</Button>}
        {onClaim && (
          <Button onClick={onClaim} className="ml-1">
            Claim
          </Button>
        )}
      </div>
    </>
  );
};
