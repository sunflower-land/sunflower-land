import { useSelector } from "@xstate/react";
import { CopyField } from "components/ui/CopyField";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import flowerIcon from "assets/icons/flower_token.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import vipIcon from "assets/icons/vip.webp";

interface ReferralProps {
  show: boolean;
  onHide: () => void;
}
export const ReferralContent: React.FC = () => {
  const { t } = useAppTranslation();
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
  const { totalReferrals, totalVIPReferrals } = referrals ?? {
    totalReferrals: 0,
  };
  const gameLink =
    CONFIG.NETWORK === "mainnet"
      ? "https://sunflower-land.com/play"
      : "https://sunflower-land.com/testnet";
  const referralCode = username ?? farmId;
  const referralLink = `${gameLink}/?ref=${referralCode}`;

  return (
    <Panel>
      <div className="p-2 text-xs flex flex-col">
        <div className="w-full relative">
          <img
            src={SUNNYSIDE.announcement.flowerBanner}
            className="w-full mb-2 rounded-sm"
          />
        </div>
        {/* Referral Link */}
        <div className="flex flex-col gap-2">
          <Label type="default">{`Your Referral Link`}</Label>
          <div className="flex flex-row justify-between gap-2">
            <Label type="info" icon={ITEM_DETAILS["Love Charm"].image}>
              {`Friends Referred: ${totalReferrals}`}
            </Label>
            <Label type="vibrant" icon={vipIcon}>
              {`VIP Friends Referred: ${totalVIPReferrals}`}
            </Label>
          </div>
          <CopyField
            text={referralLink}
            copyFieldMessage={t("share.CopyReferralLink")}
          />
        </div>
        {/* Referral Package */}
        <div className="flex flex-col gap-2">
          <Label type="default">{`Referral Package`}</Label>
          <p className="p-1">{`Refer your friends and they will receive the following package when they sign up using your referral link:`}</p>
          <div className="flex flex-col gap-4">
            <Label
              type="transparent"
              className="mx-4"
              icon={ITEM_DETAILS.Gem.image}
            >
              {`100 Gems`}
            </Label>
            <Label
              type="transparent"
              className="mx-4"
              icon={ITEM_DETAILS["Love Charm"].image}
            >
              {`25 Love Charms`}
            </Label>
          </div>
        </div>
        {/* Referral Rewards */}
        <div className="flex flex-col gap-2 mt-3">
          <Label type="warning">{`Referral Rewards`}</Label>
          <p className="p-1">{`Refer your friends and you will receive the following rewards:`}</p>{" "}
          <div className="flex flex-col gap-4">
            <Label
              type="transparent"
              className="mx-4"
              icon={ITEM_DETAILS["Love Charm"].image}
            >
              {`25 Love Charms when your friend signs up using your referral link - One time only`}
            </Label>
            <Label type="transparent" className="mx-4" icon={vipIcon}>
              {`25 Love Charms when your friend buys VIP`}
            </Label>
            <Label type="transparent" className="mx-4" icon={flowerIcon}>
              {`10% of $FLOWER spent by your friend`}
            </Label>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const Referral: React.FC<ReferralProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <ReferralContent />
    </Modal>
  );
};
