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
                    <a
                      href="https://docs.sunflower-land.com/support/terms-of-service/ronin-launch"
                      target="_blank"
                      className="m-2 underline text-xs"
                      rel="noreferrer"
                    >
                      {t("rules.termsOfService")}
                    </a>
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
              <div className="flex flex-col md:flex-row flex-wrap">
                <div className="w-full md:w-1/2 lg:w-1/3 pr-1 pl-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(0, 10)}
                      title={t("ronin.airdrop.whalePackTitle")}
                      positions={t("ronin.airdrop.whalePackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(10, 20)}
                      title={t("ronin.airdrop.legendaryPackTitle")}
                      positions={t("ronin.airdrop.legendaryPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3  px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(20, 30)}
                      title={t("ronin.airdrop.platinumPackTitle")}
                      positions={t("ronin.airdrop.platinumPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3  px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(30, 40)}
                      title={t("ronin.airdrop.platinumPackTitle")}
                      positions={t("ronin.airdrop.platinumPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3  px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(40, 50)}
                      title={t("ronin.airdrop.platinumPackTitle")}
                      positions={t("ronin.airdrop.platinumPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3  px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(50, 60)}
                      title={t("ronin.airdrop.platinumPackTitle")}
                      positions={t("ronin.airdrop.platinumPackPositions")}
                    />
                  </InnerPanel>
                </div>
                <div className="w-full   px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={RONIN_ROWS.slice(60, 75)}
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

export const RONIN_PACK_IMAGES: Record<RoninV2PackName, string> = {
  "Bronze Pack": SUNNYSIDE.announcement.bronze_claimed,
  "Silver Pack": SUNNYSIDE.announcement.silver_claimed,
  "Gold Pack": SUNNYSIDE.announcement.gold_claimed,
  "Platinum Pack": SUNNYSIDE.announcement.platinum_claimed,
  "Legendary Pack": SUNNYSIDE.announcement.legendary_claimed,
  "Whale Pack": SUNNYSIDE.announcement.whale_claimed,
};

export const RoninEligibility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reward, setReward] = useState<RoninPackName | null>(null);
  const [claimed, setClaimed] = useState<boolean>(false);

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

    const { reward, claimed } = await getRoninPack({ address, twitterUrl });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    confetti();

    setReward(reward);
    setClaimed(claimed);
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (reward) {
    return (
      <div className="flex flex-col items-center">
        <Label type="warning" className="ml-1">
          {reward}
        </Label>
        <p className="text-sm my-2 text-center">{`Congratulations, you are eligible for the ${reward}!`}</p>

        <img
          src={RONIN_PACK_IMAGES[reward]}
          className="w-full sm:w-2/3 rounded-md my-2"
        />
        <div className="flex items-center "></div>

        {twitterUrl && (
          <div className="p-2 mb-1">
            <Label type="warning">{t("ronin.airdrop.howToClaim")}</Label>
            <p className="text-xs">{t("ronin.airdrop.loginToClaim")}</p>
            <p className="text-xs">{t("ronin.airdrop.openRewardsSection")}</p>
            <p className="text-xs">
              {t("ronin.airdrop.connectTwitterAccount")}
            </p>
            <p className="text-xs italic">{t("ronin.airdrop.bonus")}</p>
          </div>
        )}
        {address && (
          <div className="p-2 mb-1 text-center">
            <p className="text-xs">{t("ronin.airdrop.wallet")}</p>
          </div>
        )}
        {claimed && (
          <Label type="success" className="ml-1">
            {t("ronin.airdrop.claimed")}
          </Label>
        )}
        {!claimed && (
          <Button
            onClick={() => {
              window.open(`https://sunflower-land.com/play/#/`, "_blank");
            }}
          >
            {t("ronin.airdrop.loginToClaim")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <Label type="formula">{t("ronin.airdrop.enterDetails")}</Label>
      <p className="text-sm my-2 mx-1">{t("ronin.airdrop.claim.two")}</p>
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
  position: number;
};

const RONIN_ROWS: RoninRow[] = [
  { name: "Jihoz_Axie", npc: NPC_WEARABLES.tywin, position: 1 },
  { name: "VitalikButerin", npc: NPC_WEARABLES.bert, position: 2 },
  { name: "heidichristne", npc: NPC_WEARABLES.betty, position: 3 },
  { name: "gabusch", npc: NPC_WEARABLES.grubnuk, position: 4 },
  { name: "yellowpantherx", npc: NPC_WEARABLES.garbo, position: 5 },
  { name: "Rojankhzxr", npc: NPC_WEARABLES.blacksmith, position: 6 },
  { name: "brycent_", npc: NPC_WEARABLES.gambit, position: 7 },
  { name: "SamSteffanina", npc: NPC_WEARABLES.grommy, position: 8 },
  { name: "Hantao", npc: NPC_WEARABLES.jester, position: 9 },
  { name: "Alliestrasza", npc: NPC_WEARABLES.victoria, position: 10 },
  { name: "MarkofTheZeal", npc: NPC_WEARABLES["pumpkin' pete"], position: 11 },
  { name: "TheRoninRadio", npc: NPC_WEARABLES.solara, position: 12 },
  { name: "Prismrangers", npc: NPC_WEARABLES.tywin, position: 13 },
  { name: "BG_Crypto4", npc: NPC_WEARABLES.timmy, position: 14 },
  { name: "xdashred", npc: NPC_WEARABLES.orlin, position: 15 },
  { name: "AxieAur", npc: NPC_WEARABLES.stella, position: 16 },
  { name: "Lima_Kind", npc: NPC_WEARABLES["pumpkin' pete"], position: 17 },
  { name: "MukeGaming", npc: NPC_WEARABLES.mayor, position: 18 },
  { name: "investingsadhu", npc: NPC_WEARABLES.barlow, position: 19 },
  { name: "aditya_rmurali", npc: NPC_WEARABLES.bert, position: 20 },
  { name: "zioaxie", npc: NPC_WEARABLES.wizard, position: 21 },
  { name: "AxieArtGallery", npc: NPC_WEARABLES.wizard, position: 22 },
  { name: "Tita_KIND", npc: NPC_WEARABLES.stevie, position: 23 },
  { name: "ChuckFresco", npc: NPC_WEARABLES.greedclaw, position: 24 },
  { name: "Freya_Kind", npc: NPC_WEARABLES["farmer flesh"], position: 25 },
  { name: "brisa_bit", npc: NPC_WEARABLES.greedclaw, position: 26 },
  { name: "Theeban1437", npc: NPC_WEARABLES.flopsy, position: 27 },
  { name: "0xWil_", npc: NPC_WEARABLES.grimbly, position: 28 },
  { name: "IamSHADR", npc: NPC_WEARABLES.bella, position: 29 },
  { name: "GilaCees", npc: NPC_WEARABLES.gunter, position: 30 },
  { name: "kimbokitten", npc: NPC_WEARABLES.hopper, position: 31 },
  { name: "StarPlatinumSOL", npc: NPC_WEARABLES.misty, position: 32 },
  { name: "ItsEduMock", npc: NPC_WEARABLES.tango, position: 33 },
  { name: "cagyjan1", npc: NPC_WEARABLES.finn, position: 34 },
  { name: "daryl24_eth", npc: NPC_WEARABLES.finley, position: 35 },
  { name: "CosmicWolfRonin", npc: NPC_WEARABLES.garth, position: 36 },
  { name: "eth_apple", npc: NPC_WEARABLES.eldric, position: 37 },
  { name: "eeelistar", npc: NPC_WEARABLES.finley, position: 38 },
  { name: "Arual3x", npc: NPC_WEARABLES.bruce, position: 39 },
  { name: "hezelya", npc: NPC_WEARABLES.bailey, position: 40 },
  { name: "Garrison_XV", npc: NPC_WEARABLES.glinteye, position: 41 },
  { name: "tcaff_", npc: NPC_WEARABLES["phantom face"], position: 42 },
  { name: "Runes_tcg", npc: NPC_WEARABLES.peggy, position: 43 },
  { name: "Pleun_V", npc: NPC_WEARABLES["hammerin harry"], position: 44 },
  { name: "Dabudda17", npc: NPC_WEARABLES.gordo, position: 45 },
  { name: "RoninAddict", npc: NPC_WEARABLES.marcus, position: 46 },
  { name: "tr3vorx", npc: NPC_WEARABLES.grabnab, position: 47 },
  { name: "KarencitaKind", npc: NPC_WEARABLES.timmy, position: 48 },

  { name: "inhuman", npc: NPC_WEARABLES.miranda, position: 49 },
  { name: "haru_BCG", npc: NPC_WEARABLES.gilda, position: 50 },
  { name: "Yin_NGMI", npc: NPC_WEARABLES.blacksmith, position: 51 },
  { name: "SpikeCollects", npc: NPC_WEARABLES["lady day"], position: 52 },
  { name: "nicky_tengku", npc: NPC_WEARABLES.jake, position: 53 },
  { name: "iceyyy_gaming", npc: NPC_WEARABLES.guria, position: 54 },
  { name: "RealUkin", npc: NPC_WEARABLES.haymitch, position: 55 },
  { name: "MIR_NFT", npc: NPC_WEARABLES.igor, position: 56 },
  { name: "joseprust", npc: NPC_WEARABLES.minewhack, position: 57 },
  { name: "Seroynft", npc: NPC_WEARABLES.gunter, position: 58 },
  { name: "CryptoStache", npc: NPC_WEARABLES.reginald, position: 59 },
  { name: "stephyberry_", npc: NPC_WEARABLES["pumpkin' pete"], position: 60 },
  { name: "Sakura_Freedom", npc: NPC_WEARABLES.misty, position: 61 },
  { name: "LucBerkefeld", npc: NPC_WEARABLES.solara, position: 62 },
  { name: "raidenkrn", npc: NPC_WEARABLES.stevie, position: 63 },
  { name: "Lombrajr", npc: NPC_WEARABLES.luna, position: 64 },
  { name: "GaspodeWD", npc: NPC_WEARABLES.stevie, position: 65 },
  { name: "AlemaoNFTReal", npc: NPC_WEARABLES.birdie, position: 66 },
  { name: "mizzysworld", npc: NPC_WEARABLES.chase, position: 67 },
  { name: "vert1dkrn", npc: NPC_WEARABLES.elf, position: 68 },
  { name: "zyrickonline", npc: NPC_WEARABLES["chef maple"], position: 69 },
  { name: "0xPatchara", npc: NPC_WEARABLES.ginger, position: 70 },
  { name: "ToxiC5501", npc: NPC_WEARABLES.peggy, position: 71 },
  { name: "GeorgeInTheMeta", npc: NPC_WEARABLES.tywin, position: 72 },
  { name: "Stormingweb3", npc: NPC_WEARABLES.victoria, position: 73 },
  { name: "Dashke_witch", npc: NPC_WEARABLES.jester, position: 74 },
  { name: "trungfinity", npc: NPC_WEARABLES.gambit, position: 75 },
];

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
                    <div
                      className="flex flex-col"
                      onClick={() => {
                        window.open(`https://x.com/${name}`, "_blank");
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <p className="text-xs sm:text-sm">{`${position}. @${name} `}</p>
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
