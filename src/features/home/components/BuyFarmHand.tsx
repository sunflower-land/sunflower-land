import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { BB_TO_GEM_RATIO, GameState } from "features/game/types/game";
import { ISLAND_BUMPKIN_CAPACITY } from "features/game/events/landExpansion/buyFarmHand";
import { Panel } from "components/ui/Panel";
import confetti from "canvas-confetti";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
  gameState: GameState;
}

export const BuyFarmHand: React.FC<Props> = ({ onClose, gameState }) => {
  const { t } = useAppTranslation();
  const { gameService, showAnimations } = useContext(Context);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasCoupon = !!gameState.inventory["Farmhand Coupon"]?.gte(1);

  const capacity = ISLAND_BUMPKIN_CAPACITY[gameState.island.type];
  const farmHands = Object.keys(gameState.farmHands.bumpkins).length;
  const hasSpace = farmHands + 1 < capacity;
  const cost = (farmHands + 2) * 5 * BB_TO_GEM_RATIO;

  const hasGems = !!gameState.inventory["Gem"]?.gte(cost);

  const onAdd = () => {
    gameService.send({ type: "farmHand.bought" });
    gameService.send({ type: "SAVE" });
    setShowSuccess(true);
    if (showAnimations) confetti();

    if (!hasCoupon) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: cost,
        item: "Farmhand",
        type: "Collectible",
      });
    }
  };

  if (showSuccess) {
    const latestFarmHand = Object.keys(gameState.farmHands.bumpkins).pop();
    const parts =
      gameState.farmHands.bumpkins[latestFarmHand as string].equipped;

    return (
      <Panel bumpkinParts={parts}>
        <div className="p-2 flex flex-col items-center">
          <p className="text-sm mb-2 text-center">
            {t("buyFarmHand.howdyBumpkin")}
          </p>
          <p className="text-xs mb-2 text-center">
            {`${t("buyFarmHand.newFarmhandGreeting")}`}
          </p>
          <div className="h-16 w-16 mb-4">
            <NPCIcon parts={parts} />
          </div>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </Panel>
    );
  }

  if (showConfirmation) {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm">{t("buyFarmHand.confirmBuyAdditional")}</p>
          {!hasCoupon && (
            <div className="flex items-center my-2">
              <img src={ITEM_DETAILS["Gem"].image} className="h-4 mr-2" />
              <p className="text-xs">{`${cost} Gems`}</p>
            </div>
          )}

          {hasCoupon && (
            <div className="flex items-center my-2">
              <img
                src={ITEM_DETAILS["Farmhand Coupon"].image}
                className="h-4 mr-2"
              />
              <p className="text-xs">{t("buyFarmHand.farmhandCoupon")}</p>
            </div>
          )}
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)}>{t("no")}</Button>
          <Button className="ml-1" onClick={onAdd}>
            {t("yes")}
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center  mb-2 ">
          <p className="text-sm mr-2">{t("buyFarmHand.adoptBumpkin")}</p>
          <img src={SUNNYSIDE.icons.heart} className="h-6" />
        </div>
        <p className="text-xs mb-2">
          {t("buyFarmHand.additionalBumpkinsInfo")}
        </p>
        <img
          src={SUNNYSIDE.tutorial.farmHandImage}
          className="w-full rounded-md"
        />
        {!hasCoupon && (
          <div className="flex items-center my-2">
            <img src={ITEM_DETAILS["Gem"].image} className="h-4 mr-2" />
            <p className="text-xs">{`${cost} Gems`}</p>
          </div>
        )}

        {hasCoupon && (
          <div className="flex items-center my-2">
            <img
              src={ITEM_DETAILS["Farmhand Coupon"].image}
              className="h-4 mr-2"
            />
            <p className="text-xs">{t("buyFarmHand.farmhandCoupon")}</p>
          </div>
        )}
        {!hasSpace && (
          <Label icon={SUNNYSIDE.icons.lock} type="danger" className="mt-2">
            {t("buyFarmHand.notEnoughSpace")}
          </Label>
        )}
      </div>
      <Button
        disabled={!hasSpace || (!hasGems && !hasCoupon)}
        onClick={() => setShowConfirmation(true)}
      >
        {t("buyFarmHand.buyBumpkin")}
      </Button>
    </CloseButtonPanel>
  );
};
