import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useActor } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import plus from "assets/icons/plus.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { getKeys } from "features/game/types/craftables";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `fisherman-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

export const CHUM_AMOUNTS: Partial<Record<InventoryItemName, number>> = {
  Gold: 1,
  Iron: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Pumpkin: 20,
  Cabbage: 10,
  Carrot: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Radish: 5,
  Eggplant: 5,
  Parsnip: 5,
  Wheat: 5,
  Kale: 5,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
};

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

// TODO real types
type BaitName = "Earth Worm" | "Red Wiggler" | "Grub" | "Lure";
type Bait = { catches: InventoryItemName[] };

const BAIT: Record<BaitName, Bait> = {
  "Earth Worm": {
    catches: ["Starfish", "Starfish", "Starfish"],
  },
  "Red Wiggler": {
    catches: [
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
    ],
  },
  Grub: {
    catches: ["Starfish", "Starfish", "Starfish"],
  },
  Lure: {
    catches: [
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
      "Starfish",
    ],
  },
};
const BaitSelection: React.FC<{ onCast: () => void }> = ({ onCast }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [showChum, setShowChum] = useState(false);
  const [chum, setChum] = useState<InventoryItemName | undefined>();
  const [bait, setBait] = useState<BaitName>("Earth Worm");

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

  const missingRod = !state.inventory["Fishing Rod" as InventoryItemName];

  return (
    <>
      <div className="p-2">
        <div className="flex items-center">
          <Label type="default" className="mr-2">
            Dusk Tide
          </Label>
          <Label type="vibrant">Fish Frenzy</Label>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap">
          {getKeys(BAIT).map((name) => (
            <Box
              image={SUNNYSIDE.icons.expression_confused}
              isSelected={bait === name}
              count={new Decimal(0)}
              onClick={() => setBait(name)}
              key={name}
            />
          ))}
        </div>
        <OuterPanel className="my-1 relative">
          <div className="flex p-1">
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-10 mr-2"
            />
            <div>
              <span className="text-sm">{bait}</span>
              <div className="flex flex-wrap mb-1">
                {BAIT[bait].catches.map((name) => (
                  <img
                    src={SUNNYSIDE.icons.expression_confused}
                    className="h-4 mr-1"
                    key={name}
                  />
                ))}
              </div>
            </div>
          </div>
          <Label className="absolute -top-3 right-0" type={"danger"}>
            0 available
          </Label>
        </OuterPanel>
      </div>
      {chum ? (
        <div className="flex item-center justify-between mb-1">
          <div className="flex items-center">
            <Label type="default">{`Chum - ${CHUM_AMOUNTS[chum]} ${chum}`}</Label>
            <img
              src={ITEM_DETAILS[chum].image}
              className="h-5 ml-1"
              onClick={() => setChum(undefined)}
            />
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
        onClick={onCast}
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
  onCast: () => void;
}

export const FishermanModal: React.FC<Props> = ({ onCast }) => {
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  if (showIntro) {
    return (
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
    );
  }

  return <BaitSelection onCast={onCast} />;
};
