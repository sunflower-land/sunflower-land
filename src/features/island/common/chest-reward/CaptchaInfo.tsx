import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { InventoryItemName } from "features/game/types/game";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import book from "src/assets/icons/tier3_book.webp";

export const CaptchaInfo: React.FC<{ collectedItem?: InventoryItemName }> = ({
  collectedItem,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const bumpkinLevel = getBumpkinLevel(state.bumpkin.experience ?? 0);
  const [showRewards, setShowRewards] = useState(false);

  const hasRequiedLevel = bumpkinLevel >= 60;
  const isVerified = isFaceVerified({ game: state }) || !!state.verified;
  const hasRequiedReputation = hasReputation({
    game: state,
    reputation:
      collectedItem === "Wood" ? Reputation.Cropkeeper : Reputation.Grower,
  });

  const requiredReputationName =
    collectedItem === "Wood"
      ? t("captcha.info.cropKeeperReputation")
      : t("captcha.info.growerReputation");

  return (
    <>
      <div className="absolute -top-9 right-0">
        <Button onClick={() => setShowRewards(true)}>
          <div className="flex justify-between text-xs -m-1 space-x-1">
            <img src={book} className="w-4" />
            <p>{t("captcha.info.title")}</p>
          </div>
        </Button>
      </div>

      <ModalOverlay
        show={showRewards}
        onBackdropClick={() => setShowRewards(false)}
      >
        {showRewards && (
          <CloseButtonPanel
            tabs={[
              {
                icon: book,
                name: t("captcha.info.title"),
              },
            ]}
            onClose={() => setShowRewards(false)}
          >
            <div className="p-2">
              <p className="text-xs mb-2">{t("captcha.info.description")}</p>
              <NoticeboardItems
                items={[
                  {
                    text: t("captcha.info.proofOfHumanity"),
                    icon: isVerified
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("captcha.info.requiredReputation", {
                      name: requiredReputationName,
                    }),
                    icon: hasRequiedReputation
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("captcha.info.requiredLevel"),
                    icon: hasRequiedLevel
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel,
                  },
                ]}
              />
            </div>
          </CloseButtonPanel>
        )}
      </ModalOverlay>
    </>
  );
};
