/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React from "react";

//sunflower rock path edited to match event theme
import sunflowerRock from "assets/events/halloween/assets/nfts/sunflower_rock.png";
// new tombstone path
import sunflowerTombstone from "assets/events/halloween/assets/nfts/sunflower_tombstone.png";
import sunflowerStatue from "assets/nfts/sunflower_statue.png";
//potato statue path edited to match event theme
import potatoStatue from "assets/events/halloween/assets/nfts/potato_statue.png";
import christmasTree from "assets/nfts/christmas_tree.png";
import dog from "assets/nfts/farm_dog.gif";
import cat from "assets/nfts/farm_cat.gif";
import gnome from "assets/nfts/gnome.gif";
//fountain path edited to match event theme
import fountain from "assets/events/halloween/assets/nfts/fountain.gif";
import goldenBonsai from "assets/nfts/golden_bonsai.png";
//rooster path edited to match event theme
import rooster from "assets/events/halloween/assets/nfts/rooster.gif";
//undead chicken path edited to match event theme
import undeadChicken from "assets/events/halloween/assets/nfts/undead_chicken.gif";
import pottedSunflower from "assets/decorations/potted_sunflower.png";
// mysterious head path edited to match event theme
import mysteriousHead from "assets/events/halloween/assets/nfts/mysterious_head.png";
// homeless tent path edited to match event theme
import homelessTent from "assets/events/halloween/assets/nfts/homeless_tent.png";
// farmerBath path edited to match event theme
import farmerBath from "assets/events/halloween/assets/nfts/farmer_bath.png";
//Swimmer path edited to match event theme
import swimmer from "assets/events/halloween/assets/npcs/swimmer.gif";
import skullHand from "assets/decorations/skull_hand.png";
import easterBunny from "assets/events/halloween/assets/nfts/easter/easter_bunny.gif";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { Flags } from "features/game/components/Flags";
import { GameState } from "features/game/types/game";
import { fountainAudio, tombstoneAudio } from "lib/utils/sfx";
import { HalloweenSign } from "features/halloween/game/components/Sign";
import {
  Beavers,
  Moles,
  NyonStatue,
  Observatory,
  RockGolem,
  Scarecrows,
  WickerMan,
} from "./decorations/index";
import { WarSkulls, WarTombstone } from "./decorations/WarDecorations";

export const HalloweenDecorations: React.FC<{ state: GameState }> = ({
  state,
}) => (
  <div className="z-10 absolute left-0 right-0">
    <Flags state={state} />
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
        onClick={() => {
          //Checks if Audio is playing, if false, plays the sound
          if (!tombstoneAudio.playing()) {
            tombstoneAudio.play();
          }
        }}
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

    {/* DISABLED TRIVIA FOR EVENT <Trivia/>*/}

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
        onClick={() => {
          //Checks if fountainAudio is playing, if false, plays the sound
          if (!fountainAudio.playing()) {
            fountainAudio.play();
          }
        }}
        className="absolute hover:img-highlight cursor-pointer"
        src={fountain}
        alt="Fountain"
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

    <HalloweenSign id={state.id as number} inventory={state.inventory} />

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
    {!state.inventory["Farmer Bath"] && (
      <img
        src={swimmer}
        className="absolute"
        style={{
          width: `${GRID_WIDTH_PX * 0.85}px`,
          left: `${GRID_WIDTH_PX * 84.798}px`,
          top: `${GRID_WIDTH_PX * 44.859}px`,
          transform: "scaleX(-1)",
        }}
      />
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

    {state.inventory["Observatory"] && <Observatory />}

    {state.inventory["Mysterious Head"] && (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.85}px`,
          left: `${GRID_WIDTH_PX * 34.7}px`,
          top: `${GRID_WIDTH_PX * 40.2}px`,
        }}
        id={Section["Mysterious Head"]}
        className="absolute"
        src={mysteriousHead}
        alt="Mysterious Head"
      />
    )}

    {state.inventory["Golden Bonsai"] && (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.0952}px`,
          left: `${GRID_WIDTH_PX * 71.786}px`,
          top: `${GRID_WIDTH_PX * 37.95}px`,
        }}
        id={Section["Golden Bonsai"]}
        className="absolute"
        src={goldenBonsai}
        alt="Golden Bonsai"
      />
    )}

    {!state.inventory["Golden Bonsai"] && (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 0.75}px`,
          left: `${GRID_WIDTH_PX * 72.12}px`,
          top: `${GRID_WIDTH_PX * 37.81}px`,
        }}
        className="absolute"
        src={pottedSunflower}
        alt="Potted Sunflower"
      />
    )}

    {state.inventory["Wicker Man"] && <WickerMan />}

    {/* Moles */}

    <div
      className="flex justify-center absolute"
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        right: `${GRID_WIDTH_PX * 21.5}px`,
        top: `${GRID_WIDTH_PX * 50.4}px`,
      }}
      id={Section.Mole}
    >
      <Moles inventory={state.inventory} />
    </div>

    {state.inventory["Rock Golem"] && (
      <div
        className="flex justify-center absolute"
        style={{
          width: `${GRID_WIDTH_PX * 2.2}px`,
          left: `${GRID_WIDTH_PX * 87.6}px`,
          top: `${GRID_WIDTH_PX * 52.7}px`,
        }}
        id={Section["Rock Golem"]}
      >
        <RockGolem state={state} />
      </div>
    )}

    {state.inventory["Rooster"] && (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 0.71}px`,
          left: `${GRID_WIDTH_PX * 54.6}px`,
          top: `${GRID_WIDTH_PX * 15.7}px`,
        }}
        id={Section["Rooster"]}
        className="absolute"
        src={rooster}
        alt="Rooster"
      />
    )}

    {state.inventory["Undead Rooster"] && (
      <img
        style={{
          width: `${GRID_WIDTH_PX * 0.71}px`,
          left: `${GRID_WIDTH_PX * 51.6}px`,
          top: `${GRID_WIDTH_PX * 15.7}px`,
        }}
        id={Section["Rooster"]}
        className="absolute"
        src={undeadChicken}
        alt="Undead Rooster"
      />
    )}

    {state.inventory["War Skull"] && (
      <WarSkulls amount={state.inventory["War Skull"].toNumber()} />
    )}

    {state.inventory["War Tombstone"] && (
      <WarTombstone amount={state.inventory["War Tombstone"].toNumber()} />
    )}
    <img
      src={skullHand}
      style={{
        width: `${PIXEL_SCALE * 9}px`,
        position: "absolute",
        top: `${GRID_WIDTH_PX * 5}px`,
        left: `${GRID_WIDTH_PX * 44.3}px`,
      }}
    />
  </div>
);
