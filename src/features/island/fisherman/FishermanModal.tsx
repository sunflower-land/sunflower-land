import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import lightning from "assets/icons/lightning.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import {
  CHUM_AMOUNTS,
  FISH,
  FishingBait,
  getTide,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";

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
      <p className="mb-1 p-1 text-sm">What resource would you like to chum?</p>

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
        <>
          <div className="flex items-center p-1 relative">
            <span className="text-sm mr-1">{`${CHUM_AMOUNTS[selected]}`}</span>
            <img src={ITEM_DETAILS[selected].image} className="h-6 mr-1" />
            <span className="text-sm mr-1">are needed to chum.</span>
          </div>
          {!hasRequirements && (
            <Label
              type="danger"
              className="mb-1"
            >{`You need more ${selected}`}</Label>
          )}
        </>
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

const BAIT: FishingBait[] = ["Earthworm", "Grub", "Red Wiggler"];

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

  const missingRod = !state.inventory["Rod"] || state.inventory.Rod.lt(1);

  const catches = getKeys(FISH).filter((name) =>
    FISH[name].baits.includes(bait)
  );

  const tide = getTide();
  const weather = state.fishing.weather;

  return (
    <>
      <div className="p-2">
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
              <span className="text-sm">{bait}</span>
              <div className="flex flex-wrap mb-1 mt-1">
                {catches.map((name) => (
                  <img
                    src={ITEM_DETAILS[name].image}
                    className="h-5 mr-1"
                    key={name}
                  />
                ))}
                <img
                  src={SUNNYSIDE.icons.expression_confused}
                  className="h-5 mr-1"
                />
              </div>
            </div>
          </div>
          {!state.inventory[bait] ? (
            <Label className="absolute -top-3 right-0" type={"danger"}>
              0 available
            </Label>
          ) : (
            <Label className="absolute -top-3 right-0" type={"default"}>
              {`${state.inventory[bait]?.toNumber()} available`}
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
            className={`h-[30px] w-[40px]`}
            onClick={() => setShowChum(true)}
          >
            <div className="flex items-center">
              <img src={plus} className="w-8 mt-1" />
            </div>
          </Button>
        </div>
      )}

      {missingRod && (
        <Label className="mb-1" type="danger">
          You must first craft a rod
        </Label>
      )}

      <Button
        onClick={() => onCast(bait, chum)}
        disabled={
          missingRod || !state.inventory[bait as InventoryItemName]?.gte(1)
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

export const FishermanModal: React.FC<Props> = ({ onCast, onClose }) => {
  const [showIntro, setShowIntro] = React.useState(!hasRead());
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
              text: "Howdy, I'm Reelin Roy!",
            },
            {
              text: "Here you can fish.",
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

      {tab === 1 && <FishingGuide />}
    </CloseButtonPanel>
  );
};
