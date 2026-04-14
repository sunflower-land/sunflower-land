import { ColorPanel } from "components/ui/Panel";
import React, { useContext } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalContext } from "features/game/components/modal/ModalProvider";

export const SocialRewardsWidget = () => {
  const { t } = useAppTranslation();

  const { openModal } = useContext(ModalContext);

  return (
    <ColorPanel
      type="vibrant"
      className="flex p-1 hover:brightness-95 cursor-pointer"
      onClick={() => openModal("EARN")}
    >
      <img
        src={ITEM_DETAILS["Love Charm"].image}
        className="w-10 object-contain mr-2"
      />
      <div className="flex-1">
        <p className="text-xs">
          {t("chapterDashboard.socialRewardsDescription")}
        </p>
        <p className="text-xxs underline mb-0.5">{t("read.more")}</p>
      </div>
    </ColorPanel>
  );
};
