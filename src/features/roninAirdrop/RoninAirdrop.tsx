import React, { useEffect, useState } from "react";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { SUNNYSIDE } from "assets/sunnyside";
import { useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Loading } from "features/auth/components/Loading";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { NPC_WEARABLES } from "lib/npcs";
import classNames from "classnames";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Label } from "components/ui/Label";
import giftIcon from "assets/icons/gift.png";
import whaleIcon from "assets/icons/whale.webp";
import speakerIcon from "assets/icons/speaker.webp";
import twitterIcon from "assets/icons/world_book.webp";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TextInput } from "components/ui/TextInput";
import walletIcon from "assets/icons/wallet.png";
import vipIcon from "assets/icons/vip.webp";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { Box } from "components/ui/Box";
import confetti from "canvas-confetti";
import { RoninV2PackName } from "features/wallet/lib/ronin";
import { getRoninPack } from "./actions/getRoninPack";
import { ITEM_DETAILS } from "features/game/types/images";
import { useGame } from "features/game/GameProvider";
import { hasFeatureAccess, RONIN_AIRDROP_ENDDATE } from "lib/flags";
import { secondsToString } from "lib/utils/time";

// Wrapper for the Ronin Airdrop page to ensure they have access
export const GameRoninAirdrop = () => {
  const { gameState } = useGame();

  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const handleClose = () => {
    navigate(-1);
  };

  // exit marketplace if Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  if (!hasFeatureAccess(gameState.context.state, "RONIN_AIRDROP")) {
    return <div>{`404`}</div>;
  }

  return <RoninAirdrop onClose={handleClose} />;
};

export const RoninAirdrop: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const secondsLeft = (RONIN_AIRDROP_ENDDATE.getTime() - Date.now()) / 1000;

  return (
    <>
      <OuterPanel className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <div className="inset-0 fixed pointer-events-auto flex flex-col overflow-y-auto scrollable pt-2">
          {/* In Game Flower Stats */}
          {isLoading && <Loading />}
          {!isLoading && (
            <>
              <div className="flex flex-wrap mx-2  relative">
                <InnerPanel className="w-full md:w-2/5 mb-1">
                  <div className=" px-2 pt-2  flex flex-col h-full">
                    <div className="flex">
                      <p className="text-lg ">{t("ronin.airdrop.title")}</p>
                      <img src={speakerIcon} className="ml-2 h-8" />
                    </div>
                    <p className="text-sm mb-2">
                      {t("ronin.airdrop.subtitle")}
                    </p>
                    <Label
                      type="info"
                      icon={SUNNYSIDE.icons.stopwatch}
                      className="mb-3"
                    >
                      {t("ronin.airdrop.timeLeft", {
                        timeLeft: secondsToString(secondsLeft, {
                          length: "short",
                        }),
                      })}
                    </Label>

                    {/* <div className="flex items-center  mb-2">
                      <img className="w-8 mr-2" src={giftIcon} />
                      <p className="text-sm">$5,000,000 of in-game value.</p>
                    </div> */}

                    <div className="flex items-center  mb-2">
                      <img className="w-8 mr-2" src={walletIcon} />
                      <p className="text-sm">
                        {t("ronin.airdrop.eligibleAddresses")}
                      </p>
                    </div>

                    <div className="flex items-center  mb-2">
                      <img className="w-8 mr-2" src={twitterIcon} />
                      <p className="text-sm">
                        {t("ronin.airdrop.influencers")}
                      </p>
                    </div>

                    <div className="flex items-center  mb-2">
                      <img className="w-8 mr-2" src={whaleIcon} />
                      <div>
                        <p className="text-sm">
                          {t("ronin.airdrop.whalePack")}
                        </p>
                        <div className="flex flex-wrap">
                          <div className="flex mr-3">
                            <img
                              className="h-4 mr-0.5"
                              src={ITEM_DETAILS.Gem.image}
                            />
                            <p className="text-xs">{t("ronin.airdrop.gems")}</p>
                          </div>
                          <div className="flex mr-3">
                            <img
                              className="h-4 mr-1"
                              src={ITEM_DETAILS["Pet Egg"].image}
                            />
                            <p className="text-xs">
                              {t("ronin.airdrop.petNft")}
                            </p>
                          </div>
                          <div className="flex">
                            <img className="h-4 mr-1" src={vipIcon} />
                            <p className="text-xs">
                              {t("ronin.airdrop.lifetimeVip")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        className="w-auto"
                        onClick={() => setShowModal(true)}
                      >
                        {t("ronin.airdrop.checkEligibility")}
                      </Button>
                    </div>
                  </div>
                </InnerPanel>
                {onClose && (
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="flex-none z-10 cursor-pointer absolute right-2 top-2"
                    onClick={onClose}
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                      height: `${PIXEL_SCALE * 11}px`,
                    }}
                  />
                )}
                <div className=" w-full md:w-3/5 relative px-1 mb-1">
                  <img
                    src={SUNNYSIDE.announcement.roninAirdrop}
                    className="w-full rounded-md h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 lg:w-1/3 pr-1 pl-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title={t("ronin.airdrop.whalePackTitle")}
                      positions={t("ronin.airdrop.whalePackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(10, 20)}
                      title={t("ronin.airdrop.legendaryPackTitle")}
                      positions={t("ronin.airdrop.legendaryPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="hidden lg:block  lg:w-1/3 px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(20, 30)}
                      title={t("ronin.airdrop.platinumPackTitle")}
                      positions={t("ronin.airdrop.platinumPackPositions")}
                    />
                  </InnerPanel>
                </div>
              </div>
            </>
          )}
        </div>
      </OuterPanel>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          bumpkinParts={NPC_WEARABLES.tywin}
          onClose={() => setShowModal(false)}
        >
          <RoninEligibility />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

export const RoninEligibility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reward, setReward] = useState<RoninPackName | null>(null);

  const [address, setAddress] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [twitterError, setTwitterError] = useState("");
  const [addressError, setAddressError] = useState("");

  const { t } = useAppTranslation();

  const validateTwitterUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid (optional field)

    // Twitter/X URL patterns
    const twitterPatterns = [
      /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
      /^https?:\/\/(www\.)?x\.com\/[a-zA-Z0-9_]+$/,
      /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]+$/,
      /^https?:\/\/x\.com\/[a-zA-Z0-9_]+$/,
    ];

    return twitterPatterns.some((pattern) => pattern.test(url));
  };

  const validateWalletAddress = (addr: string): boolean => {
    if (!addr) return true; // Empty address is valid (optional field)

    // Ethereum/Ronin address validation (42 characters, starts with 0x, followed by 40 hex characters)
    const addressPattern = /^0x[a-fA-F0-9]{40}$/;
    return addressPattern.test(addr);
  };

  const check = async () => {
    setIsLoading(true);

    const { reward } = await getRoninPack({ address, twitterUrl });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    confetti();

    setReward(reward);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (reward) {
    return (
      <div>
        <Label type="warning" className="ml-1">
          {reward}
        </Label>
        <div className="flex items-center ">
          <Box image={giftIcon} />
          <div className="ml-1">
            <p className="text-sm">{`1 x ${reward}`}</p>
          </div>
        </div>

        {twitterUrl && (
          <div className="p-2 mb-1">
            <p className="text-xs">{t("ronin.airdrop.loginToClaim")}</p>
            <p className="text-xs">{t("ronin.airdrop.openRewardsSection")}</p>
            <p className="text-xs">
              {t("ronin.airdrop.connectTwitterAccount")}
            </p>
          </div>
        )}
        <Button
          onClick={() => {
            window.open(`https://sunflower-land.com/play/#/`, "_blank");
          }}
        >
          {t("ronin.airdrop.loginToClaim")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Label className="ml-2 mb-2" type="default" icon={SUNNYSIDE.icons.search}>
        {t("ronin.airdrop.twitterUrl")}
      </Label>
      <TextInput
        placeholder={t("ronin.airdrop.twitterUrlPlaceholder")}
        value={twitterUrl}
        onValueChange={(value) => {
          setTwitterUrl(value);
          if (value && !validateTwitterUrl(value)) {
            setTwitterError(t("ronin.airdrop.twitterUrlError"));
          } else {
            setTwitterError("");
          }
        }}
      />
      {twitterError && (
        <p className="text-red-500 text-xs mt-1 ml-2">{twitterError}</p>
      )}
      <div className="flex items-center justify-center my-2">
        <div className="flex-grow border-t border-[#fff0d4]"></div>
        <span className="mx-2 text-xs">{t("softBan.or")}</span>
        <div className="flex-grow border-t border-[#fff0d4]"></div>
      </div>
      <Label className="ml-2 mb-2" type="default" icon={walletIcon}>
        {t("ronin.airdrop.roninWalletAddress")}
      </Label>
      <TextInput
        placeholder={t("ronin.airdrop.walletAddressPlaceholder")}
        value={address}
        onValueChange={(value) => {
          setAddress(value);
          if (value && !validateWalletAddress(value)) {
            setAddressError(t("ronin.airdrop.walletAddressError"));
          } else {
            setAddressError("");
          }
        }}
      />
      {addressError && (
        <p className="text-red-500 text-xs mt-1 ml-2">{addressError}</p>
      )}

      <Button
        disabled={
          (!twitterUrl && !address) ||
          (!!twitterUrl && !validateTwitterUrl(twitterUrl)) ||
          (!!address && !validateWalletAddress(address))
        }
        className="mt-2"
        onClick={check}
      >
        {t("ronin.airdrop.checkEligibility")}
      </Button>
    </div>
  );
};

export type RoninPackName = RoninV2PackName;
type RoninPack = {
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Partial<Record<BumpkinItem, number>>;
  sfl: number;
};

type RoninRow = {
  npc: BumpkinParts;
  name: string;
  prize: RoninPack;
  position: number;
};

const ROWS: RoninRow[] = new Array(100)
  .fill({
    npc: NPC_WEARABLES.tywin,
    name: "Tywin", // This could be made translatable if needed
    prize: {
      items: {},
      wearables: {},
      sfl: 0,
    },
  })
  .map((row, index) => ({
    ...row,
    position: index + 1,
  }));

const RoninTable: React.FC<{
  rows: RoninRow[];
  title: RoninPackName;
  positions: string;
}> = ({ rows, title, positions }) => {
  return (
    <>
      <table className="table-auto w-full text-xs border-collapse">
        <tbody>
          {rows.map(({ npc, name, position }) => {
            return (
              <tr
                key={position}
                className={classNames("relative cursor-pointer", {
                  "bg-[#ead4aa]": position % 2 === 0,
                })}
              >
                <td className="p-1.5 sm:w-1/3 truncate text-center relative">
                  <div className="flex items-center">
                    <div className="relative w-10 h-6">
                      <div className="absolute -top-1">
                        <NPCIcon width={30} parts={npc} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <p className="text-xs sm:text-sm">{`${position}. ${name} `}</p>
                      </div>
                    </div>
                  </div>
                </td>
                {/* align right */}
                <td className="text-right">
                  <div className="flex justify-end">
                    <img src={whaleIcon} className="h-5 mr-2" />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
