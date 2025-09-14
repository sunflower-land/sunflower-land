import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { InventoryItemName } from "features/game/types/game";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { AnimatedPanel } from "features/world/ui/AnimatedPanel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import book from "src/assets/icons/tier3_book.webp";
import infoIcon from "assets/icons/info.webp";
import bank from "assets/icons/withdraw.png";

export const CaptchaInfo: React.FC<{ collectedItem?: InventoryItemName }> = ({
  collectedItem,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const bumpkinLevel = getBumpkinLevel(state.bumpkin.experience ?? 0);
  const [showRewards, setShowRewards] = useState(false);
  const requiredReputation =
    collectedItem === "Wood" ? Reputation.Cropkeeper : Reputation.Grower;

  const hasRequiedLevel = bumpkinLevel >= 60;
  const isVerified = isFaceVerified({ game: state }) || !!state.verified;
  const hasRequiedReputation = hasReputation({
    game: state,
    reputation: requiredReputation,
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
                    text: t("captcha.info.requiredLevel"),
                    icon: hasRequiedLevel
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: <VerifyContent isVerified={isVerified} />,
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
                ]}
              />
            </div>
            {!hasRequiedReputation && (
              <RequiredReputation reputation={requiredReputation} />
            )}
          </CloseButtonPanel>
        )}
      </ModalOverlay>
    </>
  );
};

const VerifyContent: React.FC<{ isVerified: boolean }> = ({ isVerified }) => {
  const { t } = useAppTranslation();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <span
      onClick={() => setShowInfo(!showInfo)}
      className={classNames("flex items-center", {
        "cursor-pointer": !isVerified,
      })}
    >
      {t("captcha.info.proofOfHumanity")}
      {!isVerified && (
        <div className="relative">
          <img src={infoIcon} className="w-5 ml-1" />
          <AnimatedPanel
            show={showInfo}
            onClick={() => setShowInfo(!showInfo)}
            className="top-5 right-2 w-52"
          >
            <div className="flex flex-row items-center text-xxs p-0.5">
              <img src={bank} className="w-6 mr-1" />
              <p className="mt-0.5">
                {t("captcha.info.proofOfHumanity.popOver")}
              </p>
            </div>
          </AnimatedPanel>
        </div>
      )}
    </span>
  );
};
