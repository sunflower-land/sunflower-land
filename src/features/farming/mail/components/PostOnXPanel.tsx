import React, { useContext } from "react";

import { ColorPanel } from "components/ui/Panel";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";

import giftIcon from "assets/icons/gift.png";

interface Props {
  /** Closes the mailbox so the Twitter modal isn't stacked underneath it. */
  onClose: () => void;
}

/**
 * Vibrant promo panel shown beneath the mailbox modal on the Community tab.
 * A gift icon on the left, the CTA text on the right, and an underlined
 * "View more" link that opens the existing Twitter rewards flow.
 */
export const PostOnXPanel: React.FC<Props> = ({ onClose }) => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  const open = () => {
    onClose();
    openModal("TWITTER");
  };

  return (
    <ColorPanel
      type="vibrant"
      onClick={open}
      className="mt-2 flex items-center p-2 cursor-pointer hover:brightness-95"
    >
      <img
        src={giftIcon}
        className="mr-3 ml-1"
        style={{ width: `${PIXEL_SCALE * 11}px` }}
      />
      <div className="flex flex-col">
        <p className="text-xs">{t("community.feed.postOnX.cta")}</p>
        <span className="text-xxs underline">
          {t("community.feed.postOnX.viewMore")}
        </span>
      </div>
    </ColorPanel>
  );
};
