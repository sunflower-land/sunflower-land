import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { StateValues } from "features/game/lib/gameMachine";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { BulkRemoveSuccess } from "./BulkRemoveSuccess";
import { StartingFaceRecognitionSuccess } from "./StartingFaceRecognitionSuccess";
import { CompletingFaceRecognitionSuccess } from "./CompletingFaceRecognitionSuccess";
import { TwitterFollowedSuccess } from "./TwitterFollowedSuccess";
import { TwitterPostedSuccess } from "./TwitterPostedSuccess";

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

  return (
    <>
      <div className="p-1.5">
        <Label type="success" className="mb-2">
          {t("success")}
        </Label>
        <p className="text-sm mb-2">{t(effectTranslationKey)}</p>
      </div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
