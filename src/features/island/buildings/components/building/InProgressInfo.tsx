import { Box } from "components/ui/Box";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CookableName, COOKABLES } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import { BuildingProduct, GameState } from "features/game/types/game";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import fastForward from "assets/icons/fast_forward.png";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { getFishProcessingTime } from "features/game/events/landExpansion/processResource";
import { ProcessedResource } from "features/game/types/processedFood";

interface Props {
  product: BuildingProduct;
  onClose: () => void;
  isOilBoosted?: boolean;
  onInstantReady: (cost: number, paymentMethod?: "gems" | "coins") => void;
  state: GameState;
}

export const InProgressInfo: React.FC<Props> = ({
  product,
  isOilBoosted,
  onInstantReady,
  state,
}) => {
  const { t } = useAppTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const { totalSeconds: secondsTillReady } = useCountdown(product.readyAt ?? 0);

  const isCookableName = (name: string | undefined): name is CookableName =>
    !!name && name in COOKABLES;

  const getProductTotalSeconds = () => {
    if (isCookableName(product.name)) {
      return COOKABLES[product.name].cookingSeconds;
    }

    const { reducedMs } = getFishProcessingTime(
      product.name as ProcessedResource,
      state,
    );
    return reducedMs / 1000;
  };

  const totalSeconds = getProductTotalSeconds();

  const payment = useSpeedUpPayment({
    readyAt: product.readyAt,
    game: state,
  });
  const cost =
    payment.paymentMethod === "coins" ? payment.coinCost : payment.gemCost;
  const costIcon =
    payment.paymentMethod === "coins"
      ? SUNNYSIDE.ui.coins
      : ITEM_DETAILS["Gem"].image;
  const confirmationCostMessage =
    payment.paymentMethod === "coins"
      ? t("instantCook.coinCostMessage", { coins: cost })
      : t("instantCook.costMessage", { gems: cost });

  return (
    <div className="flex flex-col mb-2 w-full">
      <Label
        className="mr-3 ml-2 mb-1"
        icon={SUNNYSIDE.icons.stopwatch}
        type="default"
      >
        {t("in.progress")}
      </Label>
      <div className="flex items-center justify-between">
        <Box
          image={ITEM_DETAILS[product.name].image}
          // alternateIcon={isOilBoosted ? ITEM_DETAILS["Oil"].image : null}
          secondaryImage={isOilBoosted ? ITEM_DETAILS["Oil"].image : null}
        />
        <div
          className="relative flex flex-col w-full"
          style={{
            marginTop: `${PIXEL_SCALE * 3}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
          id="progress-bar"
        >
          <span className="text-xs mb-1">
            {secondsToString(secondsTillReady, { length: "medium" })}
          </span>
          <ResizableBar
            percentage={(1 - secondsTillReady / totalSeconds) * 100}
            type="progress"
          />
        </div>

        <Button
          disabled={!payment.canAfford}
          className="w-36 sm:w-44 px-3 h-12 mr-[6px]"
          onClick={() => setShowConfirmation(true)}
        >
          <div className="flex items-center justify-center gap-1 mx-2">
            <img src={fastForward} className="h-5" />
            {!payment.canPayWithCoins && (
              <>
                <span className="text-sm flex items-center">{cost}</span>
                <img src={costIcon} className="h-5" />
              </>
            )}
          </div>
        </Button>

        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            onInstantReady(cost, payment.paymentMethod);
            setShowConfirmation(false);
          }}
          messages={[
            t("instantCook.confirmationMessage"),
            confirmationCostMessage,
          ]}
          confirmButtonLabel={t("instantCook.finish")}
          bodyContent={<SpeedUpPaymentSelector payment={payment} />}
        />
      </div>
    </div>
  );
};
