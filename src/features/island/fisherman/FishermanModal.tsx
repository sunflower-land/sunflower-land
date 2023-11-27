import React, { useContext, useState } from "react";
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
import {
  Bumpkin,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import {
  CHUM_AMOUNTS,
  CHUM_DETAILS,
  FISH,
  FishingBait,
  getTide,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import {
  getDailyFishingCount,
  getDailyFishingLimit,
} from "features/game/types/fishing";
import { MachineState } from "features/game/lib/gameMachine";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `fisherman-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

const ChumSelection: React.FC<{
  inventory: Inventory;
  onList: (item: InventoryItemName) => void;
  onCancel: () => void;
  initial?: InventoryItemName;
}> = ({ inventory, onList, onCancel, initial }) => {
  const [selected, setSelected] = useState<InventoryItemName | undefined>(
    initial
  );
  const select = (name: InventoryItemName) => {
    setSelected(name);
  };

  const hasRequirements =
    selected && inventory[selected]?.gte(CHUM_AMOUNTS[selected] ?? 0);

  return (
    <div>
      <p className="mb-1 p-1 text-xs">Select your resource:</p>

      <div className="flex flex-wrap">
        {getKeys(CHUM_AMOUNTS)
          .filter((name) => !!inventory[name]?.gte(1))
          .map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
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
            >{`${CHUM_AMOUNTS[selected]} ${selected} required`}</Label>
          </div>
          <p className="text-xs">{CHUM_DETAILS[selected]}</p>
        </div>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          disabled={!hasRequirements}
          onClick={() => onList(selected as InventoryItemName)}
        >
          Confirm
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
  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<InventoryItemName | undefined>();
  const [bait, setBait] = useState<FishingBait>("Earthworm");

  if (showChum) {
    return (
      <ChumSelection
        inventory={state.inventory}
        onCancel={() => setShowChum(false)}
        initial={chum}
        onList={(selected) => {
          setChum(selected);
          setShowChum(false);
        }}
      />
    );
  }

  const dailyFishingMax = getDailyFishingLimit(state.bumpkin as Bumpkin);
  const dailyFishingCount = getDailyFishingCount(state);
  const fishingLimitReached = dailyFishingCount >= dailyFishingMax;
  const missingRod =
    state.bumpkin?.equipped?.tool !== "Ancient Rod" &&
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
                Dusktide
              </Label>
            ) : (
              <Label
                icon={SUNNYSIDE.icons.stopwatch}
                type="default"
                className="mr-2"
              >
                Dawnlight
              </Label>
            )}

            {weather === "Fish Frenzy" || weather === "Full Moon" ? (
              <Label icon={lightning} type="vibrant">
                {weather}
              </Label>
            ) : null}
          </div>

          <Label icon={SUNNYSIDE.tools.fishing_rod} type="default">
            Daily Limit: {dailyFishingCount}/{dailyFishingMax}
          </Label>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap">
          {BAIT.map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              isSelected={bait === name}
              count={state.inventory[name]}
              onClick={() => setBait(name)}
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
              {!state.inventory[bait] && bait !== "Fishing Lure" && (
                <Label className="mt-1" type="default">
                  Craft at Composter
                </Label>
              )}
              {!state.inventory[bait] && bait === "Fishing Lure" && (
                <Label className="mt-1" type="default">
                  Craft at Beach
                </Label>
              )}
            </div>
          </div>
          {!state.inventory[bait] && (
            <Label className="absolute -top-3 right-0" type={"danger"}>
              0 available
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
            onClick={() => setChum(undefined)}
          />
        </div>
      ) : (
        <div className="my-1 p-1 flex justify-between items-start flex-1 w-full">
          <div className="flex">
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-4 mr-1"
            />
            <p className="text-xs mb-1">
              Attract fish by throwing chum into the water.
            </p>
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
          You have reached your daily fishing limit of {dailyFishingMax}.
        </Label>
      )}

      {!fishingLimitReached && missingRod && (
        <Label className="mb-1" type="danger">
          You must first craft a rod.
        </Label>
      )}

      <Button
        onClick={() => onCast(bait, chum)}
        disabled={
          fishingLimitReached ||
          missingRod ||
          !state.inventory[bait as InventoryItemName]?.gte(1)
        }
      >
        <div className="flex items-center">
          <span className="text-sm mr-1">Cast</span>
          <img src={SUNNYSIDE.tools.fishing_rod} className="h-5" />
        </div>
      </Button>
    </>
  );
};

interface Props {
  onCast: (bait: FishingBait, chum?: InventoryItemName) => void;
  onClose: () => void;
}

const currentWeather = (state: MachineState) =>
  state.context.state.fishing.weather;

export const FishermanModal: React.FC<Props> = ({ onCast, onClose }) => {
  const { gameService } = useContext(Context);
  const weather = useSelector(gameService, currentWeather);

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
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["reelin roy"]}
      >
        <SpeakingText
          message={[
            {
              text: "Ahoy, fellow islanders! I'm Reelin' Roy, your trusty island fisherman, and I've set my sights on a grand challenge – collecting every fish under the sun!",
            },
            {
              text: "Fish are great for eating, delivering and claiming rewards!",
            },
            {
              text: "Bring me bait and resources and we'll reel in the rarest prizes that the ocean has to offer!",
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
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES["reelin roy"]}
      >
        <SpeakingText
          message={[
            {
              text: "Wow, something crazy is happening......It is a fish frenzy!",
            },
            {
              text: "Hurry, you will get a bonus fish for each catch!",
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
      bumpkinParts={NPC_WEARABLES["reelin roy"]}
      tabs={[
        { icon: SUNNYSIDE.tools.fishing_rod, name: "Fish" },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: "Guide",
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
