import { useSelector } from "@xstate/react";
import { CopyField } from "components/ui/CopyField";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import vipIcon from "assets/icons/vip.webp";
import promoteIcon from "assets/icons/promote.webp";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import chest from "assets/icons/chest.png";
import { InventoryItemName } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { useSound } from "lib/utils/hooks/useSound";
import clipboard from "clipboard";

interface ReferralProps {
  onHide: () => void;
}

const REFERRAL_PACKAGE: Partial<Record<InventoryItemName, number>> = {
  "Time Warp Totem": 3,
  Gem: 20,
  "Love Charm": 25,
};

export const ReferralContent: React.FC<ReferralProps> = ({ onHide }) => {
  const { t } = useAppTranslation();
  const [showFarm, setShowFarm] = useState(false);
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, (state) => state.context.farmId);
  const username = useSelector(
    gameService,
    (state) => state.context.state.username,
  );
  const referrals = useSelector(
    gameService,
    (state) => state.context.state.referrals,
  );
  const { totalReferrals, totalVIPReferrals = 0 } = referrals ?? {
    totalReferrals: 0,
  };
  const gameLink =
    CONFIG.NETWORK === "mainnet"
      ? "https://sunflower-land.com/play"
      : "https://sunflower-land.com/testnet";
  const referralCode = username ?? `${farmId}`;
  const referralLink = `${gameLink}/?ref=${referralCode}`;
  const copypaste = useSound("copypaste");

  return (
    <CloseButtonPanel
      onClose={onHide}
      tabs={[{ icon: promoteIcon, name: "Refer a friend" }]}
    >
      <div className="p-2 text-xs flex flex-col overflow-y-auto scrollable max-h-[500px]">
        <div className="w-full relative">
          <img
            src={SUNNYSIDE.announcement.flowerBanner}
            className="w-full mb-2 rounded-sm"
          />
        </div>
        {/* Referral Link */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between gap-2">
            <Label type="info" icon={ITEM_DETAILS["Love Charm"].image}>
              {`Friends Referred: ${totalReferrals}`}
            </Label>
            <Label type="vibrant" icon={vipIcon}>
              {`VIP Friends Referred: ${totalVIPReferrals}`}
            </Label>
          </div>
          <Label
            type="default"
            popup={showFarm}
            onClick={() => {
              setShowFarm(true);
              setTimeout(() => {
                setShowFarm(false);
              }, 2000);
              copypaste.play();
              clipboard.copy(referralCode);
            }}
          >
            {t("noaccount.referralCodeLabel", { referralId: referralCode })}
          </Label>
          <CopyField
            text={referralLink}
            copyFieldMessage={t("share.CopyReferralLink")}
          />
        </div>
        {/* Referral Package */}
        <div className="flex flex-col gap-2">
          <Label type="default">{`Referral Package`}</Label>
          <div className="flex flex-col gap-4">
            <NoticeboardItems
              items={[
                {
                  text: "Refer your friends and they will receive the following starter package!",
                  icon: chest,
                },
                ...getObjectEntries(REFERRAL_PACKAGE).map(([key, value]) => ({
                  text: `${value} ${key}${value ?? 0 > 1 ? "s" : ""}`,
                  icon: ITEM_DETAILS[key].image,
                })),
              ]}
            />
          </div>
        </div>
        {/* Referral Rewards */}
        <div className="flex flex-col gap-2 mt-3">
          <Label type="warning">{t("claimReferralRewards.title")}</Label>
          <p className="p-1">{t("referral.description")}</p>
          <div className="flex flex-col gap-4">
            <NoticeboardItems
              items={[
                {
                  text: t("referral.friend"),
                  icon: ITEM_DETAILS["Love Charm"].image,
                },
                {
                  text: t("referral.vip"),
                  icon: vipIcon,
                },
                {
                  text: t("referral.flower"),
                  icon: flowerIcon,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </CloseButtonPanel>
  );
};
