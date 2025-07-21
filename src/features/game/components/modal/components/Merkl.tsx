import React from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import flowerIcon from "assets/icons/flower_token.webp";
import giftIcon from "assets/icons/gift.png";
import { Panel } from "components/ui/Panel";

export const Merkl: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <div className="p-1">
        <div className="flex flex-row justify-between">
          <Label
            type="vibrant"
            className="mb-1"
            icon={SUNNYSIDE.icons.stopwatch}
          >
            {t("merkl.rewards")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="w-6 h-6 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <p className="text-xs mb-2">{t("merkl.description")}</p>
        <NoticeboardItems
          items={[
            {
              text: t("merkl.one"),
              icon: flowerIcon,
            },
            {
              text: t("merkl.two"),
              icon: SUNNYSIDE.icons.heart,
            },
            {
              text: t("merkl.three"),
              icon: giftIcon,
            },
          ]}
        />
        <p className="text-xxs mb-2">{t("merkl.disclaimer")}</p>
      </div>
      <Button
        onClick={() =>
          window.open(
            `https://app.merkl.xyz/opportunities/base/CLAMM/0xafE30319a948F322585faFC1Cab1671A47eB3786`,
            "_blank",
          )
        }
      >
        {t("read.more")}
      </Button>
    </Panel>
  );
};
