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
              icon={SUNNYSIDE.icons.player}
            >
              {`25 Love Charms when your friend signs up using your referral link - One time only`}
            </Label>
            <Label
              type="transparent"
              className="mx-4"
              icon={ITEM_DETAILS["Love Charm"].image}
            >
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
