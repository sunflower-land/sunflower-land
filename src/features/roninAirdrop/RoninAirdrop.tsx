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
import twitterIcon from "assets/icons/world_book.webp";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { TextInput } from "components/ui/TextInput";
import walletIcon from "assets/icons/wallet.png";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { Box } from "components/ui/Box";
import confetti from "canvas-confetti";
import { RONIN_BOX_REWARDS, RoninV2PackName } from "features/wallet/lib/ronin";
import { getRoninPack } from "./actions/getRoninPack";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { getKeys } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import { useGame } from "features/game/GameProvider";
import { hasFeatureAccess } from "lib/flags";

// Wrapper for the Ronin Airdrop page to ensure they have access
export const GameRoninAirdrop = () => {
  const { gameState } = useGame();

  const navigate = useNavigate();

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
    return <div>404</div>;
  }

  return <RoninAirdrop onClose={handleClose} />;
};

export const RoninAirdrop: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
                      <p className="text-lg ">Ronin's biggest airdrop</p>
                      <img src={speakerIcon} className="ml-2 h-8" />
                    </div>
                    <p className="text-sm mb-2">
                      Celebrate the launch of $FLOWER on Ronin.
                    </p>
                    <Label
                      type="info"
                      icon={SUNNYSIDE.icons.stopwatch}
                      className="mb-3"
                    >
                      X Days Left
                    </Label>

                    {/* <div className="flex items-center  mb-2">
                      <img className="w-8 mr-2" src={giftIcon} />
                      <p className="text-sm">$5,000,000 of in-game value.</p>
                    </div> */}

                    <div className="flex items-center  mb-1">
                      <img className="w-8 mr-2" src={walletIcon} />
                      <p className="text-sm">
                        500,000 Eligible Ronin Addresses
                      </p>
                    </div>

                    <div className="flex items-center  mb-1">
                      <img className="w-8 mr-2" src={twitterIcon} />
                      <p className="text-sm">10,000 X Influencers (Twitter)</p>
                    </div>

                    <div className="flex items-center  mb-1">
                      <img className="w-8 mr-2" src={giftIcon} />
                      <p className="text-sm">
                        Prizes up to $500 (in-game value)
                      </p>
                    </div>
                    <div className="mt-4">
                      <Button
                        className="w-auto"
                        onClick={() => setShowModal(true)}
                      >
                        Check Eligibility
                      </Button>
                    </div>
                  </div>
                </InnerPanel>
                {onClose && (
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="flex-none cursor-pointer absolute right-2 top-2"
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
                      title="Whale Pack"
                      positions="1st-100th"
                    />
                  </InnerPanel>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title="Legendary Pack"
                      positions="100th-250th"
                    />
                  </InnerPanel>
                </div>
                <div className="hidden lg:block  lg:w-1/3 px-1 pr-2 mb-2">
                  <InnerPanel>
                    <RoninTable
                      rows={ROWS.slice(0, 10)}
                      title="Platinum Pack"
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
  title: RoninPackName;
  positions: string;
}> = ({ rows, title, positions }) => {
  const { items, estimatedValue } = RONIN_BOX_REWARDS[title];
  return (
    <>
      <div className="flex  items-center justify-between mb-2">
        <div className="flex items-center">
          <Label type="warning">{title}</Label>
          <p className="text-xs ml-2">{`~$${estimatedValue}`}</p>
        </div>
        <p className="text-xs">{positions}</p>
      </div>
      <div className="flex flex-wrap items-center mx-1 mb-2">
        {title === "Whale Pack" && (
          <Label
            type="vibrant"
            icon={ITEM_DETAILS["Pet Egg"].image}
            className="mr-2"
          >
            {`NFT Egg`}
          </Label>
        )}
        {getKeys(items).map((name) => (
          <Label
            type="vibrant"
            icon={ITEM_DETAILS[name].image}
            className="mr-2 mb-1"
          >
            {`${items[name]! > 1 ? `${items[name]} ` : ""}${name}`}
          </Label>
        ))}
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
