import React from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

/** Registration has moved off the in-game codes to the Yakkamon website. */
const YAKKAMON_URL = "https://yakkamon.com/";
const YAKKAMON_DOCS_URL = "https://docs.yakkamon.com/";

const openInNewTab = (url: string) => window.open(url, "_blank", "noopener");

interface Props {
  onClose: () => void;
}

export const Yakkamon: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel onClose={onClose} title={t("yakkamon.title")}>
      <div className="p-1">
        <p className="text-xs mb-2">{t("yakkamon.intro.landing")}</p>
        <NoticeboardItems
          items={[
            {
              text: t("yakkamon.intro.creators"),
              icon: SUNNYSIDE.icons.heart,
            },
            {
              text: t("yakkamon.intro.collect"),
              icon: SUNNYSIDE.icons.sword,
            },
            {
              text: t("yakkamon.intro.registration"),
              icon: SUNNYSIDE.icons.expression_alerted,
            },
          ]}
        />
      </div>
      <div className="flex gap-1">
        <Button onClick={() => openInNewTab(YAKKAMON_DOCS_URL)}>
          {t("yakkamon.learnMore")}
        </Button>
        <Button onClick={() => openInNewTab(YAKKAMON_URL)}>
          {t("yakkamon.visitWebsite")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
