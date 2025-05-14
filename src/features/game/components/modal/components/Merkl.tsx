import React from "react";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import flowerIcon from "assets/icons/flower_token.webp";
import giftIcon from "assets/icons/gift.png";

export const Merkl: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const CAMPAIGN_ID =
    Date.now() > new Date("2025-04-15").getTime()
      ? "0xabce6aa5c2d11a0609450db0410af89add01f8fb1047bd1317b67e26b3cdf433"
      : "0x89dd96c10c739800b241a2e77fc44b5c0766766d437501dd9dcfb0e4314e6de3";

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES["rocket man"]}
      onClose={onClose}
    >
      <div className="p-1">
        <Label type="vibrant" className="mb-1" icon={SUNNYSIDE.icons.stopwatch}>
          {t("merkl.rewards")}
        </Label>
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
            `https://app.merkl.xyz/opportunities/base/CLAMM/0xafE30319a948F322585faFC1Cab1671A47eB3786/leaderboard?campaignId=${CAMPAIGN_ID}&page=1`,
            "_blank",
          )
        }
      >
        {t("read.more")}
      </Button>
    </CloseButtonPanel>
  );
};
