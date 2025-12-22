import React, { useContext, useEffect, useState, type JSX } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import fullMoon from "assets/icons/full_moon.png";
import powerup from "assets/icons/level_up.png";
import tradeOffs from "src/assets/icons/tradeOffs.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import {
  CHUM_AMOUNTS,
  CHUM_DETAILS,
  Chum,
  FishingBait,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import { getDailyFishingCount } from "features/game/types/fishing";
import { isWearableActive } from "features/game/lib/wearables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";
import Decimal from "decimal.js-light";
import { SquareIcon } from "components/ui/SquareIcon";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { getRemainingReels } from "features/game/events/landExpansion/castRod";
import { BuffLabel } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getReelGemPrice } from "features/game/events/landExpansion/buyMoreReels";
import {
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
} from "features/game/types/bumpkinSkills";
import { getImageUrl } from "lib/utils/getImageURLS";
import {
  INNER_CANVAS_WIDTH,
  SkillBox,
} from "features/bumpkins/components/revamp/SkillBox";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { MachineState } from "features/game/lib/gameMachine";
import { gameAnalytics } from "lib/gameAnalytics";
import { SEASON_ICONS } from "../buildings/components/building/market/SeasonalSeeds";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `fisherman-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

const RARE_CHUM: InventoryItemName[] = [
  "Rich Chicken",
  "Speed Chicken",
  "Fat Chicken",
];

const ChumSelection: React.FC<{
  state: GameState;
  bait: FishingBait;
  onList: (item: Chum) => void;
  onCancel: () => void;
  initialChum?: Chum;
}> = ({ state, bait, onList, onCancel, initialChum }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Chum | undefined>(initialChum);
  const select = (name: Chum) => {
    setSelected(name);
  };

  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const hasRequirements =
    selected && items[selected]?.gte(CHUM_AMOUNTS[selected] ?? 0);

  return (
    <div>
      <p className="mb-1 p-1 text-xs">{t("select.resource")}</p>

      <div className="flex flex-wrap">
        {getKeys(CHUM_AMOUNTS)
          .filter((name) => !!items[name]?.gte(1))
          .filter((name) => {
            if (bait !== "Red Wiggler" && RARE_CHUM.includes(name)) {
              return false;
            }

            return true;
          })
          .map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              count={items[name]}
              onClick={() => select(name)}
              key={name}
              isSelected={selected === name}
            />
          ))}
      </div>

      {selected && (
        <div className="p-2">
          <div className="flex justify-between">
            <Label
              type="default"
              className="mb-1"
              icon={ITEM_DETAILS[selected].image}
            >
              {selected}
            </Label>
            <Label
              type={!hasRequirements ? "danger" : "default"}
              className="mb-1"
            >
              {`${CHUM_AMOUNTS[selected]} ${selected}`}
            </Label>
          </div>
          <p className="text-xs">{CHUM_DETAILS[selected]}</p>
        </div>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onCancel()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!hasRequirements}
          onClick={() => onList(selected as Chum)}
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};

const BAIT: FishingBait[] = [
  "Earthworm",
  "Grub",
  "Red Wiggler",
  "Fishing Lure",
];

const BaitSelection: React.FC<{
  onCast: (bait: FishingBait, chum?: InventoryItemName) => void;
  onClickBuy: () => void;
  state: GameState;
}> = ({ onCast, onClickBuy, state }) => {
  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  useEffect(() => {
    const lastSelectedBait = localStorage.getItem("lastSelectedBait");
    if (lastSelectedBait) {
      setBait(lastSelectedBait as FishingBait);
    }
    const lastSelectedChum = localStorage.getItem("lastSelectedChum");

    const hasRequirements =
      lastSelectedChum &&
      items[lastSelectedChum as InventoryItemName]?.gte(
        CHUM_AMOUNTS[lastSelectedChum as Chum] ?? 0,
      );

    if (hasRequirements) {
      setChum(lastSelectedChum as Chum);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<Chum | undefined>();
  const [bait, setBait] = useState<FishingBait>("Earthworm");

  const { t } = useAppTranslation();

  if (showChum) {
    return (
      <InnerPanel>
        <ChumSelection
          bait={bait}
          state={state}
          onCancel={() => setShowChum(false)}
          initialChum={chum}
          onList={(selected) => {
            setChum(selected);
            localStorage.setItem("lastSelectedChum", selected);
            setShowChum(false);
          }}
        />
      </InnerPanel>
    );
  }

  const reelsLeft = getRemainingReels(state);

  const fishingLimitReached = reelsLeft <= 0;
  const missingRod =
    !isWearableActive({ name: "Ancient Rod", game: state }) &&
    (!state.inventory["Rod"] || state.inventory.Rod.lt(1));

  const currentSeason = state.season.season;

  return (
    <>
      <InnerPanel>
        <div className="p-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-2">
              <Label
                icon={SEASON_ICONS[currentSeason]}
                type="default"
                className="capitalize"
              >
                {t(`season.${currentSeason}`)}
              </Label>
              {isFishFrenzy(state) && (
                <Label icon={lightning} type="vibrant">
                  {t("calendar.events.fishFrenzy.title")}
                </Label>
              )}
              {isFullMoon(state) && (
                <Label icon={fullMoon} type="vibrant">
                  {t("calendar.events.fullMoon.title")}
                </Label>
              )}
            </div>

            <Label
              icon={SUNNYSIDE.tools.fishing_rod}
              type={reelsLeft <= 0 ? "danger" : "default"}
            >
              {reelsLeft === 1
                ? t("fishing.oneReelLeft")
                : t("fishing.reelsLeft", { reelsLeft })}
            </Label>
          </div>
        </div>

        <div className="flex flex-wrap">
          {BAIT.map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              isSelected={bait === name}
              count={items[name]}
              onClick={() => {
                setBait(name);
                localStorage.setItem("lastSelectedBait", name);
              }}
              key={name}
            />
          ))}
        </div>
      </InnerPanel>
      <div>
        <InnerPanel className="my-1 relative">
          <div className="flex p-1">
            <div className="flex-shrink-0 h-10 w-10 mr-2 justify-items-center">
              <img src={ITEM_DETAILS[bait].image} className="h-10" />
            </div>
            <div>
              <p className="text-sm mb-1">{bait}</p>
              <p className="text-xs">{ITEM_DETAILS[bait].description}</p>
              {!items[bait] && bait !== "Fishing Lure" && (
                <Label className="mt-2" type="default">
                  {t("statements.craft.composter")}
                </Label>
              )}
              {!items[bait] && bait === "Fishing Lure" && (
                <Label className="mt-1" type="default">
                  {t("fishermanModal.craft.beach")}
                </Label>
              )}
            </div>
          </div>
          {!items[bait] && (
            <Label className="absolute -top-3 right-0" type={"danger"}>
              {t("fishermanModal.zero.available")}
            </Label>
          )}
        </InnerPanel>
      </div>
      <InnerPanel className="mb-1">
        {chum ? (
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <img src={ITEM_DETAILS[chum].image} className="h-5 mr-1" />
              <Label type="default">
                {t("fishermanModal.chum", {
                  count: CHUM_AMOUNTS[chum],
                  type: chum,
                })}
              </Label>
            </div>
            <img
              src={SUNNYSIDE.icons.cancel}
              className="h-5 pr-0.5 cursor-pointer"
              onClick={() => {
                setChum(undefined);
                localStorage.removeItem("lastSelectedChum");
              }}
            />
          </div>
        ) : (
          <div className="p-1 flex justify-between items-center flex-1 w-full">
            <div className="flex">
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="h-4 mr-2"
              />
              <p className="text-xs mb-1">{t("fishermanModal.attractFish")}</p>
            </div>
            <Button
              disabled={fishingLimitReached}
              className={`h-[30px] w-[40px]`}
              onClick={() => setShowChum(true)}
            >
              <div className="flex items-center">
                <img src={plus} className="w-8 mt-1" />
              </div>
            </Button>
          </div>
        )}
      </InnerPanel>

      {fishingLimitReached && (
        <Label className="mb-1" type="danger">
          {t("fishermanModal.fishingLimitReached")}
        </Label>
      )}

      {!fishingLimitReached && missingRod && (
        <Label className="mb-1 ml-1" type="danger">
          {t("fishermanModal.needCraftRod")}
        </Label>
      )}

      {fishingLimitReached ? (
        <Button disabled={!fishingLimitReached} onClick={onClickBuy}>
          <div className="flex items-center">
            {t("fishing.buyMoreReels")}
            <img src={ITEM_DETAILS.Gem.image} className="h-5" />
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => onCast(bait, chum)}
          disabled={
            fishingLimitReached ||
            missingRod ||
            !items[bait as InventoryItemName]?.gte(1)
          }
        >
          <div className="flex items-center">
            <span className="text-sm mr-1">{t("fishing.cast")}</span>
            <img src={SUNNYSIDE.tools.fishing_rod} className="h-5" />
          </div>
        </Button>
      )}
    </>
  );
};

const capitalizeFirstLetters = (inputString: string) => {
  return inputString.replace(/\b\w/g, (char) => char.toUpperCase());
};

interface Props {
  onCast: (bait: FishingBait, chum?: InventoryItemName) => void;
  onClose: () => void;
  npc?: NPCName;
}
const _state = (state: MachineState) => state.context.state;
export const FishermanModal: React.FC<Props> = ({
  onCast,
  onClose,
  npc = "reelin roy",
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const dailyFishingCount = getDailyFishingCount(state);

  const [showFishFrenzy, setShowFishFrenzy] = React.useState(
    isFishFrenzy(state) && dailyFishingCount === 0,
  );

  const [showFullMoon, setShowFullMoon] = React.useState(
    isFullMoon(state) && dailyFishingCount === 0,
  );

  const [tab, setTab] = useState(0);
  const gemPrice = getReelGemPrice({ state });
  const confirmBuyMoreReels = () => {
    setTab(0);
    gameService.send("fishing.reelsBought");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "FishingReels",
      type: "Fee",
    });
  };
  if (showIntro) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanmodal.greeting", {
                name: capitalizeFirstLetters(npc),
              }),
            },
            {
              text: t("fishermanModal.fishBenefits"),
            },
            {
              text: t("fishermanModal.baitAndResources"),
            },
          ]}
          onClose={() => {
            acknowledgeRead();
            setShowIntro(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  if (showFishFrenzy) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanModal.crazyHappening"),
            },
            {
              text: t("fishermanModal.bonusFish"),
            },
          ]}
          onClose={() => {
            setShowFishFrenzy(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  if (showFullMoon) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanModal.fullMoon"),
            },
          ]}
          onClose={() => {
            setShowFullMoon(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES[npc]}
      tabs={[
        { icon: SUNNYSIDE.tools.fishing_rod, name: t("fish") },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
        {
          icon: powerup,
          name: t("fishing.extras"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === 0 && (
        <BaitSelection
          onCast={onCast}
          onClickBuy={() => setTab(2)}
          state={state}
        />
      )}

      {tab === 1 && (
        <InnerPanel>
          <FishingGuide onClose={() => setTab(0)} />
        </InnerPanel>
      )}
      {tab === 2 && (
        <FishermanExtras
          state={state}
          confirmBuyMoreReels={confirmBuyMoreReels}
          gemPrice={gemPrice}
        />
      )}
    </CloseButtonPanel>
  );
};

interface BoostReelItem {
  location: string;
  buff: BuffLabel[];
}

const BoostReelItems: (
  state: GameState,
) => Partial<
  Record<BumpkinItem | CollectibleName | BumpkinRevampSkillName, BoostReelItem>
> = (state) => ({
  "Reelmaster's Chair": {
    buff: COLLECTIBLE_BUFF_LABELS["Reelmaster's Chair"]?.({
      skills: state.bumpkin.skills,
      collectibles: state.collectibles,
    }) as BuffLabel[],
    location: "Marketplace",
  },
  "Angler Waders": {
    buff: BUMPKIN_ITEM_BUFF_LABELS["Angler Waders"] as BuffLabel[],
    location: "Expert Angler Achievement",
  },
  "Fisherman's 5 Fold": {
    buff: [BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 5 Fold"].boosts.buff],
    location: "Fishing Skill Tree",
  },
  "Fisherman's 10 Fold": {
    buff: [BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 10 Fold"].boosts.buff],
    location: "Fishing Skill Tree",
  },
  "More With Less": {
    buff: Object.values(BUMPKIN_REVAMP_SKILL_TREE["More With Less"].boosts),
    location: "Fishing Skill Tree",
  },
  "Saw Fish": {
    buff: BUMPKIN_ITEM_BUFF_LABELS["Saw Fish"] as BuffLabel[],
    location: "Stella's Megastore",
  },
});

const isWearable = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinItem => {
  return getKeys(ITEM_IDS).includes(item as BumpkinItem);
};

const isSkill = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinRevampSkillName =>
  getKeys(BUMPKIN_REVAMP_SKILL_TREE).includes(item as BumpkinRevampSkillName);

const getItemImage = (item: BumpkinItem | CollectibleName): string => {
  if (!item) return "";

  if (isWearable(item)) {
    return getImageUrl(ITEM_IDS[item]);
  }

  return ITEM_DETAILS[item].image;
};

const getItemIcon = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): JSX.Element => {
  if (isSkill(item)) {
    const { tree, image, boosts, requirements, npc, power } =
      BUMPKIN_REVAMP_SKILL_TREE[item] as BumpkinSkillRevamp;
    const { tier } = requirements;
    const { boostedItemIcon, boostTypeIcon } = boosts.buff;
    return (
      <SkillBox
        className="mb-1"
        image={getSkillImage(image, boostedItemIcon, tree)}
        overlayIcon={
          <img
            src={SUNNYSIDE.icons.confirm}
            alt="claimed"
            className="relative object-contain"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        }
        tier={tier}
        npc={npc}
        secondaryImage={
          boosts.debuff
            ? tradeOffs
            : power
              ? SUNNYSIDE.icons.lightning
              : boostTypeIcon
        }
      />
    );
  } else {
    return (
      <div
        className={"bg-brown-600 relative"}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {isCollectible(item) && (
          <img
            src={SUNNYSIDE.ui.grey_background}
            className="w-full h-full absolute inset-0 rounded-md"
          />
        )}
        <SquareIcon icon={getItemImage(item)} width={INNER_CANVAS_WIDTH} />
      </div>
    );
  }
};

const FishermanExtras: React.FC<{
  state: GameState;
  confirmBuyMoreReels: () => void;
  gemPrice: number;
}> = ({ state, confirmBuyMoreReels, gemPrice }) => {
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const { inventory } = state;
  const canAfford = (inventory["Gem"] ?? new Decimal(0))?.gte(gemPrice);

  const reelsLeft = getRemainingReels(state);
  return (
    <>
      {!showConfirm && (
        <>
          <InnerPanel className="mb-1">
            <div className="flex items-center justify-between space-x-1 mb-1">
              <Label type="default">{t("fishing.extraReels")}</Label>
              <Label
                type={reelsLeft <= 0 ? "danger" : "default"}
                icon={SUNNYSIDE.tools.fishing_rod}
              >
                {reelsLeft === 1
                  ? t("fishing.oneReelLeft")
                  : t("fishing.reelsLeft", { reelsLeft })}
              </Label>
            </div>
            <span className="flex text-xs ml-1 my-2">
              {t("fishing.lookingMoreReels")}
            </span>
          </InnerPanel>
          <InnerPanel className="flex flex-col mb-1 overflow-y-scroll overflow-x-hidden scrollable max-h-[330px]">
            {Object.entries(BoostReelItems(state)).map(([name, item]) => (
              <div key={name} className="flex -ml-1">
                {getItemIcon(
                  name as
                    | BumpkinItem
                    | CollectibleName
                    | BumpkinRevampSkillName,
                )}
                <div className="flex flex-col justify-center space-y-1">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-xs">{name}</span>
                    <span className="text-xxs italic">{item.location}</span>
                  </div>
                  <div className="flex flex-col gap-1 mr-2">
                    {item.buff.map((buff, index) => (
                      <Label
                        key={index}
                        type={buff.labelType}
                        icon={buff.boostTypeIcon}
                        secondaryIcon={buff.boostedItemIcon}
                      >
                        {buff.shortDescription}
                      </Label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </InnerPanel>
          {reelsLeft > 0 && (
            <Label type="danger" className="m-1">
              {t("fishing.finishReels")}
            </Label>
          )}
          <Button
            disabled={!canAfford || reelsLeft > 0}
            onClick={
              canAfford || reelsLeft <= 0
                ? () => setShowConfirm(true)
                : undefined
            }
          >
            <div className="flex items-center space-x-1">
              <p>{t("fishing.buyReels", { gemPrice })}</p>
              <img src={ITEM_DETAILS.Gem.image} className="w-4" />
            </div>
          </Button>
        </>
      )}
      {showConfirm && (
        <InnerPanel>
          <div className="flex flex-col p-2 pb-0 items-center">
            <span className="text-sm text-start w-full mb-1">
              {t("fishing.buyReels.confirmation", { gemPrice })}
            </span>
          </div>
          <div className="flex justify-content-around mt-2 space-x-1">
            <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
            <Button onClick={confirmBuyMoreReels}>{t("confirm")}</Button>
          </div>
        </InnerPanel>
      )}
    </>
  );
};
