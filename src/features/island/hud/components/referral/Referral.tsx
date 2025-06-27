import { useSelector } from "@xstate/react";
import { CopyField } from "components/ui/CopyField";
import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
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
import { getReferrees } from "./actions/getReferrees";
import useSWR from "swr";
import { useAuth } from "features/auth/lib/Provider";
import { Loading } from "features/auth/components";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import classNames from "classnames";
import { getRelativeTime } from "lib/utils/time";

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
  const [tab, setTab] = useState(0);
  return (
    <CloseButtonPanel
      onClose={onHide}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        { icon: promoteIcon, name: "Refer a friend" },
        { icon: SUNNYSIDE.icons.player, name: "Referred" },
      ]}
    >
      {tab === 0 && <ReferralInfo onHide={onHide} />}
      {tab === 1 && <Referrees />}
    </CloseButtonPanel>
  );
};

const fetcher = async ([token, farmId]: [string, number]) => {
  return getReferrees({ token, farmId });
};

export const Referrees: React.FC = () => {
  const { t } = useAppTranslation();
  const { authState } = useAuth();
  const { gameState } = useGame();
  const { data, isLoading, error, mutate } = useSWR(
    [authState.context.user.rawToken as string, gameState.context.farmId],
    fetcher,
  );

  if (isLoading) return <Loading />;
  if (error) return <SomethingWentWrong />;

  const referrees = data!.data.referrees.sort(
    (a, b) => (b.flower ?? 0) - (a.flower ?? 0),
  );
  const totalReferrees = referrees?.length ?? 0;
  const totalVIPReferrees =
    referrees?.filter((referree) => referree.vip).length ?? 0;
  const totalFlower =
    referrees?.reduce((acc, referree) => acc + (referree.flower ?? 0), 0) ?? 0;

  let label = t("referral.noReferrees");
  if (totalReferrees === 1) {
    label = t("referral.singleReferree", { vipCount: totalVIPReferrees });
  } else if (totalReferrees > 1) {
    label = t("referral.multipleReferrees", {
      totalReferrees,
      vipCount: totalVIPReferrees,
    });
  }

  return (
    <div className="max-h-[500px] overflow-y-auto scrollable">
      <div className="flex justify-between items-center">
        <Label type="default">{t("referral.summary")}</Label>
        <div className="flex items-center">
          <Label
            type="vibrant"
            icon={flowerIcon}
          >{`${totalFlower} ${t("referral.flowerLabel")}`}</Label>
        </div>
      </div>
      <div className="m-2">
        <span className="text-xs">{label}</span>
      </div>

      <table className="w-full text-xs table-auto border-collapse">
        <tbody>
          {referrees.map(({ id, createdAt, username, vip, flower }, index) => (
            <tr
              key={index}
              style={{ border: "1px solid #b96f50" }}
              className={classNames({
                "bg-[#ead4aa]": index % 2 === 0,
              })}
            >
              <td className="p-1.5 flex">
                <img
                  src={vip ? vipIcon : SUNNYSIDE.icons.player}
                  className="w-6 mr-2 object-contain"
                />
                <div>
                  <p className="text-xs">{username ?? `#${id}`}</p>
                  <p className="text-xxs">{getRelativeTime(createdAt)}</p>
                </div>
              </td>

              <td className="p-1.5">
                <div className="flex items-center space-x-1 justify-end">
                  <>
                    <span>{flower ?? 0}</span>
                    <img src={flowerIcon} className="h-4" />
                  </>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <div className="flex justify-center items-center">
                <p className="mb-[10px]">{t("referral.more")}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const ReferralInfo: React.FC<ReferralProps> = ({ onHide }) => {
  const { t } = useAppTranslation();
  const [showFarm, setShowFarm] = useState(false);
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
  const referralCode = username ?? `${farmId}`;
  const referralLink = `${gameLink}/?ref=${referralCode}`;
  const copypaste = useSound("copypaste");

  return (
    <div className="p-2 text-xs flex flex-col overflow-y-auto scrollable max-h-[500px]">
      <div className="w-full relative">
        <img
          src={SUNNYSIDE.announcement.flowerBanner}
          className="w-full mb-2 rounded-sm"
        />
      </div>
      {/* Referral Link */}
      <div className="flex flex-col gap-2">
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
                text: `${value} ${key}${(value ?? 0 > 1) ? "s" : ""}`,
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
  );
};
