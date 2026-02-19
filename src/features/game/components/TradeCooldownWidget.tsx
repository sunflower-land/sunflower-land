import React, { useState } from "react";
import { ColorPanel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import lockIcon from "assets/icons/lock.png";

type Props = {
  restrictionSecondsLeft: number;
};

export const TradeCooldownWidget: React.FC<Props> = ({
  restrictionSecondsLeft,
}) => {
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);

  const timeLeftShort =
    restrictionSecondsLeft > 0
      ? secondsToString(restrictionSecondsLeft, { length: "short" })
      : null;
  return (
    <>
      <ColorPanel
        type="danger"
        className="flex p-2 mb-2 mt-1 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img
          src={lockIcon}
          className="w-5 object-contain mr-2 flex-shrink-0"
          alt=""
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-xs font-medium">
            {t("tradeCooldown.title")}
          </span>
          {timeLeftShort != null && (
            <span className="text-xxs underline">
              {t("accountRecentlyTraded.timeLeft", { time: timeLeftShort })}
            </span>
          )}
        </div>
      </ColorPanel>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <img src={lockIcon} className="w-6 h-6 object-contain" alt="" />
              <h2 className="text-sm font-medium">
                {t("tradeCooldown.title")}
              </h2>
            </div>
            <p className="text-xs mb-2">
              {t("accountRecentlyTraded.description")}
            </p>
            {timeLeftShort != null && (
              <p className="text-xs mt-1">
                <span className="underline">
                  {t("accountRecentlyTraded.timeLeft", { time: timeLeftShort })}
                </span>
              </p>
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
