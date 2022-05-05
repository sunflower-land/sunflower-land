/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/Modal";

import close from "assets/icons/close.png";

import sunflowerRock from "assets/nfts/sunflower_rock.png";
import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import sunflowerStatue from "assets/nfts/sunflower_statue.png";
import potatoStatue from "assets/nfts/potato_statue.png";
import christmasTree from "assets/nfts/christmas_tree.png";
import dog from "assets/nfts/farm_dog.gif";
import cat from "assets/nfts/farm_cat.gif";
import gnome from "assets/nfts/gnome.gif";
import nancy from "assets/nfts/nancy.png";
import scarecrow from "assets/nfts/scarecrow.png";
import kuebiko from "assets/nfts/kuebiko.gif";
import goblinKing from "assets/nfts/goblin_king.png";
import fountain from "assets/nfts/fountain.gif";

import nyonStatue from "assets/nfts/nyon_statue.png";
import homelessTent from "assets/nfts/homeless_tent.png";
import farmerBath from "assets/nfts/farmer_bath.png";
import swimmer from "assets/npcs/swimmer.gif";

import beaver from "assets/nfts/beaver.gif";
import apprentice from "assets/nfts/apprentice_beaver.gif";
import foreman from "assets/nfts/construction_beaver.gif";

import easterBunny from "assets/nfts/easter/easter_bunny_eggs.gif";

import { GRID_WIDTH_PX } from "../lib/constants";
import { Context } from "../GameProvider";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flags } from "./Flags";
import { Inventory } from "../types/game";
import { Panel } from "components/ui/Panel";
import { fountainAudio } from "lib/utils/sfx";
import { Sign } from "./Sign";

// Only show 1 scarecrow at a time
export const Scarecrows: React.FC<{ inventory: Inventory }> = ({
  inventory,
}) => {
  if (inventory.Kuebiko) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
        }}
        src={kuebiko}
        alt="Scarecrow"
      />
    );
  }

  if (inventory.Scarecrow) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.3}px`,
        }}
        src={scarecrow}
        alt="Scarecrow"
      />
    );
  }

  if (inventory.Nancy) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={nancy}
        alt="Scarecrow"
      />
    );
  }

  return null;
};

export const Beavers: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  if (inventory["Foreman Beaver"]) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={foreman}
        alt="Foreman Beaver"
      />
    );
  }

  if (inventory["Apprentice Beaver"]) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={apprentice}
        alt="Apprentice Beaver"
      />
    );
  }

  if (inventory["Woody the Beaver"]) {
    return (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.2}px`,
        }}
        src={beaver}
        alt="Woddy the Beaver"
      />
    );
  }

  return null;
};

// Only show 1 Nyon statue at a time
export const NyonStatue: React.FC = () => {
  const [showNyonLore, setShowNyonLore] = useState(false);

  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.8}px`,
        }}
        className="hover:img-highlight cursor-pointer"
        src={nyonStatue}
        alt="Nyon Statue"
        onClick={() => setShowNyonLore(true)}
      />
      <Modal centered show={showNyonLore} onHide={() => setShowNyonLore(false)}>
        <Panel>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            onClick={() => setShowNyonLore(false)}
          />
          <div className="flex flex-col items-cetner justify-content-between">
            <div className="flex justify-content m-2">
              <img
                style={{
                  width: `${GRID_WIDTH_PX * 1.5}px`,
                }}
                className="img-highlight mr-2"
                src={nyonStatue}
                alt="Nyon Statue"
              />
              <div className="ml-2 mt-3">
                <span className="text-shadow text-xs block">In memory of</span>
                <span className="text-shadow block">Nyon Lann</span>
              </div>
            </div>
            <div className="flex-1 ml-2 mr-2">
              <span className="text-shadow block mb-2 text-xs">
                The legendary knight responsible for clearing the goblins from
                the mines. Shortly after his victory he died by poisoning from a
                Goblin conspirator. The Sunflower Citizens erected this statue
                with his armor to commemorate his conquests.
              </span>
            </div>
          </div>
        </Panel>
      </Modal>
    </>
  );
};

export const Decorations: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <>
      <Flags />
      {state.inventory["Sunflower Rock"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 4}px`,
            right: `${GRID_WIDTH_PX * 11.5}px`,
            top: `${GRID_WIDTH_PX * 22}px`,
          }}
          id={Section["Sunflower Rock"]}
          className="absolute"
          src={sunflowerRock}
          alt="Sunflower rock"
        />
      )}

      {state.inventory["Christmas Tree"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            right: `${GRID_WIDTH_PX * 16}px`,
            top: `${GRID_WIDTH_PX * 1}px`,
          }}
          id={Section["Christmas Tree"]}
          className="absolute"
          src={christmasTree}
          alt="Christmas Tree"
        />
      )}

      {state.inventory["Sunflower Statue"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            left: `${GRID_WIDTH_PX * 45.5}px`,
            top: `${GRID_WIDTH_PX * 32}px`,
          }}
          id={Section["Sunflower Statue"]}
          className="absolute"
          src={sunflowerStatue}
          alt="Sunflower Statue"
        />
      )}

      {state.inventory["Potato Statue"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * 52}px`,
            top: `${GRID_WIDTH_PX * 39}px`,
          }}
          id={Section["Potato Statue"]}
          className="absolute"
          src={potatoStatue}
          alt="Potato Statue"
        />
      )}

      {state.inventory["Sunflower Tombstone"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            left: `${GRID_WIDTH_PX * 30}px`,
            top: `${GRID_WIDTH_PX * 36.8}px`,
          }}
          id={Section["Sunflower Tombstone"]}
          className="absolute"
          src={sunflowerTombstone}
          alt="Sunflower tombstone"
        />
      )}

      {state.inventory["Farm Cat"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.5}px`,
            right: `${GRID_WIDTH_PX * 39.55}px`,
            top: `${GRID_WIDTH_PX * 28.2}px`,
          }}
          id={Section["Farm Cat"]}
          className="absolute z-10"
          src={cat}
          alt="Farm cat"
        />
      )}

      {state.inventory["Farm Dog"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            right: `${GRID_WIDTH_PX * 37.8}px`,
            top: `${GRID_WIDTH_PX * 32}px`,
          }}
          id={Section["Farm Dog"]}
          className="absolute"
          src={dog}
          alt="Farm dog"
        />
      )}

      {state.inventory["Gnome"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            right: "481px",
            top: "441px",
          }}
          id={Section.Gnome}
          className="absolute"
          src={gnome}
          alt="Gnome"
        />
      )}
      {/* Scarecrows */}
      <div
        className="flex justify-center absolute"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 38}px`,
          top: `${GRID_WIDTH_PX * 34}px`,
        }}
        id={Section.Scarecrow}
      >
        <Scarecrows inventory={state.inventory} />
      </div>

      {state.inventory["Nyon Statue"] && (
        <div
          className="flex justify-center absolute"
          style={{
            width: `${GRID_WIDTH_PX * 3}px`,
            left: `${GRID_WIDTH_PX * 42.5}px`,
            top: `${GRID_WIDTH_PX * 41}px`,
          }}
          id={Section["Nyon Statue"]}
        >
          <NyonStatue />
        </div>
      )}

      {state.inventory["Fountain"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2.5}px`,
            left: `${GRID_WIDTH_PX * 35}px`,
            top: `${GRID_WIDTH_PX * 28}px`,
          }}
          id={Section.Fountain}
          onClick={() => fountainAudio.play()}
          className="absolute hover:img-highlight cursor-pointer"
          src={fountain}
          alt="Fountain"
        />
      )}

      {state.inventory["Goblin Crown"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 3}px`,
            right: `${GRID_WIDTH_PX * 27.5}px`,
            bottom: `${GRID_WIDTH_PX * 5.5}px`,
          }}
          id={Section["Goblin Crown"]}
          className="absolute"
          src={goblinKing}
          alt="GoblinKing"
        />
      )}

      {/* Beavers */}
      <div
        className="flex justify-center absolute"
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          right: `${GRID_WIDTH_PX * 24}px`,
          top: `${GRID_WIDTH_PX * 49}px`,
        }}
        id={Section.Beaver}
      >
        <Beavers inventory={state.inventory} />
      </div>

      {state.inventory["Homeless Tent"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            right: `${GRID_WIDTH_PX * 34.5}px`,
            top: `${GRID_WIDTH_PX * 31}px`,
          }}
          id={Section.Tent}
          className="absolute"
          src={homelessTent}
          alt="Homeless Tent"
        />
      )}

      <Sign id={state.id as number} inventory={state.inventory} />

      {state.inventory["Farmer Bath"] && (
        <div
          className="flex justify-center absolute"
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            left: `${GRID_WIDTH_PX * 48.8}px`,
            top: `${GRID_WIDTH_PX * 39}px`,
          }}
          id={Section.Bath}
        >
          <img src={farmerBath} className="w-full" />
          <img
            src={swimmer}
            style={{
              position: "absolute",
              width: `${GRID_WIDTH_PX * 0.85}px`,
              top: `${GRID_WIDTH_PX * 0.5}px`,
              left: `${GRID_WIDTH_PX * 0.5}px`,
            }}
          />
        </div>
      )}

      {state.inventory["Easter Bunny"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2.5}px`,
            right: `${GRID_WIDTH_PX * 49}px`,
            top: `${GRID_WIDTH_PX * 24}px`,
          }}
          id={Section["Easter Bunny"]}
          className="absolute"
          src={easterBunny}
          alt="Easter Bunny"
        />
      )}
    </>
  );
};
