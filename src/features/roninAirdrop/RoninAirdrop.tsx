import { useCallback, useEffect, useState } from "react";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { SUNNYSIDE } from "assets/sunnyside";
import { useLocation, useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Loading } from "features/auth/components/Loading";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { NPC_WEARABLES } from "lib/npcs";
import classNames from "classnames";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Label } from "components/ui/Label";
import giftIcon from "assets/icons/gift.png";
import speakerIcon from "assets/icons/speaker.webp";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TextInput } from "components/ui/TextInput";
import walletIcon from "assets/icons/wallet.png";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { Box } from "components/ui/Box";
import confetti from "canvas-confetti";
import { RoninV2PackName } from "features/wallet/lib/ronin";
import { getRoninPack } from "./actions/getRoninPack";

export const RoninAirdrop = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isInternalRoute = pathname.includes("/game");

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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

  return (
    <>
      <OuterPanel className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <div className="inset-0 fixed pointer-events-auto flex flex-col overflow-y-auto scrollable">
          <div className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px] mb-2">
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              // Repeating pixel art image background
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.flowerBanner})`,

                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 w-full h-full bg-black opacity-50 -z-0 rounded-sm" />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">
                Ronin's biggest airdrop
              </p>
            </div>

            {isInternalRoute && (
              <img
                src={SUNNYSIDE.icons.close}
                className="flex-none cursor-pointer absolute right-2"
                onClick={handleClose}
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  height: `${PIXEL_SCALE * 11}px`,
                }}
              />
            )}
          </div>
          {/* In Game Flower Stats */}
          {isLoading && <Loading />}
          {!isLoading && (
            <>
              <InnerPanel className="flex flex-wrap mx-2 mb-1">
                <div className="w-full sm:w-1/3 px-2 pt-2 h-full flex flex-col">
                  <div className="flex">
                    <p className="text-lg mb-2">Ronin's biggest airdrop</p>
                    <img src={speakerIcon} className="ml-2 h-8" />
                  </div>
                  <p className="text-sm">
                    Celebrate the launch of $FLOWER on Ronin.
                  </p>
                  <p className="text-sm mb-2">
                    Over $1,000,000 in value for eligible farms.
                  </p>

                  <p className="text-xs mb-0.5">
                    *Eligible farms based on Ronin wallet activity & X activity.
                  </p>

                  <div className="flex flex-col items-start  justify-end flex-1 -mx-1">
                    <Button
                      className="w-auto"
                      onClick={() => setShowModal(true)}
                    >
                      Check Eligibility
                    </Button>
                  </div>
                </div>
                <div className="sm:w-2/3 hidden sm:block h-[200px] relative">
                  <Label
                    type="info"
                    icon={SUNNYSIDE.icons.stopwatch}
                    className="absolute top-1 right-1"
                  >
                    X Days Left
                  </Label>
                  <img
                    src={SUNNYSIDE.announcement.autumn}
                    className="w-full  h-full"
                  />
                </div>
              </InnerPanel>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 lg:w-1/3 pr-1 pl-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title="Whale Packs"
                      positions="1st-100th"
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title="Legendary Packs"
                      positions="100th-250th"
                    />
                  </InnerPanel>
                </div>
                <div className="hidden lg:block  lg:w-1/3 px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title="Platinum Packs"
                      positions="250th-1000th"
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

  const { t } = useAppTranslation();

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
            <p className="text-sm">1 x {reward}</p>
            <p className="text-xs">~$50.99 in-game value!</p>
          </div>
        </div>
        <Button
          onClick={() => {
            window.open(`https://sunflower-land.com/play/#/`, "_blank");
          }}
        >
          Login to claim
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Label className="ml-2 mb-2" type="default" icon={SUNNYSIDE.icons.search}>
        Twitter URL
      </Label>
      <TextInput
        placeholder="https://x.com/bumpkinbuilder"
        value={twitterUrl}
        onValueChange={(value) => setTwitterUrl(value)}
      />
      <div className="flex items-center justify-center my-2">
        <div className="flex-grow border-t border-[#fff0d4]"></div>
        <span className="mx-2 text-xs">{t("softBan.or")}</span>
        <div className="flex-grow border-t border-[#fff0d4]"></div>
      </div>
      <Label className="ml-2 mb-2" type="default" icon={walletIcon}>
        Ronin Wallet Address
      </Label>
      <TextInput
        placeholder="0xd8dA6B....aA96045"
        value={address}
        onValueChange={(value) => setAddress(value)}
      />

      <Button
        disabled={!twitterUrl && !address}
        className="mt-2"
        onClick={check}
      >
        Check Eligibility
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
};

const ROWS: RoninRow[] = new Array(100).fill({
  npc: NPC_WEARABLES.tywin,
  name: "Tywin",
  prize: {
    items: {},
    wearables: {},
    sfl: 0,
  },
});

const RoninTable: React.FC<{
  rows: RoninRow[];
  title: string;
  positions: string;
}> = ({ rows, title, positions }) => {
  return (
    <>
      <div className="flex  items-center justify-between mb-2">
        <Label type="warning">{title}</Label>
        <p className="text-xs">{positions}</p>
      </div>
      <table className="table-auto w-full text-xs border-collapse">
        <tbody>
          {rows.map(({ npc, name, prize }, index) => {
            return (
              <tr
                key={index}
                className={classNames("relative cursor-pointer", {
                  "bg-[#ead4aa]": index % 2 === 0,
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
                        <p className="text-xs sm:text-sm">{`${index + 1}. ${name} `}</p>
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-1.5 flex justify-end">
                  <div className="flex items-center mb-1">
                    <p className="text-xs sm:text-sm mr-1.5">{`${prize}`}</p>
                    <img src={giftIcon} className="h-6" />
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
