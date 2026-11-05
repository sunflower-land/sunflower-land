import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ReferralContent } from "features/island/hud/components/referral/Referral";
import { Context } from "features/game/GameProvider";
import { acknowledgeReferralsAnnouncement } from "features/announcements/announcementsStorage";
import promoteIcon from "assets/icons/promote.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * Notification modal that periodically nudges established players (level 20+)
 * to invite friends / family via the referral program.
 *
 * Shown at most once every 30 days (tracked in localStorage).
 *
 * Flow:
 *   intro page  ->  Continue  ->  standard Referral UI
 *   (close at any point acknowledges & dismisses for the next 30 days)
 */
export const ReferralsAnnouncement: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [step, setStep] = useState<"intro" | "referral">("intro");

  const close = () => {
    acknowledgeReferralsAnnouncement();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <Modal show onHide={close}>
      {step === "intro" ? (
        <CloseButtonPanel onClose={close}>
          <div className="p-2 flex flex-col gap-2">
            <Label type="default" icon={promoteIcon}>
              {t("gameOptions.account.referFriend")}
            </Label>
            <p className="text-xs p-1">
              {t("referral.announcement.description")}
            </p>
          </div>
          <Button onClick={() => setStep("referral")}>{t("continue")}</Button>
        </CloseButtonPanel>
      ) : (
        <ReferralContent onHide={close} />
      )}
    </Modal>
  );
};
