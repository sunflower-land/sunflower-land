import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";

export const CompletingFaceRecognitionSuccess: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-1.5">
        <Label type="default" className="mb-2">
          {t("completing.face.recognition.label")}
        </Label>
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
