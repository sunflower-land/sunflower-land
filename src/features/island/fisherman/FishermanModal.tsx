import React, { useContext, useEffect, useState } from "react";
import { useActor, useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import {
  CHUM_AMOUNTS,
  CHUM_DETAILS,
  Chum,
  FISH,
  FishingBait,
  getTide,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import {
  getDailyFishingCount,
  getDailyFishingLimit,
} from "features/game/types/fishing";
import { MachineState } from "features/game/lib/gameMachine";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";

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
      <p className="mb-1 p-1 text-xs">
        {t("select.resource")}
        {":"}{" "}
      </p>

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
}> = ({ onCast }) => {
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
        CHUM_AMOUNTS[lastSelectedChum as Chum] ?? 0
      );

    if (hasRequirements) {
      setChum(lastSelectedChum as Chum);
    }
  }, []);

  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<Chum | undefined>();
  const [bait, setBait] = useState<FishingBait>("Earthworm");

  const { t } = useAppTranslation();

  if (showChum) {
    return (
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
    );
  }

  const dailyFishingMax = getDailyFishingLimit(state);
  const dailyFishingCount = getDailyFishingCount(state);
  const fishingLimitReached = dailyFishingCount >= dailyFishingMax;
  const missingRod =
    !isWearableActive({ name: "Ancient Rod", game: state }) &&
    (!state.inventory["Rod"] || state.inventory.Rod.lt(1));

  const catches = getKeys(FISH).filter((name) =>
    FISH[name].baits.includes(bait)
  );

  const tide = getTide();
  const weather = state.fishing.weather;

  return (
    <>
      <div className="p-2">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            {tide === "Dusktide" ? (
              <Label
                icon={SUNNYSIDE.icons.stopwatch}
                type="formula"
                className="mr-2"
              >
                {"Dusktide"}
              </Label>
            ) : (
              <Label
                icon={SUNNYSIDE.icons.stopwatch}
                type="default"
                className="mr-2"
              >
                {"Dawnlight"}
              </Label>
            )}

            {weather === "Fish Frenzy" || weather === "Full Moon" ? (
              <Label icon={lightning} type="vibrant">
                {weather}
              </Label>
            ) : null}
          </div>

          <Label icon={SUNNYSIDE.tools.fishing_rod} type="default">
            {t("statements.daily.limit")}
            {":"} {dailyFishingCount}
            {"/"}
            {dailyFishingMax}
          </Label>
        </div>
      </div>
      <div>
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
        <OuterPanel className="my-1 relative">
          <div className="flex p-1">
            <img src={ITEM_DETAILS[bait].image} className="h-10 mr-2" />
            <div>
              <p className="text-sm">{bait}</p>
              <p className="text-xs">{ITEM_DETAILS[bait].description}</p>
              {!items[bait] && bait !== "Fishing Lure" && (
                <Label className="mt-1" type="default">
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
        </OuterPanel>
      </div>
      {chum ? (
        <div className="flex item-center justify-between mb-1">
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
        <div className="my-1 p-1 flex justify-between items-start flex-1 w-full">
          <div className="flex">
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-4 mr-1"
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

      {fishingLimitReached && (
        <Label className="mb-1" type="danger">
          {t("fishermanModal.dailyLimitReached")} {dailyFishingMax}
        </Label>
      )}

      {!fishingLimitReached && missingRod && (
        <Label className="mb-1" type="danger">
          {t("fishermanModal.needCraftRod")}
        </Label>
      )}

      <Button
        onClick={() => onCast(bait, chum)}
        disabled={
          fishingLimitReached ||
          missingRod ||
          !items[bait as InventoryItemName]?.gte(1)
        }
      >
        <div className="flex items-center">
          <span className="text-sm mr-1">{"Cast"}</span>
          <img src={SUNNYSIDE.tools.fishing_rod} className="h-5" />
        </div>
      </Button>
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
    weather === "Fish Frenzy" && dailyFishingCount === 0
  );

  const [tab, setTab] = useState(0);
  if (showIntro) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: `${t(
                "fishermanmodal.greetingPart1"
              )} ${capitalizeFirstLetters(npc)} ${t(
                "fishermanmodal.greetingPart2"
              )}`,
            },
            {
              text: translate("fishermanModal.fishBenefits"),
            },
            {
              text: translate("fishermanModal.baitAndResources"),
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
              text: translate("fishermanModal.crazyHappening"),
            },
            {
              text: translate("fishermanModal.bonusFish"),
            },
          ]}
          onClose={() => {
            setShowFishFrenzy(false);
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
        { icon: SUNNYSIDE.tools.fishing_rod, name: "Fish" },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <BaitSelection onCast={onCast} />}

      {tab === 1 && <FishingGuide onClose={() => setTab(0)} />}
    </CloseButtonPanel>
  );
};
