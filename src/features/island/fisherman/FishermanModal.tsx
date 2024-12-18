import React, { useContext, useEffect, useState } from "react";
import { useActor, useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import fullMoon from "assets/icons/full_moon.png";
import powerup from "assets/icons/level_up.png";
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
  getTide,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import { getDailyFishingCount } from "features/game/types/fishing";
import { MachineState } from "features/game/lib/gameMachine";
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
import { gameAnalytics } from "lib/gameAnalytics";
import { getRemainingReels } from "features/game/events/landExpansion/castRod";
import { BuffLabel } from "features/game/types";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getReelGemPrice } from "features/game/events/landExpansion/buyMoreReels";
import {
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
} from "features/game/types/bumpkinSkills";
import { getImageUrl } from "lib/utils/getImageURLS";
import { hasFeatureAccess } from "lib/flags";

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
  initial?: Chum;
}> = ({ state, bait, onList, onCancel, initial }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Chum | undefined>(initial);
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
}> = ({ onCast, onClickBuy }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

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
          initial={chum}
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

  const tide = getTide();
  const { weather } = state.fishing;

  return (
    <>
      <InnerPanel>
        <div className="p-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-1">
              {tide === "Dusktide" ? (
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="formula"
                  className="mr-2"
                >
                  {t("fishing.dusktide")}
                </Label>
              ) : (
                <Label
                  icon={SUNNYSIDE.icons.stopwatch}
                  type="default"
                  className="mr-2"
                >
                  {t("fishing.dawnlight")}
                </Label>
              )}

              {weather === "Fish Frenzy" && (
                <Label icon={lightning} type="vibrant">
                  {weather}
                </Label>
              )}
              {weather === "Full Moon" && (
                <Label icon={fullMoon} type="vibrant">
                  {weather}
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
            <img src={ITEM_DETAILS[bait].image} className="h-10 mr-2" />
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
              <Label type="default">{`Chum - ${CHUM_AMOUNTS[chum]} ${chum}`}</Label>
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
        <Label className="mb-1" type="danger">
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

const currentWeather = (state: MachineState) =>
  state.context.state.fishing.weather;

export const FishermanModal: React.FC<Props> = ({
  onCast,
  onClose,
  npc = "reelin roy",
}) => {
  const { gameService } = useContext(Context);
  const weather = useSelector(gameService, currentWeather);
  const { t } = useAppTranslation();
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const dailyFishingCount = getDailyFishingCount(state);

  const [showFishFrenzy, setShowFishFrenzy] = React.useState(
    weather === "Fish Frenzy" && dailyFishingCount === 0,
  );

  const [showFullMoon, setShowFullMoon] = React.useState(
    weather === "Full Moon" && dailyFishingCount === 0,
  );

  const [tab, setTab] = useState(0);
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
        <BaitSelection onCast={onCast} onClickBuy={() => setTab(2)} />
      )}

      {tab === 1 && (
        <InnerPanel>
          <FishingGuide onClose={() => setTab(0)} />
        </InnerPanel>
      )}
      {tab === 2 && (
        <InnerPanel>
          <FishermanExtras onBuy={() => setTab(0)} />
        </InnerPanel>
      )}
    </CloseButtonPanel>
  );
};

const BoostReelItems: Partial<
  Record<
    BumpkinItem | CollectibleName | BumpkinRevampSkillName,
    BuffLabel & { location: string }
  >
> = {
  "Angler Waders": {
    ...(BUMPKIN_ITEM_BUFF_LABELS["Angler Waders"] as BuffLabel),
    location: "Expert Angler Achievement",
  },
  "Fisherman's 2 Fold": {
    ...BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 2 Fold"].boosts.buff,
    location: "Fishing Skill Tree",
  },
  "Fisherman's 5 Fold": {
    ...BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 5 Fold"].boosts.buff,
    location: "Fishing Skill Tree",
  },
  "More With Less": {
    ...BUMPKIN_REVAMP_SKILL_TREE["More With Less"].boosts.buff,
    location: "Fishing Skill Tree",
  },
};

const isWearable = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinItem => {
  return getKeys(ITEM_IDS).includes(item as BumpkinItem);
};

const isSkill = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): item is BumpkinRevampSkillName =>
  getKeys(BUMPKIN_REVAMP_SKILL_TREE).includes(item as BumpkinRevampSkillName);

export const getItemImage = (
  item: BumpkinItem | CollectibleName | BumpkinRevampSkillName,
): string => {
  if (!item) return "";

  if (isWearable(item)) {
    return getImageUrl(ITEM_IDS[item]);
  }

  if (isSkill(item)) {
    return BUMPKIN_REVAMP_SKILL_TREE[item].image;
  }

  return ITEM_DETAILS[item].image;
};

const FishermanExtras: React.FC<{ onBuy: () => void }> = ({ onBuy }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const { inventory } = state;
  const gemPrice = getReelGemPrice({ state });
  const canAfford = (inventory["Gem"] ?? new Decimal(0))?.gte(gemPrice);
  const confirmBuyMoreReels = () => {
    onBuy();
    gameService.send("fishing.reelsBought");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "FishingReels",
      type: "Fee",
    });
  };

  const reelsLeft = getRemainingReels(state);
  return (
    <>
      {!showConfirm && (
        <>
          <div className="p-1">
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
            <span className="text-xs my-2">
              {t("fishing.lookingMoreReels")}
            </span>
            <div className="flex flex-col my-2 space-y-1">
              {Object.entries(BoostReelItems)
                .filter(
                  ([name]) =>
                    !isSkill(
                      name as
                        | BumpkinItem
                        | CollectibleName
                        | BumpkinRevampSkillName,
                    ) || hasFeatureAccess(state, "SKILLS_REVAMP"),
                )
                .map(([name, item]) => (
                  <div key={name} className="flex space-x-2">
                    <div
                      className="bg-brown-600 cursor-pointer relative"
                      style={{
                        ...pixelDarkBorderStyle,
                      }}
                    >
                      <SquareIcon
                        icon={getItemImage(
                          name as
                            | BumpkinItem
                            | CollectibleName
                            | BumpkinRevampSkillName,
                        )}
                        width={20}
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-1">
                      <div className="flex flex-col space-y-0.5">
                        <span className="text-xs">{name}</span>
                        <span className="text-xxs italic">{item.location}</span>
                      </div>
                      <Label
                        type={item.labelType}
                        icon={item.boostTypeIcon}
                        secondaryIcon={item.boostedItemIcon}
                      >
                        {item.shortDescription}
                      </Label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
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
        <>
          <div className="flex flex-col p-2 pb-0 items-center">
            <span className="text-sm text-start w-full mb-1">
              {t("fishing.buyReels.confirmation", { gemPrice })}
            </span>
          </div>
          <div className="flex justify-content-around mt-2 space-x-1">
            <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
            <Button onClick={confirmBuyMoreReels}>{t("confirm")}</Button>
          </div>
        </>
      )}
    </>
  );
};
