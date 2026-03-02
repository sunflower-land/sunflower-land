import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect } from "react";
import { StateValues } from "features/game/lib/gameMachine";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { BulkRemoveSuccess } from "./BulkRemoveSuccess";
import { StartingFaceRecognitionSuccess } from "./StartingFaceRecognitionSuccess";
import { CompletingFaceRecognitionSuccess } from "./CompletingFaceRecognitionSuccess";
import { TwitterFollowedSuccess } from "./TwitterFollowedSuccess";
import { TwitterPostedSuccess } from "./TwitterPostedSuccess";
import { Loading } from "features/auth/components";
import { BulkPurchaseSuccess } from "./BulkPurchaseSuccess";

const SuccessSkip: React.FC = () => {
  const { gameService } = useGame();
  useEffect(() => {
    // After 500ms, send a continue event
    setTimeout(() => {
      gameService.send({ type: "CONTINUE" });
    }, 500);
  }, []);

  return (
    <div className="p-1.5">
      <Loading />
    </div>
  );
};

export const EFFECT_SUCCESS_COMPONENTS: Partial<
  Record<StateValues, React.ReactNode>
> = {
  startingFaceRecognitionSuccess: <StartingFaceRecognitionSuccess />,
  completingFaceRecognitionSuccess: <CompletingFaceRecognitionSuccess />,
  followingTwitterSuccess: <TwitterFollowedSuccess />,
  postingTwitterSuccess: <TwitterPostedSuccess />,
  marketplaceBulkListingsCancellingSuccess: (
    <BulkRemoveSuccess
      type="listings"
      effect="marketplaceBulkListingsCancelling"
    />
  ),
  marketplaceBulkOffersCancellingSuccess: (
    <BulkRemoveSuccess type="offers" effect="marketplaceBulkOffersCancelling" />
  ),
  marketplaceBuyingBulkResourcesSuccess: <BulkPurchaseSuccess />,
  seekingBlessingSuccess: <SuccessSkip />,
  claimingAuctionRaffleSuccess: <SuccessSkip />,
};

function camelToDotCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1.$2").toLowerCase() as string;
}

export const EffectSuccess: React.FC<{ state: string }> = ({ state }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const effectTranslationKey = camelToDotCase(
    state as string,
  ) as TranslationKeys;

  let text = t(effectTranslationKey);

  if (text === effectTranslationKey) {
    text = t("effect.success.default");
  }

  return (
    <>
      <div className="p-1.5">
        <Label type="success" className="mb-2">
          {t("success")}
        </Label>
        <p className="text-sm mb-2">{text}</p>
      </div>
      <Button
        onClick={() => {
          gameService.send({ type: "CONTINUE" });
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
