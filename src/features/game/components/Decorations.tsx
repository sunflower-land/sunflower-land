/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import sunflowerRock from "assets/nfts/sunflower_rock.png";
import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import sunflowerStatue from "assets/nfts/sunflower_statue.png";
import potatoStatue from "assets/nfts/potato_statue.png";
import dog from "assets/nfts/farm_dog.png";
import cat from "assets/nfts/farm_cat.png";
import gnome from "assets/nfts/gnome.png";
import scarecrow from "assets/nfts/scarecrow.png";

import { GRID_WIDTH_PX } from "../lib/constants";
import { Context } from "../GameProvider";

export const Decorations: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <>
      {state.inventory["Sunflower Rock"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 4}px`,
            right: `${GRID_WIDTH_PX * 29}px`,
            top: `${GRID_WIDTH_PX * 27.5}px`,
          }}
          className="absolute"
          src={sunflowerRock}
          alt="Sunflower rock"
        />
      )}

      {state.inventory["Sunflower Statue"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            left: `${GRID_WIDTH_PX * 45.5}px`,
            top: `${GRID_WIDTH_PX * 32}px`,
          }}
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
          className="absolute"
          src={potatoStatue}
          alt="Potato Statue"
        />
      )}

      {state.inventory["Sunflower Tombstone"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            left: `${GRID_WIDTH_PX * 29}px`,
            top: `${GRID_WIDTH_PX * 36.8}px`,
          }}
          className="absolute"
          src={sunflowerTombstone}
          alt="Sunflower tombstone"
        />
      )}

      {state.inventory["Farm Cat"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 0.7}px`,
            right: `${GRID_WIDTH_PX * 39.74}px`,
            top: `${GRID_WIDTH_PX * 28}px`,
          }}
          className="absolute"
          src={cat}
          alt="Farm cat"
        />
      )}

      {state.inventory["Farm Dog"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 0.7}px`,
            right: `${GRID_WIDTH_PX * 37.8}px`,
            top: `${GRID_WIDTH_PX * 32}px`,
          }}
          className="absolute"
          src={dog}
          alt="Farm dog"
        />
      )}

      {state.inventory["Gnome"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 0.4}px`,
            right: `${GRID_WIDTH_PX * 42.5}px`,
            top: `${GRID_WIDTH_PX * 32}px`,
          }}
          className="absolute"
          src={gnome}
          alt="Gnome"
        />
      )}

      {state.inventory["Scarecrow"] && (
        <img
          style={{
            width: `${GRID_WIDTH_PX * 1.2}px`,
            left: `${GRID_WIDTH_PX * 38.9}px`,
            top: `${GRID_WIDTH_PX * 34}px`,
          }}
          className="absolute"
          src={scarecrow}
          alt="Scarecrow"
        />
      )}
    </>
  );
};
