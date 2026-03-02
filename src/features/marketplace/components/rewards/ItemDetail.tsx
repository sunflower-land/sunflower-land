import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import confetti from "canvas-confetti";
import classNames from "classnames";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { Panel } from "components/ui/Panel";
import {
  TRADE_REWARDS,
  TradeRewardPacks,
  TradeRewardsItem,
} from "features/game/events/landExpansion/redeemTradeReward";
import { Context } from "features/game/GameProvider";
import { INVENTORY_LIMIT, PIXEL_SCALE } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useLayoutEffect, useState } from "react";
import { isSeed } from "features/game/types/seeds";

import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  onClose: () => void;
  itemName: TradeRewardsItem | TradeRewardPacks;
}
export const ItemDetail: React.FC<Props> = ({ onClose, itemName }) => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [confirmBuy, setConfirmBuy] = useState(false);
  const state = useSelector(gameService, (state) => state.context.state);
  const { ingredients, items, image, description } = TRADE_REWARDS[itemName];
  const now = useNow({ live: true });

  useLayoutEffect(() => {
    const imgElement = new Image();

    imgElement.onload = function () {
      const trueWidth = imgElement.width;
      const scaledWidth = trueWidth * PIXEL_SCALE;

      setImageWidth(scaledWidth);
    };

    imgElement.src = image;
  }, [image]);

  const { inventory } = state;

  const canBuy = () =>
    inventory["Trade Point"]?.gte(ingredients["Trade Point"]) &&
    !hasHitInventoryLimit;

  const getButtonLabel = () => {
    if (confirmBuy) return `${t("confirm")} ${t("buy")}`;

    return `${t("buy")}`;
  };

  const buttonHandler = () => {
    if (!confirmBuy) {
      setConfirmBuy(true);
      return;
    }

    handleBuy();
  };

  const handleBuy = () => {
    gameService.send({ type: "reward.redeemed", item: itemName });

    if (showAnimations) confetti();
    setShowSuccess(true);
    setConfirmBuy(false);
  };

  const hasHitInventoryLimit =
    itemName === "Seed Pack" &&
    getKeys(items).some((item) => {
      const inventoryAmount = state.inventory[item] ?? new Decimal(0);
      const inventoryLimit = isSeed(item)
        ? INVENTORY_LIMIT(state)[item]
        : undefined;

      return !!inventoryLimit && inventoryAmount.gte(inventoryLimit);
    });

  return (
    <Panel>
      <div className="flex items-center w-full">
        <div style={{ width: `${PIXEL_SCALE * 9}px` }} />
        <span className="flex-1 text-center">{itemName}</span>
        <img
          src={SUNNYSIDE.icons.close}
          className="cursor-pointer"
          onClick={onClose}
          style={{
            width: `${PIXEL_SCALE * 9}px`,
          }}
        />
      </div>
      {!showSuccess && (
        <>
          <div className="w-full p-2 px-1">
            <div className="flex">
              <div
                className="w-[50%] relative min-w-[40%] rounded-md overflow-hidden shadow-md mr-2 flex justify-center items-center h-32"
                style={{
                  backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <img
                  src={image}
                  alt={itemName}
                  className={"w-full"}
                  style={{
                    width: `${imageWidth}px`,
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-xs leading-none">{description}</span>
                {hasHitInventoryLimit && (
                  <Label type="danger">
                    <span className="text-xxs">
                      {t("marketplace.reward.seedLimit")}
                    </span>
                  </Label>
                )}
                {itemName === "Trade Cake" && (
                  <div className="flex flex-1 items-end">
                    <RequirementLabel
                      type="xp"
                      xp={
                        getFoodExpBoost({
                          food: CONSUMABLES["Trade Cake" as ConsumableName],
                          game: state,
                          createdAt: now,
                        }).boostedExp
                      }
                    />
                  </div>
                )}
                <div className="flex flex-1 items-end">
                  <RequirementLabel
                    type="item"
                    item={"Trade Point"}
                    showLabel
                    balance={inventory["Trade Point"] ?? new Decimal(0)}
                    requirement={new Decimal(ingredients["Trade Point"])}
                  />
                </div>
              </div>
            </div>
            {getKeys(items).length > 1 && (
              <>
                <Label type="default" className="my-2">
                  {t("marketplace.reward.contains")}
                </Label>
                <div className="flex flex-row flex-wrap max-h-40 scrollable overflow-y-auto">
                  {getKeys(items).map((item, index) => {
                    if (items[item] === 0) return;
                    return (
                      <Box
                        key={index}
                        image={ITEM_DETAILS[item].image}
                        count={new Decimal(items[item] ?? 0)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div
            className={classNames("flex w-full", {
              "space-x-1": confirmBuy,
            })}
          >
            {confirmBuy && (
              <Button
                className="capitalize"
                onClick={() => setConfirmBuy(false)}
              >
                {t("cancel")}
              </Button>
            )}

            <Button
              disabled={!canBuy()}
              onClick={buttonHandler}
              className="capitalize"
            >
              {getButtonLabel()}
            </Button>
          </div>
        </>
      )}
      {showSuccess && (
        <div className="flex flex-col items-center space-y-1">
          <img
            src={SUNNYSIDE.icons.confirm}
            alt="Success"
            className="mt-1.5 w-8"
          />
          <span className="p-2 text-xs">{`Redemption complete! Enjoy your ${itemName}!`}</span>
          <Button className="capitalize" onClick={onClose}>
            {t("ok")}
          </Button>
        </div>
      )}
    </Panel>
  );
};
