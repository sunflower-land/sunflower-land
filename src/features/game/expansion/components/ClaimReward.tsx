import { Button } from "components/ui/Button";
import React, { useContext, useEffect } from "react";
import confetti from "canvas-confetti";

import token from "assets/icons/flower_token.webp";
import coins from "assets/icons/coins.webp";
import powerup from "assets/icons/level_up.png";
import factionPoint from "assets/icons/faction_point.webp";
import vip from "assets/icons/vip.webp";
import xpIcon from "assets/icons/xp.png";
import recipeIcon from "assets/decorations/page.png";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  Airdrop as IAirdrop,
  InventoryItemName,
} from "features/game/types/game";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { CONSUMABLES, ConsumableName } from "features/game/types/consumables";
import { formatNumber } from "lib/utils/formatNumber";
import { Context, useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getFoodExpBoost } from "../lib/boosts";
import { MachineState } from "features/game/lib/gameMachine";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ButtonPanel } from "components/ui/Panel";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { RECIPES } from "features/game/lib/crafting";
import blueLightning from "assets/icons/blue_lightning.png";
import { useNow } from "lib/utils/hooks/useNow";

const _game = (state: MachineState) => state.context.state;

interface ClaimRewardProps {
  reward: Omit<IAirdrop, "createdAt"> & { createdAt?: number };
  onClaim?: () => void;
  onClose?: () => void;
  label?: string;
}

export const ClaimReward: React.FC<ClaimRewardProps> = ({
  reward: airdrop,
  onClaim,
  onClose,
  label,
}) => {
  const { t } = useAppTranslation();
  const { showAnimations } = useContext(Context);

  useEffect(() => {
    if (showAnimations) confetti();
  }, [showAnimations]);

  return (
    <>
      <div className="p-0.5">
        <Label
          className="ml-1.5 mb-2 mt-1"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          {label ?? t("reward.discovered")}
        </Label>
        {airdrop.message && (
          <div className="mb-2 ml-1 text-xxs sm:text-xs">
            <InlineDialogue message={airdrop.message} />
          </div>
        )}
        <Rewards reward={airdrop} />
      </div>

      <div className="flex items-center mt-1">
        {onClose && <Button onClick={onClose}>{t("close")}</Button>}
        {onClaim && (
          <Button onClick={onClaim} className="ml-0.5">
            {t("claim")}
          </Button>
        )}
      </div>
    </>
  );
};

export const Rewards: React.FC<{
  reward: Pick<
    IAirdrop,
    | "sfl"
    | "factionPoints"
    | "vipDays"
    | "coins"
    | "xp"
    | "buff"
    | "items"
    | "wearables"
    | "recipes"
  >;
}> = ({ reward }) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const game = gameState.context.state;
  const itemNames = getKeys(reward.items);
  const now = useNow({
    live: getKeys(CONSUMABLES).some((name) => (reward.items[name] ?? 0) > 0),
  });

  return (
    <div className="flex flex-col space-y-0.5">
      {!!reward.sfl && (
        <ButtonPanel
          variant="card"
          className="flex items-start cursor-context-menu hover:brightness-100"
        >
          <Box image={token} className="-mt-2 -ml-1 -mb-1" />
          <div>
            <Label type="warning">
              {`${formatNumber(reward.sfl, { decimalPlaces: 4 })} FLOWER`}
            </Label>
            <p className="text-xs mt-1 ml-0.5">{t("reward.spendWisely")}</p>
          </div>
        </ButtonPanel>
      )}
      {!!reward.factionPoints && (
        <div className="flex items-center">
          <Box image={factionPoint} />
          <div>
            <Label type="warning">
              {`${formatNumber(reward.factionPoints)} Faction Points`}
            </Label>
            <p className="text-xs mt-0.5">{t("reward.factionPoints")}</p>
          </div>
        </div>
      )}
      {!!reward.vipDays && (
        <ButtonPanel
          variant="card"
          className="flex items-start cursor-context-menu hover:brightness-100"
        >
          <Box image={vip} className="-mt-2 -ml-1 -mb-1" />

          <div>
            <Label type="warning">
              {`${formatNumber(reward.vipDays)} VIP Days`}
            </Label>
            <p className="text-xs mt-0.5">{t("reward.vipDescription")}</p>
          </div>
        </ButtonPanel>
      )}
      {!!reward.coins && (
        <ButtonPanel
          variant="card"
          className="flex items-start cursor-context-menu hover:brightness-100"
        >
          <Box image={coins} className="-mt-2 -ml-1 -mb-1" />
          <div>
            <Label type="warning">
              {`${formatNumber(reward.coins)} ${reward.coins === 1 ? "Coin" : "Coins"}`}
            </Label>
            <p className="text-xs ml-0.5 mt-1">{t("reward.spendWisely")}</p>
          </div>
        </ButtonPanel>
      )}

      {!!reward.xp && (
        <ButtonPanel
          variant="card"
          className="flex items-start cursor-context-menu hover:brightness-100"
        >
          <Box image={xpIcon} className="-mt-2 -ml-1 -mb-1" />
          <div>
            <Label type="warning">{`${formatNumber(reward.xp)} XP`}</Label>
            <p className="text-xs ml-0.5 mt-1">{t("reward.xp")}</p>
          </div>
        </ButtonPanel>
      )}

      {!!reward.buff && (
        <ButtonPanel
          variant="card"
          className="flex items-start cursor-context-menu hover:brightness-100"
        >
          <Box image={blueLightning} className="-mt-2 -ml-1 -mb-1" />
          <div>
            <Label type="info">{`${reward.buff} buff`}</Label>
            <p className="text-xs ml-0.5 mt-1">{t("reward.powerHour")}</p>
          </div>
        </ButtonPanel>
      )}

      {itemNames.length > 0 &&
        itemNames.map((name) => {
          const buff = COLLECTIBLE_BUFF_LABELS[name]?.({
            skills: game.bumpkin.skills,
            collectibles: game.collectibles,
          });
          return (
            <ButtonPanel
              className="flex items-start cursor-context-menu hover:brightness-100"
              key={name}
            >
              <Box
                image={ITEM_DETAILS[name].image}
                className="-mt-2 -ml-1 -mb-1"
              />
              <div>
                <div className="flex flex-wrap items-start">
                  <Label type="default" className="mr-1 mb-1">
                    {`${formatNumber(reward.items[name] ?? 1)} x ${name}`}
                  </Label>
                  {name in CONSUMABLES && (
                    <Label
                      type="success"
                      icon={powerup}
                      className="ml-1 mb-1"
                    >{`+${formatNumber(
                      getFoodExpBoost({
                        food: CONSUMABLES[name as ConsumableName],
                        game,
                        createdAt: now,
                      }).boostedExp,
                      { decimalPlaces: 0 },
                    )} XP`}</Label>
                  )}
                </div>
                {buff ? (
                  <div className="flex flex-col gap-1">
                    {buff.map(
                      (
                        {
                          labelType,
                          boostTypeIcon,
                          boostedItemIcon,
                          shortDescription,
                        },
                        index,
                      ) => (
                        <Label
                          key={index}
                          type={labelType}
                          icon={boostTypeIcon}
                          secondaryIcon={boostedItemIcon}
                        >
                          {shortDescription}
                        </Label>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-xs ml-0.5">
                    {ITEM_DETAILS[name]?.description
                      ? ITEM_DETAILS[name].description
                      : t("reward.collectible")}
                  </p>
                )}
              </div>
            </ButtonPanel>
          );
        })}

      {getKeys(reward.wearables ?? {}).length > 0 &&
        getKeys(reward.wearables).map((name) => {
          const buff = BUMPKIN_ITEM_BUFF_LABELS[name as BumpkinItem];
          return (
            <ButtonPanel
              variant="card"
              className="flex items-start cursor-context-menu hover:brightness-100"
              key={name}
            >
              <Box
                image={getImageUrl(ITEM_IDS[name])}
                className="-mt-2 -ml-1 -mb-1"
              />
              <div>
                <Label
                  type="default"
                  className="mb-1"
                >{`${formatNumber(reward.wearables[name] ?? 1)} x ${name}`}</Label>
                {buff ? (
                  <div className="flex flex-row flex-wrap items-center">
                    {buff.map(
                      (
                        {
                          labelType,
                          boostTypeIcon,
                          boostedItemIcon,
                          shortDescription,
                        },
                        index,
                      ) => (
                        <Label
                          key={index}
                          type={labelType}
                          icon={boostTypeIcon}
                          secondaryIcon={boostedItemIcon}
                          className="ml-1"
                        >
                          {shortDescription}
                        </Label>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-xs ml-0.5">
                    {OPEN_SEA_WEARABLES[name as BumpkinItem]?.description ||
                    OPEN_SEA_WEARABLES[name as BumpkinItem]?.description !== ""
                      ? OPEN_SEA_WEARABLES[name as BumpkinItem].description
                      : t("reward.wearable")}
                  </p>
                )}
              </div>
            </ButtonPanel>
          );
        })}

      {!!reward.recipes &&
        reward.recipes.map((recipe) => {
          return (
            <ButtonPanel
              key={recipe}
              variant="card"
              className="flex items-start cursor-context-menu hover:brightness-100"
            >
              <Box image={recipeIcon} className="-mt-2 -ml-1 -mb-1" />
              <div>
                <div className="flex flex-wrap items-center">
                  <Label type="default" className="mb-1 mr-2">
                    {t("crafting.recipe", {
                      recipe: RECIPES[recipe].name,
                    })}
                  </Label>
                  {!game.inventory["Crafting Box"] && (
                    <Label type="danger" className="mb-1">
                      {t("crafting.noBox")}
                    </Label>
                  )}
                </div>
                <p className="text-xs ml-0.5 ">
                  {ITEM_DETAILS[recipe as InventoryItemName]?.description}
                </p>
              </div>
            </ButtonPanel>
          );
        })}
    </div>
  );
};
