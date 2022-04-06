/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import sunflowerRock from "assets/nfts/sunflower_rock.png";
import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import sunflowerStatue from "assets/nfts/sunflower_statue.png";
import potatoStatue from "assets/nfts/potato_statue.png";
import christmasTree from "assets/nfts/christmas_tree.png";
import dog from "assets/nfts/farm_dog.png";
import cat from "assets/nfts/farm_cat.png";
import gnome from "assets/nfts/gnome.gif";
import nancy from "assets/nfts/nancy.png";
import scarecrow from "assets/nfts/scarecrow.png";
import kuebiko from "assets/nfts/kuebiko.gif";
import goblinKing from "assets/nfts/goblin_king.png";
import fountain from "assets/nfts/fountain.gif";
import beaver from "assets/nfts/beaver.png";
import apprentice from "assets/nfts/apprentice_beaver.png";
import foreman from "assets/nfts/construction_beaver.png";

import { GRID_WIDTH_PX } from "../lib/constants";
import { Context } from "../GameProvider";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flags } from "./Flags";
import { Inventory } from "../types/game";

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

export const Decorations: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);
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
            width: `${GRID_WIDTH_PX * 1}px`,
            right: `${GRID_WIDTH_PX * 39.78}px`,
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

      {state.inventory["Fountain"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            left: `${GRID_WIDTH_PX * 36}px`,
            top: `${GRID_WIDTH_PX * 30}px`,
          }}
          id={Section.Fountain}
          className="absolute"
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

      {state.inventory["Woody the Beaver"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
            right: `${GRID_WIDTH_PX * 24}px`,
            top: `${GRID_WIDTH_PX * 49}px`,
          }}
          id={Section["Beaver"]}
          className="absolute"
          src={beaver}
          alt="Beaver"
        />
      )}

      {state.inventory["Apprentice Beaver"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
            right: `${GRID_WIDTH_PX * 24}px`,
            top: `${GRID_WIDTH_PX * 49}px`,
          }}
          id={Section["Beaver"]}
          className="absolute"
          src={apprentice}
          alt="Beaver"
        />
      )}

      {state.inventory["Foreman Beaver"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 0.8}px`,
            right: `${GRID_WIDTH_PX * 24}px`,
            top: `${GRID_WIDTH_PX * 49}px`,
          }}
          id={Section["Beaver"]}
          className="absolute"
          src={foreman}
          alt="Beaver"
        />
      )}
    </>
  );
};
